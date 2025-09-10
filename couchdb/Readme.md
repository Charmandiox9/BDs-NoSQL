# CoudBD + Node.js + Docker - Gestor de Tareas
Un ejemplo práctico y completo que demuestra cómo usar CouchDB con Node.js y Docker para crear una aplicación web funcional.

## Estructura del Proyecto
```
couchdb/
├── docker-compose.yml      # Configuración de Docker Compose
├── Dockerfile             # Imagen de la aplicación
├── package.json           # Dependencias de Node.js
├── server.js             # Servidor principal con API
├── public/
│   └── index.html        # Interfaz web
└── Readme.md             # Este archivo
```

---

## Inicio Rápido

### Prerrequisitos
- Docker y Docker Compose instalados
- Puerto 3000 y 5984 disponibles

1. Clonar/crear proyecto
```
mkdir couchdb-example
cd couchdb-example
# Copiar todos los archivos del ejemplo
```
2. Levantar los servicios
```
docker-compose up --build
```
3. Acceder a la aplicación
- Aplicación web: http://localhost:3000
- CouchDB Fauxton (admin): http://localhost:5984/_utils
  - Usuario: `admin`
  - Contraseña: `password123`

---

## Funcionalidades
### API REST
- `GET /api/tasks` - Obtener todas las tareas
- `GET /api/tasks/:id` - Obtener una tarea específica
- `POST /api/tasks` - Crear nueva tarea
- `PUT /api/tasks/:id` - Actualizar tarea
- `DELETE /api/tasks/:id` - Eliminar tarea

### Interfaz Web
- Crear, editar y eliminar tareas
- Dashboard con estadísticas en tiempo real
- Interfaz moderna y responsive
- Actualizaciones en tiempo real
- Sistema de prioridades (alta, media, baja)
- Marcar tareas como completadas

---

## Desarrollo Local (sin Docker)
1. Instalar CouchDB localmente
```
# Ubuntu/Debian
sudo apt-get install couchdb

# macOS con Homebrew
brew install couchdb

# Windows: Descargar desde http://couchdb.apache.org/
```

2. Configurar CouchDB
```
# Iniciar CouchDB
sudo service couchdb start

# Configurar usuario admin en http://localhost:5984/_utils
```

3. Ejecutar aplicación
```
npm install
npm start
```

---

## Estructura de Datos

### Documento de Tarea
```
{
  "_id": "task_1234567890",
  "_rev": "1-abc123...",
  "title": "Título de la tarea",
  "description": "Descripción opcional",
  "completed": false,
  "priority": "high|medium|low",
  "created_at": "2025-09-09T10:30:00.000Z",
  "updated_at": "2025-09-09T11:45:00.000Z"
}
```

---

## Configuración

### Variables de Entorno
```
PORT=3000
COUCHDB_URL=http://localhost:5984
COUCHDB_USER=admin
COUCHDB_PASSWORD=password123
```

### Docker Compose - Servicios

#### CouchDB
- Imagen: `couchdb:3.3`
- Puerto: `5984:5984`
- Volúmenes: Datos y configuración persistentes
- Credenciales: admins/password123

#### Aplicación Node.js
- Puerto: `3000:3000`
- Dependencias: Express, nano, cors
- Auto-reload: Volumen montado para desarrollo

---

## Conceptos CouchDB Demostrados
### 1. Características Principales
- Schema-free: No necesitas definir estructura
- REST API: Todo a través de HTTP
- JSON nativo: Documentos en formato JSON
- Revisiones: Control de versiones automático (_rev)

### 2. Operaciones CRUD
```
// Crear documento
await db.insert(document);

// Leer documento
await db.get(id);

// Listar documentos
await db.list({ include_docs: true });

// Actualizar documento (necesita _rev)
await db.insert({ ...document, _rev: existing._rev });

// Eliminar documento
await db.destroy(id, rev);
```

### 3. Inicialización de Base de Datos
```
// Crear base de datos si no existe
await couch.db.create('database_name');

// Obtener referencia
const db = couch.db.use('database_name');

// Insertar datos iniciales
await db.bulk({ docs: sampleData });
```