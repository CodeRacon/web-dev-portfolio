<?php

require_once __DIR__ . '/protectedPortfolio.lib.php';

startProtectedPortfolioSession();
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendProtectedPortfolioJson(405, ['success' => false, 'error' => 'Invalid request method']);
}

$config = requireProtectedPortfolioConfig();
$configuredPassword = normalizeProtectedPortfolioPassword((string) ($config['password'] ?? ''));
$payload = json_decode(file_get_contents('php://input'), true);
$password = normalizeProtectedPortfolioPassword(
    is_array($payload) ? (string) ($payload['password'] ?? '') : ''
);
$language = normalizeProtectedPortfolioLanguage(
    is_array($payload) ? (string) ($payload['language'] ?? '') : ''
);

$isPasswordValid = $configuredPassword !== '' && hash_equals((string) $configuredPassword, $password);

if (!$isPasswordValid && !isProtectedPortfolioUnlocked()) {
    sendProtectedPortfolioJson(401, ['success' => false, 'error' => 'Invalid password']);
}

if ($isPasswordValid) {
    markProtectedPortfolioUnlocked();
}

sendProtectedPortfolioJson(200, [
    'success' => true,
    'projects' => buildProtectedPortfolioProjectsPayload($config, $language),
]);
