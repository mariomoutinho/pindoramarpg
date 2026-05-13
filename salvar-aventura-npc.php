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

$aventuraId = isset($_POST['aventura_id']) ? (int) $_POST['aventura_id'] : 0;
$npcId      = isset($_POST['id']) ? (int) $_POST['id'] : 0;
$av = $aventuraId > 0 ? carregarAventura($aventuraId) : null;

if (!$av || (int) $av['usuario_id'] !== (int) $usuario['id']) {
    header('Location: acesso-negado.php?m=' . urlencode('Aventura não encontrada ou não pertence a você.'));
    exit;
}

$dados = aventuraMontarNpcInput($_POST);
if ($dados['nome'] === '') {
    header('Location: aventura-editor.php?id=' . $aventuraId . '&type=error&msg=' . urlencode('Informe um nome para o NPC.'));
    exit;
}

// Upload opcional da imagem do NPC. Regra de prioridade: se o arquivo
// vier válido, ele substitui o que estiver no campo "Imagem (URL)".
$erroUpload = null;
$imagemArquivo = processarUploadImagemNpcAventura($_FILES['imagem_arquivo'] ?? null, $erroUpload);
if ($erroUpload) {
    header('Location: aventura-editor.php?id=' . $aventuraId . '&type=error&msg=' . urlencode($erroUpload) . '#aventuraNpcsTitulo');
    exit;
}
if ($imagemArquivo !== null) {
    $dados['imagem'] = $imagemArquivo;
}

if ($npcId > 0) {
    $atual = aventuraCarregarNpc($npcId);
    if (!$atual || (int) $atual['usuario_id'] !== (int) $usuario['id']) {
        header('Location: acesso-negado.php?m=' . urlencode('NPC não pertence a você.'));
        exit;
    }
    // Se um arquivo novo substituiu a imagem, apaga o anterior do disco
    // (quando o anterior também era um arquivo nosso, não uma URL externa).
    if ($imagemArquivo !== null && !empty($atual['imagem'])) {
        excluirArquivoImagemNpcAventura((string) $atual['imagem']);
    }
    aventuraAtualizarNpc($npcId, $dados);
    $msg = 'NPC atualizado.';
} else {
    aventuraCriarNpc($aventuraId, (int) $usuario['id'], $dados);
    $msg = 'NPC adicionado.';
}

header('Location: aventura-editor.php?id=' . $aventuraId . '&type=success&msg=' . urlencode($msg) . '#aventuraNpcsTitulo');
exit;
