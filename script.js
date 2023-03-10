/* Variables */
let todoItems = []
const todoInput = document.querySelector('.todo-input')
const completedTodosDiv = document.querySelector('.completed-todos')
const pendingTodosDiv = document.querySelector('.pending-todos')
const audio = new Audio('sound.mp3')

/* Display Todo List */
window.onload = () => {
  let storageTodoItems = localStorage.getItem('todoItems')
  if (storageTodoItems !== null) {
    todoItems = JSON.parse(storageTodoItems)
  }
  render()
}

// Input Bar
todoInput.onkeyup = ((e) => {
  let value = e.target.value.replace(/^\s+/, "")
  if (value && e.keyCode === 13) { // Enter
    addTodo(value)

    todoInput.value = ''
    todoInput.focus()
  }
})

// Add into List
function addTodo(text) {
  todoItems.push({
    id: Date.now(),
    text,
    completed: false
  })
  console.log(todoItems)
  saveAndRender()
}

// Remove toDo
function removeTodo(id) {
  todoItems = todoItems.filter(todo => todo.id !== Number(id))
  saveAndRender()
}

// Mark completed
function markCompleted(id) {
  todoItems = todoItems.filter(todo => {
    if (todo.id === Number(id)) {
      todo.completed = true
    }
    return todo
  })

  audio.play()
  saveAndRender()
}

// Mark pending
function markPending(id) {
  todoItems = todoItems.filter(todo => {
    if (todo.id === Number(id)) {
      todo.completed = false
    }
    return todo
  })

  saveAndRender()
}

// Save toDo
function save() {
  localStorage.setItem('todoItems', JSON.stringify(todoItems))
}

// Render
function render() {
  let pendingTodos = todoItems.filter(item => !item.completed)
  let completedTodos = todoItems.filter(item => item.completed)

  completedTodosDiv.innerHTML = ''
  pendingTodosDiv.innerHTML = ''

  if (pendingTodos.length > 0) {
    pendingTodos.forEach(todo => {
      pendingTodosDiv.append(createTodoElement(todo))
    })
  } else {
    pendingTodosDiv.innerHTML = `<div class = 'empty'>No pending task</div>`
  }

  if (completedTodos.length > 0) {
    completedTodosDiv.innerHTML = `<div class='completed-title'>Completed (${completedTodos.length} / ${todoItems.length})</div>`

    completedTodos.forEach(todo => {
      completedTodosDiv.append(createTodoElement(todo))
    })
  }
}

// Save and Render
function saveAndRender() {
  save()
  render()
}

// Create todo list item
function createTodoElement(todo) {
  //toDoList container
  const todoDiv = document.createElement('div')
  todoDiv.setAttribute('data-id', todo.id)
  todoDiv.className = 'todo-item'

  //toDoList Text
  const todoTextSpan = document.createElement('span')
  todoTextSpan.innerHTML = todo.text

  //Checkbox
  const todoInputCheckbox = document.createElement('input')
  todoInputCheckbox.type = 'checkbox'
  todoInputCheckbox.checked = todo.completed
  todoInputCheckbox.onclick = (e) => {
    let id = e.target.closest('.todo-item').dataset.id
    e.target.checked ? markCompleted(id) : markPending(id)
  }

  //Delete cross
  const todoRemoveBtn = document.createElement('a')
  todoRemoveBtn.href = '#'
  todoRemoveBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="24" height="24"
              viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
              stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M18 6l-12 12"></path>
              <path d="M6 6l12 12"></path>
            </svg>`

  todoRemoveBtn.onclick = (e) => {
    let id = e.target.closest('.todo-item').dataset.id
    removeTodo(id)
  }

  todoTextSpan.prepend(todoInputCheckbox)
  todoDiv.appendChild(todoTextSpan)
  todoDiv.appendChild(todoRemoveBtn)

  return todoDiv
}

