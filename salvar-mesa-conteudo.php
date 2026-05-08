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

$id     = isset($_POST['id']) ? (int) $_POST['id'] : 0;
$mesaId = (int) ($_POST['mesa_id'] ?? 0);
$tipo   = $_POST['tipo'] ?? '';
$titulo = trim((string) ($_POST['titulo'] ?? ''));
$descricao = trim((string) ($_POST['descricao'] ?? ''));
$vis    = $_POST['visibilidade'] ?? 'privado';

if (!in_array($tipo, ['npc','aventura','narrativa','magia','poder'], true)) {
    header('Location: mesa-conteudos.php?type=error&msg=' . urlencode('Tipo inválido.'));
    exit;
}
if (!in_array($vis, ['privado','participantes','publico'], true)) $vis = 'privado';
if ($titulo === '' || $mesaId <= 0) {
    header('Location: mesa-conteudos.php?tipo=' . urlencode($tipo) . '&type=error&msg=' . urlencode('Preencha mesa e título.'));
    exit;
}

$mesa = carregarMesa($mesaId);
if (!$mesa || (int) $mesa['facilitador_id'] !== (int) $usuario['id']) {
    header('Location: acesso-negado.php?m=' . urlencode('Você não pode editar conteúdos desta mesa.'));
    exit;
}

if ($id > 0) {
    $atual = carregarConteudo($id);
    if (!$atual || (int) $atual['mesa_id'] !== $mesaId) {
        // Permite mover entre as próprias mesas, mas só se a destino for sua
        if ($atual) {
            $mesaAntiga = carregarMesa((int) $atual['mesa_id']);
            if (!$mesaAntiga || (int) $mesaAntiga['facilitador_id'] !== (int) $usuario['id']) {
                header('Location: acesso-negado.php?m=' . urlencode('Conteúdo não pertence a você.'));
                exit;
            }
        }
    }
    $stmt = $pdo->prepare(
        "UPDATE mesa_conteudos
         SET mesa_id = :mesa, tipo = :tipo, titulo = :titulo,
             descricao = :descricao, visibilidade = :vis
         WHERE id = :id"
    );
    $stmt->execute([
        'mesa' => $mesaId, 'tipo' => $tipo, 'titulo' => $titulo,
        'descricao' => $descricao !== '' ? $descricao : null,
        'vis' => $vis, 'id' => $id,
    ]);
    $msg = 'Conteúdo atualizado.';
} else {
    $stmt = $pdo->prepare(
        "INSERT INTO mesa_conteudos
         (mesa_id, tipo, titulo, descricao, visibilidade, criado_por)
         VALUES (:mesa, :tipo, :titulo, :descricao, :vis, :uid)"
    );
    $stmt->execute([
        'mesa' => $mesaId, 'tipo' => $tipo, 'titulo' => $titulo,
        'descricao' => $descricao !== '' ? $descricao : null,
        'vis' => $vis, 'uid' => (int) $usuario['id'],
    ]);
    $msg = 'Conteúdo criado.';
}

header('Location: mesa-conteudos.php?tipo=' . urlencode($tipo) . '&type=success&msg=' . urlencode($msg));
