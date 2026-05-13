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
