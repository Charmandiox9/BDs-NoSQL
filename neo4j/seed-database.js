const neo4j = require('neo4j-driver');

// Configuración desde variables de entorno o valores por defecto
const NEO4J_URI = process.env.NEO4J_URI || 'bolt://localhost:7687';
const NEO4J_USER = process.env.NEO4J_USER || 'neo4j';
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD || 'password123';

const driver = neo4j.driver(
  NEO4J_URI,
  neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD)
);

console.log(`🔌 Conectando a Neo4j en: ${NEO4J_URI}`);

async function seedDatabase() {
  const session = driver.session();

  try {
    console.log('🚀 Iniciando población de base de datos...\n');

    // Limpiar base de datos
    await session.run('MATCH (n) DETACH DELETE n');
    console.log('✅ Base de datos limpiada');

    // Crear Géneros
    await session.run(`
      CREATE 
        (rock:Genero {nombre: 'Rock', descripcion: 'Música rock'}),
        (pop:Genero {nombre: 'Pop', descripcion: 'Música pop'}),
        (jazz:Genero {nombre: 'Jazz', descripcion: 'Música jazz'}),
        (indie:Genero {nombre: 'Indie', descripcion: 'Música independiente'}),
        (electronic:Genero {nombre: 'Electronic', descripcion: 'Música electrónica'}),
        (hiphop:Genero {nombre: 'Hip Hop', descripcion: 'Hip hop y rap'})
    `);
    console.log('✅ Géneros creados');

    // Crear Artistas
    await session.run(`
      MATCH (rock:Genero {nombre: 'Rock'}), (pop:Genero {nombre: 'Pop'}), 
            (jazz:Genero {nombre: 'Jazz'}), (indie:Genero {nombre: 'Indie'}),
            (electronic:Genero {nombre: 'Electronic'}), (hiphop:Genero {nombre: 'Hip Hop'})
      CREATE 
        (a1:Artista {nombre: 'The Beatles', pais: 'Reino Unido', añoInicio: 1960}),
        (a2:Artista {nombre: 'Adele', pais: 'Reino Unido', añoInicio: 2006}),
        (a3:Artista {nombre: 'Miles Davis', pais: 'Estados Unidos', añoInicio: 1945}),
        (a4:Artista {nombre: 'Arctic Monkeys', pais: 'Reino Unido', añoInicio: 2002}),
        (a5:Artista {nombre: 'Daft Punk', pais: 'Francia', añoInicio: 1993}),
        (a6:Artista {nombre: 'Kendrick Lamar', pais: 'Estados Unidos', añoInicio: 2003}),
        (a7:Artista {nombre: 'Queen', pais: 'Reino Unido', añoInicio: 1970}),
        (a8:Artista {nombre: 'Billie Eilish', pais: 'Estados Unidos', añoInicio: 2015}),
        (a1)-[:TIENE_GENERO]->(rock),
        (a2)-[:TIENE_GENERO]->(pop),
        (a3)-[:TIENE_GENERO]->(jazz),
        (a4)-[:TIENE_GENERO]->(indie),
        (a5)-[:TIENE_GENERO]->(electronic),
        (a6)-[:TIENE_GENERO]->(hiphop),
        (a7)-[:TIENE_GENERO]->(rock),
        (a8)-[:TIENE_GENERO]->(pop)
    `);
    console.log('✅ Artistas creados');

    // Crear Álbumes
    await session.run(`
      MATCH (rock:Genero {nombre: 'Rock'}), (pop:Genero {nombre: 'Pop'}),
            (jazz:Genero {nombre: 'Jazz'}), (indie:Genero {nombre: 'Indie'}),
            (electronic:Genero {nombre: 'Electronic'}), (hiphop:Genero {nombre: 'Hip Hop'}),
            (a1:Artista {nombre: 'The Beatles'}), (a2:Artista {nombre: 'Adele'}),
            (a3:Artista {nombre: 'Miles Davis'}), (a4:Artista {nombre: 'Arctic Monkeys'}),
            (a5:Artista {nombre: 'Daft Punk'}), (a6:Artista {nombre: 'Kendrick Lamar'}),
            (a7:Artista {nombre: 'Queen'}), (a8:Artista {nombre: 'Billie Eilish'})
      CREATE
        (album1:Album {titulo: 'Abbey Road', año: 1969, duracion: 47}),
        (album2:Album {titulo: '21', año: 2011, duracion: 48}),
        (album3:Album {titulo: 'Kind of Blue', año: 1959, duracion: 46}),
        (album4:Album {titulo: 'AM', año: 2013, duracion: 42}),
        (album5:Album {titulo: 'Random Access Memories', año: 2013, duracion: 74}),
        (album6:Album {titulo: 'DAMN.', año: 2017, duracion: 55}),
        (album7:Album {titulo: 'A Night at the Opera', año: 1975, duracion: 43}),
        (album8:Album {titulo: 'When We All Fall Asleep', año: 2019, duracion: 42}),
        (album1)-[:TIENE_GENERO]->(rock),
        (album2)-[:TIENE_GENERO]->(pop),
        (album3)-[:TIENE_GENERO]->(jazz),
        (album4)-[:TIENE_GENERO]->(indie),
        (album5)-[:TIENE_GENERO]->(electronic),
        (album6)-[:TIENE_GENERO]->(hiphop),
        (album7)-[:TIENE_GENERO]->(rock),
        (album8)-[:TIENE_GENERO]->(pop),
        (a1)-[:LANZO_ALBUM]->(album1),
        (a2)-[:LANZO_ALBUM]->(album2),
        (a3)-[:LANZO_ALBUM]->(album3),
        (a4)-[:LANZO_ALBUM]->(album4),
        (a5)-[:LANZO_ALBUM]->(album5),
        (a6)-[:LANZO_ALBUM]->(album6),
        (a7)-[:LANZO_ALBUM]->(album7),
        (a8)-[:LANZO_ALBUM]->(album8)
    `);
    console.log('✅ Álbumes creados');

    // Crear Canciones
    await session.run(`
      MATCH (rock:Genero {nombre: 'Rock'}), (pop:Genero {nombre: 'Pop'}),
            (jazz:Genero {nombre: 'Jazz'}), (indie:Genero {nombre: 'Indie'}),
            (electronic:Genero {nombre: 'Electronic'}), (hiphop:Genero {nombre: 'Hip Hop'}),
            (a1:Artista {nombre: 'The Beatles'}), (a2:Artista {nombre: 'Adele'}),
            (a3:Artista {nombre: 'Miles Davis'}), (a4:Artista {nombre: 'Arctic Monkeys'}),
            (a5:Artista {nombre: 'Daft Punk'}), (a6:Artista {nombre: 'Kendrick Lamar'}),
            (a7:Artista {nombre: 'Queen'}), (a8:Artista {nombre: 'Billie Eilish'}),
            (album1:Album {titulo: 'Abbey Road'}), (album2:Album {titulo: '21'}),
            (album3:Album {titulo: 'Kind of Blue'}), (album4:Album {titulo: 'AM'}),
            (album5:Album {titulo: 'Random Access Memories'}), (album6:Album {titulo: 'DAMN.'}),
            (album7:Album {titulo: 'A Night at the Opera'}), (album8:Album {titulo: 'When We All Fall Asleep'})
      CREATE
        // The Beatles
        (c1:Cancion {titulo: 'Come Together', duracion: 4.20}),
        (c2:Cancion {titulo: 'Something', duracion: 3.03}),
        (c3:Cancion {titulo: 'Here Comes The Sun', duracion: 3.05}),
        // Adele
        (c4:Cancion {titulo: 'Rolling in the Deep', duracion: 3.48}),
        (c5:Cancion {titulo: 'Someone Like You', duracion: 4.45}),
        (c6:Cancion {titulo: 'Set Fire to the Rain', duracion: 4.01}),
        // Miles Davis
        (c7:Cancion {titulo: 'So What', duracion: 9.22}),
        (c8:Cancion {titulo: 'Freddie Freeloader', duracion: 9.46}),
        (c9:Cancion {titulo: 'Blue in Green', duracion: 5.37}),
        // Arctic Monkeys
        (c10:Cancion {titulo: 'Do I Wanna Know?', duracion: 4.32}),
        (c11:Cancion {titulo: 'R U Mine?', duracion: 3.21}),
        (c12:Cancion {titulo: 'Arabella', duracion: 3.27}),
        // Daft Punk
        (c13:Cancion {titulo: 'Get Lucky', duracion: 6.09}),
        (c14:Cancion {titulo: 'Instant Crush', duracion: 5.37}),
        (c15:Cancion {titulo: 'Lose Yourself to Dance', duracion: 5.53}),
        // Kendrick Lamar
        (c16:Cancion {titulo: 'HUMBLE.', duracion: 2.57}),
        (c17:Cancion {titulo: 'DNA.', duracion: 3.05}),
        (c18:Cancion {titulo: 'LOYALTY.', duracion: 3.47}),
        // Queen
        (c19:Cancion {titulo: 'Bohemian Rhapsody', duracion: 5.55}),
        (c20:Cancion {titulo: 'Love of My Life', duracion: 3.38}),
        (c21:Cancion {titulo: "You're My Best Friend", duracion: 2.50}),
        // Billie Eilish
        (c22:Cancion {titulo: 'bad guy', duracion: 3.14}),
        (c23:Cancion {titulo: "when the party's over", duracion: 3.16}),
        (c24:Cancion {titulo: 'bury a friend', duracion: 3.13}),
        
        // Relaciones con géneros
        (c1)-[:TIENE_GENERO]->(rock), (c2)-[:TIENE_GENERO]->(rock), (c3)-[:TIENE_GENERO]->(rock),
        (c4)-[:TIENE_GENERO]->(pop), (c5)-[:TIENE_GENERO]->(pop), (c6)-[:TIENE_GENERO]->(pop),
        (c7)-[:TIENE_GENERO]->(jazz), (c8)-[:TIENE_GENERO]->(jazz), (c9)-[:TIENE_GENERO]->(jazz),
        (c10)-[:TIENE_GENERO]->(indie), (c11)-[:TIENE_GENERO]->(indie), (c12)-[:TIENE_GENERO]->(indie),
        (c13)-[:TIENE_GENERO]->(electronic), (c14)-[:TIENE_GENERO]->(electronic), (c15)-[:TIENE_GENERO]->(electronic),
        (c16)-[:TIENE_GENERO]->(hiphop), (c17)-[:TIENE_GENERO]->(hiphop), (c18)-[:TIENE_GENERO]->(hiphop),
        (c19)-[:TIENE_GENERO]->(rock), (c20)-[:TIENE_GENERO]->(rock), (c21)-[:TIENE_GENERO]->(rock),
        (c22)-[:TIENE_GENERO]->(pop), (c23)-[:TIENE_GENERO]->(pop), (c24)-[:TIENE_GENERO]->(pop),
        
        // Artistas cantan canciones
        (a1)-[:CANTA]->(c1), (a1)-[:CANTA]->(c2), (a1)-[:CANTA]->(c3),
        (a2)-[:CANTA]->(c4), (a2)-[:CANTA]->(c5), (a2)-[:CANTA]->(c6),
        (a3)-[:CANTA]->(c7), (a3)-[:CANTA]->(c8), (a3)-[:CANTA]->(c9),
        (a4)-[:CANTA]->(c10), (a4)-[:CANTA]->(c11), (a4)-[:CANTA]->(c12),
        (a5)-[:CANTA]->(c13), (a5)-[:CANTA]->(c14), (a5)-[:CANTA]->(c15),
        (a6)-[:CANTA]->(c16), (a6)-[:CANTA]->(c17), (a6)-[:CANTA]->(c18),
        (a7)-[:CANTA]->(c19), (a7)-[:CANTA]->(c20), (a7)-[:CANTA]->(c21),
        (a8)-[:CANTA]->(c22), (a8)-[:CANTA]->(c23), (a8)-[:CANTA]->(c24),
        
        // Artistas compusieron canciones
        (a1)-[:COMPUSO]->(c1), (a1)-[:COMPUSO]->(c2), (a1)-[:COMPUSO]->(c3),
        (a2)-[:COMPUSO]->(c4), (a2)-[:COMPUSO]->(c5), (a2)-[:COMPUSO]->(c6),
        (a3)-[:COMPUSO]->(c7), (a3)-[:COMPUSO]->(c8), (a3)-[:COMPUSO]->(c9),
        (a4)-[:COMPUSO]->(c10), (a4)-[:COMPUSO]->(c11), (a4)-[:COMPUSO]->(c12),
        (a5)-[:COMPUSO]->(c13), (a5)-[:COMPUSO]->(c14), (a5)-[:COMPUSO]->(c15),
        (a6)-[:COMPUSO]->(c16), (a6)-[:COMPUSO]->(c17), (a6)-[:COMPUSO]->(c18),
        (a7)-[:COMPUSO]->(c19), (a7)-[:COMPUSO]->(c20), (a7)-[:COMPUSO]->(c21),
        (a8)-[:COMPUSO]->(c22), (a8)-[:COMPUSO]->(c23), (a8)-[:COMPUSO]->(c24),
        
        // Canciones forman parte de álbumes
        (c1)-[:FORMA_PARTE_DE]->(album1), (c2)-[:FORMA_PARTE_DE]->(album1), (c3)-[:FORMA_PARTE_DE]->(album1),
        (c4)-[:FORMA_PARTE_DE]->(album2), (c5)-[:FORMA_PARTE_DE]->(album2), (c6)-[:FORMA_PARTE_DE]->(album2),
        (c7)-[:FORMA_PARTE_DE]->(album3), (c8)-[:FORMA_PARTE_DE]->(album3), (c9)-[:FORMA_PARTE_DE]->(album3),
        (c10)-[:FORMA_PARTE_DE]->(album4), (c11)-[:FORMA_PARTE_DE]->(album4), (c12)-[:FORMA_PARTE_DE]->(album4),
        (c13)-[:FORMA_PARTE_DE]->(album5), (c14)-[:FORMA_PARTE_DE]->(album5), (c15)-[:FORMA_PARTE_DE]->(album5),
        (c16)-[:FORMA_PARTE_DE]->(album6), (c17)-[:FORMA_PARTE_DE]->(album6), (c18)-[:FORMA_PARTE_DE]->(album6),
        (c19)-[:FORMA_PARTE_DE]->(album7), (c20)-[:FORMA_PARTE_DE]->(album7), (c21)-[:FORMA_PARTE_DE]->(album7),
        (c22)-[:FORMA_PARTE_DE]->(album8), (c23)-[:FORMA_PARTE_DE]->(album8), (c24)-[:FORMA_PARTE_DE]->(album8)
    `);
    console.log('✅ Canciones creadas');

    // Crear Usuarios
    await session.run(`
      MATCH (rock:Genero {nombre: 'Rock'}), (pop:Genero {nombre: 'Pop'}),
            (jazz:Genero {nombre: 'Jazz'}), (indie:Genero {nombre: 'Indie'}),
            (electronic:Genero {nombre: 'Electronic'}), (hiphop:Genero {nombre: 'Hip Hop'})
      CREATE
        (u1:Usuario {nombre: 'Juan Pérez', email: 'juan@email.com', edad: 28}),
        (u2:Usuario {nombre: 'María López', email: 'maria@email.com', edad: 24}),
        (u3:Usuario {nombre: 'Carlos Ruiz', email: 'carlos@email.com', edad: 35}),
        (u4:Usuario {nombre: 'Ana García', email: 'ana@email.com', edad: 22}),
        (u5:Usuario {nombre: 'Pedro Silva', email: 'pedro@email.com', edad: 31}),
        (u1)-[:PREFIERE_GENERO]->(rock),
        (u1)-[:PREFIERE_GENERO]->(indie),
        (u2)-[:PREFIERE_GENERO]->(pop),
        (u2)-[:PREFIERE_GENERO]->(electronic),
        (u3)-[:PREFIERE_GENERO]->(jazz),
        (u4)-[:PREFIERE_GENERO]->(pop),
        (u4)-[:PREFIERE_GENERO]->(hiphop),
        (u5)-[:PREFIERE_GENERO]->(rock),
        (u5)-[:PREFIERE_GENERO]->(electronic)
    `);
    console.log('✅ Usuarios creados');

    // Crear Playlists
    await session.run(`
      MATCH (u1:Usuario {nombre: 'Juan Pérez'}), (u2:Usuario {nombre: 'María López'}),
            (u3:Usuario {nombre: 'Carlos Ruiz'}), (u4:Usuario {nombre: 'Ana García'}),
            (u5:Usuario {nombre: 'Pedro Silva'}),
            (c1:Cancion {titulo: 'Come Together'}), (c4:Cancion {titulo: 'Rolling in the Deep'}),
            (c7:Cancion {titulo: 'So What'}), (c10:Cancion {titulo: 'Do I Wanna Know?'}),
            (c13:Cancion {titulo: 'Get Lucky'}), (c16:Cancion {titulo: 'HUMBLE.'}),
            (c19:Cancion {titulo: 'Bohemian Rhapsody'}), (c22:Cancion {titulo: 'bad guy'}),
            (c3:Cancion {titulo: 'Here Comes The Sun'}), (c5:Cancion {titulo: 'Someone Like You'}),
            (c11:Cancion {titulo: 'R U Mine?'}), (c14:Cancion {titulo: 'Instant Crush'})
      CREATE
        (p1:Playlist {nombre: 'Rock Classics', descripcion: 'Las mejores de rock', publica: true}),
        (p2:Playlist {nombre: 'Chill Vibes', descripcion: 'Para relajarse', publica: false}),
        (p3:Playlist {nombre: 'Jazz Night', descripcion: 'Noche de jazz', publica: true}),
        (p4:Playlist {nombre: 'Party Mix', descripcion: 'Para fiestas', publica: true}),
        (p5:Playlist {nombre: 'Workout', descripcion: 'Energía para entrenar', publica: false}),
        (u1)-[:CREO_PLAYLIST]->(p1),
        (u2)-[:CREO_PLAYLIST]->(p2),
        (u3)-[:CREO_PLAYLIST]->(p3),
        (u4)-[:CREO_PLAYLIST]->(p4),
        (u5)-[:CREO_PLAYLIST]->(p5),
        (c1)-[:GUARDADA_EN]->(p1),
        (c19)-[:GUARDADA_EN]->(p1),
        (c3)-[:GUARDADA_EN]->(p1),
        (c10)-[:GUARDADA_EN]->(p1),
        (c4)-[:GUARDADA_EN]->(p2),
        (c5)-[:GUARDADA_EN]->(p2),
        (c14)-[:GUARDADA_EN]->(p2),
        (c7)-[:GUARDADA_EN]->(p3),
        (c22)-[:GUARDADA_EN]->(p4),
        (c13)-[:GUARDADA_EN]->(p4),
        (c4)-[:GUARDADA_EN]->(p4),
        (c16)-[:GUARDADA_EN]->(p5),
        (c11)-[:GUARDADA_EN]->(p5),
        (c13)-[:GUARDADA_EN]->(p5)
    `);
    console.log('✅ Playlists creadas');

    // Crear relaciones de escucha
    await session.run(`
      MATCH (u1:Usuario {nombre: 'Juan Pérez'}), (u2:Usuario {nombre: 'María López'}),
            (u3:Usuario {nombre: 'Carlos Ruiz'}), (u4:Usuario {nombre: 'Ana García'}),
            (u5:Usuario {nombre: 'Pedro Silva'}),
            (c1:Cancion {titulo: 'Come Together'}), (c4:Cancion {titulo: 'Rolling in the Deep'}),
            (c7:Cancion {titulo: 'So What'}), (c10:Cancion {titulo: 'Do I Wanna Know?'}),
            (c13:Cancion {titulo: 'Get Lucky'}), (c16:Cancion {titulo: 'HUMBLE.'}),
            (c19:Cancion {titulo: 'Bohemian Rhapsody'}), (c22:Cancion {titulo: 'bad guy'}),
            (c3:Cancion {titulo: 'Here Comes The Sun'}), (c5:Cancion {titulo: 'Someone Like You'})
      CREATE
        (u1)-[:ESCUCHA {veces: 145, ultimaVez: datetime('2024-12-01T10:00:00')}]->(c1),
        (u1)-[:ESCUCHA {veces: 98, ultimaVez: datetime('2024-12-03T15:30:00')}]->(c10),
        (u1)-[:ESCUCHA {veces: 203, ultimaVez: datetime('2024-12-02T20:00:00')}]->(c19),
        (u2)-[:ESCUCHA {veces: 278, ultimaVez: datetime('2024-12-04T08:00:00')}]->(c4),
        (u2)-[:ESCUCHA {veces: 156, ultimaVez: datetime('2024-12-03T18:00:00')}]->(c22),
        (u2)-[:ESCUCHA {veces: 189, ultimaVez: datetime('2024-12-01T12:00:00')}]->(c13),
        (u3)-[:ESCUCHA {veces: 320, ultimaVez: datetime('2024-11-30T18:00:00')}]->(c7),
        (u3)-[:ESCUCHA {veces: 142, ultimaVez: datetime('2024-12-02T14:00:00')}]->(c5),
        (u4)-[:ESCUCHA {veces: 234, ultimaVez: datetime('2024-12-04T10:00:00')}]->(c22),
        (u4)-[:ESCUCHA {veces: 167, ultimaVez: datetime('2024-12-03T16:00:00')}]->(c16),
        (u5)-[:ESCUCHA {veces: 198, ultimaVez: datetime('2024-12-02T22:00:00')}]->(c19),
        (u5)-[:ESCUCHA {veces: 223, ultimaVez: datetime('2024-12-04T09:00:00')}]->(c13),
        (u5)-[:ESCUCHA {veces: 87, ultimaVez: datetime('2024-12-01T19:00:00')}]->(c3)
    `);
    console.log('✅ Relaciones de escucha creadas');

    console.log('\n🎉 ¡Base de datos poblada exitosamente!\n');
    
    // Mostrar estadísticas
    const stats = await session.run(`
      MATCH (n)
      RETURN labels(n)[0] as tipo, count(n) as cantidad
      ORDER BY cantidad DESC
    `);
    
    console.log('📊 Estadísticas de la base de datos:');
    console.log('=====================================');
    stats.records.forEach(record => {
      console.log(`  ${record.get('tipo').padEnd(15)} : ${record.get('cantidad')}`);
    });

    const relationships = await session.run(`
      MATCH ()-[r]->()
      RETURN type(r) as tipo, count(r) as cantidad
      ORDER BY cantidad DESC
    `);
    
    console.log('\n📊 Relaciones:');
    console.log('=====================================');
    relationships.records.forEach(record => {
      console.log(`  ${record.get('tipo').padEnd(20)} : ${record.get('cantidad')}`);
    });

    // Verificar que todos los nodos tienen nombre o título
    console.log('\n🔍 Verificando nodos sin nombre...');
    const nodesWithoutName = await session.run(`
      MATCH (n)
      WHERE n.nombre IS NULL AND n.titulo IS NULL
      RETURN labels(n) as tipo, count(n) as cantidad
    `);
    
    if (nodesWithoutName.records.length > 0) {
      console.log('⚠️  Nodos sin nombre encontrados:');
      nodesWithoutName.records.forEach(record => {
        console.log(`  ${record.get('tipo')} : ${record.get('cantidad')}`);
      });
    } else {
      console.log('✅ Todos los nodos tienen nombre o título');
    }

    console.log('\n🌐 Accede a Neo4j Browser en: http://localhost:7474');
    console.log('   Usuario: neo4j');
    console.log('   Contraseña: password123');
    console.log('\n💡 Tip: En Neo4j Browser, configura la visualización:');
    console.log('   - Haz clic en un tipo de nodo abajo');
    console.log('   - Selecciona "nombre" o "titulo" como Caption');
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await session.close();
    await driver.close();
  }
}

seedDatabase();