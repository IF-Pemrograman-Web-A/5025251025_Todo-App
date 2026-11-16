
<?php
require_once __DIR__ . '/../config.php';

header('Content-Type: application/json; charset=utf-8');

function response(int $status, array $data): never {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function getInput(): array {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!is_array($input)) {
        response(400, [
            'success' => false,
            'message' => 'Invalid JSON request body.'
        ]);
    }

    return $input;
}

function findTodo(PDO $pdo, int $id, string $scope, int $uid): ?array {
    if ($scope === 'shared') {
        $stmt = $pdo->prepare(
            "SELECT * FROM todos WHERE id = ? AND scope = 'shared'"
        );
        $stmt->execute([$id]);
    } else {
        $stmt = $pdo->prepare(
            "SELECT * FROM todos
             WHERE id = ? AND scope = 'personal' AND owner_id = ?"
        );
        $stmt->execute([$id, $uid]);
    }

    $todo = $stmt->fetch();

    return $todo ?: null;
}

function checkCsrf(): void {
    $token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';

    if (empty($_SESSION['csrf']) ||
        !hash_equals($_SESSION['csrf'], $token)) {
        response(403, [
            'success' => false,
            'message' => 'Invalid CSRF token.'
        ]);
    }
}

$method = $_SERVER['REQUEST_METHOD'];
$uid = demo_user_id();

$scope = $_GET['scope'] ?? 'personal';

if (!in_array($scope, ['personal', 'shared'], true)) {
    response(400, [
        'success' => false,
        'message' => 'Invalid scope.'
    ]);
}

$id = isset($_GET['id']) ? filter_var($_GET['id'], FILTER_VALIDATE_INT) : null;

if (isset($_GET['id']) && (!$id || $id < 1)) {
    response(400, [
        'success' => false,
        'message' => 'Invalid Todo ID.'
    ]);
}

