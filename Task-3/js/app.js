/**
 * TaskFlow - State-Driven To-Do List
 * Follows a modular, component-based approach with a single source of truth.
 */

// ==========================================
// 1. STATE MANAGEMENT (Single Source of Truth)
// ==========================================
const state = {
  tasks: JSON.parse(localStorage.getItem('taskflow_tasks')) || [],
  filter: 'all', // 'all', 'active', 'completed'
  searchQuery: '',
  taskToDelete: null,
  theme: localStorage.getItem('taskflow_theme') || 'dark'
};

const saveState = () => {
  localStorage.setItem('taskflow_tasks', JSON.stringify(state.tasks));
  localStorage.setItem('taskflow_theme', state.theme);
};

// ==========================================
// 2. DOM ELEMENTS
// ==========================================
const elements = {
  // Form
  form: document.getElementById('addTaskForm'),
  taskInput: document.getElementById('taskInput'),
  prioritySelect: document.getElementById('prioritySelect'),
  dueDateInput: document.getElementById('dueDateInput'),
  categorySelect: document.getElementById('categorySelect'),
  
  // Toolbar
  searchInput: document.getElementById('searchInput'),
  filterTabs: document.querySelectorAll('.filter-tab'),
  
  // List & Empty State
  taskList: document.getElementById('taskList'),
  emptyState: document.getElementById('emptyState'),
  
  // Footer & Progress
  progressLabel: document.getElementById('progressLabel'),
  progressPercent: document.getElementById('progressPercent'),
  progressFill: document.getElementById('progressFill'),
  taskCounter: document.getElementById('taskCounter'),
  clearCompletedBtn: document.getElementById('clearCompleted'),
  
  // Modal
  deleteModal: document.getElementById('deleteModal'),
  modalCancelBtn: document.getElementById('modalCancel'),
  modalConfirmBtn: document.getElementById('modalConfirm'),
  
  // Theme
  themeToggle: document.getElementById('themeToggle')
};

// ==========================================
// 3. UI RENDERING (UI as a Reflection of State)
// ==========================================
const renderUI = () => {
  // 1. Derive state for UI
  let visibleTasks = state.tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(state.searchQuery.toLowerCase());
    const matchesFilter = 
      state.filter === 'all' ? true :
      state.filter === 'active' ? !task.isCompleted :
      task.isCompleted;
      
    return matchesSearch && matchesFilter;
  });

  const totalTasks = state.tasks.length;
  const completedTasks = state.tasks.filter(t => t.isCompleted).length;
  const activeTasks = totalTasks - completedTasks;
  const progressPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // 2. Update Task List
  if (visibleTasks.length === 0) {
    elements.taskList.innerHTML = '';
    elements.emptyState.hidden = false;
  } else {
    elements.emptyState.hidden = true;
    elements.taskList.innerHTML = visibleTasks.map(task => `
      <li class="task-item ${task.isCompleted ? 'completed' : ''}" data-id="${task.id}" data-priority="${task.priority}">
        <div class="task-checkbox-wrapper">
          <input type="checkbox" class="task-checkbox toggle-task" data-id="${task.id}" ${task.isCompleted ? 'checked' : ''} aria-label="Toggle task completion">
        </div>
        <div class="task-content">
          <span class="task-text">${escapeHTML(task.title)}</span>
          <div class="task-meta">
            <span class="task-badge" style="background: var(--priority-${task.priority}); color: white;">
              ${capitalize(task.priority)}
            </span>
            ${task.category ? `<span class="task-badge" style="background: var(--cat-${task.category}); color: white;">${capitalize(task.category)}</span>` : ''}
            ${task.dueDate ? `<span class="task-badge">📅 ${task.dueDate}</span>` : ''}
          </div>
        </div>
        <button class="btn-icon delete-btn" data-id="${task.id}" aria-label="Delete task">🗑️</button>
      </li>
    `).join('');
  }

  // 3. Update Progress Bar & Counters
  elements.progressLabel.textContent = `${completedTasks} of ${totalTasks} tasks completed`;
  elements.progressPercent.textContent = `${progressPercentage}%`;
  elements.progressFill.style.width = `${progressPercentage}%`;
  elements.taskCounter.textContent = `${activeTasks} item${activeTasks !== 1 ? 's' : ''} left`;
  
  // 4. Update Filter Tabs
  elements.filterTabs.forEach(tab => {
    const isActive = tab.dataset.filter === state.filter;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', isActive);
  });

  // 5. Apply Theme
  document.documentElement.setAttribute('data-theme', state.theme);
  
  // 6. Save State
  saveState();
};

