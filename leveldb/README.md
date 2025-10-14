# LevelDB + Node.js + Docker
Un ejemplo práctico y completo que demuestra cómo usar LevelDB con Node.js y Docker para crear una aplicación web funcional.

## Estructura del Proyecto
```
leveldb/
├── docker-compose.yml      # Configuración de Docker Compose
├── Dockerfile             # Imagen de la aplicación
├── package.json           # Dependencias de Node.js
├── server.js             # Servidor principal con API
├── public/
│   └── styles/ 
│       └── style.css
│   └── scripts/ 
│       └── main.js  
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

---

## Funcionalidades
### API REST
- `GET /api/entries` - Obtener todas las entradas
- `GET /api/entry/:key` - Obtener una entrada específica
- `GET /api/stats` - Obtener estadísticas
- `POST /api/entry/:key` - Crear/Actualizar una entrada
- `DELETE /api/entry/:key` - Eliminar entrada

### Interfaz Web
- Crear, editar y eliminar tareas
- Dashboard con estadísticas en tiempo real
- Interfaz moderna y responsive
- Actualizaciones en tiempo real

---

