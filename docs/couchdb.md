<h1>CouchDB - Base de Datos NoSQL Orientada a Documentos</h1>

<h2>Descripción</h2>
CouchDB es una base de datos NoSQL orientada a documentos desarrollada por Apache. A diferencia de las bases de datos relacionales que utilizan tablas y filas, CouchDB almacena información en documentos JSON flexibles, sin necesidad de seguir un esquema fijo. Esto la hace especialmente útil para aplicaciones que manejan datos semi-estructurados o en constante evolución.

<h2>Características Principales</h2>

<h3>🗂️ Almacenamiento Orientado a Documentos</h3>
<ul>
    <li>Documentos JSON flexibles sin esquema rígido</li>
    <li>Soporte para archivos binarios adjuntos (imágenes, PDFs, etc.)</li>
    <li>Identificadores únicos (_id) y control de versiones (_rev)</li>
</ul>

<h3>🌐 API RESTful Nativa</h3>
<ul>
    <li>Interacción completa vía HTTP (GET, POST, PUT, DELETE)</li>
    <li>Sin necesidad de drivers pesados</li>
    <li>Integración directa con aplicaciones web y móviles</li>
</ul>

<h3>🔄 Replicación y Sincronización Robusta</h3>
<ul>
    <li>Replicación bidireccional entre servidores y dispositivos</li>
    <li>Ideal para aplicaciones offline-first</li>
    <li>Sincronización incremental automática</li>
</ul>

<h3>⚡ Control de Concurrencia MVCC</h3>
<ul>
    <li>Multi-Version Concurrency Control</li>
    <li>Evita conflictos en entornos distribuidos</li>
    <li>No requiere bloqueo de documentos</li>
</ul>

<h3>📊 Consultas MapReduce</h3>
<ul>
    <li>Vistas e índices personalizados con JavaScript</li>
    <li>Consultas eficientes en grandes volúmenes</li>
</ul>

<li>Sin SQL tradicional</li>

<h3>🛡️ Alta Tolerancia a Fallos</h3>
<ul>
    <li>Consistencia eventual (eventual consistency)</li>
    <li>Funcionamiento en entornos distribuidos y desconectados</li>
    <li>Clustering y sharding (CouchDB 2.x+)</li>
</ul>

<h2>Modelo de Datos</h2>

<h3>Estructura de Documento</h3>
<pre><code>{
  "_id": "producto_001",
  "_rev": "1-9c65296036141e575d32ba9c034dd3ee",
  "nombre": "Laptop Gamer",
  "precio": 1200,
  "stock": 15,
  "caracteristicas": {
    "ram": "16GB",
    "cpu": "Intel i7",
    "gpu": "RTX 3060"
  },
  "tags": ["electrónica", "computación", "gaming"]
}</code></pre>

<h3>Componentes Clave</h3>
<ul>
    <li>_id: Identificador único del documento</li>
    <li>_rev: Número de revisión para control de versiones</li>
    <li>Campos personalizados: Estructura flexible en JSON</li>
</ul>

<h2>Casos de Uso Ideales</h2>

<h3>✅ Escenarios Donde Brilla</h3>
<ul>
    <li>Aplicaciones Offline-First: Apps móviles que funcionan sin internet</li>
    <li>Sistemas Distribuidos: Replicación confiable entre nodos distantes</li>
    <li>Aplicaciones Colaborativas: Sincronización entre múltiples usuarios</li>
    <li>IoT: Dispositivos con conectividad intermitente</li>
    <li>Datos Semi-Estructurados: Perfiles flexibles sin esquemas rígidos</li>
</ul>

<h3>❌ Escenarios Menos Adecuados</h3>
<ul>
    <li>Consultas complejas o reporting en tiempo real</li>
    <li>Big Data con alta escalabilidad horizontal</li>
    <li>Aplicaciones que requieren consistencia ACID estricta</li>
    <li>Proyectos que dependen de comunidades muy activas</li>
</ul>

<h2>Ejemplos de Adopción Real</h2>

<h3>BBC (British Broadcasting Corporation)</h3>
<ul>
    <li>Uso: Producción y distribución de contenido digital</li>
    <li>Ventaja: Sincronización confiable entre servidores distribuidos</li>
