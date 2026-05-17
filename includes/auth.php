<?php
// includes/auth.php — autenticação por sessão PHP.
//
// Funções utilitárias para login, logout, sessão, hash de senha e CSRF.
// Estilo procedural, sem classes, igual ao restante do projeto.

require_once __DIR__ . '/db.php';

/**
 * Garante as tabelas-base de autenticação.
 *
 * O deploy para hospedagem compartilhada nem sempre consegue rodar migrations
 * imediatamente. Sem essa proteção, cadastro/login quebram com erro fatal
 * quando `usuarios` ainda não existe no banco de produção.
 */
function garantirTabelasAuth(PDO $pdo): bool
{
    static $verificada = null;
    if ($verificada !== null) {
        return $verificada;
    }

    try {
        $pdo->exec(
            "CREATE TABLE IF NOT EXISTS usuarios (
                id INT(11) NOT NULL AUTO_INCREMENT,
                nome VARCHAR(150) NOT NULL,
                email VARCHAR(190) NOT NULL,
                senha_hash VARCHAR(255) NOT NULL,
                foto_path VARCHAR(255) NULL,
                role ENUM('facilitador','participante') NOT NULL DEFAULT 'participante',
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                UNIQUE KEY usuarios_email_unq (email)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
        );

        $pdo->exec(
            "CREATE TABLE IF NOT EXISTS mesas (
                id INT(11) NOT NULL AUTO_INCREMENT,
                facilitador_id INT(11) NOT NULL,
                nome VARCHAR(180) NOT NULL,
                descricao TEXT NULL,
                status ENUM('rascunho','ativa','arquivada') NOT NULL DEFAULT 'ativa',
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                KEY mesas_facilitador_idx (facilitador_id),
                CONSTRAINT mesas_facilitador_fk
                    FOREIGN KEY (facilitador_id) REFERENCES usuarios (id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
        );

        $pdo->exec(
            "CREATE TABLE IF NOT EXISTS mesa_participantes (
                id INT(11) NOT NULL AUTO_INCREMENT,
                mesa_id INT(11) NOT NULL,
                usuario_id INT(11) NOT NULL,
                papel ENUM('facilitador','participante') NOT NULL DEFAULT 'participante',
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                UNIQUE KEY mesa_participantes_mesa_usuario_unq (mesa_id, usuario_id),
                KEY mesa_participantes_usuario_idx (usuario_id),
                CONSTRAINT mesa_participantes_mesa_fk
                    FOREIGN KEY (mesa_id) REFERENCES mesas (id) ON DELETE CASCADE,
                CONSTRAINT mesa_participantes_usuario_fk
                    FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
        );

        garantirColunaTabela($pdo, 'usuarios', 'foto_path', 'foto_path VARCHAR(255) NULL AFTER senha_hash');
        garantirColunaTabela($pdo, 'mesas', 'status', "status ENUM('rascunho','ativa','arquivada') NOT NULL DEFAULT 'ativa' AFTER descricao");

        $check = $pdo->query("SHOW TABLES LIKE 'usuarios'");
        $verificada = $check && $check->fetch() ? true : false;
        return $verificada;
    } catch (Throwable $e) {
        $verificada = false;
        return false;
    }
}

function garantirColunaTabela(PDO $pdo, string $tabela, string $coluna, string $definicao): void
{
    $stmt = $pdo->prepare(
        "SELECT COUNT(*) AS total
           FROM information_schema.COLUMNS
          WHERE TABLE_SCHEMA = DATABASE()
            AND TABLE_NAME = :tabela
            AND COLUMN_NAME = :coluna"
    );
    $stmt->execute(['tabela' => $tabela, 'coluna' => $coluna]);

    if ((int) ($stmt->fetch()['total'] ?? 0) === 0) {
        $pdo->exec("ALTER TABLE {$tabela} ADD COLUMN {$definicao}");
    }
}

/**
 * Inicia (ou reaproveita) a sessão PHP com cookies em modo httponly.
 * Idempotente: pode ser chamada várias vezes na mesma requisição.
 */
function iniciarSessao(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    $params = session_get_cookie_params();
    session_set_cookie_params([
        'lifetime' => 0,
        'path'     => $params['path'] ?: '/',
        'domain'   => $params['domain'] ?? '',
        'secure'   => !empty($_SERVER['HTTPS']),
        'httponly' => true,
        'samesite' => 'Lax',
    ]);

    session_name('PINDORAMA_SID');
    session_start();
}

/**
 * Hash de senha usando o algoritmo padrão do PHP (bcrypt/argon2).
 */
function hashSenha(string $senha): string
{
    return password_hash($senha, PASSWORD_DEFAULT);
}

/**
 * Verifica se a senha em texto puro bate com o hash armazenado.
 */
function verificarSenha(string $senha, string $hash): bool
{
    return password_verify($senha, $hash);
}

/**
 * Tenta autenticar email + senha. Em caso de sucesso preenche a sessão
 * com os dados do usuário e devolve `true`; em caso de erro devolve
 * `false` (sem mensagens — quem chama decide o feedback).
 */
function autenticar(string $email, string $senha): bool
{
    global $pdo;

    if (!garantirTabelasAuth($pdo)) {
        return false;
    }

    $email = trim(strtolower($email));
    if ($email === '' || $senha === '') {
        return false;
    }

    $stmt = $pdo->prepare(
        "SELECT id, nome, email, senha_hash, role FROM usuarios WHERE email = :email LIMIT 1"
    );
    $stmt->execute(['email' => $email]);
    $usuario = $stmt->fetch();

    if (!$usuario || !verificarSenha($senha, $usuario['senha_hash'])) {
        return false;
    }

    iniciarSessao();
    session_regenerate_id(true);

    $_SESSION['usuario'] = [
        'id'    => (int) $usuario['id'],
        'nome'  => (string) $usuario['nome'],
        'email' => (string) $usuario['email'],
        'role'  => (string) $usuario['role'],
    ];

    return true;
}

/**
 * Cria um novo usuário com senha já hashada. Devolve o id criado, ou
 * `null` se o email já existir.
 */
function registrarUsuario(string $nome, string $email, string $senha, string $role = 'participante'): ?int
{
    global $pdo;

    if (!garantirTabelasAuth($pdo)) {
        return null;
    }

    $nome  = trim($nome);
    $email = trim(strtolower($email));
    if ($nome === '' || $email === '' || strlen($senha) < 6) {
        return null;
    }
    if (!in_array($role, ['facilitador', 'participante'], true)) {
        $role = 'participante';
    }

    $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE email = :email LIMIT 1");
    $stmt->execute(['email' => $email]);
    if ($stmt->fetch()) {
        return null;
    }

    $stmt = $pdo->prepare(
        "INSERT INTO usuarios (nome, email, senha_hash, role)
         VALUES (:nome, :email, :senha_hash, :role)"
    );
    $stmt->execute([
        'nome'       => $nome,
        'email'      => $email,
        'senha_hash' => hashSenha($senha),
        'role'       => $role,
    ]);

    return (int) $pdo->lastInsertId();
}

/**
 * Encerra a sessão e remove o cookie de sessão.
 */
function encerrarSessao(): void
{
    iniciarSessao();
    $_SESSION = [];

    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(
            session_name(),
            '',
            time() - 42000,
            $params['path'],
            $params['domain'],
            $params['secure'],
            $params['httponly']
        );
    }

    session_destroy();
}

