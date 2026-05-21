<?php
// includes/permissions.php — autorização baseada em papéis.
//
// Camada acima de includes/auth.php que responde "este usuário pode
// fazer X em Y?". Os checks são pequenos e lêem o banco sob demanda.
//
// Nota técnica para evolução futura:
//   - usuarios.role é o papel "padrão/global" usado em telas que ainda
//     não estão amarradas a uma mesa específica (ex.: painel inicial).
//   - mesa_participantes.papel é o papel real dentro de uma mesa.
//   - Como existem as duas camadas, o mesmo usuário já pode ser
//     Facilitador em uma mesa e Participante em outra sem alterações
//     de schema. A tela de seleção de mesa é o que ainda precisa ser
//     construída em iterações posteriores.

require_once __DIR__ . '/auth.php';

/**
 * Devolve o papel global do usuário ('facilitador' | 'participante')
 * ou null se não estiver logado.
 */
function papelGlobal(): ?string
{
    $u = usuarioLogado();
    return $u['role'] ?? null;
}

function ehFacilitadorGlobal(): bool
{
    return papelGlobal() === 'facilitador';
}

function ehParticipanteGlobal(): bool
{
    return papelGlobal() === 'participante';
}

/**
 * Devolve o papel do usuário em uma mesa específica, ou null se ele
 * não estiver vinculado àquela mesa.
 */
function papelEmMesa(int $mesaId, ?int $usuarioId = null): ?string
{
    global $pdo;

    if ($usuarioId === null) {
        $u = usuarioLogado();
        if (!$u) return null;
        $usuarioId = (int) $u['id'];
    }

    $stmt = $pdo->prepare(
        "SELECT papel FROM mesa_participantes
         WHERE mesa_id = :mesa AND usuario_id = :usuario LIMIT 1"
    );
    $stmt->execute(['mesa' => $mesaId, 'usuario' => $usuarioId]);
    $row = $stmt->fetch();
    return $row ? (string) $row['papel'] : null;
}

function podeFacilitarMesa(int $mesaId, ?int $usuarioId = null): bool
{
    return papelEmMesa($mesaId, $usuarioId) === 'facilitador';
}

function podeParticiparMesa(int $mesaId, ?int $usuarioId = null): bool
{
    $papel = papelEmMesa($mesaId, $usuarioId);
    return $papel === 'facilitador' || $papel === 'participante';
}

// ---------------------------------------------------------------------
// Aliases solicitados (nomes em inglês) — apontam para os helpers em
// português acima. Mantemos os dois para facilitar leitura nas páginas
// já existentes sem quebrar quem lê em pt-BR.
// ---------------------------------------------------------------------

function isFacilitador(): bool
{
    return ehFacilitadorGlobal();
}

function isParticipante(): bool
{
    return ehParticipanteGlobal();
}

function canViewMesa(int $mesaId, ?int $usuarioId = null): bool
{
    return podeParticiparMesa($mesaId, $usuarioId);
}

function canManageMesa(int $mesaId, ?int $usuarioId = null): bool
{
    return podeFacilitarMesa($mesaId, $usuarioId);
}

/**
 * Pode editar uma ficha?
 *
 * Regra:
 *   - Facilitador global: sempre pode (cobre o caso atual em que ainda
 *     não há vínculo ficha↔usuário no schema).
 *   - Participante: só se a ficha tiver `usuario_id` igual ao seu.
 *
 * O campo `fichas.usuario_id` é introduzido em uma migration posterior
 * (Fase 2). Enquanto não existir, esta função é tolerante: detecta a
 * ausência da coluna e cai para a regra "Facilitador sim, Participante
 * não". Assim o helper já pode ser usado nas páginas sem quebrar.
 */
function canEditFicha(int $fichaId, ?int $usuarioId = null): bool
{
    global $pdo;

    if ($usuarioId === null) {
        $u = usuarioLogado();
        if (!$u) return false;
        $usuarioId = (int) $u['id'];
    }

    if (isFacilitador()) return true;

    return fichaPertenceAoUsuario($pdo, $fichaId, $usuarioId);
}

