<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Feiticeiro - Pindorama RPG</title>

    <link rel="stylesheet" href="assets/css/ficha.css" />
    <link rel="stylesheet" href="assets/css/classes.css?v=20260513a" />
</head>

<body>
    <main class="page-wrapper classes-page">

        <header class="top-actions classes-topbar">
            <div>
                <h1>Feiticeiro</h1>
                <p>Classe dedicada à magia inata, às linhagens sobrenaturais e ao poder ancestral que corre no sangue.</p>
            </div>

            <div class="actions">
                <a class="system-link-btn" href="index.php">Menu</a>
                <a class="system-link-btn" href="classes.php">Classes</a>
                <a class="system-link-btn" href="ficha.php">Ficha</a>
            </div>
        </header>

        <?php
            $cb_class_slug = 'feiticeiro';
            $cb_class_name = 'Feiticeiro';
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
                        <a class="toc-link toc-level-2" href="#tabela-feiticeiro">O Feiticeiro</a>
                        <a class="toc-link toc-level-2" href="#familiares">Familiares Arcanos</a>
                        <a class="toc-link toc-level-2" href="#pacto-linhagem">Pacto de Linhagem</a>
                        <a class="toc-link toc-level-2" href="#linhagens">Linhagens Sobrenaturais</a>
                        <a class="toc-link toc-level-2" href="#poderes">Poderes de Feiticeiro</a>
                    </nav>
                </div>
            </aside>

            <article class="sheet classes-content" id="classesContent">

                <section id="descricao" class="content-section">
                    <h2>Feiticeiro</h2>

                    <p>
                        Ser um conjurador não foi uma escolha sua, mas uma dádiva inata.
                        O fluxo mágico corre em suas veias, e uma magia caótica anseia por ser domada.
                    </p>

                    <p>
                        As origens desse poder são diversas: talvez algum ancestral seu tenha sido marcado por uma entidade misteriosa,
                        comungado com uma criatura dos primórdios caóticos ou sido influenciado por um ritual ocultista perdido no tempo.
                        Na maioria das vezes, esses poderes despertam de forma aparentemente aleatória.
                    </p>

                    <p>
                        Alguns feiticeiros não conseguem decifrar a origem desse poder, enquanto outros o relacionam a eventos
                        enigmáticos de suas vidas. Encontros oníricos com um caboclo, ou bênçãos concedidas por seres espirituais
                        da natureza no nascimento de uma criança, podem ser a fonte desse dom mágico.
                    </p>

                    <p>
                        Os feiticeiros se diferenciam dos arcanistas, que estudam grimórios antigos e runas místicas, e dos sacerdotes,
                        que buscam magias por meio das divindades. Em vez disso, aprendem a explorar e canalizar sua própria magia inata,
                        descobrindo novas e surpreendentes formas de liberar seu potencial.
                    </p>

                    <p>
                        Em Pindorama, os feiticeiros são raros e geralmente se envolvem em jornadas de aventura para compreender melhor
                        a força mágica que os cerca, desvendar o mistério de sua origem ou até mesmo encontrar uma forma de libertar-se
                        desse poder. Apesar de conhecerem menos magias que outros conjuradores, compensam isso com flexibilidade e potência.
                    </p>
                </section>

                <section id="caracteristicas" class="content-section">
                    <h2>Características de Classe</h2>

                    <div class="class-power-block">
                        <p><strong>Pontos de Vida.</strong> Um feiticeiro começa com <strong>12 pontos de vida + Constituição</strong> e ganha <strong>3 PV + Constituição</strong> por nível.</p>

                        <p><strong>Pontos de Mana.</strong> <strong>5 PM por nível.</strong></p>

                        <p>
                            <strong>Perícias.</strong> <strong>Misticismo (Int)</strong> e <strong>Vontade (Sab)</strong> ou
                            <strong>Fortitude (Con)</strong>, mais <strong>3</strong> à sua escolha entre
                            <strong>Conhecimento (Int)</strong>, <strong>Diplomacia (Car)</strong>, <strong>Enganação (Car)</strong>,
                            <strong>Guerra (Int)</strong>, <strong>Iniciativa (Des)</strong>, <strong>Intimidação (Car)</strong>,
                            <strong>Intuição (Sab)</strong>, <strong>Investigação (Int)</strong>, <strong>Ofício (Int)</strong>
                            e <strong>Percepção (Sab)</strong>.
                        </p>

                        <p><strong>Proficiências.</strong> Nenhuma.</p>
                    </div>
                </section>

                <section id="habilidades" class="content-section">
                    <h2>Habilidades de Classe</h2>

                    <div class="class-power-block">
                        <p>
                            <strong>Magias.</strong> Você pode lançar magias arcanas de <strong>1º círculo</strong>.
                            A cada quatro níveis, pode lançar magias de um círculo maior:
                            <strong>2º círculo no 5º nível</strong>, <strong>3º círculo no 9º nível</strong>,
                            <strong>4º círculo no 13º nível</strong> e <strong>5º círculo no 17º nível</strong>.
                        </p>

                        <p>
                            Você começa com <strong>três magias de 1º círculo</strong>. A cada nível, aprende uma magia
                            de qualquer círculo que possa lançar. Seu atributo-chave para magias é <strong>Carisma</strong>,
                            e você soma seu Carisma ao seu total de PM.
                        </p>

                        <p>
                            <strong>Linhagem Mágica.</strong> Você lança magias através de um poder inato que corre em seu sangue.
                            Escolha uma linhagem como origem de seus poderes. Você recebe a <strong>herança básica</strong>
                            da linhagem escolhida.
                        </p>

                        <p>
                            Você não precisa decorar magias, mas sua capacidade de aprender magias é limitada: você aprende
                            uma magia nova a cada <strong>nível ímpar</strong>, como 3º, 5º, 7º e assim por diante, em vez de aprender
                            uma magia a cada nível. Seu atributo-chave para magias é <strong>Carisma</strong>.
                        </p>

                        <p>
                            <strong>Raio Arcano.</strong> No <strong>2º nível</strong>, você recebe acesso ao poder mágico ofensivo
                            característico dos feiticeiros, capaz de canalizar energia bruta contra um alvo.
                        </p>

                        <p>
                            <strong>Poder de Feiticeiro.</strong> No <strong>2º nível</strong>, e a cada nível seguinte,
                            você escolhe um dos poderes de feiticeiro.
                        </p>

                        <p>
                            <strong>Herança Aprimorada.</strong> No <strong>6º nível</strong>, sua linhagem desperta uma manifestação
                            mais intensa, concedendo o benefício aprimorado da linhagem escolhida.
                        </p>

                        <p>
                            <strong>Herança Superior.</strong> No <strong>11º nível</strong>, sua linhagem atinge um grau elevado
                            de manifestação, concedendo o benefício superior da linhagem escolhida.
                        </p>

                        <p>
                            <strong>Alta Arcana.</strong> No <strong>20º nível</strong>, seu domínio das artes arcanas é total.
                            O custo em PM de suas magias arcanas é reduzido à metade, após aplicar aprimoramentos e quaisquer
                            outros efeitos que reduzam custo.
                        </p>
                    </div>
                </section>

                <section id="tabela-feiticeiro" class="content-section">
                    <h2>O Feiticeiro</h2>

                    <div class="classes-table-wrap">
                        <table class="classes-table level-table">
                            <thead>
                                <tr>
                                    <th>Nível</th>
                                    <th>Habilidades de Classe</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr><td>1º</td><td>Magias, linhagem mágica</td></tr>
                                <tr><td>2º</td><td>Raio arcano, poder de feiticeiro</td></tr>
                                <tr><td>3º</td><td>Poder de feiticeiro</td></tr>
                                <tr><td>4º</td><td>Poder de feiticeiro</td></tr>
                                <tr><td>5º</td><td>Magias (2º círculo), poder de feiticeiro</td></tr>
                                <tr><td>6º</td><td>Herança aprimorada, poder de feiticeiro</td></tr>
                                <tr><td>7º</td><td>Poder de feiticeiro</td></tr>
                                <tr><td>8º</td><td>Poder de feiticeiro</td></tr>
                                <tr><td>9º</td><td>Magias (3º círculo), poder de feiticeiro</td></tr>
                                <tr><td>10º</td><td>Poder de feiticeiro</td></tr>
                                <tr><td>11º</td><td>Herança superior, poder de feiticeiro</td></tr>
                                <tr><td>12º</td><td>Poder de feiticeiro</td></tr>
                                <tr><td>13º</td><td>Magias (4º círculo), poder de feiticeiro</td></tr>
                                <tr><td>14º</td><td>Poder de feiticeiro</td></tr>
                                <tr><td>15º</td><td>Poder de feiticeiro</td></tr>
                                <tr><td>16º</td><td>Poder de feiticeiro</td></tr>
                                <tr><td>17º</td><td>Magias (5º círculo), poder de feiticeiro</td></tr>
                                <tr><td>18º</td><td>Poder de feiticeiro</td></tr>
                                <tr><td>19º</td><td>Poder de feiticeiro</td></tr>
                                <tr><td>20º</td><td>Alta arcana, poder de feiticeiro</td></tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section id="familiares" class="content-section">
                    <h2>Familiares Arcanos</h2>

                    <div class="class-power-block">
                        <p>
                            <strong>Familiar.</strong> Um familiar é uma criatura mágica. Em termos de jogo, é um parceiro especial
                            com o qual você pode se comunicar telepaticamente em alcance longo. Ele obedece às suas ordens,
                            mas ainda está limitado ao que uma criatura de sua espécie pode fazer.
                        </p>

                        <p>
                            Se o familiar morrer, você fica <strong>atordoado por uma rodada</strong>. Você pode invocar um novo familiar
                            com um ritual que exige <strong>um dia</strong> e <strong>M$ 100</strong> em ingredientes.
                        </p>
                    </div>
                </section>

                <section id="pacto-linhagem" class="content-section">
                    <h2>Pacto de Linhagem</h2>

                    <div class="class-power-block">
                        <p>
                            <strong>Espíritos de Linhagem.</strong> Os espíritos de linhagem são um tipo especial de aliado ligado
                            à herança sobrenatural do feiticeiro.
                        </p>

                        <p>
                            Para usar um aliado da sua linhagem sobrenatural, você precisa primeiro gastar uma ação de movimento
                            e <strong>2 PM</strong> para evocá-lo. Para isso, precisa de um material específico para cada parceiro.
                        </p>

                        <p>
                            Em seu turno, você pode dar uma ordem para o espírito usando uma ação de movimento.
                            Algumas dessas ações possuem custo em PM, que deve ser pago por você.
                        </p>
                    </div>
                </section>

                <section id="linhagens" class="content-section">
                    <h2>Linhagens Sobrenaturais</h2>

                    <p>
                        No sangue do feiticeiro reside um poder ancestral: uma herança sagrada de antepassados sobrenaturais,
                        sejam eles majestosos dragões, fadas encantadoras ou criaturas míticas de Pindorama. Além do dom de
                        conjurar magias, o feiticeiro carrega uma fração do poder primordial desses ancestrais, uma força que
                        pode ser lapidada ao longo da jornada.
                    </p>

                    <div class="class-power-block">
                        <p>
                            <strong>Linhagem do Boitatá.</strong> Tribos que vivem próximas a Axuí cultuam os boitatás; em troca,
                            esses seres míticos agraciaram um antepassado seu com poderes mágicos. Escolha um tipo de dano entre
                            ácido, eletricidade, fogo ou frio.
                        </p>

                        <p><strong>Básica.</strong> Você soma seu Carisma aos seus pontos de vida iniciais e recebe redução de dano 5 ao tipo escolhido.</p>

                        <p><strong>Aprimorada.</strong> Suas magias do elemento escolhido custam –1 PM e causam +1 ponto de dano por dado.</p>

                        <p><strong>Superior.</strong> Você se torna imune ao dano do tipo escolhido. Além disso, sempre que reduz um ou mais inimigos a 0 PV ou menos com uma magia do elemento escolhido, recebe PM temporários iguais ao círculo da magia.</p>

                        <p>
                            <strong>Linhagem do Boto-cor-de-rosa.</strong> O Boto-cor-de-rosa seduziu e se envolveu com um antepassado seu,
                            deixando marcas mágicas em sua linhagem.
                        </p>

                        <p>
                            <strong>Básica.</strong> Você pode lançar duas magias entre <strong>Amedrontar</strong>, <strong>Comando</strong>,
                            <strong>Despedaçar</strong>, <strong>Enfeitiçar</strong>, <strong>Hipnotismo</strong> ou <strong>Sono</strong>.
                            Essas magias usam Carisma como atributo-chave. Caso aprenda novamente uma dessas magias, seu custo diminui em –1 PM.
                        </p>

                        <p>
                            <strong>Linhagem dos Caboclos.</strong> Escolhido por uma divindade, um antepassado seu foi agraciado por poderes
                            mágicos dessa ordem de guerreiros espirituais.
                        </p>

                        <p>
                            <strong>Básica.</strong> Você se torna treinado em Luta e aprende a magia <strong>Arma Mágica (lança)</strong>.
                            Ataques com essa Arma Mágica usam Carisma em vez de Força nos testes de Luta.
                        </p>

                        <p>
                            <strong>Aprimorada.</strong> Quando usa a ação agredir, você pode gastar 2 PM para imbuir seu ataque com uma magia
                            que tenha toque como alcance. Você ainda deve pagar os custos da magia.
                        </p>

                        <p>
                            <strong>Superior.</strong> Quando luta com uma lança, seu dano aumenta em um passo. Se tiver Estilo de Uma Arma,
                            pode gastar 2 PM para rolar novamente um teste de ataque recém realizado.
                        </p>

                        <p>
                            <strong>Linhagem do Corpo Seco.</strong> Em tempos remotos, um antepassado ousou desafiar a morte com magia proibida.
                            Tocado pela ceifadora, foi rejeitado pelos deuses. A sombra desse ancestral rejeitado flui em suas veias.
                        </p>

                        <p>
                            <strong>Básica.</strong> Você aprende a lançar a magia <strong>Profanar</strong>. Sempre que a lança, pode acrescentar
                            um aprimoramento à sua escolha, pagando seu custo em PM. Caso aprenda essa magia novamente, seu custo diminui em –1 PM.
                        </p>

                        <p>
                            <strong>Aprimorada.</strong> Você pode gastar uma ação padrão e PM para liberar uma onda de trevas que afeta criaturas
                            à sua escolha em alcance curto. Para cada PM gasto, causa 1d6 de dano de trevas em criaturas vivas, ou cura 1d6 PV em mortos-vivos.
                        </p>

                        <p>
                            <strong>Superior.</strong> Nenhuma divindade aceita você em seu plano. Sempre que morre, volta à vida no final da cena
                            com metade dos PV, 0 PM e perde 1 ponto de Constituição permanente. Se sua Constituição chegar a –3, seu corpo e alma se desintegram.
                        </p>

                        <p>
                            <strong>Linhagem do Lobisomem.</strong> Algum antepassado seu foi atacado por um lobisomem e teve seu sangue corrompido.
                        </p>

                        <p>
                            <strong>Básica.</strong> Você pode gastar 1 PM para transformar seus dentes em presas afiadas até o fim da cena,
                            recebendo uma arma natural de mordida.
                        </p>
                    </div>
                </section>

                <section id="poderes" class="content-section">
                    <h2>Poderes de Feiticeiro</h2>

                    <div class="class-power-block">
                        <p><strong>Arcano de Batalha.</strong> Quando lança uma magia, você soma seu Carisma na rolagem de dano.</p>

                        <p><strong>Aumento de Atributo.</strong> Você recebe +1 em um atributo. Você pode escolher este poder várias vezes, mas apenas uma vez por patamar para um mesmo atributo.</p>

                        <p><strong>Carga de Energia: Combustão de Mana.</strong> Uma vez por rodada, quando lança uma magia ou habilidade mágica que causa dano, seu mana começa a fervilhar e você recebe uma carga de energia, até um limite máximo igual ao maior círculo de magia que pode lançar.</p>

                        <p><strong>Combustão de Mana.</strong> Para cada carga de energia acumulada, o custo total dos aprimoramentos de suas magias que causam dano é reduzido em –1 PM. Você perde todas as cargas acumuladas se passar uma rodada inteira sem ganhar uma carga de energia. <strong>Pré-requisitos:</strong> cinco magias que causam dano, 6º nível de feiticeiro.</p>

                        <p><strong>Disparo em Linha.</strong> Quando usa seu Disparo Elemental, você pode gastar 2 PM para atingir vários alvos. Faça um ataque à distância e compare-o com a Defesa de cada inimigo em uma linha de 9m. <strong>Pré-requisito:</strong> Raio Elemental.</p>

                        <p><strong>Energia Avassaladora.</strong> Quando usa Raio Elemental, você pode gastar 1 PM para ignorar a RD do alvo. A imunidade do alvo não é afetada. <strong>Pré-requisito:</strong> Raio Elemental.</p>

                        <p><strong>Envolto em Mistério.</strong> Sua aparência e postura assombrosas permitem manipular e assustar pessoas ignorantes ou supersticiosas. Como regra geral, você recebe +5 em Enganação e Intimidação contra pessoas não treinadas em Conhecimento ou Misticismo.</p>

                        <p><strong>Familiar.</strong> Você possui um animal de estimação mágico. Veja a seção Familiares Arcanos para detalhes.</p>

                        <p><strong>Fluxo de Mana.</strong> Você pode manter dois efeitos sustentados ativos simultaneamente com apenas uma ação livre, pagando o custo de cada efeito separadamente. <strong>Pré-requisito:</strong> 10º nível de feiticeiro.</p>

                        <p><strong>Fortalecimento Arcano.</strong> A CD para resistir às suas magias aumenta em +1. Se você puder lançar magias de 4º círculo, aumenta em +2. <strong>Pré-requisito:</strong> 5º nível de feiticeiro.</p>

                        <p><strong>Linhagem Cruzada.</strong> Você recebe a herança básica de uma segunda linhagem escolhida. <strong>Pré-requisito:</strong> 13º nível de feiticeiro.</p>

                        <p><strong>Magia de Linhagem.</strong> Você escolhe uma magia do 1º círculo que conheça e pode lançá-la em sua forma padrão sem custo de PM. <strong>Pré-requisito:</strong> Herança Aprimorada.</p>

                        <p><strong>Magia de Linhagem Aprimorada.</strong> Você escolhe uma magia do 2º círculo que conheça e pode lançá-la em sua forma padrão sem custo de PM. <strong>Pré-requisito:</strong> Herança Superior.</p>

                        <p><strong>Magia Perseguidora.</strong> Os testes para reduzir o dano de suas magias ou efeitos mágicos recebem bônus igual ao seu nível, em vez da metade.</p>

                        <p><strong>Magia Pungente.</strong> Quando lança uma magia, você pode pagar 1 PM para aumentar em +2 a CD para resistir a ela.</p>

                        <p><strong>Pacto de Linhagem.</strong> Você cria um vínculo mágico com um espírito da sua linhagem através de um ritual de magia. Em termos de jogo, ele é um parceiro que obedece às suas ordens e se arrisca para ajudá-lo. Você só recebe os benefícios do parceiro se puder evocá-lo. <strong>Pré-requisito:</strong> 6º nível de feiticeiro.</p>

                        <p><strong>Poder Mágico.</strong> Você recebe +1 ponto de mana por nível de feiticeiro. Quando sobe de nível, os PM recebidos por este poder aumentam de acordo.</p>

                        <p><strong>Resistência de Linhagem.</strong> Você recebe resistência a magias +5.</p>

                        <p><strong>Raio Arcano.</strong> Você pode gastar uma ação padrão para causar 1d8 pontos de dano de essência em um alvo em alcance curto. Esse dano aumenta em +1d8 para cada círculo de magia acima do 1º que você puder lançar. O alvo pode fazer um teste de Reflexos contra CD do atributo-chave para reduzir o dano à metade. O Raio Arcano conta como magia para efeitos de habilidades e itens que beneficiem suas magias.</p>

                        <p><strong>Raio Elemental.</strong> Quando usa Raio Arcano, você pode pagar 1 PM para que ele cause dano de ácido, eletricidade, fogo, frio ou trevas. Se o alvo falhar no teste de Reflexos, sofre uma condição conforme o tipo de dano: ácido deixa vulnerável por 1 rodada; eletricidade deixa ofuscado por 1 rodada; fogo deixa em chamas; frio deixa lento por 1 rodada; trevas impede cura de PV por 1 rodada. <strong>Pré-requisito:</strong> Raio Arcano.</p>

                        <p><strong>Raio Poderoso.</strong> Os dados de dano do seu Raio Arcano aumentam para d12 e o alcance dele aumenta para médio. <strong>Pré-requisito:</strong> Raio Arcano.</p>

                        <p><strong>Sangue Cristalino.</strong> Uma vez por rodada, quando lança uma magia que causa dano, seu mana começa a cristalizar e você recebe uma carga de energia elemental, até um limite máximo igual ao maior círculo de magia que pode lançar. Quando lança uma magia que causa dano, pequenos cristais se formam sobre seu corpo, fornecendo 5 PV temporários por carga de energia. Você perde todas as cargas se passar uma rodada inteira sem ganhar uma carga. <strong>Pré-requisitos:</strong> cinco magias que causam dano, 6º nível de personagem.</p>
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