<?php

require_once __DIR__ . '/../lib/poderes.php';

$falhas = 0;
$total = 0;

function assertEquals($esperado, $obtido, string $mensagem): void
{
    global $falhas, $total;
    $total++;

    if ($esperado === $obtido) {
        echo "  OK   {$mensagem}\n";
        return;
    }

    $falhas++;
    echo "  FAIL {$mensagem}\n";
    echo "       esperado: " . json_encode($esperado, JSON_UNESCAPED_UNICODE) . "\n";
    echo "       obtido:   " . json_encode($obtido,  JSON_UNESCAPED_UNICODE) . "\n";
}

$poderes  = json_decode(file_get_contents(__DIR__ . '/../data/poderes.json'),  true);
$classes  = json_decode(file_get_contents(__DIR__ . '/../data/classes.json'),  true);

echo "Caso 1: arcanista nível 5 sem poderes — Blindagem Defletora bloqueada (precisa lvl 14 + Deflexão)\n";
$personagem = [
    'classes' => [['id' => 'arcanista', 'nivel' => 5]],
    'poderes' => [],
];
$poder = array_values(array_filter($poderes['arcanista'], fn($p) => $p['id'] === 'arc-blindagem-defletora'))[0];
$aval = avaliarPrerequisitos($poder, $personagem, $poderes);
assertEquals(false, $aval['atende'], 'não atende prereqs');
assertEquals(2, count($aval['faltando']), 'dois prereqs listados');
assertEquals(false, $aval['faltando'][0]['atendido'], 'nivel 14 não atendido');
assertEquals(false, $aval['faltando'][1]['atendido'], 'Deflexão Arcana ausente');

echo "\nCaso 2: arcanista nível 14 com Deflexão Arcana — Blindagem Defletora liberada\n";
$personagem = [
    'classes' => [['id' => 'arcanista', 'nivel' => 14]],
    'poderes' => [['id' => 'arc-deflexao-arcana', 'classe' => 'arcanista', 'tipo' => 'classe']],
];
$aval = avaliarPrerequisitos($poder, $personagem, $poderes);
assertEquals(true, $aval['atende'], 'atende prereqs');
assertEquals(true, $aval['faltando'][0]['atendido'], 'nivel 14 ok');
assertEquals(true, $aval['faltando'][1]['atendido'], 'Deflexão Arcana ok');

echo "\nCaso 3: prereq de pericia manual e avaliado pela ficha\n";
$poder = array_values(array_filter($poderes['arcanista'], fn($p) => $p['id'] === 'arc-lamina-arcana'))[0];
$aval = avaliarPrerequisitos($poder, ['classes' => [['id'=>'arcanista','nivel'=>2]], 'poderes' => []], $poderes);
assertEquals(false, $aval['atende'], 'pericia ausente bloqueia');
assertEquals(false, $aval['faltando'][0]['atendido'], 'treino ausente fica marcado como faltando');
assertEquals('Treinado em Luta', $aval['faltando'][0]['texto'], 'texto do prereq manual');

echo "\nCaso 4: podeAdquirirPoder bloqueia sem PP\n";
$personagem = [
    'classes' => [['id' => 'arcanista', 'nivel' => 5]],
    'poderes' => [],
];
$poder = array_values(array_filter($poderes['arcanista'], fn($p) => $p['id'] === 'arc-arcano-de-batalha'))[0];
$poder['classe'] = 'arcanista';
$r = podeAdquirirPoder($personagem, $poder, 0, $poderes);
assertEquals(false, $r['pode'], 'sem PP não pode');
assertEquals('Sem PP para gastar.', $r['razao'], 'razão correta');

echo "\nCaso 5: PP é o único limite — basta ter PP e prereqs OK\n";
$personagem = [
    'classes' => [['id' => 'arcanista', 'nivel' => 1]],
    'poderes' => [],
];
$r = podeAdquirirPoder($personagem, $poder, 5, $poderes);
assertEquals(true, $r['pode'], 'com PP e sem prereq, pode adquirir mesmo no nível 1');

echo "\nCaso 6: podeAdquirirPoder bloqueia se prereq estruturado falha (mesmo com PP)\n";
$personagem = [
    'classes' => [['id' => 'arcanista', 'nivel' => 5]],
    'poderes' => [],
];
$poderBloqueado = array_values(array_filter($poderes['arcanista'], fn($p) => $p['id'] === 'arc-blindagem-defletora'))[0];
$poderBloqueado['classe'] = 'arcanista';
$r = podeAdquirirPoder($personagem, $poderBloqueado, 5, $poderes);
assertEquals(false, $r['pode'], 'prereq não atendido bloqueia');
assertEquals('Pré-requisito não atendido.', $r['razao'], 'razão correta');

echo "\nCaso 7: getPoderesParaUI agrupa em adquiridos / disponíveis / bloqueados\n";
$personagem = [
    'classes' => [
        ['id' => 'arcanista', 'nivel' => 5],
        ['id' => 'malandro',  'nivel' => 3],
    ],
    'poderes' => [
        ['id' => 'arc-deflexao-arcana', 'classe' => 'arcanista', 'tipo' => 'classe'],
    ],
];
$ui = getPoderesParaUI($personagem, 5, $poderes, $classes);
assertEquals(2, count($ui), 'dois grupos (uma classe cada)');
assertEquals('arcanista', $ui[0]['classeId'], 'primeiro grupo é arcanista');
assertEquals(1, count($ui[0]['adquiridos']), 'um poder adquirido em arcanista');

// Blindagem Defletora deve estar em bloqueados (precisa nivel 14)
$bloqueadosIds = array_column(array_column($ui[0]['bloqueados'], 'poder'), 'id');
$dispIds = array_column(array_column($ui[0]['disponiveis'], 'poder'), 'id');
assertEquals(true, in_array('arc-blindagem-defletora', $bloqueadosIds), 'Blindagem Defletora bloqueada');
assertEquals(true, in_array('arc-arcano-de-batalha',   $dispIds),       'Arcano de Batalha disponível');

echo "\nCaso 8: calcularPpTotal — arcanista 5 + malandro 3 = 8 níveis = 7 PP\n";
$personagem = [
    'classes' => [
        ['id' => 'arcanista', 'nivel' => 5],
        ['id' => 'malandro',  'nivel' => 3],
    ],
];
assertEquals(7, calcularPpTotal($personagem), 'PP total = nível total - 1');

echo "\nCaso 9: calcularPpTotal — nível 1 = 0 PP\n";
assertEquals(0, calcularPpTotal(['classes' => [['id'=>'arcanista','nivel'=>1]]]), '1º nível = 0 PP');

echo "\n";
echo str_repeat('=', 50) . "\n";
echo "Resultado: " . ($total - $falhas) . "/{$total} asserções passaram\n";

exit($falhas === 0 ? 0 : 1);
