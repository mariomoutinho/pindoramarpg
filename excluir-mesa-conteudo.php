<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/permissions.php';
require_once __DIR__ . '/includes/mesa-helpers.php';
require_once __DIR__ . '/config.php';

$usuario = exigirLogin();
exigirFacilitador();

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !validarCsrf($_POST['csrf'] ?? null)) {
    header('Location: mesa-conteudos.php?type=error&msg=' . urlencode('Requisição inválida.'));
    exit;
}

$id = (int) ($_POST['id'] ?? 0);
$conteudo = $id > 0 ? carregarConteudo($id) : null;
if (!$conteudo) {
    header('Location: mesa-conteudos.php?type=error&msg=' . urlencode('Conteúdo não encontrado.'));
    exit;
}

$mesa = carregarMesa((int) $conteudo['mesa_id']);
if (!$mesa || (int) $mesa['facilitador_id'] !== (int) $usuario['id']) {
    header('Location: acesso-negado.php?m=' . urlencode('Você não pode excluir este conteúdo.'));
    exit;
}

$stmt = $pdo->prepare("DELETE FROM mesa_conteudos WHERE id = :id");
$stmt->execute(['id' => $id]);

$tipo = $conteudo['tipo'];
header('Location: mesa-conteudos.php?tipo=' . urlencode($tipo) . '&type=success&msg=' . urlencode('Conteúdo excluído.'));