try {

    // GET: Read Todo
    if ($method === 'GET') {

        if ($id !== null) {
            $todo = findTodo($pdo, $id, $scope, $uid);

            if (!$todo) {
                response(404, [
                    'success' => false,
                    'message' => 'Todo not found.'
                ]);
            }

            response(200, [
                'success' => true,
                'data' => $todo
            ]);
        }

        if ($scope === 'shared') {
            $stmt = $pdo->query(
                "SELECT * FROM todos
                 WHERE scope = 'shared'
                 ORDER BY created_at DESC"
            );
        } else {
            $stmt = $pdo->prepare(
                "SELECT * FROM todos
                 WHERE scope = 'personal' AND owner_id = ?
                 ORDER BY created_at DESC"
            );
            $stmt->execute([$uid]);
        }

        response(200, [
            'success' => true,
            'data' => $stmt->fetchAll()
        ]);
    }

// Check supported HTTP methods first.
$allowedMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

if (!in_array($method, $allowedMethods, true)) {
    header('Allow: GET, POST, PUT, PATCH, DELETE');

    response(405, [
        'success' => false,
        'message' => 'Method not allowed.'
    ]);
}

// All methods below require CSRF validation.
if ($method !== 'GET') {
    checkCsrf();
}

    // POST: Create Todo
    if ($method === 'POST') {

        $input = getInput();

        $title = trim($input['title'] ?? '');

        if ($title === '' || strlen($title) > 150) {
            response(422, [
                'success' => false,
                'message' => 'Title is required and must not exceed 150 characters.'
            ]);
        }

        $description = $input['description'] ?? '';
        $priority = $input['priority'] ?? 'medium';
        $category = $input['category'] ?? 'Kuliah';
        $dueDate = $input['due_date'] ?? null;
        $notificationTime = $input['notification_time'] ?? null;

        if (!in_array($priority, ['high', 'medium', 'low'], true)) {
            response(422, [
                'success' => false,
                'message' => 'Invalid priority.'
            ]);
        }

        if (!in_array($category, ['Kuliah', 'Personal', 'Organization'], true)) {
            response(422, [
                'success' => false,
                'message' => 'Invalid category.'
            ]);
        }

        $stmt = $pdo->prepare(
            "INSERT INTO todos
            (owner_id, title, description, priority, due_date,
             category, scope, notification_time)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        );

        $stmt->execute([
            $uid,
            $title,
            $description,
            $priority,
            $dueDate ?: null,
            $category,
            $scope,
            $notificationTime ?: null
        ]);

        $newId = (int) $pdo->lastInsertId();

        response(201, [
            'success' => true,
            'message' => 'Todo created successfully.',
            'data' => findTodo($pdo, $newId, $scope, $uid)
        ]);
    }

    // PUT/PATCH: Update Todo
    if ($method === 'PUT' || $method === 'PATCH') {

        if ($id === null) {
            response(400, [
                'success' => false,
                'message' => 'Todo ID is required.'
            ]);
        }

        $todo = findTodo($pdo, $id, $scope, $uid);

        if (!$todo) {
            response(404, [
                'success' => false,
                'message' => 'Todo not found.'
            ]);
        }

        $input = getInput();

        $allowed = [
            'title',
            'description',
            'priority',
            'due_date',
            'category',
            'completed',
            'notification_time'
        ];

        if ($method === 'PUT') {
            $required = [
                'title',
                'description',
                'priority',
                'due_date',
                'category',
                'completed',
                'notification_time'
            ];

            foreach ($required as $field) {
                if (!array_key_exists($field, $input)) {
                    response(422, [
                        'success' => false,
                        'message' => "Missing field: $field"
                    ]);
                }
            }
        }

        $updates = [];

        foreach ($allowed as $field) {
            if (array_key_exists($field, $input)) {
                $updates[$field] = $input[$field];
            }
        }

        if (isset($updates['title'])) {
            $updates['title'] = trim($updates['title']);

            if ($updates['title'] === '' ||
                strlen($updates['title']) > 150) {
                response(422, [
                    'success' => false,
                    'message' => 'Invalid title.'
                ]);
            }
        }

        if (isset($updates['priority']) &&
            !in_array($updates['priority'], ['high', 'medium', 'low'], true)) {
            response(422, [
                'success' => false,
                'message' => 'Invalid priority.'
            ]);
        }

        if (isset($updates['category']) &&
            !in_array($updates['category'], ['Kuliah', 'Personal', 'Organization'], true)) {
            response(422, [
                'success' => false,
                'message' => 'Invalid category.'
            ]);
        }

        if (isset($updates['completed']) &&
            !in_array($updates['completed'], [0, 1, '0', '1', true, false], true)) {
            response(422, [
                'success' => false,
                'message' => 'Invalid completed value.'
            ]);
        }

        if (isset($updates['completed'])) {
            $updates['completed'] = (int) (bool) $updates['completed'];
        }

        if (!$updates) {
            response(400, [
                'success' => false,
                'message' => 'No fields to update.'
            ]);
        }

        $set = [];
        foreach (array_keys($updates) as $field) {
            $set[] = "$field = ?";
        }

        $values = array_values($updates);
        $values[] = $id;

        $sql = "UPDATE todos SET " . implode(', ', $set) . " WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($values);

        response(200, [
            'success' => true,
            'message' => 'Todo updated successfully.',
            'data' => findTodo($pdo, $id, $scope, $uid)
        ]);
    }

    // DELETE: Delete Todo
    if ($method === 'DELETE') {

        if ($id === null) {
            response(400, [
                'success' => false,
                'message' => 'Todo ID is required.'
            ]);
        }

        $todo = findTodo($pdo, $id, $scope, $uid);

        if (!$todo) {
            response(404, [
                'success' => false,
                'message' => 'Todo not found.'
            ]);
        }

        if ($todo['image_path']) {
            $path = realpath(__DIR__ . '/../' . $todo['image_path']);
            $uploads = realpath(__DIR__ . '/../uploads');

            if ($path && $uploads &&
                str_starts_with($path, $uploads . DIRECTORY_SEPARATOR) &&
                is_file($path)) {
                unlink($path);
            }
        }

        $stmt = $pdo->prepare("DELETE FROM todos WHERE id = ?");
        $stmt->execute([$id]);

        response(200, [
            'success' => true,
            'message' => 'Todo deleted successfully.'
        ]);
    }

    response(405, [
        'success' => false,
        'message' => 'Method not allowed.'
    ]);

} catch (PDOException $e) {

    response(500, [
        'success' => false,
        'message' => 'Database operation failed.'
    ]);
}
