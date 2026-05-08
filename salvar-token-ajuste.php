<?php
require_once __DIR__ . '/includes/auth.php';
exigirLogin();
require_once __DIR__ . '/includes/permissions.php';

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/config.php';

try {
    $raw = file_get_contents('php://input');
    $payload = json_decode($raw ?: '{}', true);
    if (!is_array($payload)) {
        throw new RuntimeException('Dados inválidos.');
    }

    $id = (int) ($payload['id'] ?? 0);
    $ajuste = normalizarTokenAjuste($payload['ajuste'] ?? []);
    if ($id <= 0) {
        throw new RuntimeException('Ficha inválida.');
    }

    // Autorização: ajuste de token segue a regra de edição da ficha
    // (Facilitador sempre, Participante só na própria).
    if (!canEditFicha($id)) {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'Você não tem permissão para ajustar o token desta ficha.',
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    $stmt = $pdo->prepare('SELECT personagem_imagem_ajuste, personagem_token_imagem FROM fichas WHERE id = :id');
    $stmt->execute([':id' => $id]);
    $ficha = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$ficha) {
        throw new RuntimeException('Ficha não encontrada.');
    }

    if (!empty($ficha['personagem_token_imagem'])) {
        $stmt = $pdo->prepare('UPDATE fichas SET personagem_token_imagem_ajuste = :ajuste WHERE id = :id');
        $stmt->execute([
            ':ajuste' => json_encode($ajuste, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            ':id' => $id,
        ]);
    } else {
        $atual = decodificarAjusteImagem($ficha['personagem_imagem_ajuste'] ?? null);
        $atual['token'] = $ajuste;
        $stmt = $pdo->prepare('UPDATE fichas SET personagem_imagem_ajuste = :ajuste WHERE id = :id');
        $stmt->execute([
            ':ajuste' => json_encode($atual, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            ':id' => $id,
        ]);
    }

    echo json_encode(['success' => true], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

function normalizarTokenAjuste($valor): array
{
    if (!is_array($valor)) {
        $valor = [];
    }

    return [
        'scale' => min(6, max(0.2, (float) ($valor['scale'] ?? 1))),
        'x' => min(220, max(-220, (float) ($valor['x'] ?? 0))),
        'y' => min(220, max(-220, (float) ($valor['y'] ?? 0))),
    ];
}

function decodificarAjusteImagem(?string $json): array
{
    $padrao = [
        'foto' => ['scale' => 1, 'x' => 0, 'y' => 0],
        'token' => ['scale' => 1, 'x' => 0, 'y' => 0],
    ];
    if (!$json) {
        return $padrao;
    }

    $dados = json_decode($json, true);
    if (!is_array($dados)) {
        return $padrao;
    }

    if (isset($dados['foto']) || isset($dados['token'])) {
        return [
            'foto' => normalizarTokenAjuste($dados['foto'] ?? $padrao['foto']),
            'token' => normalizarTokenAjuste($dados['token'] ?? $dados['foto'] ?? $padrao['token']),
        ];
    }

    $legacy = normalizarTokenAjuste($dados);
    return [
        'foto' => $legacy,
        'token' => $legacy,
    ];
}
