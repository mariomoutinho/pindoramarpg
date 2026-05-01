<?php

require_once __DIR__ . '/personagem.php';

/**
 * Avalia se um personagem atende aos pré-requisitos de um poder.
 *
 * Retorna:
 *   [
 *     'atende'   => bool,    // todos os prereqs ESTRUTURADOS atendidos
 *     'faltando' => array[], // lista de itens com {tipo, texto, atendido}
 *   ]
 *
 * Prereqs manuais (treinamento em perícia, atributo mínimo, escola escolhida)
 * não conseguimos validar programaticamente porque a ficha ainda não tem
 * essa estrutura. Eles aparecem em "faltando" com atendido=null pra a UI
 * destacar como aviso (jogador confirma).
 */
function avaliarPrerequisitos(array $poder, array $personagem, array $poderesPorClasse): array
{
    $atendeTodos = true;
    $faltando = [];

    foreach ($poder['prerequisitos'] ?? [] as $req) {
        $tipo = $req['tipo'] ?? 'manual';

        if ($tipo === 'nivel_classe') {
            $nivelAtual = nivelDaClasse($personagem, $req['classe']);
            $exigido = (int) $req['nivel'];
            $ok = $nivelAtual >= $exigido;
            if (!$ok) {
                $atendeTodos = false;
            }
            $faltando[] = [
                'tipo'     => 'nivel_classe',
                'texto'    => "{$exigido}º nível de {$req['classe']}",
                'atendido' => $ok,
            ];
            continue;
        }

        if ($tipo === 'poder') {
            $ok = personagemTemPoder($personagem, $req['id']);
            $nomePoder = nomePoderPorId($req['id'], $poderesPorClasse) ?? $req['id'];
            if (!$ok) {
                $atendeTodos = false;
            }
            $faltando[] = [
                'tipo'     => 'poder',
                'texto'    => $nomePoder,
                'atendido' => $ok,
            ];
            continue;
        }

        if ($tipo === 'nivel_personagem' || $tipo === 'nivel') {
            $nivelAtual = nivelTotalPersonagem($personagem);
            $exigido = (int) $req['nivel'];
            $ok = $nivelAtual >= $exigido;
            if (!$ok) {
                $atendeTodos = false;
            }
            $faltando[] = [
                'tipo'     => 'nivel_personagem',
                'texto'    => $req['texto'] ?? "Nivel {$exigido}",
                'atendido' => $ok,
            ];
            continue;
        }

        if ($tipo === 'atributo' && isset($req['atributo'], $req['valor'])) {
            $valorAtual = valorAtributoPersonagem($personagem, (string) $req['atributo']);
            $valorExigido = (int) $req['valor'];
            $ok = $valorAtual >= $valorExigido;
            if (!$ok) {
                $atendeTodos = false;
            }
            $faltando[] = [
                'tipo'     => 'atributo',
                'texto'    => $req['texto'] ?? strtoupper((string) $req['atributo']) . " {$valorExigido}",
                'atendido' => $ok,
            ];
            continue;
        }

        if ($tipo === 'pericia') {
            $textoManual = (string) ($req['texto'] ?? '');
            $avaliacaoManual = avaliarPrerequisitoManual($textoManual, $personagem);
            if (($avaliacaoManual['atendido'] ?? null) === false) {
                $atendeTodos = false;
            }
            $faltando[] = [
                'tipo'     => 'pericia',
                'texto'    => $textoManual,
                'atendido' => $avaliacaoManual['atendido'] ?? null,
            ];
            continue;
        }

        $textoManual = (string) ($req['texto'] ?? '');
        $avaliacaoManual = avaliarPrerequisitoManual($textoManual, $personagem);

        if (($avaliacaoManual['atendido'] ?? null) === false) {
            $atendeTodos = false;
        }

        $faltando[] = [
            'tipo'     => $avaliacaoManual['tipo'] ?? 'manual',
            'texto'    => $textoManual,
            'atendido' => $avaliacaoManual['atendido'] ?? null,
        ];
    }

    return [
        'atende'   => $atendeTodos,
        'faltando' => $faltando,
    ];
}

function nivelDaClasse(array $personagem, string $classeId): int
{
    foreach ($personagem['classes'] ?? [] as $c) {
        if (($c['id'] ?? null) === $classeId) {
            return (int) ($c['nivel'] ?? 0);
        }
    }
    return 0;
}

function nivelTotalPersonagem(array $personagem): int
{
    if (isset($personagem['nivel']) && (int) $personagem['nivel'] > 0) {
        return (int) $personagem['nivel'];
    }

    $total = 0;
    foreach ($personagem['classes'] ?? [] as $c) {
        $total += (int) ($c['nivel'] ?? 0);
    }
    return $total;
}

