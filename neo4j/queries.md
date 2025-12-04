# 🎵 Consultas Neo4j - Guía Completa

Esta es una guía de consultas Cypher que puedes copiar y pegar directamente en el Neo4j Browser (http://localhost:7474).

## 📊 Consultas Básicas de Visualización

### 1. Ver todos los nodos y relaciones (limitado)
```cypher
MATCH (n)-[r]->(m)
RETURN n, r, m
LIMIT 50
```

### 2. Ver estructura completa de la base de datos
```cypher
CALL db.schema.visualization()
```

### 3. Contar todos los nodos por tipo
```cypher
MATCH (n)
RETURN labels(n)[0] as Tipo, count(n) as Cantidad
ORDER BY Cantidad DESC
```

### 4. Contar todas las relaciones por tipo
```cypher
MATCH ()-[r]->()
RETURN type(r) as TipoRelacion, count(r) as Cantidad
ORDER BY Cantidad DESC
```

---

## 🎤 Consultas de Artistas

### 5. Ver todos los artistas con sus géneros
```cypher
MATCH (a:Artista)-[:TIENE_GENERO]->(g:Genero)
RETURN a, g
```

### 6. Artistas y todas sus canciones
```cypher
MATCH (a:Artista)-[:CANTA]->(c:Cancion)
RETURN a.nombre as Artista, collect(c.titulo) as Canciones
ORDER BY Artista
```

### 7. Artistas con álbumes y cantidad de canciones por álbum
```cypher
MATCH (a:Artista)-[:LANZO_ALBUM]->(al:Album)
OPTIONAL MATCH (c:Cancion)-[:FORMA_PARTE_DE]->(al)
RETURN a.nombre as Artista, 
       al.titulo as Album, 
       al.año as Año,
       count(c) as NumCanciones
ORDER BY Año DESC
```

### 8. Encontrar artistas de un país específico
```cypher
MATCH (a:Artista)
WHERE a.pais = 'Reino Unido'
RETURN a
```

---

## 🎵 Consultas de Canciones

### 9. Canciones más escuchadas
```cypher
MATCH (u:Usuario)-[e:ESCUCHA]->(c:Cancion)
MATCH (a:Artista)-[:CANTA]->(c)
RETURN c.titulo as Cancion, 
       a.nombre as Artista,
       sum(e.veces) as TotalEscuchas
ORDER BY TotalEscuchas DESC
LIMIT 10
```

### 10. Canciones por género
```cypher
MATCH (c:Cancion)-[:TIENE_GENERO]->(g:Genero)
RETURN g.nombre as Genero, 
       collect(c.titulo) as Canciones,
       count(c) as Total
ORDER BY Total DESC
```

### 11. Canciones más largas
```cypher
MATCH (c:Cancion)
RETURN c.titulo as Cancion, c.duracion as Duracion
ORDER BY c.duracion DESC
LIMIT 10
```

### 12. Canciones de un álbum específico
```cypher
MATCH (c:Cancion)-[:FORMA_PARTE_DE]->(al:Album {titulo: 'Abbey Road'})
MATCH (a:Artista)-[:CANTA]->(c)
RETURN c.titulo as Cancion, 
       c.duracion as Duracion,
       a.nombre as Artista
ORDER BY c.titulo
```

---

## 💿 Consultas de Álbumes

### 13. Ver todos los álbumes con sus artistas
```cypher
MATCH (a:Artista)-[:LANZO_ALBUM]->(al:Album)
RETURN a, al
```

### 14. Álbumes por década
```cypher
MATCH (al:Album)
WITH al, (al.año / 10) * 10 as Decada
RETURN Decada, 
       collect(al.titulo) as Albums,
       count(al) as Total
ORDER BY Decada DESC
```

### 15. Álbum completo con todas sus canciones
```cypher
MATCH (al:Album {titulo: 'AM'})<-[:FORMA_PARTE_DE]-(c:Cancion)
MATCH (a:Artista)-[:LANZO_ALBUM]->(al)
MATCH (g:Genero)<-[:TIENE_GENERO]-(al)
RETURN a.nombre as Artista,
       al.titulo as Album,
       al.año as Año,
       g.nombre as Genero,
       collect(c.titulo) as Canciones
```

---

## 👥 Consultas de Usuarios

### 16. Ver usuarios con sus géneros preferidos
```cypher
MATCH (u:Usuario)-[:PREFIERE_GENERO]->(g:Genero)
RETURN u.nombre as Usuario, 
       collect(g.nombre) as GenerosPreferidos,
       u.edad as Edad
ORDER BY Usuario
```

### 17. Usuarios y sus playlists con canciones
```cypher
MATCH (u:Usuario)-[:CREO_PLAYLIST]->(p:Playlist)
OPTIONAL MATCH (c:Cancion)-[:GUARDADA_EN]->(p)
RETURN u.nombre as Usuario,
       p.nombre as Playlist,
       p.descripcion as Descripcion,
       count(c) as NumCanciones
ORDER BY Usuario, Playlist
```

### 18. Historial de escucha de un usuario
```cypher
MATCH (u:Usuario {nombre: 'Juan Pérez'})-[e:ESCUCHA]->(c:Cancion)
MATCH (a:Artista)-[:CANTA]->(c)
RETURN c.titulo as Cancion,
       a.nombre as Artista,
       e.veces as Veces,
       e.ultimaVez as UltimaVez
ORDER BY e.veces DESC
```

### 19. Usuarios que escuchan el mismo género
```cypher
MATCH (u1:Usuario)-[:PREFIERE_GENERO]->(g:Genero)<-[:PREFIERE_GENERO]-(u2:Usuario)
WHERE u1.nombre < u2.nombre
RETURN u1.nombre as Usuario1,
       u2.nombre as Usuario2,
       collect(g.nombre) as GenerosComunes
```

---

## 📝 Consultas de Playlists

### 20. Todas las playlists públicas
```cypher
MATCH (u:Usuario)-[:CREO_PLAYLIST]->(p:Playlist)
WHERE p.publica = true
MATCH (c:Cancion)-[:GUARDADA_EN]->(p)
MATCH (a:Artista)-[:CANTA]->(c)
RETURN p.nombre as Playlist,
       u.nombre as Creador,
       collect(DISTINCT a.nombre) as Artistas,
       count(c) as NumCanciones
ORDER BY NumCanciones DESC
```

### 21. Contenido completo de una playlist
```cypher
MATCH (p:Playlist {nombre: 'Rock Classics'})<-[:GUARDADA_EN]-(c:Cancion)
MATCH (a:Artista)-[:CANTA]->(c)
MATCH (u:Usuario)-[:CREO_PLAYLIST]->(p)
RETURN u.nombre as Creador,
       p.nombre as Playlist,
       c.titulo as Cancion,
       a.nombre as Artista,
       c.duracion as Duracion
ORDER BY c.titulo
```

---

## 🎯 Consultas Avanzadas y Recomendaciones

### 22. Recomendar canciones basadas en géneros preferidos
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

### 23. Canciones populares que un usuario no ha escuchado
```cypher
MATCH (target:Usuario {nombre: 'Juan Pérez'})
MATCH (other:Usuario)-[e:ESCUCHA]->(c:Cancion)
MATCH (a:Artista)-[:CANTA]->(c)
WHERE NOT (target)-[:ESCUCHA]->(c)
WITH c, a, sum(e.veces) as popularidad
RETURN c.titulo as Cancion,
       a.nombre as Artista,
       popularidad
ORDER BY popularidad DESC
LIMIT 10
```

### 24. Usuarios con gustos similares
```cypher
MATCH (u1:Usuario {nombre: 'Ana García'})-[:ESCUCHA]->(c:Cancion)<-[:ESCUCHA]-(u2:Usuario)
WHERE u1 <> u2
WITH u1, u2, count(c) as cancionesComunes
RETURN u2.nombre as UsuarioSimilar,
       cancionesComunes as CancionesEnComun
ORDER BY cancionesComunes DESC
LIMIT 5
```

### 25. Ruta entre un usuario y una canción
```cypher
MATCH path = shortestPath(
  (u:Usuario {nombre: 'Pedro Silva'})-[*]-(c:Cancion {titulo: 'Bohemian Rhapsody'})
)
RETURN path
```

### 26. Artistas más versátiles (componen en varios géneros)
```cypher
MATCH (a:Artista)-[:COMPUSO]->(c:Cancion)-[:TIENE_GENERO]->(g:Genero)
WITH a, collect(DISTINCT g.nombre) as generos
WHERE size(generos) > 1
RETURN a.nombre as Artista,
       generos as Generos,
       size(generos) as NumGeneros
ORDER BY NumGeneros DESC
```

### 27. Genero más popular por edad
```cypher
MATCH (u:Usuario)-[:PREFIERE_GENERO]->(g:Genero)
WITH (u.edad / 10) * 10 as RangoEdad, g.nombre as Genero, count(*) as preferencias
RETURN RangoEdad, 
       collect({genero: Genero, preferencias: preferencias}) as GenerosPreferidos
ORDER BY RangoEdad
```

### 28. Red social: Usuarios conectados por playlists compartidas
```cypher
MATCH (u1:Usuario)-[:CREO_PLAYLIST]->(p:Playlist)<-[:GUARDADA_EN]-(c:Cancion)
MATCH (c)-[:GUARDADA_EN]->(p2:Playlist)<-[:CREO_PLAYLIST]-(u2:Usuario)
WHERE u1 <> u2 AND p <> p2
RETURN u1.nombre as Usuario1,
       u2.nombre as Usuario2,
       count(DISTINCT c) as CancionesComunes
ORDER BY CancionesComunes DESC
```

---

## 🔍 Consultas de Análisis

### 29. Estadísticas generales
```cypher
MATCH (a:Artista) WITH count(a) as totalArtistas
MATCH (c:Cancion) WITH totalArtistas, count(c) as totalCanciones
MATCH (al:Album) WITH totalArtistas, totalCanciones, count(al) as totalAlbumes
MATCH (u:Usuario) WITH totalArtistas, totalCanciones, totalAlbumes, count(u) as totalUsuarios
MATCH (p:Playlist) WITH totalArtistas, totalCanciones, totalAlbumes, totalUsuarios, count(p) as totalPlaylists
MATCH ()-[e:ESCUCHA]->()
RETURN totalArtistas, 
       totalCanciones, 
       totalAlbumes, 
       totalUsuarios, 
       totalPlaylists,
       sum(e.veces) as totalEscuchas
```

### 30. Top 5 álbumes por reproducciones totales
```cypher
MATCH (al:Album)<-[:FORMA_PARTE_DE]-(c:Cancion)<-[e:ESCUCHA]-()
MATCH (a:Artista)-[:LANZO_ALBUM]->(al)
RETURN al.titulo as Album,
       a.nombre as Artista,
       sum(e.veces) as TotalReproducciones
ORDER BY TotalReproducciones DESC
LIMIT 5
```

---

## 🛠️ Consultas de Utilidad

### 31. Buscar nodos por propiedad
```cypher
MATCH (n)
WHERE n.nombre =~ '(?i).*beatles.*'
RETURN n
```

### 32. Ver todas las propiedades de un nodo específico
```cypher
MATCH (a:Artista {nombre: 'Queen'})
RETURN properties(a)
```

### 33. Eliminar un nodo específico (¡CUIDADO!)
```cypher
// NO ejecutar a menos que estés seguro
MATCH (p:Playlist {nombre: 'NombrePlaylist'})
DETACH DELETE p
```

### 34. Actualizar una propiedad
```cypher
MATCH (u:Usuario {nombre: 'Juan Pérez'})
SET u.edad = 29
RETURN u
```

---

## 💡 Tips para usar Neo4j Browser

1. **Expandir nodos**: Haz doble clic en un nodo para ver sus relaciones
2. **Filtrar vista**: Haz clic derecho en un nodo/relación para opciones
3. **Exportar**: Usa el botón de descarga para exportar resultados
4. **Historial**: Usa las flechas arriba/abajo para navegar consultas anteriores
5. **Favoritos**: Haz clic en la estrella para guardar consultas frecuentes

---

## 🎨 Personalización de Visualización

### Cambiar colores de nodos en el Browser:
1. Haz clic en el tipo de nodo en la parte inferior
2. Selecciona un color diferente
3. Los cambios se guardan automáticamente

---

¡Copia y pega estas consultas en Neo4j Browser para explorar tu base de datos musical! 🎵