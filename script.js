const defaultTodos = [
    {
        id: 1,
        title: "Tugas Pemrograman Web",
        description: "Tugas E03a deadline jam 20.00 WIB.",
        priority: "high",
        date: "2026-10-05",
        category: "Kuliah",
        completed: false,
        image: null,
        notificationTime: null
    },

    {
        id: 2,
        title: "Tugas Teori Graf",
        description: "Deadline tugas Teori Graf jam 00.00 WIB.",
        priority: "high",
        date: "2026-10-06",
        category: "Kuliah",
        completed: false,
        image: null,
        notificationTime: null
    },

    {
        id: 3,
        title: "Tugas Matematika Diskrit",
        description:
            "Exercise 1.7: No. 4, 5, 17 Deadline jam 00.00 WIB.",
        priority: "high",
        date: "2026-10-08",
        category: "Kuliah",
        completed: false,
        image: null,
        notificationTime: null
    }
];


let todos = [];
let selectedTodoId = 1;
let database = null;
let cameraStream = null;
let capturedImage = null;

const todoList =
    document.getElementById("todo-list");

const todoCount =
    document.getElementById("todo-count");

const taskInfo =
    document.getElementById("task-info");

const todoForm =
    document.getElementById("todo-form");

const titleInput =
    document.getElementById("title");

const descriptionInput =
    document.getElementById("description");

const priorityInput =
    document.getElementById("priority");

const dateInput =
    document.getElementById("date");

const categoryInput =
    document.getElementById("category");

const notificationTimeInput =
    document.getElementById("notification-time");


const detailTitle =
    document.getElementById("detail-title");

const detailDate =
    document.getElementById("detail-date");

const detailStatus =
    document.getElementById("detail-status");

const detailPriority =
    document.getElementById("detail-priority");

const detailDue =
    document.getElementById("detail-due");

const detailCategory =
    document.getElementById("detail-category");

const detailDescription =
    document.getElementById("detail-description");

const detailImageContainer =
    document.getElementById("detail-image-container");

const detailImage =
    document.getElementById("detail-image");

const detailNotificationContainer =
    document.getElementById("detail-notification-container");

const detailNotification =
    document.getElementById("detail-notification");


const completeBtn =
    document.getElementById("complete-btn");

const editBtn =
    document.getElementById("edit-btn");

const deleteBtn =
    document.getElementById("delete-btn");

const themeBtn =
    document.getElementById("theme-btn");


const cameraPreview =
    document.getElementById("camera-preview");

const cameraCanvas =
    document.getElementById("camera-canvas");

const startCameraBtn =
    document.getElementById("start-camera-btn");

const captureBtn =
    document.getElementById("capture-btn");

const stopCameraBtn =
    document.getElementById("stop-camera-btn");

const capturedImageWrapper =
    document.getElementById("captured-image-wrapper");

const capturedImageElement =
    document.getElementById("captured-image");

const removeImageBtn =
    document.getElementById("remove-image-btn");


function openDatabase() {

    return new Promise(function(resolve, reject) {

        const request =
            indexedDB.open("TodoAppDatabase", 1);


        request.onupgradeneeded = function(event) {

            const db = event.target.result;

            if (!db.objectStoreNames.contains("todos")) {

                db.createObjectStore(
                    "todos",
                    {
                        keyPath: "id"
                    }
                );

            }

        };


        request.onsuccess = function(event) {

            database = event.target.result;

            resolve(database);

        };


        request.onerror = function() {

            reject(request.error);

        };

    });

}


function saveTodosToDatabase() {

    return new Promise(function(resolve, reject) {

        if (!database) {

            reject("Database belum tersedia.");

            return;

        }


        const transaction =
            database.transaction(
                ["todos"],
                "readwrite"
            );

        const store =
            transaction.objectStore("todos");


        store.clear();


        todos.forEach(function(todo) {

            store.put(todo);

        });


        transaction.oncomplete = function() {

            resolve();

        };


        transaction.onerror = function() {

            reject(transaction.error);

        };

    });

}


function loadTodosFromDatabase() {

    return new Promise(function(resolve, reject) {

        if (!database) {

            reject("Database belum tersedia.");

            return;

        }


        const transaction =
            database.transaction(
                ["todos"],
                "readonly"
            );

        const store =
            transaction.objectStore("todos");


        const request =
            store.getAll();


        request.onsuccess = function() {

            resolve(request.result);

        };


        request.onerror = function() {

            reject(request.error);

        };

    });

}


