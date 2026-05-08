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

$mesaId = (int) ($_POST['mesa_id'] ?? 0);
$email = trim((string) ($_POST['email'] ?? ''));
$mesa = $mesaId > 0 ? carregarMesa($mesaId) : null;
if (!$mesa || (int) $mesa['facilitador_id'] !== (int) $usuario['id']) {
    header('Location: acesso-negado.php?m=' . urlencode('Você não pode editar esta mesa.'));
    exit;
}
if ($email === '') {
    header('Location: mesas.php?id=' . $mesaId . '&type=error&msg=' . urlencode('Informe um email.'));
    exit;
}

$stmt = $pdo->prepare("SELECT id, nome FROM usuarios WHERE email = :email LIMIT 1");
$stmt->execute(['email' => $email]);
$alvo = $stmt->fetch();

if (!$alvo) {
    header('Location: mesas.php?id=' . $mesaId . '&type=error&msg=' . urlencode('Usuário com esse email não foi encontrado.'));
    exit;
}

$stmt = $pdo->prepare(
    "INSERT IGNORE INTO mesa_participantes (mesa_id, usuario_id, papel)
     VALUES (:mesa, :uid, 'participante')"
);
$stmt->execute(['mesa' => $mesaId, 'uid' => (int) $alvo['id']]);

$msg = $stmt->rowCount() > 0
    ? $alvo['nome'] . ' adicionado à mesa.'
    : $alvo['nome'] . ' já estava na mesa.';

header('Location: mesas.php?id=' . $mesaId . '&type=success&msg=' . urlencode($msg));
