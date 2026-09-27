/**
 * ==========================================================================
 * To-Do Web App - Pure Vanilla JavaScript State Management & DOM Logic
 * Track: Oasis Infobyte (OIBSIP) Web Development Internship - Level 2 Task 3
 * ==========================================================================
 */

(function () {
  'use strict';

  // --- Constants & Storage Keys ---
  const STORAGE_KEY = 'todoTasks_v2';

  // --- Initial Default Tasks (Initially only one task) ---
  const DEFAULT_TASKS = [
    {
      id: 'task-1',
      text: 'Complete internship assignment',
      completed: false,
      createdAt: '2026-09-27T10:30:00.000Z',
      completedAt: null
    }
  ];

  // --- State ---
  let tasks = [];

  // --- DOM Element References ---
  const addTaskForm = document.getElementById('add-task-form');
  const taskInput = document.getElementById('task-input');
  const inputWrapper = document.querySelector('.input-wrapper');
  const formFeedback = document.getElementById('form-feedback');

  const pendingList = document.getElementById('pending-list');
  const completedList = document.getElementById('completed-list');

  const pendingCountBadge = document.getElementById('pending-count-badge');
  const completedCountBadge = document.getElementById('completed-count-badge');

  const pendingEmpty = document.getElementById('pending-empty');
  const completedEmpty = document.getElementById('completed-empty');

  const pendingMotivation = document.getElementById('pending-motivation');
  const completedCelebration = document.getElementById('completed-celebration');

  // ==========================================================================
  // Helper: Date & Time Formatter
  // Produces formatted string like: "Sep 27, 2026 • 10:30 AM"
  // ==========================================================================
  function formatTimestamp(isoString) {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return '';

      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = months[date.getMonth()];
      const day = date.getDate();
      const year = date.getFullYear();

      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 becomes 12

      return `${month} ${day}, ${year} • ${hours}:${minutes} ${ampm}`;
    } catch (e) {
      return '';
    }
  }

  // ==========================================================================
  // LocalStorage Persistence
  // ==========================================================================
  function saveToLocalStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.warn('LocalStorage is not available or quota exceeded:', error);
    }
  }

  function loadFromLocalStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          tasks = parsed;
          return;
        }
      }
    } catch (error) {
      console.warn('Error reading tasks from LocalStorage:', error);
    }
    // If no saved tasks or error, initialize with default sample tasks
    tasks = [...DEFAULT_TASKS];
    saveToLocalStorage();
  }

  // ==========================================================================
  // Task Counts & Empty States
  // ==========================================================================
  function updateTaskCounts() {
    const pendingCount = tasks.filter(t => !t.completed).length;
    const completedCount = tasks.filter(t => t.completed).length;

    // Update count pill badges
    pendingCountBadge.textContent = `${pendingCount} pending`;
    completedCountBadge.textContent = `${completedCount} completed`;

    // Toggle Empty State for Pending
    if (pendingCount === 0) {
      pendingEmpty.classList.remove('hidden');
      if (pendingMotivation) pendingMotivation.style.display = 'none';
    } else {
      pendingEmpty.classList.add('hidden');
      if (pendingMotivation) pendingMotivation.style.display = 'flex';
    }

    // Toggle Empty State for Completed
    if (completedCount === 0) {
      completedEmpty.classList.remove('hidden');
      if (completedCelebration) completedCelebration.style.display = 'none';
    } else {
      completedEmpty.classList.add('hidden');
      if (completedCelebration) completedCelebration.style.display = 'flex';
    }
  }

  // ==========================================================================
  // Task Card Element Generator
  // ==========================================================================
  function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-card ${task.completed ? 'completed-card' : 'pending-card'}`;
    li.setAttribute('data-id', task.id);

    // 1. Left Checkbox / Toggle Icon Button
    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'task-toggle-btn';
    toggleBtn.setAttribute('aria-label', task.completed ? 'Mark task as pending' : 'Mark task as complete');

    if (task.completed) {
      toggleBtn.innerHTML = `
        <span class="circle-checked" title="Completed! Click to mark as pending">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </span>
      `;
    } else {
      toggleBtn.innerHTML = `
        <span class="circle-check" title="Click to complete task"></span>
      `;
    }

    // 2. Center Content Box (Text + Timestamps)
    const contentBox = document.createElement('div');
    contentBox.className = 'task-content-box';

    const textSpan = document.createElement('span');
    textSpan.className = 'task-text';
    textSpan.textContent = task.text;
    contentBox.appendChild(textSpan);

    const metaRow = document.createElement('div');
    metaRow.className = 'task-meta-row';

    // Added Timestamp
    const createdFormatted = formatTimestamp(task.createdAt);
    if (createdFormatted) {
      const createdItem = document.createElement('span');
      createdItem.className = 'task-meta-item';
      createdItem.innerHTML = `
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <span>Added: ${createdFormatted}</span>
      `;
      metaRow.appendChild(createdItem);
    }

    // Completed Timestamp (if completed)
    if (task.completed && task.completedAt) {
      const completedFormatted = formatTimestamp(task.completedAt);
      if (completedFormatted) {
        const completedItem = document.createElement('span');
        completedItem.className = 'task-meta-item';
        completedItem.innerHTML = `
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span>Completed: ${completedFormatted}</span>
        `;
        metaRow.appendChild(completedItem);
      }
    }

    contentBox.appendChild(metaRow);

    // 3. Right Action Buttons Group
    const actionsGroup = document.createElement('div');
    actionsGroup.className = 'task-actions-group';

    // Mark Complete Button (for Pending tasks)
    if (!task.completed) {
      const completeBtn = document.createElement('button');
      completeBtn.type = 'button';
      completeBtn.className = 'action-btn btn-complete';
      completeBtn.setAttribute('aria-label', `Complete task: ${task.text}`);
      completeBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Complete</span>
      `;
      completeBtn.addEventListener('click', () => completeTask(task.id));
      actionsGroup.appendChild(completeBtn);

      // Edit Button (for Pending tasks)
      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = 'action-btn btn-edit';
      editBtn.setAttribute('aria-label', `Edit task: ${task.text}`);
      editBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
        </svg>
        <span>Edit</span>
      `;
      editBtn.addEventListener('click', () => startInlineEdit(task.id, li));
      actionsGroup.appendChild(editBtn);
    }

    // Delete Button (Available for BOTH Pending & Completed)
    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'action-btn btn-delete';
    deleteBtn.setAttribute('aria-label', `Delete task: ${task.text}`);
    deleteBtn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
      </svg>
      <span>Delete</span>
    `;
    deleteBtn.addEventListener('click', () => deleteTask(task.id));
    actionsGroup.appendChild(deleteBtn);

    // Toggle button event
    toggleBtn.addEventListener('click', () => toggleTaskCompletion(task.id));

    // Assemble Li
    li.appendChild(toggleBtn);
    li.appendChild(contentBox);
    li.appendChild(actionsGroup);

    return li;
  }

  // ==========================================================================
  // Render All Tasks
  // ==========================================================================
  function renderTasks() {
    // Clear both list containers
    pendingList.innerHTML = '';
    completedList.innerHTML = '';

    // Render Pending Tasks
    const pendingTasks = tasks.filter(t => !t.completed);
    pendingTasks.forEach(task => {
      pendingList.appendChild(createTaskElement(task));
    });

    // Render Completed Tasks
    const completedTasks = tasks.filter(t => t.completed);
    completedTasks.forEach(task => {
      completedList.appendChild(createTaskElement(task));
    });

    // Update Counts & Empty states
    updateTaskCounts();
  }

  // ==========================================================================
  // Add Task Function
  // ==========================================================================
  function addTask(event) {
    if (event) event.preventDefault();

    const rawValue = taskInput.value;
    const trimmedValue = rawValue.trim();

    // Empty Input Validation
    if (!trimmedValue) {
      showInputError('Please enter a task.');
      return;
    }

    // Clear feedback
    clearInputError();

    // Create new task object
    const newTask = {
      id: 'task-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      text: trimmedValue,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null
    };

    // Add to state (prepend to pending list)
    tasks.unshift(newTask);

    // Persist & Update UI
    saveToLocalStorage();
    renderTasks();

    // Reset input
    taskInput.value = '';
    taskInput.focus();

    // Flash success helper briefly
    formFeedback.textContent = 'Task added successfully!';
    formFeedback.className = 'form-feedback success';
    setTimeout(() => {
      formFeedback.textContent = 'Press Enter to add a task';
      formFeedback.className = 'form-feedback';
    }, 2000);
  }

  // Input Error State Helpers
  function showInputError(message) {
    formFeedback.textContent = message;
    formFeedback.className = 'form-feedback error';
    inputWrapper.classList.add('input-error');
    taskInput.focus();

    setTimeout(() => {
      inputWrapper.classList.remove('input-error');
    }, 600);
  }

  function clearInputError() {
    formFeedback.textContent = 'Press Enter to add a task';
    formFeedback.className = 'form-feedback';
    inputWrapper.classList.remove('input-error');
  }

  // ==========================================================================
  // Complete / Toggle Task
  // ==========================================================================
  function completeTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    task.completed = true;
    task.completedAt = new Date().toISOString();

    saveToLocalStorage();
    renderTasks();
  }

  function toggleTaskCompletion(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date().toISOString() : null;

    saveToLocalStorage();
    renderTasks();
  }

  // ==========================================================================
  // Delete Task
  // ==========================================================================
  function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
    saveToLocalStorage();
    renderTasks();
  }

  // ==========================================================================
  // Inline Edit Task
  // Switches the task card content into an inline editable form
  // ==========================================================================
  function startInlineEdit(taskId, cardElement) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Check if card is already in editing mode
    if (cardElement.classList.contains('is-editing')) return;

    cardElement.classList.add('is-editing');
    const originalHTML = cardElement.innerHTML;

    // Render Inline Edit UI
    cardElement.innerHTML = `
      <div class="edit-form-container">
        <div class="edit-input-wrapper">
          <input 
            type="text" 
            class="edit-input" 
            value="${escapeHtml(task.text)}" 
            maxlength="150"
            aria-label="Edit task description"
          >
          <span class="edit-error-msg">Task cannot be empty.</span>
        </div>
        <div class="edit-actions-row">
          <button type="button" class="btn-cancel">Cancel</button>
          <button type="button" class="btn-save">Save</button>
        </div>
      </div>
    `;

    const editInput = cardElement.querySelector('.edit-input');
    const errorMsg = cardElement.querySelector('.edit-error-msg');
    const saveBtn = cardElement.querySelector('.btn-save');
    const cancelBtn = cardElement.querySelector('.btn-cancel');

    // Auto-focus and place cursor at end
    editInput.focus();
    editInput.setSelectionRange(editInput.value.length, editInput.value.length);

    // Save Action
    const performSave = () => {
      const newText = editInput.value.trim();
      if (!newText) {
        errorMsg.classList.add('visible');
        editInput.focus();
        return;
      }

      task.text = newText;
      saveToLocalStorage();
      renderTasks();
    };

    // Cancel Action
    const performCancel = () => {
      cardElement.classList.remove('is-editing');
      cardElement.innerHTML = originalHTML;
      // Re-attach event listeners by rendering
      renderTasks();
    };

    // Event Listeners for Inline Edit
    saveBtn.addEventListener('click', performSave);
    cancelBtn.addEventListener('click', performCancel);

    editInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        performSave();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        performCancel();
      }
    });

    editInput.addEventListener('input', () => {
      if (editInput.value.trim()) {
        errorMsg.classList.remove('visible');
      }
    });
  }

  // HTML escaping helper to prevent XSS during inline edit injection
  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ==========================================================================
  // Event Listeners Registration
  // ==========================================================================
  function initEventListeners() {
    // Form submission
    addTaskForm.addEventListener('submit', addTask);

    // Clear error message when user starts typing
    taskInput.addEventListener('input', () => {
      if (taskInput.value.trim()) {
        clearInputError();
      }
    });

    // Keyboard support: Enter in input triggers task addition
    taskInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addTask();
      }
    });
  }

  // ==========================================================================
  // App Initialization
  // ==========================================================================
  function init() {
    loadFromLocalStorage();
    initEventListeners();
    renderTasks();
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
