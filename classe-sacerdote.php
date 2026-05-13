<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sacerdote - Pindorama RPG</title>

    <link rel="stylesheet" href="assets/css/ficha.css" />
    <link rel="stylesheet" href="assets/css/classes.css?v=20260513a" />
</head>

<body>
    <main class="page-wrapper classes-page">

        <header class="top-actions classes-topbar">
            <div>
                <h1>Sacerdote</h1>
                <p>Classe dedicada à fé, aos rituais, à canalização divina e à defesa dos ideais de uma divindade.</p>
            </div>

            <div class="actions">
                <a class="system-link-btn" href="index.php">Menu</a>
                <a class="system-link-btn" href="classes.php">Classes</a>
                <a class="system-link-btn" href="ficha.php">Ficha</a>
            </div>
        </header>

        <?php
            $cb_class_slug = 'sacerdote';
            $cb_class_name = 'Sacerdote';
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
                        <a class="toc-link toc-level-2" href="#tabela-sacerdote">O Sacerdote</a>
                        <a class="toc-link toc-level-2" href="#canalizar">Canalizar Energia</a>
                        <a class="toc-link toc-level-2" href="#poderes">Poderes de Sacerdote</a>
                    </nav>
                </div>
            </aside>

            <article class="sheet classes-content" id="classesContent">

                <section id="descricao" class="content-section">
                    <h2>Sacerdote</h2>

                    <p>
                        Os sacerdotes atuam como intermediários entre o mundo mortal e os distantes planos divinos.
                        Tão diversos quanto os deuses a quem servem, buscam personificar a vontade de suas divindades
                        e agir como instrumentos vivos de seus desígnios.
                    </p>

                    <p>
                        Esses fiéis não se limitam a ser simples acólitos ou servos. São investidos com poder divino.
                        Ao estenderem os braços, cerrarem os olhos em prece, entoarem cânticos de batalha, lançarem
                        maldições ou erguerem um símbolo sagrado de sua fé, realizam feitos que desafiam a imaginação.
                    </p>

                    <p>
                        Brilhar com luz própria, irradiar cura sobre companheiros feridos, desferir golpes poderosos
                        abrindo caminho pelas linhas inimigas ou banir criaturas hostis são feitos notáveis daqueles
                        que deram os primeiros passos nessa jornada.
                    </p>

                    <p>
                        Já os sacerdotes mais experientes, que fortaleceram sua ligação com suas divindades, atingem
                        o patamar de realizar verdadeiros milagres: invocar entidades divinas, controlar elementos naturais
                        e até ressuscitar os mortos. Essa maestria, porém, é rara, pois a maioria dos devotos serve como
                        liderança espiritual em comunidades, sem o toque direto do transcendental.
                    </p>

                    <p>
                        A diversidade dos deuses manifesta-se claramente na aparência e nos modos de seus devotos.
                        No Império do Brasil, Patriotas reverenciam divindades como Ruah HaQodesh ou Yéxua, considerando
                        seus sacerdotes figuras confiáveis para batismos, casamentos e funerais. Entre os povos Zambi,
                        sacerdotes dedicados a entidades como Iansã, Xangô ou Exu participam de rituais com tambores,
                        danças, cânticos, oferendas e sacrifícios.
                    </p>

                    <p>
                        Nos povos originários de Pindorama, celebrações entoadas nas florestas ao redor de grandes fogueiras
                        podem ser dedicadas a deuses como Tupã, Angra ou Guaraci. Também existem sacerdotes vistos como figuras
                        estranhas e sinistras, envolvidos em rituais misteriosos que afastam as massas.
                    </p>

                    <p>
                        Enquanto alguns sacerdotes se dedicam a causas benevolentes, auxiliando enfermos e protegendo comunidades,
                        outros assumem a liderança de cultos obscuros que instigam guerras em nome de suas divindades. Mesmo entre
                        rebanhos, templos e terreiros, muitos sacerdotes aventureiros partem em missões sagradas como agentes
                        terrenos da vontade divina.
                    </p>
                </section>

                <section id="caracteristicas" class="content-section">
                    <h2>Características de Classe</h2>

                    <div class="class-power-block">
                        <p>
                            <strong>Pontos de Vida.</strong> Um sacerdote começa com
                            <strong>16 pontos de vida + Constituição</strong> e ganha
                            <strong>4 PV + Constituição</strong> por nível.
                        </p>

                        <p><strong>Pontos de Mana.</strong> <strong>5 PM por nível.</strong></p>

                        <p>
                            <strong>Perícias.</strong> <strong>Religião (Sab)</strong> e <strong>Vontade (Sab)</strong>,
                            mais <strong>2</strong> à sua escolha entre
                            <strong>Conhecimento (Int)</strong>, <strong>Cura (Sab)</strong>,
                            <strong>Diplomacia (Car)</strong>, <strong>Fortitude (Con)</strong>,
                            <strong>Iniciativa (Des)</strong>, <strong>Intuição (Sab)</strong>,
                            <strong>Luta (For)</strong>, <strong>Misticismo (Int)</strong>,
                            <strong>Nobreza (Int)</strong>, <strong>Ofício (Int)</strong>
                            e <strong>Percepção (Sab)</strong>.
                        </p>

                        <p><strong>Proficiências.</strong> Armas simples, armaduras leves, armaduras médias e escudos.</p>
                    </div>
                </section>

                <section id="habilidades" class="content-section">
                    <h2>Habilidades de Classe</h2>

                    <div class="class-power-block">
                        <p>
                            <strong>Devoto.</strong> Você se torna devoto de uma divindade, santo, orixá, entidade ou força sagrada
                            compatível com sua tradição. Sua fé define parte importante de sua identidade, seus códigos de conduta,
                            suas restrições e suas bênçãos.
                        </p>

                        <p>
                            <strong>Magias.</strong> Você pode lançar magias divinas de <strong>1º círculo</strong>.
                            A cada quatro níveis, pode lançar magias de um círculo maior:
                            <strong>2º círculo no 5º nível</strong>, <strong>3º círculo no 9º nível</strong>,
                            <strong>4º círculo no 13º nível</strong> e <strong>5º círculo no 17º nível</strong>.
                        </p>

                        <p>
                            Seu atributo-chave para lançar magias é <strong>Sabedoria</strong>, e você soma sua Sabedoria
                            ao seu total de PM. A forma de suas magias pode variar de acordo com sua tradição: preces, rezas,
                            cânticos, pontos, rituais, símbolos sagrados, gestos litúrgicos ou oferendas.
                        </p>

                        <p>
                            <strong>Canalizar Energia.</strong> No <strong>2º nível</strong>, você pode gastar uma ação padrão
                            e PM para liberar uma onda de luz ou trevas, conforme a natureza de sua divindade. Luz cura criaturas
                            vivas e causa dano em mortos-vivos; trevas causa dano em criaturas vivas e cura mortos-vivos.
                        </p>

                        <p>
                            <strong>Poder de Sacerdote.</strong> No <strong>2º nível</strong>, e a cada nível seguinte,
                            você recebe um poder de sacerdote à sua escolha.
                        </p>

                        <p>
                            <strong>Avatar.</strong> No <strong>20º nível</strong>, você pode gastar uma ação completa
                            e <strong>15 PM</strong> para lançar três magias de seu santo, de qualquer círculo, incluindo magias
                            que você não conhece, como ação livre e sem gastar PM. Você ainda precisa pagar outros custos e
                            aprimoramentos. Após usar esta habilidade, fica atordoado por <strong>1d4 rodadas</strong>, mesmo
                            que seja imune a essa condição.
                        </p>
                    </div>
                </section>

                <section id="tabela-sacerdote" class="content-section">
                    <h2>O Sacerdote</h2>

                    <div class="classes-table-wrap">
                        <table class="classes-table level-table">
                            <thead>
                                <tr>
                                    <th>Nível</th>
                                    <th>Habilidades de Classe</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr><td>1º</td><td>Devoto, magias (1º círculo)</td></tr>
                                <tr><td>2º</td><td>Canalizar energia (1d6), poder de sacerdote</td></tr>
                                <tr><td>3º</td><td>Poder de sacerdote</td></tr>
                                <tr><td>4º</td><td>Poder de sacerdote</td></tr>
                                <tr><td>5º</td><td>Magias (2º círculo), poder de sacerdote</td></tr>
                                <tr><td>6º</td><td>Canalizar energia (2d6), poder de sacerdote</td></tr>
                                <tr><td>7º</td><td>Poder de sacerdote</td></tr>
                                <tr><td>8º</td><td>Poder de sacerdote</td></tr>
                                <tr><td>9º</td><td>Magias (3º círculo), poder de sacerdote</td></tr>
                                <tr><td>10º</td><td>Canalizar energia (3d6), poder de sacerdote</td></tr>
                                <tr><td>11º</td><td>Poder de sacerdote</td></tr>
                                <tr><td>12º</td><td>Poder de sacerdote</td></tr>
                                <tr><td>13º</td><td>Magias (4º círculo), poder de sacerdote</td></tr>
                                <tr><td>14º</td><td>Canalizar energia (4d6), poder de sacerdote</td></tr>
                                <tr><td>15º</td><td>Poder de sacerdote</td></tr>
                                <tr><td>16º</td><td>Poder de sacerdote</td></tr>
                                <tr><td>17º</td><td>Magias (5º círculo), poder de sacerdote</td></tr>
                                <tr><td>18º</td><td>Canalizar energia (5d6), poder de sacerdote</td></tr>
                                <tr><td>19º</td><td>Poder de sacerdote</td></tr>
                                <tr><td>20º</td><td>Avatar, poder de sacerdote</td></tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section id="canalizar" class="content-section">
                    <h2>Canalizar Energia</h2>

                    <div class="class-power-block">
                        <p>
                            <strong>Energia Expansiva.</strong> Se sua divindade canaliza energia expansiva, você libera uma onda
                            de luz que afeta criaturas à sua escolha em alcance curto. Para cada PM gasto, a luz cura
                            <strong>1d6 PV</strong> em criaturas vivas e causa <strong>1d6 pontos de dano de luz</strong>
                            em mortos-vivos. Mortos-vivos podem fazer um teste de Vontade contra CD Sabedoria para reduzir
                            o dano à metade.
                        </p>

                        <p>
                            <strong>Energia Retrativa.</strong> Se sua divindade canaliza energia retrativa, você libera uma onda
                            de trevas. O efeito é inverso: causa dano de trevas a criaturas vivas e cura mortos-vivos.
                        </p>

                        <p>
                            <strong>Progressão.</strong> A cada quatro níveis, você pode gastar +1 PM para aumentar a cura
                            ou o dano da habilidade, conforme a progressão da classe.
                        </p>
                    </div>
                </section>

                <section id="poderes" class="content-section">
                    <h2>Poderes de Sacerdote</h2>

                    <div class="class-power-block">
                        <p><strong>Alcance Divino.</strong> Quando lança uma magia divina, você pode gastar +1 PM para ampliar o alcance em um passo. Se a magia já tiver esse aprimoramento, você pode acumular o bônus, pagando os respectivos custos e aumentando o alcance em dois passos.</p>

                        <p><strong>Aumento de Atributo.</strong> Você recebe +1 em um atributo. Você pode escolher este poder várias vezes, mas apenas uma vez por patamar para um mesmo atributo.</p>

                        <p><strong>Autoridade Religiosa.</strong> Você possui uma posição formal em sua ordem. Os efeitos variam de acordo com os deuses e tradições. Como regra geral, você recebe +5 em testes de Diplomacia ou Intimidação ao lidar com devotos de seu santo e paga metade do preço de itens alquímicos, poções e serviços em templos de sua ordem. <strong>Pré-requisito:</strong> 5º nível de sacerdote.</p>

                        <p><strong>Canalizar Amplo.</strong> Quando usa a habilidade Canalizar Energia, pode gastar +2 PM para aumentar o alcance dela para médio. <strong>Pré-requisito:</strong> 3º nível de sacerdote.</p>

                        <p><strong>Canalizar Golpe.</strong> Quando realiza um ataque, você pode, como ação livre, ativar a habilidade Canalizar Energia. Se errar o ataque, gasta os PM, mas não ativa a habilidade. Você também pode canalizar golpes de aliados que tenham tendências alinhadas com sua divindade.</p>

                        <p><strong>Comunhão Vital.</strong> Quando lança uma magia que cure uma criatura, você pode pagar +2 PM para que outra criatura em alcance curto, incluindo você mesmo, recupere uma quantidade de pontos de vida igual à metade dos PV da cura original.</p>

                        <p><strong>Conhecimento Mágico.</strong> Você aprende duas magias divinas de qualquer círculo que possa lançar. Você pode escolher este poder quantas vezes quiser.</p>

                        <p><strong>Consagrar.</strong> Você pode gastar uma ação de movimento para executar uma breve reverência de sua fé. Se fizer isso, a CD para resistir à sua próxima habilidade de sacerdote, desde que usada até o final de seu próximo turno, aumenta em +2.</p>

                        <p><strong>Conjuração Poderosa.</strong> Você soma sua Sabedoria em suas magias que causam dano ou curam. <strong>Pré-requisito:</strong> 8º nível de sacerdote.</p>

                        <p><strong>Expulsar/Comandar Mortos-Vivos.</strong> Você pode gastar uma ação padrão e 3 PM para expulsar, se sua divindade canaliza energia expansiva, ou comandar, se canaliza energia retrativa, todos os mortos-vivos em alcance curto. Mortos-vivos expulsos ficam apavorados por 1d6 rodadas. Mortos-vivos comandados não inteligentes ficam sob suas ordens por um dia, até um limite de ND somado igual a seu nível +3; mortos-vivos inteligentes ficam fascinados por uma rodada. Mortos-vivos têm direito a um teste de Vontade contra CD Sabedoria para evitar esses efeitos.</p>

                        <p><strong>Fé Residual.</strong> Após lançar uma magia divina ou poder de sacerdote, você pode gastar +1 PM para imbuir uma arma que esteja empunhando. No próximo ataque com essa arma, ela ganha um dado de dano adicional. Se errar o ataque, perde o efeito sem recuperar o PM gasto.</p>

                        <p><strong>Fiéis.</strong> Você atrai um pequeno grupo de seguidores religiosos. Você define os detalhes desses seguidores, como quantidade, raça e outras características, mas o mestre deve aprovar qualquer escolha. Seus fiéis funcionam como apoio narrativo e religioso, podendo ajudar em rituais, tarefas comunitárias e missões de sua fé conforme a decisão do mestre.</p>

                        <p><strong>Liturgia Marcial.</strong> Você pode expressar sua fé por meio do combate, usando símbolos, armas, cânticos ou gestos sagrados para reforçar sua atuação em batalha. O efeito exato deve ser alinhado com sua divindade e com a decisão do mestre.</p>

                        <p><strong>Liturgia Mágica.</strong> Suas preces e rituais tornam suas magias mais eficientes. Você pode usar elementos litúrgicos para reforçar efeitos mágicos, ampliar impacto narrativo ou justificar aprimoramentos divinos conforme sua tradição.</p>

                        <p><strong>Prece de Combate.</strong> Você pode transformar uma oração rápida em impulso de batalha, fortalecendo aliados ou preparando sua próxima ação divina, conforme a situação e a aprovação do mestre.</p>

                        <p><strong>Símbolo Sagrado.</strong> Você carrega ou ergue um símbolo de sua fé como foco de poder. Esse símbolo pode ser um objeto litúrgico, guia, cruz, ferramenta ritual, imagem, insígnia, colar, ponto riscado ou outro elemento sagrado apropriado à sua tradição.</p>

                        <p><strong>Voz da Fé.</strong> Sua palavra carrega autoridade espiritual. Você pode influenciar devotos, intimidar hereges, fortalecer aliados ou conduzir rituais com maior presença, especialmente quando age em nome de sua divindade.</p>
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