function personagemTemPoder(array $personagem, string $poderId): bool
{
    foreach ($personagem['poderes'] ?? [] as $p) {
        if (($p['id'] ?? null) === $poderId) {
            return true;
        }
    }
    return false;
}

/**
 * Verifica se o personagem possui uma habilidade de classe (definida em
 * habilidadesPorNivel de data/classes.json) — diferente de um poder comprado
 * com PP, que viveria em $personagem['poderes'].
 *
 * Útil para benefícios estruturais como "Devoto Fiel", que não são comprados
 * mas sim concedidos automaticamente ao escolher uma classe.
 */
function personagemTemHabilidadeDeClasse(array $personagem, string $habilidadeId, ?array $classesData = null): bool
{
    if ($classesData === null) {
        $json = file_get_contents(__DIR__ . '/../data/classes.json');
        $classesData = json_decode($json, true);
    }

    foreach ($personagem['classes'] ?? [] as $classe) {
        $classeId = $classe['id'] ?? '';
        $nivelClasse = (int) ($classe['nivel'] ?? 0);
        $habilidadesPorNivel = $classesData[$classeId]['habilidadesPorNivel'] ?? [];

        for ($n = 1; $n <= $nivelClasse; $n++) {
            $habs = $habilidadesPorNivel[(string) $n] ?? [];
            if (in_array($habilidadeId, $habs, true)) {
                return true;
            }
        }
    }
    return false;
}

function nomePoderPorId(string $id, array $poderesPorClasse): ?string
{
    foreach ($poderesPorClasse as $lista) {
        if (isset($lista['poderes']) && is_array($lista['poderes'])) {
            $lista = $lista['poderes'];
        }
        foreach ($lista as $p) {
            if (($p['id'] ?? null) === $id) {
                return $p['nome'] ?? null;
            }
        }
    }
    return null;
}

function avaliarPrerequisitoManual(string $texto, array $personagem): array
{
    $normalizado = normalizarTextoPoder($texto);

    if (preg_match('/\b(for|des|con|int|sab|car)\s*(-?\d+)\b/u', $normalizado, $m)) {
        $valorAtual = valorAtributoPersonagem($personagem, $m[1]);
        $valorExigido = (int) $m[2];

        return [
            'tipo' => 'atributo',
            'atendido' => $valorAtual >= $valorExigido,
        ];
    }

    if (preg_match('/^treinad[oa]\s+em\s+(.+)$/u', $normalizado, $m)) {
        $textoPericias = preg_replace('/\s+e\s+\d+\s*(o\s+)?nivel.*$/u', '', $m[1]);
        $alternativas = preg_split('/\s+ou\s+/u', $textoPericias, -1, PREG_SPLIT_NO_EMPTY);
        $ok = false;

        foreach ($alternativas as $alternativa) {
            $pericias = preg_split('/\s+e\s+|,\s*/u', $alternativa, -1, PREG_SPLIT_NO_EMPTY);
            $okAlternativa = true;

            foreach ($pericias as $pericia) {
                if (!personagemTreinadoEmPericia($personagem, $pericia)) {
                    $okAlternativa = false;
                    break;
                }
            }

            if ($okAlternativa) {
                $ok = true;
                break;
            }
        }

        return [
            'tipo' => 'pericia',
            'atendido' => $ok,
        ];
    }

    if (preg_match('/^(devoto\s+de|devocao\s+a)\s+(.+)$/u', $normalizado, $m)) {
        $divindade = normalizarTextoPoder((string) ($personagem['divindade'] ?? ''));
        $opcoes = preg_split('/\s+ou\s+|,\s*/u', $m[2], -1, PREG_SPLIT_NO_EMPTY);
        $ok = false;

        foreach ($opcoes as $opcao) {
            if ($divindade !== '' && $divindade === normalizarTextoPoder($opcao)) {
                $ok = true;
                break;
            }
        }

        return [
            'tipo' => 'devocao',
            'atendido' => $ok,
        ];
    }

    return [
        'tipo' => 'manual',
        'atendido' => null,
    ];
}

function valorAtributoPersonagem(array $personagem, string $sigla): int
{
    $atributos = $personagem['atributos'] ?? [];
    $sigla = normalizarTextoPoder($sigla);

    return (int) ($atributos[$sigla] ?? 0);
}

