let allEntries = [];

async function loadStats() {
    try {
        const res = await fetch('/api/stats');
        const stats = await res.json();
        
        const statsDiv = document.getElementById('stats');
        if (!statsDiv) {
            console.error('Elemento stats no encontrado');
            return;
        }
        
        statsDiv.innerHTML = `
            <div class="stat-card">
                <h3>Total de Claves</h3>
                <div class="value">${stats.totalKeys}</div>
            </div>
        `;
        
        for (const [prefix, count] of Object.entries(stats.prefixes)) {
            statsDiv.innerHTML += `
                <div class="stat-card">
                    <h3>${prefix}:*</h3>
                    <div class="value">${count}</div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error cargando estadísticas:', error);
    }
}

async function loadEntries() {
    try {
        const res = await fetch('/api/entries');
        allEntries = await res.json();
        displayEntries(allEntries);
    } catch (error) {
        showMessage('Error cargando entradas', 'error');
    }
}

function displayEntries(entries) {
    const list = document.getElementById('entriesList');
    if (entries.length === 0) {
        list.innerHTML = '<div class="loading">No hay entradas</div>';
        return;
    }
    
    list.innerHTML = entries.map(entry => `
        <div class="entry-item">
            <div class="key">${escapeHtml(entry.key)}</div>
            <div class="value">${escapeHtml(JSON.stringify(entry.value, null, 2))}</div>
            <div class="actions">
                <button onclick="editEntry('${escapeHtml(entry.key)}')">✏️ Editar</button>
                <button class="danger" onclick="deleteEntry('${escapeHtml(entry.key)}')">🗑️ Eliminar</button>
            </div>
        </div>
    `).join('');
}

function filterEntries() {
    const filter = document.getElementById('filterInput').value.toLowerCase();
    const filtered = allEntries.filter(e => e.key.toLowerCase().includes(filter));
    displayEntries(filtered);
}

async function addEntry() {
    const key = document.getElementById('newKey').value.trim();
    const valueStr = document.getElementById('newValue').value.trim();
    
    if (!key || !valueStr) {
        showMessage('La clave y el valor son obligatorios', 'error');
        return;
    }
    
    try {
        const value = JSON.parse(valueStr);
        const res = await fetch(`/api/entry/${encodeURIComponent(key)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value })
        });
        
        if (res.ok) {
            showMessage('Entrada agregada exitosamente', 'success');
            clearForm();
            loadEntries();
            loadStats();
        } else {
            showMessage('Error al agregar entrada', 'error');
        }
    } catch (error) {
        showMessage('El valor debe ser un JSON válido', 'error');
    }
}

async function deleteEntry(key) {
    if (!confirm(`¿Eliminar la entrada "${key}"?`)) return;
    
    try {
        const res = await fetch(`/api/entry/${encodeURIComponent(key)}`, { 
            method: 'DELETE' 
        });
        if (res.ok) {
            showMessage('Entrada eliminada', 'success');
            loadEntries();
            loadStats();
        } else {
            showMessage('Error al eliminar', 'error');
        }
    } catch (error) {
        showMessage('Error al eliminar', 'error');
    }
}

async function editEntry(key) {
    try {
        const res = await fetch(`/api/entry/${encodeURIComponent(key)}`);
        const data = await res.json();
        document.getElementById('newKey').value = key;
        document.getElementById('newValue').value = JSON.stringify(data.value, null, 2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        showMessage('Error al cargar entrada', 'error');
    }
}

async function searchByPrefix() {
    const prefix = document.getElementById('searchPrefix').value.trim();
    if (!prefix) {
        showMessage('Ingresa un prefijo', 'error');
        return;
    }
    
    try {
        const res = await fetch(`/api/search?prefix=${encodeURIComponent(prefix)}`);
        const entries = await res.json();
        allEntries = entries;
        displayEntries(entries);
    } catch (error) {
        showMessage('Error en la búsqueda', 'error');
    }
}

function clearForm() {
    document.getElementById('newKey').value = '';
    document.getElementById('newValue').value = '';
}

function showMessage(text, type) {
    const msgDiv = document.getElementById('message');
    msgDiv.innerHTML = `<div class="message ${type}">${text}</div>`;
    setTimeout(() => msgDiv.innerHTML = '', 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Inicializar cuando cargue la página
document.addEventListener('DOMContentLoaded', () => {
    loadStats();
    loadEntries();
    
    // Auto-refresh cada 5 segundos
    setInterval(() => {
        loadStats();
        loadEntries();
    }, 5000);
});