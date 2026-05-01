<?php

require_once __DIR__ . '/lib/divindades.php';

header('Content-Type: application/json; charset=utf-8');

$idDivindade = $_GET['id'] ?? '';
if ($idDivindade === '') {
    echo json_encode(['success' => false, 'message' => 'id da divindade ausente.']);
    exit;
}

$d = getDivindadeParaUI($idDivindade);
if (!$d) {
    echo json_encode(['success' => false, 'message' => 'divindade não encontrada.']);
    exit;
}

echo json_encode(['success' => true, 'divindade' => $d], JSON_UNESCAPED_UNICODE);
