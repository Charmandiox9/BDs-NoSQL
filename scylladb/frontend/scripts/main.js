const API_URL = 'http://localhost:3000/api';

function showAlert(message, type = 'success') {
    const alertContainer = document.getElementById('alert-container');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alertContainer.appendChild(alert);

    setTimeout(() => {
        alert.remove();
    }, 3000);
}

async function loadUsers() {
    const container = document.getElementById('users-container');
    container.innerHTML = '<div class="loading">Cargando usuarios...</div>';

    try {
        const response = await fetch(`${API_URL}/users`);
        const data = await response.json();

        if (data.success && data.users.length > 0) {
            container.innerHTML = '';
            data.users.forEach(user => {
                const userCard = createUserCard(user);
                container.appendChild(userCard);
            });
        } else {
            container.innerHTML = `
                <div class="empty-state">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                    </svg>
                    <h3>No hay usuarios</h3>
                    <p>Crea tu primer usuario usando el formulario de arriba</p>
                </div>
            `;
        }
    } catch (error) {
        container.innerHTML = `<div class="empty-state"><p>Error al cargar usuarios: ${error.message}</p></div>`;
    }
}

function createUserCard(user) {
    const card = document.createElement('div');
    card.className = 'user-card';
    card.innerHTML = `
        <h3>👤 ${user.name}</h3>
        <p><strong>📧 Email:</strong> ${user.email}</p>
        <p><strong>🎂 Edad:</strong> ${user.age} años</p>
        <p><strong>🆔 ID:</strong> ${user.id.substring(0, 8)}...</p>
        <div class="actions">
            <button class="btn btn-warning" onclick="editUser('${user.id}', '${user.name}', '${user.email}', ${user.age})">
                ✏️ Editar
            </button>
            <button class="btn btn-danger" onclick="deleteUser('${user.id}')">
                🗑️ Eliminar
            </button>
        </div>
    `;
    return card;
}

document.getElementById('user-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const userId = document.getElementById('user-id').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const age = parseInt(document.getElementById('age').value);

    try {
        const url = userId ? `${API_URL}/users/${userId}` : `${API_URL}/users`;
        const method = userId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, age })
        });

        const data = await response.json();

        if (data.success) {
            showAlert(userId ? '✅ Usuario actualizado correctamente' : '✅ Usuario creado correctamente', 'success');
            document.getElementById('user-form').reset();
            document.getElementById('user-id').value = '';
            document.getElementById('submit-btn').textContent = 'Crear Usuario';
            document.getElementById('cancel-btn').style.display = 'none';
            loadUsers();
        } else {
            showAlert('❌ Error: ' + data.error, 'error');
        }
    } catch (error) {
        showAlert('❌ Error: ' + error.message, 'error');
    }
});

function editUser(id, name, email, age) {
    document.getElementById('user-id').value = id;
    document.getElementById('name').value = name;
    document.getElementById('email').value = email;
    document.getElementById('age').value = age;
    document.getElementById('submit-btn').textContent = 'Actualizar Usuario';
    document.getElementById('cancel-btn').style.display = 'inline-block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.getElementById('cancel-btn').addEventListener('click', () => {
    document.getElementById('user-form').reset();
    document.getElementById('user-id').value = '';
    document.getElementById('submit-btn').textContent = 'Crear Usuario';
    document.getElementById('cancel-btn').style.display = 'none';
});

async function deleteUser(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/users/${id}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (data.success) {
            showAlert('✅ Usuario eliminado correctamente', 'success');
            loadUsers();
        } else {
            showAlert('❌ Error: ' + data.error, 'error');
        }
    } catch (error) {
        showAlert('❌ Error: ' + error.message, 'error');
    }
}

loadUsers();