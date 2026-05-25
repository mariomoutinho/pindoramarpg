/**
 * Picker genérico (modal de seleção com preview + resumo curado).
 *
 * Substitui visualmente <select>s nativos, mantendo-os no DOM (apenas
 * escondidos) para que toda a lógica reativa existente que escuta
 * `change`/`input` continue funcionando.
 *
 * Atualmente é instanciado para 3 entidades:
 *   - Ancestralidade  (#ancestralidadeSelect)  — value = nome
 *   - Classe          (#classeSelect)          — value = nome
 *   - Origem          (#origemSelect)          — value = id (slug)
 *
 * Usa o mesmo CSS de assets/css/ancestralidade-picker.css (classes
 * .anc-picker-*). Esses nomes foram mantidos por compatibilidade,
 * mas o componente é genérico.
 */

(function () {
    'use strict';

    /* ============================================================
     * Resumos curados — escritos a partir das descrições oficiais
     * para guiar o jogador sobre o que esperar de cada escolha.
     * ============================================================ */

    const RESUMOS_ANCESTRALIDADE = {
        arajuba:
            'Povo-pássaro vindo de além-mar — humanoides aviários com cabeça de papagaio, plumagem colorida e garras afiadas. Vivem nas copas das montanhas e detestam confinamento; em batalha mergulham do céu e voam para longe. Para quem busca um batedor aéreo ágil, vaidoso e com instinto irrefreável de liberdade.',
        candango:
            'Encantados nascidos da Batalha do Esquecimento, quando a sacerdotisa Nzinga rogou a Kiantomerê para salvar seu povo. Pequeninos, com orelhas e cauda de roedor, ágeis e prestativos — sua aparência inofensiva esconde uma brutalidade surpreendente. Indicados para quem quer um companheiro acolhedor, persistente e que será sempre subestimado pelos inimigos.',
        curinqueas:
            'Gigantes pacíficos de pele cor de cobre que crescem por toda a vida (3m e além), dominando magia, diplomacia e a arte da guerra. Vivem em aldeias ocultas por magias ancestrais e só lutam quando provocados, mas então são implacáveis. Para quem quer um colosso sábio: presença imponente em combate ou em mesa de negociação.',
        florata:
            'Guardiões-vegetais despertados pela essência de Wesuirã, orixá das plantas sagradas. Pele esverdeada, beleza etérea, vestes de cipó e folha — tratam cada planta como família ainda em sono. São embaixadores entre civilização e natureza; perfeitos para quem deseja um druida nato, defensor das matas e voz da Grande Fraternidade Verdejante.',
        goiazi:
            'Inventores risonhos de menos de um metro que falam mais rápido do que pensam e celebram a vida com gargalhadas, engrenagens e pequenas explosões. Perderam seu reino aos caucazis e hoje aparecem como lapidários, sábios, engenheiros e professores espalhados pelos demais reinos. Indicados para quem quer um artífice extrovertido com energia caótica e otimismo inabalável.',
        iakare:
            'Répteis bípedes territoriais com escamas verde-acinzentadas, presas e garras — mestres das emboscadas em rios e pântanos. A sociedade tribal é dura e hierárquica, mas há os dissidentes que partem para o mundo provando seu valor como xamãs, sacerdotes ou fanfarrões. Para quem quer um caçador letal ou o "renegado nobre" buscando lugar entre aventureiros estranhos.',
        'kai-porah':
            'Caiporas: pequeninos mágicos de cabelo vermelho que se camuflam na floresta com roupas de folha e cascas. Conversam com animais, criam ilusões, montam javalis e aceitam fumo como gesto de amizade. Pacíficos por natureza, mas vulneráveis a magias mentais — escolha ideal para um explorador silencioso, trickster folclórico ou companheiro da fauna selvagem.',
        muiraquita:
            'Filhos do casamento entre Fogo e Metal, forjados por Gumedé com um fragmento do sol roubado de Kuarasy. Pele metálica (rubra, prateada, dourada) com cristais incrustados; construíram cidades-fortaleza nas montanhas e ensinam metalurgia desde Alagbedê. Corações generosos e teimosia de rocha — para quem quer um durão leal, ferreiro de essência divina, guerreiro ou artífice com convicção inabalável.',
        oiara:
            'Híbridos de Iemanjá: cauda de animal marinho na água, pernas em terra firme. Comunicam-se com criaturas aquáticas, respiram embaixo d\'água e ergueram reinos nos abismos do mar; Oxum lhes deu beleza e voz encantadora. Para quem busca um conjurador das águas, encantador de sereias e protetor de ecossistemas marinhos.',
        orumere:
            'Seres nascidos da união entre uma divindade e a energia cósmica, aparecem em Pindorama como crianças abandonadas para corrigir injustiças. Corpos atléticos, olhos brilhando com a essência divina; são acolhidos como sinal de proximidade dos deuses pelos unhabás e caçados como ameaça pelos caucazis. Para quem quer um paladino/inquisidor com missão clara e narrativa de propósito.',
        saci:
            'Encantados travessos de meio metro, pele e cabelo negros, com um redemoinho mágico nos pés que lhes permite flutuar. Cultura oral festiva: dançam, contam histórias e o gorro vermelho marca a passagem para a maturidade. Vivem em pequenas comunidades em harmonia com o Grande Verdejante — perfeitos para um trickster ágil, lutador acrobático ou bardo de raízes folclóricas profundas.',
        humano:
            'A ancestralidade mais numerosa de Pindorama, vinda do mar em cobras-canoas pela vontade dos Deuses Criadores. Adaptáveis e contraditórios, capazes de plantar e queimar, acolher e ferir; pindorins se vestem de fibras naturais, caucazis em couraças sóbrias. Para quem quer versatilidade total: encaixa em qualquer classe, qualquer região e qualquer tom narrativo.',
    };

    const RESUMOS_CLASSE = {
        arcanista:
            'Estudioso obsessivo do conhecimento oculto que se imerge em pesquisa, livros e expedições para dominar a arte arcana. Para quem quer um conjurador erudito e racional, mestre dos efeitos mágicos por compreensão das regras da realidade.',
        artifice:
            'Mente brilhante que abraçou ciência, alquimia e mecânica para moldar o mundo com invenções, compostos e engenhocas. Perfeito para quem quer um construtor criativo — alquimista ou inventor que substitui magia pelo engenho técnico.',
        brincante:
            'Artista carismático investido pelo poder de Anhum, capaz de inspirar aliados e minar inimigos com música, dança e performance. Ideal para quem quer um suporte enérgico e protagonista do palco — conjurador prático e mestre das influências.',
        cacador:
            'Protetor das fronteiras de Pindorama, mestre em rastreio, sobrevivência e abate de monstros. Para quem busca um exterminador especializado, em harmonia com a terra e com vínculos com forças naturais.',
        cangaceiro:
            'Defensor sertanejo de honra dúbia: para alguns herói, para outros bandido. Especialista em emboscada, combate em bando e resistência em terreno hostil — guerrilheiro tático ligado às tradições candangas.',
        fanfarrao:
            'Aventureiro ousado, exagerado e teatral — pirata, marujo, contrabandista ou duelista de capa esvoaçante. Para quem quer um espadachim flamejante, com presença cênica e improviso impecável.',
        feiticeiro:
            'Conjurador inato que carrega magia caótica no sangue por linhagem, pacto ancestral ou mistério primordial. Para quem quer um caster instintivo, com poderes que despertam sozinhos e personalidade marcada pela força que carrega.',
        guerreiro:
            'Maestro disciplinado do combate armado, mestre de qualquer arma e leitor de campo. Para quem quer o combatente clássico de honra, técnica e versatilidade — aberturas certeiras, golpes finais devastadores e contra-ataques implacáveis.',
        inquisidor:
            'Combatente honrado e formal, campeão de uma ordem ou autoridade — fé, brasão ou linhagem. Para quem quer um soldado divino com juramento e disciplina — guarda-real, paladino ou caçador de heresias.',
        lutador:
            'Mestre do combate desarmado que tem fé apenas no próprio corpo, treinado em becos, dojos ou sob tradições ancestrais. Para quem quer um pugilista resistente, ágil e disciplinado, transformando fúria em técnica precisa.',
        malandro:
            'Esperto, oportunista e versátil — vence pela furtividade, mentira, ladinagem e ataque pelas costas. Para quem quer escapar de qualquer perigo com astúcia, golpear pontos vitais e brilhar onde a força bruta falha.',
        rustico:
            'Herói ancestral que despreza a civilização e canaliza a fúria primal das selvas, pradarias e ermos. Para quem quer força bruta, instinto animal e resistência feroz — o bárbaro de sangue quente que floresce longe dos muros.',
        sacerdote:
            'Intermediário entre mortais e divinos, instrumento vivo da vontade de seu deus — cura, bênção, maldição e poder canalizado. Para quem quer um conjurador de fé ativa, representante armado do divino.',
        xama:
            'Místico das matas e ermos, guia entre espíritos selvagens, visões e transformações. Para quem quer um curandeiro-pajé conectado à natureza, com poderes de cura, espíritos animais e domínio das forças vivas da terra.',
    };

    const RESUMOS_DIVINDADE = {
        aelohim:
            'Juiz implacável dos povos caucazis — sábio ancião sedento por vingança e ordem absoluta. Devoção severa: hierarquia rígida, exclusivismo religioso, ausência de clemência. Para personagens que servem causas dogmáticas e justiça punitiva — Guerreiros e Inquisidores caucazis.',
        anhanga:
            'Senhor das entranhas do submundo, protetor dos animais selvagens e justiceiro dos indefesos. Veado branco de olhos em chamas. Devoção sombria mas justa: caça com oferenda de tabaco, vingança contra quem fere os fracos. Caçadores, Inquisidores, Rústicos e Xamãs pindorins.',
        anhum:
            'Deus da arte que esculpiu o vento em cânticos, pintou a luz e deu o dom da expressão a todos os seres. Para artistas, poetas e xamãs que entendem a arte como manifestação divina. Reverenciado por Brincantes, Fanfarrões e Xamãs.',
        axumewa:
            'Senhora das águas doces, do amor, da fertilidade e do cuidado com a gestação. Cura que flui pelos rios e cascatas. Devoção amorosa que abomina a crueldade — cultiva beleza e respeito a toda vida em formação. Aceita devotos de todas as raças.',
        caaporia:
            'Personificação da bondade da natureza, principal deusa dos xamãs e protetora das vidas selvagens. Pode aparecer como animal majestoso ou criatura híbrida. Para Caçadores, Inquisidores, Rústicos e Xamãs que defendem o equilíbrio entre civilização e mata.',
        exus:
            'Guardião que abre e fecha todos os caminhos, mensageiro entre mundos. Patrono da liberdade de expressão, da mudança, da comunicação franca. Para tricksters e libertários — Brincantes, Malandros e Fanfarrões que desafiam fanatismo e censura.',
        guianala:
            'O ancião curvado pelo cajado opaxorô, Deus da Paz e da serenidade. Aceito por todos os povos e classes. Para personagens diplomatas, conciliadores e que rejeitam violência por princípio — devoção universal de humildade e fraternidade.',
        gumede:
            'Civilizador que ensinou o domínio do fogo, a forja e a metalurgia — guerreiro, agricultor e ferreiro do Orum. Devoção pragmática à transformação e ao progresso. Para Artífices, Guerreiros, Rústicos e Inquisidores que constroem o futuro com as próprias mãos.',
        iacyr:
            'Deusa dos sonhos e soberana das noites, suavidade sobre o descanso do mundo. Protetora dos caçadores noturnos e dos sonhadores. Para Brincantes, Caçadores, Feiticeiros, Malandros e Xamãs que se movem pelas sombras gentis e pela luz da lua.',
        kiantomere:
            'Guardião supremo da metamorfose, deus do dinheiro e das fortunas — cobra arco-íris, senhor dos opostos. Para quem celebra mudança, comércio e transformação contínua, e zomba do conservadorismo. Aceita Arcanistas, Artífices, Brincantes, Fanfarrões, Feiticeiros e Malandros.',
        kuaracyr:
            'Glorioso deus sol, guardião do dia e da justiça que ilumina a todos por igual. Devoção luminosa e esperançosa — agir com equidade, iluminar o caminho dos perdidos. Para Arcanistas, Cangaceiros, Caçadores, Guerreiros, Rústicos e Inquisidores.',
        mice:
            'Amante de Anhangá, deusa da morte e dos feitiços das trevas — necromancia, sacrifícios e maldições. Para Arcanistas, Brincantes, Caçadores, Cangaceiros, Feiticeiros e Malandros que abraçam o lado sombrio sem hesitação.',
        mondja:
            'Grande Matriarca dos mares, deusa do oceano e das criaturas marinhas. Tornados e redemoinhos demonstram seu poder. Para Brincantes, Fanfarrões e Xamãs ligados à navegação e ao mar — Oiáras a reverenciam como mãe original.',
        namburuk:
            'A grande avó, deusa dos pântanos e das águas estagnadas. Senhora dos mistérios entre vida e morte: cura e adoece conforme o destino de cada um. Para Fanfarrões e Feiticeiros que dançam na zona crepuscular entre os mundos.',
        odessi:
            'Senhor da caça e da intuição, irmão de Gumedé que usa as ferramentas forjadas por ele. Guia dos caminhos da mata e conhecedor profundo de seus habitantes. Para Caçadores, Guerreiros, Rústicos e Xamãs.',
        'ruach-hakodechi':
            'A Luz, o Espírito Divino, governante do livre-arbítrio e da centelha mágica do cosmos. Reverenciado por todas as raças e classes — devoção universal centrada na liberdade, na verdade e na vida como dádiva.',
        sain:
            'Grande Deus das folhas, detentor dos segredos das plantas sagradas. Sem ele, nenhuma cerimônia ritualística existe — é quem desperta o "sangue verde". Para Xamãs, Artífices, Brincantes e Curandeiros que trabalham com o poder das ervas.',
        tessa:
            'Deusa dos ventos, redemoinhos e tempestades — principal divindade dos viajantes e nômades. Manifesta-se como mulher de cabelos vermelhos ou pássaro gigante. Para quem combate tiranos e protege o livre movimento — múltiplas classes a aceitam.',
        tumpa:
            'Espírito do Trovão e Deus da Justiça, líder supremo entre os deuses pindorins. Para os unhabás é Nangô, deus guerreiro da diáspora. Para Guerreiros, Cangaceiros, Caçadores, Inquisidores e Rústicos que defendem oprimidos e revelam a mentira.',
        yexua:
            'Divindade portadora da redenção, da compaixão e das curas milagrosas. Sacrificou-se para libertar a humanidade da ira de Aelohim. Devoção universal de fé, perdão e amor — exclusiva dos Inquisidores como classe principal.',
    };

    const PERICIAS_DESC = {
        'Acrobacia': 'Equilibrar-se, mover-se em terreno difícil, saltar com graça e amortecer quedas.',
        'Adestramento': 'Treinar e ensinar comandos a animais; lidar com criaturas selvagens.',
        'Atletismo': 'Correr, escalar, nadar, saltar — qualquer feito de força corporal.',
        'Atuação': 'Música, teatro, dança, oratória — qualquer arte de palco.',
        'Cavalgar': 'Conduzir cavalos, mulas, javalis e outras montarias em ritmo, terreno e combate.',
        'Conhecimento': 'Lembrar de fatos, civilizações, geografia, história e ciências em geral.',
        'Cura': 'Tratar feridas e doenças sem usar magia; estabilizar moribundos.',
        'Diplomacia': 'Negociar, persuadir e mudar atitudes alheias com argumentação razoável.',
        'Enganação': 'Mentir, blefar, disfarçar a verdade e enrolar com convicção.',
        'Fortitude': 'Resistência física a venenos, doenças, fadiga e efeitos corporais.',
        'Furtividade': 'Esconder-se, mover-se sem ser ouvido, evitar olhos curiosos.',
        'Guerra': 'Estratégia militar, formações, manobras e leitura tática do campo.',
        'Iniciativa': 'Reagir rápido no início do combate; agir antes dos outros.',
        'Intimidação': 'Forçar obediência ou render adversários com presença ameaçadora.',
        'Intuição': 'Pressentir mentiras, motivações ocultas e sentimentos disfarçados.',
        'Investigação': 'Buscar pistas, decifrar evidências e juntar fragmentos lógicos.',
        'Jogatina': 'Jogos de azar, apostas, cartas e dados — com sorte ou trapaça.',
        'Ladinagem': 'Abrir fechaduras, desarmar armadilhas, batidas de carteira.',
        'Luta': 'Combate corpo-a-corpo com armas, escudo ou desarmado.',
        'Misticismo': 'Reconhecer magias, criaturas mágicas, escolas e itens encantados.',
        'Nobreza': 'Genealogia, etiqueta, política e protocolo entre os poderosos.',
        'Ofício': 'Criar e reparar itens manuais — armaria, alfaiataria, alquimia, joalheria.',
        'Percepção': 'Notar detalhes, ouvir sons, encontrar coisas escondidas.',
        'Pilotagem': 'Conduzir veículos — carroças, embarcações, máquinas de Cearina.',
        'Pontaria': 'Combate à distância — arcos, bestas, armas de fogo e arremesso.',
        'Reflexos': 'Esquivar de armadilhas, magias de área e perigos súbitos.',
        'Religião': 'Conhecimento sobre divindades, rituais, símbolos e mortos-vivos.',
        'Sobrevivência': 'Caça, rastreio, navegação selvagem, montar acampamento.',
        'Vontade': 'Resistir a magias mentais, medo e tentação.',
    };

    const RESUMOS_ORIGEM = {
        'amigo-dos-animais':
            'Quem cresceu domando, criando ou defendendo animais — cavalariço, ginete, criador. Traz consigo um companheiro animal e a habilidade natural de lidar com criaturas silvestres.',
        amnesico:
            'Acordou sem memória do próprio passado e talvez nem do nome. Carrega objetos pessoais como pistas e busca reconstruir a identidade que se dissipou no vazio.',
        aristocrata:
            'Linhagem nobre com educação refinada em política, cavalaria ou artes arcanas. Carrega o peso das expectativas familiares e o prestígio da nobreza — joias, vestes finas e contatos cortesãos.',
        artesao:
            'Aprendeu de mestre, parente ou guilda a forjar objetos essenciais — armas, vestes, ferramentas. Tem ofício, mãos calejadas e os instrumentos da profissão.',
        artista:
            'Talento natural ou paixão treinada em uma forma de arte — música, pintura, dança, escrita. Vê o mundo com olhos sensíveis e ferramentas para encantar plateias.',
        'assistente-de-laboratorio':
            'Auxiliar de alquimista, inventor ou tzolkiner — anotando experimentos, organizando ferramentas, recapturando criaturas escapadas. Combina rigor metódico e curiosidade científica.',
        batedor:
            'Guia de caravanas, rastreador militar ou explorador do Grande Verde. Sabe encontrar rotas seguras e conduzir os outros pelos perigos do desconhecido.',
        capanga:
            'Músculo do crime — alguém grande, forte ou intimidador empregado por chefões para serviço pesado. Conhece o submundo por dentro, sem brilho mas com peso.',
        charlatao:
            'Talento natural para discernir o que as pessoas mais desejam ou temem, e usar isso a seu favor — com ou sem honestidade. Vive de palavra, lábia e leitura social.',
        circense:
            'Treinado em acrobacia, malabarismo, ilusionismo ou outra arte do picadeiro, seja sob lona ou autodidata em brincadeira de infância. Combina performance e agilidade.',
        criminoso:
            'Viveu fora da lei por necessidade, ambição ou falta de escolha. Conhece os atalhos, o submundo e os truques que mantêm gente como você fora da forca.',
        curandeiro:
            'Auxiliar do curandeiro da vila ou estudante formal de medicina — sabe tratar doenças e ferimentos sem depender de magia. Mãos firmes e ervas certas.',
        eremita:
            'Cresceu em reclusão — excluído ou atraído pela voz dos deuses — meditando longe da convivência social. Traz visões, paciência e algum segredo do silêncio.',
        escravo:
            'Nasceu cativo de povo derrotado em guerra ou foi capturado e leiloado em mercado clandestino. Carrega cicatrizes, lembranças e o desejo profundo de pertencer a si mesmo.',
        estudioso:
            'Boa parte da vida entre livros e pergaminhos por amor, curiosidade ou imposição. Sabe pesquisar, anotar e citar — dorme com tinta nos dedos.',
        fazendeiro:
            'Anos de labor em campos e fazendas, no território perigoso entre os ermos e as cidades. Mãos endurecidas, conhecimento da terra e do gado — origem da grande maioria de Pindorama.',
        forasteiro:
            'Veio de terras distantes com cultura quase desconhecida em Pindorama. Costumes peculiares, sotaque estranho — figura exótica em qualquer roda.',
        guarda:
            'Foi agente da lei em vila ou cidade — função menos glamorosa do que parece. Carrega uma arma de qualidade que "esqueceu" de devolver e conhece o protocolo dos postos urbanos.',
        herdeiro:
            'Linhagem com raízes profundas em algum ofício — nobreza, comércio, magia, artes furtivas, erudição. O que sua família é, você herda — ou refuta.',
        'heroi-camponese':
            'Defendeu o povoado de uma ameaça com o que tinha em mãos. Adorado pelo povo local, agora encara feitos maiores — porém ainda com o pé no chão da terra natal.',
        'lutador-de-rua':
            'Veterano de arenas e torneios clandestinos — por tradição, fama ou sobrevivência. Sabe ler oponentes, suportar dor e arrancar reputação no soco.',
        marujo:
            'Tripulante de barcos pesqueiros, piratas, caravelas ou navios voadores. Sabe ler os ventos, atar nó cego e farejar tempestade antes que apareça.',
        mateiro:
            'Caçou para sustentar comunidade que dependia da carne selvagem. Conhece as matas, as pegadas e o ritmo dos bichos — gente do silêncio paciente.',
        'membro-de-guilda':
            'Foi (ou ainda é) parte de uma guilda influente — artesãos, mercadores, feiticeiros, criminosos ou aventureiros. Tem rede de contatos, código interno e carteirinha que abre portas.',
        mercador:
            'Seguiu tradição da família comerciante, herdando estabelecimento ou começando como caixeiro. Sabe negociar, avaliar mercadoria e calcular margem.',
        minerador:
            'Desceu às profundezas da terra atrás de metais e gemas — segunda profissão mais perigosa de Pindorama. Conhece o subterrâneo, o picareta e o medo silencioso das galerias.',
        nomade:
            'Nunca teve lar fixo — caravana, peregrinação ou povo que nunca aderiu à agricultura. Sabe arrumar barraca em qualquer lugar e descobrir o caminho mais curto.',
        pivete:
            'Cresceu nas ruas, sem pais ou em fuga deles. A cidade ensinou furto, fuga, sono leve e a confiança rara que pivete só dá para outro pivete.',
        refugiado:
            'Sobrevivente de guerra ou tragédia — moldado em amargura, sombra e endurecimento, mas resiliente como poucos. Quem não morre, aprende a valorizar o que ainda restou.',
        religioso:
            'Ingressou cedo em jornada espiritual — uma escolha que abre tanto respeito quanto desconfiança, a depender do deus seguido. Conhece liturgias, símbolos e a paciência da fé.',
        seguidor:
            'Não nasceu herói, mas viveu na sombra de um — escudeiro, mensageiro ou criado de aventureiro reconhecido. Aprendeu por osmose: o brilho ainda está fresco na memória.',
        selvagem:
            'Cresceu em tribo rústica ou criado por animais, eremita ou pelos próprios ermos. Costumes inusitados, sentidos aguçados e relação genuína com o que outros chamam de "selvagem".',
        soldado:
            'Voluntário ou convocado de exército — Lusília, Pampas, Aliança Florim. Aprendeu disciplina, hierarquia, rotina de marcha e o peso real de uma arma na mão.',
        taverneiro:
            'Trabalhou ou foi dono de taverna frequentada por aventureiros. Ouviu mais histórias do que viveu e sabe medir bebida, briga e reputação alheia em segundos.',
        trabalhador:
            'Vida de labor árduo desde criança, sem glamour algum. Mãos calejadas, costas firmes e a paciência teimosa de quem nunca teve mais nada além da própria força.',
    };

    /* ============================================================
     * Utilidades
     * ============================================================ */

    function escapeHtml(s) {
        if (s == null) return '';
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function summaryFor(item, resumos) {
        if (item && item.id && resumos && resumos[item.id]) return resumos[item.id];
        const desc = item.descricao;
        if (!desc) return '';
        if (Array.isArray(desc)) return desc.slice(0, 2).join(' ');
        return String(desc);
    }

    /* ============================================================
     * Factory: monta um picker para um <select> dado.
     * ============================================================ */

    function montar(config) {
        const select = document.getElementById(config.selectId);
        if (!select) return null;

        const state = {
            select,
            items: config.items || [],
            titulo: config.titulo || 'Selecionar',
            resumos: config.resumos || {},
            valueField: config.valueField || 'nome',  // 'nome' | 'id'
            placeholder: config.placeholder || '(nenhum)',
            // Opcional: id do painel "extra" (ex: 'origemPanel') que deve
            // ser MOVIDO para dentro do modal enquanto ele está aberto e
            // devolvido para o host (`<id>Host`) ao fechar. Permite manter
            // a UI rica de Origem/Devoção como fonte única, sem duplicar.
            panelHostId: config.panelHostId || null,
            triggerBtn: null,
            triggerLabel: null,
            backdrop: null,
            listEl: null,
            previewEl: null,
            confirmBtn: null,
            previewKey: null,
            ready: false,
        };

        construirGatilho(state);
        construirModal(state);
        renderizarLista(state);
        atualizarLabelGatilho(state);
        state.ready = true;

        select.addEventListener('change', () => {
            atualizarLabelGatilho(state);
            if (isAberto(state)) marcarSelecionado(state, state.select.value);
        });

        return state;
    }

    /* ---------- gatilho ---------- */

    function construirGatilho(state) {
        const select = state.select;
        const wrap = select.parentElement;

        select.classList.add('anc-picker-hidden-select');
        select.setAttribute('aria-hidden', 'true');
        select.tabIndex = -1;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'anc-picker-trigger';
        btn.setAttribute('aria-haspopup', 'dialog');
        btn.setAttribute('aria-expanded', 'false');

        const label = document.createElement('span');
        label.className = 'anc-picker-trigger-label';
        btn.appendChild(label);

        const arrow = document.createElement('span');
        arrow.className = 'anc-picker-trigger-arrow';
        arrow.setAttribute('aria-hidden', 'true');
        arrow.textContent = '▼';
        btn.appendChild(arrow);

        wrap.appendChild(btn);

        state.triggerBtn = btn;
        state.triggerLabel = label;

        btn.addEventListener('click', () => abrir(state));
    }

    function atualizarLabelGatilho(state) {
        const valor = state.select.value;
        const lbl = state.triggerLabel;
        const btn = state.triggerBtn;
        if (!valor) {
            lbl.textContent = state.placeholder;
            lbl.classList.add('is-empty');
            btn.classList.remove('is-selected');
            return;
        }
        const item = state.items.find(i => i[state.valueField] === valor);
        lbl.textContent = item ? item.nome : valor;
        lbl.classList.remove('is-empty');
        btn.classList.add('is-selected');
    }

    /* ---------- modal ---------- */

    function construirModal(state) {
        const titleId = 'picker-' + state.select.id + '-title';

        const backdrop = document.createElement('div');
        backdrop.className = 'anc-picker-backdrop';
        backdrop.setAttribute('role', 'dialog');
        backdrop.setAttribute('aria-modal', 'true');
        backdrop.setAttribute('aria-labelledby', titleId);

        backdrop.innerHTML = `
            <div class="anc-picker-panel" role="document">
                <header class="anc-picker-header">
                    <h2 class="anc-picker-title" id="${titleId}">${escapeHtml(state.titulo)}</h2>
                    <button type="button" class="anc-picker-close" aria-label="Fechar">×</button>
                </header>

                <div class="anc-picker-body">
                    <div class="anc-picker-list" role="listbox" aria-label="Opções disponíveis"></div>
                    <div class="anc-picker-preview" aria-live="polite">
                        <div class="anc-picker-preview-empty">Passe o mouse sobre uma opção para ver detalhes.</div>
                    </div>
                </div>

                <!-- Slot para painéis "extras" embarcados (Benefícios da Origem,
                     Devoção etc.). Preenchido por abrir() via panelHostId. -->
                <div class="anc-picker-extras"></div>

                <footer class="anc-picker-footer">
                    <button type="button" class="anc-picker-btn anc-picker-btn-cancel">Cancelar</button>
                    <button type="button" class="anc-picker-btn anc-picker-btn-primary anc-picker-btn-confirm" disabled>Confirmar</button>
                </footer>
            </div>
        `;

        document.body.appendChild(backdrop);

        state.backdrop  = backdrop;
        state.listEl    = backdrop.querySelector('.anc-picker-list');
        state.previewEl = backdrop.querySelector('.anc-picker-preview');
        state.confirmBtn = backdrop.querySelector('.anc-picker-btn-confirm');

        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) fechar(state);
        });
        backdrop.querySelector('.anc-picker-close').addEventListener('click', () => fechar(state));
        backdrop.querySelector('.anc-picker-btn-cancel').addEventListener('click', () => fechar(state));
        state.confirmBtn.addEventListener('click', () => confirmar(state));

        document.addEventListener('keydown', (e) => {
            if (!isAberto(state)) return;
            if (e.key === 'Escape') {
                fechar(state);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault(); navegar(state, +1);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault(); navegar(state, -1);
            } else if (e.key === 'Enter' && state.previewKey) {
                e.preventDefault(); confirmar(state);
            }
        });
    }

    function renderizarLista(state) {
        const list = state.listEl;
        list.innerHTML = '';

        const optNone = montarOpcao(state, { id: '__none__', nome: state.placeholder, _none: true });
        list.appendChild(optNone);

        state.items.forEach(item => list.appendChild(montarOpcao(state, item)));
    }

    function montarOpcao(state, item) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'anc-picker-option';
        btn.setAttribute('role', 'option');
        btn.dataset.id = item.id || '';
        btn.dataset.value = item._none ? '' : (item[state.valueField] || '');

        btn.innerHTML = `
            <span class="anc-picker-radio" aria-hidden="true"></span>
            <span class="anc-picker-option-label">${escapeHtml(item.nome)}</span>
        `;

        btn.addEventListener('mouseenter', () => previewItem(state, item));
        btn.addEventListener('focus',      () => previewItem(state, item));
        btn.addEventListener('click',      () => {
            previewItem(state, item);
            // Um clique já marca visualmente como "selecionado" (mesmo
            // estilo do pós-confirm), evitando a falsa impressão de que
            // é preciso clicar duas vezes. O commit real (dispatch
            // change no <select>) continua acontecendo só no Confirmar.
            state.listEl.querySelectorAll('.anc-picker-option').forEach(b => {
                b.classList.toggle('is-selected', b === btn);
            });
        });
        btn.addEventListener('dblclick',   () => {
            previewItem(state, item);
            confirmar(state);
        });

        return btn;
    }

    function previewItem(state, item) {
        state.previewKey = item._none ? '__none__' : (item[state.valueField] || item.id);
        state.confirmBtn.disabled = false;

        state.listEl.querySelectorAll('.anc-picker-option').forEach(b => {
            const isPreview = (b.dataset.id || '') === (item.id || '');
            b.classList.toggle('is-preview', isPreview);
        });

        renderizarPreview(state, item);
    }

    function renderizarPreview(state, item) {
        const el = state.previewEl;

        if (item._none) {
            el.innerHTML = '<div class="anc-picker-preview-empty">Limpa a seleção.</div>';
            return;
        }

        const summary = escapeHtml(summaryFor(item, state.resumos));
        const temImg = !!item.imagem;

        // Compatibilidade com formato antigo (tracos) → converte para gruposTags
        const grupos = Array.isArray(item.gruposTags) && item.gruposTags.length
            ? item.gruposTags
            : (Array.isArray(item.tracos) && item.tracos.length
                ? [{ label: 'Traços ancestrais', tags: item.tracos }]
                : []);

        const tagsHtml = grupos.length ? `
            <div class="anc-picker-tags-wrap">
                ${grupos.map((g, gi) => `
                    <div class="anc-picker-tags-label">${escapeHtml(g.label || '')}</div>
                    <div class="anc-picker-tags">
                        ${(g.tags || []).map((t, ti) => `
                            <button type="button" class="anc-picker-tag"
                                    data-grupo="${gi}" data-tag="${ti}">
                                ${escapeHtml(t.nome || t.id || '')}
                            </button>
                        `).join('')}
                    </div>
                `).join('')}
                <div class="anc-picker-traco-detail" data-empty="true">
                    <em>Clique em uma tag para ver detalhes.</em>
                </div>
            </div>
        ` : '';

        // Cadeia de URLs a tentar (primária + fallbacks). Sem inline onerror —
        // o handler é vinculado em JS depois do innerHTML, evitando escape hell.
        const imgChain = [];
        if (item.imagem) imgChain.push(item.imagem);
        if (Array.isArray(item.imagemFallbacks)) {
            for (const u of item.imagemFallbacks) if (u) imgChain.push(u);
        }
        const fitClass = item.imagemFit === 'contain' ? ' anc-picker-preview-image--contain' : '';

        const imgHtml = imgChain.length
            ? `<div class="anc-picker-preview-image${fitClass}">
                   <img class="anc-picker-preview-img-el"
                        src="${escapeHtml(imgChain[0])}"
                        alt="${escapeHtml(item.nome)}" />
               </div>`
            : '';

        el.innerHTML = `
            <div class="anc-picker-preview-text">
                <h3 class="anc-picker-preview-name">${escapeHtml(item.nome)}</h3>
                <p class="anc-picker-preview-summary">${summary || '<em>(sem descrição)</em>'}</p>
                ${tagsHtml}
            </div>
            ${imgHtml}
        `;

        el.classList.toggle('anc-picker-preview-no-image', !temImg);

        // Vincula a cadeia de fallback de imagem (PNG → WebP → placeholder).
        const imgEl = el.querySelector('.anc-picker-preview-img-el');
        if (imgEl && imgChain.length) {
            let idx = 0;
            imgEl.addEventListener('error', () => {
                idx += 1;
                if (idx < imgChain.length) {
                    imgEl.src = imgChain[idx];
                    return;
                }
                const wrap = imgEl.parentElement;
                imgEl.remove();
                if (wrap) wrap.innerHTML = '<span class="placeholder">?</span>';
            });
        }

        // Vincula clique nas tags
        el.querySelectorAll('.anc-picker-tag').forEach(btn => {
            btn.addEventListener('click', (ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                alternarTag(state, grupos, btn);
            });
        });
    }

    function alternarTag(state, grupos, btn) {
        const detail = state.previewEl.querySelector('.anc-picker-traco-detail');
        if (!detail) return;

        const todasTags = state.previewEl.querySelectorAll('.anc-picker-tag');
        const jaAtiva   = btn.classList.contains('is-active');
        todasTags.forEach(b => b.classList.remove('is-active'));

        if (jaAtiva) {
            detail.dataset.empty = 'true';
            detail.innerHTML = '<em>Clique em uma tag para ver detalhes.</em>';
            return;
        }

        btn.classList.add('is-active');
        const gi = parseInt(btn.dataset.grupo, 10);
        const ti = parseInt(btn.dataset.tag, 10);
        const grupo = grupos[gi];
        const tag   = grupo && grupo.tags ? grupo.tags[ti] : null;
        if (!tag) {
            detail.dataset.empty = 'true';
            detail.innerHTML = '<em>(item não encontrado)</em>';
            return;
        }

        detail.dataset.empty = 'false';
        detail.innerHTML = `
            <h4 class="anc-picker-traco-name">${escapeHtml(tag.nome || tag.id || '')}</h4>
            <p class="anc-picker-traco-desc">${escapeHtml(tag.descricao || '(sem descrição)')}</p>
        `;
    }

    /* ---------- abrir / fechar / confirmar ---------- */

    function isAberto(state) {
        return state.backdrop && state.backdrop.classList.contains('is-open');
    }

    /* Contador de modais abertos para gerenciar scroll-lock global.
       Mantém suporte a vários pickers abertos simultaneamente sem
       restaurar o overflow no fechamento prematuro. */
    let _modaisAbertos = 0;
    let _bodyOverflowAnterior = '';

    function bloquearScrollBody() {
        if (_modaisAbertos === 0) {
            _bodyOverflowAnterior = document.body.style.overflow || '';
            document.body.style.overflow = 'hidden';
        }
        _modaisAbertos++;
    }

    function liberarScrollBody() {
        _modaisAbertos = Math.max(0, _modaisAbertos - 1);
        if (_modaisAbertos === 0) {
            document.body.style.overflow = _bodyOverflowAnterior;
        }
    }

    function abrir(state) {
        if (!state.ready) return;

        // Embarca o painel rico (Origem/Devoção) dentro do modal.
        // O elemento original vive em #<panelHostId>Host quando o modal
        // está fechado — manter um único nó no DOM = fonte única de
        // verdade para origens.js / divindades.js.
        if (state.panelHostId) {
            const panel = document.getElementById(state.panelHostId);
            const slot  = state.backdrop.querySelector('.anc-picker-extras');
            if (panel && slot) {
                slot.appendChild(panel);
                panel.classList.add('is-in-picker');
                panel.hidden = false;
            }
        }

        state.backdrop.classList.add('is-open');
        state.triggerBtn.setAttribute('aria-expanded', 'true');

        // Reseta a rolagem do painel para o topo a cada abertura, garantindo
        // que cabeçalho e primeiras opções fiquem visíveis no início.
        const panelEl = state.backdrop.querySelector('.anc-picker-panel');
        if (panelEl) panelEl.scrollTop = 0;

        bloquearScrollBody();

        const atual = state.select.value;
        marcarSelecionado(state, atual);

        const itemAtual = state.items.find(i => i[state.valueField] === atual);
        if (itemAtual) {
            previewItem(state, itemAtual);
        } else {
            state.previewKey = null;
            state.confirmBtn.disabled = true;
            state.previewEl.innerHTML = '<div class="anc-picker-preview-empty">Passe o mouse sobre uma opção para ver detalhes.</div>';
        }

        // Foco no primeiro elemento interativo do modal — garante percepção
        // imediata de "estou no modal" e habilita navegação por teclado.
        requestAnimationFrame(() => {
            const focar = state.backdrop.querySelector('.anc-picker-option.is-selected, .anc-picker-option, .anc-picker-close');
            if (focar) focar.focus({ preventScroll: true });
        });
    }

    function fechar(state) {
        if (!state.backdrop) return;
        if (!state.backdrop.classList.contains('is-open')) return;  // já fechado
        state.backdrop.classList.remove('is-open');
        state.triggerBtn.setAttribute('aria-expanded', 'false');

        // Devolve o painel embarcado ao seu host fora do modal.
        if (state.panelHostId) {
            const panel = document.getElementById(state.panelHostId);
            const host  = document.getElementById(state.panelHostId + 'Host');
            if (panel && host) {
                host.appendChild(panel);
                panel.classList.remove('is-in-picker');
            }
        }

        liberarScrollBody();
        state.triggerBtn.focus();
    }

    function marcarSelecionado(state, valor) {
        state.listEl.querySelectorAll('.anc-picker-option').forEach(b => {
            b.classList.toggle('is-selected', (b.dataset.value || '') === (valor || ''));
        });
    }

    function navegar(state, delta) {
        const opts = Array.from(state.listEl.querySelectorAll('.anc-picker-option'));
        if (!opts.length) return;
        const atual = opts.findIndex(o => o.classList.contains('is-preview'));
        const idx = ((atual < 0 ? 0 : atual) + delta + opts.length) % opts.length;
        opts[idx].focus();
    }

    function confirmar(state) {
        if (!state.previewKey) return;
        const novo = state.previewKey === '__none__' ? '' : state.previewKey;

        if (state.select.value !== novo) {
            state.select.value = novo;
            state.select.dispatchEvent(new Event('input',  { bubbles: true }));
            state.select.dispatchEvent(new Event('change', { bubbles: true }));
        }
        atualizarLabelGatilho(state);
        marcarSelecionado(state, novo);
        fechar(state);
    }

    /* ============================================================
     * Inicializadores das 3 entidades
     * ============================================================ */

    /**
     * Constrói um índice id → poder a partir de poderes-gerais.json,
     * filtrando por categoria (ex.: 'divinos', 'origem').
     */
    function indexarPoderesPorCategoria(poderesGerais, categoria) {
        const cat = (poderesGerais.categorias || []).find(c => c.id === categoria);
        const map = {};
        if (cat && Array.isArray(cat.poderes)) {
            cat.poderes.forEach(p => { map[p.id] = p; });
        }
        return map;
    }

    let _poderesGeraisCache = null;
    async function carregarPoderesGerais() {
        if (_poderesGeraisCache) return _poderesGeraisCache;
        _poderesGeraisCache = await fetch('data/poderes-gerais.json').then(r => r.json());
        return _poderesGeraisCache;
    }

    async function initAncestralidades() {
        try {
            const data = await fetch('data/ancestralidades.json').then(r => r.json());
            const items = (data.ancestralidades || []).map(a => ({
                id: a.id,
                nome: a.nome,
                descricao: a.descricao,
                imagem: 'assets/img/ancestralidades/' + a.id + '.webp',
                gruposTags: (a.tracos && a.tracos.length)
                    ? [{ label: 'Traços ancestrais', tags: a.tracos }]
                    : [],
            }));
            montar({
                selectId: 'ancestralidadeSelect',
                titulo: 'Selecionar Ancestralidade',
                items,
                resumos: RESUMOS_ANCESTRALIDADE,
                valueField: 'nome',
                placeholder: '(nenhum)',
            });
        } catch (err) {
            console.error('[picker] ancestralidades:', err);
        }
    }

    async function initClasses() {
        try {
            const data = await fetch('data/classes.json').then(r => r.json());
            const items = Object.entries(data).map(([id, def]) => ({
                id,
                nome: def.nome || id,
                descricao: null,                              // não existe em classes.json
                imagem: 'assets/img/classes/' + id + '.png',  // .png por convenção
                imagemFallbacks: ['assets/img/classes/' + id + '.webp'],
                imagemFit: 'contain',                         // corpo inteiro: não cortar
            }));
            montar({
                selectId: 'classeSelect',
                titulo: 'Selecionar Classe',
                items,
                resumos: RESUMOS_CLASSE,
                valueField: 'nome',
                placeholder: 'Selecione uma classe',
            });
        } catch (err) {
            console.error('[picker] classes:', err);
        }
    }

    async function initOrigens() {
        try {
            const [data, poderesGerais] = await Promise.all([
                fetch('data/origens.json').then(r => r.json()),
                carregarPoderesGerais(),
            ]);
            const idxOrigemPoder = indexarPoderesPorCategoria(poderesGerais, 'origem');

            const items = (data.origens || []).map(o => {
                const grupos = [];
                if (Array.isArray(o.pericias) && o.pericias.length) {
                    grupos.push({
                        label: 'Perícias possíveis',
                        tags: o.pericias.map(nome => ({
                            id: 'pericia-' + nome,
                            nome,
                            descricao: PERICIAS_DESC[nome] || 'Perícia disponível como benefício de origem.',
                        })),
                    });
                }
                if (Array.isArray(o.poderes) && o.poderes.length) {
                    grupos.push({
                        label: 'Poderes possíveis',
                        tags: o.poderes.map(pid => {
                            const p = idxOrigemPoder[pid];
                            return p
                                ? { id: p.id, nome: p.nome, descricao: p.descricao }
                                : { id: pid, nome: pid, descricao: '(poder não encontrado no catálogo)' };
                        }),
                    });
                }
                return {
                    id: o.id,
                    nome: o.nome,
                    descricao: o.descricao,
                    imagem: 'assets/img/origens/' + o.id + '.webp',
                    gruposTags: grupos,
                };
            });

            montar({
                selectId: 'origemSelect',
                titulo: 'Selecionar Origem',
                items,
                resumos: RESUMOS_ORIGEM,
                valueField: 'id',
                placeholder: 'Selecione uma origem',
                // Embarca a seção rica de Benefícios da Origem dentro do
                // modal — fonte única, sem reescrever origens.js.
                panelHostId: 'origemPanel',
            });
        } catch (err) {
            console.error('[picker] origens:', err);
        }
    }

    async function initDivindades() {
        try {
            const [data, poderesGerais] = await Promise.all([
                fetch('data/divindades.json').then(r => r.json()),
                carregarPoderesGerais(),
            ]);
            const idxDivinos = indexarPoderesPorCategoria(poderesGerais, 'divinos');

            const items = (data.divindades || []).map(d => {
                const grupos = [];
                if (Array.isArray(d.poderes) && d.poderes.length) {
                    grupos.push({
                        label: 'Poderes divinos',
                        tags: d.poderes.map(pid => {
                            const p = idxDivinos[pid];
                            return p
                                ? { id: p.id, nome: p.nome, descricao: p.descricao }
                                : { id: pid, nome: pid, descricao: '(poder não encontrado no catálogo)' };
                        }),
                    });
                }
                return {
                    id: d.id,
                    nome: d.nome,
                    descricao: d.descricao,
                    // Convenção: assets/img/divindades/<id>.webp como
                    // formato principal e .png como fallback. Se nenhum
                    // existir, o picker mostra o placeholder "?". Ver
                    // assets/img/divindades/README.md.
                    imagem: 'assets/img/divindades/' + d.id + '.webp',
                    imagemFallbacks: ['assets/img/divindades/' + d.id + '.png'],
                    gruposTags: grupos,
                };
            });

            montar({
                selectId: 'divindadeSelect',
                titulo: 'Selecionar Divindade',
                items,
                resumos: RESUMOS_DIVINDADE,
                valueField: 'id',
                placeholder: 'Sem devoção',
                // Embarca a seção rica de Devoção dentro do modal.
                panelHostId: 'divindadePanel',
            });
        } catch (err) {
            console.error('[picker] divindades:', err);
        }
    }

    async function init() {
        await Promise.all([
            initAncestralidades(),
            initClasses(),
            initOrigens(),
            initDivindades(),
        ]);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
