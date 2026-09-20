
const defaultTodos = [
    {
        id: 1,
        title: "Tugas Pemrograman Web",
        description: "Tugas E02a & E02b deadline jam 20.00 WIB.",
        priority: "high",
        date: "2026-09-21",
        category: "Kuliah",
        completed: false
    },

    {
        id: 2,
        title: "Tugas Teori Graf",
        description: "Deadline tugas Teori Graf jam 00.00 WIB.",
        priority: "high",
        date: "2026-09-22",
        category: "Kuliah",
        completed: false
    },

    {
        id: 3,
        title: "Tugas Matematika Diskrit",
        description: "Exercise 1.4: No. 15, 25 & Exercise 1.5: No. 27, 28 Deadline jam 00.00 WIB.",
        priority: "high",
        date: "2026-09-25",
        category: "Kuliah",
        completed: false
    }
];

let todos = JSON.parse(JSON.stringify(defaultTodos));
let selectedTodoId = 1;

const todoList = document.getElementById("todo-list");
const todoCount = document.getElementById("todo-count");
const taskInfo = document.getElementById("task-info");
const todoForm = document.getElementById("todo-form");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const priorityInput = document.getElementById("priority");
const dateInput = document.getElementById("date");
const detailTitle = document.getElementById("detail-title");
const detailDate = document.getElementById("detail-date");
const detailStatus = document.getElementById("detail-status");
const detailPriority = document.getElementById("detail-priority");
const detailDue = document.getElementById("detail-due");
const detailDescription = document.getElementById("detail-description");
const completeBtn = document.getElementById("complete-btn");
const deleteBtn = document.getElementById("delete-btn");
const themeBtn = document.getElementById("theme-btn");

function formatDate(date) {
    if (!date) {
        return "No deadline";
    }
    const parts = date.split("-");
    const year = parts[0];
    const month = Number(parts[1]);
    const day = parts[2];
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];
    return `${day} ${monthNames[month - 1]} ${year}`;
}
function renderTodos() {
    todoList.innerHTML = "";
    const remainingTodos = todos.filter(function(todo) {
        return !todo.completed;
    });
    todoCount.textContent = remainingTodos.length;
    taskInfo.textContent =
        `${remainingTodos.length} tasks remaining`;
    if (todos.length === 0) {
        todoList.innerHTML = `
            <div class="empty-state">
                <p>No todos yet 🌱</p>
                <p>Create a new task below!</p>
            </div>
        `;
        return;
    }
    todos.forEach(function(todo) {
        const article = document.createElement("article");
        article.className = "todo-item";
        if (todo.id === selectedTodoId) {
            article.classList.add("active");
        }
        if (todo.completed) {
            article.classList.add("completed");
        }

        const priorityText =
            todo.priority.charAt(0).toUpperCase()
            + todo.priority.slice(1);
        article.innerHTML = `
            <div
                class="checkbox ${todo.completed ? "checked" : ""}"
                data-id="${todo.id}">
            </div>
            <div class="todo-content">
                <h3>
                    ${todo.title}
                </h3>
                <p>
                    Deadline: ${formatDate(todo.date)}
                </p>
                <span class="tag">
                    ${todo.category}
                </span>
            </div>
            <span class="priority ${todo.priority}">
                ${priorityText}
            </span>
        `;
        article.addEventListener("click", function(event) {
            if (event.target.classList.contains("checkbox")) {
                return;
            }
            selectedTodoId = todo.id;
            renderTodos();
            showDetail(todo);
        });

        const checkbox =
            article.querySelector(".checkbox");
        checkbox.addEventListener("click", function(event) {
            event.stopPropagation();
            toggleTodo(todo.id);
        });


        todoList.appendChild(article);

    });

    const selectedTodo = todos.find(function(todo) {
        return todo.id === selectedTodoId;
    });
    if (selectedTodo) {
        showDetail(selectedTodo);
    } else if (todos.length > 0) {
        selectedTodoId = todos[0].id;
        showDetail(todos[0]);
    }
}

function showDetail(todo) {
    detailTitle.textContent = todo.title;
    detailDate.textContent =
        `Deadline: ${formatDate(todo.date)}`;
    detailDue.textContent =
        formatDate(todo.date);
    detailDescription.textContent =
        todo.description || "No description.";
    detailPriority.textContent =
        todo.priority.charAt(0).toUpperCase()
        + todo.priority.slice(1);
    if (todo.completed) {
        detailStatus.textContent = "Completed";
        completeBtn.textContent =
            "Mark as Incomplete";
    } else {
        detailStatus.textContent = "Not Started";
        completeBtn.textContent =
            "Mark as Complete";
    }

}

function toggleTodo(id) {
    const todo = todos.find(function(todo) {
        return todo.id === id;
    });
    if (!todo) {
        return;
    }
    todo.completed = !todo.completed;
    selectedTodoId = id;
    renderTodos();
}

todoForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const title = titleInput.value.trim();
    const description =
        descriptionInput.value.trim();
    const priority =
        priorityInput.value;
    const date =
        dateInput.value;

    if (title === "") {
        alert("Please enter a todo title.");
        return;
    }

    const newTodo = {
        id: Date.now(),
        title: title,
        description: description,
        priority: priority,
        date: date,
        category: "Kuliah",
        completed: false
    };
    todos.push(newTodo);
    selectedTodoId = newTodo.id;
    todoForm.reset();
    renderTodos();

});

function editTodo() {
    const todo = todos.find(function(todo) {
        return todo.id === selectedTodoId;
    });
    if (!todo) {
        alert("Please select a todo first.");
        return;
    }
    const newTitle =
        prompt("Edit todo title:", todo.title);
    if (newTitle === null) {
        return;
    }
    if (newTitle.trim() === "") {
        alert("Todo title cannot be empty.");
        return;
    }
    todo.title = newTitle.trim();
    const newDescription =
        prompt(
            "Edit description:",
            todo.description
        );
    if (newDescription !== null) {
        todo.description =
            newDescription.trim();
    }
    renderTodos();

}

function deleteTodo() {
    const todo = todos.find(function(todo) {
        return todo.id === selectedTodoId;
    });
    if (!todo) {
        alert("Please select a todo first.");
        return;
    }
    const confirmation =
        confirm(
            `Delete "${todo.title}"?`
        );
    if (!confirmation) {
        return;
    }
    todos = todos.filter(function(todo) {
        return todo.id !== selectedTodoId;
    });
    if (todos.length > 0) {
        selectedTodoId = todos[0].id;
    } else {
        selectedTodoId = null;
    }
    renderTodos();

}

completeBtn.addEventListener("click", function() {
    if (selectedTodoId === null) {
        alert("Please select a todo first.");
        return;
    }
    toggleTodo(selectedTodoId);
});

deleteBtn.addEventListener("click", function() {
    deleteTodo();
});

todoList.addEventListener("dblclick", function(event) {
    const item =
        event.target.closest(".todo-item");
    if (!item) {
        return;
    }
    editTodo();
});

themeBtn.addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");
    const darkMode =
        document.body.classList.contains("dark-mode");
    if (darkMode) {
        themeBtn.textContent =
            "☀️ Light Mode";
    } else {
        themeBtn.textContent =
            "🌙 Dark Mode";
    }
});

renderTodos();