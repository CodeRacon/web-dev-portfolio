<?php

const PROTECTED_PORTFOLIO_SESSION_KEY = 'protected_portfolio_unlocked';

function startProtectedPortfolioSession(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    session_set_cookie_params([
        'httponly' => true,
        'samesite' => 'Lax',
    ]);

    session_start();
}

function sendProtectedPortfolioJson(int $statusCode, array $payload): void
{
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload);
    exit;
}

function normalizeProtectedPortfolioPassword(string $password): string
{
    return preg_replace('/[\s\x00-\x1F\x7F\x{200B}-\x{200D}\x{FEFF}]+/u', '', $password) ?? '';
}

function normalizeProtectedPortfolioLanguage(string $language): string
{
    $normalizedLanguage = strtolower(substr(trim($language), 0, 2));

    return in_array($normalizedLanguage, ['de', 'en'], true) ? $normalizedLanguage : 'en';
}

function requireProtectedPortfolioConfig(): array
{
    $configPath = __DIR__ . '/protectedPortfolio.config.php';

    if (!file_exists($configPath)) {
        sendProtectedPortfolioJson(500, [
            'success' => false,
            'error' => 'Protected portfolio config missing',
        ]);
    }

    $config = require $configPath;

    if (!is_array($config)) {
        sendProtectedPortfolioJson(500, [
            'success' => false,
            'error' => 'Protected portfolio config invalid',
        ]);
    }

    return $config;
}

function markProtectedPortfolioUnlocked(): void
{
    $_SESSION[PROTECTED_PORTFOLIO_SESSION_KEY] = true;
}

function isProtectedPortfolioUnlocked(): bool
{
    return !empty($_SESSION[PROTECTED_PORTFOLIO_SESSION_KEY]);
}

function getProtectedPortfolioContentRoot(array $config): string
{
    $configuredRoot = $config['contentRoot'] ?? (__DIR__ . '/protected-portfolio-content');

    if (!is_string($configuredRoot) || trim($configuredRoot) === '') {
        return __DIR__ . '/protected-portfolio-content';
    }

    if (str_starts_with($configuredRoot, DIRECTORY_SEPARATOR)) {
        return $configuredRoot;
    }

    return __DIR__ . '/' . ltrim($configuredRoot, '/');
}

function buildProtectedPortfolioProjectsPayload(array $config, string $language = 'en'): array
{
    $projects = is_array($config['projects'] ?? null) ? $config['projects'] : [];
    $contentRoot = getProtectedPortfolioContentRoot($config);
    $language = normalizeProtectedPortfolioLanguage($language);
    $payload = [];

    foreach ($projects as $projectId => $project) {
        if (!is_string($projectId) || !is_array($project)) {
            continue;
        }

        $payload[$projectId] = [
            'title' => getProtectedPortfolioLocalizedString($project, 'title', $language),
            'summary' => getProtectedPortfolioLocalizedString($project, 'summary', $language),
            'details' => getProtectedPortfolioLocalizedStringList($project, 'details', $language),
            'note' => getProtectedPortfolioLocalizedString($project, 'note', $language),
            'links' => buildProtectedPortfolioLinksPayload($project['links'] ?? []),
            'showcases' => buildProtectedPortfolioShowcasesPayload(
                $projectId,
                $project['showcases'] ?? [],
                $contentRoot,
                $language
            ),
        ];
    }

    return $payload;
}

function getProtectedPortfolioLocalizedString(array $source, string $key, string $language): string
{
    $localizedValue = $source['translations'][$language][$key] ?? null;

    if (is_string($localizedValue)) {
        return $localizedValue;
    }

    $fallbackValue = $source[$key] ?? null;

    return is_string($fallbackValue) ? $fallbackValue : '';
}

function getProtectedPortfolioLocalizedStringList(array $source, string $key, string $language): array
{
    $localizedValue = $source['translations'][$language][$key] ?? null;
    $fallbackValue = $source[$key] ?? null;
    $value = is_array($localizedValue) ? $localizedValue : $fallbackValue;

    return array_values(array_filter(
        is_array($value) ? $value : [],
        'is_string'
    ));
}

function buildProtectedPortfolioLinksPayload(mixed $links): array
{
    if (!is_array($links)) {
        return [];
    }

    $payload = [];

    foreach ($links as $link) {
        if (!is_array($link)) {
            continue;
        }

        $label = $link['label'] ?? null;
        $url = $link['url'] ?? null;

        if (!is_string($label) || !is_string($url) || $label === '' || $url === '') {
            continue;
        }

        $payload[] = [
            'label' => $label,
            'url' => $url,
        ];
    }

    return $payload;
}

