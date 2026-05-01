<?php

/**
 * Helpers para o sistema de Divindades.
 *
 * data/divindades.json: 20 divindades, cada uma com lista de IDs de poderes
 * que referenciam a categoria "divinos" em data/poderes-gerais.json.
 */

function carregarDivindades(): array
{
    $j = json_decode(file_get_contents(__DIR__ . '/../data/divindades.json'), true);
    return $j ?? ['divindades' => [], 'introducao' => [], 'regras' => []];
}

function buscarDivindade(string $idDivindade, ?array $dados = null): ?array
{
    if ($dados === null) $dados = carregarDivindades();
    foreach ($dados['divindades'] ?? [] as $d) {
        if (($d['id'] ?? '') === $idDivindade) return $d;
    }
    return null;
}

/**
 * Resolve a divindade para a UI: retorna a divindade com os poderes
 * substituídos por objetos completos (incluindo descrição), prontos
 * para o front renderizar.
 */
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

/**
 * Retorna a lista de IDs de poder permitidos para um personagem
 * baseado na divindade que ele cultua. Sem divindade → array vazio.
 */
function poderesPermitidosPelaDivindade(array $personagem): array
{
    $idDivindade = trim((string) ($personagem['divindade'] ?? ''));
    if ($idDivindade === '') return [];

    $div = buscarDivindade($idDivindade);
    if (!$div) return [];

    return $div['poderes'] ?? [];
}