/**
 * Retorna o array do usuário logado (id, nome, email, role) ou `null`.
 */
function usuarioLogado(): ?array
{
    iniciarSessao();
    return $_SESSION['usuario'] ?? null;
}

/**
 * Garante que há um usuário logado; caso contrário, redireciona para o
 * login (preservando a URL atual em ?next=... para retorno pós-login).
 *
 * Para endpoints AJAX/JSON (Content-Type esperado `application/json`)
 * usa-se 401 + JSON em vez de redirect.
 */
function exigirLogin(): array
{
    $usuario = usuarioLogado();
    if ($usuario) {
        return $usuario;
    }

    if (requisicaoEsperaJson()) {
        http_response_code(401);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'success' => false,
            'message' => 'Sessão expirada ou usuário não autenticado.',
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $alvo = $_SERVER['REQUEST_URI'] ?? '';
    $next = $alvo !== '' ? '?next=' . urlencode($alvo) : '';
    header('Location: login.php' . $next);
    exit;
}

/**
 * Garante que o usuário logado tem o papel global esperado. Em caso
 * contrário, devolve mensagem de "acesso não autorizado".
 *
 * IMPORTANTE: este check é apenas para o papel global (usuarios.role).
 * Para autorização específica de uma mesa, use as funções de
 * includes/permissions.php (ex.: podeFacilitarMesa()).
 */
function exigirPapel(string $papel): array
{
    $usuario = exigirLogin();
    if (($usuario['role'] ?? '') !== $papel) {
        if (requisicaoEsperaJson()) {
            http_response_code(403);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'success' => false,
                'message' => 'Acesso não autorizado para este perfil.',
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }
        http_response_code(403);
        echo paginaErroAcessoNegado();
        exit;
    }
    return $usuario;
}

/**
 * Heurística para distinguir requisições "de página" (espera HTML) de
 * requisições AJAX/JSON. Usada para escolher entre redirect e 401 JSON.
 */
function requisicaoEsperaJson(): bool
{
    $accept = $_SERVER['HTTP_ACCEPT'] ?? '';
    if (stripos($accept, 'application/json') !== false) {
        return true;
    }
    $xhr = $_SERVER['HTTP_X_REQUESTED_WITH'] ?? '';
    if (strcasecmp($xhr, 'XMLHttpRequest') === 0) {
        return true;
    }
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
    if (stripos($contentType, 'application/json') !== false) {
        return true;
    }
    return false;
}

/**
 * Devolve (criando se preciso) o token CSRF da sessão atual.
 */
function tokenCsrf(): string
{
    iniciarSessao();
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Compara o token enviado com o token da sessão (timing-safe).
 */
function validarCsrf(?string $enviado): bool
{
    iniciarSessao();
    $atual = $_SESSION['csrf_token'] ?? '';
    if ($atual === '' || !is_string($enviado) || $enviado === '') {
        return false;
    }
    return hash_equals($atual, $enviado);
}

/**
 * Página HTML simples para erros 403, mantendo identidade visual.
 */
function paginaErroAcessoNegado(): string
{
    return '<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">'
        . '<title>Acesso não autorizado — Pindorama RPG</title>'
        . '<link rel="stylesheet" href="assets/css/ficha.css">'
        . '<link rel="stylesheet" href="assets/css/home.css">'
        . '<link rel="stylesheet" href="assets/css/auth.css">'
        . '</head><body class="home-body"><main class="home-shell">'
        . '<header class="home-hero home-hero-compact">'
        . '<h1 class="home-title">Acesso não autorizado</h1>'
        . '<p class="home-subtitle">Você não tem permissão para acessar esta página.</p>'
        . '</header>'
        . '<div class="home-list-footer">'
        . '<a class="home-btn home-btn-ghost" href="index.php">Voltar ao menu</a>'

        . '</div>'
        . '</main></body></html>';
}
