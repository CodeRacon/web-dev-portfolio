<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Invalid request method']);
    exit;
}

$configPath = __DIR__ . '/protectedPortfolio.config.php';

if (!file_exists($configPath)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Protected portfolio config missing']);
    exit;
}

$config = require $configPath;
$configuredPassword = normalizePassword((string) ($config['password'] ?? ''));
$projects = $config['projects'] ?? [];
$payload = json_decode(file_get_contents('php://input'), true);
$password = normalizePassword(is_array($payload) ? (string) ($payload['password'] ?? '') : '');

if ($configuredPassword === '' || !hash_equals((string) $configuredPassword, $password)) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Invalid password']);
    exit;
}

echo json_encode([
    'success' => true,
    'projects' => $projects,
]);

function normalizePassword(string $password): string
{
    return preg_replace('/[\s\x00-\x1F\x7F\x{200B}-\x{200D}\x{FEFF}]+/u', '', $password) ?? '';
}
