<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$basePath = __DIR__;
$dataFile = $basePath . '/data/tasks.json';
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

function readTasks($file)
{
    if (!file_exists($file)) {
        file_put_contents($file, json_encode([]));
    }
    $raw = file_get_contents($file);
    return json_decode($raw, true) ?: [];
}

function writeTasks($file, $tasks)
{
    file_put_contents($file, json_encode(array_values($tasks), JSON_PRETTY_PRINT));
}

if ($uri === '/api/tasks' && $method === 'GET') {
    echo json_encode(readTasks($dataFile));
    exit;
}

if ($uri === '/api/tasks' && $method === 'POST') {
    $payload = json_decode(file_get_contents('php://input'), true);
    if (!$payload || empty($payload['title'])) {
        http_response_code(400);
        echo json_encode(['error' => 'title is required']);
        exit;
    }

    $tasks = readTasks($dataFile);
    $newTask = [
        'id' => uniqid('task_', true),
        'title' => trim($payload['title']),
        'description' => trim($payload['description'] ?? ''),
        'status' => $payload['status'] ?? 'todo',
        'created_at' => date('c'),
    ];
    $tasks[] = $newTask;
    writeTasks($dataFile, $tasks);
    echo json_encode($newTask);
    exit;
}

$match = null;
if (preg_match('#^/api/tasks/([^/]+)$#', $uri, $match)) {
    $taskId = $match[1];
    if ($method === 'PATCH') {
        $payload = json_decode(file_get_contents('php://input'), true);
        $tasks = readTasks($dataFile);
        foreach ($tasks as &$task) {
            if ($task['id'] === $taskId) {
                if (isset($payload['status'])) {
                    $task['status'] = $payload['status'];
                }
                if (isset($payload['title'])) {
                    $task['title'] = trim($payload['title']);
                }
                if (isset($payload['description'])) {
                    $task['description'] = trim($payload['description']);
                }
                writeTasks($dataFile, $tasks);
                echo json_encode($task);
                exit;
            }
        }
        http_response_code(404);
        echo json_encode(['error' => 'task not found']);
        exit;
    }
}

http_response_code(404);
echo json_encode(['error' => 'Endpoint not found']);
