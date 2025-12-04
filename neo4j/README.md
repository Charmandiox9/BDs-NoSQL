# 🎵 Neo4j Music Database Demo

Demostración completa de una base de datos de grafos Neo4j con relaciones musicales usando Docker y JavaScript.

## 🚀 Características

- **Nodos**: 8 Artistas, 24 Canciones, 8 Álbumes, 6 Géneros, 5 Usuarios, 5 Playlists
- **Relaciones**: CANTA, COMPUSO, LANZO_ALBUM, TIENE_GENERO, FORMA_PARTE_DE, ESCUCHA, CREO_PLAYLIST, GUARDADA_EN, PREFIERE_GENERO
- **Interfaz**: Neo4j Browser nativo (puerto 7474)
- **+30 consultas** predefinidas listas para usar

## 📋 Requisitos

- Docker y Docker Compose
- Node.js 16+ (para poblar la base de datos)
- Navegador web moderno

# 🎵 Neo4j Music Database Demo

Demostración completa de una base de datos de grafos Neo4j con relaciones musicales usando Docker y JavaScript.

## 🚀 Características

- **Nodos**: 8 Artistas, 24 Canciones, 8 Álbumes, 6 Géneros, 5 Usuarios, 5 Playlists
- **Relaciones**: CANTA, COMPUSO, LANZO_ALBUM, TIENE_GENERO, FORMA_PARTE_DE, ESCUCHA, CREO_PLAYLIST, GUARDADA_EN, PREFIERE_GENERO
- **Interfaz**: Neo4j Browser nativo (puerto 7474)
- **+30 consultas** predefinidas listas para usar
- **Dockerizado completamente** - Neo4j + seed automático

## 📋 Requisitos

- Docker y Docker Compose
- Navegador web moderno

## 🛠️ Instalación Rápida

### Opción 1: Solo Neo4j (poblar manualmente con Node.js)

```bash
# Iniciar Neo4j
docker-compose up -d

# Esperar 30-60 segundos, luego poblar
npm install
npm run seed
```

### Opción 2: Todo automatizado (Neo4j + Seed automático)

```bash
# Iniciar Neo4j y poblar automáticamente
docker-compose --profile seed up -d

# Esperar que termine el seed (verás logs)
docker-compose logs -f seed
```

### Opción 3: Build manual del contenedor de seed

```bash
# Iniciar Neo4j
docker-compose up -d neo4j

# Esperar 60 segundos, luego ejecutar seed
docker-compose --profile seed up seed
```

Verás algo como:
```
🚀 Iniciando población de base de datos...

✅ Base de datos limpiada
✅ Géneros creados
✅ Artistas creados
✅ Álbumes creados
✅ Canciones creadas
✅ Usuarios creados
✅ Playlists creadas
✅ Relaciones de escucha creadas

🎉 ¡Base de datos poblada exitosamente!

📊 Estadísticas de la base de datos:
=====================================
  Cancion         : 24
  Artista         : 8
  Album           : 8
  Genero          : 6
  Usuario         : 5
  Playlist        : 5

🌐 Accede a Neo4j Browser en: http://localhost:7474
   Usuario: neo4j
   Contraseña: password123
```

### Paso 3: Explorar en Neo4j Browser

1. Abre tu navegador y ve a: **http://localhost:7474**
2. Conecta con:
   - **Usuario**: `neo4j`
   - **Contraseña**: `password123`
3. ¡Listo! Ya puedes explorar tu base de datos

---

## 📁 Estructura del Proyecto

```
neo4j/
├── .dockerignore          # Archivos ignorados por Docker
├── .gitignore            # Archivos ignorados por Git
├── Dockerfile            # Contenedor para seed automático
├── docker-compose.yml    # Orquestación de servicios
├── package.json          # Dependencias de Node.js
├── seed-database.js      # Script de población de datos
├── queries.md            # Guía con +30 consultas Cypher
└── README.md            # Este archivo
```

---

## 🎯 Primeros Pasos en Neo4j Browser

### Consulta de Inicio - Ver Todo
Copia y pega esta consulta en el Neo4j Browser:

```cypher
MATCH (n)-[r]->(m)
RETURN n, r, m
LIMIT 50
```

### Ver Estructura de la Base de Datos
```cypher
CALL db.schema.visualization()
```

### Top Canciones Más Escuchadas
```cypher
MATCH (u:Usuario)-[e:ESCUCHA]->(c:Cancion)
MATCH (a:Artista)-[:CANTA]->(c)
RETURN c.titulo as Cancion, 
       a.nombre as Artista,
       sum(e.veces) as TotalEscuchas
ORDER BY TotalEscuchas DESC
LIMIT 10
```

