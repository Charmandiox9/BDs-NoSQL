const express = require('express');
const { Level } = require('level');
const cors = require('cors');
const path = require('path');

const app = express();
const db = new Level('./data/mydb', { valueEncoding: 'json' });

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Inicializar con datos de ejemplo
async function initializeData() {
    try {
        const count = await countKeys();
        if (count === 0) {
            console.log('Inicializando datos de ejemplo...');
            await db.batch([
                { type: 'put', key: 'usuario:1', value: { nombre: 'Ana García', edad: 28, ciudad: 'Madrid' } },
                { type: 'put', key: 'usuario:2', value: { nombre: 'Carlos López', edad: 35, ciudad: 'Barcelona' } },
                { type: 'put', key: 'usuario:3', value: { nombre: 'María Rodríguez', edad: 24, ciudad: 'Valencia' } },
                { type: 'put', key: 'producto:1', value: { nombre: 'Laptop', precio: 999, stock: 15 } },
                { type: 'put', key: 'producto:2', value: { nombre: 'Mouse', precio: 25, stock: 100 } },
                { type: 'put', key: 'config:theme', value: { mode: 'dark', color: 'blue' } }
            ]);
            console.log('Datos de ejemplo inicializados');
        }
    } catch (error) {
        console.error('Error inicializando datos:', error);
    }
}

async function countKeys() {
    let count = 0;
    for await (const _ of db.keys()) {
        count++;
    }
    return count;
}

// API Endpoints

// Obtener todas las entradas
app.get('/api/entries', async (req, res) => {
    try {
        const entries = [];
        const { prefix, limit = 100 } = req.query;
        
        const options = { limit: parseInt(limit) };
        if (prefix) {
            options.gte = prefix;
            options.lte = prefix + '\xff';
        }
        
        for await (const [key, value] of db.iterator(options)) {
            entries.push({ key, value });
        }
        res.json(entries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener una entrada específica
app.get('/api/entry/:key', async (req, res) => {
    try {
        const value = await db.get(req.params.key);
        res.json({ key: req.params.key, value });
    } catch (error) {
        if (error.code === 'LEVEL_NOT_FOUND') {
            res.status(404).json({ error: 'Clave no encontrada' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// Crear o actualizar entrada
app.put('/api/entry/:key', async (req, res) => {
    try {
        await db.put(req.params.key, req.body.value);
        res.json({ success: true, key: req.params.key, value: req.body.value });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar entrada
app.delete('/api/entry/:key', async (req, res) => {
    try {
        await db.del(req.params.key);
        res.json({ success: true, message: 'Entrada eliminada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Estadísticas
app.get('/api/stats', async (req, res) => {
    try {
        const stats = {
            totalKeys: await countKeys(),
            prefixes: {}
        };
        
        for await (const key of db.keys()) {
            const prefix = key.split(':')[0];
            stats.prefixes[prefix] = (stats.prefixes[prefix] || 0) + 1;
        }
        
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Operaciones por lote
app.post('/api/batch', async (req, res) => {
    try {
        await db.batch(req.body.operations);
        res.json({ success: true, count: req.body.operations.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Buscar por prefijo
app.get('/api/search', async (req, res) => {
    try {
        const { prefix } = req.query;
        const results = [];
        
        for await (const [key, value] of db.iterator({
            gte: prefix,
            lte: prefix + '\xff'
        })) {
            results.push({ key, value });
        }
        
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;

initializeData().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor LevelDB corriendo en http://localhost:${PORT}`);
        console.log(`📊 Interfaz web disponible en http://localhost:${PORT}`);
    });
});

process.on('SIGINT', async () => {
    await db.close();
    process.exit(0);
});