<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Rústico - Pindorama RPG</title>

    <link rel="stylesheet" href="assets/css/ficha.css" />
    <link rel="stylesheet" href="assets/css/classes.css?v=20260513a" />
</head>

<body>
    <main class="page-wrapper classes-page">

        <header class="top-actions classes-topbar">
            <div>
                <h1>Rústico</h1>
                <p>Classe dedicada à fúria, ao instinto ancestral, à força bruta e à resistência feroz diante dos perigos de Pindorama.</p>
            </div>

            <div class="actions">
                <a class="system-link-btn" href="index.php">Menu</a>
                <a class="system-link-btn" href="classes.php">Classes</a>
                <a class="system-link-btn" href="ficha.php">Ficha</a>
            </div>
        </header>

        <?php
            $cb_class_slug = 'rustico';
            $cb_class_name = 'Rústico';
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
                        <a class="toc-link toc-level-2" href="#tabela-rustico">O Rústico</a>
                        <a class="toc-link toc-level-2" href="#furia">Fúria</a>
                        <a class="toc-link toc-level-2" href="#poderes">Poderes de Rústico</a>
                    </nav>
                </div>
            </aside>

            <article class="sheet classes-content" id="classesContent">

                <section id="descricao" class="content-section">
                    <h2>Rústico</h2>

                    <p>
                        O rústico é a personificação do herói ancestral, um ser que olha com desdém para as trivialidades da civilização.
                        Apesar dos seres que vivem nas cidades frequentemente se gabarem de sua superioridade sobre os animais ao rejeitar
                        sua própria natureza, para o rústico, a civilização é um sinal de fraqueza.
                    </p>

                    <p>
                        A verdadeira força emerge da natureza selvagem, das paixões primordiais, da energia bruta e do fogo da fúria.
                        Muros e multidões sufocam essa essência, enquanto ela floresce nas vastidões das terras, nas selvas impenetráveis
                        e nas pradarias infinitas, onde bandos tribais caçam e prosperam.
                    </p>

                    <p>
                        No entanto, nem todos os eremitas ou tribais são realmente rústicos. É tão comum encontrar um rústico entre eles
                        quanto encontrar um guerreiro de elite em uma grande cidade.
                    </p>

                    <p>
                        É nas vastas regiões selvagens do mundo, repletas de perigos como tribos rivais, climas mortíferos e monstros
                        aterradores, que os rústicos mostram quem realmente são. Eles encaram toda e qualquer ameaça de frente,
                        emergindo como campeões e líderes incontestáveis nos momentos de guerra, poupando seu povo desse fardo.
                    </p>

                    <p>
                        Como combatente, seu ímpeto o guia. Ele confia mais na fúria de seu interior do que em artifícios técnicos.
                        Diante de perigos iminentes, ou provocado pelo despertar de seu ódio, é possuído por uma fúria guerreira,
                        perdendo-se em um êxtase combativo que eclipsa qualquer outra preocupação.
                    </p>

                    <p>
                        Esses momentos de fervor frequentemente são suficientes para subjugar qualquer ameaça que surja, e é justamente
                        em meio ao caos do combate que o rústico se sente mais vivo.
                    </p>

                    <p>
                        Há também aqueles que adotam o nomadismo como modo de vida, considerando esse o preço justo a pagar pela
                        oportunidade de explorar os perigos e mistérios do vasto mundo. Aventurar-se por desertos, florestas, montanhas
                        ou regiões pantanosas de Pindorama é uma transição natural, e, embora possam sentir falta de uma estrutura familiar,
                        muitos acabam encontrando uma nova família entre aqueles que os acompanham.
                    </p>
                </section>

                <section id="caracteristicas" class="content-section">
                    <h2>Características de Classe</h2>

                    <div class="class-power-block">
                        <p>
                            <strong>Pontos de Vida.</strong> Um rústico começa com
                            <strong>24 pontos de vida + Constituição</strong> e ganha
                            <strong>6 PV + Constituição</strong> por nível.
                        </p>

                        <p><strong>Pontos de Mana.</strong> <strong>3 PM por nível.</strong></p>

                        <p>
                            <strong>Perícias.</strong> <strong>Fortitude (Con)</strong> e <strong>Luta (For)</strong>,
                            mais <strong>3</strong> à sua escolha entre
                            <strong>Adestramento (Car)</strong>, <strong>Atletismo (For)</strong>,
                            <strong>Cavalgar (Des)</strong>, <strong>Iniciativa (Des)</strong>,
                            <strong>Intimidação (Car)</strong>, <strong>Ofício (Int)</strong>,
                            <strong>Percepção (Sab)</strong>, <strong>Pontaria (Des)</strong>,
                            <strong>Sobrevivência (Sab)</strong> e <strong>Vontade (Sab)</strong>.
                        </p>

                        <p><strong>Proficiências.</strong> Armas marciais e escudo.</p>
                    </div>
                </section>

                <section id="habilidades" class="content-section">
                    <h2>Habilidades de Classe</h2>

                    <div class="class-power-block">
                        <p>
                            <strong>Fúria.</strong> Você pode gastar <strong>2 PM</strong> para invocar uma fúria selvagem.
                            Você recebe <strong>+2 em testes de ataque</strong> e em <strong>rolagens de dano corpo a corpo</strong>,
                            mas não pode fazer nenhuma ação que exija calma e concentração, como usar a perícia Furtividade ou lançar magias.
                        </p>

                        <p>
                            No <strong>7º nível</strong>, e a cada cinco níveis depois disso, você pode gastar
                            <strong>+1 PM</strong> para aumentar os bônus da Fúria em +1. A Fúria termina se, ao fim da rodada,
                            você não tiver atacado nem sido alvo de um efeito hostil, como ataque, habilidade ou magia.
                        </p>

                        <p>
                            <strong>Poder de Rústico.</strong> No <strong>2º nível</strong>, e a cada nível seguinte,
                            você escolhe um dos poderes de rústico.
                        </p>

                        <p>
                            <strong>Instinto Ancestral.</strong> No <strong>3º nível</strong>, você recebe <strong>+1</strong>
                            em rolagens de dano, Percepção e Reflexos. A cada seis níveis, esse bônus aumenta em +1.
                        </p>

                        <p>
                            <strong>Redução de Dano.</strong> A partir do <strong>5º nível</strong>, graças a seu vigor
                            e força de vontade, você ignora parte de seus ferimentos. Você recebe
                            <strong>redução de dano 2</strong>. A cada três níveis, sua RD aumenta em 2, até um máximo de
                            <strong>RD 10</strong> no 17º nível.
                        </p>

                        <p>
                            <strong>Fúria Titânica.</strong> No <strong>20º nível</strong>, o bônus que você recebe nos testes
                            de ataque e rolagens de dano quando usa Fúria é dobrado. Por exemplo, se gastar 5 PM, em vez de
                            um bônus de +5, recebe um bônus de <strong>+10</strong>.
                        </p>
                    </div>
                </section>

                <section id="tabela-rustico" class="content-section">
                    <h2>O Rústico</h2>

                    <div class="classes-table-wrap">
                        <table class="classes-table level-table">
                            <thead>
                                <tr>
                                    <th>Nível</th>
                                    <th>Habilidades de Classe</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr><td>1º</td><td>Fúria</td></tr>
                                <tr><td>2º</td><td>Poder de rústico</td></tr>
                                <tr><td>3º</td><td>Instinto ancestral +1, poder de rústico</td></tr>
                                <tr><td>4º</td><td>Poder de rústico</td></tr>
                                <tr><td>5º</td><td>Poder de rústico, redução de dano 2</td></tr>
                                <tr><td>6º</td><td>Fúria +3, poder de rústico</td></tr>
                                <tr><td>7º</td><td>Poder de rústico</td></tr>
                                <tr><td>8º</td><td>Poder de rústico, redução de dano 4</td></tr>
                                <tr><td>9º</td><td>Instinto ancestral +2, poder de rústico</td></tr>
                                <tr><td>10º</td><td>Poder de rústico</td></tr>
                                <tr><td>11º</td><td>Fúria +4, poder de rústico, redução de dano 6</td></tr>
                                <tr><td>12º</td><td>Poder de rústico</td></tr>
                                <tr><td>13º</td><td>Poder de rústico</td></tr>
                                <tr><td>14º</td><td>Poder de rústico, redução de dano 8</td></tr>
                                <tr><td>15º</td><td>Instinto ancestral +3, poder de rústico</td></tr>
                                <tr><td>16º</td><td>Fúria +5, poder de rústico</td></tr>
                                <tr><td>17º</td><td>Poder de rústico, redução de dano 10</td></tr>
                                <tr><td>18º</td><td>Poder de rústico</td></tr>
                                <tr><td>19º</td><td>Poder de rústico</td></tr>
                                <tr><td>20º</td><td>Fúria titânica, poder de rústico</td></tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section id="furia" class="content-section">
                    <h2>Fúria</h2>

                    <div class="class-power-block">
                        <p>
                            <strong>Estado de Fúria.</strong> A Fúria é o centro da identidade do rústico. Ela representa
                            o momento em que o personagem abandona qualquer contenção e transforma sua força física,
                            raiva, dor e instinto em poder de combate direto.
                        </p>

                        <p>
                            Enquanto está em fúria, o rústico se torna mais perigoso em combate corpo a corpo, mas perde
                            acesso a ações que exigem precisão, paciência ou concentração. Por isso, a Fúria é mais eficiente
                            quando o personagem está no centro do confronto, atacando ou recebendo hostilidade constante.
                        </p>

                        <p>
                            <strong>Fim da Fúria.</strong> A Fúria termina se, ao fim da rodada, você não tiver atacado nem
                            sido alvo de um efeito hostil. Isso incentiva um estilo de combate agressivo, direto e permanente.
                        </p>
                    </div>
                </section>

                <section id="poderes" class="content-section">
                    <h2>Poderes de Rústico</h2>

                    <div class="class-power-block">
                        <p><strong>Alma de Bronze.</strong> Quando entra em fúria, você recebe uma quantidade de pontos de vida temporários igual a seu nível + sua Força.</p>

                        <p><strong>Arremesso Enfurecido.</strong> Você pode gastar 1 PM para arremessar uma arma de corpo a corpo e realizar um ataque à distância, utilizando sua Força nos testes de Pontaria e nas rolagens de dano, sem sofrer penalidades. <strong>Pré-requisitos:</strong> 4º nível de rústico, treinado em Pontaria.</p>

                        <p><strong>Aumento de Atributo.</strong> Você recebe +1 em um atributo. Você pode escolher este poder várias vezes, mas apenas uma vez por patamar para um mesmo atributo.</p>

                        <p><strong>Calor da Batalha.</strong> Sempre que receber dano, você reduz em 1 PM o custo para ativação de seus outros poderes de rústico, até o mínimo de 1 PM por poder.</p>

                        <p><strong>Carnificina.</strong> Se seu ataque reduz os PV de uma criatura a 0, você pode escolher entre recuperar 2 PM ou realizar uma ação padrão extra.</p>

                        <p><strong>Cicatrizes Ritualísticas.</strong> Seu corpo é coberto de cicatrizes ritualísticas que o tornam mais ameaçador e resistente à dor. Você recebe +2 em Intimidação e redução de dano 2. <strong>Pré-requisitos:</strong> 5º nível de rústico, treinado em Vontade.</p>

                        <p><strong>Crítico Brutal.</strong> Seu multiplicador de crítico com armas corpo a corpo e de arremesso aumenta em +1. Por exemplo, seu multiplicador com um machado de batalha, normalmente x3, será x4. <strong>Pré-requisito:</strong> 6º nível de rústico.</p>

                        <p><strong>Crítico Absoluto.</strong> Quando estiver em estado de Fúria, você pode gastar 6 PM para conseguir um resultado crítico. Ao final do ataque, você perde o estado de fúria e fica alquebrado até o final da cena. <strong>Pré-requisito:</strong> 16º nível de rústico.</p>

                        <p><strong>Destruidor.</strong> Quando causa dano com uma arma corpo a corpo de duas mãos, você pode rolar novamente qualquer resultado 1 ou 2 das rolagens de dano da arma. <strong>Pré-requisito:</strong> For 1.</p>

                        <p><strong>Espírito Inquebrável.</strong> Enquanto está em fúria, você não fica inconsciente por estar com 0 PV ou menos. Você ainda morre se chegar a um valor negativo igual à metade de seus PV máximos. <strong>Pré-requisito:</strong> Alma de Bronze.</p>

                        <p><strong>Esquiva Sobrenatural.</strong> Seus instintos são tão apurados que você consegue reagir ao perigo antes que seus sentidos percebam. Você nunca fica surpreendido.</p>

                        <p><strong>Estatura Gigantesca.</strong> Quando você entra em estado de fúria, consegue usar armas para um tamanho maior que o seu, aumentando seu dano em um passo, sem as penalidades previstas. <strong>Pré-requisitos:</strong> 10º nível de rústico, For 2.</p>

                        <p><strong>Estatura Titânica.</strong> Igual a Estatura Gigantesca, mas você aumenta o seu tamanho em dois passos. <strong>Pré-requisitos:</strong> 14º nível de rústico, Estatura Gigantesca.</p>

                        <p><strong>Força Indomável.</strong> Você pode gastar 1 PM para somar seu nível em um teste de Força ou Atletismo. Você pode usar esta habilidade depois de rolar o dado, mas deve usá-la antes de o mestre dizer se você passou ou não.</p>

                        <p><strong>Frenesi.</strong> Uma vez por rodada, se estiver em fúria e usar a ação agredir para fazer um ataque corpo a corpo ou com uma arma de arremesso, você pode gastar 2 PM para fazer um ataque adicional.</p>

                        <p><strong>Fulgor Controlado.</strong> Quando está em estado de Fúria, você pode gastar 2 PM para rolar novamente os dados em um teste no qual não tenha passado. Você recebe um bônus de +2 nessa nova rolagem e sai do estado de Fúria.</p>

                        <p><strong>Fúria Bestial.</strong> O sangue de feras corre em suas veias. Quando entra em fúria, você recebe uma arma natural de mordida, com dano 1d6, crítico x2 e perfuração. Uma vez por rodada, quando usa a ação agredir para atacar com outra arma, pode gastar 1 PM para fazer um ataque corpo a corpo extra com a mordida. Se você já possui uma arma natural de mordida, o dano dela aumenta em dois passos.</p>

                        <p><strong>Fúria Contagiosa.</strong> Quando ativar sua fúria, você pode gastar 5 PM extras para compartilhar metade dos seus bônus de Fúria com todos os seus aliados que desejarem. <strong>Pré-requisitos:</strong> 16º nível de rústico, Inspirar Fúria.</p>

                        <p><strong>Fúria Espiritual.</strong> Quando entra em estado de fúria, seus ataques são considerados mágicos e capazes de atingir criaturas incorpóreas.</p>

                        <p><strong>Fúria do Sertão.</strong> Seu deslocamento aumenta em +3m. Quando usa Fúria, você aplica o bônus em ataque e dano também a armas de arremesso.</p>

                        <p><strong>Fúria Raivosa.</strong> Se sua Fúria for terminar por você não ter atacado nem sido alvo de um efeito hostil, você pode pagar 1 PM para continuar em fúria nesta rodada. Se você atacar ou for atacado na rodada seguinte, sua fúria continua normalmente.</p>

                        <p><strong>Furor Oculto.</strong> Os bônus de Fúria dobram quando você está com metade ou menos de seus PV totais.</p>

                        <p><strong>Golpe Poderoso.</strong> Ao acertar um ataque corpo a corpo, você pode gastar 1 PM para causar um dado de dano extra do mesmo tipo. Por exemplo, com um montante, causa +1d6, para um dano total de 3d6; com um machado de guerra, causa +1d12, para um dano total de 2d12.</p>

                        <p><strong>Inspirar Fúria.</strong> Como ação de movimento, você pode gastar a quantidade de PM necessária para ativar a Fúria e conceder os bônus dela para um aliado próximo.</p>

                        <p><strong>Ímpeto.</strong> Você pode gastar 1 PM para aumentar seu deslocamento em +6m por uma rodada.</p>

                        <p><strong>Impulso Súbito.</strong> Você pode gastar uma ação de movimento e 2 PM para saltar uma altura de 10m para cada ponto de Força e cair em uma distância igual ao dobro do seu deslocamento sem sofrer dano de queda. Se ativar esse poder durante uma queda, ele funciona como a magia Queda Suave. <strong>Pré-requisitos:</strong> Ímpeto, 4º nível de rústico.</p>

                        <p><strong>Investida Imprudente.</strong> Quando faz uma investida, você pode aumentar sua penalidade em Defesa pela investida para –5 a fim de receber um bônus de +1d12 na rolagem de dano deste ataque.</p>

                        <p><strong>Ira dos Ancestrais.</strong> Quando estiver em estado de fúria, você pode, como uma ação padrão, gastar 6 PM para invocar um parceiro Fortão Veterano até o final da sua Fúria. Por +2 PM, o parceiro se torna Fortão Mestre. <strong>Pré-requisitos:</strong> 8º nível de rústico, Fúria Espiritual.</p>

                        <p><strong>Momento de Clareza.</strong> Enquanto estiver em Fúria, você pode gastar 1 PM para realizar ações que exijam calma e concentração por 1 turno, sem sair do estado de Fúria.</p>

                        <p><strong>Opressão Brutal.</strong> Quando estiver em fúria, você pode gastar 3 PM para usar a manobra agarrar e esmagar o alvo, causando 2d6 + Força de dano de impacto. <strong>Pré-requisitos:</strong> treinado em Luta, 4º nível de rústico.</p>

                        <p><strong>Pisão Sísmico.</strong> Você é capaz de usar a magia Terremoto. Caso aprenda novamente essa magia, o custo diminui em –1 PM. <strong>Pré-requisito:</strong> 16º nível de rústico.</p>

                        <p><strong>Pele de Aço.</strong> O bônus de Pele de Ferro aumenta para +8. <strong>Pré-requisitos:</strong> Pele de Ferro, 8º nível de rústico.</p>

                        <p><strong>Pele de Ferro.</strong> Você recebe +4 na Defesa, mas apenas se não estiver usando armadura pesada.</p>

                        <p><strong>Proteção dos Ancestrais.</strong> Sempre que você ativar a fúria dos espíritos como ação livre, pode gastar 2 PM e receber +4 contra ataques à distância. <strong>Pré-requisito:</strong> Fúria Espiritual.</p>

                        <p><strong>Rugido Primal.</strong> Você pode gastar uma ação de movimento e 1 PM para soltar um berro feroz. Todos os inimigos em alcance curto ficam vulneráveis até o fim da cena.</p>

                        <p><strong>Rugido Primal Aprimorado.</strong> Além dos efeitos de Rugido Primal, você pode pagar +2 PM para causar 2d6 pontos de dano mental não letal e deixar a vítima abalada. Um teste de Vontade contra CD Intimidação reduz o dano à metade e nega o efeito abalado. Se a criatura for reduzida a 0 ou menos PV, em vez de cair inconsciente, ela fica apavorada e foge de você da maneira mais eficiente possível. <strong>Pré-requisitos:</strong> 10º nível de rústico, Rugido Primal.</p>

                        <p><strong>Sangue dos Inimigos.</strong> Enquanto está em fúria, quando faz um acerto crítico ou reduz um inimigo a 0 PV, você recebe um bônus cumulativo de +1 em testes de ataque e rolagens de dano, limitado pelo seu nível, até o fim da cena.</p>

                        <p><strong>Superstição.</strong> Você odeia e rejeita o sobrenatural. Você recebe resistência a magia +5.</p>

                        <p><strong>Tornado de Dor.</strong> Você pode gastar uma ação padrão e 2 PM para desferir uma série de golpes giratórios. Faça um ataque corpo a corpo e compare-o com a Defesa de cada inimigo em seu alcance natural. Então, faça uma rolagem de dano com um bônus cumulativo de +2 para cada acerto e aplique-a em cada inimigo atingido. <strong>Pré-requisito:</strong> 6º nível de rústico.</p>

                        <p><strong>Totem Espiritual.</strong> Você soma sua Sabedoria ao seu total de pontos de mana e possui um animal totêmico. <strong>Pré-requisitos:</strong> Sab 1, 4º nível de rústico.</p>

                        <p><strong>Vigor Primal.</strong> Você pode gastar uma ação de movimento e uma quantidade de PM limitada por sua Constituição. Para cada PM gasto, você recupera 1d12 pontos de vida.</p>
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