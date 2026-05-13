<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Classes - Pindorama RPG</title>

    <link rel="stylesheet" href="assets/css/ficha.css" />
    <link rel="stylesheet" href="assets/css/classes.css?v=20260513a" />
    <link rel="stylesheet" href="assets/css/transitions.css?v=20260508u" />
</head>

<body>
    <script src="assets/js/transitions.js?v=20260508u"></script>
    <main class="page-wrapper classes-page">

        <header class="top-actions classes-topbar">
            <div>
                <h1 class="titulo-cordel">Classes</h1>
                <p>
                    Introdução às classes do Pindorama RPG: escolha da classe,
                    características gerais, progressão de personagem, patamares de jogo
                    e regras de multiclasse.
                </p>
            </div>

            <div class="actions">
                <a class="system-link-btn" href="index.php">Menu</a>
                <a class="system-link-btn" href="referencia.php">Acervo</a>
            </div>
        </header>

        <section class="classes-layout">

            <aside class="classes-sidebar panel" id="classesSidebar">
                <div class="sidebar-mobile-head">
                    <div class="panel-title">Navegação</div>
                </div>

                <div class="sidebar-content" id="mobileSidebarContent">
                    <input
                        type="search"
                        id="classesSearch"
                        placeholder="Buscar nesta página..."
                        class="classes-search"
                    />

                    <nav class="classes-toc" id="classesToc">
                        <a class="toc-link toc-level-2" href="#introducao">Introdução</a>
                        <a class="toc-link toc-level-2" href="#escolhendo-sua-classe">Escolhendo sua Classe</a>
                        <a class="toc-link toc-level-2" href="#caracteristicas-das-classes">Características das Classes</a>
                        <a class="toc-link toc-level-2" href="#tabela-classes">Tabela 1-2: Classes</a>
                        <a class="toc-link toc-level-2" href="#habilidades-de-classe">Habilidades de Classe</a>
                        <a class="toc-link toc-level-2" href="#patamares-de-jogo">Patamares de Jogo</a>
                        <a class="toc-link toc-level-2" href="#nivel-de-personagem">Nível de Personagem</a>
                        <a class="toc-link toc-level-2" href="#subindo-de-nivel">Subindo de Nível</a>
                        <a class="toc-link toc-level-2" href="#multiclasse">Multiclasse</a>
                        <a class="toc-link toc-level-2" href="#tabela-nivel-personagem">Tabela 1-3: Nível de Personagem</a>
                        <a class="toc-link toc-level-2" href="#consulta-de-paginas">Consulta de Páginas</a>
                        <a class="toc-link toc-level-2" href="#conteudos-relacionados">Conteúdos Relacionados</a>
                    </nav>
                </div>
            </aside>

            <article class="sheet classes-content" id="classesContent">

                <section id="introducao" class="content-section">
                    <h2>Introdução</h2>

                    <p>
                        Uma classe é mais que uma profissão: é a vocação de um personagem.
                        Ela simboliza a forma que você adotou para encarar os perigos do mundo
                        e buscar seus objetivos — seja por meio de armas, perícias ou magias.
                    </p>

                    <div class="info-card">
                        <strong>Resumo da página:</strong>
                        esta página apresenta apenas as regras gerais de classes.
                        As páginas específicas de cada classe serão separadas para facilitar
                        a leitura, organização e navegação do sistema.
                    </div>
                </section>

                <section id="escolhendo-sua-classe" class="content-section">
                    <h2>Escolhendo sua Classe</h2>

                    <p>
                        A classe é como a “essência” principal do seu personagem. Ela define
                        o papel que você vai desempenhar no grupo de aventureiros, modificando
                        a forma como seu personagem percebe o mundo, interage com outras pessoas,
                        enfrenta perigos e utiliza armas, perícias ou magias.
                    </p>

                    <p>
                        Em <strong>Pindorama RPG</strong>, existem catorze classes diferentes.
                        A tabela abaixo apresenta um resumo de cada uma delas, incluindo descrição,
                        atributo mais importante, Pontos de Vida, Pontos de Mana e perícias iniciais.
                    </p>
                </section>

                <section id="caracteristicas-das-classes" class="content-section">
                    <h2>Características das Classes</h2>

                    <p>
                        Cada classe apresenta características próprias que determinam como o
                        personagem começa o jogo e como evolui durante sua jornada.
                    </p>

                    <p>
                        <strong>Pontos de Vida e Mana.</strong>
                        Sua classe define seus pontos de vida e pontos de mana.
                        Veja mais sobre essas características na <strong>página 106</strong>.
                    </p>

                    <p>
                        <strong>Perícias.</strong>
                        Indicam as perícias nas quais você é treinado.
                        Veja mais sobre isso no <strong>Capítulo 2</strong>.
                    </p>

                    <p>
                        <strong>Proficiências.</strong>
                        Indicam os tipos de armas e armaduras que você sabe usar.
                        Todos os personagens sabem usar armas simples e armaduras leves.
                        Se você usar uma arma ou armadura sem proficiência, sofre penalidades
                        em testes. Veja mais sobre isso nas <strong>páginas 142 e 152</strong>.
                    </p>
                </section>

                <section id="tabela-classes" class="content-section">
                    <h2>Tabela 1-2: Classes</h2>

                    <div class="classes-table-wrap">
                        <table class="classes-table">
                            <thead>
                                <tr>
                                    <th>Classe</th>
                                    <th>Descrição</th>
                                    <th>Atributo</th>
                                    <th>PV</th>
                                    <th>PM</th>
                                    <th>Perícias</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td><a href="classe-arcanista.php">Arcanista</a></td>
                                    <td>Um usuário de magia capaz de manipular as estruturas da realidade a partir de conhecimentos ocultos.</td>
                                    <td>Inteligência</td>
                                    <td>10</td>
                                    <td>6</td>
                                    <td>Misticismo e Vontade, mais 2</td>
                                </tr>

                                <tr>
                                    <td><a href="classe-artifice.php">Artífice</a></td>
                                    <td>Um ferreiro, alquimista ou engenhoqueiro, especializado em fabricar e usar itens.</td>
                                    <td>Inteligência</td>
                                    <td>12</td>
                                    <td>4</td>
                                    <td>Ofício e Vontade, mais 4</td>
                                </tr>

                                <tr>
                                    <td><a href="classe-brincante.php">Brincante</a></td>
                                    <td>Um místico inspirador que possui poderes manifestados em sua arte.</td>
                                    <td>Carisma</td>
                                    <td>16</td>
                                    <td>4</td>
                                    <td>Atuação e Reflexos, mais 6</td>
                                </tr>

                                <tr>
                                    <td><a href="classe-cacador.php">Caçador</a></td>
                                    <td>Um exterminador de monstros e mestre da sobrevivência e exploração em áreas selvagens.</td>
                                    <td>Força ou Destreza</td>
                                    <td>20</td>
                                    <td>4</td>
                                    <td>Luta ou Pontaria, Sobrevivência, mais 4</td>
                                </tr>

                                <tr>
                                    <td><a href="classe-cangaceiro.php">Cangaceiro</a></td>
                                    <td>Mestre das emboscadas e das táticas de combate em grupo.</td>
                                    <td>Força ou Destreza</td>
                                    <td>16</td>
                                    <td>4</td>
                                    <td>Luta ou Pontaria, Reflexos, mais 6</td>
                                </tr>

                                <tr>
                                    <td><a href="classe-fanfarrao.php">Fanfarrão</a></td>
                                    <td>Um navegador inconsequente e galante, sempre em busca de ouro ou emoção.</td>
                                    <td>Destreza</td>
                                    <td>16</td>
                                    <td>3</td>
                                    <td>Luta ou Pontaria, Reflexos, mais 4</td>
                                </tr>

                                <tr>
                                    <td><a href="classe-feiticeiro.php">Feiticeiro</a></td>
                                    <td>Um portador de magia derivada de pactos com espíritos ancestrais.</td>
                                    <td>Carisma</td>
                                    <td>12</td>
                                    <td>5</td>
                                    <td>Misticismo e Vontade, mais 3</td>
                                </tr>

                                <tr>
                                    <td><a href="classe-guerreiro.php">Guerreiro</a></td>
                                    <td>O especialista supremo em técnicas de combate com armas.</td>
                                    <td>Força ou Destreza</td>
                                    <td>20</td>
                                    <td>3</td>
                                    <td>Luta ou Pontaria, Fortitude, mais 2</td>
                                </tr>

                                <tr>
                                    <td><a href="classe-lutador.php">Lutador</a></td>
                                    <td>Um especialista em combate desarmado, rústico e durão.</td>
                                    <td>Força</td>
                                    <td>20</td>
                                    <td>3</td>
                                    <td>Fortitude e Luta, mais 4</td>
                                </tr>

                                <tr>
                                    <td><a href="classe-malandro.php">Malandro</a></td>
                                    <td>Aventureiro cheio de truques, confiando mais em agilidade e esperteza que em força bruta.</td>
                                    <td>Destreza ou Inteligência</td>
                                    <td>16</td>
                                    <td>4</td>
                                    <td>Ladinagem e Reflexos, mais 8</td>
                                </tr>

                                <tr>
                                    <td><a href="classe-rustico.php">Rústico</a></td>
                                    <td>Um combatente destemido, que usa fúria e instintos para destruir seus inimigos.</td>
                                    <td>Força</td>
                                    <td>24</td>
                                    <td>3</td>
                                    <td>Fortitude e Luta, mais 4</td>
                                </tr>

                                <tr>
                                    <td><a href="classe-sacerdote.php">Sacerdote</a></td>
                                    <td>Servo de um deus, usa sua fé para defender seus ideais.</td>
                                    <td>Sabedoria</td>
                                    <td>16</td>
                                    <td>5</td>
                                    <td>Religião e Vontade, mais 2</td>
                                </tr>

                                <tr>
                                    <td><a href="classe-inquisidor.php">Inquisidor</a></td>
                                    <td>Um combatente honrado, campeão de uma ordem ou soldado divino.</td>
                                    <td>Força ou Carisma</td>
                                    <td>20</td>
                                    <td>3</td>
                                    <td>Luta e Vontade, mais 2</td>
                                </tr>

                                <tr>
                                    <td><a href="classe-xama.php">Xamã</a></td>
                                    <td>Conectado aos espíritos selvagens, domina magias espirituais para cura, visões e controle da força da natureza.</td>
                                    <td>Sabedoria</td>
                                    <td>16</td>
                                    <td>5</td>
                                    <td>Sobrevivência e Vontade, mais 4</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <p class="page-note">
                        Os links das classes já estão estruturados para páginas futuras.
                        Caso alguma página ainda não exista, ela poderá ser criada depois com o conteúdo completo da classe.
                    </p>
                </section>

                <section id="habilidades-de-classe" class="content-section">
                    <h2>Habilidades de Classe</h2>

                    <p>
                        Você começa o jogo com todas as habilidades do 1º nível da sua classe.
                        As regras para usar habilidades são explicadas no <strong>Capítulo 5: Jogando</strong>.
                    </p>

                    <p>
                        <strong>Poderes.</strong>
                        Cada classe apresenta uma habilidade denominada “Poder”, como
                        Poder de Artífice, Poder de Brincante, Poder de Caçador e assim por diante.
                        Essa habilidade permite escolher um poder de uma lista.
                    </p>

                    <p>
                        Alguns poderes possuem pré-requisitos que precisam ser atendidos para que
                        possam ser escolhidos e utilizados. Você pode optar por um poder assim que
                        alcançar o nível em que preenche seus pré-requisitos.
                    </p>

                    <p>
                        A menos que seja indicado o contrário, não é permitido escolher o mesmo poder
                        mais de uma vez. Também é possível trocar um poder de classe por um poder geral,
                        conforme detalhado no <strong>Capítulo 2</strong>.
                    </p>

                    <p>
                        Poderes que influenciam o custo em PM de uma magia são classificados como
                        poderes de aprimoramento. Consulte a <strong>página 131</strong>.
                    </p>
                </section>

                <section id="patamares-de-jogo" class="content-section">
                    <h2>Patamares de Jogo</h2>

                    <p>
                        Os patamares fornecem uma noção da escala de poder dos personagens
                        e afetam certas habilidades.
                    </p>

                    <div class="patamar-grid">
                        <div class="patamar-card">
                            <h3>Iniciante</h3>
                            <p>
                                <strong>1º ao 4º nível.</strong>
                                Aventureiro novato, envolvido em missões locais,
                                como proteger vilas do ataque de bandidos e escoltar caravanas.
                            </p>
                        </div>

                        <div class="patamar-card">
                            <h3>Veterano</h3>
                            <p>
                                <strong>5º ao 10º nível.</strong>
                                Neste patamar, o herói presta serviços importantes
                                a nobres e líderes de guildas.
                            </p>
                        </div>

                        <div class="patamar-card">
                            <h3>Campeão</h3>
                            <p>
                                <strong>11º ao 16º nível.</strong>
                                Já famoso por suas façanhas, o aventureiro trabalha
                                para monarcas e enfrenta grandes vilões e monstros terríveis.
                            </p>
                        </div>

                        <div class="patamar-card">
                            <h3>Lenda</h3>
                            <p>
                                <strong>17º ao 20º nível.</strong>
                                Entre os mais poderosos, o herói lida com perigos
                                que ameaçam todo o mundo — ou mesmo toda a realidade.
                            </p>
                        </div>
                    </div>
                </section>

                <section id="nivel-de-personagem" class="content-section">
                    <h2>Nível de Personagem</h2>

                    <p>
                        O nível de um personagem reflete sua experiência e poder.
                        Quanto mais elevado, mais formidável ele se torna.
                    </p>

                    <p>
                        À medida que enfrentam aventuras e superam desafios, os personagens
                        adquirem pontos de experiência, também chamados de XP.
                        Ao acumular um determinado número de pontos, avançam para o próximo nível.
                    </p>

                    <p>
                        A <strong>Tabela 1-3: Nível de Personagem</strong> apresenta a quantidade
                        de pontos de experiência necessária para alcançar cada nível.
                    </p>

                    <p>
                        Você inicia no 1º nível com 0 pontos de experiência. Isso representa
                        um herói iniciante, começando sua jornada. Desafios mundanos, como
                        confrontar um bandido de estrada ou um lobo faminto, ainda podem
                        representar obstáculos significativos.
                    </p>

                    <p>
                        Para mais informações, consulte o quadro
                        <strong>Patamares de Jogo</strong> nesta mesma página.
                    </p>
                </section>

                <section id="subindo-de-nivel" class="content-section">
                    <h2>Subindo de Nível</h2>

                    <p>
                        Ao acumular pontos de experiência em quantidade suficiente,
                        conforme indicado na tabela de nível de personagem, você avança
                        para o próximo nível.
                    </p>

                    <p>
                        Nesse momento, você obtém três benefícios principais:
                    </p>

                    <div class="rule-list">
                        <div class="rule-item">
                            <h3>1. Pontos de Vida e Mana</h3>
                            <p>
                                Seus Pontos de Vida e Pontos de Mana aumentam de acordo
                                com a sua classe. Some sua Constituição aos PV que você ganha
                                por nível. Você sempre recebe pelo menos 1 PV ao subir de nível.
                            </p>
                        </div>

                        <div class="rule-item">
                            <h3>2. Habilidades de Classe</h3>
                            <p>
                                Você adquire todas as habilidades correspondentes ao nível
                                alcançado. Consulte a tabela da sua classe para identificar
                                quais habilidades são recebidas.
                            </p>
                        </div>

                        <div class="rule-item">
                            <h3>3. Bônus em Perícias</h3>
                            <p>
                                Seu bônus em perícias é equivalente à metade do seu nível.
                                A cada nível par, como 2º, 4º e 6º, ele aumenta em +1.
                                Use o número anterior à barra para perícias treinadas e
                                o número posterior para perícias não treinadas.
                                Para mais detalhes, consulte o <strong>Capítulo 2</strong>.
                            </p>
                        </div>
                    </div>
                </section>

                <section id="multiclasse" class="content-section">
                    <h2>Multiclasse</h2>

                    <p>
                        Ao avançar para o próximo nível, você tem a opção de escolher outra classe.
                        Essa escolha é conhecida como <strong>multiclasse</strong> e proporciona
                        maior versatilidade em troca de poder bruto.
                    </p>

                    <blockquote class="example-box">
                        <p>
                            Exemplo: Kai’porah Kauany Tamoio, uma malandra de 5º nível,
                            encontra manuscritos antigos com símbolos mágicos para invocação
                            de feitiços. Ao subir para o 6º nível, escolhe um nível de hermético,
                            tornando-se uma malandra 5/hermético 1.
                        </p>
                    </blockquote>

                    <p>
                        <strong>Pontos de Vida.</strong>
                        Quando você alcança o primeiro nível em uma nova classe,
                        adquire os PV de um nível subsequente, não os PV iniciais do 1º nível.
                    </p>

                    <p>
                        <strong>Pontos de Mana.</strong>
                        Some os PM concedidos por cada classe para determinar seu total acumulado.
                    </p>

                    <p>
                        <strong>Perícias e Proficiências.</strong>
                        Ao atingir o primeiro nível em uma nova classe, você não obtém as perícias
                        treinadas nem as proficiências da nova classe.
                    </p>

                    <p>
                        <strong>Níveis de Classe e de Personagem.</strong>
                        Níveis de classe referem-se aos níveis em uma classe específica.
                        Já o nível de personagem é a soma dos níveis de todas as suas classes.
                    </p>
                </section>

                <section id="tabela-nivel-personagem" class="content-section">
                    <h2>Tabela 1-3: Nível de Personagem</h2>

                    <div class="classes-table-wrap">
                        <table class="classes-table level-table">
                            <thead>
                                <tr>
                                    <th>Nível de Personagem</th>
                                    <th>Pontos de Experiência</th>
                                    <th>Bônus em Perícias</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr><td>1º</td><td>-</td><td>+2/+0</td></tr>
                                <tr><td>2º</td><td>1.000</td><td>+3/+1</td></tr>
                                <tr><td>3º</td><td>3.000</td><td>+3/+1</td></tr>
                                <tr><td>4º</td><td>6.000</td><td>+4/+2</td></tr>
                                <tr><td>5º</td><td>10.000</td><td>+4/+2</td></tr>
                                <tr><td>6º</td><td>15.000</td><td>+5/+3</td></tr>
                                <tr><td>7º</td><td>21.000</td><td>+7/+3</td></tr>
                                <tr><td>8º</td><td>28.000</td><td>+8/+4</td></tr>
                                <tr><td>9º</td><td>36.000</td><td>+8/+4</td></tr>
                                <tr><td>10º</td><td>45.000</td><td>+9/+5</td></tr>
                                <tr><td>11º</td><td>55.000</td><td>+9/+5</td></tr>
                                <tr><td>12º</td><td>66.000</td><td>+10/+6</td></tr>
                                <tr><td>13º</td><td>78.000</td><td>+10/+6</td></tr>
                                <tr><td>14º</td><td>91.000</td><td>+11/+7</td></tr>
                                <tr><td>15º</td><td>105.000</td><td>+13/+7</td></tr>
                                <tr><td>16º</td><td>120.000</td><td>+14/+8</td></tr>
                                <tr><td>17º</td><td>136.000</td><td>+14/+8</td></tr>
                                <tr><td>18º</td><td>153.000</td><td>+15/+9</td></tr>
                                <tr><td>19º</td><td>171.000</td><td>+15/+9</td></tr>
                                <tr><td>20º</td><td>190.000</td><td>+16/+10</td></tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section id="consulta-de-paginas" class="content-section">
                    <h2>Consulta de Páginas</h2>

                    <p>
                        Esta área foi deixada como referência para criar links internos no futuro,
                        conectando cada trecho do sistema à página correspondente do livro.
                    </p>

                    <div class="reference-grid">
                        <div class="reference-card">
                            <strong>Página 2</strong>
                            <span>
                                Introdução às classes, Escolhendo sua Classe,
                                Características das Classes, Tabela 1-2 e início de Habilidades de Classe.
                            </span>
                        </div>

                        <div class="reference-card">
                            <strong>Página 3</strong>
                            <span>
                                Continuação de Habilidades de Classe, Poderes,
                                Patamares de Jogo, Nível de Personagem e início de Subindo de Nível.
                            </span>
                        </div>

                        <div class="reference-card">
                            <strong>Página 4</strong>
                            <span>
                                Subindo de Nível, Multiclasse e Tabela 1-3:
                                Nível de Personagem.
                            </span>
                        </div>

                        <div class="reference-card future-link">
                            <strong>Página 5 em diante</strong>
                            <span>
                                Início das classes específicas. A primeira classe apresentada é Arcanista.
                                Este conteúdo será separado em páginas próprias.
                            </span>
                        </div>
                    </div>
                </section>

                <section id="conteudos-relacionados" class="content-section">
                    <h2>Conteúdos Relacionados</h2>

                    <p>
                        Os links abaixo já ficam preparados para quando as próximas páginas forem criadas.
                    </p>

                    <div class="related-links-grid">
                        <a href="classe-arcanista.php" class="related-link">Arcanista</a>
                        <a href="classe-artifice.php" class="related-link">Artífice</a>
                        <a href="classe-brincante.php" class="related-link">Brincante</a>
                        <a href="classe-cacador.php" class="related-link">Caçador</a>
                        <a href="classe-cangaceiro.php" class="related-link">Cangaceiro</a>
                        <a href="classe-fanfarrao.php" class="related-link">Fanfarrão</a>
                        <a href="classe-feiticeiro.php" class="related-link">Feiticeiro</a>
                        <a href="classe-guerreiro.php" class="related-link">Guerreiro</a>
                        <a href="classe-lutador.php" class="related-link">Lutador</a>
                        <a href="classe-malandro.php" class="related-link">Malandro</a>
                        <a href="classe-rustico.php" class="related-link">Rústico</a>
                        <a href="classe-sacerdote.php" class="related-link">Sacerdote</a>
                        <a href="classe-inquisidor.php" class="related-link">Inquisidor</a>
                        <a href="classe-xama.php" class="related-link">Xamã</a>
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

    <script src="assets/js/classes.js?v=20260503j"></script>
</body>
</html>