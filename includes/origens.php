<?php

/**
 * Fallback dos helpers de Origens/Poderes Gerais para hospedagens que
 * não permitem criar a pasta top-level lib/ via FTP.
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
