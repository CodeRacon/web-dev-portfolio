<?php

require_once __DIR__ . '/protectedPortfolio.lib.php';

startProtectedPortfolioSession();

if (!isProtectedPortfolioUnlocked()) {
    http_response_code(403);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    exit;
}

$projectId = isset($_GET['project']) && is_string($_GET['project']) ? $_GET['project'] : '';
$showcaseId = isset($_GET['showcase']) && is_string($_GET['showcase']) ? $_GET['showcase'] : '';

if ($projectId === '' || $showcaseId === '') {
    http_response_code(400);
    exit;
}

$config = requireProtectedPortfolioConfig();
$showcase = findProtectedPortfolioShowcase($config, $projectId, $showcaseId);

if ($showcase === null || !is_array($showcase['screenshot'] ?? null)) {
    http_response_code(404);
    exit;
}

$contentRoot = getProtectedPortfolioContentRoot($config);
$file = $showcase['screenshot']['file'] ?? null;
$filePath = is_string($file) ? resolveProtectedPortfolioFilePath($contentRoot, $file) : null;

if ($filePath === null || !is_file($filePath)) {
    http_response_code(404);
    exit;
}

$mimeType = mime_content_type($filePath) ?: 'application/octet-stream';
header('Content-Type: ' . $mimeType);
header('Content-Length: ' . (string) filesize($filePath));
header('Cache-Control: private, max-age=300');
readfile($filePath);
exit;