</ul>

<h3>Samsung SmartThings (IoT)</h3>
<ul>
    <li>Uso: Catálogo de productos y puntos de venta</li>
    <li>Ventaja: Cada sucursal opera independientemente</li>
</ul>

<h3>Debenhams (Retail UK)</h3>
<ul>
    <li>Uso: Catálogo de productos y puntos de venta</li>
    <li>Ventaja: Cada sucursal opera independientemente</li>
</ul>


<h2>Posicionamiento en el Teorema CAP</h2>
CouchDB se posiciona como AP (Available + Partition tolerant):

<ul>
    <li>Partition Tolerance (P): Tolera particiones de red perfectamente</li>
    <li>Availability (A): Cada nodo siempre responde, incluso desconectado</li>
    <li>Consistency: Eventual consistency (no inmediata)</li>
</ul>

<h2>Escalabilidad</h2>

<h3>Escalabilidad Horizontal</h3>
<ul>
    <li>Sharding: División automática de datos en fragmentos</li>
    <li>Replicación de Shards: Copias distribuidas para tolerancia a fallos</li>
    <li>Coordinación Automática: Enrutamiento inteligente de peticiones</li>
</ul>


<h3>Configuración de Cluster</h3>
<ol>
    <li>Unir nodos al cluster</li>
    <li>Configurar réplicas y shards por base de datos</li>
    <li>Redistribución automática de shards</li>
</ol>

<h2>Fortalezas y Debilidades</h2>

<h3>💪 Fortalezas</h3>
<ul>
<li>Replicación bidireccional excepcional</li>
<li>Modelo de documentos flexible</li>
<li>API REST nativa simple</li>
<li>Resiliencia y tolerancia a fallos</li>
<li>Soporte nativo para adjuntos binarios</li>
</ul>

<h3>⚠️ Debilidades</h3>
<ul>
<li>Rendimiento limitado en consultas complejas</li>
<li>Escalabilidad menor comparado con MongoDB/Cassandra</li>
<li>Resolución manual de conflictos de replicación</li>
<li>Ecosistema y comunidad más pequeña</li>
<li>No optimizada para analítica avanzada</li>
</ul>

<h2>Ejemplo de Implementación</h2>

<h3>Aplicación de Gestión de Tareas Colaborativas</h3>

<h4>Documento de Usuario</h4>
<pre><code>{
  "_id": "user_001",
  "_rev": "1-abc",
  "tipo": "usuario",
  "nombre": "Carlos Pérez",
  "email": "carlos@mail.com",
  "rol": "admin",
  "fecha_creacion": "2025-09-05T12:00:00Z"
}</code></pre>

<h4>Documento de Proyecto</h4>
<pre><code>{
  "_id": "proyecto_001",
  "_rev": "1-def",
  "tipo": "proyecto",
  "nombre": "Desarrollo App",
  "descripcion": "Proyecto para desarrollar app móvil",
  "creador": "user_001",
  "miembros": ["user_001", "user_002"],
  "fecha_creacion": "2025-09-05T12:10:00Z"
}</code></pre>

<h4>Documento de Tarea</h4>
<pre><code>{
  "_id": "tarea_001",
  "_rev": "1-ghi",
  "tipo": "tarea",
  "proyecto_id": "proyecto_001",
  "titulo": "Diseñar interfaz",
  "descripcion": "Crear prototipo UI/UX",
  "asignado_a": "user_002",
  "estado": "pendiente",
  "prioridad": "alta",
  "fecha_creacion": "2025-09-05T12:20:00Z",
  "comentarios": [
    {
      "usuario": "user_001",
      "mensaje": "Revisar los colores corporativos",
      "fecha": "2025-09-05T12:30:00Z"
    }
  ]
}</code></pre>

<h2>Interfaz de Administración</h2>
<strong>Fauxton</strong> es la interfaz web incluida que permite:
<ul>
<li>Crear y gestionar bases de datos</li>
<li>Ver y editar documentos</li>
<li>Configurar replicación</li>
<li>Monitorear clusters</li>
</ul>