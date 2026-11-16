
<?php
require 'config.php';

$scope = ($_GET['scope'] ?? 'personal') === 'shared' ? 'shared' : 'personal';
$pageTitle = ucfirst($scope) . ' Todos | My To Do List';
$selectedId = (int)($_GET['selected'] ?? 0);

require 'header.php';
?>

<main id="main-content" class="workspace">

<?php require 'menubar.php'; ?>

<section class="todo-panel" aria-labelledby="list-title">

    <div class="panel-header">
        <div>
            <span class="eyebrow" id="workspace-label">
                <?= $scope === 'shared' ? 'TEAM WORKSPACE' : 'YOUR WORKSPACE' ?>
            </span>

            <h2 id="list-title"><?= ucfirst($scope) ?> Todos</h2>

            <p id="tasks-info">Loading tasks...</p>
        </div>

        <span class="todo-count" id="todo-count">0</span>
    </div>

    <div id="todo-list" class="todo-list">
        Loading todos...
    </div>

</section>

<aside class="detail-panel">

    <div id="todo-detail">
        <h2>Loading details...</h2>
    </div>

</aside>

<section class="new-todo-section">

    <form id="todo-form" class="todo-form"
          method="post"
          action="actions.php"
          enctype="multipart/form-data">

        <input type="hidden" name="csrf_token" value="<?= e(csrf_token()) ?>">
        <input type="hidden" name="action" value="create">
        <input type="hidden" name="scope" value="<?= e($scope) ?>">

        <span class="eyebrow">NEW TASK</span>
        <h2>Create a New To Do</h2>

        <div class="form-group">
            <label for="title">To Do Title</label>
            <input
                id="title"
                name="title"
                maxlength="150"
                required
                placeholder="Enter your task..."
            >
        </div>

        <div class="form-group">
            <label for="description">Description</label>
            <textarea
                id="description"
                name="description"
                rows="3"
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
                <label for="due_date">Due Date</label>
                <input id="due_date" type="date" name="due_date">
            </div>

        </div>

        <div class="form-row">

            <div class="form-group">
                <label for="category">Category</label>
                <select id="category" name="category">
                    <option>Kuliah</option>
                    <option>Personal</option>
                    <option>Organization</option>
                </select>
            </div>

            <div class="form-group">
                <label for="notification_time">
                    Reminder Time (optional)
                </label>
                <input
                    id="notification_time"
                    type="datetime-local"
                    name="notification_time"
                >
            </div>

        </div>

        <div class="form-group">
            <label for="attachment">Image attachment (optional)</label>
            <input
                id="attachment"
                type="file"
                name="attachment"
                accept="image/png,image/jpeg,image/webp"
            >
            <small>Maximum 2 MB. PNG, JPG, or WEBP.</small>
        </div>

        <button class="add-btn" type="submit">+ Add Todo</button>

    </form>

</section>

</main>

<footer class="footer">
    © 2026 My To Do List · The Iron Citadel
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
