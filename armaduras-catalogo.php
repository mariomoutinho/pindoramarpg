<?php

/**
 * Catálogo de armaduras e escudos extraído de equipamentos.php.
 * Cada item tem: nome, tipo (armadura | escudo), bonus (int), penalidade (int),
 * espacos (float), secao (subcategoria), descricao (parágrafo descritivo, se houver).
 */

header('Content-Type: application/json; charset=utf-8');

function textoCelula(DOMNode $node): string {
    $txt = $node->textContent;
    $txt = preg_replace('/\s+/u', ' ', $txt);
    return trim($txt);
}

function normalizar(string $s): string {
    $s = strtolower(trim($s));
    $map = ['á'=>'a','é'=>'e','í'=>'i','ó'=>'o','ú'=>'u',
            'â'=>'a','ê'=>'e','î'=>'i','ô'=>'o','û'=>'u',
            'ã'=>'a','õ'=>'o','ç'=>'c'];
    return strtr($s, $map);
}

function paraNumero(string $v): float {
    $v = trim(str_replace(',', '.', $v));
    if (preg_match('/^([+-]?\d+(?:\.\d+)?)/', $v, $m)) {
        return (float) $m[1];
    }
    return 0.0;
}

try {
    $html = file_get_contents(__DIR__ . '/equipamentos.php');
    if ($html === false) throw new RuntimeException('Falha ao ler equipamentos.php');

    $html = preg_replace('/<br\s*\/?>/i', ' ', $html);
    $html = mb_convert_encoding($html, 'HTML-ENTITIES', 'UTF-8');
    libxml_use_internal_errors(true);
    $dom = new DOMDocument();
    $dom->loadHTML($html);
    libxml_clear_errors();
    $xpath = new DOMXPath($dom);

    $catalogo = []; // nome => dados

    $tabelas = $xpath->query('//table');
    foreach ($tabelas as $tabela) {
        $linhas = $xpath->query('.//tr', $tabela);
        if ($linhas->length < 2) continue;

        // Localiza a linha-cabeçalho — precisa ter "Bônus" + "Penalidade" + "Espaços"
        $headerIdx = -1;
        $headerCells = [];
        foreach ($linhas as $idx => $linha) {
            $cells = $xpath->query('./td|./th', $linha);
            $textos = [];
            foreach ($cells as $c) $textos[] = textoCelula($c);
            $hasBonus = false; $hasPen = false; $hasEsp = false;
            foreach ($textos as $t) {
                $n = normalizar($t);
                if (str_contains($n, 'bonus')) $hasBonus = true;
                if (str_contains($n, 'penalidade')) $hasPen = true;
                if ($n === 'espacos') $hasEsp = true;
            }
            if ($hasBonus && $hasPen && $hasEsp) {
                $headerIdx = $idx;
                $headerCells = $textos;
                break;
            }
        }
        if ($headerIdx === -1) continue;

        // Mapeia colunas
        $col = ['nome'=>0, 'preco'=>-1, 'bonus'=>-1, 'penalidade'=>-1, 'espacos'=>-1];
        foreach ($headerCells as $i => $h) {
            $n = normalizar($h);
            if ($n === 'preco' || $n === 'preço') $col['preco'] = $i;
            elseif (str_contains($n, 'bonus')) $col['bonus'] = $i;
            elseif (str_contains($n, 'penalidade')) $col['penalidade'] = $i;
            elseif ($n === 'espacos') $col['espacos'] = $i;
        }

        // Itera linhas, rastreando subcategoria (linhas com todas células iguais)
        $secao = '';
        foreach ($linhas as $idx => $linha) {
            if ($idx <= $headerIdx) continue;
            $cells = $xpath->query('./td|./th', $linha);
            if ($cells->length === 0) continue;
            $textos = [];
            foreach ($cells as $c) $textos[] = textoCelula($c);

            if (count(array_unique($textos)) === 1) {
                $secao = $textos[0];
                continue;
            }

            $nome = $textos[$col['nome']] ?? '';
            $bonus = $textos[$col['bonus']] ?? '';
            if ($nome === '' || $bonus === '') continue;

            // Determina tipo pela seção: contém "escudo" → escudo, senão → armadura
            $tipo = (str_contains(normalizar($secao), 'escudo')) ? 'escudo' : 'armadura';

            $catalogo[$nome] = [
                'nome'       => $nome,
                'tipo'       => $tipo,
                'bonus'      => (int) paraNumero($bonus),
                'penalidade' => (int) paraNumero($textos[$col['penalidade']] ?? '0'),
                'espacos'    => paraNumero($textos[$col['espacos']] ?? '0'),
                'preco'      => $col['preco'] >= 0 ? trim($textos[$col['preco']] ?? '') : '',
                'secao'      => $secao,
                'descricao'  => '',
            ];
        }
    }

    // Tenta enriquecer com descrições "<p><strong>Nome.</strong> ...</p>"
    $paragrafos = $xpath->query('//p[strong]');
    foreach ($paragrafos as $p) {
        $strong = $xpath->query('./strong[1]', $p)->item(0);
        if (!$strong) continue;
        $tit = textoCelula($strong);
        if (!preg_match('/^(.+?)\.\s*$/u', $tit, $m)) continue;
        $titulo = trim($m[1]);
        if (!isset($catalogo[$titulo])) continue;

        $clone = $p->cloneNode(true);
        $sclone = $clone->getElementsByTagName('strong');
        if ($sclone->length > 0) {
            $sc = $sclone->item(0);
            if ($sc->parentNode) $sc->parentNode->removeChild($sc);
        }
        $desc = trim(preg_replace('/\s+/u', ' ', $clone->textContent));
        if ($desc !== '') $catalogo[$titulo]['descricao'] = $desc;
    }

    $itens = array_values($catalogo);
    usort($itens, function($a, $b) {
        if ($a['tipo'] !== $b['tipo']) return strcmp($a['tipo'], $b['tipo']);
        return strcmp(normalizar($a['nome']), normalizar($b['nome']));
    });

    echo json_encode([
        'success' => true,
        'itens'   => $itens,
        'total'   => count($itens),
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Falha ao gerar catálogo de armaduras/escudos.',
        'error'   => $e->getMessage(),
    ]);
}
