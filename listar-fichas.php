<?php

require_once 'config.php';

header('Content-Type: application/json');

$stmt = $pdo->query("
    SELECT id, participante, personagem, classe, nivel, updated_at
    FROM fichas
    ORDER BY updated_at DESC
");

echo json_encode($stmt->fetchAll());