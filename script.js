let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="${task.completed ? 'completed' : ''}">
        <strong>${task.title}</strong><br>
        Subject: ${task.subject}<br>
        Deadline: ${task.deadline}
      </div>
      <div class="task-buttons">
        <button onclick="toggleTask(${index})">Complete</button>
        <button onclick="deleteTask(${index})">Delete</button>
      </div>
    `;
    taskList.appendChild(li);
  });

  checkReminders();
}

function addTask() {
  const title = document.getElementById("taskTitle").value;
  const subject = document.getElementById("subject").value;
  const deadline = document.getElementById("deadline").value;

  if (title === "" || subject === "" || deadline === "") {
    alert("Please fill in all fields.");
    return;
  }

  tasks.push({
    title,
    subject,
    deadline,
    completed: false
  });

  saveTasks();
  renderTasks();

  document.getElementById("taskTitle").value = "";
  document.getElementById("subject").value = "";
  document.getElementById("deadline").value = "";
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function checkReminders() {
  const reminderBox = document.getElementById("reminderBox");
  const today = new Date().toISOString().split("T")[0];

  let urgentTasks = tasks.filter(task => !task.completed && task.deadline <= today);

  if (urgentTasks.length > 0) {
    reminderBox.innerHTML = urgentTasks.map(task =>
      `⚠️ <strong>${task.title}</strong> (${task.subject}) is due on <strong>${task.deadline}</strong>`
    ).join("<br><br>");

    // Optional popup alert
    alert("Reminder: You have task(s) due today or overdue!");
  } else {
    reminderBox.innerHTML = "No urgent tasks.";
  }
}

renderTasks();