function personagemTreinadoEmPericia(array $personagem, string $pericia): bool
{
    $periciaNormalizada = normalizarNomePericia($pericia);

    foreach ($personagem['pericias_treinadas'] ?? [] as $treinada) {
        $treinadaNormalizada = normalizarNomePericia((string) $treinada);
        $treinadaBase = preg_replace('/\s+\d+$/', '', $treinadaNormalizada);

        if (
            $treinadaNormalizada === $periciaNormalizada ||
            $treinadaBase === $periciaNormalizada ||
            str_starts_with($periciaNormalizada, $treinadaBase . ' ')
        ) {
            return true;
        }
    }

    return false;
}

function normalizarNomePericia(string $valor): string
{
    $valor = preg_replace('/\([^)]*\)/', '', $valor);
    $valor = normalizarTextoPoder($valor);
    $valor = preg_replace('/\s+/', ' ', $valor);

    return trim($valor);
}

function normalizarTextoPoder(string $valor): string
{
    $valor = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $valor);
    $valor = strtolower(trim((string) $valor));
    $valor = preg_replace('/[^a-z0-9\s-]/', '', $valor);

    return $valor;
}

/**
 * Retorna se o personagem pode adquirir agora um poder específico.
 * Regras: não pode já estar adquirido, prereqs estruturados precisam estar
 * atendidos, e o personagem precisa ter pelo menos 1 PP disponível.
 *
 *   ['pode' => bool, 'razao' => string]
 */
function podeAdquirirPoder(
    array $personagem,
    array $poder,
    int $ppAtuais,
    array $poderesPorClasse
): array {
    if (personagemTemPoder($personagem, $poder['id'])) {
        return ['pode' => false, 'razao' => 'Você já possui este poder.'];
    }

    $aval = avaliarPrerequisitos($poder, $personagem, $poderesPorClasse);
    if (!$aval['atende']) {
        return ['pode' => false, 'razao' => 'Pré-requisito não atendido.'];
    }

    // Poderes divinos (concedidos pela divindade) não custam PP — são automáticos
    // ao se tornar devoto. O limite vem da habilidade de classe "Devoto Fiel"
    // (1 padrão, 2 com Devoto Fiel).
    if (($poder['categoria'] ?? '') === 'divinos') {
        require_once __DIR__ . '/divindades.php';

        $temDevotoFiel = personagemTemHabilidadeDeClasse($personagem, 'devoto-fiel');

        $poderesAdquiridos = $personagem['poderes'] ?? [];
        $idsPoderesAdquiridos = array_map(fn($p) => $p['id'] ?? '', $poderesAdquiridos);

        $poderesGerais = isset($poderesPorClasse['geral_divinos']) ? $poderesPorClasse['geral_divinos'] : [];
        $idsPoderesDiv = array_map(fn($p) => $p['id'] ?? '', $poderesGerais);

        $poderesDeClasseDivina = array_filter($idsPoderesAdquiridos, function($id) use ($idsPoderesDiv) {
            return in_array($id, $idsPoderesDiv, true);
        });

        $limite = $temDevotoFiel ? 2 : 1;
        if (count($poderesDeClasseDivina) >= $limite) {
            $razao = $temDevotoFiel
                ? 'Você já adquiriu os 2 poderes concedidos permitidos pela habilidade Devoto Fiel.'
                : 'Você já possui um poder concedido por sua divindade. Apenas devotos com a habilidade Devoto Fiel podem ter 2.';
            return ['pode' => false, 'razao' => $razao];
        }

        return ['pode' => true, 'razao' => ''];
    }

    if ($ppAtuais <= 0) {
        return ['pode' => false, 'razao' => 'Sem PP para gastar.'];
    }

    return ['pode' => true, 'razao' => ''];
}

/**
 * Monta o estado completo dos poderes pra renderizar na UI da ficha.
 *
 * Retorna por classe do personagem:
 *   [
 *     'classeId'   => 'arcanista',
 *     'slots'      => { ganhos, usados, pendentes },
 *     'adquiridos' => [ {id, nome, descricao}, ... ],
 *     'disponiveis'=> [ {poder, prereqs} ]   // atende prereqs estruturados
 *     'bloqueados' => [ {poder, prereqs} ]   // não atende prereqs
 *   ]
 */
