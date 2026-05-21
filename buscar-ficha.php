<?php

require_once __DIR__ . '/includes/auth.php';
$usuarioAtual = exigirLogin();

require_once 'config.php';
require_once __DIR__ . '/includes/permissions.php';

header('Content-Type: application/json');

if (!garantirColunaUsuarioFicha($pdo)) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Não foi possível preparar o vínculo das fichas com o usuário logado. '
            . 'Aplique migrations/013_ficha_usuarios_fallback.sql no MySQL da hospedagem '
            . 'e/ou abra diagnostico-ficha.php para detalhes.',
        'debug' => ambienteDesenvolvimentoBuscarFicha() ? ultimoErroVinculoFicha() : null,
    ]);
    exit;
}

$id = $_GET['id'] ?? null;

if (!$id) {
    echo json_encode([
        'success' => false,
        'message' => 'ID da ficha não informado.'
    ]);
    exit;
}

$ficha = buscarFichaDoUsuario($pdo, (int) $id, (int) $usuarioAtual['id']);

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

function ambienteDesenvolvimentoBuscarFicha(): bool
{
    $host = $_SERVER['HTTP_HOST'] ?? '';
    return $host === '' || str_contains($host, 'localhost') || str_contains($host, '127.0.0.1');
}
