<?php
// diagnostico-ficha.php — endpoint TEMPORÁRIO para diagnosticar o
// vínculo ficha↔usuário em produção. Remover quando o erro de salvar
// ficha estiver resolvido.
//
// Exige login. Não imprime senhas, hashes, credenciais, dump de linhas
// nem nomes de banco/usuário. Só responde:
//   - usuário logado (apenas id);
//   - existência das tabelas necessárias;
//   - existência das colunas necessárias;
//   - modo de vínculo escolhido em runtime (coluna|tabela|null);
//   - última mensagem registrada por garantirColunaUsuarioFicha();
//   - contagem de fichas vinculadas ao usuário logado.

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

$preparado = garantirColunaUsuarioFicha($pdo);
$modo = modoVinculoUsuarioFicha($pdo);

$diagnostico = [
    'usuario_logado_id' => (int) $usuarioAtual['id'],
    'tabelas' => [
        'usuarios'       => tabelaExiste($pdo, 'usuarios'),
        'fichas'         => tabelaExiste($pdo, 'fichas'),
        'ficha_usuarios' => tabelaExiste($pdo, 'ficha_usuarios'),
    ],
    'colunas' => [
        'fichas.usuario_id' => colunaExiste($pdo, 'fichas', 'usuario_id'),
    ],
    'vinculo' => [
        'preparado_em_runtime' => $preparado,
        'modo'                 => $modo, // 'coluna' | 'tabela' | null
        'ultimo_erro_runtime'  => ultimoErroVinculoFicha(),
    ],
    'contagem_fichas_do_usuario' => $modo
        ? contarFichasUsuario($pdo, $modo, (int) $usuarioAtual['id'])
        : null,
    'recomendacao' => $preparado
        ? 'Vínculo pronto. Salvar/listar/carregar deve funcionar para este usuário.'
        : 'Aplique migrations/013_ficha_usuarios_fallback.sql no MySQL da '
          . 'hospedagem (phpMyAdmin → SQL → cole o conteúdo da migration → Executar). '
          . 'Se o usuário do banco não tiver privilégio CREATE/ALTER, ajuste no hPanel.',
];

echo json_encode($diagnostico, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
