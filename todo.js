let tasks = [];
let currentFilter = "all"; //  all, today, pending, overdue
let editIndex = null; // Track the index of the task being edited

async function fetchTasks(){
  const res = await fetch("https://todoapp-5qzv.onrender.com/");
  tasks = await res.json();
  renderTasks();
}

fetchTasks();

function openAddModal() { // Open modal for adding/editing task
  document.getElementById("modal").style.display = "block"; // Show modal
}

function closeModal() {   // Close modal and reset form
  document.getElementById("modal").style.display = "none"; // Hide modal
}

// function saveTask() { // Save new or edited task
//   const name = document.getElementById("taskName").value;// Get task name from input field
//   const date = document.getElementById("taskDate").value;// Get task date from input field

//   if (!name || !date)
//      return alert("Fill all fields"); // Validate input fields

//   if (editIndex !== null) { // If editing an existing task, update it
//     tasks[editIndex].name = name; // Update task details
//     tasks[editIndex].date = date;// Update task details
//     editIndex = null;
//   } else {
//     tasks.push({ // Add new task to tasks array 
//       name,
//       date,
//       completed: false // New tasks are not completed by default
//     });
//   }

//  // Save tasks to localStorage
//   renderTasks(); // Re-render task lists
//   closeModal();
// }

async function saveTask() {
  const name = document.getElementById("taskName").value;
  const date = document.getElementById("taskDate").value;

  if (!name || !date) return alert("Fill all fields");

  if (editIndex !== null) {

    await fetch(`https://todoapp-5qzv.onrender.com/tasks/${tasks[editIndex]._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, date })
    });

    editIndex = null;

  } else {

    await fetch("https://todoapp-5qzv.onrender.com/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, date, completed:false })
    });

  }

  fetchTasks();
  closeModal();
}


function editTask(index) { // Open modal with task details for editing
  document.getElementById("taskName").value = tasks[index].name;// Set task name in input field
  document.getElementById("taskDate").value = tasks[index].date; // Set task date in input field
  editIndex = index; // Set editIndex to track which task is being edited
  openAddModal(); 
}

// function deleteTask(index) { // Delete task from tasks array
//   tasks.splice(index, 1);  // Remove task at specified index
//   saveLocal(); 
//   renderTasks(); 
// }
async function deleteTask(index) {
  await fetch('https://todoapp-5qzv.onrender.com/tasks/${tasks[index]._id}`, {
    method: "DELETE"
  });

  fetchTasks();
}


// function toggleComplete(index) {// Toggle the completed status of a task
//   tasks[index].completed = !tasks[index].completed; // Toggle completed status
//   saveLocal();
//   renderTasks();
// }
async function toggleComplete(index){
  await fetch(`https://todoapp-5qzv.onrender.com/tasks/${tasks[index]._id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed: !tasks[index].completed })
  });

  fetchTasks();
}


function isToday(date) {// Check if the given date is today 
 return new Date(date).toDateString() === new Date().toDateString();
}

function isOverdue(date) { // Check if the given date is in the past and not today
  return new Date(date) < new Date() && !isToday(date); // A task is overdue if its date is before today and it's not completed
}

function filterTasks(type) {// Set the current filter and re-render tasks based on the selected filter
  currentFilter = type;//    Update current filter type
  renderTasks();
}

function renderTasks() {
  const taskList = document.getElementById("taskList");
  const completedList = document.getElementById("completedList");

  taskList.innerHTML = "";
  completedList.innerHTML = "";

  tasks.forEach((task, index) => {

    if (currentFilter === "today" && !isToday(task.date)) return;  // If filter is "today" and task date is not today, skip rendering this task
    if (currentFilter === "pending" && (task.completed || isOverdue(task.date))) return; // If filter is "pending" and task is completed or overdue, skip rendering this task
    if (currentFilter === "overdue" && !isOverdue(task.date)) return; // If filter is "overdue" and task is not overdue, skip rendering this task

    const div = document.createElement("div");
    div.className = "task";

    div.innerHTML = `
      <div>
        <input type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleComplete(${index})">
        <span class="${task.completed ? 'completed' : ''}">${task.name}</span>
        <br>
        <small>${task.date}</small>
      </div>

      <div class="actions">
        <button onclick="editTask(${index})">Edit</button>
        <button onclick="deleteTask(${index})">Delete</button>
      </div>
    `;

    if (task.completed) {
      completedList.appendChild(div);
    } else {
      taskList.appendChild(div);
    }
  });
}

renderTasks();


