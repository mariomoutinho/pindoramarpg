<?php

require_once __DIR__ . '/lib/origens.php';

header('Content-Type: application/json; charset=utf-8');

$idOrigem = $_GET['id'] ?? '';
if ($idOrigem === '') {
    echo json_encode(['success' => false, 'message' => 'id da origem ausente.']);
    exit;
}

$origem = getOrigemParaUI($idOrigem);
if (!$origem) {
    echo json_encode(['success' => false, 'message' => 'origem não encontrada.']);
    exit;
}

echo json_encode(['success' => true, 'origem' => $origem], JSON_UNESCAPED_UNICODE);
