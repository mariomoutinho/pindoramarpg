<?php

require_once 'config.php';

header('Content-Type: application/json');

$id = $_POST['id'] ?? null;

$campos = [
    'participante',
    'personagem',
    'ancestralidade',
    'origem',
    'classe',
    'nivel',
    'divindade',
    'personagem_imagem',

    'forca',
    'destreza',
    'constituicao',
    'inteligencia',
    'sabedoria',
    'carisma',

    'pv_total',
    'pv_atuais',
    'pm_total',
    'pm_atuais',
    'pp_total',
    'pp_atuais',
    'origem_beneficios',

    'defesa_total',
    'defesa_destreza',
    'defesa_armadura',
    'defesa_escudo',
    'defesa_outros',

    'armadura_escudo',
    'proficiencias',
    'habilidades_magias',
    'equipamentos',

    'ataques',
    'pericias',

    'dinheiro',
    'carga'
];

$dados = [];
foreach ($campos as $campo) {
    $dados[$campo] = $_POST[$campo] ?? null;
}

$imagemAtual = $_POST['imagem_atual'] ?? null;
$removerImagem = ($_POST['remover_personagem_imagem'] ?? '0') === '1';
$imagemSalva = $imagemAtual;
$imagemAntigaBanco = null;

try {
    if ($id) {
        $stmt = $pdo->prepare("SELECT personagem_imagem FROM fichas WHERE id = :id");
        $stmt->execute(['id' => $id]);
        $fichaAtual = $stmt->fetch();

        if ($fichaAtual) {
            $imagemAntigaBanco = $fichaAtual['personagem_imagem'] ?? null;
            if (!$imagemSalva) {
                $imagemSalva = $imagemAntigaBanco;
            }
        }
    }

    if ($removerImagem) {
        if ($imagemAntigaBanco && file_exists(__DIR__ . '/' . $imagemAntigaBanco)) {
            unlink(__DIR__ . '/' . $imagemAntigaBanco);
        }
        $imagemSalva = null;
    }

    if (
        isset($_FILES['personagem_imagem_file']) &&
        $_FILES['personagem_imagem_file']['error'] === UPLOAD_ERR_OK
    ) {
        $uploadDir = __DIR__ . '/uploads/personagens/';

        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $nomeOriginal = $_FILES['personagem_imagem_file']['name'];
        $tmpName = $_FILES['personagem_imagem_file']['tmp_name'];
        $ext = strtolower(pathinfo($nomeOriginal, PATHINFO_EXTENSION));

        $extPermitidas = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

        if (!in_array($ext, $extPermitidas)) {
            echo json_encode([
                'success' => false,
                'message' => 'Formato de imagem inválido. Use JPG, PNG, WEBP ou GIF.'
            ]);
            exit;
        }

        $novoNome = uniqid('personagem_', true) . '.' . $ext;
        $destino = $uploadDir . $novoNome;

        if (!move_uploaded_file($tmpName, $destino)) {
            echo json_encode([
                'success' => false,
                'message' => 'Não foi possível salvar a imagem do personagem.'
            ]);
            exit;
        }

        if ($imagemAntigaBanco && file_exists(__DIR__ . '/' . $imagemAntigaBanco)) {
            unlink(__DIR__ . '/' . $imagemAntigaBanco);
        }

        $imagemSalva = 'uploads/personagens/' . $novoNome;
    }

    $dados['personagem_imagem'] = $imagemSalva;

    $classesEntrada = json_decode($_POST['classes_personagem'] ?? '', true);
    if (!is_array($classesEntrada) || empty($classesEntrada)) {
        $classeLegada = trim((string) ($dados['classe'] ?? ''));
        $nivelLegado = (int) ($dados['nivel'] ?? 0);
        $classesEntrada = $classeLegada !== ''
            ? [['classe_id' => strtolower($classeLegada), 'nivel' => max(1, $nivelLegado)]]
            : [];
    }

    $poderesEntrada = json_decode($_POST['poderes'] ?? '', true);
    if (!is_array($poderesEntrada)) {
        $poderesEntrada = [];
    }

    if (!empty($classesEntrada)) {
        $primeira = $classesEntrada[0];
        $dados['classe'] = $primeira['classe_id'] ?? $dados['classe'];
        $dados['nivel'] = array_sum(array_map(
            fn($c) => (int) ($c['nivel'] ?? 0),
            $classesEntrada
        ));
    }

    $pdo->beginTransaction();

    if ($id) {
        $sets = [];
        foreach ($campos as $campo) {
            $sets[] = "$campo = :$campo";
        }
        $sql = "UPDATE fichas SET " . implode(", ", $sets) . " WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $dados['id'] = $id;
        $stmt->execute($dados);
        $fichaId = $id;
    } else {
        $colunas = implode(", ", $campos);
        $placeholders = ":" . implode(", :", $campos);
        $sql = "INSERT INTO fichas ($colunas) VALUES ($placeholders)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($dados);
        $fichaId = (int) $pdo->lastInsertId();
    }

    $pdo->prepare("DELETE FROM ficha_classes WHERE ficha_id = :ficha_id")
        ->execute(['ficha_id' => $fichaId]);

    $stmtClasse = $pdo->prepare(
        "INSERT INTO ficha_classes (ficha_id, classe_id, nivel, ordem)
         VALUES (:ficha_id, :classe_id, :nivel, :ordem)"
    );
    foreach ($classesEntrada as $i => $classe) {
        $stmtClasse->execute([
            'ficha_id'  => $fichaId,
            'classe_id' => (string) ($classe['classe_id'] ?? ''),
            'nivel'     => (int) ($classe['nivel'] ?? 1),
            'ordem'     => $i,
        ]);
    }

    $pdo->prepare("DELETE FROM ficha_poderes WHERE ficha_id = :ficha_id")
        ->execute(['ficha_id' => $fichaId]);

    $stmtPoder = $pdo->prepare(
        "INSERT INTO ficha_poderes (ficha_id, classe_id, poder_id, tipo)
         VALUES (:ficha_id, :classe_id, :poder_id, :tipo)"
    );
    foreach ($poderesEntrada as $poder) {
        $stmtPoder->execute([
            'ficha_id'  => $fichaId,
            'classe_id' => $poder['classe'] ?? null,
            'poder_id'  => (string) ($poder['id'] ?? $poder['nome'] ?? ''),
            'tipo'      => (string) ($poder['tipo'] ?? 'classe'),
        ]);
    }

    $pdo->commit();

    echo json_encode([
        'success'           => true,
        'id'                => $fichaId,
        'personagem_imagem' => $imagemSalva,
        'message'           => $id ? 'Ficha atualizada com sucesso.' : 'Ficha criada com sucesso.',
    ]);
} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo json_encode([
        'success' => false,
        'message' => 'Erro ao salvar a ficha.',
        'error' => $e->getMessage()
    ]);
}