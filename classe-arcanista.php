<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Arcanista - Pindorama RPG</title>

    <link rel="stylesheet" href="assets/css/ficha.css" />
    <link rel="stylesheet" href="assets/css/classes.css?v=20260513a" />
</head>

<body>
    <main class="page-wrapper classes-page">

        <header class="top-actions classes-topbar">
            <div>
                <h1>Arcanista</h1>
                <p>Classe dedicada ao domínio do conhecimento oculto, da magia arcana e dos mistérios da realidade.</p>
            </div>

            <div class="actions">
                <a class="system-link-btn" href="index.php">Menu</a>
                <a class="system-link-btn" href="classes.php">Classes</a>
                <a class="system-link-btn" href="ficha.php">Ficha</a>
            </div>
        </header>

        <?php
            $cb_class_slug = 'arcanista';
            $cb_class_name = 'Arcanista';
            include __DIR__ . '/includes/class-hero.php';
        ?>

        <section class="classes-layout">

            <aside class="classes-sidebar panel" id="classesSidebar">
                <div class="sidebar-mobile-head">
                    <div class="panel-title">Navegação</div>
                </div>

                <div class="sidebar-content" id="mobileSidebarContent">
                    <input
                        type="search"
                        id="classesSearch"
                        placeholder="Buscar nesta classe..."
                        class="classes-search"
                    />

                    <nav class="classes-toc" id="classesToc">
                        <a class="toc-link toc-level-2" href="#descricao">Descrição</a>
                        <a class="toc-link toc-level-2" href="#caracteristicas">Características de Classe</a>
                        <a class="toc-link toc-level-2" href="#habilidades">Habilidades de Classe</a>
                        <a class="toc-link toc-level-2" href="#tabela-arcanista">Tabela 1-11: O Arcanista</a>
                        <a class="toc-link toc-level-2" href="#poderes">Poderes de Arcanista</a>
                    </nav>
                </div>
            </aside>

            <article class="sheet classes-content" id="classesContent">

                <section id="descricao" class="content-section">
                    <h2>Arcanista</h2>

                    <p>
                        Em um mundo onde o conhecimento é vasto, uma parcela oculta escapa ao alcance das grandes massas.
                        Um saber restrito, habilmente tecido, capaz de ser ensinado, entendido e manipulado por poucos,
                        segredos capazes de moldar a realidade por meio de intenção, palavras, gestos e mentalizações.
                    </p>

                    <p>
                        Este é o conhecimento que diferencia os arcanistas dos outros estudiosos, seres imersos em pesquisas
                        incessantes, explorando as grandiosas bibliotecas das Academias Federais de Magia e Ciência ou
                        lançando-se em expedições aos lugares mais ermos, em busca de vestígios de sociedades antigas e seus segredos.
                    </p>

                    <p>
                        Através deste conhecimento oculto, os arcanistas desvendam um vasto repertório de magias.
                        Explosões de fogo, lanças congelantes, névoas ácidas, ilusões sutis e manipulação mental são apenas
                        alguns dos efeitos que podem ser conjurados.
                    </p>

                    <p>
                        Além disso, eles têm o poder de evocar criaturas de planos de existência distantes, vislumbrar o futuro
                        e até transformar inimigos caídos em zumbis. As magias mais poderosas destes seres transcendem,
                        transmutando substâncias, evocando cataclismas ou abrindo portais para mundos desconhecidos.
                    </p>

                    <p>
                        Conjurar uma magia básica pode exigir sintonia com selos específicos, a evocação do verdadeiro nome da magia,
                        gestos desenhados no ar ou até mesmo o uso de materiais exóticos. Contudo, o domínio de feitiços mais poderosos
                        é uma jornada que se estende por anos de aprendizado e o preço a se pagar por tal poder é o tempo.
                    </p>

                    <p>
                        A grande maioria dos arcanistas vivem e morrem por seus conhecimentos arcanos. Para eles, todo o resto é secundário.
                        A aprendizagem de novas magias é um processo contínuo, combinando informações já possuídas, trocando experiências
                        com outros arcanistas, consultando tomos e escrituras antigas, ou buscando o conhecimento ancestral em criaturas místicas.
                    </p>
                </section>

                <section id="caracteristicas" class="content-section">
                    <h2>Características de Classe</h2>

                    <p><strong>Pontos de Vida.</strong> Um arcanista começa com 8 pontos de vida (+ Constituição) e ganha 2 PV (+ Constituição) por nível.</p>

                    <p><strong>Pontos de Mana.</strong> 8 PM por nível.</p>

                    <p>
                        <strong>Perícias.</strong> Misticismo (Int) e Vontade (Sab), mais 2 à sua escolha entre Conhecimento (Int),
                        Diplomacia (Car), Enganação (Car), Guerra (Int), Iniciativa (Des), Intimidação (Car), Intuição (Sab),
                        Investigação (Int), Nobreza (Int), Ofício (Int) e Percepção (Sab).
                    </p>

                    <p><strong>Proficiências.</strong> Nenhuma.</p>
                </section>

                <section id="habilidades" class="content-section">
                    <h2>Habilidades de Classe</h2>

                    <p>
                        <strong>Conhecimento Místico.</strong> Você lança magias através de estudo e memorização de fórmulas arcanas.
                        Você só pode lançar magias memorizadas; suas outras magias não podem ser lançadas, mesmo que você tenha pontos
                        de mana para tal.
                    </p>

                    <p>
                        Para memorizar magias, você precisa estudar seu grimório por uma hora. Quando faz isso, escolhe metade das magias
                        que conhece. Essas serão suas magias memorizadas. Você pode memorizar magias uma vez por dia.
                    </p>

                    <p>
                        <strong>Magias.</strong> Você pode lançar magias arcanas de 1º círculo. A cada quatro níveis, pode lançar magias
                        de um círculo maior: 2º círculo no 5º nível, 3º círculo no 9º nível e assim por diante.
                    </p>

                    <p>
                        Você começa com quatro magias de 1º círculo. A cada nível, aprende uma magia de qualquer círculo que possa lançar
                        e recebe uma magia extra toda vez que puder lançar magias de um círculo maior. Seu atributo-chave para lançar magias é Inteligência.
                    </p>

                    <p>
                        <strong>Poder de Arcanista.</strong> No 2º nível, e a cada nível seguinte, você escolhe um dos poderes da lista de Arcanista.
                    </p>

                    <p>
                        <strong>Kit Esotérico.</strong> Você começa o jogo com um item superior, ou com um ou mais itens esotéricos,
                        com preço total de até M$ 500.
                    </p>

                    <p>
                        <strong>Simbiose Mística.</strong> No 20º nível, seu domínio das artes arcanas é total.
                        O custo em PM de suas magias arcanas é reduzido à metade, após aplicar aprimoramentos e quaisquer outros efeitos que reduzam custo.
                    </p>
                </section>

                <section id="tabela-arcanista" class="content-section">
                    <h2>Tabela 1-11: O Arcanista</h2>

                    <div class="classes-table-wrap">
                        <table class="classes-table level-table">
                            <thead>
                                <tr>
                                    <th>Nível</th>
                                    <th>Habilidades de Classe</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr><td>1º</td><td>Conhecimento místico, magias, kit esotérico</td></tr>
                                <tr><td>2º</td><td>Poder de arcanista</td></tr>
                                <tr><td>3º</td><td>Poder de arcanista</td></tr>
                                <tr><td>4º</td><td>Poder de arcanista</td></tr>
                                <tr><td>5º</td><td>Magias (2º círculo), poder de arcanista</td></tr>
                                <tr><td>6º</td><td>Poder de arcanista</td></tr>
                                <tr><td>7º</td><td>Poder de arcanista</td></tr>
                                <tr><td>8º</td><td>Poder de arcanista</td></tr>
                                <tr><td>9º</td><td>Magias (3º círculo), poder de arcanista</td></tr>
                                <tr><td>10º</td><td>Poder de arcanista</td></tr>
                                <tr><td>11º</td><td>Poder de arcanista</td></tr>
                                <tr><td>12º</td><td>Poder de arcanista</td></tr>
                                <tr><td>13º</td><td>Magias (4º círculo), poder de arcanista</td></tr>
                                <tr><td>14º</td><td>Poder de arcanista</td></tr>
                                <tr><td>15º</td><td>Poder de arcanista</td></tr>
                                <tr><td>16º</td><td>Poder de arcanista</td></tr>
                                <tr><td>17º</td><td>Magias (5º círculo), poder de arcanista</td></tr>
                                <tr><td>18º</td><td>Poder de arcanista</td></tr>
                                <tr><td>19º</td><td>Poder de arcanista</td></tr>
                                <tr><td>20º</td><td>Poder de arcanista, Sincronicidade</td></tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section id="poderes" class="content-section">
                    <h2>Poderes de Arcanista</h2>

                    <div class="class-power-block">
                        <p><strong>Arcano de Batalha.</strong> Quando lança uma magia, você soma sua inteligência na rolagem de dano.</p>

                        <p><strong>Astúcia Tática.</strong> Você pode usar sua inteligência em vez de Destreza em testes de iniciativa. <strong>Pré-requisito:</strong> treinado em Guerra.</p>

                        <p><strong>Aumento de Atributo.</strong> Você recebe +1 em um atributo. Você pode escolher este poder várias vezes, mas apenas uma vez por patamar para um mesmo atributo.</p>

                        <p><strong>Blindagem Defletora.</strong> Quando você usa a Deflexão Arcana, gera uma energia mágica sobre si mesmo. Até três criaturas de sua escolha que possa ver dentro de 18 metros recebem dano de energia igual à metade do seu nível de arcanista. <strong>Pré-requisito:</strong> 14º nível de arcanista, Deflexão Arcana.</p>

                        <p><strong>Caldeirão do Bruxo.</strong> Você pode criar poções, como se tivesse o poder geral Preparar Poção. Se tiver ambos, pode criar poções de até 5º círculo. <strong>Pré-requisito:</strong> treinado em Ofício (alquimista).</p>

                        <p><strong>Conexão Etérea.</strong> Você consegue infundir parte da sua alma em um item esotérico. O foco passa a ter RD 10 e PV iguais à metade dos seus. Se for destruído, você fica atordoado por uma rodada.</p>

                        <p><strong>Contramágica Aprimorada.</strong> Uma vez por rodada, você pode fazer uma contramágica como uma reação. <strong>Pré-requisito:</strong> Dissipar Magia.</p>

                        <p><strong>Conhecimento Místico.</strong> Você aprende duas magias de qualquer círculo que possa lançar.</p>

                        <p><strong>Deflexão Arcana.</strong> Uma vez por rodada, como reação, você pode gastar uma quantidade de PM limitada pela sua inteligência. Para cada PM gasto, recebe +1 na Defesa ou +1 em testes de resistência.</p>

                        <p><strong>Eco Ilusório.</strong> Você pode gastar 2 PM para criar uma duplicata ilusória de si mesmo como reação. O ataque contra você erra automaticamente e a ilusão se dissipa. <strong>Pré-requisito:</strong> Especialista em Escola (Ilusão), 10º nível de arcanista.</p>

                        <p><strong>Encantamento de Lâmina.</strong> Você pode lançar magias enquanto empunha uma arma corpo a corpo, como se estivesse com a mão livre. <strong>Pré-requisito:</strong> Lâmina Arcana, 6º nível de arcanista.</p>

                        <p><strong>Encanto Instintivo.</strong> Quando uma criatura a até 9 metros realizar uma jogada de ataque contra você, pode usar sua reação para desviá-lo para outra criatura no alcance. <strong>Pré-requisito:</strong> Especialista em Escola (Encantamento), 6º nível de arcanista.</p>

                        <p><strong>Envolto em Mistérios.</strong> Sua aparência e postura assombrosas permitem manipular e assustar pessoas ignorantes ou supersticiosas. Em geral, recebe +5 em Enganação e Intimidação contra pessoas não treinadas em Conhecimento ou Misticismo.</p>

                        <p><strong>Escriba Arcano.</strong> Você pode aprender magias copiando textos de pergaminhos e grimórios. <strong>Pré-requisito:</strong> treinado em Ofício (escriba).</p>

                        <p><strong>Especialista em Escola.</strong> Escolha uma escola de magia. A CD para resistir às suas magias dessa escola aumenta em +2.</p>

                        <p><strong>Lâmina Arcana.</strong> Quando empunha uma arma corpo a corpo, pode usar sua Inteligência em vez de Força nos testes de ataque e rolagens de dano. <strong>Pré-requisito:</strong> treinado em Luta.</p>

                        <p><strong>Magia Acelerada.</strong> Você pode gastar 2 PM para reduzir o tempo necessário para lançar seus feitiços de ação completa para ação padrão. <strong>Pré-requisito:</strong> 10º nível de arcanista, Int 4.</p>

                        <p><strong>Magia Pungente.</strong> Quando lança uma magia, pode pagar 1 PM para aumentar em +2 a CD para resistir a ela.</p>

                        <p><strong>Magia Residual.</strong> Sempre que usar uma magia empunhando uma arma, no próximo ataque essa arma ganha +1d6 de dano correspondente à escola da magia utilizada. <strong>Pré-requisito:</strong> Lâmina Arcana.</p>

                        <p><strong>Mente Resiliente.</strong> Quando faz um teste de Misticismo ou Vontade, você pode pagar 1 PM para rolar dois dados e usar o melhor resultado.</p>

                        <p><strong>Mestre em Escola.</strong> Escolha uma escola de magia. O custo para lançar magias dessa escola diminui em –1 PM. <strong>Pré-requisitos:</strong> Especialista em Escola com a escola escolhida, 8º nível de arcanista.</p>

                        <p><strong>Modelar Magia.</strong> Você pode gastar 1 PM para criar áreas de proteção relativa, mitigando os efeitos de suas magias de evocação. <strong>Pré-requisito:</strong> Especialista em Escola (Evocação).</p>

                        <p><strong>Poder Mágico.</strong> Você recebe +1 ponto de mana por nível de arcanista. Quando sobe de nível, os PM recebidos por este poder aumentam de acordo.</p>

                        <p><strong>Presságio.</strong> Após um descanso longo, role dois d20s e registre os resultados. Você pode trocar uma rolagem visível por uma das previsões anotadas. <strong>Pré-requisito:</strong> Especialista em Escola (Adivinhação).</p>

                        <p><strong>Proteção Mágica.</strong> Quando conjura uma magia de abjuração, pode gastar 2 PM para criar uma proteção mágica em si mesmo. <strong>Pré-requisito:</strong> Especialista em Escola (Abjuração).</p>

                        <p><strong>Proteção Projetada.</strong> A partir do 6º nível, quando uma criatura a até 9 metros sofrer dano, você pode usar sua reação para fazer com que sua Proteção Arcana absorva aquele dano. <strong>Pré-requisito:</strong> 6º nível de arcanista, Proteção Mágica.</p>

                        <p><strong>Recolhimento Sombrio.</strong> Uma vez por turno, quando elimina criaturas com uma magia, recupera PV igual à quantidade de PM gastos na magia, ou o dobro se for Necromancia. <strong>Pré-requisito:</strong> Especialista em Escola (Necromancia).</p>

                        <p><strong>Relíquia de Transmutação.</strong> Você pode passar oito horas criando um amuleto que retém uma magia de transmutação que conheça. <strong>Pré-requisito:</strong> Especialista em Escola (Transmutação).</p>

                        <p><strong>Salto Dimensional.</strong> Você pode gastar 1 PM para realizar um teletransporte de até 9 metros. <strong>Pré-requisito:</strong> Especialista em Escola (Conjuração).</p>

                        <p><strong>Tinteiro de Transcrição.</strong> Uma vez por descanso, você pode criar um pergaminho a partir de um papel em branco sem custos adicionais. <strong>Pré-requisito:</strong> treinado em Ofício (escriba).</p>
                    </div>
                </section>

            </article>
        </section>
    </main>

    <button
        type="button"
        class="mobile-menu-toggle"
        id="mobileMenuToggle"
        aria-expanded="false"
        aria-controls="mobileSidebarContent"
        aria-label="Abrir menu de navegação"
    >
        <span></span>
        <span></span>
        <span></span>
    </button>
    <button
        type="button"
        class="back-to-top-btn"
        id="backToTopBtn"
        aria-label="Voltar ao topo da página"
        title="Voltar ao topo"
    >
        ↑
    </button>
    <script src="assets/js/classes.js?v=20260503j"></script>
</body>
</html>