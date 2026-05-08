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

    static $temColunaUsuario = null;
    if ($temColunaUsuario === null) {
        try {
            $check = $pdo->query("SHOW COLUMNS FROM fichas LIKE 'usuario_id'");
            $temColunaUsuario = $check && $check->fetch() ? true : false;
        } catch (Throwable $e) {
            $temColunaUsuario = false;
        }
    }
    if (!$temColunaUsuario) return false;

    $stmt = $pdo->prepare(
        "SELECT usuario_id FROM fichas WHERE id = :id LIMIT 1"
    );
    $stmt->execute(['id' => $fichaId]);
    $row = $stmt->fetch();
    if (!$row) return false;
    return (int) $row['usuario_id'] === $usuarioId;
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