## 📊 Datos Incluidos

### Artistas
- The Beatles (Rock)
- Adele (Pop)
- Miles Davis (Jazz)
- Arctic Monkeys (Indie)
- Daft Punk (Electronic)
- Kendrick Lamar (Hip Hop)
- Queen (Rock)
- Billie Eilish (Pop)

### Álbumes Famosos
- Abbey Road (1969)
- Kind of Blue (1959)
- Bohemian Rhapsody (en A Night at the Opera, 1975)
- Random Access Memories (2013)
- DAMN. (2017)
- Y más...

### Usuarios con Preferencias
- Juan Pérez (28 años, prefiere Rock e Indie)
- María López (24 años, prefiere Pop y Electronic)
- Carlos Ruiz (35 años, prefiere Jazz)
- Ana García (22 años, prefiere Pop y Hip Hop)
- Pedro Silva (31 años, prefiere Rock y Electronic)

## 📚 Guía de Consultas

He creado el archivo **`queries.md`** con más de 30 consultas listas para usar, organizadas en categorías:

- 📊 Consultas Básicas de Visualización
- 🎤 Consultas de Artistas
- 🎵 Consultas de Canciones
- 💿 Consultas de Álbumes
- 👥 Consultas de Usuarios
- 📝 Consultas de Playlists
- 🎯 Consultas Avanzadas y Recomendaciones
- 🔍 Consultas de Análisis
- 🛠️ Consultas de Utilidad

### Ejemplos Destacados

**Recomendar canciones a un usuario:**
```cypher
MATCH (u:Usuario {nombre: 'María López'})-[:PREFIERE_GENERO]->(g:Genero)
MATCH (c:Cancion)-[:TIENE_GENERO]->(g)
MATCH (a:Artista)-[:CANTA]->(c)
WHERE NOT (u)-[:ESCUCHA]->(c)
RETURN c.titulo as CancionRecomendada,
       a.nombre as Artista,
       g.nombre as Genero
LIMIT 10
```

**Encontrar usuarios con gustos similares:**
```cypher
MATCH (u1:Usuario {nombre: 'Ana García'})-[:ESCUCHA]->(c:Cancion)<-[:ESCUCHA]-(u2:Usuario)
WHERE u1 <> u2
WITH u1, u2, count(c) as cancionesComunes
RETURN u2.nombre as UsuarioSimilar,
       cancionesComunes as CancionesEnComun
ORDER BY cancionesComunes DESC
LIMIT 5
```

## 🗂️ Estructura de la Base de Datos

### Tipos de Nodos

| Nodo | Propiedades |
|------|-------------|
| **Artista** | nombre, pais, añoInicio |
| **Cancion** | titulo, duracion |
| **Album** | titulo, año, duracion |
| **Genero** | nombre, descripcion |
| **Usuario** | nombre, email, edad |
| **Playlist** | nombre, descripcion, publica |

### Tipos de Relaciones

| Relación | Desde | Hacia | Propiedades |
|----------|-------|-------|-------------|
| **CANTA** | Artista | Cancion | - |
| **COMPUSO** | Artista | Cancion | - |
| **LANZO_ALBUM** | Artista | Album | - |
| **FORMA_PARTE_DE** | Cancion | Album | - |
| **TIENE_GENERO** | Artista/Cancion/Album | Genero | - |
| **ESCUCHA** | Usuario | Cancion | veces, ultimaVez |
| **CREO_PLAYLIST** | Usuario | Playlist | - |
| **GUARDADA_EN** | Cancion | Playlist | - |
| **PREFIERE_GENERO** | Usuario | Genero | - |

## 💡 Tips para Neo4j Browser

### Navegación
- **Doble clic** en un nodo para expandir sus relaciones
- **Clic derecho** para opciones de filtrado y estilo
- **Arrastrar** nodos para reorganizar la visualización
- **Zoom** con la rueda del mouse o gestos táctiles

### Personalización Visual
1. Haz clic en el tipo de nodo (abajo de la visualización)
2. Cambia colores, tamaños y propiedades mostradas
3. Los cambios se guardan automáticamente

### Productividad
- **Historial**: Usa ↑ ↓ para navegar consultas anteriores
- **Favoritos**: Haz clic en ⭐ para guardar consultas
- **Exportar**: Usa el botón de descarga para exportar resultados
- **Pantalla completa**: Maximiza la visualización para grafos grandes

## 🔧 Personalización

### Agregar Más Datos

Edita `seed-database.js` y modifica o agrega nuevas secciones:

