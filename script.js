// ── DOM references ───────────────────────────────────────────
const list             = document.getElementById('todo-list');
const itemCountSpan    = document.getElementById('item-count');
const uncheckedCountSpan = document.getElementById('unchecked-count');
const doneCountSpan    = document.getElementById('done-count');
const input            = document.getElementById('new-todo-input');

// ── Data structure ───────────────────────────────────────────
// Each todo: { id: number, text: string, done: boolean }
let todos = loadFromStorage();

// ── Init ─────────────────────────────────────────────────────
render(todos);
updateCounter(todos);

// Enter key support
input.addEventListener('keydown', e => {
  if (e.key === 'Enter') newTodo();
});

// ── Task 1, step 3: newTodo ───────────────────────────────────
function newTodo() {
  const text = input.value.trim();
  if (!text) return;

  const todo = {
    id: Date.now(),
    text: text,
    done: false
  };

  todos.push(todo);
  input.value = '';

  saveToStorage();
  render(todos);
  updateCounter(todos);
}

// ── Task 1, step 4: renderTodo ───────────────────────────────
function renderTodo(todo) {
  return `
    <li class="todo-item ${todo.done ? 'checked' : ''}" data-id="${todo.id}">
      <input
        type="checkbox"
        id="todo-${todo.id}"
        ${todo.done ? 'checked' : ''}
        onchange="checkTodo(${todo.id})"
      />
      <label for="todo-${todo.id}">${escapeHtml(todo.text)}</label>
      <button class="btn-delete" onclick="deleteTodo(${todo.id})">видалити</button>
    </li>
  `;
}

// ── Task 1, step 5: render ───────────────────────────────────
function render(todos) {
  if (todos.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="icon">📋</div>
        Список порожній. Додайте перше завдання!
      </div>
    `;
    return;
  }

  const html = todos.map(renderTodo).join('');
  list.innerHTML = html;
}

// ── Task 1, step 6: updateCounter ────────────────────────────
function updateCounter(todos) {
  const total    = todos.length;
  const done     = todos.filter(t => t.done).length;
  const undone   = total - done;

  itemCountSpan.textContent    = total;
  uncheckedCountSpan.textContent = undone;
  if (doneCountSpan) doneCountSpan.textContent = done;
}

// ── Task 1, step 7: deleteTodo ───────────────────────────────
function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  saveToStorage();
  render(todos);
  updateCounter(todos);
}

// ── Task 1, step 8: checkTodo ────────────────────────────────
function checkTodo(id) {
  todos = todos.map(t =>
    t.id === id ? { ...t, done: !t.done } : t
  );
  saveToStorage();
  render(todos);
  updateCounter(todos);
}

// ── Task 3: LocalStorage ─────────────────────────────────────
function saveToStorage() {
  localStorage.setItem('todos_pd21', JSON.stringify(todos));
}

function loadFromStorage() {
  try {
    const data = localStorage.getItem('todos_pd21');
    return data ? JSON.parse(data) : getDefaultTodos();
  } catch {
    return getDefaultTodos();
  }
}

function getDefaultTodos() {
  return [
    { id: 1, text: 'Вивчити HTML', done: true },
    { id: 2, text: 'Вивчити CSS',  done: true },
    { id: 3, text: 'Вивчити JavaScript', done: false },
  ];
}

// ── Helper ───────────────────────────────────────────────────
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
