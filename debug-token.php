<?php
require_once 'config.php';

$id = $_GET['id'] ?? 11; // default Sapatão
$stmt = $pdo->prepare("SELECT id, personagem, personagem_imagem, personagem_imagem_ajuste FROM fichas WHERE id = :id");
$stmt->execute(['id' => $id]);
$ficha = $stmt->fetch();

if (!$ficha) {
    echo "Ficha não encontrada.";
    exit;
}

$ajusteRaw = $ficha['personagem_imagem_ajuste'] ?? null;
$ajusteParsed = $ajusteRaw ? json_decode($ajusteRaw, true) : null;
$token = $ajusteParsed['token'] ?? ['scale' => 1, 'x' => 0, 'y' => 0];
$foto = $ajusteParsed['foto'] ?? ['scale' => 1, 'x' => 0, 'y' => 0];

$stmtAll = $pdo->query("SELECT id, personagem FROM fichas ORDER BY id");
$todas = $stmtAll->fetchAll();
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Debug Token — <?= htmlspecialchars($ficha['personagem']) ?></title>
<style>
    body { font-family: system-ui, sans-serif; padding: 24px; background: #f3eef6; }
    h1 { margin: 0 0 12px; }
    .nav a { display: inline-block; padding: 4px 8px; margin: 2px; background: #e8d8ec; border-radius: 4px; text-decoration: none; color: #3b1d43; }
    .nav a.active { background: #3b1d43; color: white; }
    pre { background: #1e1e1e; color: #eee; padding: 12px; border-radius: 6px; font-size: 12px; overflow: auto; }
    .grid { display: grid; gap: 24px; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); margin: 24px 0; }
    .card { background: white; padding: 16px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
    .card h3 { margin: 0 0 12px; font-size: 14px; }
    .frame {
        margin: 0 auto 8px;
        border: 3px solid #3b1d43;
        border-radius: 50%;
        overflow: hidden;
        background: #fff;
    }
    .frame.s56 { width: 56px; height: 56px; }
    .frame.s72 { width: 72px; height: 72px; }
    .frame.s96 { width: 96px; height: 96px; }
    .frame.s112 { width: 112px; height: 112px; }
    .frame img { width: 100%; height: 100%; object-fit: cover; transform-origin: center; display: block; }
    .label { font-size: 12px; color: #555; text-align: center; }
    .ref {
        margin: 0 auto 8px;
        width: 200px;
        max-height: 300px;
        overflow: hidden;
        border: 2px dashed #aaa;
    }
    .ref img { width: 100%; height: auto; display: block; }
</style>
</head>
<body>
<h1>Debug: <?= htmlspecialchars($ficha['personagem']) ?></h1>

<div class="nav">
<?php foreach ($todas as $f): ?>
    <a href="?id=<?= $f['id'] ?>" class="<?= $f['id'] == $ficha['id'] ? 'active' : '' ?>"><?= htmlspecialchars($f['personagem']) ?></a>
<?php endforeach ?>
</div>

<p><strong>Imagem:</strong> <?= htmlspecialchars($ficha['personagem_imagem']) ?></p>
<p><strong>Ajuste salvo no banco:</strong></p>
<pre><?= htmlspecialchars(json_encode($ajusteParsed, JSON_PRETTY_PRINT)) ?></pre>

<h2>Imagem original (sem nenhum transform)</h2>
<div class="ref"><img src="<?= htmlspecialchars($ficha['personagem_imagem']) ?>" alt=""></div>

<h2>Token aplicado em diferentes tamanhos (mesmo ajuste)</h2>
<div class="grid">
    <div class="card">
        <h3>72×72 (lista "Fichas Salvas" da ficha)</h3>
        <div class="frame s72">
            <img src="<?= htmlspecialchars($ficha['personagem_imagem']) ?>"
                 style="transform: translate(<?= $token['x'] ?>%, <?= $token['y'] ?>%) scale(<?= $token['scale'] ?>);">
        </div>
        <div class="label">--saved-token-*</div>
    </div>

    <div class="card">
        <h3>96×96 (Token no campo da ficha)</h3>
        <div class="frame s96">
            <img src="<?= htmlspecialchars($ficha['personagem_imagem']) ?>"
                 style="transform: translate(<?= $token['x'] ?>%, <?= $token['y'] ?>%) scale(<?= $token['scale'] ?>);">
        </div>
        <div class="label">--token-img-*</div>
    </div>

    <div class="card">
        <h3>56×56 (token tamanho 1 no tabuleiro)</h3>
        <div class="frame s56">
            <img src="<?= htmlspecialchars($ficha['personagem_imagem']) ?>"
                 style="transform: translate(<?= $token['x'] ?>%, <?= $token['y'] ?>%) scale(<?= $token['scale'] ?>);">
        </div>
        <div class="label">--token-img-* (Mesa de Jogo)</div>
    </div>

    <div class="card">
        <h3>112×112 (token tamanho 2 no tabuleiro)</h3>
        <div class="frame s112">
            <img src="<?= htmlspecialchars($ficha['personagem_imagem']) ?>"
                 style="transform: translate(<?= $token['x'] ?>%, <?= $token['y'] ?>%) scale(<?= $token['scale'] ?>);">
        </div>
        <div class="label">--token-img-* (Mesa de Jogo)</div>
    </div>
</div>

<h2>Comparação: ajuste FOTO (não deveria ser usado no token)</h2>
<div class="grid">
    <div class="card">
        <h3>112×112 com ajuste FOTO</h3>
        <div class="frame s112">
            <img src="<?= htmlspecialchars($ficha['personagem_imagem']) ?>"
                 style="transform: translate(<?= $foto['x'] ?>%, <?= $foto['y'] ?>%) scale(<?= $foto['scale'] ?>);">
        </div>
        <div class="label">Aplicando o ajuste de foto</div>
    </div>
</div>

<p><a href="ficha.php?id=<?= $ficha['id'] ?>">→ Abrir ficha.php</a> | <a href="mesa-jogo.php">→ Mesa de Jogo</a></p>
</body>
</html>
