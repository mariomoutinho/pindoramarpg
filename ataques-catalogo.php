<?php

/**
 * Catálogo de ataques: armas (de equipamentos.php) + ataques naturais
 * (de data/ancestralidades.json e data/poderes.json).
 *
 * Cada item tem: nome, dano, critico, alcance, tipo, teste, descricao, origem.
 *   - teste = "Luta" ou "Pontaria" (perícia usada para o teste de ataque)
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

function temFormulaDano(string $v): bool {
    return preg_match('/\d+\s*d\s*\d+/i', $v) === 1;
}

function periciaParaSecao(string $secao): string {
    $n = normalizar($secao);
    $rangedKeywords = ['distancia', 'disparo', 'arremesso', 'fogo', 'arco', 'besta'];
    foreach ($rangedKeywords as $k) {
        if (str_contains($n, $k)) return 'Pontaria';
    }
    return 'Luta';
}

/**
 * Determina o tipo e a quantidade de munição consumida por ataque.
 * Retorna null para armas que não consomem munição.
 */
function detectarMunicao(string $nome, string $secao): ?array {
    $n = normalizar($nome);
    $s = normalizar($secao);

    if (str_contains($n, 'bacamarte')) {
        return ['tipo' => 'Balas', 'qtd' => 2];
    }
    if (preg_match('/(pistola|mosquete|mosquetao|trabuco|fuzil|arcabuz)/u', $n)) {
        return ['tipo' => 'Balas', 'qtd' => 1];
    }
    if (str_contains($n, 'besta')) {
        return ['tipo' => 'Virotes', 'qtd' => 1];
    }
    if (str_contains($n, 'arco') && !str_contains($s, 'arremesso')) {
        return ['tipo' => 'Flechas', 'qtd' => 1];
    }
    if (str_contains($n, 'funda')) {
        return ['tipo' => 'Pedras', 'qtd' => 1];
    }
    return null;
}

/**
 * Tenta extrair (dano, crítico, tipo) de uma descrição de poder/traço com
 * formato "(dano XdY, crítico ZZ, tipo)" ou variantes próximas.
 */
function parseAtaqueNatural(string $texto): ?array {
    if (preg_match(
        '/dano\s+(\d+\s*d\s*\d+(?:[+-]\d+)?)\s*[,;]\s*' .  // dano: 1d6 ou 1d6+1
        'cr[ií]tico\s+([^,;)]+?)\s*[,;]\s*' .             // crítico: x2, 19, 19/x3
        '([a-záéíóúãõç]+)/iu',                            // tipo: perfuração, corte, etc
        $texto, $m
    )) {
        return [
            'dano'    => preg_replace('/\s+/', '', $m[1]),
            'critico' => trim($m[2]),
            'tipo'    => mb_convert_case(trim($m[3]), MB_CASE_TITLE, 'UTF-8'),
        ];
    }
    return null;
}

