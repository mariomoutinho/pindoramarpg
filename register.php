<?php
require_once __DIR__ . '/includes/auth.php';

iniciarSessao();

if (usuarioLogado()) {
    header('Location: painel.php');
    exit;
}

$erro = null;
$nomePreenchido = '';
$emailPreenchido = '';
$rolePreenchido = 'participante';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nomePreenchido  = trim($_POST['nome']  ?? '');
    $emailPreenchido = trim($_POST['email'] ?? '');
    $rolePreenchido  = (string) ($_POST['role'] ?? 'participante');
    $senha           = (string) ($_POST['senha']     ?? '');
    $senhaConfirmar  = (string) ($_POST['senha_confirmar'] ?? '');
    $tokenEnviado    = (string) ($_POST['csrf'] ?? '');

    if (!validarCsrf($tokenEnviado)) {
        $erro = 'Sessão expirada. Recarregue a página e tente novamente.';
    } elseif ($nomePreenchido === '' || $emailPreenchido === '') {
        $erro = 'Preencha nome e email.';
    } elseif (strlen($senha) < 6) {
        $erro = 'A senha precisa ter pelo menos 6 caracteres.';
    } elseif ($senha !== $senhaConfirmar) {
        $erro = 'As senhas não coincidem.';
    } elseif (!in_array($rolePreenchido, ['facilitador', 'participante'], true)) {
        $erro = 'Perfil inválido.';
    } else {
        $novoId = registrarUsuario($nomePreenchido, $emailPreenchido, $senha, $rolePreenchido);
        if ($novoId === null) {
            $erro = 'Não foi possível criar a conta. Verifique se o email já está em uso.';
        } else {
            autenticar($emailPreenchido, $senha);
            header('Location: painel.php');
            exit;
        }
    }
}

$csrf = tokenCsrf();
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Criar conta — Pindorama RPG</title>

    <link rel="stylesheet" href="assets/css/ficha.css" />
    <link rel="stylesheet" href="assets/css/home.css?v=20260513g" />
    <link rel="stylesheet" href="assets/css/auth.css?v=20260507a" />
    <link rel="stylesheet" href="assets/css/transitions.css?v=20260508u" />
</head>
<body class="home-body register-page">
    <script src="assets/js/transitions.js?v=20260508u"></script>

    <main class="home-shell auth-shell">
        <header class="home-hero home-hero-compact">
            <a href="login.php" class="home-back" aria-label="Voltar ao login">&larr;</a>
            <h1 class="home-title">Criar conta</h1>
            <p class="home-subtitle">Cadastre-se como Facilitador ou Participante.</p>
        </header>

        <?php if ($erro): ?>
            <div class="auth-alert" role="alert"><?= htmlspecialchars($erro) ?></div>
        <?php endif; ?>

        <form class="auth-form" method="POST" action="register.php" novalidate>
            <input type="hidden" name="csrf" value="<?= htmlspecialchars($csrf) ?>" />

            <label class="auth-field">
                <span>Nome</span>
                <input type="text" name="nome" required maxlength="150"
                       value="<?= htmlspecialchars($nomePreenchido) ?>" />
            </label>

            <label class="auth-field">
                <span>Email</span>
                <input type="email" name="email" required autocomplete="email"
                       value="<?= htmlspecialchars($emailPreenchido) ?>" />
            </label>

            <label class="auth-field">
                <span>Senha</span>
                <input type="password" name="senha" required autocomplete="new-password" minlength="6" />
            </label>

            <label class="auth-field">
                <span>Confirmar senha</span>
                <input type="password" name="senha_confirmar" required autocomplete="new-password" minlength="6" />
            </label>

            <fieldset class="auth-role">
                <legend>Perfil padrão</legend>
                <label class="auth-role-option">
                    <input type="radio" name="role" value="participante"
                           <?= $rolePreenchido !== 'facilitador' ? 'checked' : '' ?> />
                    <span><strong>Participante</strong> — joga em mesas, foca na própria ficha.</span>
                </label>
                <label class="auth-role-option">
                    <input type="radio" name="role" value="facilitador"
                           <?= $rolePreenchido === 'facilitador' ? 'checked' : '' ?> />
                    <span><strong>Facilitador</strong> — cria e conduz mesas, NPCs, mapas e cenas.</span>
                </label>
            </fieldset>

            <button type="submit" class="home-btn auth-submit">Criar conta</button>
        </form>

        <div class="home-list-footer auth-footer">
            <a class="home-btn home-btn-ghost" href="index.php">Voltar</a>
            <a class="home-btn" href="login.php">Já tenho conta</a>
        </div>
    </main>
</body>
</html>