async function initializeDatabase() {

    try {

        await openDatabase();


        const storedTodos =
            await loadTodosFromDatabase();


        if (storedTodos.length === 0) {

            todos =
                JSON.parse(
                    JSON.stringify(defaultTodos)
                );

            await saveTodosToDatabase();

        } else {

            todos = storedTodos;

        }


        if (todos.length > 0) {

            selectedTodoId = todos[0].id;

        } else {

            selectedTodoId = null;

        }


        renderTodos();

        scheduleAllNotifications();

    } catch (error) {

        console.error(
            "IndexedDB error:",
            error
        );

        alert(
            "Tidak dapat membuka database."
        );

    }

}

function formatDate(date) {

    if (!date) {

        return "No deadline";

    }


    const parts =
        date.split("-");


    const year =
        parts[0];

    const month =
        Number(parts[1]);

    const day =
        parts[2];


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

function formatNotificationTime(value) {

    if (!value) {

        return "No notification";

    }


    const date =
        new Date(value);


    if (Number.isNaN(date.getTime())) {

        return "Invalid notification time";

    }


    return date.toLocaleString(
        "en-US",
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    );

}

function renderTodos() {

    todoList.innerHTML = "";


    const remainingTodos =
        todos.filter(function(todo) {

            return !todo.completed;

        });


    todoCount.textContent =
        remainingTodos.length;


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

        const article =
            document.createElement("article");


        article.className =
            "todo-item";


        article.setAttribute(
            "tabindex",
            "0"
        );


        article.setAttribute(
            "role",
            "button"
        );


        article.setAttribute(
            "aria-label",
            `Open todo ${todo.title}`
        );


        if (todo.id === selectedTodoId) {

            article.classList.add("active");

        }


        if (todo.completed) {

            article.classList.add("completed");

        }


        const priorityText =
            todo.priority.charAt(0).toUpperCase()
            +
            todo.priority.slice(1);


        article.innerHTML = `

            <div
                class="checkbox ${todo.completed ? "checked" : ""}"
                data-id="${todo.id}"
                role="checkbox"
                aria-checked="${todo.completed}"
                tabindex="0"
                aria-label="Mark ${todo.title} as complete"
            ></div>


            <div class="todo-content">

                <h3>
                    ${escapeHTML(todo.title)}
                </h3>

                <p>
                    Deadline: ${formatDate(todo.date)}
                </p>

                <span class="tag">
                    ${escapeHTML(todo.category)}
                </span>

            </div>


            <span class="priority ${todo.priority}">
                ${priorityText}
            </span>

        `;

        article.addEventListener(
            "click",
            function(event) {

                if (
                    event.target.classList.contains(
                        "checkbox"
                    )
                ) {

                    return;

                }


                selectedTodoId =
                    todo.id;


                renderTodos();

                showDetail(todo);

            }
        );

        article.addEventListener(
            "keydown",
            function(event) {

                if (
                    event.key === "Enter"
                    ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    selectedTodoId =
                        todo.id;

                    renderTodos();

                    showDetail(todo);

                }

            }
        );

        const checkbox =
            article.querySelector(
                ".checkbox"
            );


        checkbox.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                toggleTodo(todo.id);

            }
        );


        checkbox.addEventListener(
            "keydown",
            function(event) {

                if (
                    event.key === "Enter"
                    ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    event.stopPropagation();

                    toggleTodo(todo.id);

                }

            }
        );


        todoList.appendChild(article);

    });


    const selectedTodo =
        todos.find(function(todo) {

            return todo.id === selectedTodoId;

        });


    if (selectedTodo) {

        showDetail(selectedTodo);

    } else {

        selectedTodoId =
            todos[0].id;

        showDetail(todos[0]);

    }

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value;

    return div.innerHTML;

}

function showDetail(todo) {

    if (!todo) {

        return;

    }


    detailTitle.textContent =
        todo.title;


    detailDate.textContent =
        `Deadline: ${formatDate(todo.date)}`;


    detailDue.textContent =
        formatDate(todo.date);


    detailDescription.textContent =
        todo.description ||
        "No description.";


    detailPriority.textContent =
        todo.priority.charAt(0).toUpperCase()
        +
        todo.priority.slice(1);


    detailCategory.textContent =
        todo.category ||
        "Kuliah";


    if (todo.completed) {

        detailStatus.textContent =
            "Completed";

        completeBtn.textContent =
            "Mark as Incomplete";

    } else {

        detailStatus.textContent =
            "Not Started";

        completeBtn.textContent =
            "Mark as Complete";

    }

    if (todo.image) {

        detailImage.src =
            todo.image;

        detailImageContainer.hidden =
            false;

    } else {

        detailImage.src = "";

        detailImageContainer.hidden =
            true;

    }

    if (todo.notificationTime) {

        detailNotification.textContent =
            formatNotificationTime(
                todo.notificationTime
            );

        detailNotificationContainer.hidden =
            false;

    } else {

        detailNotification.textContent =
            "-";

        detailNotificationContainer.hidden =
            true;

    }

}

