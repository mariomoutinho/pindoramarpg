<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/permissions.php';
require_once __DIR__ . '/includes/mesa-helpers.php';
require_once __DIR__ . '/includes/aventuras-helpers.php';

$usuario = exigirLogin();
exigirFacilitador('NPCs de aventura são exclusivos do Facilitador');

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !validarCsrf($_POST['csrf'] ?? null)) {
    header('Location: aventuras.php?type=error&msg=' . urlencode('Requisição inválida.'));
    exit;
}

$npcId = isset($_POST['id']) ? (int) $_POST['id'] : 0;
$atual = $npcId > 0 ? aventuraCarregarNpc($npcId) : null;

if (!$atual || (int) $atual['usuario_id'] !== (int) $usuario['id']) {
    header('Location: acesso-negado.php?m=' . urlencode('NPC não encontrado ou não pertence a você.'));
    exit;
}

$aventuraId = (int) $atual['aventura_id'];
aventuraExcluirNpc($npcId);

// Se a imagem do NPC era um arquivo nosso (uploads/aventuras/npcs/),
// limpa do disco. Caminhos externos / URLs são preservados (não nossos).
if (!empty($atual['imagem'])) {
    excluirArquivoImagemNpcAventura((string) $atual['imagem']);
}

header('Location: aventura-editor.php?id=' . $aventuraId . '&type=success&msg=' . urlencode('NPC removido.') . '#aventuraNpcsTitulo');
exit;