// ==========================================
// 4. BUSINESS LOGIC (Action Handlers)
// ==========================================
const handleAddTask = (e) => {
  e.preventDefault();
  
  const title = elements.taskInput.value.trim();
  if (!title) return;

  const newTask = {
    id: Date.now().toString(),
    title: title,
    priority: elements.prioritySelect.value,
    category: elements.categorySelect.value,
    dueDate: elements.dueDateInput.value,
    isCompleted: false,
    createdAt: new Date().toISOString()
  };

  state.tasks.unshift(newTask);
  
  // Reset form
  elements.form.reset();
  elements.prioritySelect.value = 'medium';
  
  renderUI();
};

const handleToggleTask = (taskId) => {
  const task = state.tasks.find(t => t.id === taskId);
  if (task) {
    task.isCompleted = !task.isCompleted;
    renderUI();
  }
};

const promptDeleteTask = (taskId) => {
  state.taskToDelete = taskId;
  elements.deleteModal.hidden = false;
};

const confirmDeleteTask = () => {
  if (state.taskToDelete) {
    state.tasks = state.tasks.filter(t => t.id !== state.taskToDelete);
    state.taskToDelete = null;
    elements.deleteModal.hidden = true;
    renderUI();
  }
};

const cancelDeleteTask = () => {
  state.taskToDelete = null;
  elements.deleteModal.hidden = true;
};

const handleClearCompleted = () => {
  state.tasks = state.tasks.filter(t => !t.isCompleted);
  renderUI();
};

const handleSetFilter = (filterValue) => {
  state.filter = filterValue;
  renderUI();
};

const handleSearch = (e) => {
  state.searchQuery = e.target.value;
  renderUI();
};

const handleToggleTheme = () => {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  renderUI();
};

// ==========================================
// 5. EVENT LISTENERS
// ==========================================
const setupEventListeners = () => {
  // Form submission
  elements.form.addEventListener('submit', handleAddTask);

  // Search & Filtering
  elements.searchInput.addEventListener('input', handleSearch);
  elements.filterTabs.forEach(tab => {
    tab.addEventListener('click', () => handleSetFilter(tab.dataset.filter));
  });

  // Task List Delegation
  elements.taskList.addEventListener('click', (e) => {
    // Checkbox toggle
    if (e.target.classList.contains('toggle-task')) {
      handleToggleTask(e.target.dataset.id);
    }
    // Delete button
    const deleteBtn = e.target.closest('.delete-btn');
    if (deleteBtn) {
      promptDeleteTask(deleteBtn.dataset.id);
    }
  });

  // Modal actions
  elements.modalConfirmBtn.addEventListener('click', confirmDeleteTask);
  elements.modalCancelBtn.addEventListener('click', cancelDeleteTask);
  
  // Clear completed
  elements.clearCompletedBtn.addEventListener('click', handleClearCompleted);
  
  // Theme toggle
  elements.themeToggle.addEventListener('click', handleToggleTheme);
};

// ==========================================
// 6. UTILITIES
// ==========================================
const escapeHTML = (str) => {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
};

const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// ==========================================
// 7. INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  renderUI(); // Initial render based on persisted state
});
