<?php
// diagnostico-ficha.php — endpoint TEMPORÁRIO para diagnosticar o
// vínculo ficha↔usuário em produção. Remover quando o erro de salvar
// ficha estiver resolvido.
//
// Exige login. Não imprime senhas, hashes, credenciais, dump de linhas
// nem nomes de banco/usuário. Só responde:
//   - usuário logado (apenas id);
//   - existência das tabelas necessárias;
//   - existência das colunas obrigatórias em `fichas`;
//   - modo de vínculo escolhido em runtime (coluna|tabela|null);
//   - última mensagem registrada por garantirColunaUsuarioFicha();
//   - contagem de fichas vinculadas ao usuário logado;
//   - recomendação de qual migration aplicar.

require_once __DIR__ . '/includes/auth.php';
$usuarioAtual = exigirLogin();

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/includes/permissions.php';

header('Content-Type: application/json');

function tabelaExiste(PDO $pdo, string $nome): bool
{
    try {
        $stmt = $pdo->prepare(
            "SELECT 1 FROM information_schema.TABLES
              WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = :n LIMIT 1"
        );
        $stmt->execute(['n' => $nome]);
        return (bool) $stmt->fetchColumn();
    } catch (Throwable $e) {
        return false;
    }
}

function colunaExiste(PDO $pdo, string $tabela, string $coluna): bool
{
    try {
        $stmt = $pdo->prepare(
            "SELECT 1 FROM information_schema.COLUMNS
              WHERE TABLE_SCHEMA = DATABASE()
                AND TABLE_NAME = :t AND COLUMN_NAME = :c LIMIT 1"
        );
        $stmt->execute(['t' => $tabela, 'c' => $coluna]);
        return (bool) $stmt->fetchColumn();
    } catch (Throwable $e) {
        return false;
    }
}

function contarFichasUsuario(PDO $pdo, string $modo, int $usuarioId): ?int
{
    try {
        if ($modo === 'coluna') {
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM fichas WHERE usuario_id = :uid");
            $stmt->execute(['uid' => $usuarioId]);
            return (int) $stmt->fetchColumn();
        }
        if ($modo === 'tabela') {
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM ficha_usuarios WHERE usuario_id = :uid");
            $stmt->execute(['uid' => $usuarioId]);
            return (int) $stmt->fetchColumn();
        }
    } catch (Throwable $e) {
        return null;
    }
    return null;
}

// Colunas que salvar-ficha.php / listar-fichas.php / buscar-ficha.php
// esperam encontrar na tabela `fichas`. Se alguma faltar, é sinal de
// que falta aplicar alguma migration 001-007.
$colunasEsperadas = [
    'usuario_id',
    'participante', 'personagem', 'ancestralidade', 'origem', 'classe',
    'nivel', 'divindade',
    'personagem_imagem', 'personagem_imagem_ajuste',
    'personagem_token_imagem', 'personagem_token_imagem_ajuste',
    'forca', 'destreza', 'constituicao', 'inteligencia', 'sabedoria', 'carisma',
    'pv_total', 'pv_atuais', 'pm_total', 'pm_atuais', 'pp_total', 'pp_atuais',
    'origem_beneficios',
    'defesa_total', 'defesa_destreza', 'defesa_armadura', 'defesa_escudo', 'defesa_outros',
    'armadura_escudo', 'proficiencias', 'habilidades_magias', 'equipamentos',
    'ataques', 'pericias',
    'dinheiro', 'carga',
    'created_at', 'updated_at',
];

$preparado = garantirColunaUsuarioFicha($pdo);
$modo = modoVinculoUsuarioFicha($pdo);

$tabelas = [
    'usuarios'       => tabelaExiste($pdo, 'usuarios'),
    'fichas'         => tabelaExiste($pdo, 'fichas'),
    'ficha_classes'  => tabelaExiste($pdo, 'ficha_classes'),
    'ficha_poderes'  => tabelaExiste($pdo, 'ficha_poderes'),
    'ficha_usuarios' => tabelaExiste($pdo, 'ficha_usuarios'),
];

$colunasFichas = [];
$colunasFaltando = [];
if ($tabelas['fichas']) {
    foreach ($colunasEsperadas as $col) {
        $existe = colunaExiste($pdo, 'fichas', $col);
        $colunasFichas[$col] = $existe;
        if (!$existe) {
            $colunasFaltando[] = $col;
        }
    }
}

if (!$tabelas['fichas']) {
    $recomendacao = 'A tabela fichas não existe. Aplique '
        . 'migrations/014_criar_tabela_fichas.sql no MySQL da hospedagem '
        . '(phpMyAdmin → SQL → cole o conteúdo da migration → Executar). '
        . 'Ela é idempotente e também cria ficha_classes/ficha_poderes se ainda faltarem.';
} elseif (!empty($colunasFaltando)) {
    $recomendacao = 'A tabela fichas existe, mas faltam colunas: '
        . implode(', ', $colunasFaltando)
        . '. Aplique as migrations 001 a 007 da pasta migrations/ no '
        . 'phpMyAdmin (ou 014, que cria a tabela completa quando ainda '
        . 'não existir).';
} elseif (!$preparado) {
    $recomendacao = 'A tabela fichas existe mas o vínculo não foi '
        . 'preparado em runtime. Verifique o campo ultimo_erro_runtime.';
} else {
    $recomendacao = 'Tudo certo. Salvar/listar/carregar deve funcionar para este usuário.';
}

$diagnostico = [
    'usuario_logado_id' => (int) $usuarioAtual['id'],
    'tabelas' => $tabelas,
    'colunas_fichas' => $colunasFichas,
    'colunas_faltando_em_fichas' => $colunasFaltando,
    'vinculo' => [
        'preparado_em_runtime' => $preparado,
        'modo'                 => $modo, // 'coluna' | 'tabela' | null
        'ultimo_erro_runtime'  => ultimoErroVinculoFicha(),
    ],
    'contagem_fichas_do_usuario' => $modo
        ? contarFichasUsuario($pdo, $modo, (int) $usuarioAtual['id'])
        : null,
    'recomendacao' => $recomendacao,
];

echo json_encode($diagnostico, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
