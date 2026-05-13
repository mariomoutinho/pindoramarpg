<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Brincante - Pindorama RPG</title>

    <link rel="stylesheet" href="assets/css/ficha.css" />
    <link rel="stylesheet" href="assets/css/classes.css?v=20260513a" />
</head>

<body>
    <main class="page-wrapper classes-page">

        <header class="top-actions classes-topbar">
            <div>
                <h1>Brincante</h1>
                <p>Classe dedicada à arte, à inspiração, à performance mística e ao poder encantatório das tradições culturais de Pindorama.</p>
            </div>

            <div class="actions">
                <a class="system-link-btn" href="index.php">Menu</a>
                <a class="system-link-btn" href="classes.php">Classes</a>
                <a class="system-link-btn" href="ficha.php">Ficha</a>
            </div>
        </header>

        <?php
            $cb_class_slug = 'brincante';
            $cb_class_name = 'Brincante';
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
                        <a class="toc-link toc-level-2" href="#tabela-brincante">Tabela 1-5: O Brincante</a>
                        <a class="toc-link toc-level-2" href="#inspiracoes">Inspirações</a>
                        <a class="toc-link toc-level-2" href="#poderes">Poderes de Brincante</a>
                    </nav>
                </div>
            </aside>

            <article class="sheet classes-content" id="classesContent">

                <section id="descricao" class="content-section">
                    <h2>Brincante</h2>

                    <p>
                        O brincante é uma figura multifacetada, mestre das artes, imerso nas tradições culturais
                        e dotado de um carisma incomparável. Em Pindorama, onde a arte é uma manifestação investida
                        de poder concedido pelas graças do deus Anhum, o brincante não apenas encanta: ele influencia
                        mentes, eleva almas e até cura aliados.
                    </p>

                    <p>
                        Nos campos de batalha, os brincantes são capazes de inspirar seus companheiros ou minar a moral
                        de seus inimigos por meio de cânticos, músicas, danças e encenações envolventes. Sua arte é arma,
                        proteção, memória e encantamento.
                    </p>

                    <p>
                        Os verdadeiros brincantes são raros. Distinguir um artista comum de um brincante exige observação
                        atenta, pois suas vidas se assemelham às de outros artistas: viagens, coleta de conhecimentos,
                        partilha de histórias e apresentações diante de muitas audiências. No entanto, a versatilidade,
                        o domínio artístico excepcional e o toque místico são o que realmente diferenciam esses personagens.
                    </p>

                    <p>
                        A trajetória até tornar-se um brincante pode variar amplamente. Alguns foram aprendizes de mestres
                        das artes; outros receberam educação erudita em instituições voltadas às práticas artísticas; há ainda
                        aqueles que encontraram mentores errantes, patronos nobres ou forças sobrenaturais que reconheceram
                        seu potencial.
                    </p>

                    <p>
                        Raramente se estabelecem, pois sua vocação natural é a aventura. Cada jornada torna-se uma oportunidade
                        de aprendizado, prática, exploração, decifração de antigos saberes e encontro com criaturas extraordinárias.
                        Acompanhar heróis, inspirar-se em suas jornadas, narrar feitos e, quando necessário, assumir papéis heroicos
                        fazem parte da vida singular de um brincante.
                    </p>
                </section>

                <section id="caracteristicas" class="content-section">
                    <h2>Características de Classe</h2>

                    <div class="class-power-block">
                        <p><strong>Pontos de Vida.</strong> Um brincante começa com <strong>12 pontos de vida + Constituição</strong> e ganha <strong>3 PV + Constituição</strong> por nível.</p>

                        <p><strong>Pontos de Mana.</strong> <strong>4 PM por nível.</strong></p>

                        <p>
                            <strong>Perícias.</strong> <strong>Atuação (Car)</strong> e <strong>Reflexos (Des)</strong>, mais <strong>7</strong> à sua escolha entre
                            <strong>Acrobacia (Des)</strong>, <strong>Cavalgar (Des)</strong>, <strong>Conhecimento (Int)</strong>,
                            <strong>Diplomacia (Car)</strong>, <strong>Enganação (Car)</strong>, <strong>Furtividade (Des)</strong>,
                            <strong>Iniciativa (Des)</strong>, <strong>Intuição (Sab)</strong>, <strong>Investigação (Int)</strong>,
                            <strong>Jogatina (Car)</strong>, <strong>Ladinagem (Des)</strong>, <strong>Luta (For)</strong>,
                            <strong>Misticismo (Int)</strong>, <strong>Nobreza (Int)</strong>, <strong>Percepção (Sab)</strong>,
                            <strong>Pontaria (Des)</strong> e <strong>Vontade (Sab)</strong>.
                        </p>

                        <p><strong>Proficiências.</strong> Armas marciais.</p>
                    </div>
                </section>

                <section id="habilidades" class="content-section">
                    <h2>Habilidades de Classe</h2>

                    <div class="class-power-block">
                        <p>
                            <strong>Inspiração.</strong> Você pode gastar uma ação padrão e <strong>2 PM</strong> para inspirar
                            as pessoas com sua música ou outro tipo de arte, como dança ou encenação. Você e todos os seus aliados
                            em alcance curto ganham <strong>+1 em testes de perícia</strong> até o fim da cena.
                        </p>

                        <p>
                            A cada quatro níveis, você pode gastar <strong>+2 PM</strong> para aumentar o bônus em +1 e escolher
                            um novo efeito. Você também pode acionar um efeito alternativo da Inspiração gastando uma ação de movimento
                            e realizando um teste de <strong>Atuação CD 15</strong>.
                        </p>

                        <p>
                            Você aprende automaticamente todos os efeitos adicionais da Inspiração ao atingir o pré-requisito
                            estabelecido por cada um. Você só pode ativar um efeito por vez ao usar Inspiração. Para trocar o efeito,
                            deve gastar uma ação de movimento, <strong>1 PM</strong> e fazer um novo teste de Atuação.
                        </p>

                        <p>
                            <strong>Magias.</strong> Você pode lançar magias de brincante de <strong>1º círculo</strong>, arcanas ou divinas.
                            À medida que sobe de nível, pode lançar magias de círculos maiores: <strong>2º círculo no 6º nível</strong>,
                            <strong>3º círculo no 10º nível</strong> e <strong>4º círculo no 14º nível</strong>.
                        </p>

                        <p>
                            Você começa com <strong>duas magias de 1º círculo</strong>. A cada nível par, aprende uma magia de qualquer
                            círculo que possa lançar. Você pode lançar essas magias vestindo armaduras leves sem precisar de testes
                            de Misticismo. Seu atributo-chave para lançar magias é <strong>Carisma</strong>, e você soma seu Carisma
                            ao seu total de PM.
                        </p>

                        <p>
                            <strong>Poder de Brincante.</strong> No <strong>2º nível</strong>, e a cada nível seguinte, você recebe
                            um poder de brincante à sua escolha.
                        </p>

                        <p>
                            <strong>Eclético.</strong> A partir do <strong>2º nível</strong>, você pode gastar <strong>1 PM</strong>
                            para receber todos os benefícios de ser treinado em uma perícia por um teste.
                        </p>

                        <p>
                            <strong>Mestre das Artes.</strong> No <strong>20º nível</strong>, você pode usar Inspiração como uma ação livre.
                            Enquanto estiver sob efeito de sua Inspiração, suas habilidades de brincante, incluindo magias, têm seu custo
                            em PM reduzido pela metade, após aplicar aprimoramentos e quaisquer outros efeitos que reduzam custo.
                        </p>
                    </div>
                </section>

                <section id="tabela-brincante" class="content-section">
                    <h2>Tabela 1-5: O Brincante</h2>

                    <div class="classes-table-wrap">
                        <table class="classes-table level-table">
                            <thead>
                                <tr>
                                    <th>Nível</th>
                                    <th>Habilidades de Classe</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr><td>1º</td><td>Inspiração, magias</td></tr>
                                <tr><td>2º</td><td>Eclético, poder de brincante</td></tr>
                                <tr><td>3º</td><td>Poder de brincante</td></tr>
                                <tr><td>4º</td><td>Poder de brincante</td></tr>
                                <tr><td>5º</td><td>Inspiração +2, poder de brincante</td></tr>
                                <tr><td>6º</td><td>Magias (2º círculo), poder de brincante</td></tr>
                                <tr><td>7º</td><td>Poder de brincante</td></tr>
                                <tr><td>8º</td><td>Poder de brincante</td></tr>
                                <tr><td>9º</td><td>Inspiração +3, poder de brincante</td></tr>
                                <tr><td>10º</td><td>Magias (3º círculo), poder de brincante</td></tr>
                                <tr><td>11º</td><td>Poder de brincante</td></tr>
                                <tr><td>12º</td><td>Poder de brincante</td></tr>
                                <tr><td>13º</td><td>Inspiração +4, poder de brincante</td></tr>
                                <tr><td>14º</td><td>Magias (4º círculo), poder de brincante</td></tr>
                                <tr><td>15º</td><td>Poder de brincante</td></tr>
                                <tr><td>16º</td><td>Poder de brincante</td></tr>
                                <tr><td>17º</td><td>Inspiração +5, poder de brincante</td></tr>
                                <tr><td>18º</td><td>Poder de brincante</td></tr>
                                <tr><td>19º</td><td>Poder de brincante</td></tr>
                                <tr><td>20º</td><td>Mestre das artes, poder de brincante</td></tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section id="inspiracoes" class="content-section">
                    <h2>Inspirações</h2>

                    <div class="class-power-block">
                        <h3>Pré-requisito: 1º nível de Brincante</h3>

                        <p><strong>Cupim de Ferro.</strong> Reduz o dano de corte e perfuração em 1 por dado de dano.</p>

                        <p><strong>Corpo de Lama.</strong> Os aliados recebem bônus de +1 em testes de Fortitude.</p>

                        <p><strong>Samba do Lado.</strong> Os aliados recebem bônus de +1 em testes de Reflexos.</p>

                        <p><strong>Devastação da Calma.</strong> Os aliados recebem bônus de +1 em testes de Vontade.</p>

                        <p><strong>Cidadão do Mundo.</strong> O deslocamento das criaturas afetadas aumenta em +3m.</p>

                        <p><strong>Fome de Tudo.</strong> Todo dano de ataque corpo a corpo recupera 1 PV por dado de dano.</p>

                        <p><strong>Inspiração Marcial.</strong> Quando você usa Inspiração, você e seus aliados aplicam o bônus recebido em rolagens de dano, além de testes de perícia.</p>

                        <h3>Pré-requisito: 5º nível de Brincante</h3>

                        <p><strong>A Matadeira.</strong> Os aliados recebem +1 na margem de ameaça com armas de ataque à distância.</p>

                        <p><strong>Bala Perdida.</strong> Os aliados recebem +2 na Defesa contra ataques de longo alcance.</p>

                        <p><strong>Mormaço.</strong> Alvos inimigos ficam lentos. Um teste de Fortitude contra CD Carisma anula o efeito.</p>

                        <p><strong>Fé Cega, Faca Amolada.</strong> Os aliados recebem +1 na margem de ameaça em combate corpo a corpo.</p>

                        <h3>Pré-requisito: 9º nível de Brincante</h3>

                        <p><strong>Tambores de Fogo.</strong> Alvos aliados adicionam +1 de dano de fogo por dado de dano em seus ataques com armas corpo a corpo ou ataques desarmados.</p>

                        <p><strong>Beijo da Vampira.</strong> Para cada dano causado por ataque corpo a corpo, 1 PM é restaurado.</p>

                        <p><strong>Chamado dos Ossos.</strong> Para cada inimigo morto, é conjurado um esqueleto para lutar, conforme a magia Conjurar Mortos-Vivos.</p>

                        <p><strong>Fome de Tudo.</strong> Uma vez por inspiração, os aliados podem rolar novamente o dado de um teste.</p>

                        <h3>Pré-requisito: 13º nível de Brincante</h3>

                        <p><strong>Nascedouro.</strong> Um aliado caído retorna com 1 PV. Se a inspiração for cancelada, o aliado volta à inconsciência.</p>

                        <p><strong>Jornal da Morte.</strong> Para cada inimigo morto, é conjurado um carniçal para lutar, conforme a magia Conjurar Mortos-Vivos.</p>

                        <p><strong>Maluco-Beleza.</strong> Alvos inimigos ficam alquebrados. Um teste de Vontade contra CD Carisma anula o efeito.</p>

                        <p><strong>Inferno.</strong> Alvos inimigos próximos ficam em chamas.</p>

                        <h3>Pré-requisito: 17º nível de Brincante</h3>

                        <p><strong>Força Encantada.</strong> Todos os ataques dos aliados são considerados mágicos.</p>

                        <p><strong>Compromisso de Morte.</strong> Para cada inimigo morto, conjura um espírito para lutar, conforme a magia Conjurar Mortos-Vivos.</p>

                        <p><strong>Rebuliço.</strong> Alvos aliados podem fazer um ataque corpo a corpo contra um alvo adjacente que esteja desprevenido ou que se mova para fora de seu alcance.</p>
                    </div>
                </section>

                <section id="poderes" class="content-section">
                    <h2>Poderes de Brincante</h2>

                    <div class="class-power-block">
                        <p><strong>Apresentação Avassaladora.</strong> Sua Inspiração afeta também os inimigos dentro do alcance. Criaturas afetadas devem fazer um teste de Vontade contra o resultado do seu teste de Atuação. Alvos que falharem recebem uma penalidade em testes de perícia igual ao seu bônus de Inspiração até o final da cena.</p>

                        <p><strong>Apresentação em Grupo.</strong> Ao ativar sua Inspiração, aliados afetados pelo poder podem gastar 2 PM e adicionar +1 de bônus na Inspiração. Para isso, devem passar em um teste de Atuação CD 10. Se falharem, a Inspiração é cancelada para todos.</p>

                        <p><strong>Arte Mágica.</strong> Enquanto você estiver sob efeito de sua habilidade Inspiração, a CD para resistir a suas habilidades de brincante aumenta em +2.</p>

                        <p><strong>Artista Versátil.</strong> Você recebe um poder de outra classe à sua escolha. Você deve cumprir todos os pré-requisitos do poder escolhido e, para esse efeito, considere que seu nível na classe original do poder é seu nível de brincante –2. <strong>Pré-requisitos:</strong> Int 2, 6º nível de brincante.</p>

                        <p><strong>Aumentar Repertório.</strong> Você aprende duas magias de qualquer círculo que possa lançar. Você pode escolher este poder quantas vezes quiser.</p>

                        <p><strong>Aumento de Atributo.</strong> Você recebe +1 em um atributo. Você pode escolher este poder várias vezes, mas apenas uma vez por patamar para um mesmo atributo.</p>

                        <p><strong>Dança das Lâminas.</strong> Quando lança uma magia com execução de uma ação padrão, pode gastar 1 PM para fazer um ataque corpo a corpo como uma ação livre. <strong>Pré-requisitos:</strong> Esgrima Mágica, 10º nível de brincante.</p>

                        <p><strong>Desarranjo.</strong> Sempre que uma magia for lançada dentro de seu alcance médio, você pode gastar 3 PM e uma reação para fazer uma contramágica como se estivesse lançando Dissipar Magia, mas usa Atuação em vez de Misticismo para o teste. Você gasta os PM mesmo se não conseguir anular a magia. <strong>Pré-requisito:</strong> capacidade de lançar magias de 2º círculo.</p>

                        <p><strong>Esgrima Mágica.</strong> Sua arte mescla esgrima e magia, transformando dança em golpes. Se estiver sob efeito de Inspiração, você pode substituir testes de Luta por testes de Atuação, mas apenas para ataques com armas corpo a corpo leves ou de uma mão.</p>

                        <p><strong>Estrelato.</strong> Suas apresentações o tornaram famoso, fazendo com que você seja reconhecido e bem tratado por aqueles que apreciam a arte. Quando usa Atuação para impressionar uma plateia, o bônus recebido em perícias baseadas em Carisma aumenta para +5. <strong>Pré-requisito:</strong> 6º nível de brincante.</p>

                        <p><strong>Expressão Poderosa.</strong> Você pode gastar uma ação padrão e 2 PM para emitir uma nota poderosa com sua voz que afeta uma criatura em alcance curto. Faça um teste de Atuação oposto a um teste de Fortitude da criatura. Se vencer, causa 2d6 pontos de dano de impacto e a criatura fica surda por uma rodada. Se perder, causa metade do dano e a criatura evita a surdez. Para cada quatro níveis, pode gastar +1 PM para aumentar o dano em +1d6.</p>

                        <p><strong>Fascinar em Massa.</strong> Quando usa Performance: Encantadora, você pode gastar +2 PM. Se fizer isso, afeta todas as criaturas à sua escolha no alcance da música. Você faz um único teste de Atuação, oposto ao teste de Vontade de cada criatura. <strong>Pré-requisito:</strong> Performance: Encantadora.</p>

                        <p><strong>Golpe Elemental.</strong> Enquanto estiver sob efeito de Inspiração, sempre que acertar um ataque corpo a corpo, pode gastar 1 PM para causar 1d6 de dano extra de ácido, eletricidade, fogo ou frio, à sua escolha. Para cada quatro níveis, pode gastar +1 PM para aumentar o dano em +1d6. <strong>Pré-requisito:</strong> Golpe Mágico.</p>

                        <p><strong>Golpe Mágico.</strong> Enquanto estiver sob efeito de Inspiração, sempre que acertar um ataque corpo a corpo em um inimigo, recebe 2 PM temporários cumulativos. Você pode ganhar um máximo de PM temporários por cena igual ao seu nível. Esses pontos desaparecem no fim da cena. <strong>Pré-requisito:</strong> Esgrima Mágica.</p>

                        <p><strong>Harmonia Dupla.</strong> Você pode gastar +1 PM ao ativar a Inspiração para conceder dois efeitos adicionais simultâneos. <strong>Pré-requisito:</strong> 9º nível de brincante.</p>

                        <p><strong>Harmonizar.</strong> Se você for alvo de um efeito mágico que permita um teste de resistência, pode gastar 2 PM para trocar o teste de resistência por um teste de Atuação.</p>

                        <p><strong>Lamento Restaurador.</strong> Quando usa Performance: Revitalizante, pode gastar +2 PM. Se fizer isso, escolha uma condição entre abalado, alquebrado, apavorado, atordoado, cego, confuso, enfeitiçado, esmorecido, exausto, fatigado, frustrado, pasmo ou surdo. Você remove a condição escolhida das criaturas afetadas pela música. <strong>Pré-requisito:</strong> Performance: Revitalizante.</p>

                        <p><strong>Lendas e Histórias.</strong> Você é um arquivo vivo de relatos, canções e folclore. Pode gastar 1 PM para rolar novamente um teste recém realizado de Conhecimento, Misticismo, Nobreza ou Religião para obter informação, identificar criaturas ou identificar itens mágicos. <strong>Pré-requisito:</strong> Int 1.</p>

                        <p><strong>Manipular.</strong> Você pode gastar 1 PM para fazer uma criatura fascinada por você ficar enfeitiçada até o fim da cena. Um teste de Vontade contra CD Carisma anula. Se a criatura passar, fica imune a este efeito por um dia. Usar esta habilidade não conta como ameaça à criatura fascinada. <strong>Pré-requisito:</strong> Performance: Encantadora.</p>

                        <p><strong>Manipular em Massa.</strong> Quando usa Manipular, você pode gastar +2 PM. Se fizer isso, afeta todas as criaturas à sua escolha em alcance curto. <strong>Pré-requisitos:</strong> Fascinar em Massa, Manipular, 10º nível de brincante.</p>

                        <p><strong>Mestre dos Sussurros.</strong> Você é dissimulado, atento para rumores e ótimo em espalhar fofocas. Quando faz um teste de Investigação para obter informação ou um teste de Enganação para intriga, rola dois dados e usa o melhor resultado. Além disso, pode fazer esses testes em ambientes sociais sem custo e em apenas uma hora. <strong>Pré-requisitos:</strong> Car 1, treinado em Enganação e Investigação.</p>

                        <p><strong>Mimetismo.</strong> Uma vez por rodada, quando vê outra criatura lançando uma magia em alcance médio, você pode pagar 1 PM e fazer um teste de Atuação CD 15 + custo em PM da magia. Se passar, até o final de seu próximo turno você pode lançar essa magia.</p>

                        <p><strong>Performance: Encantadora.</strong> Faça um teste de Atuação oposto ao teste de Vontade de uma criatura no alcance. Se você passar, ela fica fascinada enquanto você se concentrar. Um alvo hostil ou envolvido em combate recebe +5 no teste de resistência e tem direito a um novo teste sempre que você se concentrar. Se passar, fica imune a este efeito por um dia.</p>

                        <p><strong>Performance: Sinistra.</strong> Faça um teste de Atuação oposto ao teste de Vontade de cada criatura à sua escolha dentro do alcance. Você faz um único teste. Alvos que falhem ficam abalados até o fim da cena. Alvos que passem ficam imunes a este efeito por um dia.</p>

                        <p><strong>Performance: Revitalizante.</strong> Criaturas à sua escolha no alcance recuperam 1d6 PV. Quando usa esta habilidade, você pode gastar mais pontos de mana. Para cada PM extra, aumenta a cura em +1d6 PV.</p>

                        <p><strong>Prestidigitação.</strong> Quando faz uma ação padrão qualquer, pode aproveitar seus gestos para lançar uma magia com tempo de execução de uma ação completa ou menor. Faça um teste de Atuação CD 15 + custo em PM da magia. Se passar, lança a magia como uma ação livre. Se falhar, a magia não funciona, mas você gasta os PM mesmo assim.</p>

                        <p><strong>Projetar a Voz.</strong> Quando usa uma habilidade de brincante, você pode gastar +2 PM para aumentar seu alcance em um passo ou dobrar sua área de efeito. Se usado em uma magia, este poder conta como um aprimoramento.</p>

                        <p><strong>Ressoar.</strong> Quando lança uma magia que tenha apenas você como alvo, pode fazer um teste de Atuação CD 15 + PM gastos na magia. Se passar, pode compartilhar os efeitos com aliados em alcance curto que estejam sob efeito de sua Inspiração, gastando 1 PM por aliado escolhido. <strong>Pré-requisito:</strong> 16º nível de brincante.</p>

                        <p><strong>Teatro de Marionetes.</strong> Você pode gastar 3 PM e uma ação padrão para conjurar 3 marionetes pequenas de madeira encantada, amarradas a você por cordas de energia, em espaços desocupados em alcance curto. Cada marionete concede +1 no bônus de Inspiração para você e seus aliados, dobra o efeito da Inspiração e aumenta em +1 a CD para resistir às suas magias. <strong>Pré-requisitos:</strong> Arte Mágica, 6º nível de brincante.</p>

                        <p><strong>Trova Penosa.</strong> Quando usa Performance: Sinistra, pode gastar +2 PM. Se fizer isso, adiciona 1d6 pontos de dano mental não letal às criaturas afetadas pela rima. Para cada PM extra, aumenta o dano em +1d6 PV.</p>
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