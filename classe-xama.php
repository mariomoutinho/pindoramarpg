<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Xamã - Pindorama RPG</title>

    <link rel="stylesheet" href="assets/css/ficha.css" />
    <link rel="stylesheet" href="assets/css/classes.css?v=20260513a" />
</head>

<body>
    <main class="page-wrapper classes-page">

        <header class="top-actions classes-topbar">
            <div>
                <h1>Xamã</h1>
                <p>Classe dedicada aos espíritos selvagens, à cura, às visões, à transformação e ao domínio espiritual das forças da natureza.</p>
            </div>

            <div class="actions">
                <a class="system-link-btn" href="index.php">Menu</a>
                <a class="system-link-btn" href="classes.php">Classes</a>
                <a class="system-link-btn" href="ficha.php">Ficha</a>
            </div>
        </header>

        <?php
            $cb_class_slug = 'xama';
            $cb_class_name = 'Xamã';
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
                        <a class="toc-link toc-level-2" href="#tabela-xama">O Xamã</a>
                        <a class="toc-link toc-level-2" href="#forma-selvagem">Forma Selvagem</a>
                        <a class="toc-link toc-level-2" href="#aspectos">Aspectos da Natureza</a>
                        <a class="toc-link toc-level-2" href="#poderes">Poderes de Xamã</a>
                    </nav>
                </div>
            </aside>

            <article class="sheet classes-content" id="classesContent">

                <section id="descricao" class="content-section">
                    <h2>Xamã</h2>

                    <p>
                        No cerne enigmático das florestas e nas regiões mais remotas dos ermos inexplorados,
                        existem segredos ocultos: clareiras sagradas onde os animais não ousam aproximar-se,
                        círculos de pedras erguidos por culturas ancestrais e árvores gigantes que transbordam poder divino.
                    </p>

                    <p>
                        Existe algo verdadeiramente milagroso na vida selvagem, uma tradição secreta e ancestral
                        transmitida ao longo dos séculos por caminhantes que veneram, protegem e vivem em sintonia
                        com a natureza. É nesse território místico que surgem os xamãs.
                    </p>

                    <p>
                        O xamã é mais do que um simples guardião da natureza. Envolto nas energias espirituais do mundo,
                        torna-se um mediador entre os planos terreno e divino, guiado por entidades ancestrais,
                        espíritos animais e forças cósmicas.
                    </p>

                    <p>
                        Mais do que um líder religioso, o xamã é um curandeiro, um visionário, alguém que enxerga além
                        da materialidade. Sem templos ou congregações, sua morada é entre os elementos, onde suas cerimônias
                        se desdobram em comunhão com o vento, as águas, as matas e os espíritos que permeiam a terra.
                    </p>

                    <p>
                        Embora as tradições xamânicas persistam em Pindorama, com conhecimento transmitido de mestre
                        para aprendiz ao longo dos séculos, muitos xamãs despertam seus dons por meio de experiências
                        pessoais intensas, viagens visionárias ou encontros com o sobrenatural.
                    </p>

                    <p>
                        Os xamãs não se afastam apenas da civilização: mergulham nas profundezas da natureza para encontrar
                        a essência primordial da existência. Seus companheiros mais próximos são espíritos animais,
                        entidades elementares e seres espirituais que habitam entre as sombras e as estrelas.
                    </p>

                    <p>
                        Até mesmo o corpo de um xamã é modificado pela ligação íntima com o mundo espiritual.
                        Eles podem se transformar em avatares de energia, invocar espíritos aliados ou transcender
                        para reinos espirituais.
                    </p>
                </section>

                <section id="caracteristicas" class="content-section">
                    <h2>Características de Classe</h2>

                    <div class="class-power-block">
                        <p>
                            <strong>Pontos de Vida.</strong> Um xamã começa com
                            <strong>16 pontos de vida + Constituição</strong> e ganha
                            <strong>4 PV + Constituição</strong> por nível.
                        </p>

                        <p><strong>Pontos de Mana.</strong> <strong>5 PM por nível.</strong></p>

                        <p>
                            <strong>Perícias.</strong> <strong>Sobrevivência (Sab)</strong> e <strong>Vontade (Sab)</strong>,
                            mais <strong>4</strong> à sua escolha entre
                            <strong>Adestramento (Car)</strong>, <strong>Atletismo (For)</strong>,
                            <strong>Cura (Sab)</strong>, <strong>Fortitude (Con)</strong>,
                            <strong>Iniciativa (Des)</strong>, <strong>Intuição (Sab)</strong>,
                            <strong>Luta (For)</strong>, <strong>Misticismo (Int)</strong>,
                            <strong>Ofício (Int)</strong>, <strong>Percepção (Sab)</strong>
                            e <strong>Religião (Sab)</strong>.
                        </p>

                        <p><strong>Proficiências.</strong> Escudos.</p>
                    </div>
                </section>

                <section id="habilidades" class="content-section">
                    <h2>Habilidades de Classe</h2>

                    <div class="class-power-block">
                        <p>
                            <strong>Devoto Fiel.</strong> Você é devoto de uma divindade, espírito, força natural,
                            ancestralidade sagrada ou tradição espiritual ligada à natureza. Sua fé não se manifesta
                            necessariamente em templos, mas na relação direta com a terra, os ciclos, os animais e os espíritos.
                            Ao se tornar devoto, você obtém <strong>dois poderes concedidos</strong>, superando o
                            benefício habitual recebido por outros devotos.
                        </p>

                        <p>
                            <strong>Empatia Selvagem.</strong> Você pode se comunicar com animais por meio de linguagem corporal,
                            vocalizações e sensibilidade espiritual. Você pode usar <strong>Adestramento</strong> para mudar
                            a atitude de animais e pedir favores simples, respeitando seus instintos e limitações.
                        </p>

                        <p>
                            <strong>Magias.</strong> Você pode lançar magias divinas de <strong>1º círculo</strong>.
                            À medida que sobe de nível, pode lançar magias de círculos maiores:
                            <strong>2º círculo no 6º nível</strong>, <strong>3º círculo no 10º nível</strong>,
                            <strong>4º círculo no 14º nível</strong> e <strong>5º círculo no 17º nível</strong>.
                        </p>

                        <p>
                            Você começa com <strong>duas magias de 1º círculo</strong>. A cada nível par,
                            aprende uma magia de qualquer círculo e escola que possa lançar. Seu atributo-chave
                            para lançar magias é <strong>Sabedoria</strong>, e você soma sua Sabedoria ao seu total de PM.
                        </p>

                        <p>
                            <strong>Forma Selvagem.</strong> No <strong>2º nível</strong>, você pode assumir formas ligadas
                            à natureza e aos espíritos animais. Inicialmente, recebe a Forma Selvagem básica. No
                            <strong>7º nível</strong>, ela se torna aprimorada; no <strong>11º nível</strong>, superior;
                            e no <strong>18º nível</strong>, primal.
                        </p>

                        <p>
                            <strong>Poder de Xamã.</strong> No <strong>2º nível</strong>, e a cada nível seguinte,
                            você recebe um poder de xamã à sua escolha.
                        </p>

                        <p>
                            <strong>Caminho dos Ermos.</strong> No <strong>3º nível</strong>, você pode atravessar terrenos
                            difíceis sem sofrer redução em seu deslocamento, e a CD para rastreá-lo aumenta em +10.
                            Esta habilidade só funciona em terrenos naturais. Além disso, você não sofre penalidades
                            climáticas para lançar magias.
                        </p>

                        <p>
                            <strong>Forma Primal.</strong> No <strong>18º nível</strong>, quando usa Forma Selvagem,
                            você pode se transformar em uma fera primal. Você recebe os benefícios de dois tipos de animais.
                            Bônus iguais não se acumulam; use o melhor benefício de cada tipo.
                        </p>

                        <p>
                            <strong>Força da Natureza.</strong> No <strong>20º nível</strong>, você diminui o custo de todas
                            as suas magias em <strong>–2 PM</strong> e aumenta a CD delas em <strong>+2</strong>.
                            Os bônus dobram para <strong>–4 PM</strong> e <strong>+4 na CD</strong> se você estiver
                            em terrenos naturais.
                        </p>
                    </div>
                </section>

                <section id="tabela-xama" class="content-section">
                    <h2>O Xamã</h2>

                    <div class="classes-table-wrap">
                        <table class="classes-table level-table">
                            <thead>
                                <tr>
                                    <th>Nível</th>
                                    <th>Habilidades de Classe</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr><td>1º</td><td>Devoto fiel, empatia selvagem, magias (1º círculo)</td></tr>
                                <tr><td>2º</td><td>Forma selvagem (básica), poder de xamã</td></tr>
                                <tr><td>3º</td><td>Caminho dos ermos, poder de xamã</td></tr>
                                <tr><td>4º</td><td>Poder de xamã</td></tr>
                                <tr><td>5º</td><td>Poder de xamã</td></tr>
                                <tr><td>6º</td><td>Magias (2º círculo), poder de xamã</td></tr>
                                <tr><td>7º</td><td>Forma selvagem (aprimorada), poder de xamã</td></tr>
                                <tr><td>8º</td><td>Poder de xamã</td></tr>
                                <tr><td>9º</td><td>Poder de xamã</td></tr>
                                <tr><td>10º</td><td>Magias (3º círculo), poder de xamã</td></tr>
                                <tr><td>11º</td><td>Forma selvagem (superior), poder de xamã</td></tr>
                                <tr><td>12º</td><td>Poder de xamã</td></tr>
                                <tr><td>13º</td><td>Poder de xamã</td></tr>
                                <tr><td>14º</td><td>Magias (4º círculo), poder de xamã</td></tr>
                                <tr><td>15º</td><td>Poder de xamã</td></tr>
                                <tr><td>16º</td><td>Poder de xamã</td></tr>
                                <tr><td>17º</td><td>Magias (5º círculo), poder de xamã</td></tr>
                                <tr><td>18º</td><td>Forma selvagem (primal), poder de xamã</td></tr>
                                <tr><td>19º</td><td>Poder de xamã</td></tr>
                                <tr><td>20º</td><td>Força da natureza, poder de xamã</td></tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section id="forma-selvagem" class="content-section">
                    <h2>Forma Selvagem</h2>

                    <div class="class-power-block">
                        <p>
                            <strong>Forma Selvagem.</strong> A Forma Selvagem representa a capacidade do xamã de assumir
                            aspectos animais e espirituais. Mais do que uma simples transformação física, ela expressa
                            a comunhão entre corpo, espírito e natureza.
                        </p>

                        <p>
                            <strong>Forma Básica.</strong> No 2º nível, você acessa a forma inicial, recebendo benefícios
                            ligados ao animal ou aspecto escolhido.
                        </p>

                        <p>
                            <strong>Forma Aprimorada.</strong> No 7º nível, sua transformação se torna mais forte,
                            oferecendo benefícios superiores ao aspecto escolhido.
                        </p>

                        <p>
                            <strong>Forma Superior.</strong> No 11º nível, sua ligação com a natureza se aprofunda,
                            permitindo formas mais poderosas e resistentes.
                        </p>

                        <p>
                            <strong>Forma Primal.</strong> No 18º nível, você pode combinar benefícios de dois tipos
                            de animais quando usa Forma Selvagem, respeitando a regra de que bônus iguais não se acumulam.
                        </p>
                    </div>
                </section>

                <section id="aspectos" class="content-section">
                    <h2>Aspectos da Natureza</h2>

                    <div class="class-power-block">
                        <p>
                            <strong>Aspecto do Inverno.</strong> Você aprende uma magia de convocação ou evocação de qualquer
                            classe e de qualquer círculo que possa lançar. Além disso, recebe redução de frio 5 e suas magias
                            que causam dano de frio causam +1 ponto de dano por dado.
                        </p>

                        <p>
                            <strong>Aspecto da Primavera.</strong> Você manifesta a fertilidade, a cura e o renascimento da natureza,
                            favorecendo magias e efeitos ligados à restauração, crescimento e remoção de condições negativas.
                        </p>

                        <p>
                            <strong>Aspecto do Verão.</strong> Você manifesta calor, vitalidade e intensidade. Esse aspecto
                            favorece efeitos ligados ao fogo, à energia ativa e à agressividade da natureza.
                        </p>

                        <p>
                            <strong>Aspecto do Outono.</strong> Você manifesta decomposição, transição e fim de ciclos.
                            Esse aspecto favorece efeitos ligados ao desgaste, à corrosão, ao cansaço e à transformação.
                        </p>
                    </div>
                </section>

                <section id="poderes" class="content-section">
                    <h2>Poderes de Xamã</h2>

                    <div class="class-power-block">
                        <p><strong>Aura Congelante.</strong> Enquanto você estiver em forma selvagem, todos os espaços a 1,5m de você são considerados terreno difícil e causam 1d6 pontos de dano de frio a cada criatura que terminar o próprio turno neles. <strong>Pré-requisitos:</strong> Aspecto do Inverno, 8º nível de xamã.</p>

                        <p><strong>Aura Ardente.</strong> Enquanto você estiver em forma selvagem, até sua próxima rodada, inimigos que terminarem seus turnos adjacentes a você sofrem 1d6 pontos de dano de fogo e ficam em chamas. <strong>Pré-requisitos:</strong> Aspecto do Verão, 8º nível de xamã.</p>

                        <p><strong>Aura Corrosiva.</strong> Enquanto você estiver em forma selvagem, até sua próxima rodada, inimigos que terminarem seus turnos adjacentes a você sofrem 1d6 pontos de dano de trevas e ficam fatigados. <strong>Pré-requisitos:</strong> Aspecto do Outono, 8º nível de xamã.</p>

                        <p><strong>Aura Florescente.</strong> Enquanto você estiver em forma selvagem, até sua próxima rodada, aliados que terminarem seus turnos adjacentes a você restauram 1d6 PV e removem uma condição negativa. <strong>Pré-requisitos:</strong> Aspecto da Primavera, 8º nível de xamã.</p>

                        <p><strong>Aspecto do Inverno.</strong> Você aprende uma magia de convocação ou evocação de qualquer classe e de qualquer círculo que possa lançar. Além disso, recebe redução de frio 5 e suas magias que causam dano de frio causam +1 ponto de dano por dado.</p>

                        <p><strong>Aspecto da Primavera.</strong> Você aprende uma magia de cura, proteção ou suporte de qualquer classe e de qualquer círculo que possa lançar. Além disso, seus efeitos de cura e restauração recebem reforço conforme a decisão do mestre e a situação da cena.</p>

                        <p><strong>Aspecto do Verão.</strong> Você aprende uma magia de fogo, luz ou energia de qualquer classe e de qualquer círculo que possa lançar. Além disso, suas magias de fogo ou efeitos ligados ao calor tornam-se mais intensos.</p>

                        <p><strong>Aspecto do Outono.</strong> Você aprende uma magia ligada a necromancia, corrosão, trevas, veneno ou desgaste de qualquer classe e de qualquer círculo que possa lançar. Além disso, seus efeitos de enfraquecimento tornam-se mais marcantes.</p>

                        <p><strong>Aumento de Atributo.</strong> Você recebe +1 em um atributo. Você pode escolher este poder várias vezes, mas apenas uma vez por patamar para um mesmo atributo.</p>

                        <p><strong>Companheiro Animal.</strong> Você recebe um companheiro animal, um parceiro fiel ligado à sua jornada espiritual e selvagem. Ele obedece seus comandos, acompanha suas viagens e representa sua conexão com os espíritos animais.</p>

                        <p><strong>Conhecimento Mágico.</strong> Você aprende duas magias divinas de qualquer círculo que possa lançar. Você pode escolher este poder quantas vezes quiser.</p>

                        <p><strong>Espírito Guia.</strong> Você é acompanhado por um espírito ancestral, animal ou elemental que o orienta. Esse espírito pode se manifestar em sonhos, visões, presságios e sinais da natureza.</p>

                        <p><strong>Forma Selvagem Aprimorada.</strong> Seus usos de Forma Selvagem tornam-se mais poderosos, ampliando os benefícios recebidos ao assumir aspectos animais ou espirituais. <strong>Pré-requisito:</strong> Forma Selvagem.</p>

                        <p><strong>Forma Selvagem Feroz.</strong> Quando assume uma forma ligada ao combate, seus ataques naturais ficam mais perigosos e sua presença no campo de batalha se torna mais ameaçadora.</p>

                        <p><strong>Forma Selvagem Resistente.</strong> Quando assume uma forma ligada à resistência, você se torna mais difícil de derrubar, recebendo benefícios defensivos e maior capacidade de suportar dano.</p>

                        <p><strong>Magia Natural.</strong> Você pode lançar magias em Forma Selvagem, manifestando seus efeitos por meio de rugidos, gestos animais, marcas espirituais, sopros, cantos ou movimentos corporais.</p>

                        <p><strong>Poder Mágico.</strong> Você recebe +1 ponto de mana por nível de xamã. Quando sobe de nível, os PM recebidos por este poder aumentam de acordo.</p>

                        <p><strong>Sentidos Selvagens.</strong> Você recebe bônus em testes de Percepção e Sobrevivência, especialmente em ambientes naturais, florestas, pântanos, montanhas, rios, cavernas ou territórios espiritualmente ativos.</p>

                        <p><strong>Totem Espiritual.</strong> Você estabelece vínculo com um totem animal, ancestral ou elemental. Esse totem orienta sua prática xamânica e pode definir símbolos, rituais, presságios e manifestações visuais de seus poderes.</p>

                        <p><strong>Voz dos Ermos.</strong> Você pode interpretar sinais naturais e espirituais, como comportamento de animais, movimento dos ventos, ruídos da mata, marcas no solo e sonhos visionários, para obter pistas ou presságios conforme a decisão do mestre.</p>
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