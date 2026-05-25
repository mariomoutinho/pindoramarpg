<?php
require_once __DIR__ . '/includes/auth.php';
exigirLogin();

$dadosAncestralidades = json_decode(file_get_contents(__DIR__ . '/data/ancestralidades.json'), true);
$ancestralidadesFicha = $dadosAncestralidades['ancestralidades'] ?? [];

$dadosOrigens = json_decode(file_get_contents(__DIR__ . '/data/origens.json'), true);
$origensFicha = $dadosOrigens['origens'] ?? [];

$dadosDivindades = json_decode(file_get_contents(__DIR__ . '/data/divindades.json'), true);
$divindadesFicha = $dadosDivindades['divindades'] ?? [];
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ficha Pindorama RPG</title>

    <link rel="stylesheet" href="assets/css/ficha.css?v=20260513d" />
    <link rel="stylesheet" href="assets/css/poderes.css?v=20260507a" />
    <link rel="stylesheet" href="assets/css/ancestralidades.css?v=20260430" />
    <link rel="stylesheet" href="assets/css/origens.css?v=20260513b" />
    <link rel="stylesheet" href="assets/css/divindades.css?v=20260430j" />
    <link rel="stylesheet" href="assets/css/ancestralidade-picker.css?v=20260513c" />
    <link rel="stylesheet" href="assets/css/transitions.css?v=20260508u" />
