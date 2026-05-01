<?php

require_once 'config.php';

header('Content-Type: application/json');

$id = $_GET['id'] ?? null;

if (!$id) {
    echo json_encode([
        'success' => false,
        'message' => 'ID da ficha não informado.'
    ]);
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM fichas WHERE id = :id");
$stmt->execute(['id' => $id]);

$ficha = $stmt->fetch();

if (!$ficha) {
    echo json_encode([
        'success' => false,
        'message' => 'Ficha não encontrada.'
    ]);
    exit;
}

$stmtClasses = $pdo->prepare(
    "SELECT classe_id, nivel FROM ficha_classes
     WHERE ficha_id = :ficha_id ORDER BY ordem ASC, id ASC"
);
$stmtClasses->execute(['ficha_id' => $id]);
$ficha['classes'] = array_map(
    fn($row) => ['id' => $row['classe_id'], 'nivel' => (int) $row['nivel']],
    $stmtClasses->fetchAll()
);

$stmtPoderes = $pdo->prepare(
    "SELECT classe_id, poder_id, tipo FROM ficha_poderes
     WHERE ficha_id = :ficha_id ORDER BY id ASC"
);
$stmtPoderes->execute(['ficha_id' => $id]);
$ficha['poderes'] = array_map(
    fn($row) => [
        'classe' => $row['classe_id'],
        'id'     => $row['poder_id'],
        'tipo'   => $row['tipo'],
    ],
    $stmtPoderes->fetchAll()
);

echo json_encode([
    'success' => true,
    'ficha' => $ficha
]);