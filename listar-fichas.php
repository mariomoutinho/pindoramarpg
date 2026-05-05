<?php

require_once 'config.php';

header('Content-Type: application/json');

$stmt = $pdo->query("
    SELECT
        id,
        participante,
        personagem,
        ancestralidade,
        classe,
        nivel,
        personagem_imagem,
        personagem_imagem_ajuste,
        personagem_token_imagem,
        personagem_token_imagem_ajuste,
        updated_at
    FROM fichas
    ORDER BY updated_at DESC
");

echo json_encode($stmt->fetchAll());