async function toggleTodo(id) {

    const todo =
        todos.find(function(todo) {

            return todo.id === id;

        });


    if (!todo) {

        return;

    }


    todo.completed =
        !todo.completed;


    selectedTodoId =
        id;


    await saveTodosToDatabase();

    renderTodos();

}


todoForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const title =
            titleInput.value.trim();


        const description =
            descriptionInput.value.trim();


        const priority =
            priorityInput.value;


        const date =
            dateInput.value;


        const category =
            categoryInput.value;


        const notificationTime =
            notificationTimeInput.value;


        if (title === "") {

            alert(
                "Please enter a todo title."
            );

            titleInput.focus();

            return;

        }


        const newTodo = {

            id: Date.now(),

            title: title,

            description: description,

            priority: priority,

            date: date,

            category: category,

            completed: false,

            image: capturedImage,

            notificationTime:
                notificationTime || null

        };


        todos.push(newTodo);


        selectedTodoId =
            newTodo.id;


        await saveTodosToDatabase();


        todoForm.reset();


        removeCapturedImage();


        renderTodos();


        if (notificationTime) {

            requestNotificationPermission();

            scheduleNotification(
                newTodo
            );

        }

    }
);

async function editTodo() {

    const todo =
        todos.find(function(todo) {

            return todo.id === selectedTodoId;

        });


    if (!todo) {

        alert(
            "Please select a todo first."
        );

        return;

    }


    const newTitle =
        prompt(
            "Edit todo title:",
            todo.title
        );


    if (newTitle === null) {

        return;

    }


    if (newTitle.trim() === "") {

        alert(
            "Todo title cannot be empty."
        );

        return;

    }


    const newDescription =
        prompt(
            "Edit description:",
            todo.description
        );


    todo.title =
        newTitle.trim();


    if (newDescription !== null) {

        todo.description =
            newDescription.trim();

    }


    await saveTodosToDatabase();

    renderTodos();

}

async function deleteTodo() {

    const todo =
        todos.find(function(todo) {

            return todo.id === selectedTodoId;

        });


    if (!todo) {

        alert(
            "Please select a todo first."
        );

        return;

    }


    const confirmation =
        confirm(
            `Delete "${todo.title}"?`
        );


    if (!confirmation) {

        return;

    }


    todos =
        todos.filter(function(todo) {

            return todo.id !== selectedTodoId;

        });


    if (todos.length > 0) {

        selectedTodoId =
            todos[0].id;

    } else {

        selectedTodoId =
            null;

    }


    await saveTodosToDatabase();

    renderTodos();

}

completeBtn.addEventListener(
    "click",
    function() {

        if (selectedTodoId === null) {

            alert(
                "Please select a todo first."
            );

            return;

        }


        toggleTodo(
            selectedTodoId
        );

    }
);


editBtn.addEventListener(
    "click",
    function() {

        editTodo();

    }
);


deleteBtn.addEventListener(
    "click",
    function() {

        deleteTodo();

    }
);

todoList.addEventListener(
    "dblclick",
    function(event) {

        const item =
            event.target.closest(
                ".todo-item"
            );


        if (!item) {

            return;

        }


        editTodo();

    }
);


function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            "todo-theme"
        );


    if (savedTheme === "dark") {

        document.body.classList.add(
            "dark-mode"
        );

        themeBtn.textContent =
            "☀️ Light Mode";

        themeBtn.setAttribute(
            "aria-label",
            "Switch to light mode"
        );

    } else {

        document.body.classList.remove(
            "dark-mode"
        );

        themeBtn.textContent =
            "🌙 Dark Mode";

        themeBtn.setAttribute(
            "aria-label",
            "Switch to dark mode"
        );

    }

}


