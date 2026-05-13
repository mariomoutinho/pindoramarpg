<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Lutador - Pindorama RPG</title>

    <link rel="stylesheet" href="assets/css/ficha.css" />
    <link rel="stylesheet" href="assets/css/classes.css?v=20260513a" />
</head>

<body>
    <main class="page-wrapper classes-page">

        <header class="top-actions classes-topbar">
            <div>
                <h1>Lutador</h1>
                <p>Classe dedicada ao combate desarmado, à resistência física, à disciplina corporal e à força bruta transformada em técnica.</p>
            </div>

            <div class="actions">
                <a class="system-link-btn" href="index.php">Menu</a>
                <a class="system-link-btn" href="classes.php">Classes</a>
                <a class="system-link-btn" href="ficha.php">Ficha</a>
            </div>
        </header>

        <?php
            $cb_class_slug = 'lutador';
            $cb_class_name = 'Lutador';
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
                        <a class="toc-link toc-level-2" href="#tabela-lutador">O Lutador</a>
                        <a class="toc-link toc-level-2" href="#poderes">Poderes de Lutador</a>
                    </nav>
                </div>
            </aside>

            <article class="sheet classes-content" id="classesContent">

                <section id="descricao" class="content-section">
                    <h2>Lutador</h2>

                    <p>
                        Herméticos, feiticeiros ou sacerdotes confiam em suas magias da mesma forma que guerreiros e virtuosos
                        confiam em armas afiadas e escudos impenetráveis para enfrentar perigos mortais. Ao lutador, cabe ter fé
                        apenas em seu próprio corpo, que é sua arma e também sua proteção.
                    </p>

                    <p>
                        Seja aprimorando suas habilidades sob a tutela de mestres, seguindo disciplinas transmitidas ao longo
                        de gerações, ou aprendendo a lutar para sobreviver em becos sombrios, os lutadores tornam-se mestres
                        em formas variadas de combate desarmado.
                    </p>

                    <p>
                        Seus golpes vão desde socos e chutes de força letal até chaves, quedas e técnicas de combate no solo.
                        Diversas culturas pindorins desenvolveram tradições próprias de luta. A capoeira ensinada e praticada
                        entre os Zambi é uma das mais famosas, embora angáris e iakarés também tenham desenvolvido métodos
                        tribais como huka huka e luta marajoara.
                    </p>

                    <p>
                        Embora pessoas de muitas origens possam iniciar algum tipo de treinamento em luta desarmada, aqueles
                        que avançam o suficiente para se tornarem heróis possuem uma personalidade marcante. São perseverantes,
                        resistentes e teimosos, moldados por horas de repetição, prática e exercício.
                    </p>

                    <p>
                        O caminho das lutas traz glórias, mas também derrotas, ferimentos e dores diárias. Em sociedades tribais,
                        lutadores podem ocupar posições de destaque como representantes em duelos ou líderes em tempos de guerra.
                        Nas grandes cidades, muitos acabam como capangas, seguranças ou figuras das ruas.
                    </p>

                    <p>
                        A vida de aventuras representa uma grande chance para os lutadores abandonarem a pobreza ou o crime.
                        Mesmo sem educação formal, fé religiosa ou posição militar, compensam com poder de combate, coragem
                        e uma disposição quase imediata para missões que prometam riqueza, renome ou sobrevivência.
                    </p>
                </section>

                <section id="caracteristicas" class="content-section">
                    <h2>Características de Classe</h2>

                    <div class="class-power-block">
                        <p>
                            <strong>Pontos de Vida.</strong> Um lutador começa com
                            <strong>20 pontos de vida + Constituição</strong> e ganha
                            <strong>5 PV + Constituição</strong> por nível.
                        </p>

                        <p><strong>Pontos de Mana.</strong> <strong>3 PM por nível.</strong></p>

                        <p>
                            <strong>Perícias.</strong> <strong>Fortitude (Con)</strong> e <strong>Luta (For)</strong>,
                            mais <strong>4</strong> à sua escolha entre
                            <strong>Acrobacia (Des)</strong>, <strong>Adestramento (Car)</strong>,
                            <strong>Atletismo (For)</strong>, <strong>Enganação (Car)</strong>,
                            <strong>Furtividade (Des)</strong>, <strong>Iniciativa (Des)</strong>,
                            <strong>Intimidação (Car)</strong>, <strong>Ofício (Int)</strong>,
                            <strong>Percepção (Sab)</strong>, <strong>Pontaria (Des)</strong>
                            e <strong>Reflexos (Des)</strong>.
                        </p>

                        <p><strong>Proficiências.</strong> Nenhuma.</p>
                    </div>
                </section>

                <section id="habilidades" class="content-section">
                    <h2>Habilidades de Classe</h2>

                    <div class="class-power-block">
                        <p>
                            <strong>Briga.</strong> Seus ataques desarmados causam <strong>1d6 pontos de dano</strong>
                            e podem causar dano letal ou não letal, sem penalidades. A cada quatro níveis, seu dano desarmado
                            aumenta conforme a evolução da classe.
                        </p>

                        <p>
                            O dano apresentado é para criaturas Pequenas e Médias. Criaturas Minúsculas diminuem esse dano
                            em um passo; criaturas Grandes e Enormes aumentam em um passo; criaturas Colossais aumentam em
                            dois passos.
                        </p>

                        <p>
                            <strong>Golpe Relâmpago.</strong> Quando usa a ação agredir para fazer um ataque desarmado,
                            você pode gastar <strong>1 PM</strong> para realizar um ataque desarmado adicional.
                        </p>

                        <p>
                            <strong>Poder de Lutador.</strong> No <strong>2º nível</strong>, e a cada nível seguinte,
                            você recebe um poder de lutador à sua escolha.
                        </p>

                        <p>
                            <strong>Casca Grossa.</strong> No <strong>3º nível</strong>, você soma sua
                            <strong>Constituição</strong> na Defesa, limitado pelo seu nível e apenas se não estiver usando
                            armadura pesada. Além disso, no <strong>7º nível</strong>, e a cada quatro níveis, recebe
                            <strong>+1 na Defesa</strong>.
                        </p>

                        <p>
                            <strong>Golpe Cruel.</strong> No <strong>5º nível</strong>, você acerta onde dói.
                            Sua margem de ameaça com ataques desarmados aumenta em <strong>+1</strong>.
                        </p>

                        <p>
                            <strong>Golpe Violento.</strong> No <strong>9º nível</strong>, você bate com muita força.
                            Seu multiplicador de crítico com ataques desarmados aumenta em <strong>+1</strong>.
                        </p>

                        <p>
                            <strong>Dono da Rua.</strong> No <strong>20º nível</strong>, seu dano desarmado aumenta para
                            <strong>2d10</strong>, para criaturas Médias. Além disso, quando usa a ação agredir para fazer
                            um ataque desarmado, você pode fazer dois ataques em vez de um, podendo usar
                            <strong>Golpe Relâmpago</strong> para fazer um terceiro.
                        </p>
                    </div>
                </section>

                <section id="tabela-lutador" class="content-section">
                    <h2>O Lutador</h2>

                    <div class="classes-table-wrap">
                        <table class="classes-table level-table">
                            <thead>
                                <tr>
                                    <th>Nível</th>
                                    <th>Habilidades de Classe</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr><td>1º</td><td>Briga (1d6), golpe relâmpago</td></tr>
                                <tr><td>2º</td><td>Poder de lutador</td></tr>
                                <tr><td>3º</td><td>Casca grossa (Con), poder de lutador</td></tr>
                                <tr><td>4º</td><td>Poder de lutador</td></tr>
                                <tr><td>5º</td><td>Briga (1d8), golpe cruel, poder de lutador</td></tr>
                                <tr><td>6º</td><td>Poder de lutador</td></tr>
                                <tr><td>7º</td><td>Casca grossa (Con+1), poder de lutador</td></tr>
                                <tr><td>8º</td><td>Poder de lutador</td></tr>
                                <tr><td>9º</td><td>Briga (1d10), golpe violento, poder de lutador</td></tr>
                                <tr><td>10º</td><td>Poder de lutador</td></tr>
                                <tr><td>11º</td><td>Casca grossa (Con+2), poder de lutador</td></tr>
                                <tr><td>12º</td><td>Poder de lutador</td></tr>
                                <tr><td>13º</td><td>Briga (2d6), poder de lutador</td></tr>
                                <tr><td>14º</td><td>Poder de lutador</td></tr>
                                <tr><td>15º</td><td>Casca grossa (Con+3), poder de lutador</td></tr>
                                <tr><td>16º</td><td>Poder de lutador</td></tr>
                                <tr><td>17º</td><td>Briga (2d8), poder de lutador</td></tr>
                                <tr><td>18º</td><td>Poder de lutador</td></tr>
                                <tr><td>19º</td><td>Casca grossa (Con+4), poder de lutador</td></tr>
                                <tr><td>20º</td><td>Dono da rua (2d10), poder de lutador</td></tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section id="poderes" class="content-section">
                    <h2>Poderes de Lutador</h2>

                    <div class="class-power-block">
                        <p><strong>Agonia Iluminada.</strong> Você aprende e é capaz de lançar apenas sobre si mesmo a magia Purificação como ação de movimento. <strong>Pré-requisito:</strong> treinado em Misticismo, Sab 1.</p>

                        <p><strong>Até Acertar.</strong> Se você errar um ataque desarmado, recebe um bônus cumulativo de +2 em testes de ataque e rolagens de dano desarmado contra o mesmo oponente. Os bônus terminam quando você acertar um ataque ou no fim da cena, o que acontecer primeiro.</p>

                        <p><strong>Aumento de Atributo.</strong> Você recebe +1 em um atributo. Você pode escolher este poder várias vezes, mas apenas uma vez por patamar para um mesmo atributo.</p>

                        <p><strong>Braços Calejados.</strong> Se você não estiver usando armadura, soma sua Força na Defesa, limitado pelo seu nível.</p>

                        <p><strong>Cabeçada.</strong> Quando faz um ataque desarmado, você pode gastar 2 PM. Se fizer isso, o oponente fica desprevenido contra este ataque. Você só pode usar este poder uma vez por cena contra um mesmo alvo.</p>

                        <p><strong>Caminho Suave.</strong> Quando faz um teste de manobra de combate, você pode gastar uma quantidade de PM à sua escolha, limitada por sua Sabedoria. Para cada PM gasto, recebe +2 no teste. Este bônus é dobrado contra ameaças do tipo lacaio. <strong>Pré-requisito:</strong> Sabedoria 2.</p>

                        <p><strong>Chave.</strong> Se estiver agarrando uma criatura e fizer um teste de manobra contra ela para causar dano, o dano desarmado aumenta em um passo. <strong>Pré-requisitos:</strong> Int 1, Lutador de Chão, 4º nível de lutador.</p>

                        <p><strong>Confiança dos Ringues.</strong> Quando um inimigo erra um ataque corpo a corpo contra você, você recebe 2 PM temporários cumulativos. Você pode ganhar um máximo de PM temporários por cena igual ao seu nível. Esses pontos desaparecem no final da cena. <strong>Pré-requisito:</strong> 8º nível de lutador.</p>

                        <p><strong>Convencido.</strong> Acostumado a contar apenas com seus músculos, você adquiriu certo desdém por artes mais sofisticadas. Você recebe resistência a medo e mental +5.</p>

                        <p><strong>Corpo de Adamante.</strong> Seus ataques desarmados ignoram 10 pontos de redução de dano do alvo, se houver. <strong>Pré-requisito:</strong> 8º nível de lutador.</p>

                        <p><strong>Corpo Fechado.</strong> Você pode gastar 1 PM para somar sua Constituição como bônus em um teste de resistência. Esse bônus é cumulativo com o atributo-chave da perícia.</p>

                        <p><strong>Dança de Batalha.</strong> Você pode gastar uma ação de movimento e 1 PM para começar uma dança de batalha. Enquanto estiver dançando, recebe +2 na Defesa, em Acrobacia e em testes de Enganação para fintar. A partir do 7º nível, e novamente a partir do 15º nível, pode gastar +1 PM para aumentar esses bônus em +2 por PM adicional. A dança dura até o fim da cena, até você interrompê-la ou até sofrer uma condição de atordoamento ou de movimento. <strong>Pré-requisitos:</strong> treinado em Acrobacia e Atuação.</p>

                        <p><strong>Escarificação.</strong> Você recebe bônus temporário de +1 em Força para cada dado de dano que receba até o final da cena, limitado por sua Constituição. <strong>Pré-requisito:</strong> treinado em Vontade, Con 1.</p>

                        <p><strong>Escudo de Punhos.</strong> Você recebe um bônus na Defesa igual à quantidade de ataques desarmados que acertou no seu turno. Esse bônus dura até o começo do seu próximo turno.</p>

                        <p><strong>Fluxo de Axé.</strong> Você aprende uma magia entre Aperto Gélido, Carícia Fétida, Toque Chocante ou Infligir Ferimentos, com CD baseada em Sabedoria. Quando usa o aprimoramento dessas magias que permite fazer um ataque como parte da execução, recebe +2 nesse teste de ataque caso use um ataque desarmado. Você pode aprender este poder duas vezes, uma para cada magia. <strong>Pré-requisitos:</strong> Sexto Sentido, treinado em Misticismo.</p>

                        <p><strong>Fluxo de Axé Acelerado.</strong> Quando faz um ataque relâmpago, você substitui um de seus ataques desarmados por uma conjuração das magias Toque Chocante, Infligir Ferimentos, Toque Álgido ou Toque Vampírico. A magia deve usar o aprimoramento que permite fazer um ataque como parte da execução da magia e nenhum outro. <strong>Pré-requisito:</strong> Fluxo de Axé.</p>

                        <p><strong>Fluxo de Axé Superior.</strong> Você aprende a magia Toque Álgido ou Toque Vampírico, à sua escolha, com CD baseada em Sabedoria. Quando usa o aprimoramento dessas magias que permite fazer um ataque como parte da execução, seu ataque desarmado causa um dado de dano adicional do mesmo tipo. Você pode aprender este poder duas vezes, uma para cada magia. <strong>Pré-requisito:</strong> Fluxo de Axé.</p>

                        <p><strong>Golpe Baixo.</strong> Quando faz um ataque desarmado, você pode gastar 2 PM. Se acertar, o oponente deve fazer um teste de Fortitude contra CD Força. Se falhar, fica atordoado por uma rodada. Esse efeito só pode afetar o mesmo alvo uma vez por cena.</p>

                        <p><strong>Golpe Imprudente.</strong> Quando usa Golpe Relâmpago, você pode atacar de forma impulsiva. Se fizer isso, seus ataques desarmados recebem um dado de dano extra do mesmo tipo, mas você sofre –5 na Defesa até o início de seu próximo turno.</p>

                        <p><strong>Improviso de Combate.</strong> Você pode usar uma arma improvisada sem penalidades nos testes de ataque. O dano e os efeitos dessa arma são similares aos de uma arma do mesmo tamanho, determinados pelo mestre.</p>

                        <p><strong>Imobilização.</strong> Se estiver agarrando uma criatura, pode gastar uma ação completa para imobilizá-la. Faça um teste de manobra contra ela. Se passar, a criatura fica indefesa e só pode tentar se soltar. Se escapar da imobilização, ainda fica agarrada. Enquanto imobiliza uma criatura, você sofre as penalidades de agarrar. <strong>Pré-requisitos:</strong> Chave, 8º nível de lutador.</p>

                        <p><strong>Língua dos Becos.</strong> Você pode pagar 1 PM para usar sua Força no lugar de Carisma em um teste de perícia baseada em Carisma. <strong>Pré-requisitos:</strong> For 1, treinado em Intimidação.</p>

                        <p><strong>Lutador de Chão.</strong> Você recebe +2 em testes de ataque para agarrar e derrubar.</p>

                        <p><strong>Trincado.</strong> Esculpido à exaustão, seu corpo tornou-se uma máquina. Você soma sua Constituição nas rolagens de dano desarmado. <strong>Pré-requisitos:</strong> Con 3, Sarado, 10º nível de lutador.</p>

                        <p><strong>Trocação.</strong> Quando começa a bater, você não para mais. Ao acertar um ataque desarmado, pode fazer outro ataque desarmado contra o mesmo alvo, pagando uma quantidade de PM igual à quantidade de ataques já realizados no turno. Você pode continuar até errar um ataque ou não ter mais PM. <strong>Pré-requisito:</strong> 6º nível de lutador.</p>

                        <p><strong>Trocação Tumultuosa.</strong> Quando usa a ação agredir para fazer um ataque desarmado, você pode gastar 2 PM para atingir todas as criaturas adjacentes, incluindo aliados. Use antes de rolar o ataque e compare o resultado contra a Defesa de cada criatura. <strong>Pré-requisitos:</strong> Trocação, 8º nível de lutador.</p>

                        <p><strong>Valentão.</strong> Você recebe +2 em testes de ataque e rolagens de dano contra oponentes caídos, desprevenidos, flanqueados ou indefesos.</p>

                        <p><strong>Vingativa.</strong> Uma vez por turno, se alguém falhar em um ataque corpo a corpo, você pode gastar 1 PM para usar a manobra Derrubar como reação.</p>

                        <p><strong>Voadora.</strong> Quando faz uma investida desarmada, você pode gastar 2 PM. Se fizer isso, recebe +1d6 no dano para cada 3m que se deslocar até chegar ao oponente, limitado pelo seu nível.</p>

                        <p><strong>Voadora Implacável.</strong> Quando usa Voadora, pode gastar +1 PM para empurrar o alvo em 3m e derrubá-lo. Inimigos posicionados atrás do alvo sofrem 1d6 de dano para cada 3m que você se deslocou na Voadora. <strong>Pré-requisitos:</strong> Voadora, 9º nível de lutador.</p>
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