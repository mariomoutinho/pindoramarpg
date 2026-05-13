<?php
// includes/mesa-helpers.php — funções compartilhadas entre as páginas
// do Painel do Facilitador (mesas, mesa-conteudos, etc.).

require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/permissions.php';

/**
 * Mesas em que o usuário atual é Facilitador (lista para o painel).
 */
function listarMesasDoFacilitador(int $usuarioId): array
{
    global $pdo;
    $stmt = $pdo->prepare(
        "SELECT m.* FROM mesas m
         WHERE m.facilitador_id = :uid
         ORDER BY m.updated_at DESC"
    );
    $stmt->execute(['uid' => $usuarioId]);
    return $stmt->fetchAll();
}

function carregarMesa(int $mesaId): ?array
{
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM mesas WHERE id = :id LIMIT 1");
    $stmt->execute(['id' => $mesaId]);
    $row = $stmt->fetch();
    return $row ?: null;
}

/**
 * Lista os participantes vinculados a uma mesa, com nome/email/papel.
 */
function listarParticipantesDaMesa(int $mesaId): array
{
    global $pdo;
    $stmt = $pdo->prepare(
        "SELECT mp.id AS vinculo_id, mp.papel, u.id, u.nome, u.email, u.foto_path
         FROM mesa_participantes mp
         JOIN usuarios u ON u.id = mp.usuario_id
         WHERE mp.mesa_id = :mesa
         ORDER BY mp.papel, u.nome"
    );
    $stmt->execute(['mesa' => $mesaId]);
    return $stmt->fetchAll();
}

/**
 * Lista todos os usuários com role 'participante' marcando quem já está
 * vinculado à mesa. Para a UI de "Vincular jogadores" da página de mesas.
 * Retorna [{id, nome, email, foto_path, is_vinculado(bool), vinculo_id?}].
 */
function listarParticipantesDisponiveisParaMesa(int $mesaId): array
{
    global $pdo;
    $stmt = $pdo->prepare(
        "SELECT u.id, u.nome, u.email, u.foto_path,
                mp.id AS vinculo_id, mp.papel
         FROM usuarios u
         LEFT JOIN mesa_participantes mp
             ON mp.usuario_id = u.id AND mp.mesa_id = :mesa
         WHERE u.role = 'participante'
         ORDER BY u.nome"
    );
    $stmt->execute(['mesa' => $mesaId]);
    $rows = $stmt->fetchAll();
    foreach ($rows as &$r) {
        $r['is_vinculado'] = !empty($r['vinculo_id']);
    }
    return $rows;
}

/**
 * URL útil para o avatar do usuário. Aceita o caminho persistido em
 * usuarios.foto_path; vazio → string vazia (template usa placeholder CSS).
 */
function urlAvatarUsuario(?string $relPath): string
{
    return $relPath && trim($relPath) !== '' ? $relPath : '';
}

/**
 * Iniciais (até 2 letras) para o placeholder de avatar quando não há
 * imagem cadastrada. Compatível com nicks vazios — devolve '?'.
 */
function inicialAvatarUsuario(?string $nome): string
{
    $nome = trim((string) $nome);
    if ($nome === '') return '?';
    $partes = preg_split('/\s+/u', $nome);
    if (count($partes) === 1) return mb_strtoupper(mb_substr($partes[0], 0, 1));
    return mb_strtoupper(mb_substr($partes[0], 0, 1) . mb_substr(end($partes), 0, 1));
}

/**
 * Lista conteúdos de uma mesa, opcionalmente filtrando por tipo e/ou
 * visibilidade. Sem `mesaId` → lista por tipo entre todas as mesas do
 * Facilitador atual (uso secundário do card "Conteúdos Liberados").
 */
function listarConteudosDaMesa(?int $mesaId, ?string $tipo = null, ?string $visibilidade = null, ?int $facilitadorId = null): array
{
    global $pdo;
    $where = [];
    $params = [];
    if ($mesaId !== null) {
        $where[] = 'c.mesa_id = :mesa';
        $params['mesa'] = $mesaId;
    } elseif ($facilitadorId !== null) {
        $where[] = 'c.mesa_id IN (SELECT id FROM mesas WHERE facilitador_id = :fac)';
        $params['fac'] = $facilitadorId;
    }
    if ($tipo !== null && $tipo !== '') {
        $where[] = 'c.tipo = :tipo';
        $params['tipo'] = $tipo;
    }
    if ($visibilidade !== null && $visibilidade !== '') {
        $where[] = 'c.visibilidade = :vis';
        $params['vis'] = $visibilidade;
    }
    $sql = "SELECT c.*, m.nome AS mesa_nome
            FROM mesa_conteudos c
            JOIN mesas m ON m.id = c.mesa_id";
    if ($where) $sql .= ' WHERE ' . implode(' AND ', $where);
    $sql .= ' ORDER BY c.updated_at DESC';
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    return $stmt->fetchAll();
}

function carregarConteudo(int $id): ?array
{
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM mesa_conteudos WHERE id = :id LIMIT 1");
    $stmt->execute(['id' => $id]);
    $row = $stmt->fetch();
    return $row ?: null;
}

