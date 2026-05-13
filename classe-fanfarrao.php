<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Fanfarrão - Pindorama RPG</title>

    <link rel="stylesheet" href="assets/css/ficha.css" />
    <link rel="stylesheet" href="assets/css/classes.css?v=20260513a" />
</head>

<body>
    <main class="page-wrapper classes-page">

        <header class="top-actions classes-topbar">
            <div>
                <h1>Fanfarrão</h1>
                <p>Classe dedicada à ousadia, à aventura, ao duelo, à liberdade e às façanhas exageradas de quem vive entre o risco e a glória.</p>
            </div>

            <div class="actions">
                <a class="system-link-btn" href="index.php">Menu</a>
                <a class="system-link-btn" href="classes.php">Classes</a>
                <a class="system-link-btn" href="ficha.php">Ficha</a>
            </div>
        </header>

        <?php
            $cb_class_slug = 'fanfarrao';
            $cb_class_name = 'Fanfarrão';
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
                        <a class="toc-link toc-level-2" href="#tabela-fanfarrao">O Fanfarrão</a>
                        <a class="toc-link toc-level-2" href="#bravatas">Bravatas</a>
                        <a class="toc-link toc-level-2" href="#poderes">Poderes de Fanfarrão</a>
                    </nav>
                </div>
            </aside>

            <article class="sheet classes-content" id="classesContent">

                <section id="descricao" class="content-section">
                    <h2>Fanfarrão</h2>

                    <p>
                        Aventureiros que desbravam as águas deste mundo, piratas fora da lei, contrabandistas,
                        mercadores, marujos ou capitães servindo a poderosas organizações: apesar da diversidade
                        entre os fanfarrões, a ousadia, a imprudência e o exagero são suas marcas registradas.
                    </p>

                    <p>
                        O fanfarrão é facilmente reconhecível pelo seu excesso. Muitos adornam-se com capas
                        esvoaçantes, chapéus imponentes com plumas, cabelos longos, luvas reluzentes e botas
                        chamativas. Outros preferem trajes sombrios, longos casacos de couro e equipamentos
                        resistentes ao sol, à chuva e ao mar, sempre priorizando velocidade e agilidade.
                    </p>

                    <p>
                        Alguns são ex-soldados cansados de batalhas, usando uniformes antigos como símbolo de orgulho
                        ou zombaria contra instituições que um dia serviram. Outros são duelistas vaidosos, piratas
                        galantes, mercadores perigosos ou aventureiros que transformam cada confronto em espetáculo.
                    </p>

                    <p>
                        Desprezando armaduras pesadas, o fanfarrão prefere trajes vibrantes, bordados, rendas e peças
                        marcantes. Em vez de grandes machados ou espadas pesadas, costuma empunhar floretes, pistolas,
                        adagas ou qualquer objeto capaz de compor uma cena memorável.
                    </p>

                    <p>
                        Apesar da atitude positiva e provocadora, nem todos os fanfarrões são alegres. Alguns são
                        amargos, desiludidos e movidos por vingança, redenção ou desejo de morte, escondendo seus
                        vazios atrás de bravatas e sorrisos afiados.
                    </p>

                    <p>
                        Em combate, o autêntico duelista nunca perde a oportunidade de realizar uma grande façanha.
                        Ele se pendura em candelabros, atravessa mesas, derruba portas, salta por janelas e desafia
                        a própria sorte mesmo quando isso é completamente desnecessário. Sua confiança excessiva,
                        porém, também costuma ser seu maior ponto fraco.
                    </p>
                </section>

                <section id="caracteristicas" class="content-section">
                    <h2>Características de Classe</h2>

                    <div class="class-power-block">
                        <p><strong>Pontos de Vida.</strong> Um fanfarrão começa com <strong>8 pontos de vida + Constituição</strong> e ganha <strong>4 PV + Constituição</strong> por nível.</p>

                        <p><strong>Pontos de Mana.</strong> <strong>4 PM por nível.</strong></p>

                        <p>
                            <strong>Perícias.</strong> <strong>Luta (For)</strong> ou <strong>Pontaria (Des)</strong>,
                            <strong>Reflexos (Des)</strong>, mais <strong>4</strong> à sua escolha entre
                            <strong>Acrobacia (Des)</strong>, <strong>Atletismo (For)</strong>, <strong>Atuação (Car)</strong>,
                            <strong>Enganação (Car)</strong>, <strong>Fortitude (Con)</strong>, <strong>Furtividade (Des)</strong>,
                            <strong>Guerra (Int)</strong>, <strong>Iniciativa (Des)</strong>, <strong>Intimidação (Car)</strong>,
                            <strong>Jogatina (Car)</strong>, <strong>Luta (For)</strong>, <strong>Ofício (Int)</strong>,
                            <strong>Percepção (Sab)</strong>, <strong>Pilotagem (Des)</strong> e <strong>Pontaria (Des)</strong>.
                        </p>

                        <p><strong>Proficiências.</strong> Armas marciais e escudo.</p>
                    </div>
                </section>

                <section id="habilidades" class="content-section">
                    <h2>Habilidades de Classe</h2>

                    <div class="class-power-block">
                        <p>
                            <strong>Audácia.</strong> Quando faz um teste de perícia, você pode gastar <strong>2 PM</strong>
                            para somar seu <strong>Carisma</strong> no teste. Você não pode usar esta habilidade em testes de ataque.
                        </p>

                        <p>
                            <strong>Insolência.</strong> Você soma seu <strong>Carisma</strong> na Defesa, limitado pelo seu nível.
                            Esta habilidade exige liberdade de movimentos; você não pode usá-la se estiver de armadura pesada
                            ou sob a condição imóvel.
                        </p>

                        <p>
                            <strong>Evasão.</strong> A partir do <strong>2º nível</strong>, quando sofre um efeito que permite
                            um teste de Reflexos para reduzir o dano à metade, você não sofre dano algum se passar. Se falhar,
                            sofre o dano normal. Esta habilidade exige liberdade de movimentos.
                        </p>

                        <p>
                            <strong>Poder de Fanfarrão.</strong> No <strong>2º nível</strong>, e a cada nível seguinte,
                            você recebe um poder de fanfarrão à sua escolha.
                        </p>

                        <p>
                            <strong>Esquiva Sagaz.</strong> No <strong>3º nível</strong>, você recebe <strong>+1 na Defesa</strong>
                            e em <strong>Reflexos</strong>. Esse bônus aumenta em +1 a cada quatro níveis. Esta habilidade exige
                            liberdade de movimentos.
                        </p>

                        <p>
                            <strong>Panache.</strong> A partir do <strong>5º nível</strong>, sempre que faz um acerto crítico
                            em combate ou reduz um inimigo a 0 PV, você recupera <strong>1 PM</strong>.
                        </p>

                        <p>
                            <strong>Evasão Aprimorada.</strong> A partir do <strong>10º nível</strong>, quando sofre um efeito
                            que permite um teste de Reflexos para reduzir o dano à metade, você não sofre dano algum se passar
                            e sofre apenas metade do dano se falhar.
                        </p>

                        <p>
                            <strong>Sorte dos Ousados.</strong> No <strong>20º nível</strong>, você pode gastar <strong>5 PM</strong>
                            para rolar novamente um teste recém realizado. Qualquer resultado 11 ou mais na segunda rolagem
                            será considerado um 20 natural.
                        </p>
                    </div>
                </section>

                <section id="tabela-fanfarrao" class="content-section">
                    <h2>O Fanfarrão</h2>

                    <div class="classes-table-wrap">
                        <table class="classes-table level-table">
                            <thead>
                                <tr>
                                    <th>Nível</th>
                                    <th>Habilidades de Classe</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr><td>1º</td><td>Audácia, insolência</td></tr>
                                <tr><td>2º</td><td>Evasão, poder de fanfarrão</td></tr>
                                <tr><td>3º</td><td>Esquiva sagaz +1, poder de fanfarrão</td></tr>
                                <tr><td>4º</td><td>Poder de fanfarrão</td></tr>
                                <tr><td>5º</td><td>Panache, poder de fanfarrão</td></tr>
                                <tr><td>6º</td><td>Poder de fanfarrão</td></tr>
                                <tr><td>7º</td><td>Esquiva sagaz +2, poder de fanfarrão</td></tr>
                                <tr><td>8º</td><td>Poder de fanfarrão</td></tr>
                                <tr><td>9º</td><td>Poder de fanfarrão</td></tr>
                                <tr><td>10º</td><td>Evasão aprimorada, poder de fanfarrão</td></tr>
                                <tr><td>11º</td><td>Esquiva sagaz +3, poder de fanfarrão</td></tr>
                                <tr><td>12º</td><td>Poder de fanfarrão</td></tr>
                                <tr><td>13º</td><td>Poder de fanfarrão</td></tr>
                                <tr><td>14º</td><td>Poder de fanfarrão</td></tr>
                                <tr><td>15º</td><td>Esquiva sagaz +4, poder de fanfarrão</td></tr>
                                <tr><td>16º</td><td>Poder de fanfarrão</td></tr>
                                <tr><td>17º</td><td>Poder de fanfarrão</td></tr>
                                <tr><td>18º</td><td>Poder de fanfarrão</td></tr>
                                <tr><td>19º</td><td>Esquiva sagaz +5, poder de fanfarrão</td></tr>
                                <tr><td>20º</td><td>Poder de fanfarrão, sorte dos ousados</td></tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section id="bravatas" class="content-section">
                    <h2>Bravatas</h2>

                    <div class="class-power-block">
                        <p>
                            <strong>Bravatas.</strong> Audazes e imprudentes, fanfarrões têm o costume da bravata:
                            a promessa pública de realizar uma façanha, às vezes atrelada a uma restrição absurda,
                            perigosa ou teatral.
                        </p>

                        <p>
                            Uma bravata deve envolver um desafio real. Em termos de jogo, deve ser uma ação com
                            ND igual ou maior que o nível do fanfarrão.
                        </p>

                        <p>
                            Você só pode ter uma bravata de cada tipo ativa por vez. Caso falhe ou desista de uma bravata,
                            perde todos os seus PM e só pode recuperá-los a partir do próximo dia.
                        </p>

                        <p>
                            Quando cumpre uma bravata, recebe um benefício que dura até o fim da aventura. A critério
                            do mestre, caso isso aconteça perto do fim da aventura, o benefício pode se estender até a próxima.
                        </p>
                    </div>
                </section>

                <section id="poderes" class="content-section">
                    <h2>Poderes de Fanfarrão</h2>

                    <div class="class-power-block">
                        <p><strong>Abusar dos Fracos.</strong> Quando ataca uma criatura sob efeito de uma condição de medo, seu dano aumenta em um passo. <strong>Pré-requisito:</strong> Flagelo dos Mares.</p>

                        <p><strong>Ainda Tenho uma Bala.</strong> Você pode gastar 1 PM para atirar com uma arma de fogo descarregada, como se ela ainda estivesse carregada. Essa munição é sempre considerada normal, sem melhorias. Você não pode usar esse poder novamente antes de recarregar a arma normalmente. <strong>Pré-requisito:</strong> Car 2, Pistoleiro.</p>

                        <p><strong>Amigos no Porto.</strong> Quando chega em uma comunidade portuária, você pode fazer um teste de Carisma CD 10. Se passar, encontra um amigo para o qual pode pedir um favor ou que pode ajudá-lo como parceiro veterano de um tipo à sua escolha por um dia. <strong>Pré-requisitos:</strong> Car 1, 6º nível de fanfarrão.</p>

                        <p><strong>Aparar.</strong> Uma vez por rodada, quando é atingido por um ataque, você pode gastar 1 PM para fazer um teste de ataque com bônus igual ao seu nível, além do normal. Se o resultado do seu teste for maior que o do oponente, você evita o ataque. Você só pode usar este poder se estiver usando uma arma corpo a corpo leve ou ágil. <strong>Pré-requisito:</strong> Esgrimista.</p>

                        <p><strong>Apostador.</strong> Você pode gastar um dia para encontrar e participar de apostas ou jogos de azar. Escolha um valor e faça um teste de Enganação contra a CD correspondente. Se passar, ganha o valor escolhido ou benefício equivalente; se falhar, perde esse mesmo valor. <strong>Pré-requisito:</strong> treinado em Enganação.</p>

                        <p><strong>Ataque Acrobático.</strong> Quando se aproxima de um inimigo com um salto ou pirueta, usando Atletismo ou Acrobacia para se mover, e o ataca no mesmo turno, você recebe +2 nesse teste de ataque e na rolagem de dano.</p>

                        <p><strong>Aumento de Atributo.</strong> Você recebe +1 em um atributo. Você pode escolher este poder várias vezes, mas apenas uma vez por patamar para um mesmo atributo.</p>

                        <p><strong>Aventureiro Ávido.</strong> Uma vez por rodada, você pode gastar 5 PM para realizar uma ação padrão ou de movimento adicional. Se possuir o poder Surto Heroico, em vez disso seu custo diminui em –2 PM.</p>

                        <p><strong>Bebarrão.</strong> Você pode usar a perícia Ofício (cozinheiro) para fabricar bebidas alcoólicas e se torna imune à ressaca.</p>

                        <p><strong>Bravata Audaz.</strong> Você jura fazer uma façanha específica. Se cumprir a bravata, seus PM aumentam em +2 por nível de fanfarrão até o fim da aventura.</p>

                        <p><strong>Bravata Imprudente.</strong> Na primeira rodada de um combate, você pode jurar derrotar seus inimigos com uma restrição escolhida. Se vencer, recebe +2 nos testes de ataque e na margem de ameaça até o fim da aventura.</p>

                        <p><strong>Bravura Indômita.</strong> Enquanto tiver uma quantidade de pontos de vida igual ou inferior ao seu nível, seus poderes de fanfarrão custam –1 PM.</p>

                        <p><strong>Charme Defensivo.</strong> Quando usa Audácia em um teste de resistência, o custo desta habilidade é reduzido em –1 PM.</p>

                        <p><strong>Embarcação.</strong> Você possui um veleiro. <strong>Pré-requisito:</strong> 8º nível de fanfarrão.</p>

                        <p><strong>Embarcação Melhorada.</strong> Seu veleiro agora possui características de um navio. <strong>Pré-requisitos:</strong> Embarcação, 12º nível de fanfarrão.</p>

                        <p><strong>En Garde.</strong> Você pode gastar uma ação de movimento e 1 PM para assumir postura de luta. Até o fim da cena, se estiver usando uma arma corpo a corpo leve ou ágil, recebe +2 na Defesa e na margem de ameaça. <strong>Pré-requisito:</strong> Esgrimista.</p>

                        <p><strong>Entrada Triunfal.</strong> Uma vez por aventura, no início de uma cena em que houver outras pessoas, você pode fazer um teste de uma perícia à sua escolha, CD 20, relacionada à sua entrada triunfal. Se passar, recebe 5 PM temporários, aumentando esse valor conforme superar a CD.</p>

                        <p><strong>Esgrimista.</strong> Quando usa uma arma leve ou ágil, você soma sua Inteligência nas rolagens de dano, limitado pelo seu nível. <strong>Pré-requisito:</strong> Int 1.</p>

                        <p><strong>Flagelo dos Mares.</strong> Você pode lançar Amedrontar, com atributo-chave Carisma. Esta não é uma habilidade mágica e vem de sua capacidade de incutir medo em seus inimigos. <strong>Pré-requisito:</strong> treinado em Intimidação.</p>

                        <p><strong>Folião.</strong> Você sabe fazer amizades durante festas, noitadas em tavernas e bailes. Nesses locais, recebe +2 em testes de perícias de Carisma e a atitude das pessoas em relação a você melhora em uma categoria. <strong>Pré-requisito:</strong> Car 1.</p>

                        <p><strong>Galanteio Encorajador.</strong> Uma vez por cena, você pode fazer um teste de Diplomacia oposto ao teste de Vontade de uma criatura inteligente em alcance curto que você considere atraente. Se passar, recebe 1d6 PM temporários.</p>

                        <p><strong>Grudar o Cano.</strong> Quando faz um ataque à distância com uma arma de fogo contra um oponente adjacente, você não sofre a penalidade de –5 no teste de ataque e aumenta seu dano em um passo. <strong>Pré-requisitos:</strong> treinado em Luta, Pistoleiro.</p>

                        <p><strong>Improviso de Combate.</strong> Você pode usar uma arma improvisada sem penalidades nos testes de ataque. O dano e os efeitos dessa arma são similares aos de uma arma do mesmo tamanho, determinados pelo mestre.</p>

                        <p><strong>Mão Amiga.</strong> Uma vez por cena, você pode gastar 1 PM para receber o benefício de um parceiro iniciante de um tipo à sua escolha por uma rodada, desde que haja pessoas que possam ajudá-lo por perto. Isto não conta em seu limite de parceiros. <strong>Pré-requisito:</strong> Car 3.</p>

                        <p><strong>Ousadia Inconsequente.</strong> Uma vez por rodada, quando faz um teste de perícia, você pode rolar 1d6 e adicionar o resultado ao teste. Porém, se falhar, sofre –1 em testes de perícia até o fim da cena e não pode mais usar esta habilidade.</p>

                        <p><strong>Pegou no Chapéu.</strong> Ao ser atingido por um ataque, você pode gastar 3 PM e destruir um item de vestuário que esteja usando para negar o ataque, zerando o dano sofrido e ignorando efeitos adicionais. <strong>Pré-requisitos:</strong> Car 2, 6º nível de fanfarrão.</p>

                        <p><strong>Pernas do Mar.</strong> Você está acostumado à superfície oscilante do convés. Recebe +2 em Acrobacia e Atletismo e não fica desprevenido quando está se equilibrando ou escalando.</p>

                        <p><strong>Pistoleiro.</strong> Você recebe proficiência com armas de fogo e +2 nas rolagens de dano com essas armas.</p>

                        <p><strong>Presença Paralisante.</strong> Você soma seu Carisma à sua Iniciativa e, se for o primeiro na iniciativa, ganha uma ação padrão extra na primeira rodada. <strong>Pré-requisitos:</strong> Car 1, 4º nível de fanfarrão.</p>

                        <p><strong>Ripostar.</strong> Quando usa Aparar e evita o ataque, você pode gastar 1 PM. Se fizer isso, pode fazer um ataque corpo a corpo imediato contra o inimigo que o atacou, se ele estiver em alcance. <strong>Pré-requisitos:</strong> Aparar, 12º nível de fanfarrão.</p>

                        <p><strong>Touché.</strong> Quando se aproxima de um inimigo e o ataca com uma arma corpo a corpo leve ou ágil no mesmo turno, você pode gastar 2 PM para aumentar seu dano em um passo e receber +5 na margem de ameaça. <strong>Pré-requisitos:</strong> Esgrimista, 10º nível de fanfarrão.</p>

                        <p><strong>Vou, Vejo e Disparo.</strong> Se você for o primeiro na iniciativa e tiver uma arma de fogo carregada em mãos, pode gastar uma ação livre e 2 PM para fazer um ataque com essa arma contra uma criatura que possa ver. <strong>Pré-requisitos:</strong> treinado em Iniciativa, Pistoleiro.</p>
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