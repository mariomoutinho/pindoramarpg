<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

$stateFile = __DIR__ . '/data/campo-batalha-state.json';

if (!is_file($stateFile)) {
    echo json_encode([
        'success' => true,
        'state' => null,
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

$raw = file_get_contents($stateFile);
if ($raw === false || trim($raw) === '') {
    echo json_encode([
        'success' => true,
        'state' => null,
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

$state = json_decode($raw, true);
if (!is_array($state)) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'O estado salvo do Campo de Batalha está inválido.',
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

echo json_encode([
    'success' => true,
    'state' => $state,
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
