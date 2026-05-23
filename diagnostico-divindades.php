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

function caminho_relativo_seguro(string $path): string {
    return basename(dirname($path)) . '/' . basename($path);
}

function checar_arquivo(string $path, string $rotulo): bool {
    if (!file_exists($path)) {
        echo "[FALHA] $rotulo NÃO existe: " . caminho_relativo_seguro($path) . "\n";
        return false;
    }
    if (!is_readable($path)) {
        echo "[FALHA] $rotulo existe mas NÃO é legível: " . caminho_relativo_seguro($path) . "\n";
        return false;
    }
    echo "[ OK ] $rotulo: " . caminho_relativo_seguro($path)
        . ' (' . filesize($path) . " bytes)\n";
    return true;
}

function escolher_helper(string $primario, string $fallback, string $rotulo): string {
    if (is_file($primario) && is_readable($primario)) {
        echo "[INFO] $rotulo usando fonte primária: " . caminho_relativo_seguro($primario) . "\n";
        return $primario;
    }
    echo "[INFO] $rotulo usando fallback: " . caminho_relativo_seguro($fallback) . "\n";
    return $fallback;
}

function tentar_restaurar_helper(string $primario, string $fallback, string $rotulo): void {
    if (is_file($primario) || !is_file($fallback)) {
        return;
    }

    $dir = dirname($primario);
    if (!is_dir($dir)) {
        @mkdir($dir, 0755);
    }
    if (is_dir($dir) && is_writable($dir) && @copy($fallback, $primario)) {
        echo "[ OK ] $rotulo restaurado em " . caminho_relativo_seguro($primario) . "\n";
    }
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

function registrar_falha(string $mensagem): void {
    global $ok;
    echo "[FALHA] $mensagem\n";
    $ok = false;
}

function checar_chaves(array $dados, array $esperadas, string $rotulo): void {
    $chaves = array_keys($dados);
    echo "[INFO] $rotulo chaves principais: " . implode(', ', $chaves) . "\n";
    foreach ($esperadas as $chave) {
        if (!array_key_exists($chave, $dados)) {
            registrar_falha("$rotulo sem chave obrigatória '$chave'");
        } else {
            echo "[ OK ] $rotulo contém '$chave'\n";
        }
    }
}

echo "=== Diagnóstico: divindades.php ===\n\n";
echo "PHP: " . PHP_VERSION . "\n";
echo "Diretório base: " . basename($base) . " (caminho absoluto omitido)\n\n";

echo "-- Restauração opcional de helpers primários --\n";
tentar_restaurar_helper($base . '/lib/divindades.php', $base . '/includes/divindades.php', 'lib/divindades.php');
tentar_restaurar_helper($base . '/lib/origens.php', $base . '/includes/origens.php', 'lib/origens.php');
echo "\n";

echo "-- Arquivos PHP --\n";
$ok = checar_arquivo($base . '/lib/divindades.php', 'lib/divindades.php') && $ok;
$ok = checar_arquivo($base . '/lib/origens.php',    'lib/origens.php')    && $ok;
$ok = checar_arquivo($base . '/includes/divindades.php', 'includes/divindades.php') && $ok;
$ok = checar_arquivo($base . '/includes/origens.php',    'includes/origens.php')    && $ok;

echo "\n-- Arquivos JSON --\n";
$ok = checar_json($base . '/data/divindades.json',     'data/divindades.json')     && $ok;
$ok = checar_json($base . '/data/origens.json',        'data/origens.json')        && $ok;
$ok = checar_json($base . '/data/poderes-gerais.json', 'data/poderes-gerais.json') && $ok;

echo "\n-- Funções (após require) --\n";
try {
    $divindadesHelper = escolher_helper(
        $base . '/lib/divindades.php',
        $base . '/includes/divindades.php',
        'Divindades'
    );
    $origensHelper = escolher_helper(
        $base . '/lib/origens.php',
        $base . '/includes/origens.php',
        'Origens'
    );
    require_once $divindadesHelper;
    require_once $origensHelper;
    if (function_exists('carregarDivindades')) {
        echo "[ OK ] carregarDivindades() definida\n";
    } else {
        registrar_falha('carregarDivindades() NÃO definida');
    }
    if (function_exists('indexarPoderesGerais')) {
        echo "[ OK ] indexarPoderesGerais() definida\n";
    } else {
        registrar_falha('indexarPoderesGerais() NÃO definida');
    }

    echo "\n-- Execução das funções --\n";
    if (function_exists('carregarDivindades')) {
        echo "[INFO] Executando carregarDivindades()...\n";
        $d = carregarDivindades();
        if (!is_array($d)) {
            registrar_falha('carregarDivindades() não retornou array');
            $d = [];
        } else {
            echo "[ OK ] carregarDivindades() executou sem exceção\n";
        }
        checar_chaves($d, ['divindades', 'introducao', 'regras'], 'carregarDivindades()');
        $n = count($d['divindades'] ?? []);
        echo "[INFO] carregarDivindades() retornou $n divindades\n";
    }
    if (function_exists('indexarPoderesGerais')) {
        echo "[INFO] Executando indexarPoderesGerais()...\n";
        $idx = indexarPoderesGerais();
        if (!is_array($idx)) {
            registrar_falha('indexarPoderesGerais() não retornou array');
            $idx = [];
        } else {
            echo "[ OK ] indexarPoderesGerais() executou sem exceção\n";
        }
        echo "[INFO] indexarPoderesGerais() indexou " . count($idx) . " poderes\n";
        $amostra = reset($idx);
        if (is_array($amostra)) {
            echo "[INFO] indexarPoderesGerais() chaves de amostra: " . implode(', ', array_keys($amostra)) . "\n";
            foreach (['id', 'nome', 'descricao', 'categoria_nome'] as $chave) {
                if (!array_key_exists($chave, $amostra)) {
                    registrar_falha("Poder indexado sem chave esperada '$chave'");
                } else {
                    echo "[ OK ] Poder indexado contém '$chave'\n";
                }
            }
        } elseif (empty($idx)) {
            registrar_falha('indexarPoderesGerais() retornou índice vazio');
        } else {
            registrar_falha('indexarPoderesGerais() retornou itens em formato inesperado');
        }
    }
} catch (\Throwable $e) {
    echo "[FALHA] Exceção ao incluir/chamar: " . $e->getMessage()
        . " em " . basename($e->getFile()) . ":" . $e->getLine() . "\n";
    $ok = false;
}

echo "\n=== Resultado: " . ($ok ? "TUDO OK" : "FALHAS DETECTADAS") . " ===\n";
echo "LEMBRETE: apague este arquivo do servidor após o diagnóstico.\n";
