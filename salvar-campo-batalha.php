<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

$raw = file_get_contents('php://input');
$state = json_decode($raw ?: '', true);

if (!is_array($state)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Dados inválidos para salvar a Mesa de Jogo.',
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

if (!array_key_exists('pages', $state) || !is_array($state['pages'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'A Mesa de Jogo precisa conter ao menos a lista de cenas.',
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

$dataDir = __DIR__ . '/data';
if (!is_dir($dataDir) && !mkdir($dataDir, 0777, true)) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Não foi possível criar a pasta de dados.',
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
@chmod($dataDir, 0777);

if (!is_writable($dataDir)) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'A pasta data não tem permissão de gravação para o servidor.',
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

$stateFile = $dataDir . '/campo-batalha-state.json';
$tmpFile = $stateFile . '.tmp';
$state = materializarImagensDoCampo($state);
$json = json_encode($state, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

if ($json === false || file_put_contents($tmpFile, $json, LOCK_EX) === false || !rename($tmpFile, $stateFile)) {
    @unlink($tmpFile);
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Não foi possível salvar o estado da Mesa de Jogo.',
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

echo json_encode([
    'success' => true,
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

function materializarImagensDoCampo(array $state): array
{
    if (!isset($state['pages']) || !is_array($state['pages'])) {
        return $state;
    }

    foreach ($state['pages'] as &$page) {
        if (!is_array($page)) {
            continue;
        }

        if (isset($page['mapBackground']) && is_string($page['mapBackground'])) {
            $page['mapBackground'] = salvarDataUrlImagem($page['mapBackground']) ?? $page['mapBackground'];
        }

        if (isset($page['scenery']) && is_array($page['scenery'])) {
            foreach ($page['scenery'] as &$item) {
                if (!is_array($item) || !isset($item['src']) || !is_string($item['src'])) {
                    continue;
                }
                $item['src'] = salvarDataUrlImagem($item['src']) ?? $item['src'];
            }
            unset($item);
        }
    }
    unset($page);

    return $state;
}

function salvarDataUrlImagem(string $valor): ?string
{
    if (strpos($valor, 'data:image/') !== 0) {
        return null;
    }

    if (!preg_match('#^data:image/(png|jpe?g|webp|gif);base64,(.+)$#i', $valor, $matches)) {
        return null;
    }

    $ext = strtolower($matches[1]);
    if ($ext === 'jpeg') {
        $ext = 'jpg';
    }

    $binario = base64_decode($matches[2], true);
    if ($binario === false || $binario === '') {
        return null;
    }

    $uploadDir = __DIR__ . '/uploads/campo-batalha/';
    if (!is_dir($uploadDir) && !mkdir($uploadDir, 0777, true)) {
        return null;
    }
    @chmod($uploadDir, 0777);
    if (!is_writable($uploadDir)) {
        return null;
    }

    $nome = uniqid('campo_', true) . '.' . $ext;
    $destino = $uploadDir . $nome;
    if (file_put_contents($destino, $binario, LOCK_EX) === false) {
        return null;
    }

    return 'uploads/campo-batalha/' . $nome;
}
