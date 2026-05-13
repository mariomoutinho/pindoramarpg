<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/permissions.php';
require_once __DIR__ . '/includes/mesa-helpers.php';
require_once __DIR__ . '/includes/aventuras-helpers.php';
require_once __DIR__ . '/config.php';

$usuario = exigirLogin();
exigirFacilitador('apenas o Facilitador pode gerenciar mesas');

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !validarCsrf($_POST['csrf'] ?? null)) {
    header('Location: mesas.php?type=error&msg=' . urlencode('Requisição inválida.'));
    exit;
}

$mesaId = (int) ($_POST['mesa_id'] ?? 0);
$aventuraId = (int) ($_POST['aventura_id'] ?? 0);
$mesa = $mesaId > 0 ? carregarMesa($mesaId) : null;
if (!$mesa || (int) $mesa['facilitador_id'] !== (int) $usuario['id']) {
    header('Location: acesso-negado.php?m=' . urlencode('Você não pode editar esta mesa.'));
    exit;
}
if ($aventuraId <= 0) {
    header('Location: mesas.php?id=' . $mesaId . '&type=error&msg=' . urlencode('Selecione uma aventura.'));
    exit;
}

// Confirma que a aventura pertence ao mesmo facilitador antes de vincular.
$av = carregarAventura($aventuraId);
if (!$av || (int) $av['usuario_id'] !== (int) $usuario['id']) {
    header('Location: mesas.php?id=' . $mesaId . '&type=error&msg=' . urlencode('Aventura não encontrada no seu acervo.'));
    exit;
}

$inseriu = vincularAventuraNaMesa($mesaId, $aventuraId);
$msg = $inseriu
    ? '“' . ($av['titulo'] ?: 'Aventura') . '” vinculada à mesa.'
    : '“' . ($av['titulo'] ?: 'Aventura') . '” já estava vinculada a esta mesa.';

header('Location: mesas.php?id=' . $mesaId . '&type=success&msg=' . urlencode($msg));
exit;
