<?php

/**
 * Lê equipamentos.php (HTML) e devolve um catálogo de itens com:
 *   - nome, espacos
 *   - campos: pares header => valor das demais colunas da tabela
 *   - descricao: texto do parágrafo "<p><strong>Nome.</strong> ...</p>"
 *
 * Usado pelo autocomplete e pelo tooltip de detalhes na ficha.
 */

header('Content-Type: application/json; charset=utf-8');

function textoCelula(DOMNode $node): string {
    $txt = $node->textContent;
    $txt = preg_replace('/\s+/u', ' ', $txt);
    return trim($txt);
}

function normalizar(string $s): string {
    $s = strtolower(trim($s));
    $map = [
        'á'=>'a','é'=>'e','í'=>'i','ó'=>'o','ú'=>'u',
        'â'=>'a','ê'=>'e','î'=>'i','ô'=>'o','û'=>'u',
        'ã'=>'a','õ'=>'o','ç'=>'c',
    ];
    return strtr($s, $map);
}

function ehColunaDados(string $h): bool {
    $n = normalizar($h);
    if ($n === '') return true;
    $blacklist = [
        'preco', 'dano', 'critico', 'alcance', 'tipo',
        'espacos', 'penalidade', 'bonus', 'qtd', 'quantidade',
        'na defesa', 'de armadura', 'preco final', 'pp',
    ];
    foreach ($blacklist as $b) {
        if (str_contains($n, $b)) return true;
    }
    return false;
}

function ehNumerico(string $v): bool {
    return preg_match('/^\d+([.,]\d+)?$/', trim($v)) === 1;
}

function paraNumero(string $v): float {
    return (float) str_replace(',', '.', trim($v));
}

try {
    $html = file_get_contents(__DIR__ . '/equipamentos.php');
    if ($html === false) throw new RuntimeException('Não foi possível ler equipamentos.php');

    // Substitui <br> por espaço para evitar colagem de palavras quando virar textContent.
    $html = preg_replace('/<br\s*\/?>/i', ' ', $html);
    $html = mb_convert_encoding($html, 'HTML-ENTITIES', 'UTF-8');
    libxml_use_internal_errors(true);
    $dom = new DOMDocument();
    $dom->loadHTML($html);
    libxml_clear_errors();

    $xpath = new DOMXPath($dom);
    $tabelas = $xpath->query('//table');

    $catalogo = []; // nome => ['espacos' => float, 'campos' => [header => valor]]

    foreach ($tabelas as $tabela) {
        $linhas = $xpath->query('.//tr', $tabela);
        if ($linhas->length < 2) continue;

        // Localiza a primeira linha com "Espaços".
        $headerIdx = -1;
        $headerCells = [];
        foreach ($linhas as $idx => $linha) {
            $cells = $xpath->query('./td|./th', $linha);
            $textos = [];
            foreach ($cells as $c) $textos[] = textoCelula($c);
            $temEspacos = false;
            foreach ($textos as $t) {
                if (normalizar($t) === 'espacos') { $temEspacos = true; break; }
            }
            if ($temEspacos) {
                $headerIdx = $idx;
                $headerCells = $textos;
                break;
            }
        }
        if ($headerIdx === -1) continue;

        // Encontra colunas de "nome" (não-blacklist, não-espaços) — cada uma inicia uma região.
        $nameIndices = [];
        foreach ($headerCells as $i => $h) {
            if (normalizar($h) === 'espacos') continue;
            if (!ehColunaDados($h)) $nameIndices[] = $i;
        }
        if (!$nameIndices) continue;

        // Cada região vai do índice do nome até o próximo nome (exclusivo) ou fim da linha.
        $regioes = [];
        $totalCols = count($headerCells);
        for ($k = 0; $k < count($nameIndices); $k++) {
            $start = $nameIndices[$k];
            $end = ($k + 1 < count($nameIndices)) ? $nameIndices[$k + 1] : $totalCols;
            // Localiza a coluna "espacos" dentro da região.
            $eIdx = -1;
            for ($i = $start; $i < $end; $i++) {
                if (normalizar($headerCells[$i]) === 'espacos') { $eIdx = $i; break; }
            }
            if ($eIdx === -1) continue;
            $regioes[] = ['nome' => $start, 'espacos' => $eIdx, 'start' => $start, 'end' => $end];
        }
        if (!$regioes) continue;

        // Itera linhas após o header.
        foreach ($linhas as $idx => $linha) {
            if ($idx <= $headerIdx) continue;
            $cells = $xpath->query('./td|./th', $linha);
            if ($cells->length === 0) continue;

            $textos = [];
            foreach ($cells as $c) $textos[] = textoCelula($c);

            // Pula cabeçalhos de seção (todas células iguais).
            if (count(array_unique($textos)) === 1) continue;

            foreach ($regioes as $r) {
                $nome = $textos[$r['nome']] ?? '';
                $espacos = $textos[$r['espacos']] ?? '';
                if ($nome === '' || !ehNumerico($espacos)) continue;

                // Coleta os outros campos da região como key=>value.
                $campos = [];
                for ($i = $r['start']; $i < $r['end']; $i++) {
                    if ($i === $r['nome'] || $i === $r['espacos']) continue;
                    $hd = $headerCells[$i] ?? '';
                    $vl = $textos[$i] ?? '';
                    if ($hd === '' || $vl === '' || $vl === '—') continue;
                    $campos[$hd] = $vl;
                }

                if (!isset($catalogo[$nome])) {
                    $catalogo[$nome] = [
                        'espacos' => paraNumero($espacos),
                        'campos'  => $campos,
                    ];
                }
            }
        }
    }

    // Extrai descrições do formato "<p><strong>Nome.</strong> texto</p>".
    $paragrafos = $xpath->query('//p[strong]');
    foreach ($paragrafos as $p) {
        $strongs = $xpath->query('./strong', $p);
        if ($strongs->length === 0) continue;
        $primeiroStrong = $strongs->item(0);
        $tituloRaw = textoCelula($primeiroStrong);
        if (!preg_match('/^(.+?)\.\s*$/u', $tituloRaw, $m)) continue;
        $titulo = trim($m[1]);
        if (!isset($catalogo[$titulo])) continue;

        // Texto do <p> sem o primeiro <strong>.
        $cloneP = $p->cloneNode(true);
        $strongClone = $cloneP->getElementsByTagName('strong');
        if ($strongClone->length > 0) {
            $sc = $strongClone->item(0);
            if ($sc->parentNode) $sc->parentNode->removeChild($sc);
        }
        $desc = trim(preg_replace('/\s+/u', ' ', $cloneP->textContent));
        if ($desc === '') continue;

        $catalogo[$titulo]['descricao'] = $desc;
    }

    // Converte para lista ordenada.
    $itens = [];
    foreach ($catalogo as $nome => $dados) {
        $itens[] = [
            'nome'      => $nome,
            'espacos'   => $dados['espacos'],
            'campos'    => $dados['campos'] ?? [],
            'descricao' => $dados['descricao'] ?? '',
        ];
    }
    usort($itens, fn($a, $b) => strcmp(normalizar($a['nome']), normalizar($b['nome'])));

    echo json_encode([
        'success' => true,
        'itens' => $itens,
        'total' => count($itens),
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Falha ao gerar catálogo de equipamentos.',
        'error' => $e->getMessage(),
    ]);
}