/**
 * Rótulos amigáveis para o tipo de conteúdo.
 */
function rotuloTipoConteudo(string $tipo): string
{
    return [
        'npc'       => 'NPC',
        'aventura'  => 'Aventura',
        'narrativa' => 'Narrativa',
        'magia'     => 'Magia customizada',
        'poder'     => 'Poder customizado',
    ][$tipo] ?? ucfirst($tipo);
}

function rotuloVisibilidade(string $v): string
{
    return [
        'privado'        => 'Privado',
        'participantes'  => 'Participantes',
        'publico'        => 'Público da mesa',
    ][$v] ?? $v;
}

/**
 * Bloqueia o acesso à página caso o usuário não seja Facilitador.
 * Usa redirect para acesso-negado.php (criada em fase anterior).
 */
function exigirFacilitador(string $contexto = 'esta área é exclusiva do Facilitador'): void
{
    if (!isFacilitador()) {
        header('Location: acesso-negado.php?m=' . urlencode($contexto));
        exit;
    }
}

/**
 * Retorna fichas que podem ser vinculadas: hoje, todas as fichas ainda
 * sem `usuario_id`. Quando a vinculação ficha↔mesa for adicionada,
 * incluir filtro pela mesa também.
 */
function listarFichasSemDono(): array
{
    global $pdo;
    try {
        $check = $pdo->query("SHOW COLUMNS FROM fichas LIKE 'usuario_id'");
        $temColuna = $check && $check->fetch();
    } catch (Throwable $e) {
        $temColuna = false;
    }
    if (!$temColuna) return [];
    $stmt = $pdo->query(
        "SELECT id, personagem, classe, nivel
         FROM fichas WHERE usuario_id IS NULL
         ORDER BY personagem ASC"
    );
    return $stmt->fetchAll();
}

/* ============================================================
 * Vínculo N:N entre mesas e aventuras (tabela mesa_aventuras).
 * Aventuras continuam vivendo no módulo Aventuras — aqui só
 * gerenciamos a associação por mesa. Reuso 100% relacional.
 * ============================================================ */

/**
 * Aventuras já vinculadas a uma mesa (com dados úteis para listagem).
 * O filtro por $usuarioId garante que só aparecem aventuras do próprio
 * facilitador (defesa em profundidade — quem chama já valida ownership
 * da mesa, mas reforçamos no JOIN).
 */
function listarAventurasDaMesa(int $mesaId, int $usuarioId): array
{
    global $pdo;
    $stmt = $pdo->prepare(
        "SELECT a.id, a.titulo, a.subtitulo, a.sinopse, a.status, a.capa_path,
                ma.id AS vinculo_id, ma.created_at AS vinculado_em
         FROM mesa_aventuras ma
         JOIN aventuras a ON a.id = ma.aventura_id
         WHERE ma.mesa_id = :mesa AND a.usuario_id = :uid
         ORDER BY ma.created_at DESC, a.titulo"
    );
    $stmt->execute(['mesa' => $mesaId, 'uid' => $usuarioId]);
    return $stmt->fetchAll();
}

/**
 * Aventuras do usuário que AINDA NÃO estão vinculadas à mesa.
 * Alimenta o <select> de "Vincular aventura" e impede duplicidade
 * na UI antes mesmo de chegar no banco (o UNIQUE também impede).
 */
function listarAventurasDisponiveisParaMesa(int $mesaId, int $usuarioId): array
{
    global $pdo;
    $stmt = $pdo->prepare(
        "SELECT a.id, a.titulo, a.status
         FROM aventuras a
         WHERE a.usuario_id = :uid
           AND NOT EXISTS (
               SELECT 1 FROM mesa_aventuras ma
               WHERE ma.mesa_id = :mesa AND ma.aventura_id = a.id
           )
         ORDER BY a.titulo"
    );
    $stmt->execute(['mesa' => $mesaId, 'uid' => $usuarioId]);
    return $stmt->fetchAll();
}

/**
 * Insere o vínculo (idempotente via UNIQUE). Retorna true se houve
 * uma nova linha, false se já existia. Quem chama deve ter validado
 * ownership da mesa e da aventura previamente.
 */
function vincularAventuraNaMesa(int $mesaId, int $aventuraId): bool
{
    global $pdo;
    $stmt = $pdo->prepare(
        "INSERT IGNORE INTO mesa_aventuras (mesa_id, aventura_id)
         VALUES (:mesa, :aid)"
    );
    $stmt->execute(['mesa' => $mesaId, 'aid' => $aventuraId]);
    return $stmt->rowCount() > 0;
}

function desvincularAventuraDaMesa(int $mesaId, int $aventuraId): bool
{
    global $pdo;
    $stmt = $pdo->prepare(
        "DELETE FROM mesa_aventuras
         WHERE mesa_id = :mesa AND aventura_id = :aid"
    );
    $stmt->execute(['mesa' => $mesaId, 'aid' => $aventuraId]);
    return $stmt->rowCount() > 0;
}
