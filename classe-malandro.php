<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Malandro - Pindorama RPG</title>

    <link rel="stylesheet" href="assets/css/ficha.css" />
    <link rel="stylesheet" href="assets/css/classes.css?v=20260513a" />
</head>

<body>
    <main class="page-wrapper classes-page">

        <header class="top-actions classes-topbar">
            <div>
                <h1>Malandro</h1>
                <p>Classe dedicada à furtividade, à esperteza, aos truques, à ladinagem e à arte de vencer sem bater de frente.</p>
            </div>

            <div class="actions">
                <a class="system-link-btn" href="index.php">Menu</a>
                <a class="system-link-btn" href="classes.php">Classes</a>
                <a class="system-link-btn" href="ficha.php">Ficha</a>
            </div>
        </header>

        <?php
            $cb_class_slug = 'malandro';
            $cb_class_name = 'Malandro';
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
                        <a class="toc-link toc-level-2" href="#tabela-malandro">O Malandro</a>
                        <a class="toc-link toc-level-2" href="#poderes">Poderes de Malandro</a>
                    </nav>
                </div>
            </aside>

            <article class="sheet classes-content" id="classesContent">

                <section id="descricao" class="content-section">
                    <h2>Malandro</h2>

                    <p>
                        Por que enfrentar um perigo se ele pode ser evitado com um pouco de furtividade?
                        Para que gastar horas com trabalho duro se é possível subtrair ouro de outra pessoa?
                        Para que uma luta sangrenta se ela pode ser vencida com uma boa mentira ou um ataque
                        pelas costas com uma adaga envenenada?
                    </p>

                    <p>
                        Os malandros são indivíduos espertos, discretos e perspicazes. Ágeis e oportunistas,
                        aproveitam as fraquezas dos oponentes para atingir seus objetivos. Sua versatilidade
                        lhes permite evitar perigos, superar desafios e obter vantagens onde outros enxergam
                        apenas obstáculos.
                    </p>

                    <p>
                        Reconhecidos por artimanhas enganosas, arrombamentos, disfarces, furtos e desarme de
                        armadilhas, os malandros prosperam no mundo das sombras. Enquanto outros heróis hesitam,
                        eles se infiltram silenciosamente, revelando soluções únicas para problemas que força bruta
                        nenhuma resolveria.
                    </p>

                    <p>
                        Suas ocupações variam desde ladrões de rua, espiões e contrabandistas até guarda-costas
                        de cortes reais, informantes, sedutores, chantagistas e assassinos furtivos. Alguns invadem
                        castelos, envenenam aristocratas inconvenientes ou espalham boatos capazes de derrubar uma corte.
                    </p>

                    <p>
                        Embora carreguem a fama de traidores ou covardes, muitos malandros compreendem profundamente
                        o valor de um grupo coeso de aventureiros. Em missões grandiosas, há sempre um lado sombrio
                        que exige menos brados de guerra e mais sutileza, astúcia e incursões silenciosas.
                    </p>

                    <p>
                        Com treinamento meticuloso, destreza quase sobrenatural e truques bem aplicados, os malandros
                        são peças essenciais em equipes de aventureiros, operando nas sombras, explorando oportunidades
                        e causando ataques devastadores quando seus inimigos menos esperam.
                    </p>
                </section>

                <section id="caracteristicas" class="content-section">
                    <h2>Características de Classe</h2>

                    <div class="class-power-block">
                        <p>
                            <strong>Pontos de Vida.</strong> Um malandro começa com
                            <strong>12 pontos de vida + Constituição</strong> e ganha
                            <strong>3 PV + Constituição</strong> por nível.
                        </p>

                        <p><strong>Pontos de Mana.</strong> <strong>4 PM por nível.</strong></p>

                        <p>
                            <strong>Perícias.</strong> <strong>Ladinagem (Des)</strong> e <strong>Reflexos (Des)</strong>,
                            mais <strong>7</strong> à sua escolha entre
                            <strong>Acrobacia (Des)</strong>, <strong>Atletismo (For)</strong>, <strong>Atuação (Car)</strong>,
                            <strong>Cavalgar (Des)</strong>, <strong>Conhecimento (Int)</strong>, <strong>Diplomacia (Car)</strong>,
                            <strong>Enganação (Car)</strong>, <strong>Furtividade (Des)</strong>, <strong>Iniciativa (Des)</strong>,
                            <strong>Intimidação (Car)</strong>, <strong>Intuição (Sab)</strong>, <strong>Investigação (Int)</strong>,
                            <strong>Jogatina (Car)</strong>, <strong>Luta (For)</strong>, <strong>Ofício (Int)</strong>,
                            <strong>Percepção (Sab)</strong>, <strong>Pilotagem (Des)</strong> e <strong>Pontaria (Des)</strong>.
                        </p>

                        <p><strong>Proficiências.</strong> Nenhuma.</p>
                    </div>
                </section>

                <section id="habilidades" class="content-section">
                    <h2>Habilidades de Classe</h2>

                    <div class="class-power-block">
                        <p>
                            <strong>Ataque Furtivo.</strong> Você sabe atingir os pontos vitais de inimigos distraídos.
                            Uma vez por rodada, quando atinge uma criatura desprevenida com um ataque corpo a corpo
                            ou em alcance curto, ou uma criatura que esteja flanqueada, você causa
                            <strong>1d6 pontos de dano extra</strong>.
                        </p>

                        <p>
                            A cada dois níveis, esse dano extra aumenta em <strong>+1d6</strong>. Uma criatura imune
                            a acertos críticos também é imune a ataques furtivos.
                        </p>

                        <p>
                            <strong>Especialista.</strong> Escolha um número de perícias treinadas igual à sua
                            <strong>Inteligência</strong>, exceto bônus temporários, com mínimo de 1. Ao fazer um teste
                            de uma dessas perícias, você pode gastar <strong>1 PM</strong> para dobrar seu bônus de treinamento.
                            Você não pode usar esta habilidade em testes de ataque.
                        </p>

                        <p>
                            <strong>Evasão.</strong> A partir do <strong>2º nível</strong>, quando sofre um efeito que permite
                            um teste de Reflexos para reduzir o dano à metade, você não sofre dano algum se passar.
                            Se falhar, sofre o dano normal. Esta habilidade exige liberdade de movimentos.
                        </p>

                        <p>
                            <strong>Poder de Malandro.</strong> No <strong>2º nível</strong>, e a cada nível seguinte,
                            você escolhe um dos poderes de malandro.
                        </p>

                        <p>
                            <strong>Esquiva Sobrenatural.</strong> No <strong>4º nível</strong>, seus instintos são tão apurados
                            que você consegue reagir ao perigo antes mesmo que seus sentidos percebam. Você nunca fica surpreendido.
                        </p>

                        <p>
                            <strong>Olhos nas Costas.</strong> A partir do <strong>8º nível</strong>, você consegue lutar contra
                            diversos inimigos como se fossem apenas um. Você não pode ser flanqueado.
                        </p>

                        <p>
                            <strong>Evasão Aprimorada.</strong> No <strong>10º nível</strong>, quando sofre um efeito que permite
                            um teste de Reflexos para reduzir o dano à metade, você não sofre dano algum se passar e sofre apenas
                            metade do dano se falhar. Esta habilidade exige liberdade de movimentos.
                        </p>

                        <p>
                            <strong>A Pessoa Certa para o Trabalho.</strong> No <strong>20º nível</strong>, você se torna um mestre
                            da malandragem. Ao fazer um ataque furtivo ou usar uma perícia da lista de malandro, você pode gastar
                            <strong>5 PM</strong> para receber <strong>+10</strong> no teste.
                        </p>
                    </div>
                </section>

                <section id="tabela-malandro" class="content-section">
                    <h2>O Malandro</h2>

                    <div class="classes-table-wrap">
                        <table class="classes-table level-table">
                            <thead>
                                <tr>
                                    <th>Nível</th>
                                    <th>Habilidades de Classe</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr><td>1º</td><td>Ataque furtivo +1d6, especialista</td></tr>
                                <tr><td>2º</td><td>Evasão, poder de malandro</td></tr>
                                <tr><td>3º</td><td>Ataque furtivo +2d6, poder de malandro</td></tr>
                                <tr><td>4º</td><td>Esquiva sobrenatural, poder de malandro</td></tr>
                                <tr><td>5º</td><td>Ataque furtivo +3d6, poder de malandro</td></tr>
                                <tr><td>6º</td><td>Poder de malandro</td></tr>
                                <tr><td>7º</td><td>Ataque furtivo +4d6, poder de malandro</td></tr>
                                <tr><td>8º</td><td>Olhos nas costas, poder de malandro</td></tr>
                                <tr><td>9º</td><td>Ataque furtivo +5d6, poder de malandro</td></tr>
                                <tr><td>10º</td><td>Evasão aprimorada, poder de malandro</td></tr>
                                <tr><td>11º</td><td>Ataque furtivo +6d6, poder de malandro</td></tr>
                                <tr><td>12º</td><td>Poder de malandro</td></tr>
                                <tr><td>13º</td><td>Ataque furtivo +7d6, poder de malandro</td></tr>
                                <tr><td>14º</td><td>Poder de malandro</td></tr>
                                <tr><td>15º</td><td>Ataque furtivo +8d6, poder de malandro</td></tr>
                                <tr><td>16º</td><td>Poder de malandro</td></tr>
                                <tr><td>17º</td><td>Ataque furtivo +9d6, poder de malandro</td></tr>
                                <tr><td>18º</td><td>Poder de malandro</td></tr>
                                <tr><td>19º</td><td>Ataque furtivo +10d6, poder de malandro</td></tr>
                                <tr><td>20º</td><td>A pessoa certa para o trabalho, poder de malandro</td></tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section id="poderes" class="content-section">
                    <h2>Poderes de Malandro</h2>

                    <div class="class-power-block">
                        <p><strong>Abertura Estratégica.</strong> Sempre que acertar um ataque furtivo, você pode gastar 2 PM para que aliados adjacentes possam realizar um ataque como reação.</p>

                        <p><strong>Abrigo Tático.</strong> Quando está sob cobertura, você pode gastar 2 PM para dobrar os bônus recebidos pela cobertura enquanto estiver protegido por ela.</p>

                        <p><strong>Acerto em Cheio.</strong> Sempre que você acertar um crítico, o alvo fica desprevenido contra seus próximos ataques até o final do próximo turno. <strong>Pré-requisito:</strong> 6º nível de malandro.</p>

                        <p><strong>Artimanha.</strong> Você pode gastar 6 PM para aumentar em 1 a margem de ameaça para o seu próximo ataque. Se acertar um crítico, recupera metade dos PM usados. <strong>Pré-requisito:</strong> 16º nível de malandro, Acerto em Cheio.</p>

                        <p><strong>Assassinar.</strong> Você pode gastar uma ação de movimento e 3 PM para analisar uma criatura em alcance curto. Até o fim de seu próximo turno, seu primeiro Ataque Furtivo que causar dano a ela tem seus dados de dano extras dobrados. <strong>Pré-requisito:</strong> 5º nível de malandro.</p>

                        <p><strong>Ataque Arterial.</strong> Ao acertar um ataque furtivo, você gasta 1 PM e o alvo fica sangrando. <strong>Pré-requisitos:</strong> 4º nível de malandro, Sab 1.</p>

                        <p><strong>Ataque Esviscerante.</strong> Ao acertar um ataque furtivo corpo a corpo, você pode gastar PM igual aos dados extras do seu ataque furtivo para aumentar o dano de sangramento em 1d6 para cada PM gasto. A CD para resistir ao sangramento também aumenta em +2 para cada PM gasto. <strong>Pré-requisito:</strong> 9º nível de malandro.</p>

                        <p><strong>Aumento de Atributo.</strong> Você recebe +1 em um atributo. Você pode escolher este poder várias vezes, mas apenas uma vez por patamar para um mesmo atributo.</p>

                        <p><strong>Bomba Improvisada.</strong> Você pode gastar 1 PM e uma ação de movimento para transformar vinte balas em uma bomba acesa. <strong>Pré-requisito:</strong> treinado em Ofício (alquimia).</p>

                        <p><strong>Camaleão.</strong> Se possuir um estojo de disfarces, você pode lançar Disfarce Ilusório, pagando seu custo normal em PM. Esta não é considerada uma habilidade mágica e vem de sua habilidade extraordinária com disfarces. <strong>Pré-requisitos:</strong> Car 1, treinado em Enganação.</p>

                        <p><strong>Contatos no Submundo.</strong> Você conhece pessoas perigosas, informantes, atravessadores e figuras discretas. Pode usar sua rede de contatos para conseguir informações, favores ou acesso a recursos ilegais, conforme decisão do mestre.</p>

                        <p><strong>Distração Cruel.</strong> Quando um inimigo estiver desprevenido, flanqueado ou sob alguma condição que facilite seu ataque, você pode explorar a abertura para aumentar sua pressão em combate.</p>

                        <p><strong>Embusteiro.</strong> Você recebe benefícios em testes de Enganação, disfarce, blefe ou intriga, tornando-se mais eficiente em manipular informações e identidades falsas.</p>

                        <p><strong>Especialista em Armadilhas.</strong> Você recebe bônus em testes para encontrar, desarmar ou criar armadilhas, reforçando sua atuação como invasor, ladrão ou sabotador.</p>

                        <p><strong>Fuga Rápida.</strong> Quando sofre perigo imediato, você pode usar sua mobilidade e esperteza para se reposicionar, escapar de ameaças ou evitar ficar encurralado.</p>

                        <p><strong>Golpe Baixo.</strong> Você sabe atacar onde dói. Quando acerta um inimigo em situação vulnerável, pode impor efeitos adicionais conforme a situação e a aprovação do mestre.</p>

                        <p><strong>Língua de Prata.</strong> Você domina a arte da conversa, da sedução, da ameaça sutil e da meia-verdade. Recebe vantagem narrativa ou bônus em interações sociais quando usa Enganação, Diplomacia ou Intimidação de forma criativa.</p>

                        <p><strong>Mãos Rápidas.</strong> Você pode manipular objetos pequenos, sacar itens, esconder ferramentas ou realizar truques manuais com maior velocidade e discrição.</p>

                        <p><strong>Oportunismo.</strong> Uma vez por rodada, quando um inimigo adjacente sofre dano de um de seus aliados, você pode gastar 2 PM para fazer um ataque corpo a corpo contra esse inimigo. <strong>Pré-requisito:</strong> 6º nível de malandro.</p>

                        <p><strong>Perito em Furtividade.</strong> Você aprimora sua capacidade de se mover sem ser percebido, esconder-se, seguir alvos e infiltrar-se em locais protegidos.</p>

                        <p><strong>Rolagem Defensiva.</strong> Quando sofre dano, você pode tentar reduzir parte do impacto com um movimento rápido, uma queda controlada ou uso oportuno do ambiente.</p>

                        <p><strong>Saqueador.</strong> Você é eficiente em encontrar objetos úteis, dinheiro, ferramentas e pequenos recursos em locais abandonados, bolsas, baús ou corpos derrotados.</p>

                        <p><strong>Truque Sujo.</strong> Você pode usar areia nos olhos, empurrões, provocações, tropeços ou pequenas trapaças para prejudicar inimigos em combate.</p>

                        <p><strong>Velocidade Ladina.</strong> Sua experiência em fugas, perseguições e infiltrações aumenta sua mobilidade em cenas de ação.</p>

                        <p><strong>Veneno Oportuno.</strong> Você pode aplicar venenos com mais eficiência em armas, armadilhas ou situações de emboscada, desde que tenha acesso ao veneno adequado.</p>

                        <p><strong>Vigarista Nato.</strong> Você é especialmente bom em enganar, convencer ou manipular pessoas quando pode preparar uma história, disfarce ou golpe com antecedência.</p>
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