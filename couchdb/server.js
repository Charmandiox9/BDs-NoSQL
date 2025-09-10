const express = require('express');
const nano = require('nano');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configuración CouchDB
const COUCHDB_URL = process.env.COUCHDB_URL || 'http://localhost:5984';
const COUCHDB_USER = process.env.COUCHDB_USER || 'admin';
const COUCHDB_PASSWORD = process.env.COUCHDB_PASSWORD || 'password123';

const couch = nano(`http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@${COUCHDB_URL.replace('http://', '')}`);

// Inicializar base de datos
async function initDatabase() {
  try {
    const dbName = 'tasks';
    
    // Esperar a que CouchDB esté disponible
    console.log('Conectando a CouchDB...');
    let retries = 20;
    while (retries > 0) {
      try {
        console.log(`Intento de conexión ${21 - retries}/20...`);
        await couch.db.list();
        console.log('✅ Conexión a CouchDB establecida');
        break;
      } catch (error) {
        console.log(`❌ Error de conexión: ${error.message}`);
        retries--;
        if (retries === 0) {
          console.error('💥 No se pudo conectar a CouchDB después de 20 intentos');
          throw new Error('No se pudo conectar a CouchDB');
        }
        console.log(`⏳ Esperando 3 segundos antes del siguiente intento...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
    
    // Verificar si la base de datos existe
    try {
      await couch.db.get(dbName);
      console.log(`Base de datos '${dbName}' ya existe`);
    } catch (error) {
      if (error.statusCode === 404) {
        // Crear la base de datos si no existe
        await couch.db.create(dbName);
        console.log(`Base de datos '${dbName}' creada exitosamente`);
      } else {
        throw error;
      }
    }
    
    // Obtener referencia a la base de datos
    const db = couch.db.use(dbName);
    
    // Insertar datos de ejemplo si la DB está vacía
    try {
      const info = await db.info();
      if (info.doc_count === 0) {
        const sampleTasks = [
          {
            _id: 'task_1',
            title: 'Aprender CouchDB',
            description: 'Estudiar los conceptos básicos de CouchDB y su uso con Node.js',
            completed: false,
            created_at: new Date().toISOString(),
            priority: 'high'
          },
          {
            _id: 'task_2',
            title: 'Configurar Docker',
            description: 'Configurar el entorno de desarrollo con Docker Compose',
            completed: true,
            created_at: new Date().toISOString(),
            priority: 'medium'
          },
          {
            _id: 'task_3',
            title: 'Crear API REST',
            description: 'Desarrollar endpoints para CRUD de tareas',
            completed: false,
            created_at: new Date().toISOString(),
            priority: 'high'
          }
        ];
        
        await db.bulk({ docs: sampleTasks });
        console.log('Datos de ejemplo insertados');
      }
    } catch (error) {
      console.error('Error insertando datos de ejemplo:', error);
    }
    
    return db;
  } catch (error) {
    console.error('Error inicializando base de datos:', error);
    process.exit(1);
  }
}

// Variables globales
let db;

// Rutas API
app.get('/api/tasks', async (req, res) => {
  try {
    const result = await db.list({ include_docs: true });
    const tasks = result.rows.map(row => row.doc);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo tareas' });
  }
});

app.get('/api/tasks/:id', async (req, res) => {
  try {
    const task = await db.get(req.params.id);
    res.json(task);
  } catch (error) {
    if (error.statusCode === 404) {
      res.status(404).json({ error: 'Tarea no encontrada' });
    } else {
      res.status(500).json({ error: 'Error obteniendo tarea' });
    }
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, priority = 'medium' } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'El título es requerido' });
    }
    
    const task = {
      _id: `task_${Date.now()}`,
      title,
      description: description || '',
      completed: false,
      created_at: new Date().toISOString(),
      priority
    };
    
    const result = await db.insert(task);
    res.status(201).json({ ...task, _rev: result.rev });
  } catch (error) {
    res.status(500).json({ error: 'Error creando tarea' });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const existingTask = await db.get(req.params.id);
    
    const updatedTask = {
      ...existingTask,
      ...req.body,
      updated_at: new Date().toISOString()
    };
    
    const result = await db.insert(updatedTask);
    res.json({ ...updatedTask, _rev: result.rev });
  } catch (error) {
    if (error.statusCode === 404) {
      res.status(404).json({ error: 'Tarea no encontrada' });
    } else {
      res.status(500).json({ error: 'Error actualizando tarea' });
    }
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const task = await db.get(req.params.id);
    await db.destroy(task._id, task._rev);
    res.json({ message: 'Tarea eliminada exitosamente' });
  } catch (error) {
    if (error.statusCode === 404) {
      res.status(404).json({ error: 'Tarea no encontrada' });
    } else {
      res.status(500).json({ error: 'Error eliminando tarea' });
    }
  }
});

// Ruta para servir la página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Inicializar servidor
async function startServer() {
  try {
    db = await initDatabase();
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
      console.log(`CouchDB Fauxton disponible en ${COUCHDB_URL}/_utils`);
    });
  } catch (error) {
    console.error('Error iniciando servidor:', error);
    process.exit(1);
  }
}

startServer();