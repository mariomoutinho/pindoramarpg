<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/permissions.php';
require_once __DIR__ . '/includes/mesa-helpers.php';
require_once __DIR__ . '/config.php';

$usuario = exigirLogin();
exigirFacilitador('apenas o Facilitador pode excluir mesas');

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !validarCsrf($_POST['csrf'] ?? null)) {
    header('Location: mesas.php?type=error&msg=' . urlencode('Requisição inválida.'));
    exit;
}

$id = (int) ($_POST['id'] ?? 0);
$mesa = $id > 0 ? carregarMesa($id) : null;
if (!$mesa || (int) $mesa['facilitador_id'] !== (int) $usuario['id']) {
    header('Location: acesso-negado.php?m=' . urlencode('Você não pode excluir esta mesa.'));
    exit;
}

$stmt = $pdo->prepare("DELETE FROM mesas WHERE id = :id");
$stmt->execute(['id' => $id]);

header('Location: mesas.php?type=success&msg=' . urlencode('Mesa excluída.'));
