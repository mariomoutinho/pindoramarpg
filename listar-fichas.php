<?php

require_once __DIR__ . '/includes/auth.php';
$usuarioAtual = exigirLogin();

require_once 'config.php';
require_once __DIR__ . '/includes/permissions.php';

header('Content-Type: application/json');

if (!garantirColunaUsuarioFicha($pdo)) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Não foi possível preparar o vínculo das fichas com o usuário logado. '
            . 'Aplique migrations/013_ficha_usuarios_fallback.sql no MySQL da hospedagem '
            . 'e/ou abra diagnostico-ficha.php para detalhes.',
        'debug' => ambienteDesenvolvimentoListaFichas() ? ultimoErroVinculoFicha() : null,
    ]);
    exit;
}

$colunas = "
    id,
    participante,
    personagem,
    ancestralidade,
    classe,
    nivel,
    personagem_imagem,
    personagem_imagem_ajuste,
    personagem_token_imagem,
    personagem_token_imagem_ajuste,
    updated_at
";

echo json_encode(listarFichasDoUsuario($pdo, $colunas, (int) $usuarioAtual['id']));

function ambienteDesenvolvimentoListaFichas(): bool
{
    $host = $_SERVER['HTTP_HOST'] ?? '';
    return $host === '' || str_contains($host, 'localhost') || str_contains($host, '127.0.0.1');
}
