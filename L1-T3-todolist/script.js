let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const pendingEl = document.getElementById("pendingTasks");
const completedEl = document.getElementById("completedTasks");
const pendingSection = document.getElementById("pendingSection");
const completedSection = document.getElementById("completedSection");

const searchEl = document.getElementById("search");
const filterEl = document.getElementById("filter");
const themeToggle = document.getElementById("themeToggle");
const addBtn = document.getElementById("addBtn");

let draggedId = null;

/* SAVE */
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* RENDER */
function renderTasks() {
    pendingEl.innerHTML = "";
    completedEl.innerHTML = "";

    const search = searchEl.value.toLowerCase();
    const filter = filterEl.value;

    /* COLUMN VISIBILITY */
    if (filter === "all") {
        pendingSection.style.display = "block";
        completedSection.style.display = "block";
    } else if (filter === "pending") {
        pendingSection.style.display = "block";
        completedSection.style.display = "none";
    } else {
        pendingSection.style.display = "none";
        completedSection.style.display = "block";
    }

    tasks.forEach(task => {
        if (
            !task.title.toLowerCase().includes(search) &&
            !task.description.toLowerCase().includes(search)
        ) return;

        if (filter !== "all" && task.status !== filter) return;

        const div = document.createElement("div");
        div.className = "task";
        div.draggable = true;

        div.innerHTML = `
            <strong>${task.title}</strong>
            <p>${task.description}</p>
            <small>${task.time}</small>
            <div class="task-actions">
                <button class="complete-btn">${task.status === "pending" ? "Complete" : "Undo"}</button>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        div.querySelector(".complete-btn").onclick = () => toggleStatus(task.id);
        div.querySelector(".edit-btn").onclick = () => editTask(task.id);
        div.querySelector(".delete-btn").onclick = () => deleteTask(task.id);

        div.addEventListener("dragstart", () => draggedId = task.id);
        div.addEventListener("dragend", () => draggedId = null);

        task.status === "pending"
            ? pendingEl.appendChild(div)
            : completedEl.appendChild(div);
    });
}

/* ADD */
addBtn.onclick = () => {
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();

    if (!title || !description) {
        alert("Please fill all fields");
        return;
    }

    tasks.push({
        id: Date.now(),
        title,
        description,
        status: "pending",
        time: "Added: " + new Date().toLocaleString()
    });

    saveTasks();
    renderTasks();

    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
};

/* STATUS */
function toggleStatus(id) {
    const task = tasks.find(t => t.id === id);
    task.status = task.status === "pending" ? "completed" : "pending";
    task.time =
        (task.status === "completed" ? "Completed: " : "Added: ")
        + new Date().toLocaleString();

    saveTasks();
    renderTasks();
}

/* DELETE */
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}

/* EDIT */
function editTask(id) {
    const task = tasks.find(t => t.id === id);
    const title = prompt("Edit title", task.title);
    const desc = prompt("Edit description", task.description);

    if (title && desc) {
        task.title = title;
        task.description = desc;
        saveTasks();
        renderTasks();
    }
}

/* SEARCH & FILTER */
searchEl.oninput = renderTasks;
filterEl.onchange = renderTasks;

/* DRAG & DROP */
[pendingEl, completedEl].forEach(list => {
    list.addEventListener("dragover", e => e.preventDefault());
    list.addEventListener("drop", () => {
        if (!draggedId) return;
        toggleStatus(draggedId);
    });
});

/* THEME */
themeToggle.onclick = () => {
    document.body.classList.toggle("dark");
};

renderTasks();
