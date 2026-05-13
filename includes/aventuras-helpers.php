<?php
/**
 * includes/aventuras-helpers.php — CRUD + upload de capa para o módulo Aventuras.
 *
 * - Toda função usa prepared statements via PDO ($pdo global em config.php).
 * - O dono da aventura é `usuario_id` (referência ao facilitador que a criou).
 * - Edição/exclusão é restrita ao dono. Facilitador global tem permissão por
 *   `exigirFacilitador()` na camada de página/handler; este helper apenas
 *   garante que a aventura é do usuário antes de gravar.
 */

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth.php';

const AVENTURAS_UPLOAD_DIR = __DIR__ . '/../uploads/aventuras/capas';
const AVENTURAS_UPLOAD_URL = 'uploads/aventuras/capas';
const AVENTURAS_NPC_UPLOAD_DIR = __DIR__ . '/../uploads/aventuras/npcs';
const AVENTURAS_NPC_UPLOAD_URL = 'uploads/aventuras/npcs';
const AVENTURAS_PLACEHOLDER = 'assets/img/branding/pindorama-logo-nova.png';

const AVENTURAS_STATUS_LIST = ['rascunho', 'publicada', 'arquivada'];

/* ---------- Consultas ---------- */

function listarAventurasDoUsuario(int $usuarioId): array
{
    global $pdo;
    $stmt = $pdo->prepare(
        "SELECT id, titulo, subtitulo, sinopse, sistema, nivel_sugerido,
                duracao_estimada, qtd_jogadores, capa_path, status,
                created_at, updated_at
         FROM aventuras
         WHERE usuario_id = :uid
         ORDER BY updated_at DESC, id DESC"
    );
    $stmt->execute(['uid' => $usuarioId]);
    return $stmt->fetchAll();
}

function carregarAventura(int $id): ?array
{
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM aventuras WHERE id = :id LIMIT 1");
    $stmt->execute(['id' => $id]);
    $row = $stmt->fetch();
    return $row ?: null;
}

function aventuraPertenceAo(int $aventuraId, int $usuarioId): bool
{
    $av = carregarAventura($aventuraId);
    return $av && (int) $av['usuario_id'] === $usuarioId;
}

/* ---------- Saneamento de entrada ---------- */

function normalizarStatusAventura($valor): string
{
    $v = is_string($valor) ? strtolower(trim($valor)) : '';
    return in_array($v, AVENTURAS_STATUS_LIST, true) ? $v : 'rascunho';
}

function montarDadosAventura(array $post): array
{
    $cap = static function ($v, $max) {
        $s = trim((string) ($v ?? ''));
        return $s === '' ? null : mb_substr($s, 0, $max);
    };
    return [
        'titulo'                  => $cap($post['titulo'] ?? '', 180) ?? '',
        'subtitulo'               => $cap($post['subtitulo'] ?? '', 220),
        'sinopse'                 => $cap($post['sinopse'] ?? '', 2000),
        'sistema'                 => $cap($post['sistema'] ?? '', 120),
        'nivel_sugerido'          => $cap($post['nivel_sugerido'] ?? '', 60),
        'duracao_estimada'        => $cap($post['duracao_estimada'] ?? '', 60),
        'qtd_jogadores'           => $cap($post['qtd_jogadores'] ?? '', 40),
        'texto_integral'          => isset($post['texto_integral']) ? (string) $post['texto_integral'] : null,
        'observacoes_facilitador' => $cap($post['observacoes_facilitador'] ?? '', 4000),
        'status'                  => normalizarStatusAventura($post['status'] ?? 'rascunho'),
    ];
}

/* ---------- Persistência ---------- */

function criarAventura(int $usuarioId, array $dados, ?string $capaPath): int
{
    global $pdo;
    $stmt = $pdo->prepare(
        "INSERT INTO aventuras
            (usuario_id, titulo, subtitulo, sinopse, sistema, nivel_sugerido,
             duracao_estimada, qtd_jogadores, capa_path, texto_integral,
             observacoes_facilitador, status)
         VALUES
            (:uid, :titulo, :subtitulo, :sinopse, :sistema, :nivel,
             :duracao, :qtd, :capa, :texto, :obs, :status)"
    );
    $stmt->execute([
        'uid'       => $usuarioId,
        'titulo'    => $dados['titulo'],
        'subtitulo' => $dados['subtitulo'],
        'sinopse'   => $dados['sinopse'],
        'sistema'   => $dados['sistema'],
        'nivel'     => $dados['nivel_sugerido'],
        'duracao'   => $dados['duracao_estimada'],
        'qtd'       => $dados['qtd_jogadores'],
        'capa'      => $capaPath,
        'texto'     => $dados['texto_integral'],
        'obs'       => $dados['observacoes_facilitador'],
        'status'    => $dados['status'],
    ]);
    return (int) $pdo->lastInsertId();
}

