<?php
$dadosBestiario = json_decode(file_get_contents(__DIR__ . '/data/bestiario.json'), true);
$filtrosBestiario = $dadosBestiario['filtros'] ?? [];

function bestiarioOptions(array $valores): string
{
    $html = '<option value="">Todos</option>';
    foreach ($valores as $valor) {
        $html .= '<option value="' . htmlspecialchars((string) $valor) . '">' . htmlspecialchars((string) $valor) . '</option>';
    }
    return $html;
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Bestiário - Pindorama RPG</title>

    <link rel="stylesheet" href="assets/css/ficha.css?v=20260430" />
    <link rel="stylesheet" href="assets/css/classes.css?v=20260503j" />
    <link rel="stylesheet" href="assets/css/bestiario.css?v=20260505h" />
    <link rel="stylesheet" href="assets/css/transitions.css?v=20260503d" />
</head>
<body>
    <script src="assets/js/transitions.js?v=20260503d"></script>

    <main class="page-wrapper bestiario-page">
        <header class="top-actions classes-topbar">
            <div>
                <h1>Bestiário</h1>
                <p>Criaturas, espíritos, feras e ameaças de Pindorama RPG.</p>
            </div>
            <div class="actions">
                <a class="system-link-btn" href="index.php">Menu</a>
                <a class="system-link-btn" href="referencia.php">Referências</a>
                <a class="system-link-btn" href="campo-batalha.php">Campo de Batalha</a>
            </div>
        </header>

        <section class="sheet bestiario-layout">
            <aside class="panel bestiario-filtros">
                <div class="panel-title">Filtros</div>

                <label>
                    Busca por nome
                    <input type="search" id="bestiarioBusca" placeholder="Nome da criatura..." />
                </label>

                <label>
                    ND
                    <select id="bestiarioFiltroNd">
                        <option value="">Todos</option>
                        <?php for ($nd = 0; $nd <= 20; $nd++): ?>
                            <option value="<?= $nd ?>"><?= $nd ?></option>
                        <?php endfor; ?>
                    </select>
                </label>

                <label>
                    Tipo
                    <select id="bestiarioFiltroTipo"><?= bestiarioOptions($filtrosBestiario['tipos'] ?? []) ?></select>
                </label>

                <label>
                    Tamanho
                    <select id="bestiarioFiltroTamanho"><?= bestiarioOptions($filtrosBestiario['tamanhos'] ?? []) ?></select>
                </label>

                <label>
                    Bioma
                    <select id="bestiarioFiltroBioma"><?= bestiarioOptions($filtrosBestiario['biomas'] ?? []) ?></select>
                </label>

                <label>
                    Papel tático
                    <select id="bestiarioFiltroPapel"><?= bestiarioOptions($filtrosBestiario['papeisTaticos'] ?? []) ?></select>
                </label>

                <button type="button" id="bestiarioLimparFiltros">Limpar filtros</button>
            </aside>

            <article class="bestiario-content">
                <section class="bestiario-lista-header">
                    <div>
                        <h2>Criaturas</h2>
                        <p>Catálogo preparado para fichas completas e tokens de Campo de Batalha.</p>
                    </div>
                    <span id="bestiarioContador">0 criaturas</span>
                </section>

                <section class="bestiario-lista" id="bestiarioLista" aria-live="polite"></section>

                <details class="panel bestiario-form-panel" id="bestiarioFormPanel">
                    <summary>
                        <span id="bestiarioFormTitulo">Adicionar criatura</span>
                        <em>abrir</em>
                    </summary>

                    <form class="bestiario-form" id="bestiarioForm">
                        <input type="hidden" id="criaturaId" />

                        <details class="criatura-secao">
                            <summary>Identificação</summary>
                            <div class="criatura-secao-conteudo">
                                <label>Nome <input id="criaturaNome" required /></label>
                                <label>Nome alternativo <input id="criaturaNomeAlternativo" /></label>
                                <label>Frase de impacto <input id="criaturaFraseImpacto" /></label>
                                <label>ND <input id="criaturaNd" type="number" min="0" step="1" /></label>
                                <label>Tipo <select id="criaturaTipo"><?= bestiarioOptions($filtrosBestiario['tipos'] ?? []) ?></select></label>
                                <label>Tamanho <select id="criaturaTamanho"><?= bestiarioOptions($filtrosBestiario['tamanhos'] ?? []) ?></select></label>
                                <label>Bioma principal <select id="criaturaBioma"><?= bestiarioOptions($filtrosBestiario['biomas'] ?? []) ?></select></label>
                                <label>Habitat específico <input id="criaturaHabitat" /></label>
                                <label>Papel tático <select id="criaturaPapelTatico"><?= bestiarioOptions($filtrosBestiario['papeisTaticos'] ?? []) ?></select></label>
                                <label>Imagem da ficha <input id="criaturaImagem" placeholder="assets/img/bestiario/criatura.png" /></label>
                            </div>
                        </details>

                        <details class="criatura-secao">
                            <summary>Token de batalha</summary>
                            <div class="criatura-token-editor">
                                <input type="hidden" id="criaturaTokenAjuste" value='{"scale":1,"x":0,"y":0}' />
                                <input type="file" id="criaturaTokenArquivo" accept="image/*" hidden />

                                <div class="criatura-token-preview" id="criaturaTokenPreview" aria-label="Prévia do token da criatura">
                                    <div class="criatura-token-frame">
                                        <img id="criaturaTokenPreviewImg" src="" alt="" />
                                        <span id="criaturaTokenPreviewEmpty">Sem token</span>
                                    </div>
                                </div>

                                <div class="criatura-token-fields">
                                    <label>Imagem do token
                                        <input id="criaturaTokenImagem" placeholder="Use um caminho, URL ou carregue uma imagem" />
                                    </label>
                                    <div class="criatura-token-actions">
                                        <button type="button" id="criaturaTokenCarregar">Carregar imagem</button>
                                        <button type="button" id="criaturaTokenUsarFicha">Usar imagem da ficha</button>
                                        <button type="button" id="criaturaTokenResetar">Centralizar</button>
                                        <button type="button" id="criaturaTokenSalvar">Salvar token</button>
                                        <button type="button" id="criaturaTokenRemover">Remover token</button>
                                    </div>
                                    <div class="criatura-token-sliders">
                                        <label>Zoom <input id="criaturaTokenZoom" type="range" min="0.2" max="6" step="0.05" value="1" /></label>
                                        <label>Foco horizontal <input id="criaturaTokenFocoX" type="range" min="-220" max="220" step="1" value="0" /></label>
                                        <label>Foco vertical <input id="criaturaTokenFocoY" type="range" min="-220" max="220" step="1" value="0" /></label>
                                    </div>
                                </div>
                            </div>
                        </details>

                        <details class="criatura-secao">
                            <summary>Conteúdo narrativo</summary>
                            <div class="criatura-secao-conteudo">
                                <label>Conceito <textarea id="criaturaConceito"></textarea></label>
                                <label>Descrição <textarea id="criaturaDescricao"></textarea></label>
                                <label>Origem e inspiração <textarea id="criaturaOrigemInspiracao"></textarea></label>
                                <label>Comportamento <textarea id="criaturaComportamento"></textarea></label>
                                <label>Sinais de presença <textarea id="criaturaSinaisPresenca" placeholder="Um item por linha"></textarea></label>
                                <label>Táticas de combate <textarea id="criaturaTaticasCombate"></textarea></label>
                                <label>Uso em campanha <textarea id="criaturaUsoCampanha"></textarea></label>
                                <label>Ganchos de aventura <textarea id="criaturaGanchosAventura" placeholder="Um item por linha"></textarea></label>
                                <label>Tesouro, recursos ou recompensas <textarea id="criaturaTesouroRecompensas"></textarea></label>
                                <label>Variações de ND <textarea id="criaturaVariacoesNd"></textarea></label>
                                <label>Comparação de equilíbrio <textarea id="criaturaComparacaoEquilibrio"></textarea></label>
                                <label>Registro de consistência <textarea id="criaturaRegistroConsistencia"></textarea></label>
                                <label>Notas de design <textarea id="criaturaNotasDesign"></textarea></label>
                            </div>
                        </details>

                        <details class="criatura-secao">
                            <summary>Ficha mecânica</summary>
                            <div class="criatura-secao-conteudo">
                                <label>Iniciativa <input id="criaturaIniciativa" /></label>
                                <label>Sentidos <input id="criaturaSentidos" /></label>
                                <label>Percepção <input id="criaturaPercepcao" /></label>
                                <label>Defesa <input id="criaturaDefesa" type="number" min="0" step="1" /></label>
                                <label>Fortitude <input id="criaturaFortitude" /></label>
                                <label>Reflexos <input id="criaturaReflexos" /></label>
                                <label>Vontade <input id="criaturaVontade" /></label>
                                <label>Pontos de Vida <input id="criaturaPvMax" type="number" min="0" step="1" /></label>
                                <label>Pontos de Mana <input id="criaturaPmMax" type="number" min="0" step="1" /></label>
                                <label>Deslocamento <input id="criaturaDeslocamento" /></label>
                                <label>Atributos <textarea id="criaturaAtributos" placeholder="forca: +0&#10;destreza: +0"></textarea></label>
                                <label>Perícias <textarea id="criaturaPericias" placeholder="Uma perícia por linha"></textarea></label>
                                <label>Habilidades <textarea id="criaturaHabilidades" placeholder="Uma habilidade por linha"></textarea></label>
                                <label>Vulnerabilidades <textarea id="criaturaVulnerabilidades" placeholder="Uma por linha"></textarea></label>
                                <label>Resistências <textarea id="criaturaResistencias" placeholder="Uma por linha"></textarea></label>
                                <label>Imunidades <textarea id="criaturaImunidades" placeholder="Uma por linha"></textarea></label>
                                <label>Tesouro mecânico <textarea id="criaturaTesouroMecanico"></textarea></label>
                                <label>Ficha completa em texto livre <textarea id="criaturaFichaCompleta"></textarea></label>
                                <label>Notas do Mestre <textarea id="criaturaNotasMestre"></textarea></label>
                            </div>
                        </details>

                        <details class="criatura-secao criatura-ataques-fieldset">
                            <summary>Ataques</summary>
                            <div class="criatura-secao-conteudo">
                                <div class="criatura-ataques-lista" id="criaturaAtaquesContainer"></div>
                                <button type="button" class="criatura-add-ataque" id="criaturaAdicionarAtaque">+ Adicionar Ataque</button>
                            </div>
                        </details>

                        <div class="bestiario-form-actions">
                            <button type="submit" class="primary">Salvar criatura</button>
                            <button type="button" id="bestiarioCancelarEdicao">Cancelar edição</button>
                        </div>
                    </form>
                </details>
            </article>
        </section>
    </main>

    <div class="bestiario-modal" id="bestiarioModal" hidden>
        <div class="bestiario-modal-card" role="dialog" aria-modal="true" aria-labelledby="bestiarioModalTitulo">
            <button type="button" class="bestiario-modal-close" id="bestiarioFecharModal" aria-label="Fechar ficha">×</button>
            <div id="bestiarioModalConteudo"></div>
        </div>
    </div>

    <script>
        window.BESTIARIO_BASE = <?= json_encode($dadosBestiario, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?>;
    </script>
    <script src="assets/js/bestiario.js?v=20260505i"></script>
</body>
</html>