```javascript
// Agregar un nuevo artista
await session.run(`
  MATCH (rock:Genero {nombre: 'Rock'})
  CREATE (nuevo:Artista {
    nombre: 'Led Zeppelin', 
    pais: 'Reino Unido', 
    añoInicio: 1968
  })-[:TIENE_GENERO]->(rock)
`);
```

Luego ejecuta: `npm run seed`

### Crear Consultas Personalizadas

Simplemente escribe tus propias consultas Cypher en Neo4j Browser. Ejemplos:

```cypher
// Encontrar artistas que empezaron en los 60s
MATCH (a:Artista)
WHERE a.añoInicio >= 1960 AND a.añoInicio < 1970
RETURN a

// Canciones de más de 5 minutos
MATCH (c:Cancion)
WHERE c.duracion > 5.0
MATCH (a:Artista)-[:CANTA]->(c)
RETURN c.titulo, a.nombre, c.duracion
ORDER BY c.duracion DESC
```

## 🛑 Gestión del Contenedor

### Ver Estado de los Servicios
```bash
docker-compose ps
```

### Ver Logs
```bash
# Logs de Neo4j
docker-compose logs neo4j

# Logs del seed (si usaste --profile seed)
docker-compose logs seed

# Seguir logs en tiempo real
docker-compose logs -f
```

### Reiniciar Neo4j
```bash
docker-compose restart neo4j
```

### Re-poblar la Base de Datos
```bash
# Opción 1: Con Docker
docker-compose --profile seed up seed

# Opción 2: Con Node.js local
npm run seed
```

### Detener Todo
```bash
docker-compose down
```

### Detener y Eliminar Datos (⚠️ Esto borra todo)
```bash
docker-compose down -v
```

### Limpiar y Empezar de Cero
```bash
# Eliminar todo (contenedores, volúmenes, imágenes)
docker-compose down -v --rmi local

# Reconstruir y poblar
docker-compose --profile seed up -d --build
```

### Backup de Datos
```bash
# Exportar toda la base de datos
docker exec neo4j-music-demo neo4j-admin database dump neo4j --to-path=/tmp
docker cp neo4j-music-demo:/tmp/neo4j.dump ./backup/

# Restaurar desde backup
docker cp ./backup/neo4j.dump neo4j-music-demo:/tmp/
docker exec neo4j-music-demo neo4j-admin database load neo4j --from-path=/tmp
```

## 🐛 Troubleshooting

### Neo4j no inicia
```bash
# Ver logs detallados
docker-compose logs -f neo4j

# Verificar que los puertos no están ocupados
lsof -i :7474
lsof -i :7687

# Reiniciar todo
docker-compose down
docker-compose up -d
```

### Error "Connection refused" al poblar datos
- **Solución**: Espera más tiempo (1-2 minutos) después de `docker-compose up -d`
- Neo4j tarda en inicializar completamente

### Error de autenticación
- Verifica que usas `neo4j/password123`
- Si cambiaste la contraseña, actualiza también el `seed-database.js`

### La visualización no carga bien
- Usa `LIMIT` en tus consultas para grafos grandes
- Ejemplo: `MATCH (n)-[r]->(m) RETURN n,r,m LIMIT 25`

### Quiero cambiar la contraseña
Edita `docker-compose.yml`:
```yaml
environment:
  - NEO4J_AUTH=neo4j/tu_nueva_contraseña
```

Luego:
```bash
docker-compose down -v
docker-compose up -d
npm run seed  # Actualiza también seed-database.js
```

## 📖 Recursos de Aprendizaje

- [Neo4j Documentation](https://neo4j.com/docs/)
- [Cypher Query Language](https://neo4j.com/docs/cypher-manual/current/)
- [Neo4j Graph Academy](https://graphacademy.neo4j.com/) (cursos gratuitos)
- [Neo4j JavaScript Driver](https://neo4j.com/docs/api/javascript-driver/current/)

## 🎓 Casos de Uso Educativos

Este proyecto es perfecto para:
- Aprender bases de datos de grafos
- Entender el lenguaje Cypher
- Practicar consultas de recomendación
- Visualizar relaciones complejas
- Demos y presentaciones
- Prototipos de sistemas de música

## 🤝 Contribuir

¿Quieres agregar más datos o consultas? Simplemente:
1. Modifica `seed-database.js` para más datos
2. Agrega consultas útiles a `queries.md`
3. Comparte tus mejores visualizaciones

---

**¡Disfruta explorando las relaciones en tu base de datos de grafos musical!** 🎉

**Acceso rápido**: http://localhost:7474 (neo4j/password123)