<?php

require_once __DIR__ . '/../lib/personagem.php';

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

$classesData = json_decode(
    file_get_contents(__DIR__ . '/../data/classes.json'),
    true
);

echo "Caso 1: Arcanista nível 1 — total === 0 (1º nível não tem 'poder-de-arcanista')\n";
$personagem = [
    'classes' => [['id' => 'arcanista', 'nivel' => 1]],
    'poderes' => [],
];
$resultado = getSlotsDePoderDeClasseDisponiveis($personagem, $classesData);
assertEquals(0, $resultado['total'],                       'total === 0');
assertEquals(0, $resultado['porClasse'][0]['slotsGanhos'], 'slotsGanhos arcanista === 0');
assertEquals(0, $resultado['porClasse'][0]['pendentes'],   'pendentes arcanista === 0');

echo "\nCaso 2: Arcanista nível 2 sem poder escolhido — pendentes === 1\n";
$personagem = [
    'classes' => [['id' => 'arcanista', 'nivel' => 2]],
    'poderes' => [],
];
$resultado = getSlotsDePoderDeClasseDisponiveis($personagem, $classesData);
assertEquals(1, $resultado['porClasse'][0]['slotsGanhos'], 'slotsGanhos arcanista === 1');
assertEquals(0, $resultado['porClasse'][0]['slotsUsados'], 'slotsUsados arcanista === 0');
assertEquals(1, $resultado['porClasse'][0]['pendentes'],   'pendentes arcanista === 1');
assertEquals(1, $resultado['total'],                       'total === 1');

echo "\nCaso 3: Arcanista 5 / Malandro 3 com 2 poderes de arcanista e 1 de malandro\n";
$personagem = [
    'classes' => [
        ['id' => 'arcanista', 'nivel' => 5],
        ['id' => 'malandro',  'nivel' => 3],
    ],
    'poderes' => [
        ['classe' => 'arcanista', 'tipo' => 'classe', 'nome' => 'Arcano de Batalha'],
        ['classe' => 'arcanista', 'tipo' => 'classe', 'nome' => 'Magia Pungente'],
        ['classe' => 'malandro',  'tipo' => 'classe', 'nome' => 'Esquiva'],
    ],
];
$resultado = getSlotsDePoderDeClasseDisponiveis($personagem, $classesData);

$arcanista = $resultado['porClasse'][0];
$malandro  = $resultado['porClasse'][1];

assertEquals(4, $arcanista['slotsGanhos'], 'slotsGanhos arcanista (níveis 2-5) === 4');
assertEquals(2, $arcanista['slotsUsados'], 'slotsUsados arcanista === 2');
assertEquals(2, $arcanista['pendentes'],   'pendentes arcanista === 2');

assertEquals(2, $malandro['slotsGanhos'],  'slotsGanhos malandro (níveis 2-3) === 2');
assertEquals(1, $malandro['slotsUsados'],  'slotsUsados malandro === 1');
assertEquals(1, $malandro['pendentes'],    'pendentes malandro === 1');

assertEquals(3, $resultado['total'], 'total === 3');

echo "\nCaso 4: Função pura — mesma entrada produz mesma saída\n";
$personagemPuro = [
    'classes' => [['id' => 'arcanista', 'nivel' => 7]],
    'poderes' => [
        ['classe' => 'arcanista', 'tipo' => 'classe', 'nome' => 'X'],
    ],
];
$r1 = getSlotsDePoderDeClasseDisponiveis($personagemPuro, $classesData);
$r2 = getSlotsDePoderDeClasseDisponiveis($personagemPuro, $classesData);
assertEquals($r1, $r2, 'duas chamadas idênticas retornam estruturas idênticas');

echo "\nExtra: poderes gerais (tipo !== 'classe') não consomem slot\n";
$personagem = [
    'classes' => [['id' => 'arcanista', 'nivel' => 2]],
    'poderes' => [
        ['classe' => 'arcanista', 'tipo' => 'geral', 'nome' => 'Atributo+1'],
    ],
];
$resultado = getSlotsDePoderDeClasseDisponiveis($personagem, $classesData);
assertEquals(0, $resultado['porClasse'][0]['slotsUsados'], 'poder geral não conta como slot usado');
assertEquals(1, $resultado['porClasse'][0]['pendentes'],   'pendentes continua 1');

echo "\nExtra: poder de outra classe não consome slot da classe atual\n";
$personagem = [
    'classes' => [['id' => 'arcanista', 'nivel' => 2]],
    'poderes' => [
        ['classe' => 'malandro', 'tipo' => 'classe', 'nome' => 'Furtivo'],
    ],
];
$resultado = getSlotsDePoderDeClasseDisponiveis($personagem, $classesData);
assertEquals(0, $resultado['porClasse'][0]['slotsUsados'], 'poder de malandro não conta para arcanista');
assertEquals(1, $resultado['porClasse'][0]['pendentes'],   'pendentes arcanista continua 1');

echo "\n";
echo str_repeat('=', 50) . "\n";
echo "Resultado: " . ($total - $falhas) . "/{$total} asserções passaram\n";

exit($falhas === 0 ? 0 : 1);
