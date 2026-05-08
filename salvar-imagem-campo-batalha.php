<?php
declare(strict_types=1);

require_once __DIR__ . '/includes/auth.php';
exigirLogin();
require_once __DIR__ . '/includes/permissions.php';

header('Content-Type: application/json; charset=utf-8');

// Apenas o Facilitador pode subir/alterar imagens da Mesa de Jogo.
if (!isFacilitador()) {
    http_response_code(403);
    echo json_encode([
        'success' => false,
        'message' => 'Apenas o Facilitador pode salvar imagens da Mesa.',
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Método inválido.',
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

if (!isset($_FILES['imagem'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Nenhuma imagem foi enviada.',
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

$arquivo = $_FILES['imagem'];
if (($arquivo['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => mensagemErroUpload((int) ($arquivo['error'] ?? UPLOAD_ERR_NO_FILE)),
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

$nomeOriginal = (string) ($arquivo['name'] ?? '');
$tmpName = (string) ($arquivo['tmp_name'] ?? '');
$ext = strtolower(pathinfo($nomeOriginal, PATHINFO_EXTENSION));
$permitidas = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

if (!in_array($ext, $permitidas, true)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Formato de imagem inválido. Use JPG, PNG, WEBP ou GIF.',
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime = $finfo->file($tmpName) ?: '';
$mimesPermitidos = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
if (!in_array($mime, $mimesPermitidos, true)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'O arquivo enviado não parece ser uma imagem válida.',
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

$uploadDir = __DIR__ . '/uploads/campo-batalha/';
if (!is_dir($uploadDir) && !mkdir($uploadDir, 0777, true)) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Não foi possível criar a pasta de imagens da Mesa de Jogo.',
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
@chmod($uploadDir, 0777);

if (!is_writable($uploadDir)) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'A pasta uploads/campo-batalha não tem permissão de gravação para o servidor.',
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

$novoNome = uniqid('campo_', true) . '.' . ($ext === 'jpeg' ? 'jpg' : $ext);
$destino = $uploadDir . $novoNome;

if (!move_uploaded_file($tmpName, $destino)) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Não foi possível salvar a imagem da Mesa de Jogo.',
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

echo json_encode([
    'success' => true,
    'path' => 'uploads/campo-batalha/' . $novoNome,
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

function mensagemErroUpload(int $erro): string
{
    $limite = ini_get('upload_max_filesize') ?: 'o limite configurado';
    return match ($erro) {
        UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE => 'A imagem ultrapassa o limite de upload do PHP (' . $limite . ').',
        UPLOAD_ERR_PARTIAL => 'A imagem foi enviada apenas parcialmente. Tente novamente.',
        UPLOAD_ERR_NO_FILE => 'Nenhuma imagem foi enviada.',
        default => 'Não foi possível receber a imagem enviada.',
    };
}
