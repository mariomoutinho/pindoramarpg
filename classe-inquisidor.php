<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Inquisidor - Pindorama RPG</title>

    <link rel="stylesheet" href="assets/css/ficha.css" />
    <link rel="stylesheet" href="assets/css/classes.css?v=20260513a" />
</head>

<body>
    <main class="page-wrapper classes-page">

        <header class="top-actions classes-topbar">
            <div>
                <h1>Inquisidor</h1>
                <p>Classe dedicada à honra, à ordem, à fé, à autoridade e ao combate disciplinado em nome de um juramento.</p>
            </div>

            <div class="actions">
                <a class="system-link-btn" href="index.php">Menu</a>
                <a class="system-link-btn" href="classes.php">Classes</a>
                <a class="system-link-btn" href="ficha.php">Ficha</a>
            </div>
        </header>

        <?php
            $cb_class_slug = 'inquisidor';
            $cb_class_name = 'Inquisidor';
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
                        <a class="toc-link toc-level-2" href="#tabela-inquisidor">O Inquisidor</a>
                        <a class="toc-link toc-level-2" href="#codigo-heroi">Código do Herói</a>
                        <a class="toc-link toc-level-2" href="#montaria-sagrada">Montaria Sagrada</a>
                        <a class="toc-link toc-level-2" href="#imposicoes">Imposições</a>
                        <a class="toc-link toc-level-2" href="#poderes">Poderes de Inquisidor</a>
                    </nav>
                </div>
            </aside>

            <article class="sheet classes-content" id="classesContent">

                <section id="descricao" class="content-section">
                    <h2>Inquisidor</h2>

                    <p>
                        Os inquisidores são combatentes honrados, campeões de uma ordem, soldados divinos ou representantes
                        de uma autoridade maior. Muitas vezes formais, grandiosos e até arrogantes, carregam a responsabilidade
                        de honrar sua linhagem, sua fé, seu brasão, sua ordem ou a tradição que os consagrou.
                    </p>

                    <p>
                        Costumam ter vínculos com líderes políticos, religiosos ou militares das sociedades que servem,
                        sejam reis, caciques, altos sacerdotes, chefes de ordem ou representantes de poderes instituídos.
                        Por isso, ocupam um posto acima do povo comum, o que pode significar proteção e liderança, mas também
                        opressão e crueldade.
                    </p>

                    <p>
                        Existem basicamente dois arquétipos de inquisidores. Alguns combatem a tirania do mundo, servindo
                        a deuses ou líderes benevolentes, recebendo poder sagrado para enfrentar vilões e proteger inocentes.
                        Outros atuam como algozes e ceifadores, disseminando medo, caos e violência em nome de sua ordem.
                    </p>

                    <p>
                        Independentemente de seu alinhamento moral, a lealdade dos inquisidores é inquestionável. Eles ostentam
                        com orgulho o brasão de seu senhor, o símbolo de sua ordem ou a marca de sua fé em escudos, estandartes,
                        armaduras e juramentos.
                    </p>

                    <p>
                        Receber o título de inquisidor não é uma decisão arbitrária. O processo costuma envolver treinamento rígido,
                        serviço como escudeiro, disciplina marcial e uma cerimônia de consagração diante de uma autoridade nobre,
                        religiosa ou militar.
                    </p>

                    <p>
                        Embora possam considerar-se superiores, o verdadeiro ideal da ordem envolve servidão. O inquisidor deve
                        estar sempre disponível para cumprir os mandatos de seu senhor, defender sua fé ou atender aos interesses
                        de sua ordem.
                    </p>

                    <p>
                        A nobreza compõe grande parte dos inquisidores, mas esse caminho não é exclusivo dos aristocratas.
                        Plebeus podem ser agraciados com o título por feitos heroicos, demonstrações de poder ou interesse
                        dos grandes senhores. Seja qual for sua origem, o inquisidor é uma muralha de aço e coragem que inspira
                        valentia em seus aliados e incute temor em seus adversários.
                    </p>
                </section>

                <section id="caracteristicas" class="content-section">
                    <h2>Características de Classe</h2>

                    <div class="class-power-block">
                        <p>
                            <strong>Pontos de Vida.</strong> Um inquisidor começa com
                            <strong>20 pontos de vida + Constituição</strong> e ganha
                            <strong>5 PV + Constituição</strong> por nível.
                        </p>

                        <p><strong>Pontos de Mana.</strong> <strong>3 PM por nível.</strong></p>

                        <p>
                            <strong>Perícias.</strong> <strong>Luta (For)</strong> e <strong>Vontade (Sab)</strong>,
                            mais <strong>3</strong> à sua escolha entre
                            <strong>Adestramento (Car)</strong>, <strong>Atletismo (For)</strong>,
                            <strong>Cavalgar (Des)</strong>, <strong>Cura (Sab)</strong>,
                            <strong>Diplomacia (Car)</strong>, <strong>Fortitude (Con)</strong>,
                            <strong>Guerra (Int)</strong>, <strong>Iniciativa (Des)</strong>,
                            <strong>Intimidação (Car)</strong>, <strong>Intuição (Sab)</strong>,
                            <strong>Nobreza (Int)</strong>, <strong>Percepção (Sab)</strong>
                            e <strong>Religião (Sab)</strong>.
                        </p>

                        <p><strong>Proficiências.</strong> Armas marciais, armaduras pesadas e escudos.</p>
                    </div>
                </section>

                <section id="habilidades" class="content-section">
                    <h2>Habilidades de Classe</h2>

                    <div class="class-power-block">
                        <p>
                            <strong>Código de Honra.</strong> Inquisidores distinguem-se de meros combatentes por seguir um código
                            de conduta. Fazem isso para mostrar que estão acima dos mercenários e bandoleiros que infestam os campos
                            de batalha.
                        </p>

                        <p>
                            Você não pode atacar um oponente pelas costas, caído, desprevenido ou incapaz de lutar.
                            Em termos de jogo, você não pode se beneficiar do bônus de flanquear. Se violar o código,
                            perde todos os seus PM e só pode recuperá-los a partir do próximo dia.
                        </p>

                        <p>
                            <strong>Golpe do Juramento.</strong> Quando faz um ataque corpo a corpo, você pode gastar
                            <strong>2 PM</strong> para desferir um golpe destruidor. Você soma seu <strong>Carisma</strong>
                            no teste de ataque e causa <strong>+1d8</strong> na rolagem de dano. A cada quatro níveis,
                            pode gastar <strong>+1 PM</strong> para aumentar o dano em <strong>+1d8</strong>.
                        </p>

                        <p>
                            <strong>Baluarte.</strong> No <strong>2º nível</strong>, quando sofre um ataque ou faz um teste
                            de resistência, você pode gastar <strong>1 PM</strong> para receber <strong>+2 na Defesa</strong>
                            e nos testes de resistência até o início do seu próximo turno. A cada quatro níveis, pode gastar
                            +1 PM para aumentar o bônus em +2.
                        </p>

                        <p>
                            A partir do <strong>7º nível</strong>, quando usa esta habilidade, você pode gastar
                            <strong>2 PM adicionais</strong> para fornecer o mesmo bônus a todos os aliados adjacentes.
                            A partir do <strong>15º nível</strong>, pode gastar <strong>5 PM adicionais</strong> para fornecer
                            o mesmo bônus a todos os aliados em alcance curto.
                        </p>

                        <p>
                            <strong>Poder de Inquisidor.</strong> No <strong>2º nível</strong>, e a cada nível seguinte,
                            você recebe um poder de inquisidor à sua escolha.
                        </p>

                        <p>
                            <strong>Resoluto.</strong> A partir do <strong>11º nível</strong>, você pode gastar
                            <strong>1 PM</strong> para refazer um teste de resistência contra uma condição que esteja
                            afetando você, como abalado ou paralisado. O segundo teste recebe <strong>+5</strong> e,
                            se você passar, cancela o efeito. Você só pode usar esta habilidade uma vez por efeito.
                        </p>

                        <p>
                            <strong>Bravura Final.</strong> No <strong>20º nível</strong>, sua virtude vence a morte.
                            Se for reduzido a 0 ou menos PV, você pode gastar <strong>3 PM</strong> para continuar
                            consciente e de pé. Esta habilidade tem duração sustentada. Quando se encerra, você sofre
                            os efeitos de seus PV atuais, podendo cair inconsciente ou mesmo morrer.
                        </p>
                    </div>
                </section>

                <section id="tabela-inquisidor" class="content-section">
                    <h2>O Inquisidor</h2>

                    <div class="classes-table-wrap">
                        <table class="classes-table level-table">
                            <thead>
                                <tr>
                                    <th>Nível</th>
                                    <th>Habilidades de Classe</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr><td>1º</td><td>Código de honra, golpe do juramento</td></tr>
                                <tr><td>2º</td><td>Baluarte +2, poder de inquisidor</td></tr>
                                <tr><td>3º</td><td>Poder de inquisidor</td></tr>
                                <tr><td>4º</td><td>Poder de inquisidor</td></tr>
                                <tr><td>5º</td><td>Golpe do juramento (+2d8), poder de inquisidor</td></tr>
                                <tr><td>6º</td><td>Baluarte +4, poder de inquisidor</td></tr>
                                <tr><td>7º</td><td>Baluarte (aliados adjacentes), poder de inquisidor</td></tr>
                                <tr><td>8º</td><td>Poder de inquisidor</td></tr>
                                <tr><td>9º</td><td>Golpe do juramento (+3d8), poder de inquisidor</td></tr>
                                <tr><td>10º</td><td>Baluarte +6, poder de inquisidor</td></tr>
                                <tr><td>11º</td><td>Poder de inquisidor, resoluto</td></tr>
                                <tr><td>12º</td><td>Poder de inquisidor</td></tr>
                                <tr><td>13º</td><td>Golpe do juramento (+4d8), poder de inquisidor</td></tr>
                                <tr><td>14º</td><td>Baluarte +8, poder de inquisidor</td></tr>
                                <tr><td>15º</td><td>Baluarte (aliados em alcance curto), poder de inquisidor</td></tr>
                                <tr><td>16º</td><td>Poder de inquisidor</td></tr>
                                <tr><td>17º</td><td>Golpe do juramento (+5d8), poder de inquisidor</td></tr>
                                <tr><td>18º</td><td>Baluarte +10, poder de inquisidor</td></tr>
                                <tr><td>19º</td><td>Poder de inquisidor</td></tr>
                                <tr><td>20º</td><td>Bravura final, poder de inquisidor</td></tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section id="codigo-heroi" class="content-section">
                    <h2>Código do Herói</h2>

                    <div class="class-power-block">
                        <p>
                            <strong>Código do Herói.</strong> O poder Abençoado possui como pré-requisito um código de conduta
                            ainda mais rígido. Faltar com esse código faz você perder todos os PM até o próximo descanso.
                        </p>

                        <p>
                            Você deve sempre manter sua palavra e nunca pode recusar um pedido de ajuda de alguém inocente.
                            Além disso, nunca pode mentir, trapacear ou roubar. Se violar o código, perde todos os seus PM
                            e só pode recuperá-los a partir do próximo dia.
                        </p>
                    </div>
                </section>

                <section id="montaria-sagrada" class="content-section">
                    <h2>Montaria Sagrada</h2>

                    <div class="class-power-block">
                        <p>
                            <strong>Montaria Sagrada.</strong> Uma montaria sagrada é uma criatura mística ou abençoada
                            invocada pelo inquisidor. Ela serve como símbolo de sua autoridade, fé e força em combate.
                        </p>

                        <p>
                            Para invocá-la, você pode gastar uma ação de movimento e <strong>2 PM</strong>. A montaria permanece
                            à disposição conforme as regras do poder correspondente e pode assumir a forma adequada à tradição,
                            ordem ou divindade do inquisidor.
                        </p>
                    </div>
                </section>

                <section id="imposicoes" class="content-section">
                    <h2>Imposições</h2>

                    <div class="class-power-block">
                        <p>
                            <strong>Imposições.</strong> Alguns poderes de inquisidor são imposições. Esses poderes representam
                            ordens, juízos, repreensões ou manifestações de autoridade que o inquisidor lança contra seus inimigos
                            ou impõe sobre o campo de batalha.
                        </p>

                        <p>
                            Quando um poder for tratado como imposição, siga as regras específicas do próprio poder e as decisões
                            do mestre para resolver seus efeitos narrativos e mecânicos.
                        </p>
                    </div>
                </section>

                <section id="poderes" class="content-section">
                    <h2>Poderes de Inquisidor</h2>

                    <div class="class-power-block">
                        <p><strong>Abençoado.</strong> Você soma seu Carisma ao seu total de pontos de mana. Além disso, recebe dois poderes concedidos por se tornar devoto, em vez de apenas um. Como alternativa, pode ser um inquisidor da justiça, lutando em prol da ordem como um todo. Nesse caso, não recebe nenhum poder concedido, mas não precisa seguir nenhuma Obrigação & Restrição além do Código do Herói. Cultuar a justiça conta como sua devoção. <strong>Pré-requisito:</strong> devoto de algum deus.</p>

                        <p><strong>Aura de Fé.</strong> Você pode gastar 1 PM para gerar uma aura com 9m de raio a partir de você, com duração sustentada. A aura emite uma luz dourada e agradável.</p>

                        <p><strong>Arma Sagrada.</strong> Quando usa Golpe do Juramento para atacar com a arma preferida de sua divindade, o dado de dano que você rola pelo Golpe do Juramento aumenta para d12. <strong>Pré-requisito:</strong> devoto de uma divindade, exceto Oxalá e Yéxua.</p>

                        <p><strong>Aumento de Atributo.</strong> Você recebe +1 em um atributo. Você pode escolher este poder várias vezes, mas apenas uma vez por patamar para um mesmo atributo.</p>

                        <p><strong>Aura Antimagia.</strong> Enquanto sua aura estiver ativa, você e os aliados dentro da aura podem rolar novamente qualquer teste de resistência contra magia recém realizado. <strong>Pré-requisitos:</strong> Aura de Fé, 14º nível de inquisidor.</p>

                        <p><strong>Aura Ardente.</strong> Enquanto sua aura estiver ativa, no início de cada um de seus turnos, espíritos e mortos-vivos à sua escolha dentro dela sofrem dano de luz igual a 5 + seu Carisma. <strong>Pré-requisitos:</strong> Aura de Fé, 10º nível de inquisidor.</p>

                        <p><strong>Aura de Cura.</strong> Enquanto sua aura estiver ativa, no início de seus turnos, você e os aliados à sua escolha dentro dela curam uma quantidade de PV igual a 5 + seu Carisma. <strong>Pré-requisitos:</strong> Aura de Fé, 6º nível de inquisidor.</p>

                        <p><strong>Aura de Invencibilidade.</strong> Enquanto sua aura estiver ativa, você ignora o primeiro dano que sofrer na cena. O mesmo se aplica a seus aliados dentro da aura. <strong>Pré-requisitos:</strong> Aura de Fé, 18º nível de inquisidor.</p>

                        <p><strong>Aura Poderosa.</strong> O raio da sua aura aumenta para 30m. <strong>Pré-requisitos:</strong> Aura de Fé, 6º nível de inquisidor.</p>

                        <p><strong>Armadura Brilhante.</strong> Você pode usar seu Carisma na Defesa quando usa armadura pesada. Se fizer isso, não pode somar sua Destreza, mesmo que outras habilidades ou efeitos permitam isso. <strong>Pré-requisitos:</strong> Aura de Fé, 8º nível de inquisidor.</p>

                        <p><strong>Bastião.</strong> Se estiver usando armadura pesada, você recebe redução de dano 5, cumulativa com a RD fornecida por Especialização em Armadura. <strong>Pré-requisito:</strong> 5º nível de inquisidor.</p>

                        <p><strong>Comandante.</strong> Quando você usa o poder Estrategista, aliados direcionados recebem 1d4 PM temporários. Esses PM duram até o fim do turno do aliado e não podem ser usados em efeitos que concedam PM. <strong>Pré-requisitos:</strong> Estrategista, 12º nível de inquisidor.</p>

                        <p><strong>Cura pelas Mãos.</strong> Você aprende e pode lançar Curar Ferimentos com todos os aprimoramentos, se tiver os PM necessários. Caso aprenda novamente essa magia, seu custo diminui em –1 PM. <strong>Pré-requisito:</strong> Abençoado.</p>

                        <p><strong>Desprezar os Covardes.</strong> Você recebe redução de dano 5 se estiver caído, desprevenido ou flanqueado.</p>

                        <p><strong>Duelo.</strong> Você pode gastar 2 PM para escolher um oponente em alcance curto e receber +2 em testes de ataque e rolagens de dano contra ele até o fim da cena. Se atacar outro oponente, o bônus termina. A cada cinco níveis, você pode gastar +1 PM para aumentar o bônus em +1.</p>

                        <p><strong>Educação Privilegiada.</strong> Você se torna treinado em duas perícias de nobre à sua escolha.</p>

                        <p><strong>Escudeiro.</strong> Você recebe os serviços de um escudeiro, um parceiro especial que cuida de seu equipamento. Suas armas fornecem +1 em rolagens de dano e sua armadura concede +1 na Defesa. Além disso, você pode pagar 1 PM para receber ajuda do escudeiro em combate. Você recebe uma ação de movimento que pode usar para se levantar, sacar um item ou trazer sua montaria. O escudeiro não conta em seu limite de parceiros. Caso ele morra, você pode treinar outro com um mês de trabalho.</p>

                        <p><strong>Égide Sagrada.</strong> Você pode gastar uma ação de movimento e 2 PM para recobrir seu escudo com energia sagrada. Enquanto estiver empunhando esse escudo, ele manifesta a força de sua ordem ou divindade, reforçando sua proteção conforme a decisão do mestre e os efeitos combinados com sua build.</p>

                        <p><strong>Estrategista.</strong> Você pode usar sua autoridade e visão de batalha para orientar aliados em combate, direcionando ações, aberturas e reposicionamentos conforme a situação. Este poder serve como base para outros poderes de comando, como Comandante.</p>

                        <p><strong>Guardião.</strong> Você recebe treinamento para proteger aliados, manter posição e servir como muralha entre seus companheiros e o perigo. Este poder também pode servir como pré-requisito para poderes ligados a auxiliares e pajens.</p>

                        <p><strong>Montaria.</strong> Você recebe um cavalo de guerra com o qual possui +5 em testes de Adestramento e Cavalgar. Ele fornece os benefícios de um parceiro veterano de seu tipo. Caso a montaria morra, você pode comprar outra pelo preço normal e treiná-la para receber os benefícios desta habilidade com uma semana de trabalho.</p>

                        <p><strong>Montaria Aprimorada.</strong> Sua montaria passa a fornecer os benefícios de um parceiro mestre. De acordo com o mestre, você pode receber outro tipo de montaria. <strong>Pré-requisitos:</strong> 11º nível de inquisidor, Montaria.</p>

                        <p><strong>Montaria Corajosa.</strong> Sua montaria concede +1d6 em rolagens de dano corpo a corpo, cumulativo com qualquer bônus que ela já forneça como parceiro. <strong>Pré-requisito:</strong> Montaria ou Montaria Sagrada.</p>

                        <p><strong>Montaria Sagrada.</strong> Você pode gastar uma ação de movimento e 2 PM para invocar uma montaria sagrada. <strong>Pré-requisitos:</strong> 5º nível de inquisidor, Abençoado.</p>

                        <p><strong>Orar.</strong> Você aprende e pode lançar uma magia divina de 1º círculo à sua escolha. Seu atributo-chave para esta magia é Carisma. Você pode escolher este poder quantas vezes quiser. <strong>Pré-requisito:</strong> Abençoado.</p>

                        <p><strong>Pajem.</strong> Você recebe os serviços de um pajem, um parceiro que o auxilia em pequenos afazeres. Você recebe +2 em Diplomacia, por estar sempre aprumado, e sua condição de descanso é uma categoria acima do padrão pela situação. O pajem pode executar pequenas tarefas, como entregar mensagens e comprar itens, e não conta em seu limite de parceiros. Caso ele morra, você pode treinar outro com uma semana de trabalho. <strong>Pré-requisito:</strong> Guardião.</p>
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