function atualizarAventura(int $id, array $dados, ?string $capaPathNova, bool $manterCapa): void
{
    global $pdo;

    if ($manterCapa) {
        $stmt = $pdo->prepare(
            "UPDATE aventuras SET
                titulo = :titulo, subtitulo = :subtitulo, sinopse = :sinopse,
                sistema = :sistema, nivel_sugerido = :nivel,
                duracao_estimada = :duracao, qtd_jogadores = :qtd,
                texto_integral = :texto, observacoes_facilitador = :obs,
                status = :status
             WHERE id = :id"
        );
        $stmt->execute([
            'titulo' => $dados['titulo'], 'subtitulo' => $dados['subtitulo'],
            'sinopse' => $dados['sinopse'], 'sistema' => $dados['sistema'],
            'nivel' => $dados['nivel_sugerido'], 'duracao' => $dados['duracao_estimada'],
            'qtd' => $dados['qtd_jogadores'], 'texto' => $dados['texto_integral'],
            'obs' => $dados['observacoes_facilitador'], 'status' => $dados['status'],
            'id' => $id,
        ]);
        return;
    }

    $stmt = $pdo->prepare(
        "UPDATE aventuras SET
            titulo = :titulo, subtitulo = :subtitulo, sinopse = :sinopse,
            sistema = :sistema, nivel_sugerido = :nivel,
            duracao_estimada = :duracao, qtd_jogadores = :qtd,
            capa_path = :capa, texto_integral = :texto,
            observacoes_facilitador = :obs, status = :status
         WHERE id = :id"
    );
    $stmt->execute([
        'titulo' => $dados['titulo'], 'subtitulo' => $dados['subtitulo'],
        'sinopse' => $dados['sinopse'], 'sistema' => $dados['sistema'],
        'nivel' => $dados['nivel_sugerido'], 'duracao' => $dados['duracao_estimada'],
        'qtd' => $dados['qtd_jogadores'], 'capa' => $capaPathNova,
        'texto' => $dados['texto_integral'], 'obs' => $dados['observacoes_facilitador'],
        'status' => $dados['status'], 'id' => $id,
    ]);
}

function excluirAventura(int $id): bool
{
    global $pdo;
    $av = carregarAventura($id);
    if (!$av) return false;
    $stmt = $pdo->prepare("DELETE FROM aventuras WHERE id = :id");
    $stmt->execute(['id' => $id]);
    if (!empty($av['capa_path'])) {
        excluirArquivoCapaAventura((string) $av['capa_path']);
    }
    return true;
}

/* ---------- Upload de capa ---------- */

function aventurasGarantirPastaUpload(): void
{
    if (!is_dir(AVENTURAS_UPLOAD_DIR)) {
        @mkdir(AVENTURAS_UPLOAD_DIR, 0775, true);
    }
}

/**
 * Recebe um $_FILES['campo'] e tenta salvar como capa segura.
 * Retorna o path relativo ao docroot (ex.: "uploads/aventuras/capas/abc.jpg")
 * ou null em caso de erro/ausência (com $erro preenchido).
 *
 * - Aceita: jpg, jpeg, png, webp.
 * - Limite: 8 MB.
 * - Nome: hash aleatório, não confiar no nome enviado.
 */