/**
 * Pode visualizar uma ficha? Por padrão, qualquer Facilitador da mesa
 * onde a ficha está, ou o próprio dono. Como ainda não temos vínculo
 * ficha↔mesa explícito, o critério de "ver" se confunde com "editar"
 * nesta fase: Facilitador sempre vê; Participante só vê a própria.
 * Ajuste quando Fase 2/3 amarrarem ficha↔mesa.
 */
function canViewFicha(int $fichaId, ?int $usuarioId = null): bool
{
    return canEditFicha($fichaId, $usuarioId);
}

/**
 * Garante a coluna que vincula fichas aos usuários.
 *
 * Algumas instalações antigas podem estar sem a migration 007 aplicada.
 * O fluxo de salvar/listar/carregar fichas precisa desse vínculo para não
 * gravar fichas "órfãs" que depois somem da lista do participante.
 */
function garantirColunaUsuarioFicha(PDO $pdo): bool
{
    static $verificada = null;
    if ($verificada !== null) return $verificada;

    try {
        $check = $pdo->query("SHOW COLUMNS FROM fichas LIKE 'usuario_id'");
        if ($check && $check->fetch()) {
            $GLOBALS['pindorama_ficha_vinculo_modo'] = 'coluna';
            garantirIndiceUsuarioFicha($pdo);
            garantirFkUsuarioFicha($pdo);
            $verificada = true;
            return true;
        }

        try {
            $pdo->exec("ALTER TABLE fichas ADD COLUMN usuario_id INT(11) NULL AFTER id");
            $GLOBALS['pindorama_ficha_vinculo_modo'] = 'coluna';
            garantirIndiceUsuarioFicha($pdo);
            garantirFkUsuarioFicha($pdo);
            $verificada = true;
            return true;
        } catch (Throwable $e) {
            registrarErroVinculoFicha('alter_fichas_usuario_id', $e);
        }

        garantirTabelaVinculoFichaUsuario($pdo);
        $GLOBALS['pindorama_ficha_vinculo_modo'] = 'tabela';
        $verificada = true;
        return true;
    } catch (Throwable $e) {
        registrarErroVinculoFicha('garantir_vinculo_ficha', $e);
        $verificada = false;
        return false;
    }
}

function modoVinculoUsuarioFicha(PDO $pdo): ?string
{
    if (!garantirColunaUsuarioFicha($pdo)) {
        return null;
    }
    return $GLOBALS['pindorama_ficha_vinculo_modo'] ?? null;
}

function fichaPertenceAoUsuario(PDO $pdo, int $fichaId, int $usuarioId): bool
{
    $modo = modoVinculoUsuarioFicha($pdo);
    if ($modo === 'coluna') {
        $stmt = $pdo->prepare(
            "SELECT 1 FROM fichas WHERE id = :id AND usuario_id = :uid LIMIT 1"
        );
        $stmt->execute(['id' => $fichaId, 'uid' => $usuarioId]);
        return (bool) $stmt->fetchColumn();
    }

    if ($modo === 'tabela') {
        $stmt = $pdo->prepare(
            "SELECT 1 FROM ficha_usuarios WHERE ficha_id = :id AND usuario_id = :uid LIMIT 1"
        );
        $stmt->execute(['id' => $fichaId, 'uid' => $usuarioId]);
        return (bool) $stmt->fetchColumn();
    }

    return false;
}

function vincularFichaAoUsuario(PDO $pdo, int $fichaId, int $usuarioId): bool
{
    $modo = modoVinculoUsuarioFicha($pdo);
    if ($modo === 'coluna') {
        $stmt = $pdo->prepare("UPDATE fichas SET usuario_id = :uid WHERE id = :id");
        return $stmt->execute(['uid' => $usuarioId, 'id' => $fichaId]);
    }

    if ($modo === 'tabela') {
        $stmt = $pdo->prepare(
            "INSERT INTO ficha_usuarios (ficha_id, usuario_id)
             VALUES (:ficha_id, :usuario_id)
             ON DUPLICATE KEY UPDATE usuario_id = VALUES(usuario_id)"
        );
        return $stmt->execute(['ficha_id' => $fichaId, 'usuario_id' => $usuarioId]);
    }

    return false;
}

