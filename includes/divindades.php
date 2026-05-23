<?php

/**
 * Fallback dos helpers de Divindades para hospedagens que não permitem
 * criar a pasta top-level lib/ via FTP.
 */

function carregarDivindades(): array
{
    $defaults = ['divindades' => [], 'introducao' => [], 'regras' => []];
    $path = __DIR__ . '/../data/divindades.json';
    if (!is_file($path) || !is_readable($path)) {
        error_log("[divindades] arquivo ausente ou ilegível: $path");
        return $defaults;
    }
    $raw = file_get_contents($path);
    if ($raw === false) {
        error_log("[divindades] falha ao ler: $path");
        return $defaults;
    }
    $j = json_decode($raw, true);
    if (!is_array($j)) {
        error_log("[divindades] JSON inválido em: $path");
        return $defaults;
    }
    return $j + $defaults;
}

function buscarDivindade(string $idDivindade, ?array $dados = null): ?array
{
    if ($dados === null) $dados = carregarDivindades();
    foreach ($dados['divindades'] ?? [] as $d) {
        if (($d['id'] ?? '') === $idDivindade) return $d;
    }
    return null;
}

function getDivindadeParaUI(string $idDivindade): ?array
{
    require_once __DIR__ . '/origens.php';

    $div = buscarDivindade($idDivindade);
    if (!$div) return null;

    $idx = indexarPoderesGerais();

    $resolvidos = [];
    foreach ($div['poderes'] ?? [] as $pid) {
        if (isset($idx[$pid])) {
            $resolvidos[] = $idx[$pid];
        }
    }

    return [
        'id'              => $div['id'],
        'nome'            => $div['nome'],
        'saudacao'        => $div['saudacao'] ?? '',
        'descricao'       => $div['descricao'] ?? '',
        'crencas'         => $div['crencas'] ?? '',
        'simbolo'         => $div['simbolo'] ?? '',
        'energia'         => $div['energia'] ?? '',
        'energia_opcoes'  => $div['energia_opcoes'] ?? null,
        'arma_preferida'  => $div['arma_preferida'] ?? '',
        'devotos'         => $div['devotos'] ?? [],
        'poderes'         => $resolvidos,
        'obrigacoes'      => $div['obrigacoes'] ?? '',
    ];
}

function poderesPermitidosPelaDivindade(array $personagem): array
{
    $idDivindade = trim((string) ($personagem['divindade'] ?? ''));
    if ($idDivindade === '') return [];

    $div = buscarDivindade($idDivindade);
    if (!$div) return [];

    return $div['poderes'] ?? [];
}
