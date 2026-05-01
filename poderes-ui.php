<?php

require_once __DIR__ . '/lib/poderes.php';

header('Content-Type: application/json; charset=utf-8');

$payload = json_decode(file_get_contents('php://input'), true);

if (!is_array($payload)) {
    echo json_encode(['success' => false, 'message' => 'Payload inválido.']);
    exit;
}

$personagem = [
    'classes' => $payload['classes'] ?? [],
    'nivel' => $payload['nivel'] ?? null,
    'poderes' => $payload['poderes'] ?? [],
    'atributos' => $payload['atributos'] ?? [],
    'pericias_treinadas' => $payload['pericias_treinadas'] ?? [],
    'divindade' => $payload['divindade'] ?? '',
];
$ppAtuais = (int) ($payload['pp_atuais'] ?? 0);

try {
    $grupos = getPoderesParaUI($personagem, $ppAtuais);
    $gruposGerais = getPoderesGeraisParaUI($personagem, $ppAtuais);
    $slots  = getSlotsDePoderDeClasseDisponiveis($personagem);
    $ppTotal = calcularPpTotal($personagem);

    echo json_encode([
        'success'       => true,
        'grupos'        => $grupos,
        'grupos_gerais' => $gruposGerais,
        'slots'         => $slots,
        'pp_total'      => $ppTotal,
    ], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Erro ao calcular poderes.',
        'error'   => $e->getMessage(),
    ]);
}
