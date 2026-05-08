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
        "SELECT mp.id AS vinculo_id, mp.papel, u.id, u.nome, u.email
         FROM mesa_participantes mp
         JOIN usuarios u ON u.id = mp.usuario_id
         WHERE mp.mesa_id = :mesa
         ORDER BY mp.papel, u.nome"
    );
    $stmt->execute(['mesa' => $mesaId]);
    return $stmt->fetchAll();
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
