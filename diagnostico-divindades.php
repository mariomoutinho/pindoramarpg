<?php
/**
 * DIAGNÓSTICO TEMPORÁRIO — divindades.php (HTTP 500 em produção)
 *
 * Verifica somente a presença e validade dos arquivos PHP e JSON
 * usados por divindades.php. NÃO expõe senhas, config.php, dados de
 * usuário, banco ou variáveis de ambiente.
 *
 * REMOVER (ou proteger por .htaccess) após o diagnóstico:
 *   rm diagnostico-divindades.php
 *
 * Uso: abrir https://<dominio>/diagnostico-divindades.php
 */

header('Content-Type: text/plain; charset=utf-8');

$base = __DIR__;
$ok = true;

function checar_arquivo(string $path, string $rotulo): bool {
    if (!file_exists($path)) {
        echo "[FALHA] $rotulo NÃO existe: " . basename(dirname($path)) . '/' . basename($path) . "\n";
        return false;
    }
    if (!is_readable($path)) {
        echo "[FALHA] $rotulo existe mas NÃO é legível: " . basename(dirname($path)) . '/' . basename($path) . "\n";
        return false;
    }
    echo "[ OK ] $rotulo: " . basename(dirname($path)) . '/' . basename($path)
        . ' (' . filesize($path) . " bytes)\n";
    return true;
}

function checar_json(string $path, string $rotulo): bool {
    if (!checar_arquivo($path, $rotulo)) return false;
    $raw = file_get_contents($path);
    if ($raw === false) {
        echo "[FALHA] $rotulo: falha ao ler conteúdo\n";
        return false;
    }
    json_decode($raw, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo "[FALHA] $rotulo: JSON inválido (" . json_last_error_msg() . ")\n";
        return false;
    }
    echo "[ OK ] $rotulo: JSON válido\n";
    return true;
}

echo "=== Diagnóstico: divindades.php ===\n\n";
echo "PHP: " . PHP_VERSION . "\n";
echo "Base dir: " . $base . "\n\n";

echo "-- Arquivos PHP --\n";
$ok = checar_arquivo($base . '/lib/divindades.php', 'lib/divindades.php') && $ok;
$ok = checar_arquivo($base . '/lib/origens.php',    'lib/origens.php')    && $ok;

echo "\n-- Arquivos JSON --\n";
$ok = checar_json($base . '/data/divindades.json',     'data/divindades.json')     && $ok;
$ok = checar_json($base . '/data/origens.json',        'data/origens.json')        && $ok;
$ok = checar_json($base . '/data/poderes-gerais.json', 'data/poderes-gerais.json') && $ok;

echo "\n-- Funções (após require) --\n";
try {
    require_once $base . '/lib/divindades.php';
    require_once $base . '/lib/origens.php';
    echo function_exists('carregarDivindades')
        ? "[ OK ] carregarDivindades() definida\n"
        : "[FALHA] carregarDivindades() NÃO definida\n";
    echo function_exists('indexarPoderesGerais')
        ? "[ OK ] indexarPoderesGerais() definida\n"
        : "[FALHA] indexarPoderesGerais() NÃO definida\n";

    if (function_exists('carregarDivindades')) {
        $d = carregarDivindades();
        $n = count($d['divindades'] ?? []);
        echo "[INFO] carregarDivindades() retornou $n divindades\n";
    }
    if (function_exists('indexarPoderesGerais')) {
        $idx = indexarPoderesGerais();
        echo "[INFO] indexarPoderesGerais() indexou " . count($idx) . " poderes\n";
    }
} catch (\Throwable $e) {
    echo "[FALHA] Exceção ao incluir/chamar: " . $e->getMessage()
        . " em " . basename($e->getFile()) . ":" . $e->getLine() . "\n";
    $ok = false;
}

echo "\n=== Resultado: " . ($ok ? "TUDO OK" : "FALHAS DETECTADAS") . " ===\n";
echo "LEMBRETE: apague este arquivo do servidor após o diagnóstico.\n";
