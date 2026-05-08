<?php

require_once __DIR__ . '/includes/auth.php';
exigirLogin();

require_once 'config.php';
require_once __DIR__ . '/includes/permissions.php';

header('Content-Type: application/json');

$colunas = "
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
";

if (isFacilitador()) {
    $stmt = $pdo->query("SELECT $colunas FROM fichas ORDER BY updated_at DESC");
    echo json_encode($stmt->fetchAll());
} else {
    $u = usuarioLogado();
    $stmt = $pdo->prepare(
        "SELECT $colunas FROM fichas WHERE usuario_id = :uid ORDER BY updated_at DESC"
    );
    $stmt->execute(['uid' => (int) $u['id']]);
    echo json_encode($stmt->fetchAll());
}
