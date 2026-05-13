<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/permissions.php';
require_once __DIR__ . '/includes/mesa-helpers.php';
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
    header('Location: mesas.php?id=' . $mesaId . '&type=error&msg=' . urlencode('Aventura inválida.'));
    exit;
}

// Importante: desvincular NÃO exclui a aventura — só remove a linha
// em mesa_aventuras. A aventura continua intacta no módulo Aventuras.
$removeu = desvincularAventuraDaMesa($mesaId, $aventuraId);
$msg = $removeu ? 'Aventura removida desta mesa.' : 'Aventura já não estava vinculada.';

header('Location: mesas.php?id=' . $mesaId . '&type=success&msg=' . urlencode($msg));
exit;
