<?php

/**
 * Helpers para a página de Origens.
 *
 * data/origens.json é a fonte: cada origem tem id, nome, descricao, atributos,
 * itens, pericias e poderes (ids que referenciam data/poderes-gerais.json).
 *
 * data/poderes-gerais.json tem 5 categorias (combate, destino, magia, divinos,
 * origem). A categoria "origem" abriga os 35 poderes únicos exclusivos das
 * origens — cada um carrega o slug da origem dona em "origem".
 */

function carregarOrigens(): array
{
    return _carregarJsonSeguro(
        __DIR__ . '/../data/origens.json',
        ['origens' => [], 'introducao' => [], 'regras' => []],
        'origens'
    );
}

function carregarPoderesGerais(): array
{
    return _carregarJsonSeguro(
        __DIR__ . '/../data/poderes-gerais.json',
        ['categorias' => []],
        'poderes-gerais'
    );
}

if (!function_exists('_carregarJsonSeguro')) {
    function _carregarJsonSeguro(string $path, array $defaults, string $rotulo): array
    {
        if (!is_file($path) || !is_readable($path)) {
            error_log("[$rotulo] arquivo ausente ou ilegível: $path");
            return $defaults;
        }
        $raw = file_get_contents($path);
        if ($raw === false) {
            error_log("[$rotulo] falha ao ler: $path");
            return $defaults;
        }
        $j = json_decode($raw, true);
        if (!is_array($j)) {
            error_log("[$rotulo] JSON inválido em: $path");
            return $defaults;
        }
        return $j + $defaults;
    }
}

/**
 * Indexa todos os poderes por id (independente da categoria).
 */
function indexarPoderesGerais(?array $poderesGerais = null): array
{
    if ($poderesGerais === null) {
        $poderesGerais = carregarPoderesGerais();
    }

    $idx = [];
    foreach ($poderesGerais['categorias'] ?? [] as $cat) {
        foreach ($cat['poderes'] ?? [] as $p) {
            $idx[$p['id']] = $p + ['categoria_nome' => $cat['nome']];
        }
    }
    return $idx;
}

function buscarOrigem(string $idOrigem, ?array $origensData = null): ?array
{
    if ($origensData === null) $origensData = carregarOrigens();
    foreach ($origensData['origens'] ?? [] as $o) {
        if ($o['id'] === $idOrigem) return $o;
    }
    return null;
}

/**
 * Devolve a origem com os poderes resolvidos (objeto completo em vez de só id),
 * pronto para a UI da ficha consumir.
 */
function getOrigemParaUI(string $idOrigem): ?array
{
    $origem = buscarOrigem($idOrigem);
    if (!$origem) return null;

    $idx = indexarPoderesGerais();

    $poderesResolvidos = [];
    foreach ($origem['poderes'] ?? [] as $pid) {
        if (isset($idx[$pid])) $poderesResolvidos[] = $idx[$pid];
    }

    return [
        'id'         => $origem['id'],
        'nome'       => $origem['nome'],
        'descricao'  => $origem['descricao'],
        'atributos'  => $origem['atributos'] ?? [],
        'itens'      => $origem['itens']     ?? [],
        'pericias'   => $origem['pericias']  ?? [],
        'poderes'    => $poderesResolvidos,
        'observacao' => $origem['observacao'] ?? null,
    ];
}

/**
 * Valida uma seleção de benefícios. Retorna ['ok' => bool, 'erros' => string[]].
 *
 * $beneficios = [
 *   ['tipo' => 'pericia', 'nome' => 'Adestramento'],
 *   ['tipo' => 'poder',   'id'   => 'origem-amigo-especial'],
 * ]
 */
function validarBeneficiosOrigem(string $idOrigem, array $beneficios): array
{
    $origem = buscarOrigem($idOrigem);
    if (!$origem) return ['ok' => false, 'erros' => ['Origem não encontrada.']];

    $erros = [];

    if (count($beneficios) > 2) {
        $erros[] = 'Você pode escolher no máximo 2 benefícios.';
    }

    foreach ($beneficios as $b) {
        $tipo = $b['tipo'] ?? null;
        if ($tipo === 'pericia') {
            if (!in_array($b['nome'] ?? '', $origem['pericias'] ?? [], true)) {
                $erros[] = "Perícia '{$b['nome']}' não pertence à lista da origem.";
            }
        } elseif ($tipo === 'poder') {
            if (!in_array($b['id'] ?? '', $origem['poderes'] ?? [], true)) {
                $erros[] = "Poder '{$b['id']}' não pertence à lista da origem.";
            }
        } else {
            $erros[] = "Tipo de benefício desconhecido: {$tipo}.";
        }
    }

    return ['ok' => empty($erros), 'erros' => $erros];
}
