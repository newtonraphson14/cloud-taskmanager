// API Configuration
const API_URL = 'https://ikbar-taskmanager.azurewebsites.net/api/tasks';

// DOM Elements
const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const loading = document.getElementById('loading');

// Load tasks when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadTasks();
});

// Load tasks from API
async function loadTasks() {
    showLoading();
    
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            displayTasks(result.data);
            updateTaskCount(result.count);
        } else {
            throw new Error(result.error || 'Failed to load tasks');
        }
    } catch (error) {
        console.error('Error loading tasks:', error);
        taskList.innerHTML = `
            <div class="task-item" style="border-left-color: #e74c3c;">
                <div class="task-title">Error loading tasks</div>
                <div class="task-description">${error.message}</div>
            </div>
        `;
    } finally {
        hideLoading();
    }
}

// Display tasks in the UI
function displayTasks(tasks) {
    if (!tasks || tasks.length === 0) {
        taskList.innerHTML = `
            <div class="task-item">
                <div class="task-title">No tasks yet</div>
                <div class="task-description">Create your first task above!</div>
            </div>
        `;
        return;
    }

    taskList.innerHTML = tasks.map(task => `
        <div class="task-item ${task.priority}-priority">
            <div class="task-header">
                <div class="task-title">${escapeHtml(task.title)}</div>
                <span class="task-priority priority-${task.priority}">${task.priority}</span>
            </div>
            <div class="task-description">${escapeHtml(task.description || 'No description')}</div>
            <div class="task-meta">
                <span>Status: ${task.status}</span>
                <span>Created: ${formatDate(task.createdAt)}</span>
            </div>
        </div>
    `).join('');
}

// Update task count
function updateTaskCount(count) {
    taskCount.textContent = count;
}

// Handle form submission
taskForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const priority = document.getElementById('priority').value;
    
    if (!title) {
        alert('Please enter a task title');
        return;
    }
    
    await createTask({ title, description, priority });
    
    // Reset form
    taskForm.reset();
    document.getElementById('priority').value = 'medium';
});

// Create new task
async function createTask(taskData) {
    showLoading();
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            // Reload tasks to show the new one
            await loadTasks();
            
            // Show success message
            showNotification('Task created successfully!', 'success');
        } else {
            throw new Error(result.error || 'Failed to create task');
        }
    } catch (error) {
        console.error('Error creating task:', error);
        showNotification('Failed to create task: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

// Utility functions
function showLoading() {
    loading.classList.remove('hidden');
}

function hideLoading() {
    loading.classList.add('hidden');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function showNotification(message, type = 'info') {
    // Simple notification - you can enhance this with a proper toast library
    alert(`${type.toUpperCase()}: ${message}`);
}