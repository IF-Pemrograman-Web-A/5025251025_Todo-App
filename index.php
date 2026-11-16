
<?php
require 'config.php';

$scope = ($_GET['scope'] ?? 'personal') === 'shared' ? 'shared' : 'personal';
$pageTitle = ucfirst($scope) . ' Todos | My To Do List';
$selectedId = (int)($_GET['selected'] ?? 0);

require 'header.php';
?>

<main id="main-content" class="workspace">

    <?php require 'menubar.php'; ?>

    <section class="container">

        <!-- TODO LIST -->
        <section class="todo-panel" aria-labelledby="todo-list-title">

            <div class="panel-header">
                <div>
                    <span class="eyebrow" id="workspace-label">
                        <?= $scope === 'shared' ? 'TEAM WORKSPACE' : 'YOUR WORKSPACE' ?>
                    </span>

                    <h2 id="todo-list-title">
                        <?= ucfirst($scope) ?> Todos
                    </h2>

                    <p id="task-info" aria-live="polite">
                        Loading tasks...
                    </p>
                </div>

                <span
                    id="todo-count"
                    class="todo-count"
                    aria-label="Number of remaining tasks"
                >0</span>
            </div>

            <div id="todo-list" class="todo-list" aria-live="polite">
                Loading todos...
            </div>

        </section>

        <!-- TODO DETAILS -->
        <aside class="detail-panel" aria-labelledby="detail-title">

            <div class="detail-header">
                <span class="label">TO DO DETAILS</span>

                <h2 id="detail-title">Select a Todo</h2>

                <p id="detail-date">Deadline: -</p>
            </div>

            <div class="detail-info">

                <div class="info-item">
                    <span class="info-label">Status</span>
                    <strong id="detail-status">-</strong>
                </div>

                <div class="info-item">
                    <span class="info-label">Priority</span>
                    <strong id="detail-priority">-</strong>
                </div>

                <div class="info-item">
                    <span class="info-label">Due Date</span>
                    <strong id="detail-due">-</strong>
                </div>

                <div class="info-item">
                    <span class="info-label">Category</span>
                    <strong id="detail-category">-</strong>
                </div>

            </div>

            <div class="description">
                <h3>Description</h3>
                <p id="detail-description">-</p>
            </div>

            <div
                id="detail-image-container"
                class="detail-image-container"
                hidden
            >
                <span class="info-label">Captured Image</span>

                <img
                    id="detail-image"
                    class="detail-image"
                    src=""
                    alt="Captured image for this todo"
                >
            </div>

            <div
                id="detail-notification-container"
                class="notification-detail"
                hidden
            >
                <span class="info-label">Notification</span>
                <strong id="detail-notification">-</strong>
            </div>

            <div class="actions">

                <button
                    id="edit-btn"
                    class="btn edit-btn"
                    type="button"
                >
                    Edit Todo
                </button>

                <button
                    id="complete-btn"
                    class="btn complete-btn"
                    type="button"
                >
                    Mark as Complete
                </button>

                <button
                    id="delete-btn"
                    class="btn delete-btn"
                    type="button"
                >
                    Delete Todo
                </button>

            </div>

        </aside>

    </section>

    <!-- CREATE TODO -->
    <section
        class="new-todo-section"
        aria-labelledby="new-task-title"
    >

        <form
            id="todo-form"
            class="todo-form"
            method="post"
            action="actions.php"
            enctype="multipart/form-data"
        >

            <input
                type="hidden"
                name="csrf_token"
                value="<?= e(csrf_token()) ?>"
            >

            <input type="hidden" name="action" value="create">
            <input type="hidden" name="scope" value="<?= e($scope) ?>">

            <div class="form-heading">
                <span class="label">NEW TASK</span>

                <h2 id="new-task-title">
                    Create a New To Do
                </h2>
            </div>

            <div class="form-group">
                <label for="title">To Do Title</label>

                <input
                    type="text"
                    id="title"
                    name="title"
                    maxlength="150"
                    placeholder="Enter your task..."
                    required
                >
            </div>

            <div class="form-group">
                <label for="description">Description</label>

                <textarea
                    id="description"
                    name="description"
                    rows="4"
                    placeholder="Describe your task..."
                ></textarea>
            </div>

            <div class="form-row">

                <div class="form-group">
                    <label for="priority">Priority</label>

                    <select id="priority" name="priority">
                        <option value="high">High</option>
                        <option value="medium" selected>Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="date">Due Date</label>

                    <input
                        type="date"
                        id="date"
                        name="date"
                    >
                </div>

            </div>

            <div class="form-group">
                <label for="category">Category</label>

                <select id="category" name="category">
                    <option value="Kuliah">Kuliah</option>
                    <option value="Personal">Personal</option>
                    <option value="Organization">Organization</option>
                </select>
            </div>

            <div class="form-group">
                <label for="notification-time">
                    Notification Time
                </label>

                <input
                    type="datetime-local"
                    id="notification-time"
                    name="notification-time"
                >

                <small class="form-help">
                    Set when you want to receive a notification.
                </small>
            </div>

            <!-- CAMERA -->
            <fieldset class="camera-section">

                <legend>Todo Image</legend>

                <p class="camera-description">
                    You can capture an image using your camera.
                </p>

                <div class="camera-preview-wrapper">

                    <video
                        id="camera-preview"
                        class="camera-preview"
                        autoplay
                        playsinline
                        muted
                        aria-label="Camera preview"
                    ></video>

                    <canvas id="camera-canvas" hidden></canvas>

                </div>

                <div class="camera-buttons">

                    <button
                        type="button"
                        id="start-camera-btn"
                        class="camera-btn"
                    >
                        📷 Start Camera
                    </button>

                    <button
                        type="button"
                        id="capture-btn"
                        class="camera-btn"
                        disabled
                    >
                        📸 Capture Image
                    </button>

                    <button
                        type="button"
                        id="stop-camera-btn"
                        class="camera-btn"
                        disabled
                    >
                        Stop Camera
                    </button>

                </div>

                <div
                    id="captured-image-wrapper"
                    class="captured-image-wrapper"
                    hidden
                >

                    <p>Captured Image:</p>

                    <img
                        id="captured-image"
                        class="captured-image"
                        src=""
                        alt="Preview of captured todo image"
                    >

                    <button
                        type="button"
                        id="remove-image-btn"
                        class="remove-image-btn"
                    >
                        Remove Image
                    </button>

                </div>

            </fieldset>

            <button type="submit" class="add-btn">
                + Add Todo
            </button>

        </form>

    </section>

</main>

<footer class="footer">
    <p>&copy; 2026 My To Do List · The Iron Citadel</p>
</footer>

<script>
    window.API_URL = 'api/todos.php';
    window.TODO_SCOPE = <?= json_encode($scope) ?>;
    window.SELECTED_ID = <?= json_encode($selectedId) ?>;
    window.CSRF_TOKEN = <?= json_encode(csrf_token()) ?>;
</script>

<script src="script.js"></script>

</body>
</html>