function processarUploadCapaAventura(?array $arquivo, ?string &$erro = null): ?string
{
    $erro = null;
    if (!$arquivo || !isset($arquivo['error']) || $arquivo['error'] === UPLOAD_ERR_NO_FILE) {
        return null; // sem upload — não é erro
    }
    if ($arquivo['error'] !== UPLOAD_ERR_OK) {
        $erro = 'Falha ao receber o arquivo da capa.';
        return null;
    }

    $maxBytes = 8 * 1024 * 1024;
    if ($arquivo['size'] > $maxBytes) {
        $erro = 'A capa excede o tamanho máximo permitido (8 MB).';
        return null;
    }

    $tmp = $arquivo['tmp_name'];
    if (!is_uploaded_file($tmp)) {
        $erro = 'Arquivo inválido.';
        return null;
    }

    $info = @getimagesize($tmp);
    if (!$info) {
        $erro = 'O arquivo enviado não é uma imagem válida.';
        return null;
    }
    $mimeMap = [
        IMAGETYPE_JPEG => ['jpg', 'image/jpeg'],
        IMAGETYPE_PNG  => ['png', 'image/png'],
        IMAGETYPE_WEBP => ['webp', 'image/webp'],
    ];
    if (!isset($mimeMap[$info[2]])) {
        $erro = 'Formato não suportado. Use JPG, PNG ou WebP.';
        return null;
    }
    [$ext, ] = $mimeMap[$info[2]];

    aventurasGarantirPastaUpload();

    // Nome único: hash hex + extensão. Tenta de novo se houver colisão (improvável).
    $tentativas = 0;
    do {
        $nome = bin2hex(random_bytes(12)) . '.' . $ext;
        $destinoAbs = AVENTURAS_UPLOAD_DIR . '/' . $nome;
        $tentativas++;
    } while (file_exists($destinoAbs) && $tentativas < 5);

    if (!@move_uploaded_file($tmp, $destinoAbs)) {
        $erro = 'Não foi possível salvar a imagem da capa.';
        return null;
    }
    @chmod($destinoAbs, 0644);
    return AVENTURAS_UPLOAD_URL . '/' . $nome;
}

function excluirArquivoCapaAventura(string $relPath): void
{
    if ($relPath === '') return;
    // Bloqueio: só apaga se estiver dentro da pasta esperada.
    $relPath = ltrim($relPath, '/');
    if (strpos($relPath, AVENTURAS_UPLOAD_URL . '/') !== 0) return;
    $abs = realpath(__DIR__ . '/../' . $relPath);
    $base = realpath(AVENTURAS_UPLOAD_DIR);
    if ($abs && $base && strpos($abs, $base) === 0 && is_file($abs)) {
        @unlink($abs);
    }
}

/* ---------- Upload de imagem de NPC de aventura ---------- */

function aventurasGarantirPastaUploadNpc(): void
{
    if (!is_dir(AVENTURAS_NPC_UPLOAD_DIR)) {
        @mkdir(AVENTURAS_NPC_UPLOAD_DIR, 0775, true);
    }
}

/**
 * Reaproveita o mesmo padrão de processarUploadCapaAventura(): valida
 * tipo (JPG/PNG/WebP), tamanho (<= 8 MB), gera nome seguro com hash
 * aleatório e grava em uploads/aventuras/npcs/. Retorna o caminho
 * relativo ao docroot, pronto para persistir em aventura_npcs.imagem.
 */
function processarUploadImagemNpcAventura(?array $arquivo, ?string &$erro = null): ?string
{
    $erro = null;
    if (!$arquivo || !isset($arquivo['error']) || $arquivo['error'] === UPLOAD_ERR_NO_FILE) {
        return null;
    }
    if ($arquivo['error'] !== UPLOAD_ERR_OK) {
        $erro = 'Falha ao receber o arquivo da imagem do NPC.';
        return null;
    }

    $maxBytes = 8 * 1024 * 1024;
    if ($arquivo['size'] > $maxBytes) {
        $erro = 'A imagem excede o tamanho máximo permitido (8 MB).';
        return null;
    }

    $tmp = $arquivo['tmp_name'];
    if (!is_uploaded_file($tmp)) {
        $erro = 'Arquivo inválido.';
        return null;
    }

    $info = @getimagesize($tmp);
    if (!$info) {
        $erro = 'O arquivo enviado não é uma imagem válida.';
        return null;
    }
    $mimeMap = [
        IMAGETYPE_JPEG => ['jpg', 'image/jpeg'],
        IMAGETYPE_PNG  => ['png', 'image/png'],
        IMAGETYPE_WEBP => ['webp', 'image/webp'],
    ];
    if (!isset($mimeMap[$info[2]])) {
        $erro = 'Formato não suportado. Use JPG, PNG ou WebP.';
        return null;
    }
    [$ext, ] = $mimeMap[$info[2]];

    aventurasGarantirPastaUploadNpc();

    $tentativas = 0;
    do {
        $nome = bin2hex(random_bytes(12)) . '.' . $ext;
        $destinoAbs = AVENTURAS_NPC_UPLOAD_DIR . '/' . $nome;
        $tentativas++;
    } while (file_exists($destinoAbs) && $tentativas < 5);

    if (!@move_uploaded_file($tmp, $destinoAbs)) {
        $erro = 'Não foi possível salvar a imagem do NPC.';
        return null;
    }
    @chmod($destinoAbs, 0644);
    return AVENTURAS_NPC_UPLOAD_URL . '/' . $nome;
}

