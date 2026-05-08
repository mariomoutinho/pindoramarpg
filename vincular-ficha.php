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

$mesaId    = (int) ($_POST['mesa_id'] ?? 0);
$usuarioId = (int) ($_POST['usuario_id'] ?? 0);
$fichaId   = (int) ($_POST['ficha_id'] ?? 0);

$mesa = $mesaId > 0 ? carregarMesa($mesaId) : null;
if (!$mesa || (int) $mesa['facilitador_id'] !== (int) $usuario['id']) {
    header('Location: acesso-negado.php?m=' . urlencode('Você não pode editar esta mesa.'));
    exit;
}

// O usuário precisa ser participante da mesa.
$papel = papelEmMesa($mesaId, $usuarioId);
if ($papel === null) {
    header('Location: mesas.php?id=' . $mesaId . '&type=error&msg=' . urlencode('Esse usuário não está na mesa.'));
    exit;
}

// Tabela `fichas` precisa ter `usuario_id` (migration 007).
try {
    $check = $pdo->query("SHOW COLUMNS FROM fichas LIKE 'usuario_id'");
    $temColuna = $check && $check->fetch();
} catch (Throwable $e) {
    $temColuna = false;
}
if (!$temColuna) {
    header('Location: mesas.php?id=' . $mesaId . '&type=error&msg=' . urlencode('Aplique a migration 007 antes de vincular fichas.'));
    exit;
}

$stmt = $pdo->prepare("UPDATE fichas SET usuario_id = :uid WHERE id = :fid AND usuario_id IS NULL");
$stmt->execute(['uid' => $usuarioId, 'fid' => $fichaId]);

if ($stmt->rowCount() === 0) {
    header('Location: mesas.php?id=' . $mesaId . '&type=error&msg=' . urlencode('Ficha não encontrada ou já tinha dono.'));
    exit;
}

header('Location: mesas.php?id=' . $mesaId . '&type=success&msg=' . urlencode('Ficha vinculada.'));
