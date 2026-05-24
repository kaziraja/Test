// DOM Elements
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearBtn = document.getElementById('clearBtn');
const totalCount = document.getElementById('totalCount');
const completedCount = document.getElementById('completedCount');

// State
let todos = [];
let currentFilter = 'all';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadTodosFromStorage();
    renderTodos();
    addEventListeners();
});

// Event Listeners
function addEventListeners() {
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            renderTodos();
        });
    });
    clearBtn.addEventListener('click', clearCompleted);
}

// Add Todo
function addTodo() {
    const text = todoInput.value.trim();
    
    if (text === '') {
        alert('Please enter a task!');
        return;
    }

    const todo = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toLocaleString()
    };

    todos.push(todo);
    todoInput.value = '';
    saveTodosToStorage();
    renderTodos();
    todoInput.focus();
}

// Toggle Todo
function toggleTodo(id) {
    todos = todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodosToStorage();
    renderTodos();
}

// Delete Todo
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodosToStorage();
    renderTodos();
}

// Clear Completed
function clearCompleted() {
    const completedTodos = todos.filter(todo => todo.completed);
    if (completedTodos.length === 0) {
        alert('No completed tasks to clear!');
        return;
    }
    
    if (confirm(`Clear ${completedTodos.length} completed task(s)?`)) {
        todos = todos.filter(todo => !todo.completed);
        saveTodosToStorage();
        renderTodos();
    }
}

// Filter Todos
function getFilteredTodos() {
    switch (currentFilter) {
        case 'active':
            return todos.filter(todo => !todo.completed);
        case 'completed':
            return todos.filter(todo => todo.completed);
        default:
            return todos;
    }
}

// Render Todos
function renderTodos() {
    const filteredTodos = getFilteredTodos();
    todoList.innerHTML = '';

    if (filteredTodos.length === 0) {
        todoList.innerHTML = '<div class="empty-state"><p>No tasks yet. Add one to get started!</p></div>';
    } else {
        filteredTodos.forEach(todo => {
            const todoItem = document.createElement('li');
            todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            todoItem.innerHTML = `
                <input 
                    type="checkbox" 
                    class="checkbox" 
                    ${todo.completed ? 'checked' : ''}
                    onchange="toggleTodo(${todo.id})"
                >
                <span class="todo-text">${escapeHtml(todo.text)}</span>
                <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
            `;
            todoList.appendChild(todoItem);
        });
    }

    updateStats();
}

// Update Stats
function updateStats() {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    
    totalCount.textContent = total;
    completedCount.textContent = completed;
    
    clearBtn.disabled = completed === 0;
}

// Local Storage Functions
function saveTodosToStorage() {
    try {
        localStorage.setItem('todos', JSON.stringify(todos));
    } catch (error) {
        console.error('Error saving todos to localStorage:', error);
        alert('Could not save your tasks. Storage may be full.');
    }
}

function loadTodosFromStorage() {
    try {
        const stored = localStorage.getItem('todos');
        todos = stored ? JSON.parse(stored) : [];
        
        // Validate loaded data
        if (!Array.isArray(todos)) {
            todos = [];
        }
    } catch (error) {
        console.error('Error loading todos from localStorage:', error);
        todos = [];
    }
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Export todos as JSON
function exportTodos() {
    const dataStr = JSON.stringify(todos, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `todos_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

// Import todos from JSON
function importTodos(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const imported = JSON.parse(e.target.result);
            if (Array.isArray(imported)) {
                todos = imported;
                saveTodosToStorage();
                renderTodos();
                alert('Todos imported successfully!');
            } else {
                alert('Invalid file format!');
            }
        } catch (error) {
            alert('Error importing file!');
        }
    };
    reader.readAsText(file);
}