function excluirArquivoImagemNpcAventura(string $relPath): void
{
    if ($relPath === '') return;
    $relPath = ltrim($relPath, '/');
    if (strpos($relPath, AVENTURAS_NPC_UPLOAD_URL . '/') !== 0) return;
    $abs = realpath(__DIR__ . '/../' . $relPath);
    $base = realpath(AVENTURAS_NPC_UPLOAD_DIR);
    if ($abs && $base && strpos($abs, $base) === 0 && is_file($abs)) {
        @unlink($abs);
    }
}

/* ---------- Helpers de apresentação ---------- */

function urlCapaAventuraOuPlaceholder(?string $relPath): string
{
    if ($relPath && trim($relPath) !== '') return $relPath;
    return AVENTURAS_PLACEHOLDER;
}

function rotuloStatusAventura(string $s): string
{
    return [
        'rascunho'   => 'Rascunho',
        'publicada'  => 'Publicada',
        'arquivada'  => 'Arquivada',
    ][$s] ?? ucfirst($s);
}

function formatarTextoIntegralAventura(?string $texto): string
{
    if ($texto === null || trim($texto) === '') return '';
    // Mantém parágrafos e quebras de linha sem permitir HTML.
    return nl2br(htmlspecialchars($texto, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'));
}

/* ============================================================
 * CENAS DE AVENTURA (reaproveita o formato da Mesa de Jogo)
 *
 * Cada aventura ganha um arquivo dedicado em
 * data/aventuras/<aventura_id>/cenas.json com o mesmo schema do
 * data/campo-batalha-state.json global (pages, activePageId, etc.).
 *
 * Os endpoints carregar-campo-batalha.php e salvar-campo-batalha.php
 * reaproveitam esse arquivo automaticamente quando recebem
 * ?aventura_id=N e o usuário é dono da aventura — sem duplicar a
 * Mesa de Jogo. O JS também detecta window.PINDORAMA_AVENTURA_ID.
 * ============================================================ */

function aventuraCenasDir(int $aventuraId): string
{
    return __DIR__ . '/../data/aventuras/' . $aventuraId;
}

function aventuraCenasFile(int $aventuraId): string
{
    return aventuraCenasDir($aventuraId) . '/cenas.json';
}

function aventuraGarantirPastaCenas(int $aventuraId): void
{
    $dir = aventuraCenasDir($aventuraId);
    if (!is_dir($dir)) {
        @mkdir($dir, 0775, true);
    }
}

/**
 * Lê o estado de cenas (pages) de uma aventura. Retorna array ou null
 * quando ainda não há cenas salvas.
 */
function aventuraCarregarCenas(int $aventuraId): ?array
{
    $f = aventuraCenasFile($aventuraId);
    if (!is_file($f)) return null;
    $raw = file_get_contents($f);
    if ($raw === false || trim($raw) === '') return null;
    $state = json_decode($raw, true);
    return is_array($state) ? $state : null;
}

/**
 * Resumo (id + nome) de cada cena da aventura, para listagem.
 */
function aventuraListarCenas(int $aventuraId): array
{
    $state = aventuraCarregarCenas($aventuraId);
    if (!$state || !is_array($state['pages'] ?? null)) return [];
    $out = [];
    foreach ($state['pages'] as $p) {
        $out[] = [
            'id'    => (string) ($p['id'] ?? ''),
            'name'  => (string) ($p['name'] ?? 'Cena sem nome'),
            'tipo'  => (string) ($p['tipo'] ?? ''),
            'tokens'   => is_array($p['tokens'] ?? null)   ? count($p['tokens'])   : 0,
            'scenery'  => is_array($p['scenery'] ?? null)  ? count($p['scenery'])  : 0,
            // Imagem representativa do card da cena. Regra:
            //   1) page.mapBackground (fundo do mapa salvo na Mesa de Jogo);
            //   2) caso contrário, primeira imagem da camada `scenery`
            //      que não esteja oculta;
            //   3) string vazia → fallback temático aplicado pelo CSS.
            'coverImage' => aventuraExtrairImagemDaCena($p),
        ];
    }
    return $out;
}

/**
 * Decide a imagem representativa de uma cena (page) — reaproveita o que
 * já está persistido pela Mesa de Jogo, sem duplicar armazenamento.
 *
 * Regra (em ordem de prioridade):
 *   1) page.mapBackground  — fundo do mapa salvo na Mesa de Jogo;
 *   2) primeiro item de page.scenery com layer === 'scenery' (visível);
 *   3) primeiro item de page.scenery visível em qualquer camada (último
 *      recurso, p/ retrocompatibilidade com cenas que ainda não usam
 *      a camada nomeada);
 *   4) string vazia → fallback temático no CSS.
 */
function aventuraExtrairImagemDaCena(array $page): string
{
    $bg = trim((string) ($page['mapBackground'] ?? ''));
    if ($bg !== '') return $bg;

    if (is_array($page['scenery'] ?? null)) {
        // 2) Preferir itens explicitamente na camada de cenário.
        foreach ($page['scenery'] as $sc) {
            if (!is_array($sc)) continue;
            if (!empty($sc['hidden'])) continue;
            $layer = strtolower((string) ($sc['layer'] ?? ''));
            if ($layer !== 'scenery') continue;
            $src = trim((string) ($sc['src'] ?? ''));
            if ($src !== '') return $src;
        }
        // 3) Fallback retrocompat: qualquer imagem visível.
        foreach ($page['scenery'] as $sc) {
            if (!is_array($sc)) continue;
            if (!empty($sc['hidden'])) continue;
            $src = trim((string) ($sc['src'] ?? ''));
            if ($src !== '') return $src;
        }
    }
    return '';
}

/* ============================================================
 * NPCs DE AVENTURA — tabela aventura_npcs.
 *
 * NPCs criados aqui ficam server-side e são injetados no Bestiário
 * do usuário (bestiario.php anexa ao $dadosBestiario['criaturas']
 * antes de exportar pra window.BESTIARIO_BASE). Não duplicam o JSON
 * estático nem o localStorage do cliente.
 * ============================================================ */

function aventuraListarNpcs(int $aventuraId): array
{
    global $pdo;
    $stmt = $pdo->prepare(
        "SELECT * FROM aventura_npcs WHERE aventura_id = :id
         ORDER BY updated_at DESC, id DESC"
    );
    $stmt->execute(['id' => $aventuraId]);
    return $stmt->fetchAll();
}

function aventuraNpcsDoUsuario(int $usuarioId): array
{
    global $pdo;
    $stmt = $pdo->prepare(
        "SELECT n.*, a.titulo AS aventura_titulo
         FROM aventura_npcs n
         INNER JOIN aventuras a ON a.id = n.aventura_id
         WHERE n.usuario_id = :uid
         ORDER BY n.updated_at DESC, n.id DESC"
    );
    $stmt->execute(['uid' => $usuarioId]);
    return $stmt->fetchAll();
}

function aventuraCarregarNpc(int $npcId): ?array
{
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM aventura_npcs WHERE id = :id LIMIT 1");
    $stmt->execute(['id' => $npcId]);
    $row = $stmt->fetch();
    return $row ?: null;
}

function aventuraMontarNpcInput(array $post): array
{
    $cap = static function ($v, $max) {
        $s = trim((string) ($v ?? ''));
        return $s === '' ? null : mb_substr($s, 0, $max);
    };
    $intOrNull = static function ($v) {
        if ($v === null || $v === '') return null;
        $n = (int) $v;
        return $n;
    };
    return [
        'nome'         => $cap($post['nome'] ?? '', 180) ?? '',
        'tipo'         => $cap($post['tipo'] ?? '', 60),
        'nd'           => $cap($post['nd'] ?? '', 20),
        'tamanho'      => $cap($post['tamanho'] ?? '', 40),
        'bioma'        => $cap($post['bioma'] ?? '', 80),
        'papel_tatico' => $cap($post['papel_tatico'] ?? '', 80),
        'pv_max'       => $intOrNull($post['pv_max'] ?? null),
        'defesa'       => $intOrNull($post['defesa'] ?? null),
        'deslocamento' => $cap($post['deslocamento'] ?? '', 40),
        'descricao'    => $cap($post['descricao'] ?? '', 4000),
        'habilidades'  => $cap($post['habilidades'] ?? '', 4000),
        'imagem'       => $cap($post['imagem'] ?? '', 255),
    ];
}

function aventuraCriarNpc(int $aventuraId, int $usuarioId, array $dados): int
{
    global $pdo;
    $stmt = $pdo->prepare(
        "INSERT INTO aventura_npcs
           (aventura_id, usuario_id, nome, tipo, nd, tamanho, bioma,
            papel_tatico, pv_max, defesa, deslocamento, descricao,
            habilidades, imagem)
         VALUES
           (:aid, :uid, :nome, :tipo, :nd, :tam, :bioma,
            :papel, :pv, :def, :desl, :desc, :hab, :img)"
    );
    $stmt->execute([
        'aid'   => $aventuraId,
        'uid'   => $usuarioId,
        'nome'  => $dados['nome'],
        'tipo'  => $dados['tipo'],
        'nd'    => $dados['nd'],
        'tam'   => $dados['tamanho'],
        'bioma' => $dados['bioma'],
        'papel' => $dados['papel_tatico'],
        'pv'    => $dados['pv_max'],
        'def'   => $dados['defesa'],
        'desl'  => $dados['deslocamento'],
        'desc'  => $dados['descricao'],
        'hab'   => $dados['habilidades'],
        'img'   => $dados['imagem'],
    ]);
    return (int) $pdo->lastInsertId();
}

function aventuraAtualizarNpc(int $npcId, array $dados): void
{
    global $pdo;
    $stmt = $pdo->prepare(
        "UPDATE aventura_npcs SET
            nome = :nome, tipo = :tipo, nd = :nd, tamanho = :tam,
            bioma = :bioma, papel_tatico = :papel, pv_max = :pv,
            defesa = :def, deslocamento = :desl, descricao = :desc,
            habilidades = :hab, imagem = :img
         WHERE id = :id"
    );
    $stmt->execute([
        'nome' => $dados['nome'], 'tipo' => $dados['tipo'], 'nd' => $dados['nd'],
        'tam' => $dados['tamanho'], 'bioma' => $dados['bioma'],
        'papel' => $dados['papel_tatico'], 'pv' => $dados['pv_max'],
        'def' => $dados['defesa'], 'desl' => $dados['deslocamento'],
        'desc' => $dados['descricao'], 'hab' => $dados['habilidades'],
        'img' => $dados['imagem'], 'id' => $npcId,
    ]);
}

function aventuraExcluirNpc(int $npcId): bool
{
    global $pdo;
    $stmt = $pdo->prepare("DELETE FROM aventura_npcs WHERE id = :id");
    $stmt->execute(['id' => $npcId]);
    return $stmt->rowCount() > 0;
}

/**
 * Converte uma linha de aventura_npcs no formato esperado pelo
 * Bestiário (mesma forma das criaturas no JSON estático).
 */
function npcAventuraParaCriatura(array $row): array
{
    return [
        'id'           => 'npc-aventura-' . (int) $row['id'],
        'nome'         => (string) $row['nome'],
        'fraseImpacto' => '',
        'nd'           => isset($row['nd']) && $row['nd'] !== '' ? $row['nd'] : 0,
        'tipo'         => (string) ($row['tipo'] ?? ''),
        'tamanho'      => (string) ($row['tamanho'] ?? ''),
        'bioma'        => (string) ($row['bioma'] ?? ''),
        'habitat'      => '',
        'papelTatico'  => (string) ($row['papel_tatico'] ?? ''),
        'imagem'       => (string) ($row['imagem'] ?? ''),
        'pvMax'        => isset($row['pv_max']) && $row['pv_max'] !== null ? (int) $row['pv_max'] : 0,
        'defesa'       => isset($row['defesa']) && $row['defesa'] !== null ? (int) $row['defesa'] : 0,
        'deslocamento' => (string) ($row['deslocamento'] ?? ''),
        'descricao'    => (string) ($row['descricao'] ?? ''),
        'habilidades'  => (string) ($row['habilidades'] ?? ''),
        'origemAventura'   => true,
        'aventuraId'       => (int) $row['aventura_id'],
        'aventuraTitulo'   => (string) ($row['aventura_titulo'] ?? ''),
    ];
}
