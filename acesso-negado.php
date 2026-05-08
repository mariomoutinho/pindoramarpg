<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/permissions.php';
iniciarSessao();

http_response_code(403);

$mensagem = $_GET['m'] ?? 'Você não tem permissão para acessar esta área.';
$origem = $_GET['from'] ?? null;

$papel = papelGlobal();
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Acesso negado — Pindorama RPG</title>
    <link rel="stylesheet" href="assets/css/home.css?v=20260507d" />
    <link rel="stylesheet" href="assets/css/transitions.css?v=20260503d" />
    <style>
        .acesso-negado-wrap {
            display: grid;
            place-items: center;
            min-height: 100vh;
            padding: 24px;
        }
        .acesso-negado-card {
            max-width: 480px;
            background: rgba(255, 253, 253, 0.97);
            border: 3px solid var(--line, #76547c);
            border-radius: 16px;
            padding: 28px 24px;
            box-shadow: 0 16px 40px rgba(43, 18, 50, 0.30);
            text-align: center;
        }
        .acesso-negado-card h1 { color: var(--purple-dark, #2b1232); margin: 0 0 12px; }
        .acesso-negado-card p { color: var(--purple-dark, #2b1232); margin: 0 0 16px; line-height: 1.5; }
        .acesso-negado-card .links { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
        .acesso-negado-card a {
            padding: 8px 16px;
            border: 2px solid var(--purple, #76547c);
            border-radius: 999px;
            color: var(--purple-dark, #2b1232);
            background: #fff;
            text-decoration: none;
            font-weight: 700;
        }
        .acesso-negado-card a:hover { background: var(--purple-light, #f5d6e8); }
    </style>
</head>
<body class="home-body">
    <main class="acesso-negado-wrap">
        <article class="acesso-negado-card">
            <h1>Acesso negado</h1>
            <p><?= htmlspecialchars($mensagem) ?></p>
            <?php if ($papel === 'participante'): ?>
                <p><small>Seu perfil atual é <strong>Participante</strong>. Algumas áreas são exclusivas do <strong>Facilitador</strong> da mesa (equivalente ao narrador em outros RPGs).</small></p>
            <?php endif; ?>
            <div class="links">
                <a href="index.php">Voltar ao menu</a>
                <?php if (papelGlobal()): ?>
                    <a href="logout.php">Sair</a>
                <?php else: ?>
                    <a href="login.php">Entrar</a>
                <?php endif; ?>
            </div>
        </article>
    </main>
</body>
</html>
