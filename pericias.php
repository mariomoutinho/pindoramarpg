<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Perícias - Pindorama RPG</title>

    <link rel="stylesheet" href="assets/css/ficha.css" />
    <link rel="stylesheet" href="assets/css/classes.css?v=20260513a" />
    <link rel="stylesheet" href="assets/css/pericias.css?v=20260503-padrao" />
</head>

<body>
    <main class="page-wrapper classes-page pericias-page">

        <header class="top-actions classes-topbar">
            <div>
                <h1 class="titulo-cordel">Perícias</h1>
                <p>Regras de treinamento, bônus, usos cotidianos e testes de perícia em Pindorama RPG.</p>
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
                        <a class="toc-link toc-level-2" href="#introducao">Introdução</a>
                        <a class="toc-link toc-level-2" href="#escolhendo">Escolhendo Perícias</a>
                        <a class="toc-link toc-level-2" href="#utilizando">Utilizando Perícias</a>
                        <a class="toc-link toc-level-2" href="#bonus">Bônus de Perícia</a>
                        <a class="toc-link toc-level-2" href="#tabela-pericias">Resumo das Perícias</a>
                        <a class="toc-link toc-level-2" href="#acrobacia">Acrobacia</a>
                        <a class="toc-link toc-level-2" href="#adestramento">Adestramento</a>
                        <a class="toc-link toc-level-2" href="#atletismo">Atletismo</a>
                        <a class="toc-link toc-level-2" href="#atuacao">Atuação</a>
                        <a class="toc-link toc-level-2" href="#cavalgar">Cavalgar</a>
                        <a class="toc-link toc-level-2" href="#conhecimento">Conhecimento</a>
                        <a class="toc-link toc-level-2" href="#cura">Cura</a>
                        <a class="toc-link toc-level-2" href="#diplomacia">Diplomacia</a>
                        <a class="toc-link toc-level-2" href="#enganacao">Enganação</a>
                        <a class="toc-link toc-level-2" href="#fortitude">Fortitude</a>
                        <a class="toc-link toc-level-2" href="#furtividade">Furtividade</a>
                        <a class="toc-link toc-level-2" href="#guerra">Guerra</a>
                        <a class="toc-link toc-level-2" href="#iniciativa">Iniciativa</a>
                        <a class="toc-link toc-level-2" href="#intimidacao">Intimidação</a>
                        <a class="toc-link toc-level-2" href="#intuicao">Intuição</a>
                        <a class="toc-link toc-level-2" href="#investigacao">Investigação</a>
                        <a class="toc-link toc-level-2" href="#jogatina">Jogatina</a>
                        <a class="toc-link toc-level-2" href="#ladinagem">Ladinagem</a>
                        <a class="toc-link toc-level-2" href="#luta">Luta</a>
                        <a class="toc-link toc-level-2" href="#misticismo">Misticismo</a>
                        <a class="toc-link toc-level-2" href="#nobreza">Nobreza</a>
                        <a class="toc-link toc-level-2" href="#oficio">Ofício</a>
                        <a class="toc-link toc-level-2" href="#percepcao">Percepção</a>
                        <a class="toc-link toc-level-2" href="#pilotagem">Pilotagem</a>
                        <a class="toc-link toc-level-2" href="#pontaria">Pontaria</a>
                        <a class="toc-link toc-level-2" href="#reflexos">Reflexos</a>
                        <a class="toc-link toc-level-2" href="#religiao">Religião</a>
                        <a class="toc-link toc-level-2" href="#sobrevivencia">Sobrevivência</a>
                        <a class="toc-link toc-level-2" href="#vontade">Vontade</a>
                    </nav>
                </div>
            </aside>

            <article class="sheet classes-content" id="classesContent">

                <section id="introducao" class="content-section">
                    <h2>Introdução</h2>

                    <p>
                        Enquanto seus atributos refletem talento e potencial inato, as perícias avaliam treinamento,
                        experiência e habilidades cotidianas. Elas são usadas para executar uma variedade de proezas:
                        apresentar uma performance artística, saltar sobre um abismo, acertar um monstro com seu machado,
                        decifrar uma língua desconhecida em um pergaminho antigo ou sobreviver em regiões selvagens.
                    </p>

                    <p>
                        As perícias representam o que o personagem sabe fazer no cotidiano e em situações de risco.
                        Elas ajudam a transformar atributos em ações concretas dentro da aventura.
                    </p>
                </section>

                <section id="escolhendo" class="content-section">
                    <h2>Escolhendo as Perícias</h2>

                    <div class="class-power-block">
                        <p>
                            Ao escolher uma classe, você recebe um determinado número de perícias treinadas,
                            ou seja, aquelas em que é mais competente.
                        </p>

                        <p>
                            Além disso, você recebe um número de perícias treinadas igual ao seu valor de
                            <strong>Inteligência</strong>. As perícias adquiridas por Inteligência não precisam pertencer
                            à lista da sua classe.
                        </p>

                        <p>
                            Você também pode adquirir novas perícias treinadas por meio da biografia, do poder geral
                            <strong>Treinamento em Perícia</strong> ou ao aumentar sua Inteligência, exceto por aumentos temporários.
                        </p>
                    </div>
                </section>

                <section id="utilizando" class="content-section">
                    <h2>Utilizando Perícias</h2>

                    <div class="class-power-block">
                        <p>
                            A descrição de cada perícia detalha as ações que podem ser realizadas com ela,
                            apresentando exemplos de uso e regras gerais. Outras ações podem ser negociadas
                            com o narrador.
                        </p>

                        <p>
                            Os testes de perícia seguem a mecânica básica do jogo: role um d20, some o bônus
                            apropriado e compare o resultado com a CD ou com o resultado de outro personagem.
                        </p>
                    </div>
                </section>

                <section id="bonus" class="content-section">
                    <h2>Bônus de Perícia</h2>

                    <div class="class-power-block">
                        <p>
                            Ao realizar um teste de perícia, você soma ao resultado do d20 o seu bônus de perícia.
                            Esse bônus representa sua competência na área.
                        </p>

                        <p>
                            <strong>Bônus de Perícia = metade do nível + atributo-chave + bônus de treinamento, se treinado.</strong>
                        </p>

                        <p>
                            O bônus de treinamento é <strong>+2 do 1º ao 6º nível</strong>,
                            <strong>+4 do 7º ao 14º nível</strong> e <strong>+6 do 15º nível em diante</strong>.
                        </p>

                        <p>
                            Algumas perícias só podem ser usadas se você for treinado nelas. Além disso, perícias marcadas
                            com penalidade de armadura sofrem penalidade se você estiver usando armadura ou escudo.
                        </p>
                    </div>
                </section>

                <section id="tabela-pericias" class="content-section">
                    <h2>Resumo das Perícias</h2>

                    <div class="classes-table-wrap">
                        <table class="classes-table level-table">
                            <thead>
                                <tr>
                                    <th>Perícia</th>
                                    <th>Atributo</th>
                                    <th>Somente Treinada?</th>
                                    <th>Penalidade de Armadura?</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr><td>Acrobacia</td><td>Des</td><td>Não</td><td>Sim</td></tr>
                                <tr><td>Adestramento</td><td>Car</td><td>Sim</td><td>Não</td></tr>
                                <tr><td>Atletismo</td><td>For</td><td>Não</td><td>Não</td></tr>
                                <tr><td>Atuação</td><td>Car</td><td>Sim</td><td>Não</td></tr>
                                <tr><td>Cavalgar</td><td>Des</td><td>Não</td><td>Não</td></tr>
                                <tr><td>Conhecimento</td><td>Int</td><td>Sim</td><td>Não</td></tr>
                                <tr><td>Cura</td><td>Sab</td><td>Não</td><td>Não</td></tr>
                                <tr><td>Diplomacia</td><td>Car</td><td>Não</td><td>Não</td></tr>
                                <tr><td>Enganação</td><td>Car</td><td>Não</td><td>Não</td></tr>
                                <tr><td>Fortitude</td><td>Con</td><td>Não</td><td>Não</td></tr>
                                <tr><td>Furtividade</td><td>Des</td><td>Não</td><td>Sim</td></tr>
                                <tr><td>Guerra</td><td>Int</td><td>Sim</td><td>Não</td></tr>
                                <tr><td>Iniciativa</td><td>Des</td><td>Não</td><td>Não</td></tr>
                                <tr><td>Intimidação</td><td>Car</td><td>Não</td><td>Não</td></tr>
                                <tr><td>Intuição</td><td>Sab</td><td>Não</td><td>Não</td></tr>
                                <tr><td>Investigação</td><td>Int</td><td>Não</td><td>Não</td></tr>
                                <tr><td>Jogatina</td><td>Car</td><td>Sim</td><td>Não</td></tr>
                                <tr><td>Ladinagem</td><td>Des</td><td>Sim</td><td>Sim</td></tr>
                                <tr><td>Luta</td><td>For</td><td>Não</td><td>Não</td></tr>
                                <tr><td>Misticismo</td><td>Int</td><td>Sim</td><td>Não</td></tr>
                                <tr><td>Nobreza</td><td>Int</td><td>Sim</td><td>Não</td></tr>
                                <tr><td>Ofício</td><td>Int</td><td>Sim</td><td>Não</td></tr>
                                <tr><td>Percepção</td><td>Sab</td><td>Não</td><td>Não</td></tr>
                                <tr><td>Pilotagem</td><td>Des</td><td>Sim</td><td>Não</td></tr>
                                <tr><td>Pontaria</td><td>Des</td><td>Não</td><td>Não</td></tr>
                                <tr><td>Reflexos</td><td>Des</td><td>Não</td><td>Não</td></tr>
                                <tr><td>Religião</td><td>Sab</td><td>Sim</td><td>Não</td></tr>
                                <tr><td>Sobrevivência</td><td>Sab</td><td>Não</td><td>Não</td></tr>
                                <tr><td>Vontade</td><td>Sab</td><td>Não</td><td>Não</td></tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section id="acrobacia" class="content-section">
                    <h2>Acrobacia <span class="section-tag">Des — Armadura</span></h2>

                    <div class="class-power-block">
                        <p><strong>Descrição.</strong> Demonstra habilidades acrobáticas notáveis, dignas de verdadeiras proezas.</p>

                        <p><strong>Amortecer Queda (CD 15, apenas treinado).</strong> Quando em queda, você pode usar uma reação para realizar um teste de Acrobacia e reduzir o dano. Se passar, reduz o dano da queda em 1d6, mais 1d6 para cada 5 pontos que ultrapassar a CD. Se o dano for reduzido a zero, aterrissa de pé.</p>

                        <p><strong>Equilíbrio.</strong> Ao caminhar sobre superfícies instáveis, faça testes de Acrobacia para evitar quedas. Cada ação de movimento exige um teste. Passando, avança metade do deslocamento; falhando, não avança. Se falhar por 5 ou mais, cai.</p>

                        <p><strong>Escapar.</strong> Permite escapar de amarras. Cordas usam CD igual ao resultado do teste de Destreza de quem amarrou +10; redes têm CD 20; algemas têm CD 30. Este uso consome uma ação completa.</p>

                        <p><strong>Levantar-se Rapidamente (CD 20, apenas treinado).</strong> Quando caído, você pode tentar levantar-se como ação livre. É necessário ter uma ação de movimento disponível. Se falhar, gasta a ação de movimento e permanece caído.</p>

                        <p><strong>Passar por Espaço Apertado (CD 25, apenas treinado).</strong> Permite espremer-se por espaços estreitos adequados para criaturas uma categoria de tamanho menor. Consome uma ação completa e permite avançar metade do deslocamento.</p>

                        <p><strong>Passar por Inimigo.</strong> Permite atravessar o espaço ocupado por um inimigo como parte do movimento. Faça um teste de Acrobacia oposto ao teste de Acrobacia, Iniciativa ou Luta do oponente, o que for melhor para ele.</p>
                    </div>
                </section>

                <section id="adestramento" class="content-section">
                    <h2>Adestramento <span class="section-tag">Car — Treinada</span></h2>

                    <div class="class-power-block">
                        <p><strong>Descrição.</strong> Habilidade para lidar com animais.</p>

                        <p><strong>Acalmar Animal (CD 25).</strong> Permite acalmar um animal nervoso ou agressivo, como controlar um cavalo assustado ou convencer uma onça a não atacar. Consome uma ação completa.</p>

                        <p><strong>Manejar Animal (CD 15).</strong> Permite direcionar um animal para realizar uma tarefa para a qual foi treinado, como atacar, esperar ou vigiar. Também pode ser usada como Pilotagem para veículos de tração animal. Consome uma ação de movimento.</p>
                    </div>
                </section>

                <section id="atletismo" class="content-section">
                    <h2>Atletismo <span class="section-tag">For</span></h2>

                    <div class="class-power-block">
                        <p><strong>Descrição.</strong> Habilidade para realizar proezas atléticas.</p>

                        <p><strong>Corrida.</strong> Gaste uma ação completa e faça um teste de Atletismo. Avance um número de quadrados de 1,5m igual ao resultado do teste. Receba +2 ou –2 para cada 1,5m de deslocamento acima ou abaixo de 9m.</p>

                        <p><strong>Escalar.</strong> Gaste uma ação de movimento e faça um teste de Atletismo. Se passar, avança metade do deslocamento; se falhar, não avança. Se falhar por 5 ou mais, cai. A CD varia de 10 para superfícies com apoios até 25 para muros lisos.</p>

                        <p><strong>Natação.</strong> Se começar seu turno na água, gaste uma ação de movimento e faça um teste de Atletismo. A CD é 10 para água calma, 15 para agitada e 20 ou mais para tempestuosa. Falhar por 5 ou mais faz você afundar.</p>

                        <p><strong>Saltar.</strong> A CD para salto longo é 5 por quadrado de 1,5m. Para salto em altura, a CD é 15 por quadrado de 1,5m. Sem pelo menos 6m para correr e ganhar impulso, a CD aumenta em +10.</p>
                    </div>
                </section>

                <section id="atuacao" class="content-section">
                    <h2>Atuação <span class="section-tag">Car — Treinada</span></h2>

                    <div class="class-power-block">
                        <p><strong>Descrição.</strong> Você possui habilidades em apresentações artísticas, incluindo música, dança, teatro e outras formas de performance.</p>

                        <p><strong>Apresentação (CD 20).</strong> Permite apresentar-se para obter ganhos financeiros. Se passar, recebe M$ 1d6, mais M$ 1d6 para cada 5 pontos que ultrapassar a CD. A apresentação demanda um dia ou noite.</p>

                        <p><strong>Impressionar.</strong> Faça um teste de Atuação oposto ao teste de Vontade da pessoa que deseja impressionar. Se passar, recebe +2 em testes de perícias baseadas em Carisma contra essa pessoa no mesmo dia. Se falhar, sofre –2 nesses testes e não pode tentar novamente no mesmo dia.</p>
                    </div>
                </section>

                <section id="cavalgar" class="content-section">
                    <h2>Cavalgar <span class="section-tag">Des</span></h2>

                    <div class="class-power-block">
                        <p><strong>Descrição.</strong> Habilidade para conduzir animais de montaria, como cavalos, javalis e arara-reis.</p>

                        <p><strong>Conduzir.</strong> Cavalgar através de obstáculos exige testes. CD 15 para terreno ruim com obstáculos pequenos e CD 25 para terreno perigoso ou com obstáculos grandes. Se falhar, cai da montaria e sofre 1d6 de dano.</p>

                        <p><strong>Galopar.</strong> Gaste uma ação completa e faça um teste. Avance um número de quadrados de 1,5m igual ao resultado do teste. Aplique modificadores por deslocamento acima ou abaixo de 9m.</p>

                        <p><strong>Montar Rapidamente (CD 20).</strong> Permite montar ou desmontar como ação livre. Se falhar por 5 ou mais, cai no chão. Sem sela, sofre –5 no teste.</p>
                    </div>
                </section>

                <section id="conhecimento" class="content-section">
                    <h2>Conhecimento <span class="section-tag">Int — Treinada</span></h2>

                    <div class="class-power-block">
                        <p><strong>Descrição.</strong> Você possui vasto conhecimento em áreas como geometria, astronomia, física, geografia e história.</p>

                        <p><strong>Idiomas (CD 20).</strong> Permite compreender idiomas desconhecidos. Se falhar por 5 ou mais, pode tirar conclusões equivocadas. Idiomas exóticos ou muito antigos têm CD 30.</p>

                        <p><strong>Informação.</strong> Permite responder perguntas gerais. Questões simples não exigem teste; questões complexas têm CD 20; mistérios e enigmas possuem CD 30.</p>
                    </div>
                </section>

                <section id="cura" class="content-section">
                    <h2>Cura <span class="section-tag">Sab</span></h2>

                    <div class="class-power-block">
                        <p><strong>Descrição.</strong> Você é capacitado para tratar ferimentos, doenças e venenos.</p>

                        <p><strong>Cuidados Prolongados (CD 15, apenas treinado).</strong> Acelera a recuperação de uma pessoa. Se passar, ela aumenta sua recuperação de PV em +1 por nível naquele dia. Leva uma hora.</p>

                        <p><strong>Necropsia (CD 20, apenas treinado).</strong> Examina um cadáver para determinar causa e momento aproximado da morte. Causas raras ou extraordinárias têm CD 30. Leva dez minutos.</p>

                        <p><strong>Primeiros Socorros (CD 15).</strong> Estabiliza um personagem adjacente que esteja sangrando. Consome uma ação padrão.</p>

                        <p><strong>Tratamento (apenas treinado).</strong> Ajuda uma vítima de doença ou veneno com efeito contínuo. Gaste uma ação completa e faça um teste contra a CD da doença ou veneno. Se passar, o paciente recebe +5 no próximo teste de Fortitude contra o efeito.</p>
                    </div>
                </section>

                <section id="diplomacia" class="content-section">
                    <h2>Diplomacia <span class="section-tag">Car</span></h2>

                    <div class="class-power-block">
                        <p><strong>Descrição.</strong> Você persuade pessoas por meio de lábia, negociação e argumentação.</p>

                        <p><strong>Barganha.</strong> Ao comprar ou vender, faça um teste de Diplomacia oposto ao teste de Vontade do negociante. Se passar, altera o preço em 10% a seu favor. Se ultrapassar por 10 ou mais, altera em 20%.</p>

                        <p><strong>Mudar Atitude.</strong> Com um teste oposto ao teste de Vontade do alvo, você pode alterar a atitude de um NPC em relação a você ou outra pessoa. Este uso requer um minuto.</p>

                        <p><strong>Persuasão (CD 20).</strong> Permite convencer alguém a realizar uma ação, responder uma pergunta ou prestar um favor. Se a ação for custosa, sofre –5; se for perigosa, sofre –10 ou falha automaticamente.</p>
                    </div>
                </section>

                <section id="enganacao" class="content-section">
                    <h2>Enganação <span class="section-tag">Car</span></h2>

                    <div class="class-power-block">
                        <p><strong>Descrição.</strong> Você manipula pessoas por meio de blefes, trapaças, disfarces e mentiras.</p>

                        <p><strong>Disfarce.</strong> Faça um teste de Enganação oposto ao teste de Percepção de quem observa. Disfarces complexos impõem –5; disfarçar-se como pessoa específica dá +10 para quem conhece a pessoa.</p>

                        <p><strong>Falsificação.</strong> Permite falsificar documentos. Seu teste é oposto ao teste de Percepção de quem examina. Documentos complexos ou com assinatura específica impõem –10.</p>

                        <p><strong>Fintar.</strong> Gaste uma ação padrão e faça um teste de Enganação oposto a Reflexos de um ser em alcance curto. Se passar, ele fica desprevenido contra seu próximo ataque até o fim do seu próximo turno.</p>

                        <p><strong>Insinuação (CD 20).</strong> Permite falar algo para alguém sem que outras pessoas entendam. Outros podem fazer Intuição oposta ao seu teste para entender.</p>

                        <p><strong>Intriga (CD 20).</strong> Espalha uma fofoca para manipular situações. Intrigas improváveis têm CD 30. Este uso exige um dia ou mais.</p>

                        <p><strong>Mentir.</strong> Seu teste é oposto ao teste de Intuição da vítima. Mentiras muito implausíveis impõem –10.</p>
                    </div>
                </section>

                <section id="fortitude" class="content-section">
                    <h2>Fortitude <span class="section-tag">Con</span></h2>

                    <div class="class-power-block">
                        <p>
                            <strong>Descrição.</strong> Usada para resistir a efeitos que demandam vitalidade,
                            como doenças, venenos, exaustão e afogamento.
                        </p>

                        <p>
                            Também é usada para manter o fôlego durante corridas ou períodos sem respirar,
                            com CD 15 +1 por teste anterior.
                        </p>
                    </div>
                </section>

                <section id="furtividade" class="content-section">
                    <h2>Furtividade <span class="section-tag">Des — Armadura</span></h2>

                    <div class="class-power-block">
                        <p><strong>Descrição.</strong> Você domina a arte de agir com discrição e de forma sorrateira.</p>

                        <p><strong>Esconder-se.</strong> Faça um teste de Furtividade oposto aos testes de Percepção de quem possa notá-lo. Esconder-se é ação livre no final do turno e exige local propício. Se moveu no turno, sofre –5; se atacou ou fez algo chamativo, sofre –20.</p>

                        <p><strong>Seguir.</strong> Faça um teste de Furtividade oposto ao teste de Percepção da pessoa seguida. Sofre –5 se estiver em local sem esconderijos ou sem movimento. Se passar, segue a vítima até o destino; se falhar, ela percebe sua presença.</p>
                    </div>
                </section>

                <section id="guerra" class="content-section">
                    <h2>Guerra <span class="section-tag">Int — Treinada</span></h2>

                    <div class="class-power-block">
                        <p><strong>Descrição.</strong> Você recebeu educação em táticas, estratégias e logística.</p>

                        <p><strong>Analisar Terreno (CD 20).</strong> Como ação de movimento, observa o campo de batalha. Se passar, descobre vantagens como cobertura, camuflagem ou terreno elevado.</p>

                        <p><strong>Plano de Ação (CD 20).</strong> Como ação padrão, orienta um aliado em alcance médio. Se passar, concede +5 em sua Iniciativa. Se ele tiver Iniciativa maior que a sua e ainda não agiu, age imediatamente após seu turno.</p>
                    </div>
                </section>

                <section id="iniciativa" class="content-section">
                    <h2>Iniciativa <span class="section-tag">Des</span></h2>

                    <div class="class-power-block">
                        <p>
                            <strong>Descrição.</strong> Reflete sua rapidez de reação em momentos críticos.
                            Ao iniciar uma cena de ação, todos os personagens fazem um teste de Iniciativa
                            e agem em ordem decrescente de resultado.
                        </p>
                    </div>
                </section>

                <section id="intimidacao" class="content-section">
                    <h2>Intimidação <span class="section-tag">Car</span></h2>

                    <div class="class-power-block">
                        <p><strong>Descrição.</strong> Permite aterrorizar, pressionar ou obrigar outras pessoas a atender seus desejos.</p>

                        <p><strong>Assustar.</strong> Gaste uma ação padrão e faça Intimidação oposta ao teste de Vontade de uma criatura em alcance curto. Se passar, ela fica abalada pelo restante da cena. Se superar por 10 ou mais, fica apavorada por uma rodada e depois abalada.</p>

                        <p><strong>Coagir.</strong> Faça um teste oposto ao teste de Vontade de uma criatura inteligente adjacente. Se passar, ela obedece a uma ordem. Este uso demanda um minuto ou mais e deixa o alvo hostil contra você.</p>
                    </div>
                </section>

                <section id="intuicao" class="content-section">
                    <h2>Intuição <span class="section-tag">Sab</span></h2>

                    <div class="class-power-block">
                        <p><strong>Descrição.</strong> Revela empatia, leitura social e sexto sentido.</p>

                        <p><strong>Perceber Mentira.</strong> Permite descobrir se alguém está mentindo, normalmente como oposição à Enganação.</p>

                        <p><strong>Pressentimento (CD 20, apenas treinado).</strong> Permite analisar uma pessoa para ter noção de índole ou caráter, ou avaliar uma situação para detectar anormalidades. Indica a presença de algo estranho, mas não revela a causa.</p>
                    </div>
                </section>

                <section id="investigacao" class="content-section">
                    <h2>Investigação <span class="section-tag">Int</span></h2>

                    <div class="class-power-block">
                        <p>
                            <strong>Descrição.</strong> Você é capaz de reunir pistas, cruzar informações,
                            examinar ambientes e descobrir detalhes que passariam despercebidos por outras pessoas.
                        </p>

                        <p>
                            <strong>Interrogar.</strong> Você obtém informações conversando com pessoas, fazendo perguntas,
                            frequentando lugares movimentados ou apenas prestando atenção ao que circula ao seu redor.
                            Informações comuns, como <em>“quem é o guerreiro mais forte da aldeia?”</em>, normalmente não exigem teste.
                            Informações restritas, conhecidas por poucas pessoas, como <em>“quem é o ancião que sempre acompanha o rei?”</em>,
                            têm <strong>CD 20</strong>. Informações sigilosas, perigosas ou que possam comprometer quem as revela,
                            como <em>“quem lidera a guilda dos ladrões?”</em>, têm <strong>CD 30</strong>.
                        </p>

                        <p>
                            Esse uso consome <strong>uma hora</strong> e geralmente exige o gasto de <strong>T$ 3d6</strong>
                            com bebidas, pequenos subornos, gorjetas, favores ou outras formas de facilitar a conversa.
                            O mestre pode ajustar esse tempo e esse custo conforme o local, o risco envolvido e a disponibilidade
                            das informações.
                        </p>

                        <p>
                            <strong>Procurar.</strong> Você vasculha um lugar em busca de algo específico ou de indícios relevantes.
                            A CD depende de quão difícil é encontrar o que está procurando: <strong>CD 15</strong> para um objeto
                            perdido em meio à bagunça, mas não intencionalmente escondido; <strong>CD 20</strong> para algo oculto,
                            como um cofre atrás de um quadro ou um documento guardado em um fundo falso; e <strong>CD 30</strong>
                            para algo muito bem disfarçado, como uma passagem secreta ativada por um mecanismo oculto ou uma mensagem
                            escrita com tinta invisível.
                        </p>

                        <p>
                            Esse uso pode levar desde <strong>uma ação completa</strong>, como examinar uma escrivaninha,
                            até <strong>um dia inteiro</strong>, como pesquisar uma biblioteca ou arquivo extenso.
                            Investigação também pode ser usada para encontrar armadilhas, com CD definida pela própria armadilha,
                            e para localizar rastros. Para seguir rastros depois de encontrá-los, use <strong>Sobrevivência</strong>.
                        </p>
                    </div>
                </section>

                <section id="jogatina" class="content-section">
                    <h2>Jogatina <span class="section-tag">Car — Treinada</span></h2>

                    <div class="class-power-block">
                        <p><strong>Descrição.</strong> Seu domínio na Jogatina permite participar de jogos de azar com maestria.</p>

                        <p><strong>Apostar.</strong> Ao envolver-se em uma noite de jogatina, desembolse T$ 1d10, faça um teste e consulte o resultado para determinar os ganhos.</p>

                        <div class="classes-table-wrap">
                            <table class="classes-table level-table">
                                <thead>
                                    <tr>
                                        <th>Resultado do Teste</th>
                                        <th>Ganho</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr><td>9 ou menos</td><td>Nenhum</td></tr>
                                    <tr><td>10–14</td><td>Metade da aposta</td></tr>
                                    <tr><td>15–19</td><td>Valor da aposta</td></tr>
                                    <tr><td>20–29</td><td>Dobro da aposta</td></tr>
                                    <tr><td>30–39</td><td>Triplo da aposta</td></tr>
                                    <tr><td>40 ou mais</td><td>Quíntuplo da aposta</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                <section id="ladinagem" class="content-section">
                    <h2>Ladinagem <span class="section-tag">Des — Treinada — Armadura</span></h2>

                    <div class="class-power-block">
                        <p><strong>Descrição.</strong> Mestre da malandragem, você é hábil em atividades ilícitas com destreza e astúcia.</p>

                        <p><strong>Abrir Fechadura.</strong> Permite destrancar fechaduras. CD 20 para simples, CD 25 para médias e CD 30 para superiores. Exige ação completa e gazua. Sem ferramenta, sofre –5.</p>

                        <p><strong>Ocultar.</strong> Permite esconder objetos em si mesmo. Faça teste oposto à Percepção de observadores. Objetos pequenos dão +5; objetos volumosos impõem –5.</p>

                        <p><strong>Punga (CD 20).</strong> Permite retirar ou colocar um objeto nas posses de outra pessoa. A vítima pode fazer Percepção contra CD igual ao resultado do seu teste.</p>

                        <p><strong>Sabotar.</strong> Permite desabilitar dispositivos mecânicos. Ações simples têm CD 20; ações complexas têm CD 30. Falha por 5 ou mais pode ativar o dispositivo ou causar problema.</p>
                    </div>
                </section>

                <section id="luta" class="content-section">
                    <h2>Luta <span class="section-tag">For</span></h2>

                    <div class="class-power-block">
                        <p>
                            <strong>Descrição.</strong> Usada para realizar ataques corpo a corpo.
                            A Defesa do alvo determina a CD. Se o ataque acertar, você causa dano conforme a arma utilizada.
                        </p>
                    </div>
                </section>

                <section id="misticismo" class="content-section">
                    <h2>Misticismo <span class="section-tag">Int — Treinada</span></h2>

                    <div class="class-power-block">
                        <p><strong>Descrição.</strong> Abrange conhecimento de magias, itens mágicos, fenômenos e seres sobrenaturais.</p>

                        <p><strong>Detectar Magia (CD 15).</strong> Em uma ação completa, identifica presença e intensidade de auras mágicas em alcance curto.</p>

                        <p><strong>Identificar Criatura (CD 15 + ND).</strong> Como ação padrão, analisa uma criatura mágica visível. Se passar, recorda uma característica. A cada 5 pontos excedentes, lembra outra.</p>

                        <p><strong>Identificar Item Mágico.</strong> Estuda um item mágico para identificar seus poderes. CD 20 para menores, 25 para médios e 30 para maiores. Demanda uma hora.</p>

                        <p><strong>Identificar Magia (CD 15 + custo em PM).</strong> Quando alguém conjura uma magia, você pode tentar identificá-la como reação.</p>

                        <p><strong>Informação.</strong> Responde perguntas sobre magias, itens mágicos, fenômenos sobrenaturais, runas, profecias e planos de existência.</p>

                        <p><strong>Lançar Magia de Armadura (CD 20 + custo em PM).</strong> Ao conjurar magia arcana usando armadura, faça um teste com penalidade da armadura. Se falhar, a magia não é conjurada, mas consome PM.</p>
                    </div>
                </section>

                <section id="nobreza" class="content-section">
                    <h2>Nobreza <span class="section-tag">Int — Treinada</span></h2>

                    <div class="class-power-block">
                        <p><strong>Descrição.</strong> Representa educação nobre e conhecimentos relacionados à aristocracia.</p>

                        <p><strong>Etiqueta (CD 15).</strong> Permite compreender costumes, comportamento, festas e audiências da cultura local.</p>

                        <p><strong>Informação.</strong> Responde perguntas sobre leis, tradições, linhagens e heráldica. Questões simples não exigem teste; complexas têm CD 20; mistérios têm CD 30.</p>
                    </div>
                </section>

                <section id="oficio" class="content-section">
                    <h2>Ofício <span class="section-tag">Int — Treinada</span></h2>

                    <div class="class-power-block">
                        <p><strong>Descrição.</strong> Ofício representa diversas habilidades profissionais e artesanais, cada uma ligada à fabricação ou manutenção de itens.</p>

                        <p><strong>Especializações comuns.</strong> Armeiro, artesão, alquimista, cozinheiro, alfaiate, carpinteiro, pedreiro, ourives, fazendeiro, pescador, estalajadeiro, escriba, escultor, pintor e outras definidas com o mestre.</p>

                        <p><strong>Consertar.</strong> Para reparar um item destruído, a CD é a mesma necessária para fabricá-lo. Cada tentativa consome uma hora e um décimo do preço original do item.</p>

                        <p><strong>Fabricar.</strong> Produzir um item exige matéria-prima e tempo. A matéria-prima custa um terço do preço do item. O tempo é um dia para consumíveis, uma semana para não consumíveis comuns e um mês para não consumíveis superiores ou mágicos.</p>

                        <p><strong>Identificar (CD 20).</strong> Permite identificar itens raros e exóticos relacionados ao seu Ofício. Se passar, descobre propriedades e preço. Consome uma ação completa.</p>

                        <p><strong>Sustento (CD 15).</strong> Com uma semana de trabalho, você ganha M$ 1, mais M$ 1 por ponto que exceder a CD.</p>

                        <p><strong>Ferramentas.</strong> Cada Ofício exige instrumentos específicos. Sem eles, você sofre –5 no teste.</p>
                    </div>
                </section>

                <section id="percepcao" class="content-section">
                    <h2>Percepção <span class="section-tag">Sab</span></h2>

                    <div class="class-power-block">
                        <p><strong>Descrição.</strong> Permite perceber o ambiente ao redor usando visão, audição e outros sentidos.</p>

                        <p><strong>Observação.</strong> Identifica coisas discretas ou ocultas. A CD varia de 15 para algo difícil de notar até 30 para algo quase invisível. Pessoas ou itens ocultos usam a CD do teste de Furtividade ou Ladinagem.</p>

                        <p><strong>Audição.</strong> Permite perceber ruídos sutis. Conversa casual próxima tem CD 0; sussurros têm CD 15; ouvir através de porta aumenta CD em +10. Dormindo, sofre –10, mas sucesso faz acordar.</p>
                    </div>
                </section>

                <section id="pilotagem" class="content-section">
                    <h2>Pilotagem <span class="section-tag">Des — Treinada</span></h2>

                    <div class="class-power-block">
                        <p>
                            <strong>Descrição.</strong> Habilidade para operar veículos, como carroças, barcos e balões.
                            Ações simples não exigem testes.
                        </p>

                        <p>
                            Conduzir em situações adversas exige ação de movimento e teste de Pilotagem contra CD 15 por turno
                            ou cena. Situações extremas, obstáculos e tempestades aumentam a CD para 25. Falha faz avançar
                            apenas metade; falha por 5 ou mais pode causar acidente.
                        </p>
                    </div>
                </section>

                <section id="pontaria" class="content-section">
                    <h2>Pontaria <span class="section-tag">Des</span></h2>

                    <div class="class-power-block">
                        <p>
                            <strong>Descrição.</strong> Usada para realizar ataques à distância.
                            A Defesa do alvo determina a CD. Se acertar, você causa dano conforme a arma utilizada.
                        </p>
                    </div>
                </section>

                <section id="reflexos" class="content-section">
                    <h2>Reflexos <span class="section-tag">Des</span></h2>

                    <div class="class-power-block">
                        <p>
                            <strong>Descrição.</strong> Usada para resistir a efeitos que exigem reações rápidas,
                            como armadilhas, explosões e fintas.
                        </p>
                    </div>
                </section>

                <section id="religiao" class="content-section">
                    <h2>Religião <span class="section-tag">Sab — Treinada</span></h2>

                    <div class="class-power-block">
                        <p><strong>Descrição.</strong> Confere conhecimento sobre deuses, religiões, entidades, profecias e planos de existência de Pindorama.</p>

                        <p><strong>Identificar Criatura (CD 15 + ND).</strong> Permite identificar criaturas de origem sobrenatural, como encantados, espíritos da mata e alguns mortos-vivos.</p>

                        <p><strong>Identificar Item Mágico.</strong> Permite identificar itens mágicos de origem divina, de modo semelhante a Misticismo.</p>

                        <p><strong>Informação.</strong> Responde perguntas sobre deuses, profecias, planos de existência e religiões. Questões simples não exigem teste; complexas têm CD 20; mistérios têm CD 30.</p>

                        <p><strong>Rito (CD 20).</strong> Realiza cerimônias religiosas, como consagrações, casamentos, funerais e penitências para devotos que infringiram obrigações religiosas.</p>
                    </div>
                </section>

                <section id="sobrevivencia" class="content-section">
                    <h2>Sobrevivência <span class="section-tag">Sab</span></h2>

                    <div class="class-power-block">
                        <p>
                            <strong>Descrição.</strong> Em ambiente natural, permite prover abrigo e alimento para você e seu grupo
                            por um dia. A CD varia conforme o terreno: 15 para planícies e colinas, 20 para florestas e pântanos,
                            25 para desertos ou montanhas e 30 para regiões planares perigosas ou áreas do Caos Primordial.
                        </p>

                        <p><strong>Acampamento.</strong> Dormir ao relento sem acampamento e saco de dormir diminui a recuperação de PV e PM. Este uso exige equipamento de viagem; sem ele, sofre –5.</p>

                        <p><strong>Identificar Criatura (CD 15 + ND).</strong> Permite identificar animais ou monstros, conforme regras semelhantes às de Misticismo.</p>

                        <p><strong>Orientar-se.</strong> Em viagens pelos ermos, exige teste diário. Se passar, avança normalmente; se falhar, avança metade; se falhar por 5 ou mais, perde-se e não avança.</p>

                        <p><strong>Rastrear (apenas treinado).</strong> Permite identificar e seguir rastros. CD 15 para solo macio, 20 para solo comum e 25 para solo duro. Condições ruins aumentam a CD; grupos grandes ou criaturas enormes reduzem a CD.</p>
                    </div>
                </section>

                <section id="vontade" class="content-section">
                    <h2>Vontade <span class="section-tag">Sab</span></h2>

                    <div class="class-power-block">
                        <p>
                            <strong>Descrição.</strong> Usada para resistir a efeitos que demandam determinação,
                            como intimidação, medo, controle mental e encantamentos.
                        </p>

                        <p>
                            Testes de Vontade são considerados testes de resistência.
                        </p>
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
        aria-controls="classesSidebar"
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

    <script>
        (function () {
            const body = document.body;
            const sidebar = document.getElementById("classesSidebar");
            const menuButton = document.getElementById("mobileMenuToggle");
            const closeButton = document.getElementById("sidebarCloseBtn");
            const backdrop = document.getElementById("periciasSidebarBackdrop");
            const searchInput = document.getElementById("classesSearch");
            const toc = document.getElementById("classesToc");
            const links = Array.from(document.querySelectorAll("#classesToc .toc-link"));
            const sections = Array.from(document.querySelectorAll(".classes-content .content-section"));
            const backToTop = document.getElementById("backToTopBtn");

            if (!sidebar || !menuButton) return;

            function openSidebar() {
                sidebar.classList.add("is-open");
                if (backdrop) {
                    backdrop.hidden = false;
                    requestAnimationFrame(() => backdrop.classList.add("is-visible"));
                }
                menuButton.classList.add("is-open");
                menuButton.setAttribute("aria-expanded", "true");
                body.classList.add("pericias-menu-open");
            }

            function closeSidebar() {
                sidebar.classList.remove("is-open");
                if (backdrop) backdrop.classList.remove("is-visible");
                menuButton.classList.remove("is-open");
                menuButton.setAttribute("aria-expanded", "false");
                body.classList.remove("pericias-menu-open");

                window.setTimeout(() => {
                    if (!sidebar.classList.contains("is-open")) {
                        if (backdrop) backdrop.hidden = true;
                    }
                }, 180);
            }

            function toggleSidebar() {
                sidebar.classList.contains("is-open") ? closeSidebar() : openSidebar();
            }

            menuButton.addEventListener("click", toggleSidebar);
            backdrop?.addEventListener("click", closeSidebar);
            closeButton?.addEventListener("click", closeSidebar);

            document.addEventListener("keydown", (event) => {
                if (event.key === "Escape") closeSidebar();
            });

            links.forEach((link) => {
                link.addEventListener("click", () => {
                    if (window.matchMedia("(max-width: 980px)").matches) {
                        closeSidebar();
                    }
                });
            });

            if (searchInput && toc) {
                searchInput.addEventListener("input", () => {
                    const term = searchInput.value.trim().toLowerCase();

                    links.forEach((link) => {
                        const match = link.textContent.toLowerCase().includes(term);
                        link.hidden = Boolean(term) && !match;
                    });
                });
            }

            if (sections.length && links.length && "IntersectionObserver" in window) {
                const linkById = new Map(
                    links.map((link) => [decodeURIComponent(link.getAttribute("href").replace("#", "")), link])
                );

                const observer = new IntersectionObserver((entries) => {
                    const visible = entries
                        .filter((entry) => entry.isIntersecting)
                        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

                    if (!visible) return;

                    links.forEach((link) => link.classList.remove("is-active"));
                    linkById.get(visible.target.id)?.classList.add("is-active");
                }, {
                    root: null,
                    rootMargin: "-20% 0px -65% 0px",
                    threshold: [0, 0.15, 0.4]
                });

                sections.forEach((section) => observer.observe(section));
            }

            if (backToTop) {
                function updateBackToTop() {
                    backToTop.classList.toggle("is-visible", window.scrollY > 520);
                }

                window.addEventListener("scroll", updateBackToTop, { passive: true });
                updateBackToTop();

                backToTop.addEventListener("click", () => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                });
            }
        })();
    </script>
</body>
</html>