function listarFichasDoUsuario(PDO $pdo, string $colunas, int $usuarioId): array
{
    $modo = modoVinculoUsuarioFicha($pdo);
    if ($modo === 'coluna') {
        $stmt = $pdo->prepare(
            "SELECT $colunas FROM fichas WHERE usuario_id = :uid ORDER BY updated_at DESC"
        );
        $stmt->execute(['uid' => $usuarioId]);
        return $stmt->fetchAll();
    }

    if ($modo === 'tabela') {
        $stmt = $pdo->prepare(
            "SELECT $colunas
               FROM fichas
               JOIN ficha_usuarios fu ON fu.ficha_id = fichas.id
              WHERE fu.usuario_id = :uid
              ORDER BY fichas.updated_at DESC"
        );
        $stmt->execute(['uid' => $usuarioId]);
        return $stmt->fetchAll();
    }

    return [];
}

function buscarFichaDoUsuario(PDO $pdo, int $fichaId, int $usuarioId): ?array
{
    $modo = modoVinculoUsuarioFicha($pdo);
    if ($modo === 'coluna') {
        $stmt = $pdo->prepare("SELECT * FROM fichas WHERE id = :id AND usuario_id = :uid");
        $stmt->execute(['id' => $fichaId, 'uid' => $usuarioId]);
        $ficha = $stmt->fetch();
        return $ficha ?: null;
    }

    if ($modo === 'tabela') {
        $stmt = $pdo->prepare(
            "SELECT fichas.*
               FROM fichas
               JOIN ficha_usuarios fu ON fu.ficha_id = fichas.id
              WHERE fichas.id = :id AND fu.usuario_id = :uid"
        );
        $stmt->execute(['id' => $fichaId, 'uid' => $usuarioId]);
        $ficha = $stmt->fetch();
        return $ficha ?: null;
    }

    return null;
}

function ultimoErroVinculoFicha(): ?string
{
    return $GLOBALS['pindorama_ficha_vinculo_erro'] ?? null;
}

function garantirTabelaVinculoFichaUsuario(PDO $pdo): void
{
    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS ficha_usuarios (
            ficha_id INT(11) NOT NULL,
            usuario_id INT(11) NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (ficha_id),
            KEY ficha_usuarios_usuario_idx (usuario_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );

    $check = $pdo->query("SHOW TABLES LIKE 'ficha_usuarios'");
    if (!$check || !$check->fetch()) {
        throw new RuntimeException('Tabela ficha_usuarios nao foi criada.');
    }
}

function garantirIndiceUsuarioFicha(PDO $pdo): void
{
    try {
        $idx = $pdo->query("SHOW INDEX FROM fichas WHERE Key_name = 'fichas_usuario_id_idx'");
        if (!$idx || !$idx->fetch()) {
            $pdo->exec("ALTER TABLE fichas ADD INDEX fichas_usuario_id_idx (usuario_id)");
        }
    } catch (Throwable $e) {
        registrarErroVinculoFicha('indice_fichas_usuario_id', $e);
    }
}

function garantirFkUsuarioFicha(PDO $pdo): void
{
    try {
        $fk = $pdo->query(
            "SELECT CONSTRAINT_NAME
               FROM information_schema.KEY_COLUMN_USAGE
              WHERE TABLE_SCHEMA = DATABASE()
                AND TABLE_NAME = 'fichas'
                AND COLUMN_NAME = 'usuario_id'
                AND REFERENCED_TABLE_NAME = 'usuarios'
              LIMIT 1"
        );
        if (!$fk || !$fk->fetch()) {
            $pdo->exec(
                "ALTER TABLE fichas
                 ADD CONSTRAINT fichas_usuario_id_fk
                 FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
                 ON UPDATE CASCADE ON DELETE SET NULL"
            );
        }
    } catch (Throwable $e) {
        registrarErroVinculoFicha('fk_fichas_usuario_id', $e);
    }
}

function registrarErroVinculoFicha(string $contexto, Throwable $e): void
{
    $mensagem = $contexto . ': ' . $e->getMessage();
    $GLOBALS['pindorama_ficha_vinculo_erro'] = $mensagem;
    error_log('[Pindorama][ficha_usuario] ' . $mensagem);
}
