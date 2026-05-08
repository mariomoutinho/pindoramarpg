<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/permissions.php';
require_once __DIR__ . '/includes/mesa-helpers.php';
require_once __DIR__ . '/config.php';

$usuario = exigirLogin();
exigirFacilitador('apenas o Facilitador pode criar/editar mesas');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: mesas.php?type=error&msg=' . urlencode('Método inválido.'));
    exit;
}
if (!validarCsrf($_POST['csrf'] ?? null)) {
    header('Location: mesas.php?type=error&msg=' . urlencode('Sessão expirada. Tente novamente.'));
    exit;
}

$id        = isset($_POST['id']) ? (int) $_POST['id'] : 0;
$nome      = trim((string) ($_POST['nome'] ?? ''));
$descricao = trim((string) ($_POST['descricao'] ?? ''));
$status    = $_POST['status'] ?? 'ativa';
if (!in_array($status, ['rascunho','ativa','arquivada'], true)) $status = 'ativa';
if ($nome === '') {
    header('Location: mesas.php?type=error&msg=' . urlencode('Informe um nome para a mesa.'));
    exit;
}

if ($id > 0) {
    $mesa = carregarMesa($id);
    if (!$mesa || (int) $mesa['facilitador_id'] !== (int) $usuario['id']) {
        header('Location: acesso-negado.php?m=' . urlencode('Você não pode editar esta mesa.'));
        exit;
    }
    $stmt = $pdo->prepare(
        "UPDATE mesas SET nome = :nome, descricao = :descricao, status = :status WHERE id = :id"
    );
    $stmt->execute([
        'nome' => $nome,
        'descricao' => $descricao !== '' ? $descricao : null,
        'status' => $status,
        'id' => $id,
    ]);
    $mesaId = $id;
    $msg = 'Mesa atualizada.';
} else {
    $stmt = $pdo->prepare(
        "INSERT INTO mesas (facilitador_id, nome, descricao, status)
         VALUES (:fac, :nome, :descricao, :status)"
    );
    $stmt->execute([
        'fac' => (int) $usuario['id'],
        'nome' => $nome,
        'descricao' => $descricao !== '' ? $descricao : null,
        'status' => $status,
    ]);
    $mesaId = (int) $pdo->lastInsertId();
    // Vincula o próprio Facilitador como participante com papel facilitador.
    $stmt = $pdo->prepare(
        "INSERT IGNORE INTO mesa_participantes (mesa_id, usuario_id, papel)
         VALUES (:mesa, :uid, 'facilitador')"
    );
    $stmt->execute(['mesa' => $mesaId, 'uid' => (int) $usuario['id']]);
    $msg = 'Mesa criada.';
}

header('Location: mesas.php?id=' . $mesaId . '&type=success&msg=' . urlencode($msg));
