<?php

/**
 * Forma esperada de $personagem:
 *   [
 *     'classes' => [
 *       ['id' => 'arcanista', 'nivel' => 5],
 *       ['id' => 'malandro',  'nivel' => 3],
 *     ],
 *     'poderes' => [
 *       ['classe' => 'arcanista', 'tipo' => 'classe', ...],
 *       ['classe' => 'malandro',  'tipo' => 'classe', ...],
 *     ],
 *   ]
 *
 * $classesData é o conteúdo decodificado de data/classes.json. É passado
 * por parâmetro para manter a função pura (mesma entrada → mesma saída).
 * Quando omitido, é carregado de data/classes.json a partir da raiz do projeto.
 */
function getSlotsDePoderDeClasseDisponiveis(array $personagem, ?array $classesData = null): array
{
    if ($classesData === null) {
        $json = file_get_contents(__DIR__ . '/../data/classes.json');
        $classesData = json_decode($json, true);
    }

    $classesPersonagem = $personagem['classes'] ?? [];
    $poderes = $personagem['poderes'] ?? [];

    $porClasse = [];
    $total = 0;

    foreach ($classesPersonagem as $classe) {
        $classeId = $classe['id'];
        $nivelClasse = (int) $classe['nivel'];
        $marcador = "poder-de-{$classeId}";

        $habilidadesPorNivel = $classesData[$classeId]['habilidadesPorNivel'] ?? [];

        $slotsGanhos = 0;
        for ($n = 1; $n <= $nivelClasse; $n++) {
            $habs = $habilidadesPorNivel[(string) $n] ?? [];
            foreach ($habs as $hab) {
                if ($hab === $marcador) {
                    $slotsGanhos++;
                }
            }
        }

        $slotsUsados = 0;
        foreach ($poderes as $poder) {
            if (
                ($poder['classe'] ?? null) === $classeId &&
                ($poder['tipo'] ?? null) === 'classe'
            ) {
                $slotsUsados++;
            }
        }

        $pendentes = max(0, $slotsGanhos - $slotsUsados);
        $total += $pendentes;

        $porClasse[] = [
            'classeId'    => $classeId,
            'nivelClasse' => $nivelClasse,
            'slotsGanhos' => $slotsGanhos,
            'slotsUsados' => $slotsUsados,
            'pendentes'   => $pendentes,
        ];
    }

    return [
        'total'     => $total,
        'porClasse' => $porClasse,
    ];
}

/**
 * Converte a estrutura retornada por buscar-ficha.php no formato esperado
 * por getSlotsDePoderDeClasseDisponiveis. Usado quando você tem uma linha
 * vinda do banco e quer alimentar a função.
 */
function fichaParaPersonagem(array $ficha): array
{
    return [
        'classes' => $ficha['classes'] ?? [],
        'poderes' => $ficha['poderes'] ?? [],
    ];
}