function getPoderesParaUI(
    array $personagem,
    int $ppAtuais,
    ?array $poderesData = null,
    ?array $classesData = null
): array {
    if ($poderesData === null) {
        $poderesData = json_decode(file_get_contents(__DIR__ . '/../data/poderes.json'), true);
    }
    if ($classesData === null) {
        $classesData = json_decode(file_get_contents(__DIR__ . '/../data/classes.json'), true);
    }

    $resultado = [];
    foreach ($personagem['classes'] ?? [] as $classe) {
        $classeId = $classe['id'];
        $listaClasse = $poderesData[$classeId] ?? [];

        $adquiridos = [];
        $disponiveis = [];
        $bloqueados = [];

        foreach ($listaClasse as $poder) {
            $poder['classe'] = $classeId;

            if (personagemTemPoder($personagem, $poder['id'])) {
                $adquiridos[] = $poder;
                continue;
            }

            $aval = avaliarPrerequisitos($poder, $personagem, $poderesData);
            $podeAdq = podeAdquirirPoder($personagem, $poder, $ppAtuais, $poderesData);

            $entry = [
                'poder'        => $poder,
                'prereqs'      => $aval['faltando'],
                'atende'       => $aval['atende'],
                'pode_adquirir'=> $podeAdq['pode'],
                'razao_bloqueio'=> $podeAdq['pode'] ? null : $podeAdq['razao'],
            ];

            if ($aval['atende']) {
                $disponiveis[] = $entry;
            } else {
                $bloqueados[] = $entry;
            }
        }

        $resultado[] = [
            'classeId'    => $classeId,
            'nomeClasse'  => $classesData[$classeId]['nome'] ?? $classeId,
            'adquiridos'  => $adquiridos,
            'disponiveis' => $disponiveis,
            'bloqueados'  => $bloqueados,
        ];
    }

    return $resultado;
}

/**
 * Calcula PP total da regra: 1 PP a cada nível do 2º em diante (somando todas as classes).
 * Ex.: arcanista 5 + malandro 3 = 8 níveis totais → 7 PP totais.
 */
function getPoderesGeraisParaUI(
    array $personagem,
    int $ppAtuais,
    ?array $poderesGeraisData = null,
    ?array $poderesClasseData = null
): array {
    if ($poderesGeraisData === null) {
        $poderesGeraisData = json_decode(file_get_contents(__DIR__ . '/../data/poderes-gerais.json'), true);
    }
    if ($poderesClasseData === null) {
        $poderesClasseData = json_decode(file_get_contents(__DIR__ . '/../data/poderes.json'), true);
    }

    require_once __DIR__ . '/divindades.php';
    $idsPermitidosDivindade = poderesPermitidosPelaDivindade($personagem);
    $temDivindade = !empty($idsPermitidosDivindade);

    $todosPoderes = $poderesClasseData;
    foreach ($poderesGeraisData['categorias'] ?? [] as $categoria) {
        $todosPoderes['geral_' . ($categoria['id'] ?? '')] = $categoria['poderes'] ?? [];
    }

    $resultado = [];

    foreach ($poderesGeraisData['categorias'] ?? [] as $categoria) {
        $adquiridos = [];
        $disponiveis = [];
        $bloqueados = [];

        $poderesDaCategoria = $categoria['poderes'] ?? [];

        // Categoria "divinos": só mostra os poderes da divindade do personagem.
        // Sem divindade → categoria fica vazia (o front pode esconder o grupo).
        if (($categoria['id'] ?? '') === 'divinos') {
            if (!$temDivindade) {
                $poderesDaCategoria = [];
            } else {
                $poderesDaCategoria = array_values(array_filter(
                    $poderesDaCategoria,
                    fn($p) => in_array($p['id'] ?? '', $idsPermitidosDivindade, true)
                ));
            }
        }

        foreach ($poderesDaCategoria as $poder) {
            $poder['tipo'] = 'geral';
            $poder['categoria'] = $categoria['id'] ?? '';

            if (personagemTemPoder($personagem, $poder['id'])) {
                $adquiridos[] = $poder;
                continue;
            }

            $aval = avaliarPrerequisitos($poder, $personagem, $todosPoderes);
            $podeAdq = podeAdquirirPoder($personagem, $poder, $ppAtuais, $todosPoderes);

            $entry = [
                'poder'         => $poder,
                'prereqs'       => $aval['faltando'],
                'atende'        => $aval['atende'],
                'pode_adquirir' => $podeAdq['pode'],
                'razao_bloqueio'=> $podeAdq['pode'] ? null : $podeAdq['razao'],
            ];

            if ($aval['atende']) {
                $disponiveis[] = $entry;
            } else {
                $bloqueados[] = $entry;
            }
        }

        $resultado[] = [
            'categoriaId' => $categoria['id'] ?? '',
            'nome'        => $categoria['nome'] ?? ($categoria['id'] ?? ''),
            'descricao'   => $categoria['descricao'] ?? '',
            'adquiridos'  => $adquiridos,
            'disponiveis' => $disponiveis,
            'bloqueados'  => $bloqueados,
        ];
    }

    return $resultado;
}

function calcularPpTotal(array $personagem): int
{
    $nivelTotal = 0;
    foreach ($personagem['classes'] ?? [] as $c) {
        $nivelTotal += (int) ($c['nivel'] ?? 0);
    }
    return max(0, $nivelTotal - 1);
}
