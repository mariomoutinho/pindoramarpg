<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Artífice - Pindorama RPG</title>

    <link rel="stylesheet" href="assets/css/ficha.css" />
    <link rel="stylesheet" href="assets/css/classes.css?v=20260513a" />
</head>

<body>
    <main class="page-wrapper classes-page">

        <header class="top-actions classes-topbar">
            <div>
                <h1>Artífice</h1>
                <p>Classe dedicada à invenção, à alquimia, à mecânica e ao domínio da ciência aplicada ao mundo de Pindorama.</p>
            </div>

            <div class="actions">
                <a class="system-link-btn" href="index.php">Menu</a>
                <a class="system-link-btn" href="classes.php">Classes</a>
                <a class="system-link-btn" href="ficha.php">Ficha</a>
            </div>
        </header>

        <?php
            $cb_class_slug = 'artifice';
            $cb_class_name = 'Artífice';
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
                        <a class="toc-link toc-level-2" href="#tabela-artifice">Tabela 1-4: O Artífice</a>
                        <a class="toc-link toc-level-2" href="#livro-formulas">Livro de Fórmulas</a>
                        <a class="toc-link toc-level-2" href="#engenhocas">Engenhocas</a>
                        <a class="toc-link toc-level-2" href="#poderes">Poderes de Artífice</a>
                    </nav>
                </div>
            </aside>

            <article class="sheet classes-content" id="classesContent">

                <section id="descricao" class="content-section">
                    <h2>Artífice</h2>

                    <p>
                        A todo momento, as tradições perdem espaço para algo totalmente diferente: a ciência.
                        As grandes e antigas academias de magia federais foram alguns dos primeiros espaços a serem
                        ocupados por essa nova força em Pindorama. Aos poucos, mentes brilhantes espalham conhecimento
                        e trazem um colorido de avanços ao mundo por meio da alquimia, da mecânica e das engenharias.
                    </p>

                    <p>
                        Famosos por sua habilidade em manipular objetos, compostos alquímicos, mecanismos e invenções,
                        os artífices são movidos por uma paixão intensa por desvendar os segredos da ciência e da tecnologia.
                        Com criatividade, paciência e trabalho duro, usam seu conhecimento para moldar o mundo ao seu redor.
                    </p>

                    <p>
                        É bastante comum encontrar artífices entre os aventureiros de Pindorama, embora suas motivações
                        sejam peculiares. Enquanto muitos buscam glória, riqueza ou seguem missões divinas, os artífices
                        enxergam o mundo como um vasto laboratório, onde cada jornada é uma oportunidade de pesquisa,
                        coleta de dados e aperfeiçoamento de suas criações.
                    </p>

                    <p>
                        Em algumas regiões, especialmente em contextos mais conservadores, suas invenções podem ser vistas
                        com desconfiança, como engenhocas perigosas, imprevisíveis ou até profanas. Ainda assim, mesmo os
                        mais resistentes ao progresso acabam usando diariamente criações deixadas por artífices do passado,
                        de máquinas agrícolas a dispositivos de proteção e cura.
                    </p>

                    <p>
                        Os artífices são inquietos, exploradores e frequentemente seus próprios cobaias. Buscam aprimorar
                        objetos comuns, romper limites e desafiar dogmas que impedem o avanço. Em suas mãos, ciência,
                        engenho e experimentação tornam-se ferramentas de sobrevivência, descoberta e transformação.
                    </p>
                </section>

                <section id="caracteristicas" class="content-section">
                    <h2>Características de Classe</h2>

                    <div class="class-power-block">
                        <p><strong>Pontos de Vida.</strong> Um artífice começa com <strong>12 pontos de vida + Constituição</strong> e ganha <strong>3 PV + Constituição</strong> por nível.</p>

                        <p><strong>Pontos de Mana.</strong> <strong>4 PM por nível.</strong></p>

                        <p><strong>Perícias.</strong> <strong>Ofício</strong> e <strong>Vontade (Sab)</strong>, mais <strong>4</strong> à sua escolha entre
                            <strong>Conhecimento (Int)</strong>, <strong>Cura (Sab)</strong>, <strong>Diplomacia (Car)</strong>,
                            <strong>Fortitude (Con)</strong>, <strong>Iniciativa (Des)</strong>, <strong>Investigação (Int)</strong>,
                            <strong>Luta (For)</strong>, <strong>Misticismo (Int)</strong>, <strong>Ofício (Int)</strong>,
                            <strong>Pilotagem (Des)</strong>, <strong>Percepção (Sab)</strong> e <strong>Pontaria (Des)</strong>.
                        </p>

                        <p><strong>Proficiências.</strong> Nenhuma.</p>
                    </div>
                </section>

                <section id="habilidades" class="content-section">
                    <h2>Habilidades de Classe</h2>

                    <div class="class-power-block">
                        <p><strong>Engenhosidade.</strong> Quando faz um teste de perícia, você pode gastar <strong>1 PM</strong> para somar sua <strong>Inteligência</strong> no teste. Você não pode usar esta habilidade em testes de ataque.</p>

                        <p><strong>Protótipo.</strong> Você começa o jogo com <strong>um item superior</strong>, ou com <strong>10 itens alquímicos</strong>, com preço total de até <strong>M$ 500</strong>.</p>

                        <p><strong>Fabricar Item Superior.</strong> No <strong>2º nível</strong>, você recebe um item superior com preço de até <strong>M$ 2.000</strong> e passa a poder fabricar itens superiores com <strong>uma melhoria</strong>. Nos níveis <strong>5, 8 e 11</strong>, você pode substituir esse item por um item superior com <strong>duas, três e quatro melhorias</strong>, respectivamente.</p>

                        <p><strong>Poder de Artífice.</strong> No <strong>2º nível</strong>, e a cada nível seguinte, você escolhe <strong>um dos poderes de artífice</strong>.</p>

                        <p><strong>Engenhoqueiro.</strong> No <strong>3º nível</strong>, você pode fabricar <strong>engenhocas</strong>.</p>

                        <p><strong>Fabricar Item Mágico.</strong> No <strong>9º nível</strong>, você recebe um <strong>item mágico menor</strong> e passa a poder fabricar itens mágicos menores. Nos níveis <strong>13 e 17</strong>, você pode substituir esse item por um <strong>item mágico médio</strong> e depois <strong>maior</strong>, respectivamente.</p>

                        <p><strong>Obra-Prima.</strong> No <strong>20º nível</strong>, você fabrica sua grande criação, aquela pela qual seu nome será lembrado nas eras futuras. As regras exatas devem ser aprovadas pelo mestre, mas, em termos gerais, a obra-prima pode ter benefícios equivalentes a um item com <strong>cinco melhorias</strong> e <strong>quatro encantos</strong>.</p>
                    </div>
                </section>

                <section id="tabela-artifice" class="content-section">
                    <h2>Tabela 1-4: O Artífice</h2>

                    <div class="classes-table-wrap">
                        <table class="classes-table level-table">
                            <thead>
                                <tr>
                                    <th>Nível</th>
                                    <th>Habilidades de Classe</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>1º</td><td>Engenhosidade, protótipo</td></tr>
                                <tr><td>2º</td><td>Fabricar item superior (1 melhoria), poder de artífice</td></tr>
                                <tr><td>3º</td><td>Engenhoqueiro, poder de artífice</td></tr>
                                <tr><td>4º</td><td>Poder de artífice</td></tr>
                                <tr><td>5º</td><td>Fabricar item superior (2 melhorias), poder de artífice</td></tr>
                                <tr><td>6º</td><td>Poder de artífice</td></tr>
                                <tr><td>7º</td><td>Poder de artífice</td></tr>
                                <tr><td>8º</td><td>Fabricar item superior (3 melhorias), poder de artífice</td></tr>
                                <tr><td>9º</td><td>Fabricar item mágico (menor), poder de artífice</td></tr>
                                <tr><td>10º</td><td>Poder de artífice</td></tr>
                                <tr><td>11º</td><td>Fabricar item superior (4 melhorias), poder de artífice</td></tr>
                                <tr><td>12º</td><td>Poder de artífice</td></tr>
                                <tr><td>13º</td><td>Fabricar item mágico (médio), poder de artífice</td></tr>
                                <tr><td>14º</td><td>Poder de artífice</td></tr>
                                <tr><td>15º</td><td>Poder de artífice</td></tr>
                                <tr><td>16º</td><td>Poder de artífice</td></tr>
                                <tr><td>17º</td><td>Fabricar item mágico (maior), poder de artífice</td></tr>
                                <tr><td>18º</td><td>Poder de artífice</td></tr>
                                <tr><td>19º</td><td>Poder de artífice</td></tr>
                                <tr><td>20º</td><td>Obra-prima, poder de artífice</td></tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section id="livro-formulas" class="content-section">
                    <h2>Livro de Fórmulas</h2>

                    <p>
                        Quando adquire o poder <strong>Alquimista Iniciado</strong>, você recebe um <strong>livro de fórmulas</strong>.
                        Uma fórmula é uma magia divina ou arcana com atributo-chave <strong>Inteligência</strong> que serve
                        para cumprir os pré-requisitos de fabricação de poções.
                    </p>

                    <p>
                        Você começa com <strong>três fórmulas de 1º círculo</strong>. A cada nível além do 1º, aprende
                        <strong>uma fórmula adicional</strong>. A partir do <strong>6º nível</strong>, pode aprender fórmulas
                        de <strong>2º círculo</strong>. Se possuir o poder <strong>Mestre Alquimista</strong>, a cada quatro níveis
                        (<strong>10º, 14º e 18º</strong>) pode aprender fórmulas de um círculo maior.
                    </p>

                    <p>
                        Se não tiver seu livro de fórmulas, você não pode fabricar poções. Se perder o livro, pode preparar
                        outro com <strong>uma semana de trabalho</strong> e o gasto de <strong>M$ 100</strong>.
                    </p>
                </section>

                <section id="engenhocas" class="content-section">
                    <h2>Engenhocas</h2>

                    <p>
                        Uma <strong>engenhoca</strong> é uma invenção que simula o efeito de uma magia.
                        Exemplos incluem um canhão que imita <strong>Bola de Fogo</strong>, uma arma de raios,
                        um casaco blindado, um emplastro curativo, um guarda-costas mecânico, um projetor de imagens
                        ou até um veículo a vapor.
                    </p>

                    <p>
                        Em termos gerais, uma engenhoca é um item mundano <strong>Minúsculo</strong>, que ocupa
                        <strong>1 espaço</strong> e possui <strong>Defesa 15</strong>, pontos de vida iguais à metade
                        dos PV de seu fabricante e <strong>RD 5</strong>.
                    </p>

                    <p>
                        Quando é fabricada, escolha se ela será <strong>empunhada</strong> ou <strong>vestida</strong>.
                        Ao ser ativada, pode assumir outra forma compatível com seu efeito. Uma engenhoca que simula
                        <em>Montaria Arcana</em>, por exemplo, pode ser uma pequena caixa de engrenagens que se desdobra
                        em uma moto de madeira.
                    </p>

                    <p>
                        O artífice que segue esse caminho transforma conhecimento técnico em soluções extraordinárias,
                        fazendo das engenhocas uma das marcas mais icônicas da classe.
                    </p>
                </section>

                <section id="poderes" class="content-section">
                    <h2>Poderes de Artífice</h2>

                    <div class="class-power-block">
                        <p><strong>Agite Antes de Usar.</strong> Quando usa um preparado alquímico que cause dano, você pode gastar uma quantidade de PM à sua escolha, limitada por sua Inteligência. Para cada PM gasto, o item causa um dado extra de dano do mesmo tipo. <strong>Pré-requisito:</strong> treinado em Ofício (alquimista).</p>

                        <p><strong>Ajuste de Mira.</strong> Você pode gastar uma ação padrão e uma quantidade de PM à sua escolha, limitada por sua Inteligência, para aprimorar uma arma de ataque à distância. Para cada PM gasto, você recebe +1 em rolagens de dano com a arma até o final da cena. <strong>Pré-requisito:</strong> Balística.</p>

                        <p><strong>Alquimista de Batalha.</strong> Quando usa um preparado alquímico ou poção que cause dano, você soma sua Inteligência na rolagem de dano. <strong>Pré-requisito:</strong> Alquimista Iniciado.</p>

                        <p><strong>Alquimista Iniciado.</strong> Você recebe um livro de fórmulas e pode fabricar poções com fórmulas que conheça de 1º e 2º círculos. <strong>Pré-requisitos:</strong> Int 1, Sab 1, treinado em Ofício (alquimista).</p>

                        <p><strong>Armeiro.</strong> Você recebe proficiência com armas marciais corpo a corpo. Quando empunha uma arma corpo a corpo, pode usar sua Inteligência em vez de Força nos testes de ataque e rolagens de dano. <strong>Pré-requisitos:</strong> treinado em Luta e Ofício (armeiro).</p>

                        <p><strong>Artífice Acadêmico.</strong> Quando estiver em uma área urbana, você pode gastar um dia e 1 PM para obter M$ 30 em ingredientes para fabricação. Com mais níveis e mais PM, esse valor aumenta conforme a progressão da habilidade. <strong>Pré-requisito:</strong> 4º nível de artífice.</p>

                        <p><strong>Aumento de Atributo.</strong> Você recebe +1 em um atributo. Você pode escolher este poder várias vezes, mas apenas uma vez por patamar para um mesmo atributo.</p>

                        <p><strong>Ativação Rápida.</strong> Ao ativar uma engenhoca com ação padrão, você pode pagar 2 PM para ativá-la com uma ação de movimento. <strong>Pré-requisitos:</strong> Engenhoqueiro, 7º nível de artífice.</p>

                        <p><strong>Autômato.</strong> Você fabrica um autômato, um construto que obedece a seus comandos. Ele é um parceiro iniciante de um tipo à sua escolha entre ajudante, assassino, atirador, combatente, guardião, montaria ou vigilante. <strong>Pré-requisito:</strong> Engenhoqueiro.</p>

                        <p><strong>Autômato Prototipado.</strong> Você pode gastar uma ação padrão e 2 PM para ativar uma melhoria experimental em seu autômato. Em bons resultados, ele aumenta o nível de parceiro ou recebe uma habilidade adicional até o fim da cena; em falha, ele enguiça como uma engenhoca. <strong>Pré-requisito:</strong> Autômato.</p>

                        <p><strong>Balística.</strong> Você recebe proficiência com armas marciais de ataque à distância ou com armas de fogo. Quando usa uma arma de ataque à distância, pode usar sua Inteligência em vez de Destreza nos testes de ataque. <strong>Pré-requisitos:</strong> treinado em Pontaria e Ofício (armeiro).</p>

                        <p><strong>Blindagem.</strong> Você pode usar sua Inteligência na Defesa quando usa armadura pesada. Se fizer isso, não pode somar sua Destreza. <strong>Pré-requisitos:</strong> Couraceiro, 8º nível de artífice.</p>

                        <p><strong>Cano Raiado.</strong> Quando usa uma arma de disparo feita por você mesmo, ela recebe +2 na margem de ameaça. <strong>Pré-requisitos:</strong> Balística, 5º nível de artífice.</p>

                        <p><strong>Catalisador Instável.</strong> Você pode gastar uma ação completa e 3 PM para fabricar instantaneamente um preparado alquímico ou poção cuja fórmula conheça. O custo do item é reduzido à metade, mas ele só dura até o fim da cena. <strong>Pré-requisito:</strong> Alquimista Iniciado.</p>

                        <p><strong>Chutes e Palavrões.</strong> Uma vez por rodada, você pode pagar 1 PM para repetir um teste de Ofício (engenhoqueiro) recém realizado para ativar uma engenhoca. <strong>Pré-requisito:</strong> Engenhoqueiro.</p>

                        <p><strong>Comerciante.</strong> Você pode vender itens 10% mais caro. <strong>Pré-requisito:</strong> 3º nível de artífice.</p>

                        <p><strong>Conhecimento de Fórmulas.</strong> Você aprende três fórmulas de quaisquer círculos que possa aprender. Você pode escolher este poder quantas vezes quiser. <strong>Pré-requisito:</strong> Alquimista Iniciado.</p>

                        <p><strong>Couraceiro.</strong> Você recebe proficiência com armaduras pesadas e escudos. Quando usa armadura, pode usar sua Inteligência em vez de Destreza na Defesa. <strong>Pré-requisito:</strong> treinado em Ofício (armeiro).</p>

                        <p><strong>Encontrar Fraqueza.</strong> Você pode gastar uma ação de movimento e 2 PM para analisar um objeto em alcance curto. Se fizer isso, ignora a redução de dano dele. Também pode usar a habilidade para analisar um inimigo; se ele estiver de armadura ou for um construto, você recebe +2 em seus testes de ataque contra ele. <strong>Pré-requisito:</strong> 7º nível de artífice.</p>

                        <p><strong>Farmacêutico.</strong> Quando usa um item alquímico que cure pontos de vida, você pode gastar uma quantidade de PM à sua escolha, limitada por sua Inteligência. Para cada PM gasto, o item cura um dado extra do mesmo tipo. <strong>Pré-requisitos:</strong> Sab 1, treinado em Ofício (alquimista).</p>

                        <p><strong>Ferreiro.</strong> Quando usa uma arma corpo a corpo feita por você mesmo, o dano dela aumenta em um passo. <strong>Pré-requisitos:</strong> Armeiro, 5º nível de artífice.</p>

                        <p><strong>Granadeiro.</strong> Você pode arremessar itens alquímicos e poções em alcance médio. Pode usar sua Inteligência em vez de Destreza para calcular a CD do teste de resistência desses itens. <strong>Pré-requisito:</strong> Alquimista de Batalha.</p>

                        <p><strong>Homúnculo.</strong> Você possui um homúnculo, uma criatura Minúscula feita de alquimia. Vocês podem se comunicar telepaticamente em alcance longo e ele obedece às suas ordens. Inicialmente, é um parceiro ajudante iniciante, podendo também assumir função defensiva temporária. <strong>Pré-requisito:</strong> Alquimista Iniciado.</p>

                        <p><strong>Invenção Potente.</strong> Quando usa um item ou engenhoca fabricado por você mesmo, pode pagar 1 PM para aumentar em +2 a CD para resistir a ele.</p>

                        <p><strong>Inventário Rápido.</strong> Você pode usar 2 PM para reduzir o tempo de uma ação quando usar um item. Ações completas tornam-se ações padrão; ações padrão tornam-se ações de movimento. <strong>Pré-requisito:</strong> Des 1.</p>

                        <p><strong>Maestria em Perícia.</strong> Escolha um número de perícias treinadas igual à sua Inteligência. Com essas perícias, você pode gastar 1 PM para escolher 10 em qualquer situação, exceto testes de ataque.</p>

                        <p><strong>Manutenção Eficiente.</strong> A quantidade de engenhocas que você pode manter aumenta em +3. Além disso, cada engenhoca passa a ocupar meio espaço. <strong>Pré-requisitos:</strong> Engenhoqueiro, 5º nível de artífice.</p>

                        <p><strong>Mestre Alquimista.</strong> Você pode fabricar poções com fórmulas que conheça de qualquer círculo. <strong>Pré-requisitos:</strong> Int 3, Sab 3, Alquimista Iniciado, 10º nível de artífice.</p>

                        <p><strong>Mestre Cuca.</strong> Todas as comidas que você cozinha têm seu bônus numérico aumentado em +1. <strong>Pré-requisito:</strong> treinado em Ofício (cozinheiro).</p>

                        <p><strong>Mistura Fervilhante.</strong> Quando usa um item alquímico ou poção, você pode gastar 2 PM para dobrar a área de efeito dele. <strong>Pré-requisitos:</strong> Alquimista Iniciado, 5º nível de artífice.</p>

                        <p><strong>Oficina de Campo.</strong> Você pode gastar uma hora e 2 PM para fazer a manutenção do equipamento do grupo. Cada membro escolhe uma arma, armadura ou escudo; armas recebem +1 em testes de ataque, e armaduras e escudos aumentam seu bônus na Defesa em +1 por um dia. <strong>Pré-requisito:</strong> treinado em Ofício (armeiro).</p>

                        <p><strong>Olho do Dragão.</strong> Você pode gastar uma ação completa para analisar um item e descobrir automaticamente se ele é mágico, suas propriedades e como utilizá-las. <strong>Pré-requisito:</strong> 10º nível de artífice.</p>

                        <p><strong>Pedra de Amolar.</strong> Você pode gastar uma ação de movimento e uma quantidade de PM à sua escolha, limitada por sua Inteligência, para aprimorar uma arma corpo a corpo empunhada. Para cada PM gasto, você recebe +1 em rolagens de dano com a arma até o final da cena. <strong>Pré-requisito:</strong> Armeiro.</p>

                        <p><strong>Síntese Rápida.</strong> Quando fabrica um item alquímico ou poção, você pode fabricar o dobro de doses no mesmo tempo, pagando normalmente o custo de matéria-prima de cada uma. <strong>Pré-requisito:</strong> Alquimista Iniciado.</p>

                        <p><strong>Sintetizar Poções.</strong> Você pode aprender fórmulas de poções a partir de poções preparadas. Aprender uma fórmula dessa forma exige tempo de trabalho e gasto em matérias-primas proporcional ao custo em PM da magia. <strong>Pré-requisitos:</strong> Alquimista Iniciado.</p>
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