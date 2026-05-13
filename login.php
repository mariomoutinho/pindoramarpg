<?php
require_once __DIR__ . '/includes/auth.php';

iniciarSessao();

if (usuarioLogado()) {
    header('Location: painel.php');
    exit;
}

$erro = null;
$emailPreenchido = '';
$next = $_GET['next'] ?? $_POST['next'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $emailPreenchido = trim($_POST['email'] ?? '');
    $senha           = (string) ($_POST['senha'] ?? '');
    $tokenEnviado    = (string) ($_POST['csrf'] ?? '');

    if (!validarCsrf($tokenEnviado)) {
        $erro = 'Sessão expirada. Recarregue a página e tente novamente.';
    } elseif (autenticar($emailPreenchido, $senha)) {
        $destino = $next !== '' && substr($next, 0, 1) === '/' ? $next : 'painel.php';
        // Evita open redirect: só aceitamos paths internos relativos.
        if (preg_match('#^https?://#i', $destino)) {
            $destino = 'painel.php';
        }
        header('Location: ' . $destino);
        exit;
    } else {
        $erro = 'Email ou senha inválidos.';
    }
}

$csrf = tokenCsrf();
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Entrar — Pindorama RPG</title>

    <link rel="stylesheet" href="assets/css/ficha.css" />
    <link rel="stylesheet" href="assets/css/home.css?v=20260513g" />
    <link rel="stylesheet" href="assets/css/auth.css?v=20260507a" />
    <link rel="stylesheet" href="assets/css/transitions.css?v=20260508u" />
</head>
<body class="home-body login-page">
    <script src="assets/js/transitions.js?v=20260508u"></script>

    <main class="home-shell auth-shell">
        <header class="home-hero home-hero-compact">
            <a href="index.php" class="home-back" aria-label="Voltar ao menu">&larr;</a>
            <h1 class="home-title">Entrar</h1>
            <p class="home-subtitle">Acesse sua conta de Facilitador ou Participante.</p>
        </header>

        <?php if ($erro): ?>
            <div class="auth-alert" role="alert"><?= htmlspecialchars($erro) ?></div>
        <?php endif; ?>

        <form class="auth-form" method="POST" action="login.php" novalidate>
            <input type="hidden" name="csrf" value="<?= htmlspecialchars($csrf) ?>" />
            <input type="hidden" name="next" value="<?= htmlspecialchars($next) ?>" />

            <label class="auth-field">
                <span>Email</span>
                <input
                    type="email"
                    name="email"
                    required
                    autocomplete="email"
                    value="<?= htmlspecialchars($emailPreenchido) ?>"
                />
            </label>

            <label class="auth-field">
                <span>Senha</span>
                <input
                    type="password"
                    name="senha"
                    required
                    autocomplete="current-password"
                    minlength="6"
                />
            </label>

            <button type="submit" class="home-btn auth-submit">Entrar</button>
        </form>

        <div class="home-list-footer auth-footer">
            <a class="home-btn home-btn-ghost" href="index.php">Voltar</a>
            <a class="home-btn" href="register.php">Criar conta</a>
        </div>
    </main>
</body>
</html>
