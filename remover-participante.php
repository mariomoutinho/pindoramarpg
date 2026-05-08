<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/permissions.php';
require_once __DIR__ . '/includes/mesa-helpers.php';
require_once __DIR__ . '/config.php';

$usuario = exigirLogin();
exigirFacilitador();

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !validarCsrf($_POST['csrf'] ?? null)) {
    header('Location: mesas.php?type=error&msg=' . urlencode('Requisição inválida.'));
    exit;
}

$vinculoId = (int) ($_POST['vinculo_id'] ?? 0);
$mesaId    = (int) ($_POST['mesa_id'] ?? 0);
$mesa      = $mesaId > 0 ? carregarMesa($mesaId) : null;
if (!$mesa || (int) $mesa['facilitador_id'] !== (int) $usuario['id']) {
    header('Location: acesso-negado.php?m=' . urlencode('Você não pode editar esta mesa.'));
    exit;
}

$stmt = $pdo->prepare(
    "DELETE FROM mesa_participantes
     WHERE id = :vid AND mesa_id = :mesa AND papel <> 'facilitador'"
);
$stmt->execute(['vid' => $vinculoId, 'mesa' => $mesaId]);

header('Location: mesas.php?id=' . $mesaId . '&type=success&msg=' . urlencode('Participante removido.'));