</head>
<body class="ficha-page">
    <script src="assets/js/transitions.js?v=20260508u"></script>

    <main class="page-wrapper">

        <header class="top-actions">
            <div class="top-actions-titulo">
                <a href="index.php" class="brand-menu-link" title="Voltar ao menu" aria-label="Voltar ao menu">
                    <img src="assets/img/branding/pindorama-logo-nova.png" alt="Logo do Pindorama RPG" />
                </a>
                <div>
                    <h1>Ficha Pindorama</h1>
                    <p>Cadastro dinâmico de personagens</p>
                </div>
            </div>

            <div class="actions">
                <button type="button" id="exportarPdfBtn">Exportar PDF</button>
                <button type="button" id="novaFichaBtn">Nova ficha</button>
                <button type="submit" form="fichaForm" class="primary">Salvar ficha</button>
            </div>
        </header>

        <section class="saved-sheets-panel">
            <label for="fichasSalvas">Fichas salvas</label>
            <div class="saved-row">
                <input type="hidden" id="fichasSalvas" value="" />
                <button type="button" id="abrirFichasSalvasBtn" class="saved-picker-trigger">
                    Escolher ficha salva
                </button>
                <button type="button" id="carregarFichaBtn">Carregar</button>
            </div>
        </section>

        <div class="sheet-modal-backdrop" id="fichasSalvasModal" hidden>
            <div class="sheet-modal sheet-list-modal" role="dialog" aria-modal="true" aria-labelledby="fichasSalvasTitulo">
                <header class="sheet-modal-header">
                    <div>
                        <h2 id="fichasSalvasTitulo">Fichas salvas</h2>
                        <p>Escolha um personagem para carregar.</p>
                    </div>
                    <button type="button" id="fecharFichasSalvasBtn" aria-label="Fechar">&times;</button>
                </header>
                <div class="sheet-list" id="fichasSalvasLista">
                    <p class="sheet-list-empty">Carregando fichas...</p>
                </div>
            </div>
        </div>

        <form id="fichaForm" class="sheet" method="post" action="salvar-ficha.php" enctype="multipart/form-data">

            <input type="hidden" name="id" id="fichaId" />
            <input type="hidden" name="imagem_atual" id="imagemAtual" />
            <input type="hidden" name="personagem_imagem_ajuste" id="personagemImagemAjuste" value='{"scale":1,"x":0,"y":0}' />
            <input type="hidden" name="remover_personagem_imagem" id="removerPersonagemImagem" value="0" />
            <input type="hidden" name="token_imagem_atual" id="tokenImagemAtual" />
            <input type="hidden" name="personagem_token_imagem_ajuste" id="personagemTokenImagemAjuste" value='{"scale":1,"x":0,"y":0}' />
            <input type="hidden" name="remover_personagem_token_imagem" id="removerPersonagemTokenImagem" value="0" />
            <input type="hidden" name="classes_personagem" id="classesPersonagemJson" />
            <input type="hidden" name="poderes" id="poderesJson" />
            <input type="hidden" name="origem_beneficios" id="origemBeneficiosJson" />

            <section class="identity-top">

                <div class="panel character-card no-title-panel" id="characterCard">
                    <div class="character-preview-box" id="characterPreviewBox">
                        <img id="characterPreview" src="" alt="Imagem do personagem">
                        <span class="character-empty">Sem imagem</span>
                    </div>

                    <div class="image-actions" id="imageActions">
                        <button type="button" id="btnCarregarImagem">Carregar</button>
                        <button type="button" id="btnEditarImagem">Editar</button>
                        <button type="button" id="btnRemoverImagem">Remover</button>
                    </div>

                    <div class="character-image-editor" id="characterImageEditor" aria-label="Ajustar imagem do personagem">
                        <div class="character-token-preview" data-adjust-target="token">
                            <span>Token no campo</span>
                            <div class="character-token-frame">
                                <img id="characterTokenPreview" src="" alt="">
                                <span class="character-token-empty">Sem token</span>
                            </div>
                        </div>
                        <div class="character-token-actions">
                            <button type="button" id="btnCarregarTokenImagem">Carregar token</button>
                            <button type="button" id="btnRemoverTokenImagem">Remover token</button>
                        </div>
                        <small class="character-token-hint">Se vazio, usa a foto principal recortada.</small>
                    </div>

                    <input
                        type="file"
                        id="personagemImagemInput"
                        name="personagem_imagem_file"
                        accept="image/*"
                        hidden
                    >
                    <input
                        type="file"
                        id="personagemTokenImagemInput"
                        name="personagem_token_imagem_file"
                        accept="image/*"
                        hidden
                    >
                </div>

                <section class="panel identity-fields-panel">
                    <div class="identity-fields-grid">
                        <div class="field wide">
                            <label>Participante</label>
                            <input type="text" name="participante" />
                        </div>

                        <div class="field">
                            <label>Personagem</label>
                            <input type="text" name="personagem" />
                        </div>

                        <div class="field">
                            <label>Ancestralidade</label>
                            <select name="ancestralidade" id="ancestralidadeSelect">
                                <option value="">Selecione uma ancestralidade</option>
                                <?php foreach ($ancestralidadesFicha as $ancestralidade): ?>
                                    <option value="<?= htmlspecialchars($ancestralidade['nome']) ?>">
                                        <?= htmlspecialchars($ancestralidade['nome']) ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>

                        <div class="field">
                            <label for="origemSelect">Origem</label>
                            <select name="origem" id="origemSelect">
                                <option value="">Selecione uma origem</option>
                                <?php foreach ($origensFicha as $o): ?>
                                    <option value="<?= htmlspecialchars($o['id']) ?>">
                                        <?= htmlspecialchars($o['nome']) ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>

                        <div class="field">
                            <label for="classeSelect">Classe</label>

                            <select name="classe" id="classeSelect">
                                <option value="">Selecione uma classe</option>
                                <option value="Arcanista" data-classe-id="arcanista">Arcanista</option>
                                <option value="Artífice" data-classe-id="artifice">Artífice</option>
                                <option value="Brincante" data-classe-id="brincante">Brincante</option>
                                <option value="Caçador" data-classe-id="cacador">Caçador</option>
                                <option value="Cangaceiro" data-classe-id="cangaceiro">Cangaceiro</option>
                                <option value="Fanfarrão" data-classe-id="fanfarrao">Fanfarrão</option>
                                <option value="Feiticeiro" data-classe-id="feiticeiro">Feiticeiro</option>
                                <option value="Guerreiro" data-classe-id="guerreiro">Guerreiro</option>
                                <option value="Lutador" data-classe-id="lutador">Lutador</option>
                                <option value="Malandro" data-classe-id="malandro">Malandro</option>
                                <option value="Rústico" data-classe-id="rustico">Rústico</option>
                                <option value="Sacerdote" data-classe-id="sacerdote">Sacerdote</option>
                                <option value="Inquisidor" data-classe-id="inquisidor">Inquisidor</option>
                                <option value="Xamã" data-classe-id="xama">Xamã</option>
                            </select>
                        </div>

                        <div class="field small">
                            <label>Nível</label>
                            <input type="number" name="nivel" id="nivelInput" value="1" min="1" />
                        </div>

                        <div class="field small">
                            <label>PP</label>
                            <input type="number" name="pp_atuais" id="ppAtuais" value="0" min="0" />
                            <input type="hidden" name="pp_total" id="ppTotal" value="0" />
                        </div>

                        <div class="field">
                            <label for="divindadeSelect">Divindade</label>
                            <select name="divindade" id="divindadeSelect">
                                <option value="">Sem devoção</option>
                                <?php foreach ($divindadesFicha as $d): ?>
                                    <option value="<?= htmlspecialchars($d['id']) ?>">
                                        <?= htmlspecialchars($d['nome']) ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                    </div>
                    <div class="field wide ancestralidade-ficha-panel">
                        <label>Tra&ccedil;os Ancestrais</label>
                        <div class="ancestralidade-empty" id="ancestralidadeTracosEmpty">
                            Selecione uma ancestralidade para ver seus tra&ccedil;os.
                        </div>
                        <div class="ancestralidade-tags" id="ancestralidadeTracos"></div>
                    </div>

                    <!-- Resumo dos Benefícios de Origem já escolhidos.
                         Botão "Editar" abre o modal de Origem (onde a
                         seleção dos benefícios agora acontece). -->
                    <div class="field wide ancestralidade-ficha-panel origem-resumo-panel">
                        <label>
                            Benef&iacute;cios de Origem
                            <button type="button" class="resumo-editar-btn" id="origemEditarBtn"
                                    aria-label="Editar benefícios da origem">&#9998;</button>
                        </label>
                        <div class="ancestralidade-empty" id="origemBeneficiosResumoEmpty">
                            Nenhum benef&iacute;cio escolhido.
                        </div>
                        <div class="ancestralidade-tags" id="origemBeneficiosResumo"></div>
                    </div>

                    <!-- Resumo das Devoções escolhidas. Botão "Editar"
                         abre o modal de Divindade. -->
                    <div class="field wide ancestralidade-ficha-panel divindade-resumo-panel">
                        <label>
                            Devo&ccedil;&otilde;es
                            <button type="button" class="resumo-editar-btn" id="divindadeEditarBtn"
                                    aria-label="Editar devoções">&#9998;</button>
                        </label>
                        <div class="ancestralidade-empty" id="divindadeDevocoesResumoEmpty">
                            Nenhuma devo&ccedil;&atilde;o escolhida.
                        </div>
                        <div class="ancestralidade-tags" id="divindadeDevocoesResumo"></div>
                    </div>
                </section>

            </section>

            <section class="main-grid">

                <div class="left-column">

                    <section class="panel attributes-panel attributes-panel-recolhido" id="atributosPanel">
                        <div class="panel-title">
                            Atributos
                            <button type="button" class="poderes-ver-todos-btn painel-toggle-seta" id="atributosRecolherBtn" aria-expanded="false" aria-label="Expandir seção" aria-controls="atributosConteudo">
                                <span class="painel-toggle-seta-icone" aria-hidden="true">&#9662;</span>
                            </button>
                        </div>

                        <div class="attributes-section" id="atributosConteudo">
                            <div class="attributes-row">
                                <div class="attribute-card">
                                    <label>For</label>
                                    <input type="number" name="forca" value="0" />
                                </div>

                                <div class="attribute-card">
                                    <label>Des</label>
                                    <input type="number" name="destreza" value="0" />
                                </div>

                                <div class="attribute-card">
                                    <label>Con</label>
                                    <input type="number" name="constituicao" value="0" />
                                </div>

                                <div class="attribute-card">
                                    <label>Int</label>
                                    <input type="number" name="inteligencia" value="0" />
                                </div>

                                <div class="attribute-card">
                                    <label>Sab</label>
                                    <input type="number" name="sabedoria" value="0" />
                                </div>

                                <div class="attribute-card">
                                    <label>Car</label>
                                    <input type="number" name="carisma" value="0" />
                                </div>
                            </div>

                            <button
                                type="button"
                                class="atributos-d20-btn"
                                id="atributosDistribuirBtn"
                                aria-label="Distribuir atributos"
                                title="Clique no dado para distribuir os atributos"
                            >
                                <svg class="d20-icon" viewBox="0 0 100 100" aria-hidden="true">
                                    <polygon points="50,5 90,30 90,70 50,95 10,70 10,30" fill="currentColor" stroke="#fff" stroke-width="2"/>
                                    <polygon points="50,5 90,30 50,50 10,30" fill="rgba(255,255,255,0.18)"/>
                                    <polygon points="90,30 90,70 50,50" fill="rgba(0,0,0,0.12)"/>
                                    <text x="50" y="62" text-anchor="middle" font-size="32" font-weight="900" fill="#fff" font-family="serif">20</text>
                                </svg>
                                <span class="atributos-d20-legenda">Clique para gerar atributos</span>
                            </button>
                        </div>
                    </section>

                    <section class="vitals-grid">

                        <section class="panel resource-panel pv-panel">
                            <div class="panel-title">Pontos de Vida</div>

                            <div class="resource-total-row">
                                <label>PV Total</label>
                                <input type="number" name="pv_total" id="pvTotal" value="0" min="0" />
                            </div>

                            <div class="resource-current-block">
                                <label>PV Atuais</label>

                                <div class="resource-controls">
                                    <button type="button" class="adjust-btn" data-resource="pv" data-action="minus">-</button>

                                    <div class="resource-bar-shell">
                                        <div class="resource-bar-fill pv-fill" id="pvFill"></div>
                                        <span class="resource-bar-text" id="pvLabel">0 / 0</span>
                                    </div>

                                    <button type="button" class="adjust-btn" data-resource="pv" data-action="plus">+</button>
                                </div>

                                <input type="hidden" name="pv_atuais" id="pvAtuais" value="0" />
                            </div>
                        </section>

                        <section class="panel resource-panel pm-panel">
                            <div class="panel-title">Pontos de Mana</div>

                            <div class="resource-total-row">
                                <label>PM Total</label>
                                <input type="number" name="pm_total" id="pmTotal" value="0" min="0" />
                            </div>

                            <div class="resource-current-block">
                                <label>PM Atuais</label>

                                <div class="resource-controls">
                                    <button type="button" class="adjust-btn" data-resource="pm" data-action="minus">-</button>

                                    <div class="resource-bar-shell">
                                        <div class="resource-bar-fill pm-fill" id="pmFill"></div>
                                        <span class="resource-bar-text" id="pmLabel">0 / 0</span>
                                    </div>

                                    <button type="button" class="adjust-btn" data-resource="pm" data-action="plus">+</button>
                                </div>

                                <input type="hidden" name="pm_atuais" id="pmAtuais" value="0" />
                            </div>
                        </section>

                    </section>

                    <section class="panel attacks-panel">
                        <div class="panel-title">Ataques</div>

                        <div class="table-like attacks-header">
                            <span>Nome</span>
                            <span>Teste</span>
                            <span>Dano</span>
                            <span>Crítico</span>
                            <span>Alcance</span>
                            <span>Tipo</span>
                            <span>Ações</span>
                            <span></span>
                        </div>

                        <div id="ataquesContainer"></div>

                        <button type="button" class="add-btn" id="addAtaqueBtn">
                            + Adicionar ataque
                        </button>
                    </section>

                    <section class="defense-grid">

                        <div class="panel defense-panel">
                            <div class="panel-title">Defesa</div>

                            <div class="defense-base">
                                <span class="defense-base-label">Base</span>
                                <span class="defense-base-value">10</span>
                            </div>

                            <div class="defense-modifiers">
                                <div class="defense-modifier">
                                    <span class="defense-symbol">+</span>
                                    <label for="defesa_destreza">Destreza</label>
                                    <input type="number" id="defesa_destreza" name="defesa_destreza" value="0" />
                                </div>
                                <div class="defense-modifier">
                                    <span class="defense-symbol">+</span>
                                    <label for="defesa_armadura">Bônus de Armadura</label>
                                    <input type="number" id="defesa_armadura" name="defesa_armadura" value="0" />
                                </div>
                                <div class="defense-modifier">
                                    <span class="defense-symbol">+</span>
                                    <label for="defesa_escudo">Bônus de Escudo</label>
                                    <input type="number" id="defesa_escudo" name="defesa_escudo" value="0" />
                                </div>
                                <div class="defense-modifier">
                                    <span class="defense-symbol">+</span>
                                    <label for="defesa_outros">Outros</label>
                                    <input type="number" id="defesa_outros" name="defesa_outros" value="0" />
                                </div>
                            </div>

                            <div class="defense-total-block">
                                <label for="defesa_total">Total</label>
                                <input type="number" id="defesa_total" name="defesa_total" value="10" readonly />
                            </div>
                        </div>

                        <div class="panel">
                            <div class="panel-title">Proficiências</div>
                            <textarea
                                name="proficiencias"
                                id="proficiencias"
                            ></textarea>
                        </div>

                    </section>

                    <section class="panel armor-panel">
                        <div class="panel-title">Armadura & Escudo</div>

                        <div class="armor-slots">
                            <div class="armor-slot" data-armor-slot="armadura">
                                <label>Armadura</label>
                                <input
                                    type="text"
                                    class="armor-search"
                                    data-armor-search="armadura"
                                    placeholder="Buscar armadura..."
                                    autocomplete="off"
                                />
                                <div class="armor-stats">
                                    <span><span class="armor-stat-label">Defesa</span><strong data-armor-stat="bonus">+0</strong></span>
                                    <span><span class="armor-stat-label">Penalidade</span><strong data-armor-stat="penalidade">0</strong></span>
                                    <span><span class="armor-stat-label">Espaços</span><strong data-armor-stat="espacos">0</strong></span>
                                </div>
                            </div>

                            <div class="armor-slot" data-armor-slot="escudo">
                                <label>Escudo</label>
                                <input
                                    type="text"
                                    class="armor-search"
                                    data-armor-search="escudo"
                                    placeholder="Buscar escudo..."
                                    autocomplete="off"
                                />
                                <div class="armor-stats">
                                    <span><span class="armor-stat-label">Defesa</span><strong data-armor-stat="bonus">+0</strong></span>
                                    <span><span class="armor-stat-label">Penalidade</span><strong data-armor-stat="penalidade">0</strong></span>
                                    <span><span class="armor-stat-label">Espaços</span><strong data-armor-stat="espacos">0</strong></span>
                                </div>
                            </div>
                        </div>

                        <textarea name="armadura_escudo" placeholder="Anotações sobre armadura, escudo ou modificações..."></textarea>
                    </section>

                    <section class="panel magias-ficha-panel magias-panel-recolhido" id="magiasFichaPanel">
                        <input type="hidden" name="habilidades_magias" id="magiasSelecionadasJson" value="[]" />
                        <div class="panel-title">
                            Magias
                            <div class="magias-panel-actions">
                                <span class="magias-contador" id="magiasContador">0 / 0</span>
                                <button type="button" class="poderes-ver-todos-btn painel-toggle-seta" id="magiasRecolherBtn" aria-expanded="false" aria-label="Expandir seção" aria-controls="magiasSelecionadasLista magiasResumoFicha">
                                    <span class="painel-toggle-seta-icone" aria-hidden="true">&#9662;</span>
                                </button>
                            </div>
                        </div>

                        <div class="magias-selecionadas" id="magiasSelecionadasLista"></div>

                        <div class="magias-resumo" id="magiasResumoFicha">
                            Selecione uma classe conjuradora para ver as magias disponiveis.
                        </div>

                        <div class="magias-filtros-ficha">
                            <input type="search" id="magiasBuscaFicha" placeholder="Buscar magia..." />
                            <select id="magiasCirculoFicha">
                                <option value="">Todos os circulos</option>
                            </select>
                        </div>

                        <details class="magias-disponiveis-details" open>
                            <summary>Magias disponiveis para escolha</summary>
                            <div class="magias-disponiveis-lista" id="magiasDisponiveisLista"></div>
                        </details>
                    </section>

                    <!-- Host oculto da seção rica de Benefícios da Origem.
                         Quando o modal de Origem abre, o entity-picker move
                         #origemPanel para dentro de .anc-picker-extras; ao
                         fechar, devolve para cá. Sem este host, #origemPanel
                         desapareceria do DOM e perderia estado. -->
                    <div id="origemPanelHost" hidden>
                    <section class="panel origem-panel origem-panel-recolhido" id="origemPanel">
                        <div class="panel-title">
                            Benefícios da Origem
                            <div class="origem-panel-actions">
                                <span class="origem-contador" id="origemContador">0 / 2</span>
                                <button type="button" class="poderes-ver-todos-btn painel-toggle-seta" id="origemRecolherBtn" aria-expanded="false" aria-label="Expandir seção" aria-controls="origemEmpty origemConteudo">
                                    <span class="painel-toggle-seta-icone" aria-hidden="true">&#9662;</span>
                                </button>
                            </div>
                        </div>

                        <div class="origem-escolhidos-topo">
                            <span class="poderes-bloco-label">Escolhidos:</span>
                            <div class="origem-escolhidos-lista" id="origemEscolhidosLista"></div>
                        </div>

                        <div class="origem-empty" id="origemEmpty">
                            Selecione uma origem acima para ver os benefícios disponíveis.
                        </div>

                        <div class="origem-conteudo" id="origemConteudo" hidden>
                            <header class="origem-header">
                                <h4 id="origemNome"></h4>
                                <div class="origem-atributos" id="origemAtributos"></div>
                            </header>

                            <div class="origem-descricao" id="origemDescricao"></div>

                            <div class="origem-secao">
                                <strong>Itens iniciais:</strong>
                                <ul id="origemItens"></ul>
                            </div>

                            <div class="origem-observacao" id="origemObservacao" hidden></div>

                            <div class="origem-secao origem-secao-pericias">
                                <details class="origem-opcoes-details" open>
                                    <summary>Perícias disponíveis</summary>
                                    <div class="origem-pericias-lista" id="origemPericiasLista"></div>
                                </details>
                            </div>

                            <div class="origem-secao origem-secao-poderes">
                                <details class="origem-opcoes-details" open>
                                    <summary>Poderes disponíveis</summary>
                                    <div class="origem-poderes-lista" id="origemPoderesLista"></div>
                                </details>
                            </div>
                        </div>
                    </section>
                    </div><!-- /#origemPanelHost -->

                    <!-- Host oculto da seção rica de Devoção, mesmo padrão.
                         A "aba Devoção" (panel-title + botão recolher) foi
                         removida: a divindade selecionada exibe direto
                         seus dados na tela principal do picker, sem
                         camada extra de accordion. -->
                    <div id="divindadePanelHost" hidden>
                    <section class="panel divindade-panel" id="divindadePanel">
                        <div class="poderes-adquiridos-topo">
                            <span class="poderes-bloco-label">Adquiridos:</span>
                            <div class="poderes-adquiridos-lista" id="divindadeAdquiridos"></div>
                        </div>

                        <div class="divindade-empty" id="divindadeEmpty">
                            Selecione uma divindade no campo acima para ver os poderes concedidos e as obrigações da devoção.
                        </div>

                        <div class="divindade-conteudo" id="divindadeConteudo" hidden>
                            <header class="divindade-header">
                                <div>
                                    <h4 id="divindadeNome"></h4>
                                    <span class="divindade-saudacao" id="divindadeSaudacao"></span>
                                </div>
                                <span class="divindade-energia" id="divindadeEnergiaTag"></span>
                            </header>

                            <p class="divindade-descricao" id="divindadeDescricao"></p>

                            <div class="divindade-grid">
                                <div class="divindade-info-item">
                                    <strong>Símbolo:</strong>
                                    <span id="divindadeSimbolo"></span>
                                </div>
                                <div class="divindade-info-item">
                                    <strong>Arma preferida:</strong>
                                    <span id="divindadeArma"></span>
                                </div>
                                <div class="divindade-info-item">
                                    <strong>Devotos:</strong>
                                    <span id="divindadeDevotos"></span>
                                </div>
                            </div>

                            <div class="divindade-obrigacoes" id="divindadeObrigacoes"></div>

                            <div class="divindade-poderes-bloco">
                                <strong class="divindade-poderes-label">
                                    Poderes Divinos concedidos
                                    <span class="divindade-poderes-hint" id="divindadePoderesHint"></span>
                                    <span class="divindade-limite-info" id="divindadeLimiteInfo"></span>
                                </strong>
                                <div class="divindade-poderes-lista" id="divindadePoderesLista"></div>
                            </div>
                        </div>
                    </section>
                    </div><!-- /#divindadePanelHost -->

                    <section class="panel poderes-panel poderes-panel-recolhido" id="poderesPanel">
                        <div class="panel-title">
                            Poderes de Classe
                            <button type="button" class="poderes-ver-todos-btn painel-toggle-seta" id="poderesClasseRecolherBtn" aria-expanded="false" aria-label="Expandir seção" aria-controls="poderesEmpty poderesGrupos">
                                <span class="painel-toggle-seta-icone" aria-hidden="true">&#9662;</span>
                            </button>
                        </div>

                        <div class="poderes-adquiridos-topo">
                            <span class="poderes-bloco-label">Adquiridos:</span>
                            <div class="poderes-adquiridos-lista" id="poderesClasseSelecionados"></div>
                        </div>

                        <div class="poderes-empty" id="poderesEmpty">
                            Selecione uma classe e nível 2+ para ver poderes disponíveis.
                        </div>

                        <div class="poderes-grupos" id="poderesGrupos"></div>
                    </section>

                    <section class="panel poderes-panel poderes-gerais-panel poderes-panel-recolhido" id="poderesGeraisPanel">
                        <div class="panel-title">
                            Poderes
                            <a href="poderes.php" class="poderes-ver-todos-btn">Ver página</a>
                            <button type="button" class="poderes-ver-todos-btn painel-toggle-seta" id="poderesGeraisRecolherBtn" aria-expanded="false" aria-label="Expandir seção" aria-controls="poderesGeraisEmpty poderesGeraisGrupos">
                                <span class="painel-toggle-seta-icone" aria-hidden="true">&#9662;</span>
                            </button>
                        </div>

                        <div class="poderes-adquiridos-topo">
                            <span class="poderes-bloco-label">Adquiridos:</span>
                            <div class="poderes-adquiridos-lista" id="poderesGeraisSelecionados"></div>
                        </div>

                        <div class="poderes-empty" id="poderesGeraisEmpty">
                            Use PP para adquirir poderes gerais. As listas ficam separadas por categoria.
                        </div>

                        <div class="poderes-grupos poderes-gerais-grupos" id="poderesGeraisGrupos"></div>
                    </section>

                </div>

                <div class="right-column">

                    <section class="panel skills-panel skills-panel-recolhido" id="skillsPanel">
                        <div class="panel-title">
                            Perícias
                            <button type="button" class="poderes-ver-todos-btn painel-toggle-seta" id="skillsRecolherBtn" aria-expanded="false" aria-label="Expandir seção" aria-controls="periciasContainer">
                                <span class="painel-toggle-seta-icone" aria-hidden="true">&#9662;</span>
                            </button>
                        </div>

                        <div class="skills-scroll">
                            <div class="skills-header">
                                <span>Treinada</span>
                                <span>Perícia</span>
                                <span>Total</span>
                                <span>½ Nível</span>
                                <span>Atributo</span>
                                <span>Treino</span>
                                <span>Outros</span>
                            </div>

                            <div id="periciasContainer"></div>
                        </div>
                    </section>

                    <section class="panel equipment-panel">
                        <div class="panel-title">Equipamentos</div>

                        <input type="hidden" name="equipamentos" id="equipamentosJson" />

                        <div class="equipment-summary">
                            <div>
                                <span>Espaços usados</span>
                                <strong id="espacosUsados">0</strong>
                            </div>

                            <div>
                                <span>Limite sem penalidade</span>
                                <strong id="limiteCarga">10</strong>
                            </div>

                            <div>
                                <span>Máximo carregável</span>
                                <strong id="limiteMaximoCarga">20</strong>
                            </div>
                        </div>

                        <div class="load-status" id="estadoCarga">
                            Carga normal.
                        </div>

                        <div class="equipment-table-header">
                            <span>Item</span>
                            <span>Qtd.</span>
                            <span>Espaços</span>
                            <span>Total</span>
                            <span></span>
                        </div>

                        <div id="equipamentosContainer"></div>

                        <button type="button" class="add-btn" id="addEquipamentoBtn">
                            + Adicionar equipamento
                        </button>

                        <div class="money-load-row">
                            <label>M$</label>
                            <input type="text" name="dinheiro" />

                            <label>Carga</label>
                            <input type="text" name="carga" id="cargaResumo" readonly />
                        </div>

                        <p class="equipment-rule-note">
                            Se ultrapassar o limite, o personagem fica sobrecarregado: penalidade de armadura -5 e deslocamento -3m.
                            Não é possível carregar mais que o dobro do limite.
                        </p>
                    </section>

                </div>

            </section>

        </form>

        <div class="sheet-modal-backdrop" id="fichaNoticeModal" hidden>
            <div class="sheet-modal sheet-notice-modal" role="dialog" aria-modal="true" aria-labelledby="fichaNoticeTitulo">
                <header class="sheet-modal-header">
                    <div>
                        <h2 id="fichaNoticeTitulo">Ficha salva</h2>
                        <p id="fichaNoticeTexto">Tudo certo.</p>
                    </div>
                    <button type="button" id="fichaNoticeFechar" aria-label="Fechar">&times;</button>
                </header>
                <footer class="sheet-modal-footer">
                    <button type="button" id="fichaNoticeOk" class="primary">Fechar</button>
                </footer>
            </div>
        </div>

        <div class="poder-modal-backdrop" id="poderModal" hidden>
            <div class="poder-modal" role="dialog" aria-modal="true" aria-labelledby="poderModalTitulo">
                <header class="poder-modal-header">
                    <h3 id="poderModalTitulo"></h3>
                    <button type="button" class="poder-modal-fechar" id="poderModalFechar" aria-label="Fechar">&times;</button>
                </header>
                <div class="poder-modal-body" id="poderModalBody"></div>
                <footer class="poder-modal-footer">
                    <button type="button" id="poderModalRemover" class="poder-modal-remover">Remover poder</button>
                    <button type="button" id="poderModalAdquirir" class="primary">Adquirir poder</button>
                </footer>
            </div>
        </div>

        <div class="poder-modal-backdrop" id="poderesTodosModal" hidden>
            <div class="poder-modal poder-modal-grande" role="dialog" aria-modal="true" aria-labelledby="poderesTodosTitulo">
                <header class="poder-modal-header">
                    <h3 id="poderesTodosTitulo">Todos os poderes</h3>
                    <button type="button" class="poder-modal-fechar" id="poderesTodosFechar" aria-label="Fechar">&times;</button>
                </header>
                <div class="poder-modal-body" id="poderesTodosBody"></div>
            </div>
        </div>

        <div class="poder-modal-backdrop" id="origemModal" hidden>
            <div class="poder-modal" role="dialog" aria-modal="true" aria-labelledby="origemModalTitulo">
                <header class="poder-modal-header">
                    <h3 id="origemModalTitulo"></h3>
                    <button type="button" class="poder-modal-fechar" id="origemModalFechar" aria-label="Fechar">&times;</button>
                </header>
                <div class="poder-modal-body" id="origemModalBody"></div>
                <footer class="poder-modal-footer">
                    <button type="button" id="origemModalRemover" class="poder-modal-remover">Remover escolha</button>
                    <button type="button" id="origemModalAdquirir" class="primary">Escolher como benefício</button>
                </footer>
            </div>
        </div>

        <div class="poder-modal-backdrop" id="ancestralidadeTracoModal" hidden>
            <div class="poder-modal" role="dialog" aria-modal="true" aria-labelledby="ancestralidadeTracoTitulo">
                <header class="poder-modal-header">
                    <h3 id="ancestralidadeTracoTitulo"></h3>
                    <button type="button" class="poder-modal-fechar" id="ancestralidadeTracoFechar" aria-label="Fechar">&times;</button>
                </header>
                <div class="poder-modal-body" id="ancestralidadeTracoBody"></div>
            </div>
        </div>

        <div class="poder-modal-backdrop" id="magiaFichaModal" hidden>
            <div class="poder-modal poder-modal-grande" role="dialog" aria-modal="true" aria-labelledby="magiaFichaModalTitulo">
                <header class="poder-modal-header">
                    <h3 id="magiaFichaModalTitulo"></h3>
                    <button type="button" class="poder-modal-fechar" id="magiaFichaModalFechar" aria-label="Fechar">&times;</button>
                </header>
                <div class="poder-modal-body" id="magiaFichaModalBody"></div>
                <footer class="poder-modal-footer">
                    <button type="button" id="magiaFichaModalRemover" class="poder-modal-remover">Remover magia</button>
                    <button type="button" id="magiaFichaModalEscolher" class="primary">Escolher magia</button>
                </footer>
            </div>
        </div>

        <!-- Modal: distribuição de atributos (pontos / rolagens) -->
        <div class="poder-modal-backdrop" id="atributosModal" hidden>
            <div class="poder-modal poder-modal-grande" role="dialog" aria-modal="true" aria-labelledby="atributosModalTitulo">
                <header class="poder-modal-header">
                    <h3 id="atributosModalTitulo">Distribuição de Atributos</h3>
                    <button type="button" class="poder-modal-fechar" id="atributosModalFechar" aria-label="Fechar">&times;</button>
                </header>
                <div class="poder-modal-body">
                    <div class="atributos-tabs">
                        <button type="button" class="atributos-tab ativa" data-tab="pontos">Pontos</button>
                        <button type="button" class="atributos-tab" data-tab="rolagens">Rolagens</button>
                    </div>

                    <div class="atributos-tab-conteudo" data-tab-conteudo="pontos">
                        <p class="atributos-explicacao">
                            Você começa com todos os atributos em 0 e recebe <strong>10 pontos</strong>
                            para distribuir. Reduzir um atributo para −1 dá 1 ponto extra.
                        </p>
                        <div class="atributos-saldo">
                            Pontos restantes: <strong id="atributosSaldo">10</strong> / 10
                        </div>
                        <div class="atributos-tabela-custo">
                            <span>−1 → −1pt</span><span>0 → 0pt</span><span>+1 → 1pt</span>
                            <span>+2 → 2pts</span><span>+3 → 4pts</span><span>+4 → 7pts</span>
                        </div>
                        <div class="atributos-controles" id="atributosControles"></div>
                        <div class="atributos-acoes">
                            <button type="button" class="atributos-resetar" id="atributosResetarPontos">Zerar</button>
                            <button type="button" class="primary" id="atributosAplicarPontos">Aplicar à ficha</button>
                        </div>
                    </div>

                    <div class="atributos-tab-conteudo" data-tab-conteudo="rolagens" hidden>
                        <p class="atributos-explicacao">
                            Role 4d6, descarte o menor e some os outros três. Repita 6 vezes.
                            Os totais são convertidos em modificadores: 6− = −1, 7-9 = 0, 10-13 = +1,
                            14-15 = +2, 16-17 = +3, 18+ = +4. Se a soma final for menor que 6,
                            o menor é re-rolado.
                        </p>
                        <button type="button" class="atributos-rolar-btn" id="atributosRolarBtn">🎲 Rolar 6 atributos</button>
                        <div class="atributos-rolagens" id="atributosRolagens"></div>
                        <div class="atributos-distribuir" id="atributosDistribuir" hidden>
                            <p class="atributos-explicacao">
                                Atribua cada valor rolado a um atributo. Clique no atributo para alternar entre os valores disponíveis.
                            </p>
                            <div class="atributos-controles" id="atributosControlesRolagem"></div>
                            <div class="atributos-acoes">
                                <button type="button" class="primary" id="atributosAplicarRolagem">Aplicar à ficha</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </main>

    <script src="assets/js/ficha.js?v=20260509b"></script>
    <script src="assets/js/atributos.js?v=20260501u"></script>
    <script src="assets/js/poderes.js?v=20260430j"></script>
    <script src="assets/js/ancestralidades-ficha.js?v=20260508s"></script>
    <script src="assets/js/origens.js?v=20260430x"></script>
    <script src="assets/js/divindades.js?v=20260430j"></script>
    <script src="assets/js/entity-picker.js?v=20260509a"></script>

    <script>
    /* Auto-carrega ficha se ?id=N estiver na URL (vem da página fichas.php) */
    (function () {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        if (!id) return;

        async function carregar() {
            try {
                const res = await fetch('buscar-ficha.php?id=' + encodeURIComponent(id));
                const result = await res.json();
                if (!result.success) {
                    console.warn('[ficha?id]', result.message);
                    return;
                }
                if (typeof window.preencherFicha === 'function') {
                    window.preencherFicha(result.ficha);
                }
            } catch (err) {
                console.error('[ficha?id] erro ao carregar', err);
            }
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => setTimeout(carregar, 250));
        } else {
            setTimeout(carregar, 250);
        }
    })();
    </script>
</body>
</html>
