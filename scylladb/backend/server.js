// server.js
const express = require('express');
const cassandra = require('cassandra-driver');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración del cliente de ScyllaDB (SIN especificar keyspace aún)
const client = new cassandra.Client({
  contactPoints: [process.env.SCYLLA_HOSTS || 'scylla'],
  localDataCenter: 'datacenter1',
  protocolOptions: {
    port: 9042
  },
  socketOptions: {
    connectTimeout: 30000,
    readTimeout: 30000
  }
});

// Inicializar la base de datos con reintentos
async function initDatabase() {
  const maxRetries = 10;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      console.log(`🔄 Intentando conectar a ScyllaDB (intento ${retries + 1}/${maxRetries})...`);
      
      // Conectar al cliente (sin keyspace específico primero)
      await client.connect();
      console.log('✅ Conectado a ScyllaDB');
      
      // PRIMERO: Crear keyspace
      console.log('📦 Creando keyspace crud_demo...');
      await client.execute(`
        CREATE KEYSPACE IF NOT EXISTS crud_demo
        WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1}
      `);
      console.log('✅ Keyspace creado');

      // SEGUNDO: Usar el keyspace
      console.log('🔄 Seleccionando keyspace...');
      await client.execute('USE crud_demo');
      console.log('✅ Keyspace seleccionado');

      // TERCERO: Crear tabla de usuarios
      console.log('📋 Creando tabla users...');
      await client.execute(`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY,
          name TEXT,
          email TEXT,
          age INT,
          created_at TIMESTAMP
        )
      `);
      console.log('✅ Tabla users creada');

      console.log('🎉 Base de datos inicializada correctamente');
      return;
    } catch (error) {
      retries++;
      console.error(`❌ Error al conectar (intento ${retries}/${maxRetries}):`, error.message);
      
      if (retries < maxRetries) {
        console.log('⏳ Esperando 5 segundos antes de reintentar...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      } else {
        console.error('❌ No se pudo conectar a ScyllaDB después de múltiples intentos');
        process.exit(1);
      }
    }
  }
}

// CREATE - Crear un nuevo usuario
app.post('/api/users', async (req, res) => {
  try {
    const { name, email, age } = req.body;
    const id = cassandra.types.Uuid.random();
    const created_at = new Date();

    const query = 'INSERT INTO crud_demo.users (id, name, email, age, created_at) VALUES (?, ?, ?, ?, ?)';
    await client.execute(query, [id, name, email, age, created_at], { prepare: true });

    res.status(201).json({
      success: true,
      user: { id: id.toString(), name, email, age, created_at }
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// READ - Obtener todos los usuarios
app.get('/api/users', async (req, res) => {
  try {
    const result = await client.execute('SELECT * FROM crud_demo.users');
    const users = result.rows.map(row => ({
      id: row.id.toString(),
      name: row.name,
      email: row.email,
      age: row.age,
      created_at: row.created_at
    }));

    res.json({ success: true, users });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// READ - Obtener un usuario por ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM crud_demo.users WHERE id = ?';
    const result = await client.execute(query, [cassandra.types.Uuid.fromString(id)], { prepare: true });

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
    }

    const user = result.rows[0];
    res.json({
      success: true,
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        age: user.age,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// UPDATE - Actualizar un usuario
app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, age } = req.body;

    const query = 'UPDATE crud_demo.users SET name = ?, email = ?, age = ? WHERE id = ?';
    await client.execute(
      query,
      [name, email, age, cassandra.types.Uuid.fromString(id)],
      { prepare: true }
    );

    res.json({ success: true, message: 'Usuario actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE - Eliminar un usuario
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM crud_demo.users WHERE id = ?';
    await client.execute(query, [cassandra.types.Uuid.fromString(id)], { prepare: true });

    res.json({ success: true, message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await initDatabase();
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});