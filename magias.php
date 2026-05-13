<?php
$dadosMagias = json_decode(file_get_contents(__DIR__ . '/data/magias.json'), true);
$magias = $dadosMagias['magias'] ?? [];
$filtros = $dadosMagias['filtros'] ?? [];
$regras = $dadosMagias['regras'] ?? [];

function magiaOptions(array $valores): string
{
    $html = '<option value="">Todos</option>';
    foreach ($valores as $valor) {
        $texto = is_numeric($valor) ? $valor . 'º círculo' : (string) $valor;
        $html .= '<option value="' . htmlspecialchars((string) $valor) . '">' . htmlspecialchars($texto) . '</option>';
    }
    return $html;
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Magias - Pindorama RPG</title>

    <link rel="stylesheet" href="assets/css/ficha.css?v=20260430" />
    <link rel="stylesheet" href="assets/css/classes.css?v=20260513a" />
    <link rel="stylesheet" href="assets/css/magias.css?v=20260503a" />
    <link rel="stylesheet" href="assets/css/transitions.css?v=20260508u" />
</head>
<body>
    <script src="assets/js/transitions.js?v=20260508u"></script>
    <main class="page-wrapper magias-page">

        <header class="top-actions classes-topbar">
            <div>
                <h1 class="titulo-cordel">Magias</h1>
                <p>Consulta completa com filtros por tipo, círculo, escola e características.</p>
            </div>
            <div class="actions">
                <a class="system-link-btn" href="index.php">Menu</a>
                <a class="system-link-btn" href="referencia.php">Acervo</a>
            </div>
        </header>

        <section class="sheet magias-layout">
            <aside class="panel magias-filtros">
                <div class="panel-title">Filtros</div>

                <label>
                    Busca
                    <input type="search" id="magiaBusca" placeholder="Nome ou texto..." />
                </label>

                <label>
                    Tipo
                    <select data-magia-filter="tipo"><?= magiaOptions($filtros['tipos'] ?? []) ?></select>
                </label>

                <label>
                    Círculo
                    <select data-magia-filter="circulo"><?= magiaOptions($filtros['circulos'] ?? []) ?></select>
                </label>

                <label>
                    Escola
                    <select data-magia-filter="escola"><?= magiaOptions($filtros['escolas'] ?? []) ?></select>
                </label>

                <label>
                    Execução
                    <select data-magia-filter="execucao"><?= magiaOptions($filtros['execucoes'] ?? []) ?></select>
                </label>

                <label>
                    Alcance
                    <select data-magia-filter="alcance"><?= magiaOptions($filtros['alcances'] ?? []) ?></select>
                </label>

                <label>
                    Efeito
                    <select data-magia-filter="efeito"><?= magiaOptions($filtros['efeitos'] ?? []) ?></select>
                </label>

                <label>
                    Duração
                    <select data-magia-filter="duracao"><?= magiaOptions($filtros['duracoes'] ?? []) ?></select>
                </label>

                <label>
                    Resistência
                    <select data-magia-filter="resistencia"><?= magiaOptions($filtros['resistencias'] ?? []) ?></select>
                </label>

                <label>
                    Custos especiais
                    <select data-magia-filter="custo">
                        <option value="">Todos</option>
                        <option value="sim">Com custo especial</option>
                        <option value="nao">Sem custo especial</option>
                    </select>
                </label>

                <button type="button" id="magiasLimparFiltros">Limpar filtros</button>
            </aside>

            <article class="magias-content">
                <section class="panel magias-regras">
                    <details>
                        <summary>
                            <span>Regras e listas do capítulo</span>
                            <em>abrir</em>
                        </summary>
                        <div class="magias-regras-texto">
                            <?php foreach ($regras as $linha): ?>
                                <p><?= htmlspecialchars($linha) ?></p>
                            <?php endforeach; ?>
                        </div>
                    </details>
                </section>

                <section class="magias-lista-header">
                    <h2>Lista de Magias</h2>
                    <span id="magiasContador"><?= count($magias) ?> magias</span>
                </section>

                <section class="magias-lista" id="magiasLista">
                    <?php foreach ($magias as $magia): ?>
                        <?php
                            $resistencia = $magia['resistencia'] ?: 'Nenhuma informada';
                            $busca = implode(' ', [
                                $magia['nome'] ?? '',
                                $magia['tipo'] ?? '',
                                $magia['escola'] ?? '',
                                $magia['caracteristicas_linha'] ?? '',
                                $magia['descricao'] ?? '',
                                implode(' ', $magia['aprimoramentos'] ?? []),
                            ]);
                        ?>
                        <details
                            class="magia-card"
                            data-magia-card
                            data-busca="<?= htmlspecialchars($busca) ?>"
                            data-tipo="<?= htmlspecialchars($magia['tipo'] ?? '') ?>"
                            data-circulo="<?= htmlspecialchars((string) ($magia['circulo'] ?? '')) ?>"
                            data-escola="<?= htmlspecialchars($magia['escola'] ?? '') ?>"
                            data-execucao="<?= htmlspecialchars($magia['execucao'] ?? '') ?>"
                            data-alcance="<?= htmlspecialchars($magia['alcance'] ?? '') ?>"
                            data-efeito="<?= htmlspecialchars($magia['efeito_tipo'] ?? '') ?>"
                            data-duracao="<?= htmlspecialchars($magia['duracao'] ?? '') ?>"
                            data-resistencia="<?= htmlspecialchars($resistencia) ?>"
                            data-custo="<?= !empty($magia['custo_especial']) ? 'sim' : 'nao' ?>"
                        >
                            <summary>
                                <span>
                                    <strong><?= htmlspecialchars($magia['nome'] ?? '') ?></strong>
                                    <small>
                                        <?= htmlspecialchars($magia['tipo'] ?? '') ?>
                                        <?= !empty($magia['circulo']) ? ' ' . htmlspecialchars((string) $magia['circulo']) : '' ?>
                                        (<?= htmlspecialchars($magia['escola'] ?? '') ?>)
                                    </small>
                                </span>
                                <em><?= htmlspecialchars($magia['execucao'] ?? '') ?></em>
                            </summary>

                            <div class="magia-meta">
                                <span><strong>Execução:</strong> <?= htmlspecialchars($magia['execucao'] ?: '-') ?></span>
                                <span><strong>Alcance:</strong> <?= htmlspecialchars($magia['alcance'] ?: '-') ?></span>
                                <?php if (!empty($magia['efeito_tipo']) || !empty($magia['efeito'])): ?>
                                    <span><strong><?= htmlspecialchars($magia['efeito_tipo'] ?: 'Efeito') ?>:</strong> <?= htmlspecialchars($magia['efeito'] ?: '-') ?></span>
                                <?php endif; ?>
                                <span><strong>Duração:</strong> <?= htmlspecialchars($magia['duracao'] ?: '-') ?></span>
                                <span><strong>Resistência:</strong> <?= htmlspecialchars($resistencia) ?></span>
                                <span><strong>Custo base:</strong> <?= htmlspecialchars((string) ($magia['custo_pm'] ?? '-')) ?> PM</span>
                                <span><strong>Custo especial:</strong> <?= !empty($magia['custo_especial']) ? 'Sim' : 'Não' ?></span>
                            </div>

                            <div class="magia-descricao">
                                <?php foreach (explode("\n\n", $magia['descricao'] ?? '') as $paragrafo): ?>
                                    <?php if (trim($paragrafo) !== ''): ?>
                                        <p><?= htmlspecialchars($paragrafo) ?></p>
                                    <?php endif; ?>
                                <?php endforeach; ?>
                            </div>

                            <?php if (!empty($magia['aprimoramentos'])): ?>
                                <div class="magia-aprimoramentos">
                                    <h3>Aprimoramentos</h3>
                                    <ul>
                                        <?php foreach ($magia['aprimoramentos'] as $aprimoramento): ?>
                                            <li><?= htmlspecialchars($aprimoramento) ?></li>
                                        <?php endforeach; ?>
                                    </ul>
                                </div>
                            <?php endif; ?>
                        </details>
                    <?php endforeach; ?>
                </section>
            </article>
        </section>
    </main>

    <script src="assets/js/magias.js?v=20260430"></script>
</body>
</html>
