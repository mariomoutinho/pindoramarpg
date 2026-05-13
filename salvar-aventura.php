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

$id     = isset($_POST['id']) ? (int) $_POST['id'] : 0;
$dados  = montarDadosAventura($_POST);

if ($dados['titulo'] === '') {
    $destino = $id > 0 ? 'aventura-editor.php?id=' . $id : 'aventura-editor.php';
    header('Location: ' . $destino . '&type=error&msg=' . urlencode('Informe um título para a aventura.'));
    exit;
}

// Upload da capa (opcional)
$erroUpload = null;
$capaNova = processarUploadCapaAventura($_FILES['capa'] ?? null, $erroUpload);
if ($erroUpload) {
    $destino = $id > 0 ? 'aventura-editor.php?id=' . $id : 'aventura-editor.php';
    header('Location: ' . $destino . '&type=error&msg=' . urlencode($erroUpload));
    exit;
}

if ($id > 0) {
    $atual = carregarAventura($id);
    if (!$atual || (int) $atual['usuario_id'] !== (int) $usuario['id']) {
        header('Location: acesso-negado.php?m=' . urlencode('Aventura não encontrada ou não pertence a você.'));
        exit;
    }

    if ($capaNova !== null) {
        // Substituir capa: salva a nova e remove a antiga do disco.
        atualizarAventura($id, $dados, $capaNova, false);
        if (!empty($atual['capa_path'])) {
            excluirArquivoCapaAventura((string) $atual['capa_path']);
        }
    } else {
        // Mantém capa antiga (não foi enviada nova imagem).
        atualizarAventura($id, $dados, null, true);
    }

    header('Location: aventura-ver.php?id=' . $id . '&type=success&msg=' . urlencode('Aventura atualizada.'));
    exit;
}

$novoId = criarAventura((int) $usuario['id'], $dados, $capaNova);
header('Location: aventura-ver.php?id=' . $novoId . '&type=success&msg=' . urlencode('Aventura criada.'));
exit;
