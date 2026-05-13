<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Jogando — Pindorama RPG</title>

    <link rel="stylesheet" href="assets/css/ficha.css" />
    <link rel="stylesheet" href="assets/css/classes.css?v=20260513a" />
    <link rel="stylesheet" href="assets/css/transitions.css?v=20260508u" />
</head>
<body>
    <script src="assets/js/transitions.js?v=20260508u"></script>

    <main class="page-wrapper classes-page">

        <header class="top-actions classes-topbar">
            <div>
                <h1 class="titulo-cordel">Jogando</h1>
                <p>Testes, ações e regras de cena.</p>
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

                    <button
                        type="button"
                        class="sidebar-close-btn"
                        id="sidebarCloseBtn"
                        aria-label="Fechar menu de navegação"
                    >
                        ×
                    </button>
                </div>

                <div class="sidebar-content" id="mobileSidebarContent">
                    <input
                        type="search"
                        id="classesSearch"
                        placeholder="Buscar nesta página..."
                        class="classes-search"
                    />

                    <nav class="classes-toc" id="classesToc">
                        <a class="toc-link toc-level-2" href="#abertura">Abertura</a>
                        <a class="toc-link toc-level-2" href="#o-jogador">O Jogador</a>
                        <a class="toc-link toc-level-2" href="#agindo">Agindo</a>
                        <a class="toc-link toc-level-2" href="#interpretando">Interpretando</a>
                        <a class="toc-link toc-level-2" href="#interagindo">Interagindo</a>
                        <a class="toc-link toc-level-2" href="#sobre-personagem">Sobre o Personagem</a>
                        <a class="toc-link toc-level-2" href="#os-dados">Os Dados</a>
                        <a class="toc-link toc-level-2" href="#vitorias-derrotas">Vitórias &amp; Derrotas</a>
                        <a class="toc-link toc-level-2" href="#regras-jogo">Regras do Jogo</a>
                        <a class="toc-link toc-level-2" href="#testes">Testes</a>
                        <a class="toc-link toc-level-2" href="#regras-adicionais-testes">Regras Adicionais de Testes</a>
                        <a class="toc-link toc-level-2" href="#testes-sem-rolagens">Testes sem Rolagens</a>
                        <a class="toc-link toc-level-2" href="#testes-estendidos">Testes Estendidos</a>
                        <a class="toc-link toc-level-2" href="#habilidades">Habilidades</a>
                        <a class="toc-link toc-level-2" href="#alvos-areas">Alvos &amp; Áreas</a>
                        <a class="toc-link toc-level-2" href="#acumulando-efeitos">Acumulando Efeitos</a>
                        <a class="toc-link toc-level-2" href="#testes-resistencia">Testes de Resistência</a>
                        <a class="toc-link toc-level-2" href="#tipos-efeitos">Tipos de Efeitos</a>
                        <a class="toc-link toc-level-2" href="#habilidades-gerais">Habilidades Gerais</a>
                        <a class="toc-link toc-level-2" href="#combate">Combate</a>
                        <a class="toc-link toc-level-2" href="#iniciativa">Iniciativa</a>
                        <a class="toc-link toc-level-2" href="#rodada-combate">A Rodada de Combate</a>
                        <a class="toc-link toc-level-2" href="#tipos-acoes">Tipos de Ações</a>
                        <a class="toc-link toc-level-2" href="#acoes-padrao">Ações Padrão</a>
                        <a class="toc-link toc-level-2" href="#acoes-movimento">Ações de Movimento</a>
                        <a class="toc-link toc-level-2" href="#acoes-completas">Ações Completas</a>
                        <a class="toc-link toc-level-2" href="#acoes-livres">Ações Livres</a>
                        <a class="toc-link toc-level-2" href="#ferimentos-morte">Ferimentos &amp; Morte</a>
                        <a class="toc-link toc-level-2" href="#movimentacao">Movimentação</a>
                        <a class="toc-link toc-level-2" href="#situacoes-especiais">Situações Especiais</a>
                        <a class="toc-link toc-level-2" href="#quebrando-objetos">Quebrando Objetos</a>
                        <a class="toc-link toc-level-2" href="#exemplos-mapa">Exemplos no Mapa</a>
                    </nav>
                </div>
            </aside>

            <article class="sheet classes-content" id="classesContent">

                <figure class="image-placeholder" aria-label="Espaço para arte de capítulo">
                    Imagem futura: arte de capítulo "Jogando" — herói tribal cercado por mortos-vivos em vila ancestral.
                </figure>

                <section id="abertura" class="content-section">
                    <p>
                        Você escolheu cuidadosamente os detalhes e habilidades de seu personagem, marcou sua primeira sessão
                        de jogo e, por fim, se acomodou à mesa (ou se conectou via internet) com seus "camaradas". A cortina
                        subiu e sua jornada, épica e apoteótica, dramática até não poder mais, está prestes a se desenrolar!
                        E agora?
                    </p>
                    <p>
                        Não se deixe enganar pelo volume destas páginas: mergulhar em Pindorama pode ser mais fácil do que
                        entender uma piada sem graça. Como jogador, é só absorver o que o narrador está declamando, contemplar
                        a reação do seu personagem como se fosse uma cena de novela mexicana, e então soltar uma ou várias
                        ações. Além disso, esteja atento às proezas dos outros jogadores, interaja com os personagens deles, e
                        <em>voilà</em>, você tem uma sessão de Pindorama, que nada mais é do que uma longa conversa, onde
                        você e seus cúmplices compartilham uma narrativa digna de uma epopeia.
                    </p>
                    <p>
                        Tuas obrigações como jogador são bem simples: cuide do seu personagem, divirta seus colegas e finja
                        que você se integra ao grupo, tanto no jogo quanto na vida real. Não é necessário ser um vidente para
                        entender para onde o narrador quer levar a trama; a flexibilidade é a cereja do bolo desse jogo! Só
                        não esqueça que o narrador é o juiz do supremo tribunal das consequências das ações e decisões dos
                        personagens. Assim como ele não determina tudo na história, você também não é o imperador aqui. A
                        colaboração é tipo uma democracia, todos têm voz, e às vezes até um voto.
                    </p>
                    <p>
                        Alguns narradores começam as aventuras com os personagens jogados aos quatro cantos, como um
                        quebra-cabeça que ninguém entende. Outros preferem decretar que os personagens já são brotherzões
                        desde sempre ou, no mínimo, estão todos na mesma praça (na verdade... Taverna) no início. A tradição
                        do Pindorama é juntar os personagens num grupinho de heróis que se aventuram juntos. Não precisa
                        jogar fora a personalidade do seu personagem para isso; se bem criativas e coesas, intrigas entre os
                        personagens podem ser interessantes — você só colabora com a diversão.
                    </p>
                    <p>
                        Uma saga em Pindorama é tipo um episódio de novela, filme trash, livro de banca de jornal, gibi ou
                        videogame vagabundo. Se tudo estiver fluindo e você estiver na sua mente como se estivesse assistindo
                        um filme bem bizarro, tá no caminho certo.
                    </p>
                    <p>
                        Vai ter que usar as regras e rolar dados quando o narrador pedir, como se estivesse jogando dados
                        para ver seu destino, mas sem todo esse drama. Em Pindorama, não se preocupe com regras, a menos
                        que esteja em uma situação com muitas incertezas ou que tenha um peso maior na história. Por exemplo,
                        ir até o mercado e perguntar o preço das especiarias não exige um teste. Agora, correr até o mercado,
                        desviando de multidões nas ruas labirínticas, e chegar a tempo de impedir um assassinato, aí sim, vai
                        precisar de um teste (ou alguns).
                    </p>
                    <p>
                        Não fique de olho na sua ficha tentando entender quais ações são possíveis. Toda ação é possível, a
                        menos que o narrador te dê aquele olhar de "sério mesmo?". Se você acabou de encontrar um nobre e
                        quer conquistar o coração dele, não precisa ficar procurando na ficha por uma habilidade específica
                        para impressionar aristocratas. Apenas fala o que quer fazer e deixa o narrador decidir qual teste
                        você vai falhar gloriosamente. Começar um discurso eloquente? Mostrar suas habilidades com a espada?
                        Contar uma piada? Mentir, dizendo que você é um parente distante dele? Vale tudo.
                    </p>
                    <p>
                        Algumas ações, como voar ou quebrar uma parede com um soco, podem ser impossíveis, pelo menos para
                        personagens iniciantes. De novo, pensa em uma novela, um filme trash, um livro de banca, gibi ou
                        videogame vagabundo. Imagina se a ação que você pensou teria lugar em um enredo digno de memes.
                    </p>
                    <p>
                        Acima de tudo, tenta imaginar se a ação é algo que seu personagem faria. Uma sacerdotisa do Deus da
                        Paz tentaria mesmo puxar briga por causa de uma cachaça? Um brincante, humorista, gente boa,
                        tentaria bancar o badboy e intimidar o cara?
                    </p>
                    <p>
                        Mas aí, vamos com calma. Já estou indo rápido demais. Vamos começar do começo, como se estivéssemos
                        enrolando para ganhar tempo até a pizza chegar.
                    </p>
                </section>

                <section id="o-jogador" class="content-section">
                    <h2>O Jogador</h2>
                    <p>
                        Quase toda interação em uma sessão de Pindorama começa com o narrador estabelecendo um cenário. Ele
                        pode soltar a descrição de um lugar, tal como uma taverna (mais uma vez), um castelo ou uma floresta.
                        Ou então, narra um evento, tipo uma caravana de carnavalescos aportando na cidade ou um bando de
                        cangaceiros correndo feito doidos para pegar os coitados dos personagens jogadores. Às vezes, ele até
                        se permite descrever uma sensação — tipo um barulho sinistro que o aventureiro escuta em um quarto
                        escuro e aparentemente deserto, ou a dolorosa sensação de náusea quando o herói percebe que foi
                        agraciado com uma moqueca estragada. Invariavelmente, o narrador finaliza sua narrativa com a
                        clássica pergunta: "E aí, qual é a sua, hein?" ou um mero "Então, e agora?". Ainda que ele não
                        vocalize essas palavras, quando o narrador põe um ponto final, os jogadores estão na pista para
                        declarar suas ações.
                    </p>
                    <p>
                        Não precisa gravar cada palavra que escapa da boca do narrador. A descrição não é um quebra-cabeça
                        mirabolante ou uma charada que você precisa desvendar. Mas, óbvio, vale a pena prestar atenção,
                        tentar criar uma imagem mental do que diabos está acontecendo. Uma caravana de carnavalesco dando as
                        caras na cidade? Imagine o barulho dos instrumentos musicais tocando músicas de carnaval, gente
                        andando sorrindo e fantasiada. Visualize as vestimentas extravagantes e passos de danças estranhas
                        que você nunca soube que existiam. Pergunte-se: "O que meu personagem faria para entender o que tá
                        acontecendo?". Sinta a empolgação de pensar que pode estar prestes a ouvir fofocas sobre terras
                        longínquas e já planeje quanto dinheiro vai torrar nas barraquinhas com novidades fresquinhas. E se
                        um bando de cangaceiros vem correndo para cima? Veja o rosto dos mercenários, olhar de raiva ou de
                        seriedade, quem sabe uma gargalhada sádica? Olhos apertados de puro ódio prontos para o assalto.
                        Escute o barulho das peixeiras saindo das bainhas. Sinta o aroma do suor fedido dos danados. E mais
                        do que isso, mergulhe na mente do seu personagem e sinta o drama: tem um bando de mercenários cruéis
                        querendo te mandar pro além e a chegada deles é uma questão de segundos!
                    </p>
                    <p>
                        Mesmo que o seu personagem seja o rei da indiferença, tente achar um jeito de se conectar com tudo
                        que o narrador está despejando. Se imagine cercado por essas imagens, sons e cheiros. Interpretar um
                        personagem não é apenas um jogo, é uma estadia em um mundo maluco por algumas horas.
                    </p>
                    <p>
                        Então, é isso. Faça a magia acontecer. Ou não. Você decide.
                    </p>
                </section>

                <section id="agindo" class="content-section">
                    <h2>Agindo</h2>
                    <p>
                        Depois que o narrador, com sua empolgação exagerada, estabeleceu o palco para o seu drama particular,
                        a bola está no campo dos jogadores. E aqui não tem essa de "fase do narrador" e "fase dos jogadores"
                        — é tudo meio que um bate-papo espontâneo entre amigos, sabe? Claro, a menos que você esteja no meio
                        de um combate, onde, ironicamente, a ordem é respeitada.
                    </p>
                    <p>
                        Como em qualquer reunião social, ouve os outros, escolhe o momento certo para interromper (ou pelo
                        menos tenta), e declara suas ações. O narrador, sempre na função de pastor de RPGistas desgarrados,
                        vai facilitar isso, perguntando sobre as ações da galera caso alguém esteja mudo ou só se embolando
                        com as palavras.
                    </p>
                    <p>
                        E a forma de declarar suas intenções? Bem, aí é cada um do seu jeito. Pode ser em primeira pessoa,
                        tipo "Eu vou lá nos vendedores das barraquinhas perguntar se tem axé", ou em terceira, tipo
                        "Padrinho tira a espada e levanta o escudo, dando aquele riso ameaçador pros cangaceiros ficarem
                        espertos". Cada RPGista tem sua mania, tipo "Quero ouvir escondido a conversa na mesa ao lado", ou
                        "Meu personagem vai se esconder no feno". Pode também soltar um "Então eu saltei pra impedir que ele
                        coma a moqueca!", também tá valendo. Todo mundo tem seu jeito.
                    </p>
                    <p>
                        Não precisa ser um poeta ou um orador de discursos grandiosos para declarar suas ações. Por exemplo,
                        se você soltar um "Vou sair do meu quarto", o pessoal já vai imaginar que você não está praticando
                        nudismo naquele momento. E se disser que vai comer uma ração de viagem, todo mundo vai presumir que
                        você tirou ela do pacote primeiro. Pindorama não é sobre detalhes chatos, e ninguém vai ficar te
                        enchendo o saco por não especificar cada passo.
                    </p>
                    <p>
                        Agora, tem um equilíbrio nisso de ser grandioso demais ou minúsculo demais com as suas "ações". Em
                        situações frenéticas, tipo combates e perseguições, tem umas regras pra dar um freio na criatividade.
                        Em outros momentos, a coisa é mais solta, mas com o tempo você pega a manha. Dizer algo como "Vou
                        passar a tarde inteira batendo papo com os mercadores" é meio amplo demais. Já "Eu dou um passo" é
                        tão limitado que dá até pena. A jogada é encontrar um meio-termo, algo que dê espaço pro narrador e
                        pros outros jogadores responderem, construindo essa interação toda, saca? Ah, e o narrador sempre dá
                        o tom da cena, então, se disser "Vou trocar uma ideia com os mercadores", ele pode responder com um
                        "Vocês passam a tarde batendo papo e descobrem um monte de fofocas..." ou um "O mercador olha
                        desconfiado e sussurra que tem segredos pra contar, mas não aqui". Tudo depende do humor dele. E do
                        seu. E do destino dos dados. E de... Enfim, você entendeu.
                    </p>

                    <aside class="caixa-regra">
                        <h3 class="caixa-regra-titulo">Expressando Suas Intenções</h3>
                        <p>
                            Ao comunicar suas ações, expresse claramente o que almeja realizar e qual método planeja
                            empregar.
                        </p>
                        <p>Por exemplo:</p>
                        <ul>
                            <li>"Pretendo seduzir o guarda para obter acesso ao local restrito."</li>
                            <li>"Planejo construir uma barricada para bloquear a passagem dos inimigos."</li>
                            <li>"Pretendo desarmar a armadilha, examinando cuidadosamente os mecanismos."</li>
                        </ul>
                    </aside>
                </section>

                <section id="interpretando" class="content-section">
                    <h2>Interpretando</h2>
                    <p>
                        Ah, a arte sutil de dar vida ao seu personagem em Pindorama, porque, claro, jogar sem emoção é muito
                        entediante. Mas como, exatamente, você interpreta esse ser fictício que você carrega nas costas?
                    </p>
                    <p>
                        Primeiro, dê uma boa olhada no seu personagem. Vamos discutir isso em detalhes mais tarde, mas já
                        pode anotar na sua lista de afazeres: seu personagem é uma entidade distinta da sua pessoa, pelo
                        menos em alguns aspectos. Portanto, quando o narrador solta uma descrição ou um dos seus colegas faz
                        alguma ação, você deve se perguntar: como esse serzinho reagiria?
                    </p>
                    <p>
                        A maioria das situações não pede reações dignas de um espetáculo de fogos de artifício. Ver uma
                        caravana de artistas chegando à cidade não vai fazer seu personagem sair correndo de medo ou
                        atacando tudo o que vê pela frente. Então, é totalmente aceitável que você tenha uma reação
                        "normal": olhar as apresentações, bater um papo, tentar farejar algo suspeito, ignorar completamente
                        a caravana... Mas, claro, de vez em quando aparece uma situação que merece um pouco mais de emoção,
                        tipo a maioria dos combates ou aquelas cenas dramáticas que fazem até os brincantes pensarem duas
                        vezes. Nessas horas, a sua resposta vai ser mais lógica: se rolar uma batalha, você decide se vai
                        encarar o perigo ou se vai sair pela tangente; se um bando de Iakaré decidir que você será o jantar
                        deles, é lápis e papel na mão para montar sua defesa.
                    </p>
                    <p>
                        Agora, e se o narrador, num ato de pura distração, descrever a caravana dos artistas vinda direto
                        das terras do reino de Pranambuka sem lembrar que o seu personagem é fascinado por esse lugar?
                        Vamos dizer que, como um toque pessoal, você inventou que seu herói sempre sonhou em conhecer o
                        mundo viajando com uma trupe de carnavalescos pranambukanos antes de ser convocado para a aventura.
                        E agora? Como você reage a essa situação?
                    </p>
                    <p>
                        Na vida real, somos todos uns virtuosos da sensatez, sempre calculando cada passo e evitando ousadias.
                        Mas em Pindorama, não precisa ser tão cauteloso assim. Afinal, é só um joguinho de faz de conta!
                        Então, mesmo que a sua ação seja um pouco fora da casinha, tipo descrever o seu personagem chorando
                        de inveja dos artistas ao ver a caravana, pergunte-se: por que eles estão vivendo o meu sonho
                        enquanto eu enfrento monstros toda semana? Ou, quem sabe, vá até os artistas e convide-se para a
                        caravana, para o espanto geral dos outros jogadores! Quem sabe, impulsivamente, ofereça os serviços
                        do grupo como guarda-costas da caravana de graça, só pela honra de acompanhar profissionais tão
                        importantes! Pode gerar uns probleminhas... mas só para os personagens! Desde que os jogadores
                        reais à volta da mesa não estejam sendo prejudicados, esse tipo de ação meio maluca pode ser
                        divertido pra caramba. Não estrague a trama que todos estão construindo juntos, mas também não tenha
                        medo de jogar umas faíscas novas no caldeirão. Talvez sua ação dê totalmente errado..., mas se
                        acertar, pode abrir portas para uma nova linha narrativa!
                    </p>

                    <aside class="caixa-regra">
                        <h3 class="caixa-regra-titulo">Não Seja Fominha!</h3>
                        <p>
                            Ao manifestar suas ações, tenha o zelo de não também determinar as ações alheias. Pode dizer,
                            por exemplo, "Vou até os artistas para obter notícias", mas não "Vou até os mercadores e eles
                            compartilham novidades de Olindaras". Ou, pior ainda, "Padrinho saca o facão e Poronká fica
                            apoiada no balcão, esperando para ver o que vai acontecer".
                        </p>
                        <p>
                            Tentar controlar os personagens do narrador é irritante, e manipular os personagens dos outros
                            jogadores é pura falta de noção. Mesmo que você esteja convencido de que suas ideias são mais
                            eficientes, contenha-se. No máximo, pode oferecer sugestões.
                        </p>
                        <p>
                            Se alguém estiver agindo assim com você, solicite que pare ou peça auxílio ao narrador.
                            Lembre-se: sua visão da história não é nem melhor nem pior que a de ninguém. Mesmo que você
                            considere genial a cena da inquisidora defendendo o sacerdote que começa suas preces por
                            efeitos mágicos, a decisão não é exclusivamente sua.
                        </p>
                    </aside>

                    <p>
                        Parte da arte da interpretação também envolve "falar como o personagem". Em vez de apenas descrever
                        suas ações, você assume a voz do seu alter ego fictício e solta algo do tipo: "Bem-vindos, artistas
                        de Pranambuka! Pode me chamar de Zé Rojão. Vocês não imaginam como é bom poder ver tais belas
                        fantasias e poder sentir a felicidade que vocês trazem pra essa vila!" Claro, nem todos gostam de
                        fazer isso, e tudo bem. Se você não se sentir confortável para falar como o seu personagem, pode
                        simplesmente descrever as ações ("Eu me apresento e digo que é muito bom ver eles com suas
                        fantasias, com o clima que eles trazem para a vila..."). Mas tem gente que leva isso a sério,
                        criando até uma voz, sotaque ou manias para os seus personagens. Novamente, não é uma regra, mas
                        pode ser bem divertido.
                    </p>
                    <p>
                        Não precisa se preocupar em ter uma interpretação "brilhante" no sentido teatral da palavra. O
                        objetivo de Pindorama não é criar atores profissionais, muito menos transformar o jogo em um palco
                        de competições dramáticas. Sem vergonha na cara, galera, a ideia aqui é se divertir.
                    </p>
                </section>

                <section id="interagindo" class="content-section">
                    <h2>Interagindo</h2>
                    <p>
                        Aqui, não há botão de "salvar" para recuar ou uma mágica para desfazer suas escolhas. Não, meu caro,
                        aqui você encara as consequências das suas ações. E, claro, isso sem contar os casos em que você,
                        despretensiosamente, confundiu alguma coisa. Mas é assim que a diversão flui, nas dificuldades e
                        nos momentos que desafiam sua sagacidade.
                    </p>
                    <p>
                        Então, se a sua ação resultou num verdadeiro desastre, respire fundo e lembre-se: o importante é
                        que a trama esteja se desenrolando de maneira envolvente, a interação entre os membros do grupo
                        seja positiva e o jogo mantenha seu charme peculiar.
                    </p>
                    <p>
                        Como numa peça teatral de improviso, a cena vai se desdobrando, e cada escolha é como um lance de
                        dados, uma surpresa mágica que aguarda seu desvendar. Diferente dos mundos digitais dos videogames,
                        aqui não há checkpoints ou níveis de dificuldade para ajustar. Você enfrenta as tramas da vida com
                        bravura, seja ela criada pelo narrador ou pelas reviravoltas imprevisíveis dos seus colegas de jogo.
                    </p>
                    <p>
                        E, em algum ponto, a cortina se fecha. Deixe que o narrador dê o sinal de encerramento, pois ele é
                        o maestro dessa sinfonia caótica, regendo o fluxo da história melhor do que qualquer um na mesa. E,
                        como em toda boa história, aguarde ansioso pelo próximo ato, onde novos desafios espreitam, e a
                        trama continua pelo reino da imaginação.
                    </p>
                </section>

                <section id="sobre-personagem" class="content-section">
                    <h2>Sobre o Personagem</h2>
                    <p>
                        A complexa tarefa de trazer vida ao seu personagem é uma verdadeira dança entre as expectativas
                        criadas a partir da sua classe e as surpresas que a personalidade reserva. Você já escolheu o nome,
                        a divindade padroeira e até a aparência, mas quando chega a hora de interpretar, uma dúvida cruel
                        emerge: afinal, quem é esse sujeito que você criou? Como ele enfrenta as situações descritas pelo
                        narrador?
                    </p>
                    <p>
                        Sinta como se você estivesse dirigindo um filme, só que sem o orçamento milionário e as estrelas de
                        Hollywood. Se sua inquisidora se depara com uma caravana de artistas, talvez não seja o momento
                        ideal para mostrar seu lado heroico e altruísta. Mas, ei, o estômago dela ronca, e, de repente, a
                        protagonista da vez é a comida exótica que os mercadores oferecem.
                    </p>
                    <p>
                        E que tal uma reviravolta na trama? Pegue as características padrão da sua classe, algo como o
                        clássico inquisidor que luta pela honra e pelos seus juramentos, e adicione um toque inesperado.
                        Quem disse que a inquisidora não pode ser uma comilona inveterada? Ou que o rústico não pode ser
                        um romântico incurável? E o malandro? Ah, esse pode ser pavio-curto, sempre pronto para uma briga.
                    </p>
                    <p>
                        Mas não pare por aí. Jogue uma característica contraditória na mistura, algo que desafie as
                        convenções. Sua inquisidora comilona pode ficar furiosa se chamarem ela de "baixinha". O rústico
                        romântico pode se apaixonar perdidamente por um dos artistas. E o malandro pavio-curto... bem, ele
                        arranja motivo para brigar até com a sombra.
                    </p>
                    <p>
                        Os atributos, perícias e poderes do seu personagem podem ser aliados nessa jornada de
                        autodescoberta. Com alta Sabedoria, talvez ele seja o calmo e controlado do grupo. Um malandro
                        craque em Investigação? Ah, esse é o cínico desconfiado que todos amam.
                    </p>
                    <p>
                        Ah, mas a personalidade se forma como uma alquimia única à medida que o jogo avança. O azar nos
                        dados pode transformar seu personagem em um aracnofóbico inveterado após falhar em testes contra
                        uma aranha gigante. Ou, quem sabe, ele desenvolve uma inexplicável simpatia por iakarés piedosos
                        que o salvaram.
                    </p>
                    <p>
                        Lembre-se, no entanto, de não exagerar. Não queremos transformar seu personagem em um completo
                        lunático. Improvise com moderação, como quem adiciona um tempero raro a uma receita já deliciosa.
                        Afinal, em Pindorama, a arte de interpretar é uma comédia trágica, onde as risadas são tão
                        importantes quanto as reviravoltas do enredo.
                    </p>

                    <aside class="caixa-regra">
                        <h3 class="caixa-regra-titulo">O Propósito do RPG</h3>
                        <p>
                            Por mais que se debata sobre Pindorama e outros jogos similares, o objetivo tanto dos jogadores
                            quanto do narrador é singular: diversão. Essa experiência prazerosa se concretiza por meio de
                            uma trama e regras, entretanto, nenhum desses elementos deve desvirtuar a verdadeira essência
                            do jogo. Se você e seus amigos estão forjando uma narrativa memorável, repleta de reviravoltas
                            inesperadas e personagens inesquecíveis, ótimo. Contudo, a qualidade da história não deve se
                            sobrepor à diversão de todos os envolvidos. Se o grupo domina as regras e os jogadores superam
                            desafios cada vez mais complexos, excelente! No entanto, isso se torna insignificante se todos
                            não estiverem se divertindo.
                        </p>
                        <p>
                            Ao participar de Pindorama, priorize a interação entre as pessoas, a atmosfera descontraída e
                            o bem-estar dos participantes. Em geral, os momentos narrativos mais cativantes não surgem de
                            tramas minuciosamente planejadas, mas sim das surpresas geradas pela dinâmica entre os
                            jogadores. Este é um jogo fundamentado em relações pessoais, e nenhuma história ou regra deve
                            ser mais valorizada do que a amizade entre os participantes.
                        </p>
                    </aside>
                </section>

                <section id="os-dados" class="content-section">
                    <h2>Os Dados</h2>
                    <p>
                        Até agora, você estava tranquilo, construindo seu personagem e explorando o universo do jogo. No
                        entanto, como um inevitável imposto do destino, o narrador vai bater à sua porta e pedir um teste.
                        Mas não se desespere, nobre aventureiro, nas complexidades das regras de Pindorama, esse intrincado
                        labirinto, até os jogadores mais experientes se perdem.
                    </p>
                    <p>
                        As páginas seguintes podem parecer uma teia complexa de números e nuances, mas não é preciso decorar
                        cada detalhe. Deixe os colegas veteranos babarem sobre as mecânicas e os testes enquanto você se
                        dedica ao que realmente importa: escutar o narrador, rolar o dado certo e enfrentar as
                        consequências de suas escolhas.
                    </p>
                    <p>
                        Claro, há aqueles que buscam a otimização máxima, transformando seus personagens em máquinas de
                        eficiência, prontos para esmagar inimigos e desafios. Não há julgamento aqui; construir heróis
                        poderosos é quase uma tradição. No entanto, lembre-se de que Pindorama não é uma competição. Se o
                        dado não rolar a seu favor, isso não faz de você um membro menos valioso do grupo. Afinal, os
                        heróis épicos da ficção nem sempre eram perfeitos em termos de regras, não é mesmo?
                    </p>

                    <aside class="caixa-regra">
                        <h3 class="caixa-regra-titulo">Seja alguém legal!</h3>
                        <p>
                            Em Pindorama, há possibilidades de interações que sugerem uma certa dose de desafios. O
                            narrador, esse ser impiedoso, incorpora vilões e apresenta obstáculos a serem superados. Os
                            personagens, ocasionalmente, podem fracassar. Sim, o mundo fictício possui sua dose de
                            dificuldades, e é por isso que heróis são tão necessários, acredite.
                        </p>
                        <p>
                            Entretanto, é vital compreender que qualquer hostilidade permanece confinada aos limites da
                            ficção. Nenhuma interação entre jogadores, mesmo aquelas através de personagens, deve
                            ultrapassar os limites do conforto de cada um. Nenhuma característica do mundo real deve ser
                            trazida à mesa de jogo de forma pejorativa, a fim de tornar um jogador ou personagem
                            vulnerável. Independente da trama ou das regras, qualquer jogador pode (e deve) interromper o
                            jogo para expressar desconforto. Mas a responsabilidade não é unilateral; todos devem manter
                            um olhar atento às reações, aos comentários e à postura dos colegas, garantindo que ninguém
                            ultrapasse os limites. Afinal, uma sessão de Pindorama deve ser um reduto seguro.
                        </p>
                        <p>
                            A discriminação é mais indesejável do que 5 falhas críticas consecutivas. Pessoas de todas as
                            etnias, gêneros, orientações, crenças e estilos de vida são calorosamente recebidas. Nem mesmo
                            no intricado mundo fictício do jogo deveria existir qualquer forma de discriminação. Sinta-se
                            à vontade para jogar com personagens diversos, sem se preocupar com resistência dos
                            coadjuvantes controlados pelo narrador. Claro, exceto quando se trata de vilões intolerantes,
                            mas, nesses casos, apenas se todos estiverem confortáveis em enfrentá-los. Não há razão para
                            reproduzir no jogo os preconceitos experimentados na realidade.
                        </p>
                        <p>
                            A inclusão é um tema destacado em Pindorama e, como tal, deve ser praticada pelo grupo. Nenhum
                            jogador deve se sentir superior aos outros; nenhum personagem é mais ou menos válido que os
                            demais. Se, por acaso, você estiver se sentindo perdido em busca de um grupo acolhedor, não
                            hesite em procurar a comunidade de Pindorama na vastidão da internet. Garanto que encontrará
                            jogadores de todo o Brasil prontos para recebê-lo, afinal, é mais fácil encontrar um candango
                            em Pindorama do que um grupo que não o acolha de braços abertos.
                        </p>
                    </aside>

                    <p>
                        E aqui chegamos a uma verdade universal: nem sempre a eloquência vence. Se você pretende impressionar
                        o senhor de engenho com um discurso, não adianta despejar palavras bonitas como um poeta romântico.
                        Ah, não! Você precisa do bendito dado para decidir o destino desse velho dono de engenho. E não
                        pense que narrações grandiosas ou atuações dramáticas vão enganar o narrador. Em Pindorama, até o
                        mais eloquente dos jogadores enfrenta o mesmo destino incerto de um teste; a fala persuasiva não faz
                        de você superior. Todos começam com as mesmas chances, e até o mais tímido dos jogadores pode
                        encarnar um personagem eloquente e carismático. Escolhas e personalidade são forjadas na
                        interpretação, enquanto os testes decidem o curso incerto do sucesso e do fracasso. Que as águas
                        incertas de Pindorama levem você a novas jornadas, e que os dados rolem a seu favor... ou não.
                    </p>
                </section>

                <section id="vitorias-derrotas" class="content-section">
                    <h2>Vitórias &amp; Derrotas</h2>
                    <p>
                        Num mundo onde um pequeno candango tem o poder de derrubar rústicos fortões e sacerdotes podem
                        brilhar mais que o sol em assuntos religiosos, é preciso entender uma verdade fundamental ao
                        adentrar o reino do Pindorama: seu personagem é apenas uma peça no jogo, e você, meu caro, não é
                        ele.
                    </p>
                    <p>
                        Não se engane, por mais que o destino do seu personagem seja selado pelos caprichos de dados e
                        regras impiedosas, suas vitórias e derrotas nesse tabuleiro não têm qualquer impacto na sua vida
                        real.
                    </p>
                    <p>
                        E quando seu herói, que você imaginava ser a estrela do espetáculo, está ali, coçando a cabeça e
                        sem saber o que fazer na cena, respire fundo. O grupo é uma orquestra de egos inflados, cada um
                        merecendo seu momento ao sol. Se você está na sombra momentânea, não há necessidade de entrar em
                        colapso existencial. Os holofotes oscilam como uma gangorra em um parque de diversões.
                    </p>
                    <p>
                        Numa partida de Pindorama, onde os dados têm uma personalidade volúvel, aceite a verdade inegável:
                        às vezes, o destino decide que seu feiticeiro brilhante vai falhar miseravelmente naquela conjuração
                        épica. O riso dos outros jogadores é apenas a trilha sonora da sua desgraça momentânea. Divirta-se
                        com ela. Afinal, todos compartilhamos o mesmo destino cruel neste reino de caos e magia.
                    </p>
                    <p>
                        Relaxe. Seu personagem é uma peça do quebra-cabeça, uma nota dissonante na sinfonia do caos. Seus
                        colegas de grupo estão aqui para rir junto com você, não de você. Afinal, em Pindorama, a
                        verdadeira vitória é compartilhar o palco com heróis, companheiros e amigos, mesmo que um
                        personagem do narrador ocasionalmente roube a cena.
                    </p>

                    <figure class="image-placeholder">
                        Imagem futura: ilustração da mesa de RPG — grupo reunido em torno do mapa, miniaturas e dados.
                    </figure>
                </section>

                <section id="regras-jogo" class="content-section">
                    <h2>Regras do Jogo</h2>
                </section>

                <section id="testes" class="content-section">
                    <h3>Testes</h3>
                    <p>
                        Sempre que um personagem se aventura em uma ação cujo desfecho é incerto, a trama do jogo é
                        determinada por um teste. Essa análise se dá por meio do lançamento de 1d20, ao qual somamos um
                        modificador. Os testes são categorizados conforme a característica utilizada (atributo ou perícia)
                        e a Classe da Dificuldade (comum ou oposta).
                    </p>

                    <h3 id="testes-atributo">Testes de Atributo</h3>
                    <p>
                        Os testes de atributo são empregados em tarefas fundamentais, nas quais nenhuma perícia específica
                        é aplicável. Para executar um teste de atributo, o jogador lança 1d20 e adiciona o valor do
                        atributo relevante.
                    </p>
                    <p class="formula-destaque">Fórmula do Teste de Atributo: 1d20 + Atributo</p>
                    <p>Segue alguns exemplos de testes de atributo, acompanhados do atributo testado:</p>
                    <ul>
                        <li>Levantar um objeto pesado (Força).</li>
                        <li>Amarrar cordas (Destreza).</li>
                        <li>Estabilizar sangramento (Constituição).</li>
                        <li>Resolver um enigma (Inteligência).</li>
                        <li>Tomar decisões prudentes (Sabedoria).</li>
                        <li>Causar uma boa impressão (Carisma).</li>
                    </ul>

                    <h3 id="testes-pericia">Testes de Perícia</h3>
                    <p>
                        Os testes de perícia seguem a mesma lógica dos testes de atributo, porém, agora, o jogador adiciona
                        o bônus da perícia em questão (isso inclui o atributo ao qual ela está relacionada e quaisquer
                        outros bônus).
                    </p>
                    <p class="formula-destaque">Fórmula do Teste de Perícia: 1d20 + Bônus de Perícia</p>
                    <p>
                        O <a href="pericias.php">Capítulo 2: Perícias &amp; Poderes</a> oferece detalhes sobre como calcular
                        o bônus de cada perícia.
                    </p>

                    <h3 id="testes-comuns">Testes Comuns</h3>
                    <p>
                        Testes comuns são usados quando um personagem enfrenta desafios ambientais. Eles são realizados
                        contra uma CD determinada pelo narrador, alinhada com a tarefa em questão. A Tabela 5-1: Dificuldades
                        fornece exemplos.
                    </p>
                    <p>
                        Os narradores podem basear as dificuldades de todos os testes utilizando a tabela como orientação,
                        enquanto o Capítulo 2 oferece exemplos específicos para tarefas associadas a cada perícia.
                    </p>

                    <div class="regras-table-wrap">
                        <table class="regras-table">
                            <caption>Tabela 5-1: Dificuldades</caption>
                            <thead>
                                <tr><th>Tarefa</th><th>CD</th><th>Exemplo</th></tr>
                            </thead>
                            <tbody>
                                <tr><td>Fácil*</td><td>5</td><td>Subir uma encosta íngreme (Atletismo)</td></tr>
                                <tr><td>Média</td><td>10</td><td>Ouvir um guarda se aproximando (Percepção)</td></tr>
                                <tr><td>Difícil</td><td>15</td><td>Estancar um sangramento (Cura)</td></tr>
                                <tr><td>Desafiadora</td><td>20</td><td>Nadar contra uma correnteza (Atletismo)</td></tr>
                                <tr><td>Formidável</td><td>25</td><td>Sabotar uma armadilha complexa (Ladinagem)</td></tr>
                                <tr><td>Heroica</td><td>30</td><td>Decifrar um pergaminho antigo em um idioma morto (Conhecimento)</td></tr>
                                <tr><td>Quase Impossível</td><td>40</td><td>Fabricar uma "obra-prima", ou seja, um item com quatro melhorias (Ofício)</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <p style="font-size: 0.85rem; color: var(--muted, #6f5876); font-style: italic;">
                        *Testes fáceis estão presentes na tabela para dar uma ideia de escala, mas geralmente não são
                        obrigatórios. Se um personagem tentar uma tarefa fácil, o narrador pode decidir que ele passa
                        automaticamente, visando agilizar o desenrolar do jogo.
                    </p>

                    <h3 id="testes-opostos">Testes Opostos</h3>
                    <p>
                        Testes opostos são usados quando dois ou mais personagens competem diretamente. Cada personagem faz
                        seu teste, sendo o vencedor aquele com o resultado mais alto. Em caso de empate, a vantagem vai
                        para aquele com o maior bônus. Se, mesmo assim, os bônus forem idênticos, uma nova rolagem se faz
                        necessária.
                    </p>

                    <h3>Juntando Testes Comuns e Opostos</h3>
                    <p>
                        É possível que um teste incorpore elementos tanto comuns quanto opostos. Como exemplo, se três
                        personagens disputam quem consegue chegar mais rápido no alto de uma ribeira, cada um realiza um
                        teste de Atletismo contra uma CD específica. Aqueles que obtêm sucesso conseguem subir a ribeira,
                        e dentre esses, aquele que conseguir o resultado mais alto (levando em consideração o somatório do
                        resultado no d20 + bônus de perícia), chega primeiro. A ordem seguinte vem na mesma ordem
                        decrescente dos resultados obtidos.
                    </p>
                </section>

                <section id="regras-adicionais-testes" class="content-section">
                    <h2>Regras Adicionais de Testes</h2>
                    <p>
                        Aqui estão algumas regras adicionais que se aplicam aos testes, trazendo nuances e complexidade ao
                        processo de jogo.
                    </p>

                    <h3>Sucessos e Falhas Automáticos</h3>
                    <p>
                        Ao realizar um teste, um resultado natural de 20 no d20 sempre resulta em sucesso, enquanto um
                        resultado natural de 1 no d20 sempre resulta em falha, independentemente do valor alvo.
                    </p>

                    <h3>Condições Favoráveis e Desfavoráveis</h3>
                    <p>
                        Determinadas situações podem facilitar ou dificultar um teste. O mestre pode ajustar o teste de
                        duas maneiras para representar essas condições.
                    </p>
                    <ul>
                        <li>
                            Conceder um <strong>bônus de +2 ou mais</strong> ao personagem para refletir circunstâncias
                            favoráveis, como procurar por um livro em uma biblioteca bem organizada com um teste de
                            Investigação.
                        </li>
                        <li>
                            Impor uma <strong>penalidade de –2 ou mais</strong> ao personagem para refletir circunstâncias
                            adversas, como procurar por um frasco específico em um laboratório bagunçado com um teste de
                            Investigação.
                        </li>
                    </ul>

                    <h3>Novas Tentativas</h3>
                    <p>
                        Em geral, é possível tentar um teste novamente em caso de falha, sem limitações temporais. No
                        entanto, certos testes podem acarretar penalidades em caso de falha. Por exemplo, falhar em um
                        teste de Atletismo para escalar uma encosta pode resultar em uma queda, com penalidades adicionais
                        se a falha for significativa.
                    </p>

                    <h3>Ferramentas</h3>
                    <p>
                        Algumas perícias demandam o uso de ferramentas, conforme especificado em suas descrições. A
                        ausência dessas ferramentas implica em uma penalidade de –5 no teste, caso a perícia seja utilizada.
                    </p>

                    <h3>Ajudar</h3>
                    <p>
                        Quando personagens colaboram, um personagem líder realiza o teste normalmente, enquanto cada
                        ajudante realiza um teste contra uma CD 10, utilizando a mesma perícia ou uma pertinente. A ajuda
                        concede ao líder um bônus de +1, com acréscimos adicionais para cada 10 pontos acima da CD.
                    </p>
                </section>

                <section id="testes-sem-rolagens" class="content-section">
                    <h2>Testes sem Rolagens</h2>
                    <p>
                        Em situações onde a tarefa não é desafiadora ou realizada sob perigo significativo, é possível
                        dispensar as rolagens de teste. Essa abordagem é útil para agilizar o jogo, evitando interrupções
                        desnecessárias na narrativa.
                    </p>
                    <p>
                        <strong>Escolher 0.</strong> Quando sua perícia é tão especializada que a tarefa se torna trivial
                        para você, basta ter um bônus total igual ou superior à CD para automaticamente passar na ação.
                        Por exemplo, um personagem com Sobrevivência +15 não precisa fazer testes para montar acampamento
                        em uma planície com uma CD de 15. Caso a tarefa admita variações de sucesso, você obtém o mínimo
                        possível sem a necessidade de rolar dados. Contudo, há a opção de rolar para buscar um sucesso
                        excepcional, com o risco de falha se sair um 1 natural.
                    </p>
                    <p>
                        <strong>Escolher 10.</strong> Quando não há pressão para realizar uma tarefa, você pode optar por
                        escolher 10. Essa escolha implica em realizar a tarefa com tranquilidade, sem margem para erros. Em
                        vez de lançar 1d20, considere automaticamente um resultado de 10. Essa abordagem costuma ser
                        suficiente para muitas tarefas.
                    </p>
                    <p>
                        <strong>Escolher 20.</strong> Em situações sem pressão e onde não há consequências ou penalidades
                        em caso de falha, você pode escolher 20. Isso significa investir todo o tempo disponível,
                        explorando todas as possibilidades até alcançar o sucesso. Em vez de lançar 1d20, considere
                        automaticamente um resultado de 20. No entanto, optar por escolher 20 demanda vinte vezes mais
                        tempo que o normal para executar a perícia, ou, para simplificar, toda a cena, conforme determinado
                        pelo mestre.
                    </p>
                </section>

                <section id="testes-estendidos" class="content-section">
                    <h2>Testes Estendidos</h2>
                    <p>
                        A resolução de grande parte das tarefas no jogo se dá por meio de um único teste. Se um personagem
                        precisa escalar um muro, o resultado, seja sucesso ou falha, torna-se evidente após uma única
                        tentativa. No entanto, em situações mais intricadas e que demandam tempo, como a escalada de uma
                        montanha, ou quando o mestre deseja criar uma atmosfera de tensão, a regra dos Testes Estendidos
                        entra em cena.
                    </p>
                    <p>
                        Em um teste estendido, o grupo enfrenta o desafio de acumular uma quantidade específica de
                        sucessos antes de registrar três falhas, o que indica uma falha total. A complexidade da tarefa
                        determina a quantidade de sucessos necessários, conforme indicado na tabela a seguir.
                    </p>
                    <p>
                        Por exemplo, imaginemos que os personagens estão em busca do esconderijo de um bando de
                        cangaceiros. Para alcançar esse objetivo, eles precisam fazer perguntas pela cidade. Dada a
                        complexidade da tarefa, o mestre propõe um teste estendido de Investigação com complexidade média
                        e CD 20. Isso implica que os heróis devem realizar testes de Investigação contra CD 20 até
                        acumularem cinco sucessos. Se alcançarem esse objetivo, descobrirão as pistas necessárias. Contudo,
                        se acumularem três falhas antes de atingir os cinco sucessos, enfrentam uma falha total. Nesse
                        caso, o grupo pode ter sido negligente, alertando os membros do bando, além de não obter a
                        informação desejada.
                    </p>
                    <p>
                        É válido destacar que os testes estendidos podem envolver múltiplas perícias. Por exemplo,
                        infiltrar-se em uma base patriota pode requerer sucesso em Atletismo para escalar o muro e dois
                        sucessos em Furtividade para evitar ser avistado pelas sentinelas. Da mesma forma, um julgamento
                        pode demandar dois sucessos em Nobreza para entender a lei e mais três em Diplomacia para persuadir
                        o magistrado.
                    </p>

                    <div class="regras-table-wrap">
                        <table class="regras-table">
                            <caption>Tabela 5-2: Testes Estendidos</caption>
                            <thead>
                                <tr><th>Sucessos Exigidos</th><th>Complexidade</th><th>Exemplos</th></tr>
                            </thead>
                            <tbody>
                                <tr><td>3</td><td>Baixa</td><td>Escalar um paredão (Atletismo)</td></tr>
                                <tr><td>5</td><td>Média</td><td>Atravessar um pântano profundo (Sobrevivência)</td></tr>
                                <tr><td>7</td><td>Alta</td><td>Compreender um ritual antigo (Misticismo)</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <h3>Testes Estendidos Abertos</h3>
                    <p>
                        O narrador tem a prerrogativa de conceder aos jogadores a decisão sobre quais perícias utilizarão
                        em um teste estendido. O jogador, nesse contexto, seleciona a perícia desejada e, em seguida,
                        explica de que maneira pretende empregá-la para superar o desafio proposto.
                    </p>
                    <p>
                        Por exemplo, durante um julgamento, uma opção possível é utilizar a perícia Enganação (corrompendo
                        o magistrado); pode escolher Intimidação (assustando os jurados para influenciar a decisão a seu
                        favor), ou ainda usar Intuição (analisando a situação para determinar o argumento mais eficaz,
                        entre outras possibilidades).
                    </p>
                    <p>
                        Dessa forma, os jogadores podem descrever suas escolhas de perícias, contribuindo para uma maior
                        imersão na cena. Caso o mestre aprove essa dinâmica, cada teste individual realizado durante o
                        teste estendido deve utilizar uma perícia diferente. Essa restrição, quando combinada com as
                        opções que adicionam dificuldades aos testes estendidos (conferir abaixo), demanda um pensamento
                        tático por parte do grupo, incentivando a colaboração estratégica para superar os desafios
                        apresentados.
                    </p>

                    <h3>Testes Estendidos em Conjunto</h3>
                    <p>
                        Os testes estendidos se fazem ao longo do tempo e por isso podem envolver a participação de mais
                        de um personagem, até mesmo de todo o grupo. De fato, engajar o grupo inteiro em um único teste
                        estendido revela-se uma excelente maneira de fortalecer os laços entre os jogadores!
                    </p>
                    <p>
                        Quando múltiplos personagens participam de um teste estendido, a resolução pode ocorrer por meio
                        de "rodadas". Em cada rodada, cada jogador realiza um teste, e a soma dos sucessos e falhas de
                        todos determina se o teste estendido foi bem-sucedido ou não.
                    </p>
                    <p>
                        A prática de realizar testes estendidos em grupo mostra-se especialmente vantajosa em situações
                        de testes estendidos abertos (conferir acima), nos quais cada perícia pode ser empregada apenas
                        uma vez. Com diversos personagens contribuindo para o teste, aumentam as chances de possuírem
                        perícias treinadas distintas, enriquecendo as opções disponíveis para superar os desafios
                        apresentados.
                    </p>

                    <h3>Colaboração em Testes Estendidos</h3>
                    <p>
                        Dentro do contexto dos testes estendidos, é permitido que personagens auxiliem uns aos outros,
                        seguindo a regra padrão de ajuda. Contudo, é importante destacar que uma perícia utilizada para
                        oferecer assistência não poderá ser empregada novamente no mesmo teste estendido, seja para dar
                        suporte a outro personagem ou para realizar o teste principal.
                    </p>

                    <h3>Dificultando Testes Estendidos</h3>
                    <p>
                        Para desafios especialmente árduos em testes estendidos, o narrador pode introduzir
                        <em>dificuldades acumulativas</em> e <em>penalidades por falhas</em>.
                    </p>
                    <p>
                        No primeiro cenário, a CD aumenta em +2 a cada teste (independentemente de ser bem-sucedido ou
                        não), refletindo a crescente complexidade da tarefa. Por exemplo, em um teste prolongado para se
                        infiltrar nos aposentos reais de um castelo, a CD pode aumentar a cada tentativa, pois a
                        proximidade do quarto do rei implica em maiores medidas de segurança.
                    </p>
                    <p>
                        No segundo cenário, o mestre impõe penalidades para cada falha, intensificando a proximidade do
                        fracasso total. Suponhamos que um personagem esteja envolvido em uma negociação complexa com um
                        aristocrata, envolvendo um teste prolongado de Diplomacia. A cada falha, ele pode sofrer uma
                        penalidade acumulativa de –2 nos testes subsequentes — indicando que o aristocrata está
                        gradativamente se ofendendo. De maneira similar, um personagem escalando uma montanha com um
                        teste prolongado de Atletismo pode sofrer 3d6 pontos de dano a cada falha, representando
                        ferimentos durante a ascensão.
                    </p>

                    <h3>Interrupções e Novas Investidas</h3>
                    <p>
                        A maioria dos testes prolongados pode ser interrompida sem grandes complicações. Contudo, o
                        narrador tem o poder de determinar que uma interrupção seja considerada uma falha, e até mesmo uma
                        falha completa, no teste estendido.
                    </p>
                    <p>
                        Geralmente, é permitido realizar novas tentativas em testes prolongados. No entanto, assim como
                        nos testes convencionais, alguns testes prolongados acarretam consequências que devem ser
                        cuidadosamente consideradas. Por exemplo, uma armadilha que requer um teste prolongado de
                        Ladinagem pode ser ativada em caso de falha.
                    </p>

                    <figure class="image-placeholder">
                        Imagem futura: ilustração de aventureiro élfico atravessando floresta densa.
                    </figure>
                </section>

                <section id="habilidades" class="content-section">
                    <h2>Habilidades</h2>
                    <p>
                        Além dos atributos e perícias, os personagens possuem habilidades provenientes de sua raça,
                        biografia, classe, itens e outras fontes.
                    </p>

                    <h3>Utilizando Habilidades</h3>
                    <p>
                        As habilidades podem ser <em>passivas</em> (com efeitos sempre ativos) ou <em>ativadas</em>
                        (exigindo ação para produzirem efeitos). O poder "Especialista em Escola" do hermético é uma
                        habilidade passiva, enquanto a "Imobilização" do lutador é uma habilidade ativada. Para utilizar
                        habilidades ativadas, é necessário gastar uma ação e, frequentemente, pontos de mana.
                    </p>

                    <h3>Ação Necessária</h3>
                    <p>
                        A descrição da habilidade indica a ação necessária para ativá-la. Caso não haja especificação,
                        utilizar a habilidade é uma ação livre (exceto nos casos descritos abaixo).
                    </p>
                    <p>
                        <strong>Habilidades Engatilhadas:</strong> Habilidades que são ativadas como reação a outro evento
                        (como um ataque), só podem ser acionadas uma vez por instância do evento.
                    </p>
                    <p style="font-size: 0.9rem; font-style: italic;">
                        Por exemplo, a habilidade "Frenesi" do rústico diz que, ao realizar a ação "agredir", o personagem
                        pode gastar 2 PM para efetuar um ataque adicional. Ativar "Frenesi" é uma reação e só pode ocorrer
                        uma vez por ação "agredir".
                    </p>

                    <h3>Custo de Pontos de Mana</h3>
                    <p>
                        A descrição da habilidade especifica se há a necessidade de PM para ativá-la. Nesses casos, os PM
                        são gastos mesmo em falhas. Por exemplo, se um guerreiro usa Ataque Especial e erra o ataque,
                        ainda assim gasta os pontos de mana.
                    </p>
                    <p>
                        Para habilidades com custo variável, o máximo de PM que pode ser gasto por uso é igual ao nível na
                        classe que fornece a habilidade, embora sempre seja possível usar a habilidade no custo mínimo. No
                        caso de habilidades de raça, origem, ou outras fontes e poderes gerais, o limite é o nível do
                        personagem.
                    </p>

                    <aside class="caixa-regra">
                        <h3 class="caixa-regra-titulo">Clarificações de Regras</h3>
                        <p>
                            <strong>Arredondando.</strong> A menos que indicado o contrário, sempre que um efeito indica
                            uma divisão, arredonde para baixo. Por exemplo, se um ataque causa 9 pontos de dano e um
                            efeito reduz esse dano à metade, o ataque causa apenas 4 pontos de dano.
                        </p>
                        <p>
                            <strong>Ordem.</strong> Se mais de um efeito afetar um valor, siga a ordem de operações
                            padrão. Ou seja, aplique primeiro multiplicações e divisões, depois somas e subtrações. O
                            resultado de um teste de resistência é sempre o primeiro a ser aplicado.
                        </p>
                        <p>
                            <em>Por exemplo:</em> um guerreiro usando uma armadura incandescente (que fornece redução de
                            fogo 10) é atingido por uma Bola de Fogo que causa 26 pontos de dano. Primeiro, ele faz seu
                            teste de Reflexos. Se passar, reduz o dano à metade, para 13 (26/2=13). Então, o guerreiro
                            pode usar a habilidade Durão. Se tiver passado no teste de resistência, sofrerá 6 pontos de
                            dano (13/2=6). Se tiver falhado, sofrerá 13 pontos de dano (26/2=13). Por fim, ele aplica sua
                            RD 10. Se tiver passado no teste de resistência e usado a habilidade Durão, não sofrerá dano.
                            Se tiver passado no teste de resistência ou usado a habilidade Durão, sofrerá 3 pontos de
                            dano (13–10=3). Por fim, se não tiver passado no teste nem usado Durão, sofrerá 16 pontos de
                            dano (26–10=16).
                        </p>
                        <p>
                            <strong>Multiplicações.</strong> Se mais de um efeito fizer você multiplicar um valor,
                            combine-os em um único multiplicador, com cada efeito além do primeiro adicionando seu
                            multiplicador –1. Por exemplo, dois efeitos que dobrem o valor (×2 + ×2) irão triplicar o
                            valor (2 + [2–1] = 3) em vez de quadruplicá-lo.
                        </p>
                    </aside>

                    <h3>Custos Especiais</h3>
                    <p>Algumas habilidades têm custos além dos PM.</p>
                    <p>
                        <strong>Componente Material:</strong> A habilidade exige ingredientes para ser usada. Esses
                        ingredientes devem estar na mão do personagem e são consumidos com o uso (mesmo que a habilidade
                        falhe).
                    </p>
                    <p>
                        <strong>Penalidade de PM:</strong> A habilidade reduz temporariamente os PM máximos enquanto a
                        habilidade estiver ativa (você não recupera esses PM até a duração da habilidade acabar).
                    </p>
                    <p>
                        <strong>Sacrifício de PM:</strong> Habilidades poderosas requerem o sacrifício
                        <em>permanente</em> de uma quantidade específica de PM.
                    </p>

                    <h3>Alcance</h3>
                    <p>
                        Muitas habilidades têm alcance, indicando a distância máxima a partir do personagem para o efeito
                        ocorrer. Caso alguma parte da área da habilidade ultrapasse o alcance, essa área é afetada
                        normalmente.
                    </p>

                    <figure class="image-placeholder">
                        Imagem futura: comparação visual dos alcances — Toque (alvo adjacente), Curto (6 quadrados / 9 m),
                        Médio (20 quadrados / 30 m), Longo (60 quadrados / 90 m). Faixas concêntricas em um mesmo grid.
                    </figure>
                    <ul>
                        <li><strong>Pessoal.</strong> Afeta apenas o próprio personagem e/ou objetos que ele carregue.</li>
                        <li><strong>Toque.</strong> O personagem precisa tocar o alvo em seu alcance, sem a necessidade de ação adicional.</li>
                        <li><strong>Curto.</strong> Alcance de até 9m (6 quadrados em um mapa).</li>
                        <li><strong>Médio.</strong> Alcance de até 30m (20 quadrados em um mapa).</li>
                        <li><strong>Longo.</strong> Alcance de até 90m (60 quadrados em um mapa).</li>
                        <li><strong>Ilimitado.</strong> Alcance por todo o mundo; geralmente, requer que você conheça e/ou já tenha estado no ponto de origem da habilidade.</li>
                    </ul>

                    <h3>Efeito</h3>
                    <p>
                        Cada habilidade resulta em um efeito específico, seja causando dano a um alvo, proporcionando um
                        bônus a você ou qualquer outra coisa. Abaixo, apresentamos as regras gerais para esses efeitos.
                        Muitos deles possuem um tipo específico (ver "Tipos de Efeitos" mais adiante).
                    </p>
                </section>

                <section id="alvos-areas" class="content-section">
                    <h2>Alvos &amp; Áreas</h2>
                    <p>A maioria das habilidades atinge um ou mais alvos ou afeta uma determinada área.</p>
                    <p>
                        <strong>Linha de Efeito.</strong> Um caminho direto e sem obstruções até onde a habilidade pode ter
                        efeito. É necessário ter linha de efeito para qualquer alvo ou ponto de origem da área que se
                        deseja afetar, ou para qualquer espaço onde se pretende criar um efeito. Qualquer barreira sólida,
                        visível ou não, anula a linha de efeito.
                    </p>

                    <figure class="image-placeholder">
                        Imagem futura: dois exemplos lado a lado — esquerda, conjurador com linha tracejada chegando ao
                        alvo (linha de efeito válida); direita, parede ou pilar interrompendo a mesma linha (anulada).
                    </figure>
                    <p>
                        <strong>Alvo.</strong> A habilidade afeta um ou mais alvos, que podem ser criaturas ou objetos. A
                        habilidade deve ser usada nos alvos, sendo essencial que o usuário possa percebê-los. Se uma
                        habilidade for usada em um tipo de alvo incorreto, ela falhará automaticamente. Por exemplo, a
                        magia "Tranca Arcana" não tem efeito se lançada sobre algo que não seja uma porta, baú ou algo
                        semelhante.
                    </p>
                    <p>
                        <em>Objetos e Tamanhos.</em> Algumas habilidades se referem a objetos em termos de espaços —
                        consulte o Capítulo 3. Outras habilidades se referem a objetos em termos de categorias de tamanho.
                        Nesse caso, o mestre deve arbitrar a categoria do objeto comparando-o com criaturas. Por exemplo,
                        uma adaga é um objeto Minúsculo, uma carroça é um objeto Grande e um galeão é um objeto Colossal.
                    </p>
                    <p>
                        <strong>Área.</strong> A habilidade afeta uma área. Geralmente, você escolhe um ponto dentro do
                        alcance e que possa perceber para ser a origem da área, mas não tem controle sobre quais criaturas
                        ou objetos serão afetados — qualquer coisa na área estará sujeita aos efeitos, incluindo você. Com
                        a permissão do narrador, você pode usar uma habilidade em uma área que não pode perceber,
                        realizando um teste de Percepção (ou Misticismo para magias) contra CD 20 + custo em PM. Para
                        habilidades com alcance pessoal, você é o ponto de origem e não é afetado, a menos que seja
                        indicado o contrário. As áreas avançam até seu limite ou são interrompidas por uma barreira capaz
                        de bloqueá-las. Em geral, as áreas se enquadram em uma das categorias a seguir:
                    </p>
                    <ul>
                        <li><strong>Cilindro.</strong> Surge na interseção de quatro quadrados, estendendo-se pela largura indicada e subindo até o fim da altura indicada.</li>
                        <li><strong>Cone.</strong> Surge adjacente a você e se afasta em direção escolhida, tornando-se mais largo com a distância.</li>
                        <li><strong>Esfera.</strong> Surge na interseção de quatro quadrados, estendendo-se em todas as direções até o limite de seu raio.</li>
                        <li><strong>Linha.</strong> Surge adjacente a você e se afasta em linha reta até o fim do alcance. A menos que indicado o contrário, uma linha tem 1,5m de largura.</li>
                        <li><strong>Quadrado.</strong> Surge no quadrado ou quadrados escolhidos, afetando o piso. Um "cubo" é semelhante a um quadrado, mas afeta também a altura.</li>
                        <li><strong>Outros.</strong> Algumas habilidades podem ter áreas específicas, mencionadas em sua descrição.</li>
                    </ul>
                    <p>
                        <strong>Criação.</strong> Se a habilidade cria ou invoca algo, esse algo aparece em um local
                        escolhido dentro do alcance e para o qual você tenha linha de efeito. Após surgir, a coisa pode
                        mover-se para fora da linha de efeito. Por exemplo: você não pode conjurar um monstro dentro de
                        uma sala fechada. No entanto, uma vez conjurado, o monstro pode entrar na sala, mesmo que você
                        ainda não tenha linha de efeito para o seu interior.
                    </p>
                    <p>
                        <strong>Redirecionando Efeitos.</strong> Algumas habilidades permitem redirecionar seu efeito para
                        novos alvos ou áreas após serem usadas. Quando possível, redirecionar a habilidade é uma ação
                        padrão.
                    </p>

                    <div class="areas-figuras-grid">
                        <figure class="image-placeholder">
                            Imagem futura: <strong>Cone</strong> — surge adjacente ao conjurador e se expande na direção
                            apontada (padrão Pindorama 1 → 3 → 3 → 5 → 5…).
                        </figure>
                        <figure class="image-placeholder">
                            Imagem futura: <strong>Linha</strong> — 1 quadrado de largura saindo do conjurador em linha
                            reta até o fim do alcance.
                        </figure>
                        <figure class="image-placeholder">
                            Imagem futura: <strong>Raio / Esfera</strong> — área circular ao redor de um ponto central,
                            no padrão "diamante" do livro.
                        </figure>
                        <figure class="image-placeholder">
                            Imagem futura: <strong>Quadrado / Cubo</strong> — célula(s) escolhida(s) afetando o piso
                            (cubo afeta também a altura).
                        </figure>
                    </div>
                </section>

                <section id="acumulando-efeitos" class="content-section">
                    <h2>Acumulando Efeitos</h2>
                    <p>
                        A interação entre diferentes efeitos depende de sua origem, que pode ser
                        <strong>habilidades</strong>, <strong>perícias</strong>, <strong>itens</strong>,
                        <strong>magias</strong>, <strong>parceiros</strong> ou o <strong>ambiente</strong>.
                    </p>
                    <p>
                        Efeitos provenientes de habilidades e perícias acumulam entre si, exceto quando derivam da mesma
                        fonte. Por exemplo, o bônus na "Defesa da Pele de Ferro" do rústico acumula com o bônus na "Defesa
                        da Esquiva Sagaz" do fanfarrão, mas isso não inclui magias.
                    </p>
                    <p>
                        Efeitos provenientes de itens, magias, parceiros e do ambiente acumulam com os de outras fontes,
                        mas não entre si. Por exemplo, um personagem com um item que forneça +1 em Fortitude e uma magia
                        que também ofereça +1 em Fortitude terá um bônus total de +2 nessa perícia. No entanto, se o
                        personagem possuir dois itens ou duas magias que concedam +1 em Fortitude, esses efeitos não
                        acumularão, pois são da mesma fonte.
                    </p>
                    <p>
                        <strong>Armaduras.</strong> Bônus na Defesa e penalidade de armadura em escudos acumulam-se com
                        os de armaduras e um outro item adicional à escolha do jogador.
                    </p>
                    <p>
                        <strong>Atributos.</strong> O valor de um mesmo atributo não se acumula em características do
                        personagem. Por exemplo, um sacerdote/xamã não soma duas vezes sua Sabedoria nos pontos de mana.
                        A exceção são perícias, onde é possível somar um atributo a uma perícia que utilize o mesmo
                        atributo-chave, mas apenas uma vez. Por exemplo, um caçador pode usar Explorador para somar sua
                        Sabedoria em Percepção e Sobrevivência (perícias que usam Sabedoria).
                    </p>
                    <p>
                        <strong>Chance de Falha.</strong> A chance de falha nunca acumula acima de 75%. Sempre há, no
                        mínimo, uma chance de 1 em 4 de acertar o alvo.
                    </p>
                    <p>
                        <strong>Reduções de Custo.</strong> Reduções no custo de PM não são cumulativas, e uma habilidade
                        nunca pode ter seu custo reduzido para menos de 1 PM.
                    </p>

                    <h3>Efeitos que Afetam Testes</h3>
                    <p>
                        Efeitos que fornecem um bônus a um teste ou modificam sua dificuldade devem ser usados antes de
                        rolar o dado. Efeitos que permitem rolar novamente o dado devem ser utilizados antes de o narrador
                        declarar se o teste foi bem-sucedido ou não.
                    </p>
                    <p>
                        Por exemplo, a habilidade Duelo do inquisidor, que fornece um bônus para um teste, deve ser usada
                        antes de rolar o dado. Já a habilidade "Mestre em Arma" do guerreiro, que permite rolar novamente
                        um ataque recém-realizado, deve ser usada antes do narrador declarar se o ataque acertou ou não.
                    </p>

                    <h3>Limites de Nível</h3>
                    <p>
                        Algumas habilidades são limitadas pelo nível do personagem. Para classes, utiliza-se o nível
                        naquela classe; para outros casos, o nível de personagem.
                    </p>
                    <p>
                        Por exemplo, a habilidade "Insolência" do fanfarrão permite somar o Carisma na Defesa, limitado
                        pelo nível do personagem. Assim, um fanfarrão de 2º nível com Carisma 3 soma +2 na Defesa. Ao
                        subir para o 3º nível, passará a somar +3. Da mesma forma, um lutador de 4º nível usando a
                        habilidade "Voadora" soma no máximo +4d6 de dano, mesmo que tenha se deslocado mais de 8 quadrados.
                    </p>

                    <h3>Duração</h3>
                    <p>A duração de uma habilidade indica por quanto tempo seu efeito permanece ativo.</p>
                    <ul>
                        <li><strong>Instantânea.</strong> O efeito da habilidade termina assim que é utilizada, mas suas consequências podem perdurar. Por exemplo, a magia <em>Curar Ferimentos</em> age instantaneamente, mas os ferimentos permanecem curados.</li>
                        <li><strong>Cena.</strong> A habilidade permanece ativa durante toda uma cena, encerrando-se quando esse momento específico da história chega ao fim. Uma cena não possui uma medida fixa, podendo durar algumas rodadas (um combate), alguns minutos (uma conversa entre personagens), horas (atravessar uma floresta) ou até dias (uma viagem sem incidentes).</li>
                        <li><strong>Sustentada.</strong> A habilidade requer um fluxo constante de mana. O personagem deve gastar 1 PM como uma ação livre no início de cada turno para manter o efeito ativo. Se não o fizer, a habilidade termina. É possível manter diversas habilidades sustentadas, pagando o custo de cada uma, mas apenas uma magia sustentada por vez (a menos que possua o poder Fluxo de Mana).</li>
                        <li><strong>Definida.</strong> A duração pode ser medida em rodadas, horas, dias ou outra unidade de tempo.</li>
                        <li><strong>Permanente.</strong> A habilidade permanece ativa para sempre, mas ainda pode ser encerrada de outras formas.</li>
                    </ul>
                    <p>
                        <strong>Duração e Áreas.</strong> Se a habilidade afetar uma área, seus efeitos permanecem nessa
                        área pela sua duração. Criaturas e objetos válidos que entrem na área são afetados, deixando de
                        sê-lo quando saem.
                    </p>
                    <p>
                        <strong>Descarregar.</strong> Algumas habilidades duram até serem ativadas e descarregadas. A
                        habilidade permanece "dormente" até que um evento específico ocorra, momento em que é ativada e
                        descarregada, ou até que sua duração transcorra, encerrando-se sem efeito.
                    </p>
                    <p>
                        <strong>Encerrando Suas Habilidades.</strong> Um personagem pode encerrar uma de suas habilidades
                        e seus respectivos efeitos como uma ação livre.
                    </p>
                    <p>
                        <strong>Morte e Duração.</strong> A morte de um personagem não afeta suas habilidades (exceto as
                        sustentadas) — elas permanecem ativas até que sua duração termine.
                    </p>
                </section>

                <section id="testes-resistencia" class="content-section">
                    <h2>Testes de Resistência</h2>
                    <p>
                        Habilidades prejudiciais normalmente permitem que seus alvos realizem um teste de resistência para
                        evitar ou reduzir seus efeitos. A CD do teste de resistência é:
                    </p>
                    <p class="formula-destaque">10 + metade do nível do personagem + valor em um atributo específico</p>
                    <p>
                        O atributo aparecerá entre parênteses na descrição da fonte do efeito (habilidade ou item; para
                        magias, será sempre o atributo-chave da magia).
                    </p>
                    <p style="font-style: italic; font-size: 0.92rem;">
                        A habilidade Encurralar Presa, do caçador, tem CD Sabedoria, ou seja, a CD para resistir a ela é
                        10 + metade do nível do personagem + sua Sabedoria. Para Acir, um tupiniquim caçador de 10º nível
                        com Sabedoria 4, a CD para resistir a essa habilidade é 19 (10 + 5 + 4).
                    </p>
                    <ul>
                        <li><strong>Anula.</strong> O efeito da habilidade não tem impacto sobre um alvo que passe em seu teste de resistência.</li>
                        <li><strong>Parcial.</strong> O efeito é menor em um alvo que passe no teste de resistência.</li>
                        <li><strong>Reduz à Metade.</strong> O efeito é reduzido à metade em um alvo que passe no teste de resistência.</li>
                        <li><strong>Desacredita.</strong> Termo específico para efeitos de ilusão. Se uma criatura interagir com a ilusão, tem direito a um teste para perceber que ela não é real. A ilusão continua funcionando mesmo que uma criatura perceba que não é real; essa criatura pode avisar seus aliados como uma ação livre, permitindo que eles façam testes para desacreditar.</li>
                    </ul>
                    <p>
                        <strong>Objetos e Dano.</strong> A menos que a descrição do efeito indique o contrário, itens
                        carregados não sofrem dano por habilidades (mesmo de área). Objetos soltos sofrem dano, mas
                        somente se a habilidade puder ter objetos como alvo ou afetar uma área.
                    </p>
                    <p>
                        <strong>Objetos e Testes de Resistência.</strong> Para habilidades que afetam objetos e permitem
                        testes de resistência, itens mundanos soltos falham automaticamente, enquanto itens mundanos
                        carregados podem fazer testes com o bônus de seu portador. Itens mágicos sempre podem fazer teste
                        de resistência, usando seu próprio bônus ou o de seu portador, se houver (o que for maior).
                    </p>
                    <p>
                        <strong>Testes de Perícia.</strong> Algumas habilidades incluem testes de perícia para resistir a
                        efeitos. A dificuldade desses testes é igual à CD para resistir à habilidade, a menos que a
                        descrição indique o contrário.
                    </p>
                </section>

                <section id="tipos-efeitos" class="content-section">
                    <h2>Tipos de Efeitos</h2>
                    <p>
                        Diversos efeitos são categorizados em um (ou mais de um) dos tipos a seguir. Por si só, a maioria
                        dos tipos não impõe efeitos específicos nas regras. No entanto, indicam como o efeito interage
                        com outros. Por exemplo, uma criatura com imunidade a medo não será afetada por efeitos desse
                        tipo.
                    </p>
                    <ul>
                        <li><strong>Arcano.</strong> Gerado pelas energias místicas do mundo. Todos os efeitos arcanos são considerados mágicos.</li>
                        <li><strong>Atordoamento.</strong> Afeta a capacidade de agir do alvo.</li>
                        <li><strong>Cansaço.</strong> Diminui as capacidades físicas do alvo. Construtos e mortos-vivos são imunes a efeitos de cansaço.</li>
                        <li><strong>Climático.</strong> Gerado pelas forças da natureza.</li>
                        <li><strong>Cura.</strong> Restaura pontos de vida do alvo.</li>
                        <li><strong>Dano.</strong> Reduz os PV do alvo. Efeitos deste tipo são subdivididos em tipos de dano (consulte a seção de Combate).</li>
                        <li><strong>Divino.</strong> Gerado pela energia de um deus, direta ou indiretamente. Todos os efeitos divinos são considerados mágicos.</li>
                        <li><strong>Luz.</strong> Relacionado a danos e curas de luz, iluminação e energia expansiva.</li>
                        <li><strong>Mágico.</strong> Energizado por forças arcanas ou divinas, envolve magias, efeitos gerados por itens mágicos ou marcados com o símbolo apropriado. Podem ser subdivididos em escolas de magia.</li>
                        <li><strong>Medo.</strong> Induz medo capaz de prejudicar o alvo. Criaturas com Inteligência nula são imunes a efeitos de medo.</li>
                        <li><strong>Mental.</strong> Afeta a mente do alvo, diminuindo suas capacidades ou influenciando-a. Criaturas com Inteligência nula são imunes a efeitos mentais.</li>
                        <li><strong>Metabolismo.</strong> Afeta a fisiologia do alvo, incluindo doenças, sangramento e fome. Construtos e mortos-vivos são imunes a efeitos de metabolismo.</li>
                        <li><strong>Metamorfose.</strong> Altera a forma ou composição corporal do alvo, incluindo a petrificação.</li>
                        <li><strong>Movimento.</strong> Afeta ou remove a capacidade de se movimentar do alvo.</li>
                        <li><strong>Perda de Vida.</strong> Reduz os PV do alvo. Ao contrário do dano, não é afetado por redução de dano.</li>
                        <li><strong>Sentidos.</strong> Afeta os sentidos físicos do alvo, como deixá-lo cego ou surdo.</li>
                        <li><strong>Trevas.</strong> Relacionado a necromancia, escuridão e energia retrativa.</li>
                        <li><strong>Veneno.</strong> Efeitos gerados por venenos. Construtos e mortos-vivos são imunes a venenos.</li>
                    </ul>

                    <figure class="image-placeholder">
                        Imagem futura: arte de necromante com pequena aprendiz, sob a luz fúnebre de magia trevas.
                    </figure>
                </section>

                <section id="habilidades-gerais" class="content-section">
                    <h2>Habilidades Gerais</h2>
                    <p>As habilidades a seguir podem ser concedidas por diversas fontes, como raça ou magias.</p>
                    <p>
                        <strong>Agarrar Aprimorado.</strong> Se a criatura acertar um ataque com uma arma natural
                        (especificada na habilidade), poderá fazer a manobra agarrar com esta arma como uma ação livre.
                        Enquanto está usando a arma natural para agarrar, a criatura não pode usá-la para desferir outros
                        ataques.
                    </p>
                    <p>
                        <strong>Cura Acelerada.</strong> No início de seu turno, a criatura recupera pontos de vida
                        conforme o valor de Cura Acelerada (por exemplo, 4 PV com Cura Acelerada 4). Diferentes tipos de
                        danos não são curados pela Cura Acelerada. Múltiplas habilidades de Cura Acelerada acumulam, mas
                        ela não cura perda de PV, apenas dano.
                    </p>
                    <p>
                        <strong>Deslocamento de Escalada.</strong> Permite caminhar por superfícies verticais e até mesmo
                        de cabeça para baixo como se fossem o chão. O movimento de escalada segue as regras padrão e é
                        afetado pelas características da superfície.
                    </p>
                    <p>
                        <strong>Deslocamento de Escavação.</strong> Pode se mover sob terreno granular, como terra e areia
                        (mas não atravessar rocha sólida). Após a passagem da criatura, o terreno atrás dela se fecha
                        devido aos restos de material deixados para trás. Deslocamento de escavação pode ser afetado
                        pelas características do solo: por exemplo, um solo pedregoso pode ser considerado terreno
                        difícil.
                    </p>
                    <p>
                        <strong>Deslocamento de Natação.</strong> Pode se deslocar em líquidos sem precisar fazer testes
                        de Atletismo. Porém, assim como criaturas terrestres podem precisar de testes de Acrobacia em
                        certas circunstâncias (como em terreno escorregadio), uma criatura com deslocamento de natação
                        pode precisar de testes de Atletismo (como em correntes aquáticas muito fortes). A criatura não
                        sofre penalidades e limitações por estar submersa (com exceção daquelas relacionadas às suas
                        armas).
                    </p>
                    <p>
                        <strong>Deslocamento de Voo.</strong> Pode voar. Uma criatura com deslocamento de voo pode
                        encerrar seu deslocamento em pleno ar e pode se mover e atacar como uma criatura terrestre. Uma
                        criatura voando que perca seu deslocamento de voo ou a capacidade de realizar ações cai 150m por
                        rodada. Uma criatura voando que sofra uma manobra derrubar bem-sucedida cai 1d6 × 1,5m antes de
                        recuperar o voo.
                    </p>
                    <p>
                        <strong>Faro.</strong> A criatura possui olfato apurado, não ficando desprevenida contra inimigos
                        em alcance curto que não pode ver. Camuflagem total tem apenas 20% de chance de falha.
                    </p>
                    <p>
                        <strong>Imunidade.</strong> A criatura é imune a um tipo de efeito ou outro elemento, como uma
                        condição ou habilidade específica. Ela não sofre nenhuma consequência direta daquilo contra a qual
                        é imune. Ela ainda pode ser afetada indiretamente — por exemplo, uma criatura imune a magia ainda
                        é afetada por terreno difícil criado por magias. Imunidade a acertos críticos os transforma em
                        acertos normais.
                    </p>
                    <p>
                        <strong>Incorpóreo.</strong> A criatura não possui corpo físico, sendo afetada apenas por armas,
                        efeitos mágicos ou outras criaturas incorpóreas. Pode atravessar objetos sólidos, mas não
                        manipulá-los, e possui Força nula.
                    </p>
                    <p>
                        <strong>Percepção às Cegas.</strong> A criatura utiliza sentidos diferentes da visão (como radar,
                        sonar, sensibilidade a vibrações etc.). Efeitos relacionados à visão, como escuridão e
                        invisibilidade, não a afetam. Pode realizar testes de Percepção para observar usando esses
                        sentidos, ao invés da visão. Esta habilidade tem alcance curto (a menos que especificado o
                        contrário).
                    </p>
                    <p>
                        <strong>Redução de Dano (RD).</strong> A criatura ignora parte do dano que sofre. Por exemplo, se
                        uma criatura com RD 5 sofre um ataque que causa 8 pontos de dano, perde apenas 3 PV. A redução
                        pode ser contra um ou mais tipos de dano específicos. Assim, uma criatura com redução de fogo 10
                        ignora 10 pontos de dano de fogo, mas sofre dano de outros tipos normalmente. Caso haja um ou
                        mais tipos de dano listados após uma barra, a RD <em>não</em> se aplica àqueles tipos. Por
                        exemplo, uma criatura com RD 10/mágico ignora 10 pontos de dano de todos os ataques que sofrer
                        — exceto dano causado por habilidades e armas mágicas. Múltiplos efeitos de RD são cumulativos.
                    </p>
                    <p>
                        <strong>Resistência.</strong> A criatura recebe um bônus em testes de resistência contra efeitos
                        do tipo especificado no nome desta habilidade. Por exemplo, uma criatura com resistência a magia
                        +2 recebe +2 em testes de Fortitude, Reflexos ou Vontade contra efeitos mágicos.
                    </p>
                    <p>
                        <strong>Visão na Penumbra.</strong> A criatura enxerga em escuridão leve em alcance curto (exceto
                        mágica), ignorando camuflagem leve por esse tipo de escuridão.
                    </p>
                    <p>
                        <strong>Visão no Escuro.</strong> A criatura enxerga em escuridão total em alcance curto (exceto
                        mágica), ignorando camuflagem total por esse tipo de escuridão.
                    </p>
                    <p>
                        <strong>Vulnerabilidade a Dano.</strong> A criatura sofre +50% a mais de dano de um tipo
                        específico. Por exemplo, se uma criatura com vulnerabilidade a calor sofre um ataque que causa 13
                        pontos de dano de calor, ela sofre 19 pontos de dano (13 × 1,5 = 19).
                    </p>
                </section>

                <section id="combate" class="content-section">
                    <h2>Combate</h2>

                    <figure class="image-placeholder">
                        Imagem futura: Arimah de Palmares, cercada por inimigos em um covil de criaturas do caos.
                    </figure>

                    <p>
                        Embora seja possível superar obstáculos e vencer inimigos de muitas formas, às vezes os heróis
                        ficam sem escolha além de sacar suas armas, preparar suas magias e partir para a batalha.
                    </p>

                    <h3>Estatísticas de combate</h3>
                    <p>A seguir estão as explicações das estatísticas usadas em combate.</p>

                    <h3>Teste de Ataque</h3>
                    <p>
                        Este é um tipo específico de teste de perícia, para acertar um alvo com um ataque. Normalmente é
                        um teste de Luta, para um ataque corpo a corpo, ou de Pontaria, para um ataque à distância.
                    </p>
                    <p>
                        A dificuldade do teste é a Defesa do alvo. Se o resultado é igual ou maior que a Defesa do alvo,
                        você acerta e causa dano (veja Dano, a seguir).
                    </p>
                    <p>Um teste de ataque pode sofrer modificadores por habilidades, arma e condições.</p>

                    <h3>Dano</h3>
                    <p>
                        Quando você acerta um ataque, causa dano. Esse dano reduz os pontos de vida do inimigo (veja
                        Ferimentos &amp; Morte, a seguir).
                    </p>
                    <p>
                        Você rola dados para descobrir quanto dano causou. O tipo de dado depende da arma ou ataque
                        utilizado — por exemplo, 1d4 para uma adaga ou 1d8 para uma espada longa. O dano de cada arma é
                        descrito no Capítulo 3: Equipamento. Para ataques corpo a corpo ou com armas de arremesso, você
                        soma sua Força na rolagem de dano.
                    </p>
                    <p class="formula-destaque">Dano com Arma Corpo a Corpo ou de Arremesso = Dano da Arma + Força do Atacante</p>
                    <p class="formula-destaque">Dano com Arma de Disparo = Dano da Arma</p>
                    <p>
                        Assim, um personagem com Força 3 usando uma espada longa causa 1d8+3 pontos de dano (1d8 da
                        espada longa mais 3 da Força).
                    </p>

                    <h3>Tipos de Dano</h3>
                    <p>
                        Cada arma ou efeito que causa dano possui um tipo, conforme a lista a seguir. Por si só, o tipo
                        de dano não possui efeito em regras. Contudo, indica a relação do dano com outros efeitos. Por
                        exemplo, uma criatura com redução de corte 5 reduz todo dano de corte que sofre em 5.
                    </p>
                    <ul>
                        <li><strong>Ácido.</strong> Certos monstros e perigos naturais, além de itens alquímicos, causam dano deste tipo. Ácido é ligado ao elemento terra.</li>
                        <li><strong>Corte.</strong> Armas afiadas, como espadas, machados e as garras de um monstro, causam dano de corte.</li>
                        <li><strong>Eletricidade.</strong> Algumas magias e perigos naturais, como um relâmpago, causam dano deste tipo. Eletricidade é ligada ao elemento ar.</li>
                        <li><strong>Essência.</strong> Energia mágica pura, canalizada por magias como Seta Infalível.</li>
                        <li><strong>Fogo.</strong> Causado por calor e chamas naturais e mágicas. Fogo é ligado ao elemento... fogo!</li>
                        <li><strong>Frio.</strong> Algumas magias, além de clima severo, causam dano de frio. Ligado ao elemento água.</li>
                        <li><strong>Impacto.</strong> Causado por armas de contusão, como clavas e maças, além de ondas de choque, explosões, ataques sônicos e quedas.</li>
                        <li><strong>Luz.</strong> Magias e outros efeitos provenientes de divindades de poder expansivo causam dano de luz.</li>
                        <li><strong>Perfuração.</strong> Armas pontudas, como lanças, e mordidas de monstros causam dano de perfuração.</li>
                        <li><strong>Psíquico.</strong> Ataques mentais e magias que afetam a mente da vítima causam dano deste tipo.</li>
                        <li><strong>Trevas.</strong> Causado por efeitos de necromancia e ligados a divindades de poder retrativo.</li>
                    </ul>

                    <h3>Acertos Críticos</h3>
                    <p>Um acerto crítico é um ataque especialmente certeiro, que atinge pontos vitais ou vulneráveis.</p>
                    <p>
                        A tabela de armas do Capítulo 3: Equipamento possui uma coluna "Crítico". Cada arma tem uma
                        margem de ameaça (que pode ser 18, 19 ou 20) e um multiplicador (que pode ser ×2, ×3 ou ×4).
                        Quando nenhuma margem aparece, será 20. Quando nenhum multiplicador aparece, será ×2.
                    </p>
                    <p>
                        Você faz um acerto crítico quando acerta um ataque rolando um valor igual ou maior que a margem
                        de ameaça da arma. Neste caso, multiplica os dados de dano do ataque (incluindo quaisquer
                        aumentos por passos) pelo multiplicador da arma. Bônus numéricos de dano, assim como dados extras
                        (como pela habilidade Ataque Furtivo) não são multiplicados.
                    </p>
                    <p>
                        Certas criaturas são imunes a acertos críticos. Um alvo imune a acertos críticos ainda sofre o
                        dano de um ataque normal.
                    </p>
                </section>

                <section id="iniciativa" class="content-section">
                    <h2>Iniciativa</h2>
                    <p>
                        A cada rodada, todo personagem tem um turno — sua vez de agir. A Iniciativa determina a ordem dos
                        turnos dentro da rodada.
                    </p>
                    <p>
                        <strong>Teste de Iniciativa.</strong> No início do combate, cada jogador faz um teste de
                        Iniciativa para seu personagem. O narrador faz um único teste para os inimigos (caso haja
                        inimigos com bônus de Iniciativa diferentes, o mestre usa o menor valor). Aqueles com os
                        resultados mais altos agem primeiro.
                    </p>
                    <p>
                        No caso de empates, o personagem com o maior modificador de perícia age primeiro. Se o empate
                        persistir, eles fazem um novo teste de Iniciativa entre si, para decidir quem age primeiro.
                    </p>
                    <p>
                        Não é preciso fazer novos testes de Iniciativa a cada rodada; a ordem se mantém durante todo o
                        combate.
                    </p>
                    <p>
                        <strong>Entrando na Batalha.</strong> Se um personagem entra na batalha depois que ela começou,
                        faz um teste de Iniciativa e age quando seu turno chegar, na rodada seguinte.
                    </p>
                    <p>
                        <strong>Surpresa.</strong> Quando o combate começa, se você não percebeu seus inimigos, está
                        surpreendido. Se você está ciente de seus inimigos, mas eles não estão cientes de você, eles é
                        que estão surpreendidos. Caso os dois lados tenham se percebido, ninguém está surpreendido. E se
                        nenhum lado percebe o outro... bem, nenhum combate acontece!
                    </p>
                    <p>
                        <strong>Percebendo os Inimigos.</strong> O mestre diz quem está ciente de seus inimigos no começo
                        do combate. Em geral, ele diz aos jogadores para fazerem testes de Percepção contra uma
                        dificuldade ou opostos pelo teste de Furtividade dos inimigos (caso estes estejam sendo cautelosos).
                    </p>
                    <p>
                        Um personagem que nunca fica surpreendido (por exemplo, se tiver a habilidade Esquiva Sobrenatural)
                        pode rolar a Iniciativa e agir mesmo que falhe em seu teste de Percepção; de alguma maneira ele
                        já esperava o perigo, ou reage com reflexos impossivelmente rápidos.
                    </p>

                    <aside class="caixa-regra">
                        <h3 class="caixa-regra-titulo">Como funciona o combate?</h3>
                        <p>
                            O combate acontece em uma série de <em>rodadas</em>. Uma rodada é o tempo necessário para que
                            todos os personagens no combate tenham seu <em>turno</em>. Um turno é o tempo que cada
                            personagem tem para agir.
                        </p>
                        <p>Um combate obedece aos seguintes passos.</p>
                        <p>
                            <strong>Passo 1.</strong> Cada personagem faz um teste de Iniciativa. O mestre faz um único
                            teste para os inimigos.
                        </p>
                        <p>
                            <strong>Passo 2.</strong> O mestre diz quais personagens estão cientes de seus inimigos.
                            Aqueles que não percebem a presença de inimigos começam o combate surpreendidos. Um personagem
                            surpreendido fica desprevenido e não age na primeira rodada.
                        </p>
                        <p>
                            <strong>Passo 3.</strong> Todos os personagens têm seu turno na ordem da Iniciativa (exceto
                            aqueles surpreendidos, que não agem na primeira rodada).
                        </p>
                        <p>
                            <strong>Passo 4.</strong> Quando todos os personagens tiverem seu turno, a rodada termina.
                            Uma outra rodada se inicia, com todos os personagens agindo novamente, na mesma ordem. Mesmo
                            aqueles que estavam surpreendidos agora podem agir.
                        </p>
                    </aside>
                </section>

                <section id="rodada-combate" class="content-section">
                    <h2>A Rodada de Combate</h2>
                    <p>
                        Uma rodada representa cerca de seis segundos no mundo de jogo. Durante a rodada, cada jogador
                        (incluindo o mestre) tem o seu turno, a sua vez de realizar ações.
                    </p>
                    <p>
                        Pense em "rodada" como se fosse uma medida de tempo, como "mês": o mês representa os dias marcados
                        no calendário, mas também determina o tempo entre um dia e o mesmo dia no mês seguinte.
                    </p>
                    <p>
                        Assim, a rodada começa no turno do primeiro personagem (aquele que teve Iniciativa mais alta) e
                        termina após o turno do último (aquele com Iniciativa mais baixa). Mas a rodada também é o tempo
                        entre uma Iniciativa e a mesma Iniciativa na rodada seguinte. Efeitos que duram certo número de
                        rodadas terminam imediatamente antes do mesmo resultado de Iniciativa quando se iniciaram, após
                        o número apropriado de rodadas.
                    </p>
                </section>

                <section id="tipos-acoes" class="content-section">
                    <h2>Tipos de Ações</h2>
                    <p>
                        No seu turno, você pode fazer uma ação padrão e uma ação de movimento, em qualquer ordem.
                    </p>
                    <p>
                        Você pode trocar sua ação padrão por uma ação de movimento, para fazer duas ações de movimento,
                        mas não pode fazer o inverso.
                    </p>
                    <p>
                        Você também pode abrir mão das duas ações (tanto a padrão quanto a de movimento) para fazer uma
                        ação completa.
                    </p>
                    <p>Portanto, em um turno você pode fazer:</p>
                    <ul>
                        <li>Uma ação padrão e uma ação de movimento;</li>
                        <li>Ou duas ações de movimento;</li>
                        <li>Ou uma ação completa.</li>
                    </ul>
                    <p>Você também pode executar qualquer quantidade de ações livres e reações.</p>
                    <p>
                        <strong>Ação Padrão.</strong> Basicamente, uma ação padrão permite que você execute uma tarefa.
                        Fazer um ataque ou lançar uma magia são as ações padrão mais comuns.
                    </p>
                    <p>
                        <strong>Ação de Movimento.</strong> Esta ação representa algum tipo de movimento físico. Seu uso
                        mais comum é percorrer uma distância igual a seu deslocamento. Levantar-se, sacar uma arma,
                        pegar um item de sua mochila, abrir uma porta e subir numa montaria também são ações de
                        movimento.
                    </p>
                    <p>
                        <strong>Ação Completa.</strong> Este tipo de ação exige todo o tempo e esforço normal de uma
                        rodada. Para uma ação completa, você deve abrir mão de sua ação padrão e de sua ação de movimento
                        — mas, normalmente, você ainda pode realizar ações extras, ações livres e reações.
                    </p>
                    <p>
                        <strong>Ação Livre.</strong> Esta ação não exige quase nenhum tempo e esforço, mas ainda só pode
                        ser feita em seu turno. Jogar-se no chão ou gritar uma ordem são ações livres — mas o mestre pode
                        decidir que algo é complicado demais para ser livre. Dar uma ordem curta é uma ação livre,
                        explicar um plano inteiro, não!
                    </p>
                    <p>
                        <strong>Reação.</strong> Uma reação acontece em resposta a outra coisa. Como ações livres,
                        reações tomam tão pouco tempo que você pode realizar qualquer quantidade delas. A diferença é que
                        uma ação livre é uma escolha consciente, executada no turno do personagem. Já uma reação é um
                        reflexo ou uma resposta automática, que pode ocorrer mesmo fora do seu turno. Você pode reagir
                        mesmo se não puder realizar ações normais, como quando estiver atordoado. Um teste de Percepção
                        para perceber um troll escondido no pântano, ou um teste de Reflexos para escapar de uma
                        explosão, são exemplos de reações.
                    </p>
                </section>

                <section id="acoes-padrao" class="content-section">
                    <h2>Ações Padrão</h2>
                    <p>Sua ação padrão normalmente representa a coisa mais importante que você vai fazer em seu turno.</p>
                    <p>
                        <strong>Agredir.</strong> Você faz um ataque com uma arma corpo a corpo ou à distância.
                    </p>
                    <p>
                        Com uma arma corpo a corpo, você pode atacar qualquer inimigo dentro de seu alcance natural (1,5m
                        para criaturas Pequenas e Médias ou um inimigo adjacente no mapa). Personagens maiores, ou usando
                        certas armas, podem atacar mais longe. Você pode substituir um ataque corpo a corpo por uma
                        manobra de combate (veja a seguir).
                    </p>
                    <p>
                        Com uma arma de ataque à distância, você pode atacar qualquer inimigo que consiga ver e que
                        esteja no alcance da arma (ou até o dobro do alcance, sofrendo uma penalidade de –5).
                    </p>
                    <p>
                        <strong>Atirando em Combate Corpo a Corpo.</strong> Quando faz um ataque à distância contra uma
                        criatura em combate corpo a corpo, você sofre –5 no teste de ataque. Uma criatura está em
                        combate corpo a corpo se estiver dentro do alcance natural de qualquer inimigo (incluindo você).
                    </p>
                    <p>
                        <strong>Atropelar.</strong> Você usa uma ação padrão durante um movimento para avançar pelo
                        espaço ocupado por uma criatura (normalmente, você não pode fazer uma ação padrão durante um
                        movimento; isto é uma exceção). A criatura pode lhe dar passagem ou resistir. Se der passagem,
                        você avança pelo espaço dela; nenhum teste é necessário. Se resistir, faça um teste de manobra
                        oposto; se você vencer, deixa a criatura caída e continua seu avanço. Se o alvo vencer, continua
                        de pé e detém seu avanço. Atropelar é uma ação livre se tentada durante uma investida.
                    </p>
                    <p>
                        <strong>Fintar.</strong> Faça um teste de Enganação oposto ao teste de Reflexos de uma criatura
                        em alcance curto. Se você passar, ela fica desprevenida contra seu próximo ataque, mas apenas
                        até o fim de seu próximo turno.
                    </p>
                    <p>
                        <strong>Lançar uma Magia.</strong> A maioria das magias exige uma ação padrão para ser executada.
                    </p>
                    <p>
                        <strong>Preparar.</strong> Você prepara uma ação (padrão, de movimento ou livre) para realizar
                        mais tarde, após seu turno, mas antes de seu turno na próxima rodada. Diga a ação que vai fazer
                        e em quais circunstâncias (por exemplo, "disparar minha besta na primeira criatura que passar
                        pela porta"). A qualquer momento antes de seu próximo turno, você pode fazer a ação preparada
                        como uma reação a essas circunstâncias.
                    </p>
                    <p>
                        Se, no seu próximo turno, você ainda não tiver realizado sua ação preparada, não pode mais
                        realizá-la (embora possa preparar a mesma ação de novo). Pelo resto do combate, sua Iniciativa
                        fica imediatamente acima da qual você fez a ação preparada.
                    </p>
                    <p>
                        <strong>Usar uma Habilidade ou Item Mágico.</strong> Algumas habilidades e itens mágicos, como
                        poções, exigem uma ação padrão para serem usadas.
                    </p>
                </section>

                <section id="acoes-movimento" class="content-section">
                    <h2>Ações de Movimento</h2>
                    <p>Uma ação de movimento serve para mudar algo de posição — seja você, seja um item.</p>
                    <p>
                        <strong>Levantar-se.</strong> Levantar do chão (ou de uma cama, cadeira...) exige uma ação de
                        movimento.
                    </p>
                    <p>
                        <strong>Manipular Item.</strong> Muitas vezes, manipular um item exige uma ação de movimento.
                        Pegar um objeto em uma mochila, abrir ou fechar uma porta e atirar uma corda para alguém são
                        ações de movimento.
                    </p>
                    <p>
                        <strong>Mirar.</strong> Você mira em um alvo que possa ver, dentro do alcance de sua arma. Isso
                        anula a penalidade de –5 em testes de Pontaria realizados neste turno contra aquele alvo caso
                        ele esteja engajado em combate corpo a corpo.
                    </p>
                    <p>
                        <strong>Movimentar-se.</strong> Você pode percorrer uma distância igual a seu deslocamento
                        (tipicamente 9m para raças de tamanho Médio). Outros tipos de movimento, como nadar, escalar ou
                        cavalgar, também usam esta ação.
                    </p>
                    <p>
                        <strong>Sacar ou Guardar Item.</strong> Sacar ou guardar um item exige uma ação de movimento.
                    </p>

                    <figure class="image-placeholder">
                        Imagem futura: arcanista verde com poção em pleno combate.
                    </figure>
                </section>

                <section id="acoes-completas" class="content-section">
                    <h2>Ações Completas</h2>
                    <p>Ações completas exigem muito tempo e esforço.</p>
                    <p>
                        <strong>Corrida.</strong> Você corre mais rapidamente que seu deslocamento normal. Veja a perícia
                        Atletismo.
                    </p>
                    <p>
                        <strong>Golpe de Misericórdia.</strong> Você desfere um golpe letal em um oponente adjacente e
                        indefeso. Um golpe de misericórdia é um acerto crítico automático. Além de sofrer dano, a vítima
                        tem uma chance de morrer instantaneamente. Esta chance é de 25% (1 em 1d4) para personagens e
                        NPCs importantes e de 75% (1 a 3 em 1d4) para NPCs secundários.
                    </p>
                    <p>
                        <strong>Investida.</strong> Você avança até o dobro de seu deslocamento (e no mínimo 3m) em
                        linha reta e, no fim do movimento, faz um ataque corpo a corpo. Você recebe +2 no teste de
                        ataque, mas sofre –2 na Defesa até o seu próximo turno, porque sua guarda fica aberta. Você não
                        pode fazer uma investida em terreno difícil. Durante uma investida, você pode fazer a manobra
                        atropelar como uma ação livre (mas não pode atropelar e atacar o mesmo alvo).
                    </p>
                    <p>
                        <strong>Lançar uma Magia.</strong> Ao lançar magias com execução maior do que uma ação completa,
                        você gasta uma ação completa a cada rodada.
                    </p>

                    <aside class="caixa-regra">
                        <h3 class="caixa-regra-titulo">Manobras de Combate</h3>
                        <p>
                            Uma manobra é um ataque corpo a corpo para fazer algo diferente de causar dano — como
                            arrancar a arma do oponente ou empurrá-lo para um abismo. Não é possível fazer manobras de
                            combate com ataques à distância.
                        </p>
                        <p>
                            Faça um teste de manobra (um teste de ataque corpo a corpo) oposto com a criatura. Mesmo que
                            ela esteja usando uma arma de ataque à distância, deve fazer o teste usando seu valor de
                            Luta. Em caso de empate, o personagem com o maior bônus vence. Se os bônus forem iguais,
                            outro teste deve ser feito. Em geral, você pode usar qualquer arma corpo a corpo para fazer
                            manobras de combate. Estas são as manobras que você pode fazer.
                        </p>
                        <p>
                            <strong>Agarrar.</strong> Você segura uma criatura (por seu braço, sua roupa etc.). Uma
                            criatura agarrada fica desprevenida e imóvel, sofre –2 nos testes de ataque e só pode atacar
                            com armas leves. Ela pode se soltar com uma ação padrão, vencendo um teste de manobra oposto.
                            Você só pode agarrar com um ataque desarmado ou arma natural e, enquanto agarra, fica com
                            essa mão ou arma natural ocupada. Além disso, move-se metade do deslocamento normal, mas
                            arrasta a criatura que estiver agarrando. Você pode soltá-la com uma ação livre. Você pode
                            atacar uma criatura agarrada com sua mão livre. Se preferir, pode substituir um ataque por
                            um teste de agarrar contra a criatura. Se vencer, causa dano de impacto igual a um ataque
                            desarmado ou arma natural. Isso significa que você está esmagando ou sufocando o inimigo.
                        </p>
                        <p>
                            Um personagem fazendo um ataque à distância contra um alvo envolvido na manobra agarrar tem
                            50% de chance de mirar no alvo errado!
                        </p>
                        <p>
                            <strong>Derrubar.</strong> Você deixa o alvo caído. Esta queda normalmente não causa dano.
                            Se você vencer o teste oposto por 5 pontos ou mais, derruba o oponente com tanta força que
                            também o empurra um quadrado em uma direção a sua escolha. Se isso o jogar além de um
                            parapeito ou precipício, ele pode fazer um teste de Reflexos (CD 20) para se agarrar numa
                            beirada.
                        </p>
                        <p>
                            <strong>Desarmar.</strong> Você derruba um item que a criatura esteja segurando. Normalmente
                            o item cai no mesmo lugar em que o alvo está (a menos que o alvo esteja voando, sobre uma
                            ponte etc.). Se você vencer o teste oposto por 5 pontos ou mais, derruba o item com tanta
                            força que também o empurra um quadrado em uma direção a sua escolha.
                        </p>
                        <p>
                            <strong>Empurrar.</strong> Você empurra a criatura 1,5m. Para cada 5 pontos de diferença
                            entre os testes, você empurra o alvo mais 1,5m. Você pode gastar uma ação de movimento para
                            avançar junto com a criatura (até o limite do seu deslocamento).
                        </p>
                        <p>
                            <strong>Quebrar.</strong> Você atinge um item que a criatura esteja segurando. Veja adiante
                            em "Quebrando Objetos".
                        </p>
                    </aside>
                </section>

                <section id="acoes-livres" class="content-section">
                    <h2>Ações Livres</h2>
                    <p>
                        Uma ação livre demanda pouco ou nenhum tempo, esforço ou atenção. Normalmente você pode executar
                        quantas ações livres quiser por turno, mas o mestre pode limitar ou proibir ações complexas.
                    </p>
                    <p>
                        <strong>Atrasar.</strong> Escolhendo atrasar sua ação, você age mais tarde na ordem de Iniciativa,
                        em relação à Iniciativa que rolou. Isto é o mesmo que reduzir sua Iniciativa voluntariamente pelo
                        resto do combate. Quando sua nova Iniciativa chegar, você age normalmente. Você pode especificar
                        este novo valor de Iniciativa ou apenas esperar até algum momento e então agir, fixando sua nova
                        Iniciativa neste ponto. Atrasar é útil para ver o que seus amigos ou inimigos farão, antes de
                        decidir o que você mesmo fará.
                    </p>
                    <p>
                        <strong>Limites para atrasar.</strong> Você pode atrasar sua Iniciativa até –10 menos seu bônus
                        de Iniciativa. Quando a contagem de Iniciativa chega a esse ponto, você deve agir ou abrir mão
                        de qualquer ação na rodada. Por exemplo, um personagem com um bônus de Iniciativa +3 pode esperar
                        até a contagem de Iniciativa chegar a –13. Nesse ponto, deve agir ou desistir de seu turno. Isso
                        importa quando vários personagens atrasam suas ações.
                    </p>
                    <p>
                        <strong>Vários atrasos.</strong> Se vários personagens estão atrasando suas ações, aquele com o
                        maior bônus de Iniciativa (ou a maior Destreza, em caso de empate) tem a vantagem. Se dois ou
                        mais personagens que estejam atrasando quiserem agir na mesma contagem de Iniciativa, aquele com
                        o maior bônus age primeiro. Se dois ou mais personagens estão tentando agir um depois do outro,
                        aquele com o maior bônus de Iniciativa tem o direito de agir depois.
                    </p>
                    <p>
                        <strong>Falar.</strong> Em geral, falar é uma ação livre. Lançar magias ou usar habilidades de
                        classe que dependem da voz não são ações livres. O mestre também pode limitar aquilo que você
                        consegue falar durante uma rodada (vinte palavras são o limite padrão).
                    </p>
                    <p>
                        <strong>Jogar-se no Chão.</strong> Jogar-se no chão é uma ação livre. Você recebe os benefícios
                        e penalidades normais por estar caído, mas normalmente não sofre dano ao se jogar no chão.
                    </p>
                    <p>
                        <strong>Largar um Item.</strong> Deixar cair um item que esteja segurando é uma ação livre. Mas
                        deixar cair (ou jogar) um item com a intenção de acertar algo é uma ação padrão. E deixar cair
                        (ou jogar) um item para que outra pessoa agarre é uma ação de movimento.
                    </p>
                </section>

                <section id="ferimentos-morte" class="content-section">
                    <h2>Ferimentos &amp; Morte</h2>
                    <p>
                        Sempre que você sofre dano — golpeado pela lança de um guerreiro cáucazi, atingido por uma
                        <em>Bola de Fogo</em> ou caindo em uma armadilha —, subtrai este valor de seus pontos de vida.
                        Você anota seus pontos de vida em sua ficha de personagem ou em qualquer papel de rascunho.
                    </p>
                    <p>
                        O dano pode deixar cicatrizes, amassar sua armadura e sujar sua roupa de sangue, mas não o impede
                        de agir. Isso só muda quando seus pontos de vida chegam a 0 ou menos.
                    </p>
                    <p>
                        Se ficar com 0 PV ou menos, você cai inconsciente e fica sangrando. No início de seu turno, faça
                        um teste de Constituição (CD 15). Se passar, você estabiliza e não precisa mais fazer esse teste
                        (exceto se perder mais PV). Se falhar, você perde 1d6 pontos de vida. Você deve repetir o teste
                        a cada rodada, até estabilizar ou morrer. Um personagem sangrando pode ser estabilizado com um
                        teste de Cura (CD 15) ou com qualquer efeito que cure pelo menos 1 PV.
                    </p>
                    <p>
                        Um personagem com 0 ou menos pontos de vida que recupere PV até um valor positivo (1 ou mais)
                        por causa de uma habilidade, magia ou descanso, recobra a consciência e pode agir normalmente.
                    </p>
                    <p>
                        Quando seus pontos de vida chegam a –10 ou a um número negativo igual à metade de seus PV totais
                        (o que for mais baixo), você morre. Por exemplo: Zumbi, dos Palmares, um guerreiro com 12 PV,
                        morre se chegar a –10 PV. Mais tarde na campanha, Zumbi sobe vários níveis e chega a 40 PV.
                        Agora, ele só morre se chegar a –20 PV.
                    </p>

                    <h3>Dano Não Letal</h3>
                    <p>
                        Dano não letal conta para determinar quando você cai inconsciente, mas não para determinar quando
                        você começa a sangrar ou morre. Efeitos de cura recuperam primeiro pontos de vida perdidos por
                        dano não letal.
                    </p>
                    <p>
                        Quase todo dano causado em condições normais (armas, armadilhas, magias...) é letal. Você pode
                        usar uma arma para causar dano não letal (batendo com as partes não afiadas da arma, controlando
                        a força dos golpes ou evitando pontos vitais), mas sofre uma penalidade de –5 no teste de ataque.
                    </p>
                    <p>
                        Ataques desarmados e certas armas específicas causam dano não letal. Você pode usar esses ataques
                        e armas para causar dano letal, mas sofre a mesma penalidade de –5 no teste de ataque.
                    </p>
                </section>

                <section id="movimentacao" class="content-section">
                    <h2>Movimentação</h2>
                    <p>
                        <strong>Deslocamento.</strong> Esta é a medida de quantos metros você pode percorrer com uma
                        ação de movimento. O deslocamento padrão é 9m, mas algumas habilidades de raça e classe podem
                        mudá-lo.
                    </p>
                    <p>
                        <strong>Atravessar um Espaço Ocupado.</strong> Você pode atravessar um espaço ocupado por um
                        aliado. No entanto, não pode atravessar um espaço ocupado por um inimigo, a menos que ele esteja
                        caído ou indefeso, ou seja pelo menos três categorias de tamanho maior ou menor que você. Você
                        também pode atravessar um espaço ocupado por um inimigo com Acrobacia ou a ação atropelar.
                        Espaço ocupado por um inimigo conta como terreno difícil.
                    </p>
                    <p>
                        <strong>Carga.</strong> Se você estiver sobrecarregado, seu deslocamento diminui em 3m.
                    </p>
                    <p>
                        <strong>Diagonais.</strong> Em um mapa, mover-se na diagonal custa o dobro. Ou seja, andar 1,5m
                        (1 quadrado) na diagonal conta como 3m (2 quadrados).
                    </p>

                    <figure class="image-placeholder">
                        Imagem futura: lado a lado — esquerda, token andando 4 quadrados em linha reta = 4 quadrados / 6 m;
                        direita, mesmo token andando 4 passos diagonais = 8 quadrados / 12 m. Mostra a regra do "dobro na
                        diagonal".
                    </figure>

                    <p>
                        <strong>Outros Tipos de Movimento.</strong> Além de andar, você pode gastar uma ação de movimento
                        para se mover de outras maneiras. Consulte as perícias Acrobacia e Atletismo.
                    </p>
                    <p>
                        <strong>Subir ou Mergulhar.</strong> Voando ou nadando, movimentar-se na vertical custa o dobro
                        na subida (ou o triplo em diagonais) e metade na descida (ou o normal em diagonais). Ou seja,
                        voar 1,5m para cima conta como 3m, enquanto voar 3m para baixo conta como 1,5m.
                    </p>
                    <p>
                        <strong>Terreno Difícil.</strong> Lugares onde é difícil andar, como uma floresta cheia de
                        raízes, neve profunda, ruínas com destroços ou mesmo uma rua lotada de pessoas, são terreno
                        difícil. Mover-se em terreno difícil custa o dobro. Ou seja, você se move metade do deslocamento
                        normal — ou gasta 3m de deslocamento por quadrado, em vez de 1,5m.
                    </p>

                    <figure class="image-placeholder">
                        Imagem futura: grid com células sombreadas marcando terreno difícil (raízes, escombros).
                        Token atravessando: ortogonal em difícil = 2 quadrados; diagonal em difícil = 4 quadrados.
                    </figure>

                    <figure class="image-placeholder">
                        Imagem futura: criatura grande ocupando 2×2 quadrados (3 m × 3 m) sobre o grid; ao lado, token
                        Médio (1×1) mostrando a comparação de footprint. Setas indicando que a criatura ainda se desloca
                        1 quadrado por vez como qualquer outra.
                    </figure>
                </section>

                <section id="situacoes-especiais" class="content-section">
                    <h2>Situações Especiais</h2>
                    <p>
                        <strong>Camuflagem.</strong> Você recebe <em>camuflagem leve</em> quando um efeito dificulta a
                        visão dos inimigos. Pode ser escuridão leve, neblina, folhagens ou outro efeito similar no local
                        onde você está ou no espaço entre você e o oponente. Ataques contra você têm 20% de chance de
                        falha (ao fazer um ataque, o atacante rola 1d10 junto com o d20 do teste de ataque; se o
                        resultado desse d10 for 1 ou 2, o ataque erra, independentemente do resultado do teste de
                        ataque).
                    </p>
                    <p>
                        Você recebe <em>camuflagem total</em> quando um efeito impede a visão dos inimigos — por exemplo,
                        em uma câmara em escuridão total. A chance de falha em camuflagem total é 50% (1 a 5 no d10).
                    </p>

                    <figure class="image-placeholder">
                        Imagem futura: criança escondida na folhagem — exemplo de camuflagem.
                    </figure>

                    <p>
                        <strong>Cobertura.</strong> Você recebe <em>cobertura leve</em> quando está atrás de algo que
                        bloqueia o ataque dos inimigos, como uma árvore, uma muralha de castelo, a lateral de uma
                        carroça ou uma criatura maior. Cobertura leve fornece +5 na Defesa.
                    </p>
                    <p style="font-size: 0.92rem; font-style: italic;">
                        No mapa, o atacante e o alvo escolhem, cada um, um canto do quadrado onde estão. Trace uma linha
                        reta entre os cantos. Se a linha é interrompida por um obstáculo ou criatura, o alvo tem
                        cobertura leve. O alvo não recebe cobertura se a linha seguir ao longo de um obstáculo ou apenas
                        tocar a ponta de um obstáculo.
                    </p>
                    <p>
                        Você recebe <em>cobertura total</em> quando seus inimigos não podem alcançá-lo — por exemplo, se
                        estiver atrás de uma parede. Cobertura total impede que você seja atacado.
                    </p>

                    <figure class="image-placeholder">
                        Imagem futura: regra de cobertura via cantos do quadrado — atacante e alvo escolhem cantos;
                        linha reta passando por uma muralha ou pela borda de uma carroça concede cobertura leve (+5 Defesa);
                        linha totalmente bloqueada por uma parede = cobertura total (alvo não pode ser atacado).
                    </figure>

                    <p>
                        <strong>Flanquear.</strong> Quando você luta corpo a corpo contra um oponente e um aliado faz o
                        mesmo no lado oposto — ou seja, o inimigo está entre vocês — vocês estão flanqueando o alvo.
                        Ambos recebem +2 em seus testes de ataque contra o alvo flanqueado. Não se pode flanquear à
                        distância ou com ataques desarmados (a menos que você possua as habilidades Briga ou Estilo
                        Desarmado).
                    </p>

                    <figure class="image-placeholder">
                        Imagem futura: alvo no centro com dois aliados em lados diametralmente opostos (ex.: norte e sul).
                        Setas indicando o bônus +2 nos ataques corpo a corpo. Ao lado, contraexemplo com aliados em lados
                        adjacentes (sem flanquear).
                    </figure>

                    <div class="regras-table-wrap">
                        <table class="regras-table">
                            <caption>Tabela 5-3: Situações Especiais</caption>
                            <thead>
                                <tr><th>O atacante está...</th><th>Modificador no ataque</th></tr>
                            </thead>
                            <tbody>
                                <tr><td>Caído</td><td>–5</td></tr>
                                <tr><td>Cego</td><td>50% de chance de falha</td></tr>
                                <tr><td>Em posição elevada</td><td>+2</td></tr>
                                <tr><td>Flanqueando o alvo</td><td>+2 (apenas para corpo a corpo)</td></tr>
                                <tr><td>Invisível</td><td>+5 (não se aplica a alvos cegos)</td></tr>
                                <tr><td>Ofuscado</td><td>–2</td></tr>
                            </tbody>
                            <thead>
                                <tr><th>O alvo está...</th><th>Modificador na Defesa</th></tr>
                            </thead>
                            <tbody>
                                <tr><td>Caído</td><td>–5 contra ataques corpo a corpo, +5 contra ataques à distância</td></tr>
                                <tr><td>Cego</td><td>–5</td></tr>
                                <tr><td>Desprevenido</td><td>–5</td></tr>
                                <tr><td>Sob camuflagem leve</td><td>20% de chance de falha</td></tr>
                                <tr><td>Sob camuflagem total</td><td>50% de chance de falha</td></tr>
                                <tr><td>Sob cobertura leve</td><td>+5</td></tr>
                                <tr><td>Sob cobertura total</td><td>O alvo não pode ser atacado</td></tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section id="quebrando-objetos" class="content-section">
                    <h2>Quebrando Objetos</h2>
                    <p>
                        Tentar quebrar ou destruir um objeto — desde uma porta fechada até uma espada empunhada por um
                        inimigo — é similar a atacar uma criatura.
                    </p>
                    <p>
                        Para objetos soltos, faça um ataque contra a Defesa do objeto, definida por sua categoria de
                        tamanho. Se o objeto estiver em movimento, recebe +5 na Defesa. Para um objeto segurado por
                        outra criatura, veja a manobra quebrar.
                    </p>
                    <p>
                        Se você acerta o ataque, causa dano normal. Entretanto, objetos normalmente têm redução de dano,
                        dependendo de seu material. Um objeto reduzido a 0 ou menos PV é destruído.
                    </p>

                    <div class="regras-table-wrap">
                        <table class="regras-table">
                            <caption>Tabela 5-4: Estatísticas de Objetos</caption>
                            <thead>
                                <tr><th>Exemplo</th><th>Tamanho</th><th>Def</th><th>RD</th><th>PV</th></tr>
                            </thead>
                            <tbody>
                                <tr><td colspan="5" style="background: rgba(105,67,111,0.18); font-weight: 800;">Objetos Gerais</td></tr>
                                <tr><td>Pergaminho</td><td>Minúsculo</td><td>15</td><td>0</td><td>1</td></tr>
                                <tr><td>Corda</td><td>Minúsculo</td><td>15</td><td>0</td><td>2</td></tr>
                                <tr><td>Corrente</td><td>Minúsculo</td><td>15</td><td>10</td><td>2</td></tr>
                                <tr><td>Cadeira</td><td>Pequeno</td><td>12</td><td>5</td><td>5</td></tr>
                                <tr><td>Barril</td><td>Médio</td><td>10</td><td>5</td><td>10</td></tr>
                                <tr><td>Porta de madeira</td><td>Grande</td><td>8</td><td>5</td><td>20</td></tr>
                                <tr><td>Porta de Pedra</td><td>Grande</td><td>8</td><td>8</td><td>100</td></tr>
                                <tr><td>Porta de Ferro</td><td>Grande</td><td>8</td><td>10</td><td>100</td></tr>
                                <tr><td>Carroça</td><td>Grande</td><td>8</td><td>5</td><td>50</td></tr>
                                <tr><td>Casebre</td><td>Enorme</td><td>5</td><td>5</td><td>100</td></tr>
                                <tr><td>Celeiro</td><td>Colossal</td><td>0</td><td>5</td><td>200</td></tr>
                                <tr><td colspan="5" style="background: rgba(105,67,111,0.18); font-weight: 800;">Armas, Armaduras e Escudos*</td></tr>
                                <tr><td colspan="2">Arma leve de madeira (machadinha)</td><td>—</td><td>5</td><td>2</td></tr>
                                <tr><td colspan="2">Arma de uma mão de madeira (clava)</td><td>—</td><td>5</td><td>5</td></tr>
                                <tr><td colspan="2">Arma de duas mãos de madeira (bordão)</td><td>—</td><td>5</td><td>10</td></tr>
                                <tr><td colspan="2">Arma leve de metal (adaga)</td><td>—</td><td>10</td><td>2</td></tr>
                                <tr><td colspan="2">Arma de uma mão de metal (espada longa)</td><td>—</td><td>10</td><td>5</td></tr>
                                <tr><td colspan="2">Arma de duas mãos de metal (montante)</td><td>—</td><td>10</td><td>10</td></tr>
                                <tr><td colspan="2">Escudo Leve</td><td>—</td><td>5</td><td>10</td></tr>
                                <tr><td colspan="2">Escudo pesado</td><td>—</td><td>10</td><td>20</td></tr>
                                <tr><td colspan="2">Armadura leve</td><td>—</td><td>5</td><td>20</td></tr>
                                <tr><td colspan="2">Armadura pesada</td><td>—</td><td>10</td><td>40</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <p style="font-size: 0.85rem; color: var(--muted, #6f5876); font-style: italic;">
                        *Pontos de vida de itens comuns. Divida por 2 para itens reduzidos, multiplique por 2 para itens
                        aumentados e multiplique por 5 para itens gigantes.
                    </p>

                    <figure class="image-placeholder">
                        Imagem futura: cena de combate — guerreiros mortos-vivos lutando em ruínas.
                    </figure>
                </section>

                <section id="exemplos-mapa" class="content-section">
                    <h2>Exemplos no Mapa</h2>
                    <p>
                        O exemplo a seguir ilustra os conceitos de tamanho, movimentação, terreno difícil e flanqueamento
                        descritos nas seções anteriores. Cada quadrado no mapa representa 1,5m no mundo do jogo.
                    </p>

                    <figure class="image-placeholder">
                        Imagem futura: mapa "Tamanho e Movimentação" — candango e zambi chegando para apoiar cáucazi e florata
                        contra um cactéreo e um bicho-papão.
                        <figcaption>Exemplos no mapa de batalha: movimentação em terreno difícil, flanqueamento e área ocupada por criatura grande.</figcaption>
                    </figure>

                    <ul>
                        <li>
                            <strong>Movimentação 1:</strong> o candango usa uma ação de movimento para avançar 6m
                            (4 quadrados de 1,5m) em direção ao cactéreo, desviando do poço (um obstáculo poderia ser
                            considerado terreno difícil).
                        </li>
                        <li>
                            <strong>Movimentação 2:</strong> a zambi usa ação de movimento para avançar em direção ao
                            bicho-papão. O espaço com galhos é considerado um terreno difícil e consome o dobro de
                            movimentação.
                        </li>
                        <li>
                            <strong>Flanquear 1:</strong> o candango e o cáucazi estão ambos flanqueando o cactéreo.
                        </li>
                        <li>
                            <strong>Flanquear 2:</strong> a zambi e a florata, ambas estão flanqueando o bicho-papão,
                            pois estão em lados opostos.
                        </li>
                        <li>
                            <strong>Criatura grande:</strong> o bicho-papão acima ocupa uma área de 3m de lado
                            (2 quadrados de 1,5m). Mesmo ocupando uma área de 3m, ele se desloca como uma criatura
                            média (um quadrado de 1,5m por vez).
                        </li>
                    </ul>
                </section>

            </article>

        </section>

    </main>

    <button type="button" class="mobile-menu-toggle" id="mobileMenuToggle"
            aria-expanded="false" aria-controls="mobileSidebarContent" aria-label="Abrir menu de navegação">
        <span></span><span></span><span></span>
    </button>

    <button type="button" class="back-to-top-btn" id="backToTopBtn" aria-label="Voltar ao topo" title="Voltar ao topo">↑</button>

    <script src="assets/js/classes.js?v=20260503j"></script>
</body>
</html>