themeBtn.addEventListener(
    "click",
    function() {

        document.body.classList.toggle(
            "dark-mode"
        );


        const darkMode =
            document.body.classList.contains(
                "dark-mode"
            );


        if (darkMode) {

            localStorage.setItem(
                "todo-theme",
                "dark"
            );


            themeBtn.textContent =
                "☀️ Light Mode";


            themeBtn.setAttribute(
                "aria-label",
                "Switch to light mode"
            );

        } else {

            localStorage.setItem(
                "todo-theme",
                "light"
            );


            themeBtn.textContent =
                "🌙 Dark Mode";


            themeBtn.setAttribute(
                "aria-label",
                "Switch to dark mode"
            );

        }

    }
);


async function startCamera() {

    try {

        cameraStream =
            await navigator.mediaDevices.getUserMedia(
                {
                    video: true,
                    audio: false
                }
            );


        cameraPreview.srcObject =
            cameraStream;


        captureBtn.disabled =
            false;


        stopCameraBtn.disabled =
            false;


        startCameraBtn.disabled =
            true;


    } catch (error) {

        console.error(
            "Camera error:",
            error
        );


        alert(
            "Camera tidak dapat digunakan. Pastikan browser memiliki izin kamera."
        );

    }

}


function captureImage() {

    if (!cameraStream) {

        return;

    }


    const width =
        cameraPreview.videoWidth;


    const height =
        cameraPreview.videoHeight;


    if (
        width === 0
        ||
        height === 0
    ) {

        alert(
            "Camera belum siap. Tunggu beberapa detik lalu coba lagi."
        );

        return;

    }


    cameraCanvas.width =
        width;


    cameraCanvas.height =
        height;


    const context =
        cameraCanvas.getContext(
            "2d"
        );


    context.drawImage(
        cameraPreview,
        0,
        0,
        width,
        height
    );


    capturedImage =
        cameraCanvas.toDataURL(
            "image/jpeg",
            0.8
        );


    capturedImageElement.src =
        capturedImage;


    capturedImageWrapper.hidden =
        false;

}


function stopCamera() {

    if (cameraStream) {

        cameraStream
            .getTracks()
            .forEach(function(track) {

                track.stop();

            });


        cameraStream =
            null;

    }


    cameraPreview.srcObject =
        null;


    captureBtn.disabled =
        true;


    stopCameraBtn.disabled =
        true;


    startCameraBtn.disabled =
        false;

}


function removeCapturedImage() {

    capturedImage =
        null;


    capturedImageElement.src =
        "";


    capturedImageWrapper.hidden =
        true;

}


startCameraBtn.addEventListener(
    "click",
    startCamera
);


captureBtn.addEventListener(
    "click",
    captureImage
);


stopCameraBtn.addEventListener(
    "click",
    stopCamera
);


removeImageBtn.addEventListener(
    "click",
    removeCapturedImage
);


async function requestNotificationPermission() {

    if (
        !("Notification" in window)
    ) {

        return;

    }


    if (
        Notification.permission ===
        "default"
    ) {

        await Notification.requestPermission();

    }

}


async function scheduleNotification(todo) {

    if (
        !todo.notificationTime
    ) {

        return;

    }


    const notificationDate =
        new Date(
            todo.notificationTime
        );


    const now =
        new Date();


    const delay =
        notificationDate.getTime()
        -
        now.getTime();


    if (delay <= 0) {

        return;

    }


    setTimeout(
        async function() {

            try {

                if (
                    Notification.permission !==
                    "granted"
                ) {

                    return;

                }


                const registration =
                    await navigator.serviceWorker.ready;


                registration.active.postMessage(
                    {
                        type:
                            "TODO_NOTIFICATION",

                        title:
                            "Todo Reminder",

                        body:
                            `Reminder: ${todo.title}`,

                        todoId:
                            todo.id
                    }
                );

            } catch (error) {

                console.error(
                    "Notification error:",
                    error
                );

            }

        },
        delay
    );

}


function scheduleAllNotifications() {

    todos.forEach(
        function(todo) {

            if (
                todo.notificationTime
                &&
                !todo.completed
            ) {

                scheduleNotification(
                    todo
                );

            }

        }
    );

}


if (
    "serviceWorker" in navigator
) {

    window.addEventListener(
        "load",
        function() {

            navigator.serviceWorker
                .register(
                    "service-worker.js"
                )
                .then(
                    function() {

                        console.log(
                            "Service Worker registered."
                        );

                    }
                )
                .catch(
                    function(error) {

                        console.error(
                            "Service Worker registration failed:",
                            error
                        );

                    }
                );

        }
    );

}
loadTheme();
initializeDatabase();

