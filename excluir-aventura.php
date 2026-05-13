<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/permissions.php';
require_once __DIR__ . '/includes/mesa-helpers.php';
require_once __DIR__ . '/includes/aventuras-helpers.php';

$usuario = exigirLogin();
exigirFacilitador('o módulo Aventuras é exclusivo do Facilitador');

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !validarCsrf($_POST['csrf'] ?? null)) {
    header('Location: aventuras.php?type=error&msg=' . urlencode('Requisição inválida.'));
    exit;
}

$id = isset($_POST['id']) ? (int) $_POST['id'] : 0;
$atual = $id > 0 ? carregarAventura($id) : null;

if (!$atual || (int) $atual['usuario_id'] !== (int) $usuario['id']) {
    header('Location: acesso-negado.php?m=' . urlencode('Aventura não encontrada ou não pertence a você.'));
    exit;
}

excluirAventura($id);

header('Location: aventuras.php?type=success&msg=' . urlencode('Aventura excluída.'));
exit;
