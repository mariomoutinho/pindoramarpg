<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Caçador - Pindorama RPG</title>

    <link rel="stylesheet" href="assets/css/ficha.css" />
    <link rel="stylesheet" href="assets/css/classes.css?v=20260513a" />
</head>

<body>
    <main class="page-wrapper classes-page">

        <header class="top-actions classes-topbar">
            <div>
                <h1>Caçador</h1>
                <p>Classe dedicada à sobrevivência, à exploração, ao rastreio e à eliminação de ameaças nas fronteiras de Pindorama.</p>
            </div>

            <div class="actions">
                <a class="system-link-btn" href="index.php">Menu</a>
                <a class="system-link-btn" href="classes.php">Classes</a>
                <a class="system-link-btn" href="ficha.php">Ficha</a>
            </div>
        </header>

        <?php
            $cb_class_slug = 'cacador';
            $cb_class_name = 'Caçador';
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
                        <a class="toc-link toc-level-2" href="#tabela-cacador">Tabela 1-6: O Caçador</a>
                        <a class="toc-link toc-level-2" href="#armadilhas">Armadilhas</a>
                        <a class="toc-link toc-level-2" href="#companheiro-animal">Companheiro Animal</a>
                        <a class="toc-link toc-level-2" href="#poderes">Poderes de Caçador</a>
                    </nav>
                </div>
            </aside>

            <article class="sheet classes-content" id="classesContent">

                <section id="descricao" class="content-section">
                    <h2>Caçador</h2>

                    <p>
                        Os caçadores emergem como protetores das fronteiras da civilização, agindo como uma barreira defensiva
                        contra os avanços de criaturas monstruosas e contra os perigos que surgem nas terras desconhecidas.
                        Sua especialidade está na arte de rastrear, caçar e neutralizar ameaças que ousam se aproximar dos
                        povos de Pindorama ou que foram designadas para serem eliminadas.
                    </p>

                    <p>
                        Em harmonia com os ritmos naturais, os caçadores também dominam forças conectadas à terra, ao vento
                        e às águas, canalizando o poder da natureza para enfrentar o desconhecido. A imagem comum do caçador
                        com vestimenta de couro, arco e flecha, é apenas uma visão superficial de uma diversidade muito maior.
                    </p>

                    <p>
                        Assim como a própria natureza, caçadores adotam estratégias variadas. Alguns são silenciosos como sombras,
                        preferindo astúcia em vez de força bruta. Outros são selvagens e impetuosos, investindo com fervor.
                        Há ainda aqueles que preferem táticas evasivas, usando artifícios, armadilhas e domínio do terreno para
                        virar o rumo da batalha.
                    </p>

                    <p>
                        Num mundo onde criaturas bestiais ameaçam a paz, os caçadores surgem como defensores incansáveis.
                        Muitos se veem como inimigos naturais dessas criaturas, protegendo os inocentes que seriam suas presas.
                        Outros, de modo paradoxal, admiram a majestade selvagem dos monstros, reconhecendo uma beleza sobrenatural
                        mesmo em suas formas mais temíveis.
                    </p>

                    <p>
                        Essas figuras ambíguas não se limitam a caçar monstros míticos. Também perseguem zumbis, oiáras, angaris
                        e criaturas inteligentes, atuando como caçadores de recompensas, vigilantes, guias, exploradores ou espiões.
                        A vida nas terras selvagens moldou os caçadores em sobreviventes natos, independentes e preparados para
                        confrontar o desconhecido.
                    </p>
                </section>

                <section id="caracteristicas" class="content-section">
                    <h2>Características de Classe</h2>

                    <div class="class-power-block">
                        <p><strong>Pontos de Vida.</strong> Um caçador começa com <strong>8 pontos de vida + Constituição</strong> e ganha <strong>4 PV + Constituição</strong> por nível.</p>

                        <p><strong>Pontos de Mana.</strong> <strong>3 PM por nível.</strong></p>

                        <p>
                            <strong>Perícias.</strong> <strong>Luta (For)</strong> ou <strong>Pontaria (Des)</strong>,
                            <strong>Sobrevivência (Sab)</strong>, mais <strong>5</strong> à sua escolha entre
                            <strong>Adestramento (Car)</strong>, <strong>Atletismo (For)</strong>, <strong>Cavalgar (Des)</strong>,
                            <strong>Cura (Sab)</strong>, <strong>Fortitude (Con)</strong>, <strong>Furtividade (Des)</strong>,
                            <strong>Iniciativa (Des)</strong>, <strong>Investigação (Int)</strong>, <strong>Luta (For)</strong>,
                            <strong>Ofício (Int)</strong>, <strong>Percepção (Sab)</strong>, <strong>Pontaria (Des)</strong>
                            e <strong>Reflexos (Des)</strong>.
                        </p>

                        <p><strong>Proficiências.</strong> Armas marciais e escudo.</p>
                    </div>
                </section>

                <section id="habilidades" class="content-section">
                    <h2>Habilidades de Classe</h2>

                    <div class="class-power-block">
                        <p>
                            <strong>Marca da Presa.</strong> Você pode gastar uma ação de movimento e <strong>1 PM</strong>
                            para analisar uma criatura em alcance curto. Até o fim da cena, você recebe <strong>+1d4</strong>
                            nas rolagens de dano contra essa criatura. A cada quatro níveis, você pode gastar <strong>+1 PM</strong>
                            para aumentar o bônus de dano, conforme indicado na tabela da classe.
                        </p>

                        <p>
                            <strong>Rastreador.</strong> Você recebe o dobro de bônus de treinamento em
                            <strong>Sobrevivência</strong> e pode se mover com seu deslocamento normal enquanto rastreia.
                        </p>

                        <p>
                            <strong>Poder de Caçador.</strong> No <strong>2º nível</strong>, e a cada nível seguinte,
                            você recebe um poder de caçador à sua escolha.
                        </p>

                        <p>
                            <strong>Explorador.</strong> No <strong>3º nível</strong>, escolha um tipo de terreno entre
                            ártico, colina, deserto, floresta, montanha, pântano, planície, subterrâneo ou urbano.
                            Quando estiver no tipo de terreno escolhido, você soma sua <strong>Sabedoria</strong>
                            — mínimo +1 — na Defesa e nos testes de Acrobacia, Atletismo, Furtividade, Percepção
                            e Sobrevivência.
                        </p>

                        <p>
                            A cada quatro níveis, escolha outro tipo de terreno para receber o bônus ou aumente em +2
                            o bônus em um tipo de terreno já escolhido.
                        </p>

                        <p>
                            <strong>Caminho do Explorador.</strong> No <strong>5º nível</strong>, você pode atravessar
                            terrenos difíceis sem sofrer redução em seu deslocamento, a CD para rastrear você aumenta em +10
                            e seu deslocamento aumenta em <strong>+3m</strong>. Esta habilidade só funciona em terrenos
                            nos quais você tenha a habilidade Explorador.
                        </p>

                        <p>
                            <strong>Mestre Caçador.</strong> No <strong>20º nível</strong>, você pode usar
                            <strong>Marca da Presa</strong> como uma ação livre. Além disso, quando usa a habilidade,
                            pode gastar <strong>5 PM</strong> para aumentar sua margem de ameaça contra a criatura em +2.
                            Se você reduz uma criatura marcada a 0 pontos de vida, recupera <strong>5 PM</strong>.
                        </p>
                    </div>
                </section>

                <section id="tabela-cacador" class="content-section">
                    <h2>Tabela 1-6: O Caçador</h2>

                    <div class="classes-table-wrap">
                        <table class="classes-table level-table">
                            <thead>
                                <tr>
                                    <th>Nível</th>
                                    <th>Habilidades de Classe</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr><td>1º</td><td>Marca da presa +1d4, rastreador</td></tr>
                                <tr><td>2º</td><td>Poder de caçador</td></tr>
                                <tr><td>3º</td><td>Explorador, poder de caçador</td></tr>
                                <tr><td>4º</td><td>Poder de caçador</td></tr>
                                <tr><td>5º</td><td>Caminho do explorador, marca da presa +1d8, poder de caçador</td></tr>
                                <tr><td>6º</td><td>Poder de caçador</td></tr>
                                <tr><td>7º</td><td>Explorador, poder de caçador</td></tr>
                                <tr><td>8º</td><td>Poder de caçador</td></tr>
                                <tr><td>9º</td><td>Marca da presa +1d12, poder de caçador</td></tr>
                                <tr><td>10º</td><td>Poder de caçador</td></tr>
                                <tr><td>11º</td><td>Explorador, poder de caçador</td></tr>
                                <tr><td>12º</td><td>Poder de caçador</td></tr>
                                <tr><td>13º</td><td>Marca da presa +2d8, poder de caçador</td></tr>
                                <tr><td>14º</td><td>Poder de caçador</td></tr>
                                <tr><td>15º</td><td>Explorador, poder de caçador</td></tr>
                                <tr><td>16º</td><td>Poder de caçador</td></tr>
                                <tr><td>17º</td><td>Marca da presa +2d10, poder de caçador</td></tr>
                                <tr><td>18º</td><td>Poder de caçador</td></tr>
                                <tr><td>19º</td><td>Explorador, poder de caçador</td></tr>
                                <tr><td>20º</td><td>Mestre Caçador, poder de caçador</td></tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section id="armadilhas" class="content-section">
                    <h2>Armadilhas</h2>

                    <div class="class-power-block">
                        <p><strong>Regras Gerais.</strong> Poderes de armadilha compartilham algumas regras. Preparar uma armadilha gasta uma ação completa e <strong>3 PM</strong>.</p>

                        <p><strong>Área.</strong> Uma armadilha afeta uma área de <strong>3m de lado</strong> adjacente a você e é acionada pela primeira criatura que entrar na área.</p>

                        <p><strong>Materiais.</strong> Você não precisa de nenhum item específico para criar a armadilha, pois usa materiais naturais, como galhos, cipós, entulhos ou objetos do ambiente. Porém, precisa estar em um ambiente propício.</p>

                        <p><strong>Veneno.</strong> É possível aplicar veneno a uma armadilha como se ela fosse uma arma.</p>

                        <p><strong>Percepção da Armadilha.</strong> Uma criatura que veja você preparando a armadilha saberá que ela está ali. Uma criatura que não veja pode encontrá-la gastando uma ação padrão para procurar e passando em um teste de Investigação contra CD Sab.</p>
                    </div>
                </section>

                <section id="companheiro-animal" class="content-section">
                    <h2>Companheiro Animal</h2>

                    <div class="class-power-block">
                        <p>
                            <strong>Companheiro Animal.</strong> Um companheiro animal é um amigo valoroso e fiel.
                            Você decide de qual espécie ele é. Vocês têm um vínculo mental, sendo capazes de entender
                            um ao outro. Seu companheiro obedece a você, mesmo que isso coloque a própria vida em risco.
                        </p>

                        <p>
                            Em termos de jogo, seu companheiro animal é um parceiro ajudante, assassino, atirador,
                            combatente, fortão, guardião, perseguidor ou montaria, no nível iniciante.
                            No <strong>7º nível</strong>, ele muda para veterano e, no <strong>15º nível</strong>, para mestre.
                        </p>

                        <p>
                            Se o companheiro animal morrer, você fica atordoado por uma rodada. Você pode invocar um novo
                            companheiro após um dia inteiro de prece e meditação.
                        </p>
                    </div>
                </section>

                <section id="poderes" class="content-section">
                    <h2>Poderes de Caçador</h2>

                    <div class="class-power-block">
                        <p><strong>Ambidestria.</strong> Se estiver empunhando duas armas, e pelo menos uma delas for leve, e fizer a ação agredir, você pode fazer dois ataques, um com cada arma. Se fizer isso, sofre –2 em todos os testes de ataque até o seu próximo turno. <strong>Pré-requisito:</strong> Des 2.</p>

                        <p><strong>Armadilha: Arataca.</strong> A vítima sofre 1d6 pontos de dano de perfuração e fica agarrada. Uma criatura agarrada pode escapar com uma ação padrão e um teste de Força ou Acrobacia contra CD Sab.</p>

                        <p><strong>Armadilha Alquímica.</strong> Quando prepara uma armadilha, você pode gastar 1 PM e uma dose de preparado ou veneno. Se fizer isso, as criaturas afetadas pela armadilha também sofrem os efeitos desse item, sem direito a teste de resistência contra ele. <strong>Pré-requisito:</strong> Armadilheiro.</p>

                        <p><strong>Armadilha: Espinhos.</strong> A vítima sofre 3d6 pontos de dano de perfuração. Um teste de Reflexos contra CD Sab reduz o dano à metade.</p>

                        <p><strong>Armadilha: Laço.</strong> A vítima deve fazer um teste de Reflexos contra CD Sab. Se passar, fica caída. Se falhar, fica agarrada. Uma criatura agarrada pode se soltar com uma ação padrão e um teste de Força ou Acrobacia contra CD Sab.</p>

                        <p><strong>Armadilha Oportunista.</strong> Uma vez por rodada, quando acerta mais de um ataque corpo a corpo contra a mesma criatura, você pode gastar 3 PM e uma ação de movimento para preparar uma armadilha oportunista. No início de seu próximo turno, a criatura ativa a armadilha. <strong>Pré-requisito:</strong> Armadilheiro.</p>

                        <p><strong>Armadilha: Rede.</strong> Todas as criaturas na área ficam enredadas e não podem sair da área. Uma vítima pode se libertar com uma ação padrão e um teste de Força ou Acrobacia contra CD 25. A área ocupada pela rede é considerada terreno difícil.</p>

                        <p><strong>Armadilheiro.</strong> Você soma sua Sabedoria no dano e na CD de suas armadilhas. <strong>Pré-requisitos:</strong> um poder de armadilha, 5º nível de caçador.</p>

                        <p><strong>Arqueiro.</strong> Se estiver usando uma arma de ataque à distância, você soma sua Sabedoria nas rolagens de dano, limitado pelo seu nível. <strong>Pré-requisito:</strong> Sab 1.</p>

                        <p><strong>Atirador Arcano.</strong> Você aprende uma magia entre Bola de Fogo, Flecha Ácida ou Relâmpago, com atributo-chave Sabedoria. Para lançar essas magias, deve fazer um ataque com arma à distância, usar a munição e pagar seus custos em PM. <strong>Pré-requisitos:</strong> Imbuir Magia, 9º nível de caçador.</p>

                        <p><strong>Aumento de Atributo.</strong> Você recebe +1 em um atributo. Você pode escolher este poder várias vezes, mas apenas uma vez por patamar para um mesmo atributo.</p>

                        <p><strong>Avanço do Predador.</strong> Quando uma criatura marcada por sua Marca da Presa se afasta voluntariamente de você, você pode gastar uma reação e 2 PM para se mover na direção dela, até o limite de seu deslocamento. <strong>Pré-requisitos:</strong> Ímpeto, 6º nível de caçador.</p>

                        <p><strong>Ataque Arterial.</strong> Ao acertar um ataque furtivo, você gasta 1 PM e o alvo fica sangrando. <strong>Pré-requisitos:</strong> 4º nível de caçador, Sab 1.</p>

                        <p><strong>Bote.</strong> Se estiver empunhando duas armas e fizer uma investida, você pode pagar 1 PM para fazer um ataque adicional com sua arma secundária. <strong>Pré-requisitos:</strong> Ambidestria, 6º nível de caçador.</p>

                        <p><strong>Camuflagem.</strong> Você pode gastar 2 PM para se esconder mesmo sem camuflagem ou cobertura disponível. <strong>Pré-requisito:</strong> 6º nível de caçador.</p>

                        <p><strong>Chuva de Lâminas.</strong> Quando usa Ambidestria, você pode pagar 2 PM para fazer um ataque adicional com sua arma primária. <strong>Pré-requisitos:</strong> Des 4, Ambidestria, 12º nível de caçador.</p>

                        <p><strong>Companheiro Animal.</strong> Você recebe um companheiro animal. <strong>Pré-requisito:</strong> treinado em Adestramento.</p>

                        <p><strong>Defesa Hostil.</strong> Enquanto empunha uma lança com as duas mãos, você soma sua Sabedoria na Defesa, limitada pelo seu nível, contra oponentes que estejam a mais de 1,5m de você. <strong>Pré-requisito:</strong> Lanceiro.</p>

                        <p><strong>Disparo Distrator.</strong> Quando faz um ataque à distância contra um inimigo em alcance curto, ou médio se tiver Olho do Falcão, você pode gastar 1 PM. Se acertar, em vez de causar dano, deixa o alvo desprevenido contra o próximo ataque que ele sofrer até o próximo turno. <strong>Pré-requisito:</strong> Arqueiro.</p>

                        <p><strong>Disparo Retentor.</strong> Quando faz um ataque à distância contra um inimigo adjacente a uma superfície vertical, você pode gastar 1 PM. Se acertar, em vez de causar dano, deixa o alvo agarrado e imóvel. <strong>Pré-requisito:</strong> Arqueiro.</p>

                        <p><strong>Elo com a Natureza.</strong> Você soma sua Sabedoria ao seu total de pontos de mana e pode lançar a magia Caminhos da Natureza, com atributo-chave Sabedoria. <strong>Pré-requisitos:</strong> Sab 1, 3º nível de caçador.</p>

                        <p><strong>Elo com a Natureza Maior.</strong> Escolha uma magia entre Abençoar Alimentos, Acalmar Animal, Alarme, Aviso, Concentração de Combate, Detectar Ameaças, Orientação e Suporte Ambiental. Você aprende e pode lançar a magia escolhida, pagando seu custo normal em PM. <strong>Pré-requisito:</strong> Elo com a Natureza.</p>

                        <p><strong>Emboscar.</strong> Você pode gastar 1 PM para realizar uma ação padrão adicional em seu turno. Só pode usar este poder na primeira rodada de um combate. <strong>Pré-requisito:</strong> treinado em Furtividade.</p>

                        <p><strong>Empatia Selvagem.</strong> Você pode se comunicar com animais por meio de linguagem corporal e vocalizações. Pode usar Adestramento com animais para mudar atitude e pedir favores.</p>

                        <p><strong>Encurralar Presa.</strong> Se você acertar mais de um ataque corpo a corpo no mesmo turno contra um inimigo flanqueado e marcado por sua Marca da Presa, ele fica imóvel por 1 turno. Um teste de Vontade contra CD Sab evita.</p>

                        <p><strong>Ervas Curativas.</strong> Você pode gastar uma ação completa e uma quantidade de PM limitada por sua Sabedoria para aplicar ervas curativas em você ou em uma criatura adjacente. Para cada PM gasto, cura 2d6 PV ou remove uma condição envenenado. Só pode usar este poder uma vez por dia em uma mesma criatura.</p>

                        <p><strong>Escaramuça.</strong> Quando se move 6m ou mais, você recebe +2 na Defesa e Reflexos e +1d8 nas rolagens de dano de ataques corpo a corpo e à distância em alcance curto até o início de seu próximo turno. Não pode usar esta habilidade vestindo armadura pesada. <strong>Pré-requisitos:</strong> Des 2, 6º nível de caçador.</p>

                        <p><strong>Escaramuça Superior.</strong> Quando usa Escaramuça, seus bônus aumentam para +5 na Defesa e Reflexos e +1d12 em rolagens de dano. <strong>Pré-requisitos:</strong> Escaramuça, 12º nível de caçador.</p>

                        <p><strong>Espreitar.</strong> Quando usa Marca da Presa, você recebe +1 em testes de perícia contra a criatura marcada. Esse bônus aumenta em +1 para cada PM adicional gasto na habilidade e dobra com a habilidade Inimigo. Contra um alvo marcado, você pode adicionar sua Sabedoria nas rolagens de dano.</p>

                        <p><strong>Exímio Caçador.</strong> Você aprimora sua capacidade de observar, perseguir e abater presas, reforçando sua atuação como especialista em caça e sobrevivência.</p>

                        <p><strong>Explorador Marcial.</strong> Você pode usar Sobrevivência no lugar de Guerra para analisar terreno. Se estiver em um terreno escolhido pelo poder Explorador, pode lançar Primor Atlético como uma habilidade não mágica. <strong>Pré-requisitos:</strong> treinado em Percepção, 3º nível de caçador.</p>

                        <p><strong>Flecheiro.</strong> Você pode usar Sobrevivência no lugar de Ofício para fabricar flechas e virotes, e pode fabricar essas munições com até uma melhoria. <strong>Pré-requisito:</strong> 3º nível de caçador.</p>

                        <p><strong>Franco-atirador.</strong> Você recebe +2 na margem de ameaça com armas de ataque à distância contra alvos em distância média ou longa. <strong>Pré-requisitos:</strong> Arqueiro, 7º nível de caçador.</p>

                        <p><strong>Imbuir Magia.</strong> Você pode gastar uma quantidade de PM limitada por sua Sabedoria para adicionar 1d6 de dano elemental mágico à sua escolha em sua arma de ataque à distância. <strong>Pré-requisitos:</strong> Arqueiro, treinado em Misticismo, 5º nível de caçador.</p>

                        <p><strong>Incansável.</strong> Você pode gastar uma ação de movimento e 1 PM para receber 2d10 + Sab pontos de vida temporários. Os PV temporários desaparecem ao final da cena.</p>

                        <p><strong>Ímpeto.</strong> Você pode gastar 1 PM para aumentar seu deslocamento em +6m por uma rodada.</p>

                        <p><strong>Improvisar Munição.</strong> Quando está em terreno que permita criar armadilhas, você pode gastar 1 PM e uma ação de movimento para fabricar cinco virotes ou flechas com uma melhoria, exceto material especial. As munições duram até o fim da cena. <strong>Pré-requisito:</strong> Flecheiro.</p>

                        <p><strong>Inimigo de Criatura.</strong> Escolha um tipo de criatura entre animal, construto, espírito, monstro ou morto-vivo, ou duas raças humanoides. Quando usa Marca da Presa contra uma criatura do tipo ou raça escolhida, dobra os dados de bônus no dano. Você pode escolher este poder outras vezes para inimigos diferentes.</p>

                        <p><strong>Lâminas Guardiãs.</strong> Enquanto estiver empunhando duas armas, seus inimigos adjacentes sofrem penalidade em testes e na CD das habilidades contra você. <strong>Pré-requisitos:</strong> Ambidestria, 6º nível de caçador.</p>

                        <p><strong>Lanceiro.</strong> Você recebe +2 em testes de ataque e rolagens de dano com lanças. Além disso, se estiver empunhando uma lança com as duas mãos, seu dano aumenta em um passo e ela é considerada uma arma alongada.</p>

                        <p><strong>Luta às Cegas.</strong> Você tem percepção às cegas com alcance de 3m. Dentro desse alcance, pode perceber criaturas que não estejam sob cobertura total, mesmo se estiver cego ou na escuridão. Também pode perceber criaturas invisíveis nessa área, exceto se elas se esconderem com sucesso.</p>

                        <p><strong>Mãos de Curandeiro.</strong> Você recebe +2 em Cura e pode usar Ervas Curativas como uma ação de movimento. <strong>Pré-requisitos:</strong> treinado em Cura, Ervas Curativas.</p>

                        <p><strong>Mestre Armadilheiro.</strong> A CD de suas armadilhas aumenta em +2. Você pode gastar uma ação completa e 5 PM para preparar duas armadilhas ao mesmo tempo. <strong>Pré-requisitos:</strong> Armadilheiro, dois poderes de armadilha.</p>

                        <p><strong>Olhar Vigilante.</strong> Se estiver empunhando uma arma de ataque à distância, você pode gastar uma ação de movimento para entrar em estado vigilante. <strong>Pré-requisitos:</strong> treinado em Percepção, Arqueiro.</p>

                        <p><strong>Olho do Falcão.</strong> Você pode usar a habilidade Marca da Presa em criaturas em alcance longo.</p>

                        <p><strong>Pistoleiro.</strong> Você recebe proficiência com armas de fogo e +2 nas rolagens de dano com essas armas.</p>

                        <p><strong>Ponto Fraco.</strong> Quando usa Marca da Presa, seus ataques contra a criatura marcada recebem +2 na margem de ameaça. Esse bônus dobra com a habilidade Inimigo.</p>

                        <p><strong>Predador Solidário.</strong> Seu bônus para flanquear aumenta de +2 para +5 contra inimigos marcados por sua Marca da Presa.</p>

                        <p><strong>Sede de Sangue.</strong> Você recebe +5 em testes de ataque e em testes para rastrear contra alvos que estejam sangrando. <strong>Pré-requisito:</strong> 11º nível de caçador.</p>

                        <p><strong>Sempre Alerta.</strong> Você soma sua Sabedoria em testes de Iniciativa e não sofre penalidade em Defesa e Reflexos por estar desprevenido. <strong>Pré-requisito:</strong> treinado em Iniciativa.</p>

                        <p><strong>Tiro em Linha.</strong> Quando faz um ataque à distância com uma arma de disparo e reduz os pontos de vida do alvo para 0 ou menos, pode gastar 1 PM para fazer um ataque adicional contra outra criatura dentro do seu alcance e diretamente atrás do alvo original. <strong>Pré-requisito:</strong> Arqueiro.</p>

                        <p><strong>Último Sangue.</strong> Quando você ataca um alvo sangrando, seus ataques causam um dado de dano adicional do mesmo tipo da arma.</p>
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