function buildProtectedPortfolioShowcasesPayload(
    string $projectId,
    mixed $showcases,
    string $contentRoot,
    string $language = 'en'
): array {
    if (!is_array($showcases)) {
        return [];
    }

    $payload = [];

    foreach ($showcases as $index => $showcase) {
        if (!is_array($showcase)) {
            continue;
        }

        $showcaseId = is_string($showcase['id'] ?? null) && $showcase['id'] !== ''
            ? $showcase['id']
            : 'showcase-' . ($index + 1);

        $screenshot = buildProtectedPortfolioScreenshotPayload(
            $projectId,
            $showcaseId,
            $showcase['screenshot'] ?? null,
            $contentRoot
        );

        $snippet = buildProtectedPortfolioSnippetPayload(
            $showcase['snippet'] ?? null,
            $contentRoot
        );

        $payload[] = [
            'id' => $showcaseId,
            'title' => getProtectedPortfolioLocalizedString($showcase, 'title', $language),
            'caption' => getProtectedPortfolioLocalizedString($showcase, 'caption', $language),
            'screenshot' => $screenshot,
            'snippet' => $snippet,
        ];
    }

    return $payload;
}

function buildProtectedPortfolioScreenshotPayload(
    string $projectId,
    string $showcaseId,
    mixed $screenshot,
    string $contentRoot
): ?array {
    if (!is_array($screenshot)) {
        return null;
    }

    $file = $screenshot['file'] ?? null;
    if (!is_string($file) || $file === '') {
        return null;
    }

    $resolvedPath = resolveProtectedPortfolioFilePath($contentRoot, $file);
    if ($resolvedPath === null) {
        return null;
    }

    return [
        'url' => 'protectedPortfolioAsset.php?project=' . rawurlencode($projectId)
            . '&showcase=' . rawurlencode($showcaseId),
        'alt' => is_string($screenshot['alt'] ?? null) ? $screenshot['alt'] : $showcaseId,
    ];
}

function buildProtectedPortfolioSnippetPayload(mixed $snippet, string $contentRoot): ?array
{
    if (!is_array($snippet)) {
        return null;
    }

    $file = $snippet['file'] ?? null;
    if (!is_string($file) || $file === '') {
        return null;
    }

    $resolvedPath = resolveProtectedPortfolioFilePath($contentRoot, $file);
    if ($resolvedPath === null) {
        return null;
    }

    $code = file_get_contents($resolvedPath);
    if ($code === false) {
        return null;
    }

    return [
        'language' => is_string($snippet['language'] ?? null) ? $snippet['language'] : '',
        'sourceLabel' => is_string($snippet['sourceLabel'] ?? null)
            ? $snippet['sourceLabel']
            : basename($file),
        'code' => $code,
    ];
}

function resolveProtectedPortfolioFilePath(string $contentRoot, string $relativePath): ?string
{
    $normalizedRoot = realpath($contentRoot);
    if ($normalizedRoot === false) {
        return null;
    }

    $normalizedRelativePath = trim(str_replace('\\', '/', $relativePath), '/');

    if (
        $normalizedRelativePath === ''
        || str_contains($normalizedRelativePath, '../')
        || str_starts_with($normalizedRelativePath, '..')
    ) {
        return null;
    }

    $candidatePath = realpath($normalizedRoot . '/' . $normalizedRelativePath);
    if ($candidatePath === false) {
        return null;
    }

    if (!str_starts_with($candidatePath, $normalizedRoot)) {
        return null;
    }

    return $candidatePath;
}

function findProtectedPortfolioShowcase(array $config, string $projectId, string $showcaseId): ?array
{
    $projects = is_array($config['projects'] ?? null) ? $config['projects'] : [];
    $project = $projects[$projectId] ?? null;

    if (!is_array($project) || !is_array($project['showcases'] ?? null)) {
        return null;
    }

    foreach ($project['showcases'] as $index => $showcase) {
        if (!is_array($showcase)) {
            continue;
        }

        $candidateId = is_string($showcase['id'] ?? null) && $showcase['id'] !== ''
            ? $showcase['id']
            : 'showcase-' . ($index + 1);

        if ($candidateId === $showcaseId) {
            return $showcase;
        }
    }

    return null;
}