try {
    $catalogo = []; // nome => dados (deduplicação)

    /* ========== Armas (equipamentos.php) ========== */
    $html = file_get_contents(__DIR__ . '/equipamentos.php');
    if ($html === false) throw new RuntimeException('Falha ao ler equipamentos.php');

    $html = preg_replace('/<br\s*\/?>/i', ' ', $html);
    $html = mb_convert_encoding($html, 'HTML-ENTITIES', 'UTF-8');

    libxml_use_internal_errors(true);
    $dom = new DOMDocument();
    $dom->loadHTML($html);
    libxml_clear_errors();
    $xpath = new DOMXPath($dom);

    $tabelas = $xpath->query('//table');
    foreach ($tabelas as $tabela) {
        $linhas = $xpath->query('.//tr', $tabela);
        if ($linhas->length < 2) continue;

        // Localiza linha de cabeçalho — precisa ter "Dano" para ser tabela de armas.
        $headerIdx = -1;
        $headerCells = [];
        foreach ($linhas as $idx => $linha) {
            $cells = $xpath->query('./td|./th', $linha);
            $textos = [];
            foreach ($cells as $c) $textos[] = textoCelula($c);
            $temDano = false;
            foreach ($textos as $t) {
                if (normalizar($t) === 'dano') { $temDano = true; break; }
            }
            if ($temDano) {
                $headerIdx = $idx;
                $headerCells = $textos;
                break;
            }
        }
        if ($headerIdx === -1) continue;

        // Mapeia colunas relevantes.
        $col = ['nome'=>0, 'preco'=>-1, 'dano'=>-1, 'critico'=>-1, 'alcance'=>-1, 'tipo'=>-1];
        foreach ($headerCells as $i => $h) {
            $n = normalizar($h);
            if ($n === 'preco' || $n === 'preço') $col['preco'] = $i;
            elseif ($n === 'dano') $col['dano'] = $i;
            elseif ($n === 'critico' || $n === 'crítico') $col['critico'] = $i;
            elseif ($n === 'alcance') $col['alcance'] = $i;
            elseif ($n === 'tipo') $col['tipo'] = $i;
        }
        if ($col['dano'] === -1) continue;

        // Itera linhas, rastreando seção atual (linhas com todas células iguais).
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
            $dano = $col['dano'] >= 0 ? ($textos[$col['dano']] ?? '') : '';
            if ($nome === '' || !temFormulaDano($dano)) continue;

            $entry = [
                'nome'      => $nome,
                'dano'      => preg_replace('/\s+/', '', $dano),
                'critico'   => trim($textos[$col['critico']] ?? 'x2'),
                'alcance'   => trim($textos[$col['alcance']] ?? '—'),
                'tipo'      => trim($textos[$col['tipo']] ?? ''),
                'teste'     => periciaParaSecao($secao),
                'origem'    => 'arma',
                'secao'     => $secao,
                'descricao' => '',
                'municao'   => detectarMunicao($nome, $secao),
            ];
            $catalogo[$nome] = $entry;
        }
    }

    // Descrições de armas (parágrafos "<p><strong>Nome.</strong> ...</p>")
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

    /* ========== Ataques naturais (ancestralidades + poderes) ========== */
    $jsonsParaVarrer = [
        'ancestralidade' => __DIR__ . '/data/ancestralidades.json',
        'poder'          => __DIR__ . '/data/poderes.json',
    ];

    $varrerRecursivo = function($obj, callable $visitor) use (&$varrerRecursivo) {
        if (is_array($obj)) {
            foreach ($obj as $v) {
                if (is_array($v) && isset($v['nome']) && isset($v['descricao'])) {
                    $visitor($v);
                }
                if (is_array($v)) $varrerRecursivo($v, $visitor);
            }
        }
    };

    foreach ($jsonsParaVarrer as $origem => $arquivo) {
        if (!file_exists($arquivo)) continue;
        $dados = json_decode(file_get_contents($arquivo), true);
        if (!is_array($dados)) continue;

        $varrerRecursivo($dados, function($entry) use (&$catalogo, $origem) {
            // Pula entradas onde descricao é array (overview de ancestralidade, etc.).
            if (!is_string($entry['descricao'])) return;
            $desc = $entry['descricao'];
            if (!is_string($entry['nome'] ?? null)) return;
            // Só interessa se parece ser arma natural (tem dano XdY na descrição).
            if (!preg_match('/dano\s+\d+\s*d\s*\d+/iu', $desc)) return;
            $parse = parseAtaqueNatural($desc);
            if (!$parse) return;

            $nome = $entry['nome'];
            if (isset($catalogo[$nome])) return; // não sobrescreve arma existente

            $catalogo[$nome] = [
                'nome'      => $nome,
                'dano'      => $parse['dano'],
                'critico'   => $parse['critico'],
                'alcance'   => '—',
                'tipo'      => $parse['tipo'],
                'teste'     => 'Luta',
                'origem'    => $origem,
                'secao'     => 'Ataque natural',
                'descricao' => $desc,
            ];
        });
    }

    $itens = array_values($catalogo);
    usort($itens, fn($a, $b) => strcmp(normalizar($a['nome']), normalizar($b['nome'])));

    echo json_encode([
        'success' => true,
        'itens'   => $itens,
        'total'   => count($itens),
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Falha ao gerar catálogo de ataques.',
        'error'   => $e->getMessage(),
    ]);
}
