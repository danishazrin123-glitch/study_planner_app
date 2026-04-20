let tasks;
try {
    tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    if (!Array.isArray(tasks)) tasks = [];
} catch {
    tasks = [];
}

const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const reminderBox = document.getElementById("reminderBox");

// Format date (for display only)
function formatDate(dateString) {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
}

// Get today in SAME format as input (yyyy-mm-dd)
function getTodayString() {
    const today = new Date();
    return today.toISOString().split("T")[0];
}

// Duration
function duration(start, end) {
    const s = new Date(start);
    const e = new Date(end);

    return Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + " days";
}

// Days left
function daysLeft(dateString) {
    const today = new Date(getTodayString());
    const deadline = new Date(dateString);

    return Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
}

// ✅ FIXED (STRING COMPARE — VERY IMPORTANT)
function isStartToday(startDate) {
    return startDate === getTodayString();
}

// Display tasks
function displayTasks() {
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        let days = daysLeft(task.date);
        if (days < 0) return;

        const div = document.createElement("div");

        if (isStartToday(task.startDate)) {
            div.classList.add("start-today");
        }

        div.innerHTML = `
            <h3>${task.title}</h3>
            <p>Subject: ${task.subject}</p>
            <p>Start: ${formatDate(task.startDate)}</p>
            <p>Deadline: ${formatDate(task.date)}</p>
            <p>Duration: ${duration(task.startDate, task.date)}</p>

            <button onclick="completeTask(${index})">Complete</button>
            <button onclick="deleteTask(${index})">Delete</button>
        `;

        taskList.appendChild(div);
    });

    updateReminder();
}

// Add task
taskForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const subject = document.getElementById("subject").value;
    const startDate = document.getElementById("startDate").value;
    const date = document.getElementById("date").value;

    tasks.push({ title, subject, startDate, date });
    localStorage.setItem("tasks", JSON.stringify(tasks));

    taskForm.reset();
    displayTasks();
});

function deleteTask(index) {
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTasks();
}

function completeTask(index) {
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTasks();
}

// Reminder
function updateReminder() {
    const today = new Date(getTodayString());

    const alertTasks = tasks.map((task, index) => {
        const deadline = new Date(task.date);
        const diff = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

        if (diff < 0) {
            return `
                <div class="overdue">
                    <h3>❌ ${task.title}</h3>
                    <p>Subject: ${task.subject}</p>
                    <p>Start: ${formatDate(task.startDate)}</p>
                    <p>Deadline: ${formatDate(task.date)} (OVERDUE)</p>

                    <button onclick="completeTask(${index})">Complete</button>
                    <button onclick="deleteTask(${index})">Delete</button>
                </div>
            `;
        } else if (diff <= 2) {
            return `
                <div>
                    ⚠️ ${task.title} (${task.subject}) due soon!
                </div>
            `;
        }

        return "";
    });

    const content = alertTasks.filter(x => x !== "").join("");

    reminderBox.innerHTML = content || "No urgent tasks.";
}

displayTasks();