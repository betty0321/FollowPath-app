// Sample tasks removed—load from API now
let tasks = [];

const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const listTitle = document.getElementById('listTitle');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const statusTabs = document.querySelectorAll('#statusTabs .nav-link');
const totalTasksEl = document.getElementById('totalTasks');
const pendingTasksEl = document.getElementById('pendingTasks');
const completedTasksEl = document.getElementById('completedTasks');
const overallPercentEl = document.getElementById('overallPercent');

let currentFilter = 'all';
let currentSort = 'due-asc';

const taskTitle = document.getElementById('taskTitle');
const taskDesc = document.getElementById('taskDesc');
const dueDate = document.getElementById('dueDate');
const taskStatus = document.getElementById('taskStatus');
const completionPercent = document.getElementById('completionPercent');

let editingId = null;

// Status colors for badges
const statusColors = {
    'Pending': 'primary',
    'In Progress': 'warning text-dark',
    'Completed': 'success',
    'Cancelled': 'danger'
};

const API_BASE = 'http://localhost:5000';  // Backend URL

// Load tasks from backend
async function loadTasks() {
    try {
        const params = new URLSearchParams();
        if (currentFilter !== 'all') params.append('status', currentFilter);
        if (searchInput.value) params.append('search', searchInput.value);
        params.append('sort', currentSort);

        const response = await fetch(`${API_BASE}/tasks?${params}`);
        if (!response.ok) throw new Error('Failed to load tasks');
        tasks = await response.json();
        renderTasks();
    } catch (err) {
        console.error('Error loading tasks:', err);
        alert('Failed to load tasks. Check if backend is running on port 5000.');
        // Optional fallback: tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        // renderTasks();
    }
}

// Render tasks (filtered/sorted)
function renderTasks() {
    let filteredTasks = tasks.filter(task => {
        if (currentFilter !== 'all') return task.status === currentFilter;
        return true;
    });

    // Search (client-side fallback if server fails)
    const searchTerm = searchInput.value.toLowerCase();
    filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm) || (task.description || '').toLowerCase().includes(searchTerm)
    );

    // Sort (client-side if needed)
    filteredTasks.sort((a, b) => {
        if (currentSort === 'due-asc') return new Date(a.dueDate) - new Date(b.dueDate);
        if (currentSort === 'due-desc') return new Date(b.dueDate) - new Date(a.dueDate);
        if (currentSort === 'title') return a.title.localeCompare(b.title);
        return 0;
    });

    taskList.innerHTML = '';
    listTitle.textContent = `${currentFilter === 'all' ? 'All' : currentFilter} Tasks`;

    if (filteredTasks.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    emptyState.style.display = 'none';

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-start';
        li.innerHTML = `
            <div class="flex-grow-1">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <h6 class="mb-1">${task.title}</h6>
                    <span class="badge bg-$$ {statusColors[task.status]}"> $${task.status}</span>
                </div>
                ${task.description ? `<p class="mb-2 text-muted">${task.description}</p>` : ''}
                ${task.dueDate ? `<small class="text-info"><i class="fas fa-calendar-alt me-1"></i>Due: ${new Date(task.dueDate).toLocaleDateString()}</small>` : ''}
                <div class="progress mt-2" style="height: 6px;">
                    <div class="progress-bar bg-${task.completion === 100 ? 'success' : 'info'}" style="width: ${task.completion}%"></div>
                </div>
                <small class="text-muted">${task.completion}% Complete</small>
            </div>
            <div class="ms-3">
                <button class="btn btn-warning btn-sm me-1" onclick="editTask(${task.id})" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="btn btn-danger btn-sm me-1" onclick="deleteTask(${task.id})" title="Delete"><i class="fas fa-trash"></i></button>
            </div>
        `;
        taskList.appendChild(li);
    });

    updateStats();
    // No localStorage.setItem here—DB handles it!
}

// Update stats
function updateStats() {
    const total = tasks.length;
    const pending = tasks.filter(t => t.status === 'Pending').length;
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const overallPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

    totalTasksEl.textContent = total;
    pendingTasksEl.textContent = pending;
    completedTasksEl.textContent = completed;
    overallPercentEl.textContent = `${overallPercent}%`;

    // Animate progress ring (your CSS handles this)
    const circle = document.querySelector('#overallProgress circle.progress-fill');
    if (circle) {
        const offset = 157 - (157 * overallPercent / 100);
        circle.style.strokeDashoffset = offset;
    }
}

// Add/Edit task
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = taskTitle.value.trim();
    const desc = taskDesc.value.trim();
    const date = dueDate.value;
    const status = taskStatus.value;
    const completion = parseInt(completionPercent.value) || 0;

    if (!title) return alert('Title required!');

    try {
        if (editingId) {
            // Update
            const response = await fetch(`${API_BASE}/tasks/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description: desc, dueDate: date, status, completion })
            });
            if (!response.ok) throw new Error('Failed to update');
            editingId = null;
            taskForm.querySelector('button[type="submit"]').innerHTML = '<i class="fas fa-plus"></i> Add';
        } else {
            // Create
            const response = await fetch(`${API_BASE}/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description: desc, dueDate: date, status, completion })
            });
            if (!response.ok) throw new Error('Failed to create');
        }

        // Reset form
        taskTitle.value = '';
        taskDesc.value = '';
        dueDate.value = '';
        taskStatus.value = 'Pending';
        completionPercent.value = '0';

        // Reload from DB
        await loadTasks();
    } catch (err) {
        console.error(err);
        alert('Operation failed. Check console or if server is running.');
    }
});

// Edit task
function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        taskTitle.value = task.title;
        taskDesc.value = task.description || '';
        dueDate.value = task.dueDate || '';
        taskStatus.value = task.status;
        completionPercent.value = task.completion;
        editingId = id;
        taskForm.querySelector('button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Update';
        taskTitle.focus();
    }
}

// Delete task
async function deleteTask(id) {
    if (!confirm('Delete this task?')) return;
    try {
        const response = await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete');
        await loadTasks();
    } catch (err) {
        console.error(err);
        alert('Failed to delete task.');
    }
}

// Event Listeners
searchInput.addEventListener('input', () => setTimeout(loadTasks, 300));  // Debounce search
sortSelect.addEventListener('change', (e) => { currentSort = e.target.value; loadTasks(); });

statusTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
        e.preventDefault();
        statusTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentFilter = tab.dataset.status;
        loadTasks();
    });
});

// Initial load
document.addEventListener('DOMContentLoaded', loadTasks);