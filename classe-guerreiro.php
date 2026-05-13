<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Guerreiro - Pindorama RPG</title>

    <link rel="stylesheet" href="assets/css/ficha.css" />
    <link rel="stylesheet" href="assets/css/classes.css?v=20260513a" />
</head>

<body>
    <main class="page-wrapper classes-page">

        <header class="top-actions classes-topbar">
            <div>
                <h1>Guerreiro</h1>
                <p>Classe dedicada ao domínio das armas, das técnicas de combate e da força disciplinada no campo de batalha.</p>
            </div>

            <div class="actions">
                <a class="system-link-btn" href="index.php">Menu</a>
                <a class="system-link-btn" href="classes.php">Classes</a>
                <a class="system-link-btn" href="ficha.php">Ficha</a>
            </div>
        </header>

        <?php
            $cb_class_slug = 'guerreiro';
            $cb_class_name = 'Guerreiro';
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
                        <a class="toc-link toc-level-2" href="#tabela-guerreiro">O Guerreiro</a>
                        <a class="toc-link toc-level-2" href="#golpe-pessoal">Golpe Pessoal</a>
                        <a class="toc-link toc-level-2" href="#poderes">Poderes de Guerreiro</a>
                    </nav>
                </div>
            </aside>

            <article class="sheet classes-content" id="classesContent">

                <section id="descricao" class="content-section">
                    <h2>Guerreiro</h2>

                    <p>
                        Em um mundo onde a luta é um reflexo da própria existência, o guerreiro emerge como
                        um verdadeiro maestro das disputas armadas. Entre honra, ganância, lealdade e pura
                        emoção da batalha, ele se destaca como um combatente inigualável, dominando uma
                        ampla variedade de armas e técnicas letais.
                    </p>

                    <p>
                        Cada movimento de um guerreiro é um tributo à precisão: aberturas certeiras, golpes
                        finais devastadores e contra-ataques implacáveis quando seus adversários baixam a guarda.
                        A batalha, para ele, não é apenas força bruta, mas disciplina, leitura de campo e domínio
                        do próprio corpo.
                    </p>

                    <p>
                        Seja um cavaleiro intrépido, um astuto atirador, um mercenário em busca de riquezas,
                        uma guarda veterana ou um mestre das lâminas, o guerreiro abraça uma vida de treinamento
                        constante. Sua técnica transforma combate em arte, e suas armas tornam-se extensões de sua vontade.
                    </p>

                    <p>
                        Da taverna à corte, da fazenda à academia, guerreiros se erguem em diferentes papéis.
                        Podem ser generais que conduzem exércitos, conselheiros que orientam reis, duelistas,
                        soldados, conquistadores ou aventureiros em busca de uma última batalha digna de memória.
                    </p>

                    <p>
                        Onde outros dependem de truques, sorte ou magia, o guerreiro confia em treino, coragem
                        e técnica. Sua presença em combate é direta, poderosa e difícil de ignorar.
                    </p>
                </section>

                <section id="caracteristicas" class="content-section">
                    <h2>Características de Classe</h2>

                    <div class="class-power-block">
                        <p>
                            <strong>Pontos de Vida.</strong> Um guerreiro começa com
                            <strong>20 pontos de vida + Constituição</strong> e ganha
                            <strong>5 PV + Constituição</strong> por nível.
                        </p>

                        <p><strong>Pontos de Mana.</strong> <strong>3 PM por nível.</strong></p>

                        <p>
                            <strong>Perícias.</strong> <strong>Luta (For)</strong> ou <strong>Pontaria (Des)</strong>,
                            <strong>Fortitude (Con)</strong>, mais <strong>2</strong> à sua escolha entre
                            <strong>Adestramento (Car)</strong>, <strong>Atletismo (For)</strong>,
                            <strong>Cavalgar (Des)</strong>, <strong>Guerra (Int)</strong>,
                            <strong>Iniciativa (Des)</strong>, <strong>Intimidação (Car)</strong>,
                            <strong>Luta (For)</strong>, <strong>Ofício (Int)</strong>,
                            <strong>Percepção (Sab)</strong>, <strong>Pontaria (Des)</strong>
                            e <strong>Reflexos (Des)</strong>.
                        </p>

                        <p><strong>Proficiências.</strong> Armas marciais, armaduras pesadas e escudos.</p>
                    </div>
                </section>

                <section id="habilidades" class="content-section">
                    <h2>Habilidades de Classe</h2>

                    <div class="class-power-block">
                        <p>
                            <strong>Ataque Especial.</strong> Quando faz um ataque, você pode gastar
                            <strong>1 PM</strong> para receber <strong>+4</strong> no teste de ataque ou na rolagem de dano.
                            A cada quatro níveis, você pode gastar +1 PM para aumentar esse bônus, conforme a evolução
                            da classe.
                        </p>

                        <p>
                            <strong>Poder de Guerreiro.</strong> No <strong>2º nível</strong>, e a cada nível seguinte,
                            você escolhe um dos poderes de guerreiro.
                        </p>

                        <p>
                            <strong>Durão.</strong> A partir do <strong>3º nível</strong>, sua resistência em combate
                            permite suportar golpes que derrubariam outros combatentes. Quando sofre dano, você pode
                            usar sua reação e gastar PM para reduzir o dano recebido.
                        </p>

                        <p>
                            <strong>Ataque Extra.</strong> A partir do <strong>6º nível</strong>, quando usa a ação
                            agredir, você pode gastar <strong>2 PM</strong> para realizar um ataque adicional uma vez
                            por rodada.
                        </p>

                        <p>
                            <strong>Campeão.</strong> No <strong>20º nível</strong>, o dano de todos os seus ataques
                            aumenta em um passo. Além disso, sempre que faz um <strong>Ataque Especial</strong> ou um
                            <strong>Golpe Pessoal</strong> e acerta o ataque, recupera metade dos PM gastos nele.
                        </p>
                    </div>
                </section>

                <section id="tabela-guerreiro" class="content-section">
                    <h2>O Guerreiro</h2>

                    <div class="classes-table-wrap">
                        <table class="classes-table level-table">
                            <thead>
                                <tr>
                                    <th>Nível</th>
                                    <th>Habilidades de Classe</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr><td>1º</td><td>Ataque especial +4</td></tr>
                                <tr><td>2º</td><td>Poder de guerreiro</td></tr>
                                <tr><td>3º</td><td>Durão, poder de guerreiro</td></tr>
                                <tr><td>4º</td><td>Poder de guerreiro</td></tr>
                                <tr><td>5º</td><td>Ataque especial +8, poder de guerreiro</td></tr>
                                <tr><td>6º</td><td>Ataque extra, poder de guerreiro</td></tr>
                                <tr><td>7º</td><td>Poder de guerreiro</td></tr>
                                <tr><td>8º</td><td>Poder de guerreiro</td></tr>
                                <tr><td>9º</td><td>Ataque especial +12, poder de guerreiro</td></tr>
                                <tr><td>10º</td><td>Poder de guerreiro</td></tr>
                                <tr><td>11º</td><td>Poder de guerreiro</td></tr>
                                <tr><td>12º</td><td>Poder de guerreiro</td></tr>
                                <tr><td>13º</td><td>Ataque especial +16, poder de guerreiro</td></tr>
                                <tr><td>14º</td><td>Poder de guerreiro</td></tr>
                                <tr><td>15º</td><td>Poder de guerreiro</td></tr>
                                <tr><td>16º</td><td>Poder de guerreiro</td></tr>
                                <tr><td>17º</td><td>Ataque especial +20, poder de guerreiro</td></tr>
                                <tr><td>18º</td><td>Poder de guerreiro</td></tr>
                                <tr><td>19º</td><td>Poder de guerreiro</td></tr>
                                <tr><td>20º</td><td>Campeão, poder de guerreiro</td></tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section id="golpe-pessoal" class="content-section">
                    <h2>Golpe Pessoal</h2>

                    <div class="class-power-block">
                        <p>
                            <strong>Golpe Pessoal.</strong> Quando faz um ataque, você pode desferir uma técnica única,
                            construída a partir de efeitos escolhidos por você. Cada efeito possui um custo em PM, e a soma
                            desses efeitos define o custo final do golpe, com mínimo de <strong>1 PM</strong>.
                        </p>

                        <p>
                            O Golpe Pessoal só pode ser usado com uma arma específica, como espadas longas, lanças, machados
                            ou outra arma escolhida. Quando sobe de nível, você pode reconstruir seu Golpe Pessoal e alterar
                            a arma utilizada.
                        </p>

                        <p>
                            Você pode escolher este poder outras vezes para criar golpes diferentes, mas não pode gastar mais PM
                            em golpes pessoais em uma mesma rodada do que seu limite de PM.
                        </p>

                        <p><strong>Pré-requisito:</strong> 5º nível de guerreiro.</p>
                    </div>
                </section>

                <section id="poderes" class="content-section">
                    <h2>Poderes de Guerreiro</h2>

                    <div class="class-power-block">
                        <p><strong>Ambidestria.</strong> Se estiver empunhando duas armas, e pelo menos uma delas for leve, e fizer a ação agredir, você pode fazer dois ataques, um com cada arma. Se fizer isso, sofre –2 em todos os testes de ataque até o seu próximo turno. <strong>Pré-requisito:</strong> Des 2.</p>

                        <p><strong>Aparar.</strong> Uma vez por rodada, quando é atingido por um ataque, você pode gastar 1 PM para fazer um teste de ataque com bônus igual ao seu nível, além do normal. Se o resultado do seu teste for maior que o do oponente, você evita o ataque. Você só pode usar este poder se estiver usando uma arma corpo a corpo leve ou ágil. <strong>Pré-requisito:</strong> Esgrimista.</p>

                        <p><strong>Aparada Dupla.</strong> Você pode usar Aparar quando estiver empunhando duas armas de corpo a corpo leves ou ágeis. <strong>Pré-requisitos:</strong> Aparar e Ambidestria.</p>

                        <p><strong>Arqueiro.</strong> Se estiver usando uma arma de ataque à distância, você soma sua Sabedoria em rolagens de dano, limitado pelo seu nível. <strong>Pré-requisito:</strong> Sab 1.</p>

                        <p><strong>Ataque Desarmante.</strong> Você pode gastar 1 PM para adicionar a manobra desarmar em um ataque corpo a corpo.</p>

                        <p><strong>Ataque Reflexo.</strong> Se um alvo em alcance de seus ataques corpo a corpo ficar desprevenido ou se mover voluntariamente para fora do seu alcance, você pode gastar 1 PM para fazer um ataque corpo a corpo contra esse alvo, apenas uma vez por alvo a cada rodada. <strong>Pré-requisito:</strong> Des 1.</p>

                        <p><strong>Ataque Vislumbrante.</strong> Você pode gastar 2 PM e, se acertar o alvo, ele fica desprevenido até o fim do próximo turno.</p>

                        <p><strong>Aumento de Atributo.</strong> Você recebe +1 em um atributo. Você pode escolher este poder várias vezes, mas apenas uma vez por patamar para um mesmo atributo.</p>

                        <p><strong>Bater e Correr.</strong> Quando faz uma investida, você pode continuar se movendo após o ataque, até o limite de seu deslocamento. Se gastar 2 PM, pode fazer uma investida sobre terreno difícil e sem sofrer a penalidade de Defesa.</p>

                        <p><strong>Contra-atacar.</strong> Uma vez por rodada, quando uma criatura atacar você com um ataque corpo a corpo e errar, você pode gastar 2 PM para realizar um ataque extra corpo a corpo contra essa criatura, com +2 no teste de ataque.</p>

                        <p><strong>Destruidor.</strong> Quando causa dano com uma arma corpo a corpo de duas mãos, você pode rolar novamente qualquer resultado 1 ou 2 da rolagem de dano da arma. <strong>Pré-requisito:</strong> For 1.</p>

                        <p><strong>Equipamento Padrão.</strong> Se estiver empunhando uma arma com a qual tenha Especialização em Arma e usando uma armadura com a qual tenha Especialização em Armadura, os benefícios desses dois poderes são dobrados. <strong>Pré-requisitos:</strong> Especialização em Arma, Especialização em Armadura.</p>

                        <p><strong>Esgrimista.</strong> Quando usa uma arma corpo a corpo leve ou ágil, você soma sua Inteligência em rolagens de dano, limitado pelo seu nível. <strong>Pré-requisito:</strong> Int 1.</p>

                        <p><strong>Especialização em Arma.</strong> Escolha uma arma. Você recebe +2 em rolagens de dano com essa arma. Você pode escolher este poder outras vezes para armas diferentes.</p>

                        <p><strong>Especialização em Armadura.</strong> Você recebe redução de dano 5 se estiver usando uma armadura pesada. <strong>Pré-requisito:</strong> 12º nível de guerreiro.</p>

                        <p><strong>Estocada.</strong> Você pode gastar 1 PM para aumentar em 1,5m o alcance de uma arma corpo a corpo.</p>

                        <p><strong>Golpe de Queda.</strong> Você pode gastar 1 PM para adicionar a manobra derrubar em um ataque corpo a corpo.</p>

                        <p><strong>Golpe de Raspão.</strong> Uma vez por rodada, quando erra um ataque, você pode gastar 2 PM. Se fizer isso, causa metade do dano que causaria, ignorando efeitos que se aplicariam apenas em caso de acerto.</p>

                        <p><strong>Golpe Demolidor.</strong> Quando usa a manobra quebrar ou ataca um objeto, você pode gastar 2 PM para ignorar a redução de dano dele.</p>

                        <p><strong>Golpe Pessoal.</strong> Você cria uma técnica única de combate com uma arma específica, combinando efeitos e custos em PM. <strong>Pré-requisito:</strong> 5º nível de guerreiro.</p>

                        <p><strong>Golpe Repartidor.</strong> Quando faz um ataque, você pode gastar 1 PM para diminuir a Defesa do alvo em –2 até o fim da cena. A redução total da Defesa do alvo é limitada pelo seu nível.</p>

                        <p><strong>Ímpeto.</strong> Você pode gastar 1 PM para aumentar seu deslocamento em +6m por uma rodada.</p>

                        <p><strong>Manobra Ágil.</strong> Escolha uma manobra de combate. Você pode realizar essa manobra como uma ação de movimento.</p>

                        <p><strong>Mestre em Arma.</strong> Escolha uma arma. Com esta arma, seu dano aumenta em um passo e você pode gastar 2 PM para rolar novamente um teste de ataque recém realizado. <strong>Pré-requisitos:</strong> Especialização em Arma com a arma escolhida, 12º nível de guerreiro.</p>

                        <p><strong>Mira Estável.</strong> Quando faz um ataque à distância com armas simples, marciais ou exóticas de longa distância, você não sofre penalidade de –5 nas jogadas de ataque. <strong>Pré-requisito:</strong> Arqueiro.</p>

                        <p><strong>Passo Evasivo.</strong> Se houver espaço para se locomover, você pode gastar 1 PM para aumentar sua Defesa em +2 até o fim da próxima rodada.</p>

                        <p><strong>Planejamento Marcial.</strong> Uma vez por dia, você pode gastar uma hora e 3 PM para escolher um poder de guerreiro ou de combate cujos pré-requisitos cumpra. Você recebe os benefícios desse poder até o próximo dia. <strong>Pré-requisitos:</strong> treinado em Guerra, 10º nível de guerreiro.</p>

                        <p><strong>Romper Resistências.</strong> Quando faz um Ataque Especial, você pode gastar 1 PM adicional para ignorar 10 pontos de redução de dano.</p>

                        <p><strong>Solidez.</strong> Se estiver usando um escudo, você aplica o bônus na Defesa recebido pelo escudo em testes de resistência.</p>

                        <p><strong>Tornado de Dor.</strong> Você pode gastar uma ação padrão e 2 PM para desferir uma série de golpes giratórios. Faça um ataque corpo a corpo e compare-o com a Defesa de cada inimigo em seu alcance natural. Então faça uma rolagem de dano com bônus cumulativo de +2 para cada acerto e aplique-a em cada inimigo atingido. <strong>Pré-requisito:</strong> 6º nível de guerreiro.</p>

                        <p><strong>Valentão.</strong> Você recebe +2 em testes de ataque e rolagens de dano contra oponentes caídos, desprevenidos, flanqueados ou indefesos.</p>
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