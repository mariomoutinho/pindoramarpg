<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cangaceiro - Pindorama RPG</title>

    <link rel="stylesheet" href="assets/css/ficha.css" />
    <link rel="stylesheet" href="assets/css/classes.css?v=20260513a" />
</head>

<body>
    <main class="page-wrapper classes-page">

        <header class="top-actions classes-topbar">
            <div>
                <h1>Cangaceiro</h1>
                <p>Classe dedicada às emboscadas, ao combate em bando, à resistência sertaneja e ao domínio estratégico do território.</p>
            </div>

            <div class="actions">
                <a class="system-link-btn" href="index.php">Menu</a>
                <a class="system-link-btn" href="classes.php">Classes</a>
                <a class="system-link-btn" href="ficha.php">Ficha</a>
            </div>
        </header>

        <?php
            $cb_class_slug = 'cangaceiro';
            $cb_class_name = 'Cangaceiro';
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
                        <a class="toc-link toc-level-2" href="#tabela-cangaceiro">O Cangaceiro</a>
                        <a class="toc-link toc-level-2" href="#capangas">Capangas</a>
                        <a class="toc-link toc-level-2" href="#poderes">Poderes de Cangaceiro</a>
                    </nav>
                </div>
            </aside>

            <article class="sheet classes-content" id="classesContent">

                <section id="descricao" class="content-section">
                    <h2>Cangaceiro</h2>

                    <p>
                        Existem duas percepções acerca dos cangaceiros: uma os enaltece como guerreiros intrépidos,
                        defensores de seu povo contra quaisquer invasores, lutando destemidamente contra a opressão em
                        todas as suas formas; a outra os retrata como uma sombria aglomeração de criminosos, subsistindo
                        da prática de delitos como invasões, roubos, sequestros e assassinatos.
                    </p>

                    <p>
                        Os primeiros Candangos foram os precursores da ordem dos Cangaceiros, no deserto do Sertão.
                        Imersos em uma aura de mistério e amnésia, reuniram-se com seus pares e buscaram refúgio nos
                        terrenos mais inóspitos, onde enfrentaram ferozes investidas dos Caucazis. Nos dias atuais,
                        outras raças também engrossam as fileiras desses bandos.
                    </p>

                    <p>
                        Por vezes, os cangaceiros se estabelecem em regiões remotas e forjam pequenas vilas, seguindo
                        as rígidas leis do líder do bando. Também podem atuar a serviço de senhores de empenho, coronéis
                        ou prefeitos de cidades distantes das capitais dos reinos, formando milícias e, em alguns casos,
                        tomando o controle político do local.
                    </p>

                    <p>
                        Destemidos guerreiros, especialistas em sobrepujar terrenos inóspitos e verdadeiros maestros da
                        geografia local, combatem habilmente com armas de fogo, facas e punhais. Contudo, sua faceta mais
                        marcante é a capacidade estratégica em bando, criando emboscadas formidáveis e coordenando ataques
                        com precisão brutal.
                    </p>

                    <p>
                        O grupo cangaceiro mais notório foi aquele liderado pelo casal de Candangos, Virgulino Lampião
                        e Maria Bonita, considerados o rei e a rainha do cangaço.
                    </p>
                </section>

                <section id="caracteristicas" class="content-section">
                    <h2>Características de Classe</h2>

                    <div class="class-power-block">
                        <p><strong>Pontos de Vida.</strong> Um cangaceiro começa com <strong>8 pontos de vida + Constituição</strong> e ganha <strong>4 PV + Constituição</strong> por nível.</p>

                        <p><strong>Pontos de Mana.</strong> <strong>3 PM por nível.</strong></p>

                        <p>
                            <strong>Perícias.</strong> <strong>Luta (For)</strong> ou <strong>Pontaria (Des)</strong>,
                            <strong>Reflexo (Sab)</strong>, mais <strong>6</strong> à sua escolha entre
                            <strong>Adestramento (Car)</strong>, <strong>Atletismo (For)</strong>, <strong>Cavalgar (Des)</strong>,
                            <strong>Cura (Sab)</strong>, <strong>Fortitude (Con)</strong>, <strong>Furtividade (Des)</strong>,
                            <strong>Guerra (Int)</strong>, <strong>Iniciativa (Des)</strong>, <strong>Intimidação (Car)</strong>,
                            <strong>Investigação (Int)</strong>, <strong>Ladinagem (Des)</strong>, <strong>Luta (For)</strong>,
                            <strong>Ofício (Int)</strong>, <strong>Percepção (Sab)</strong>, <strong>Pontaria (Des)</strong>
                            e <strong>Sobrevivência (Sab)</strong>.
                        </p>

                        <p><strong>Proficiências.</strong> Armas de fogo. O cangaceiro ganha uma pistola como item inicial.</p>
                    </div>
                </section>

                <section id="habilidades" class="content-section">
                    <h2>Habilidades de Classe</h2>

                    <div class="class-power-block">
                        <p>
                            <strong>Banditismo.</strong> Você é especialista na luta em bandos. Sempre que tiver
                            <strong>2 ou mais aliados ou parceiros</strong> em alcance, todos recebem bônus em testes
                            de ataque e dano. No 1º nível, o bônus é <strong>+1 em ataques</strong> e <strong>+1d4 em dano</strong>.
                            A cada quatro níveis, esse bônus aumenta conforme a evolução da classe.
                        </p>

                        <p>
                            <strong>Canga.</strong> Você tem muitos bolsos e carrega itens pesados atados ao corpo.
                            Você começa o jogo com equipamentos de aventura ou ferramentas que somem até <strong>M$ 200</strong>.
                            Além disso, seu limite de carga aumenta em <strong>5 espaços</strong>, e itens muito leves ou pequenos,
                            que normalmente ocupam meio espaço, passam a ocupar <strong>1/4 de espaço</strong>.
                        </p>

                        <p>
                            <strong>Poder de Cangaceiro.</strong> No <strong>2º nível</strong>, e a cada nível seguinte,
                            você escolhe um dos poderes de cangaceiro.
                        </p>

                        <p>
                            <strong>Casca Grossa.</strong> No <strong>3º nível</strong>, você soma sua Constituição na Defesa,
                            limitado pelo seu nível e apenas se não estiver usando armadura pesada. Além disso, no
                            <strong>7º nível</strong>, e a cada quatro níveis, recebe <strong>+1 na Defesa</strong>.
                        </p>

                        <p>
                            <strong>Esquiva Sobrenatural.</strong> No <strong>4º nível</strong>, seus instintos são tão apurados
                            que você consegue reagir ao perigo antes mesmo que seus sentidos percebam. Você nunca fica surpreendido.
                        </p>

                        <p>
                            <strong>Rei do Cangaço.</strong> No <strong>20º nível</strong>, você e seus aliados recebem o bônus
                            de Banditismo sempre que estiverem na mesma batalha, não importando a distância. O bônus para seus
                            aliados permanece o padrão, mas para você ele é dobrado.
                        </p>
                    </div>
                </section>

                <section id="tabela-cangaceiro" class="content-section">
                    <h2>O Cangaceiro</h2>

                    <div class="classes-table-wrap">
                        <table class="classes-table level-table">
                            <thead>
                                <tr>
                                    <th>Nível</th>
                                    <th>Habilidades de Classe</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr><td>1º</td><td>Banditismo (+1, +1d4), canga</td></tr>
                                <tr><td>2º</td><td>Poder de cangaceiro</td></tr>
                                <tr><td>3º</td><td>Poder de cangaceiro</td></tr>
                                <tr><td>4º</td><td>Esquiva sobrenatural, poder de cangaceiro</td></tr>
                                <tr><td>5º</td><td>Banditismo (+2, +1d6), poder de cangaceiro</td></tr>
                                <tr><td>6º</td><td>Poder de cangaceiro</td></tr>
                                <tr><td>7º</td><td>Intuição cirúrgica, poder de cangaceiro</td></tr>
                                <tr><td>8º</td><td>Poder de cangaceiro</td></tr>
                                <tr><td>9º</td><td>Banditismo (+3, +1d8), poder de cangaceiro</td></tr>
                                <tr><td>10º</td><td>Poder de cangaceiro</td></tr>
                                <tr><td>11º</td><td>Poder de cangaceiro</td></tr>
                                <tr><td>12º</td><td>Poder de cangaceiro</td></tr>
                                <tr><td>13º</td><td>Banditismo (+4, +2d6), poder de cangaceiro</td></tr>
                                <tr><td>14º</td><td>Poder de cangaceiro</td></tr>
                                <tr><td>15º</td><td>Poder de cangaceiro</td></tr>
                                <tr><td>16º</td><td>Poder de cangaceiro</td></tr>
                                <tr><td>17º</td><td>Banditismo (+5, +2d8), poder de cangaceiro</td></tr>
                                <tr><td>18º</td><td>Poder de cangaceiro</td></tr>
                                <tr><td>19º</td><td>Poder de cangaceiro</td></tr>
                                <tr><td>20º</td><td>Poder de cangaceiro, rei do cangaço</td></tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section id="capangas" class="content-section">
                    <h2>Capangas</h2>

                    <div class="class-power-block">
                        <p>
                            <strong>Capangas.</strong> Capangas são parceiros que atuam em conjunto. Individualmente,
                            apresentam pouca resistência, mas, graças à sua quantidade, tornam-se uma ameaça.
                        </p>

                        <p>
                            Para empregar um grupo de capangas em combate, é necessário posicioná-los primeiro.
                            Isso requer uma ação completa, durante a qual cada capanga é colocado em um espaço vago
                            dentro do alcance curto.
                        </p>

                        <p>
                            Uma vez posicionados, é possível usar uma ação de movimento para deslocá-los pela distância
                            de movimento ou uma ação padrão para causar dano automático a criaturas adjacentes.
                            Capangas não agem sem receber ordens.
                        </p>

                        <p>
                            Capangas compõem um conjunto de milicianos ou recrutas com treinamento e equipamento básico.
                            Eles possuem apenas <strong>1 PV</strong> e falham automaticamente em qualquer teste oposto.
                            Um capanga que atinja 0 pontos de vida não pode mais ser usado durante o restante da cena.
                        </p>

                        <p>
                            Um grupo de capangas conta como um parceiro para o limite de parceiros que você pode ter.
                            Possíveis usos criativos para capangas fora de combate ficam a critério do mestre.
                        </p>

                        <p>
                            No nível iniciante, são compostos por quatro infantes, com movimento 9m, Defesa 16 e dano
                            cortante de 1d8+1 cada. No nível veterano, o grupo se amplia para cinco infantes. No nível
                            mestre, o contingente cresce para seis infantes, e o dano causado aumenta para 1d8+2.
                        </p>
                    </div>
                </section>

                <section id="poderes" class="content-section">
                    <h2>Poderes de Cangaceiro</h2>

                    <div class="class-power-block">
                        <p><strong>Abertura Estratégica.</strong> Sempre que acertar um ataque furtivo, você pode gastar 2 PM para que aliados adjacentes possam realizar um ataque como reação.</p>

                        <p><strong>Ainda Tenho uma Bala.</strong> Você pode gastar 1 PM para atirar com uma arma de fogo descarregada, como se ela ainda estivesse carregada. Essa munição é sempre considerada normal, sem melhorias, independentemente do que estava carregado na arma antes. Você não pode usar esse poder novamente antes de recarregar a arma normalmente. <strong>Pré-requisito:</strong> Car 2, Pistoleiro.</p>

                        <p><strong>Ambidestria.</strong> Se estiver empunhando duas armas, e pelo menos uma delas for leve, e fizer a ação agredir, você pode fazer dois ataques, um com cada arma. Se fizer isso, sofre –2 em todos os testes de ataque até o seu próximo turno. <strong>Pré-requisito:</strong> Des 2.</p>

                        <p><strong>Ataque Arterial.</strong> Você gasta 1 PM e, se acertar o ataque, o alvo fica sangrando. <strong>Pré-requisito:</strong> 6º nível de cangaceiro.</p>

                        <p><strong>Aumento de Atributo.</strong> Você recebe +1 em um atributo. Você pode escolher este poder várias vezes, mas apenas uma vez por patamar para um mesmo atributo.</p>

                        <p><strong>Bala Explosiva.</strong> Você pode gastar 2 PM para fazer um ataque com sua arma de fogo que causa dano de fogo em área. A área afetada é um cone com 6m de comprimento e 3m de largura na base, partindo do primeiro alvo. Todas as criaturas na área fazem um teste de Reflexos contra CD Pontaria para reduzir o dano à metade. <strong>Pré-requisitos:</strong> Pistoleiro, 11º nível de cangaceiro.</p>

                        <p><strong>Bote.</strong> Se estiver empunhando duas armas e fizer uma investida, você pode pagar 1 PM para fazer um ataque adicional com sua arma secundária. <strong>Pré-requisitos:</strong> Ambidestria, 5º nível de cangaceiro.</p>

                        <p><strong>Bravura Indômita.</strong> Enquanto tiver uma quantidade de pontos de vida igual ou inferior ao seu nível, seus poderes de cangaceiro custam –1 PM.</p>

                        <p><strong>Camuflagem.</strong> Você pode gastar 1 PM para usar Furtividade para se esconder mesmo sem cobertura disponível, desde que esteja no sertão nordestino ou em ambiente similar. <strong>Pré-requisito:</strong> 5º nível de cangaceiro.</p>

                        <p><strong>Cano Duplo.</strong> Você pode gastar 2 PM para fazer dois ataques com sua arma de fogo como uma ação padrão sem sofrer penalidades. <strong>Pré-requisitos:</strong> Ambidestria, 7º nível de cangaceiro, Des 3.</p>

                        <p><strong>Capanga.</strong> Você recebe como parceiro um bando de capangas. Ele conta como espaço de parceiros. Você pode escolher este poder quantas vezes quiser, mas ainda está sujeito ao limite de parceiros que pode ter.</p>

                        <p><strong>Liderança.</strong> Seus capangas podem ser direcionados com mais eficiência em combate, permitindo comandar seu deslocamento ou ataque de forma mais ágil. <strong>Pré-requisito:</strong> Capanga.</p>

                        <p><strong>Proteção do Bando.</strong> O seu bônus de Banditismo se aplica à sua Defesa. Você recebe +1 na Defesa e, a cada quatro níveis, esse bônus aumenta em +1. <strong>Pré-requisito:</strong> 3º nível de cangaceiro.</p>

                        <p><strong>Queima Roupa.</strong> Quando faz um ataque à distância com uma arma de fogo contra um oponente adjacente, você não sofre a penalidade de –5 no teste de ataque e aumenta seu dano em um passo. <strong>Pré-requisitos:</strong> Luta, Pistoleiro.</p>

                        <p><strong>Oportunismo.</strong> Uma vez por rodada, quando um inimigo adjacente sofre dano de um de seus aliados, você pode gastar 2 PM para fazer um ataque corpo a corpo contra esse inimigo. <strong>Pré-requisito:</strong> 6º nível de cangaceiro.</p>

                        <p><strong>Saque Rápido.</strong> Você recebe +2 em Iniciativa e pode sacar ou guardar itens como uma ação livre. Além disso, a ação para recarregar armas de disparo diminui em uma categoria, e você recebe +1 ação de movimento para recarregar armas de arremesso por turno. <strong>Pré-requisitos:</strong> treinado em Iniciativa, 5º nível de cangaceiro.</p>

                        <p><strong>Exímio Atirador.</strong> Você pode adicionar sua Sabedoria em testes de Pontaria com armas de fogo. <strong>Pré-requisitos:</strong> Sab 2, Pistoleiro.</p>

                        <p><strong>Pistoleiro.</strong> Você recebe +2 em Pontaria com armas de fogo e soma sua Destreza nas rolagens de dano quando usa armas de fogo.</p>

                        <p><strong>Saque Rápido com Duas Armas.</strong> Você pode sacar duas armas como uma ação livre. <strong>Pré-requisito:</strong> Ambidestria.</p>

                        <p><strong>Tiro Cego.</strong> Você pode fazer ataques à distância mesmo sem ver o alvo, desde que saiba onde ele está, sem sofrer penalidades por falta de visão. <strong>Pré-requisito:</strong> Pistoleiro.</p>

                        <p><strong>Tiro Perfurante.</strong> Seu dano por arma de fogo ignora a RD do alvo. <strong>Pré-requisito:</strong> Pistoleiro.</p>

                        <p><strong>Tiro Preciso.</strong> Você pode fazer ataques à distância sem sofrer penalidades por cobertura ou camuflagem do alvo. <strong>Pré-requisito:</strong> Pistoleiro.</p>

                        <p><strong>Tiro Fatal.</strong> Seu multiplicador de crítico com armas de fogo aumenta em +1. Por exemplo, seu multiplicador com uma pistola, normalmente x3, torna-se x4. <strong>Pré-requisitos:</strong> Pistoleiro, 6º nível de cangaceiro.</p>

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