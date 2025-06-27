  let selectedWord = "";
  let displayedWord = [];
  let wrongGuesses = 0;
  const maxGuesses = 6;
  let soundEnabled = true;
  let animationFrameId;

  const wordDisplay = document.getElementById("wordDisplay");
  const keyboard = document.getElementById("keyboard");
  const wrongDisplay = document.getElementById("wrongGuesses");
  const message = document.getElementById("message");
  const restartBtn = document.getElementById("restartBtn");
  const hangmanFigure = document.querySelector(".hangman-figure");
  const hintText = document.getElementById("hintText");
  const soundBtn = document.getElementById("soundBtn");
  const hearts = document.querySelectorAll(".heart");
  const particlesContainer = document.querySelector(".particles");
  const fireCanvas = document.getElementById("fireCanvas");
  const fireBackground = document.querySelector(".fire-background");

  // Sound effects
const sounds = {
  correct: new Audio('./correct-156911.mp3'),
  wrong: new Audio('./error-002-337159.mp3'),
  win: new Audio('./you-win-sequence-3-183950.mp3'),
  lose: new Audio('./Beyoncé - Haunted extended ending (slowed) [LAD6yWu-nNQ].mp3'),
  click: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3'),
  fire: new Audio('./fire-sound-334130.mp3')
};

const wordList = [
  // Palavras originais revisadas (50)
  { word: "abissal", description: "Relativo a grandes profundidades, especialmente oceânicas" },
  { word: "acalanto", description: "Canção para embalar bebês; ato de acalentar" },
  { word: "altivez", description: "Qualidade de quem é altivo, orgulhoso de maneira nobre" },
  { word: "alusivo", description: "Que faz alusão, que se refere indiretamente a algo" },
  { word: "apogeu", description: "Ponto mais alto de desenvolvimento ou sucesso" },
  { word: "ardiloso", description: "Astuto, esperto, que age com dissimulação" },
  { word: "ascensão", description: "Ato de subir ou elevar-se; progresso importante" },
  { word: "assombro", description: "Espanto, admiração extrema; pode significar também fantasma" },
  { word: "astúcia", description: "Habilidade para resolver situações com inteligência prática" },
  { word: "baluarte", description: "Estrutura defensiva; figuradamente, proteção sólida" },
  { word: "boêmio", description: "Que leva vida despreocupada, especialmente artística" },
  { word: "bucólico", description: "Relativo à vida campestre idealizada, pastoral" },
  { word: "candente", description: "Brilhante, ardente; assunto muito atual e importante" },
  { word: "cauterizar", description: "Queimar tecido para fins médicos; figuradamente, marcar profundamente" },
  { word: "celeuma", description: "Barulho, confusão; debate acalorado" },
  { word: "cinzel", description: "Ferramenta para esculpir; figuradamente, trabalhar com precisão" },
  { word: "colosso", description: "Estátua gigantesca; pessoa ou coisa de grande importância" },
  { word: "contundente", description: "Que produz forte impacto, seja físico ou argumentativo" },
  { word: "convés", description: "Piso superior de navio; palco de grandes eventos náuticos" },
  { word: "corolário", description: "Conclusão lógica que decorre naturalmente de algo" },
  { word: "decrépito", description: "Muito velho e enfraquecido; em avançado estado de deterioração" },
  { word: "desígnio", description: "Plano ou propósito secreto; intenção oculta" },
  { word: "destemido", description: "Que não tem medo, corajoso, intrépido" },
  { word: "devaneio", description: "Pensamento distraído; sonho acordado" },
  { word: "efêmero", description: "De curta duração, passageiro" },
  { word: "emaranhado", description: "Em estado confuso; situação complexa e difícil" },
  { word: "epítome", description: "Representação perfeita ou resumo essencial de algo" },
  { word: "equívoco", description: "Maldade, erro de interpretação; situação ambígua" },
  { word: "escárnio", description: "Zombaria ofensiva, deboche maldoso" },
  { word: "esdrúxulo", description: "Estranho, excêntrico, fora do comum" },
  { word: "estigma", description: "Marca de vergonha; cicatriz física ou emocional" },
  { word: "estupefato", description: "Atordoado, extremamente surpreso" },
  { word: "exortação", description: "Discurso para encorajar ou advertir veementemente" },
  { word: "exuberante", description: "Cheio de vida, energia e abundância" },
  { word: "fidedigno", description: "Confiável, digno de fé, verídico" },
  { word: "flibusteiro", description: "Pirata do Caribe; pessoa aventureira e audaciosa" },
  { word: "fulgurante", description: "Que brilha intensamente; rápido e impressionante" },
  { word: "grandiloquente", description: "Que fala de modo pomposo ou exagerado" },
  { word: "hégira", description: "Fuga de Maomé marcando o início do calendário islâmico" },
  { word: "hermético", description: "Completamente fechado; difícil de entender" },
  { word: "idílico", description: "Perfeitamente sereno e pacífico, como um idílio" },
  { word: "impávido", description: "Que não demonstra medo, corajoso" },
  { word: "inexorável", description: "Implacável, que não cede a pedidos" },
  { word: "insólito", description: "Incomum, estranho, fora do ordinário" },
  { word: "intrépido", description: "Audacioso, corajoso, destemido" },
  { word: "jubiloso", description: "Cheio de júbilo, extremamente alegre" },
  { word: "lúdico", description: "Relativo ao jogo; atividade prazerosa e recreativa" },
  { word: "magnânimo", description: "Generoso, que perdoa ofensas com nobreza" },
  { word: "mellifluo", description: "Doce como mel; voz ou música suave e agradável" },

  // Países (30)
  { word: "brasil", description: "Maior país da América do Sul, conhecido pelo Carnaval e futebol" },
  { word: "canadá", description: "País norte-americano com vastas florestas e invernos rigorosos" },
  { word: "japão", description: "Nação insular asiática conhecida por tecnologia e tradições milenares" },
  { word: "itália", description: "País europeu com formato de bota, berço do Império Romano" },
  { word: "méxico", description: "País da América do Norte com rica herança asteca e maia" },
  { word: "argentina", description: "País sul-americano famoso pelo tango e excelente carne" },
  { word: "alemanha", description: "País europeu líder em indústria e conhecido pela Oktoberfest" },
  { word: "austrália", description: "Continente-ilha no hemisfério sul com fauna única como cangurus" },
  { word: "egito", description: "País africano com pirâmides e história faraônica milenar" },
  { word: "índia", description: "País asiático populoso com diversidade cultural e espiritual" },
  { word: "rússia", description: "Maior país do mundo em extensão territorial" },
  { word: "frança", description: "País europeu famoso pela Torre Eiffel e gastronomia refinada" },
  { word: "espanha", description: "País ibérico conhecido pelo flamenco e arquitetura de Gaudí" },
  { word: "china", description: "País mais populoso do mundo com grande crescimento econômico" },
  { word: "holanda", description: "País europeu baixo conhecido por moinhos de vento e tulipas" },
  { word: "suiça", description: "País alpino europeu famoso por relógios e chocolates" },
  { word: "suecia", description: "País nórdico conhecido pelo Prêmio Nobel e design moderno" },
  { word: "noruega", description: "País escandinavo com fiordes espetaculares e altíssimo IDH" },
  { word: "grecia", description: "Berço da democracia e filosofia ocidental na Antiguidade" },
  { word: "turquia", description: "País euroasiático com rica história otomana e bizantina" },
  { word: "portugal", description: "País ibérico que colonizou o Brasil no século XVI" },
  { word: "cuba", description: "Maior ilha do Caribe, conhecida por charutos e revolução" },
  { word: "colombia", description: "País sul-americano com café de qualidade e cultura vibrante" },
  { word: "peru", description: "País andino com sítio arqueológico de Machu Picchu" },
  { word: "venezuela", description: "País sul-americano com as maiores reservas de petróleo" },
  { word: "chile", description: "País longo e estreito entre Andes e Pacífico na América do Sul" },
  { word: "bolivia", description: "País andino sem litoral com grande população indígena" },
  { word: "paraguai", description: "País sul-americano conhecido por Ciudad del Este e futebol" },
  { word: "uruguai", description: "Pequeno país sul-americano com altos índices de desenvolvimento" },
  { word: "equador", description: "País cortado pela linha do Equador com biodiversidade única" },

  // Pessoas famosas (30)
  { word: "einstein", description: "Físico alemão criador da teoria da relatividade" },
  { word: "darwin", description: "Naturalista inglês que formulou a teoria da evolução" },
  { word: "mozart", description: "Compositor austríaco prodígio do período clássico" },
  { word: "beethoven", description: "Gênio musical alemão que compôs mesmo surdo" },
  { word: "picasso", description: "Artista espanhol pioneiro do cubismo na pintura" },
  { word: "vangogh", description: "Pintor holandês pós-impressionista de 'Noite Estrelada'" },
  { word: "shakespeare", description: "Maior dramaturgo inglês, autor de 'Hamlet' e 'Romeu e Julieta'" },
  { word: "pelé", description: "Considerado por muitos o maior jogador de futebol de todos os tempos" },
  { word: "marilyn", description: "Ícone hollywoodiano dos anos 50, símbolo sexual eterno" },
  { word: "madonna", description: "Rainha do pop que revolucionou a música nos anos 80 e 90" },
  { word: "michaeljackson", description: "Rei do pop, artista recordista em vendas de discos" },
  { word: "elvis", description: "Rei do rock, ícone cultural dos anos 50 e 60" },
  { word: "freddie", description: "Vocalista lendário da banda Queen, autor de 'Bohemian Rhapsody'" },
  { word: "jobs", description: "Visionário co-fundador da Apple e pioneiro da computação pessoal" },
  { word: "gandhi", description: "Líder pacifista que libertou a Índia do colonialismo britânico" },
  { word: "lutherking", description: "Líder dos direitos civis nos EUA com discurso 'I Have a Dream'" },
  { word: "mandela", description: "Símbolo global de luta contra o apartheid na África do Sul" },
  { word: "disney", description: "Pioneiro da animação e criador do império do entretenimento" },
  { word: "tolkien", description: "Escritor britânico criador do universo de 'O Senhor dos Anéis'" },
  { word: "rowling", description: "Autora da série Harry Potter que revolucionou a literatura juvenil" },
  { word: "nietzsche", description: "Filósofo alemão que declarou 'Deus está morto'" },
  { word: "mariecurie", description: "Cientista pioneira no estudo da radioatividade, Nobel em Física e Química" },
  { word: "tesla", description: "Inventor visionário de sistemas elétricos de corrente alternada" },
  { word: "edison", description: "Inventor prolífico com mais de 1.000 patentes, incluindo a lâmpada" },
  { word: "dawnero", description: "Gênio renascentista italiano autor da Mona Lisa e inventor visionário" },
  { word: "freud", description: "Pai da psicanálise que revolucionou o estudo da mente humana" },
  { word: "chaplin", description: "Cineasta britânico criador do personagem Carlitos no cinema mudo" },
  { word: "kubrick", description: "Diretor de cinema perfeccionista de '2001' e 'Laranja Mecânica'" },
  { word: "bowie", description: "Artista musical camaleônico que reinventou seu estilo diversas vezes" },
  { word: "princesadiana", description: "Princesa de Gales conhecida como 'Princesa do Povo' nos anos 80-90" },

  // Lugares famosos (30)
  { word: "paris", description: "Cidade Luz, capital da França com Torre Eiffel e Louvre" },
  { word: "roma", description: "Cidade Eterna, capital da Itália com Coliseu e Fontana di Trevi" },
  { word: "novaiorque", description: "Maior cidade dos EUA com Estátua da Liberdade e Times Square" },
  { word: "londres", description: "Capital do Reino Unido com Big Ben e Palácio de Buckingham" },
  { word: "toquio", description: "Capital do Japão, metrópole futurista com tradições antigas" },
  { word: "sidney", description: "Maior cidade da Austrália com icônico Opera House" },
  { word: "riodejaneiro", description: "Cidade brasileira famosa pelo Cristo Redentor e praias" },
  { word: "machupicchu", description: "Cidade perdida dos Incas nos Andes peruanos" },
  { word: "grandecanion", description: "Desfiladeiro imenso esculpido pelo Rio Colorado nos EUA" },
  { word: "piramides", description: "Estruturas monumentais do Antigo Egito como tumbas faraônicas" },
  { word: "petra", description: "Cidade rosa esculpida em rocha na Jordânia, patrimônio mundial" },
  { word: "murdochina", description: "Grande muralha construída para proteger a China antiga" },
  { word: "alpes", description: "Cadeia montanhosa europeia com picos cobertos de neve" },
  { word: "amazonia", description: "Maior floresta tropical do mundo, pulmão do planeta" },
  { word: "sahara", description: "Maior deserto quente do mundo cobrindo o norte da África" },
  { word: "niagara", description: "Famosas cataratas entre EUA e Canadá" },
  { word: "everest", description: "Pico mais alto do mundo na cordilheira do Himalaia" },
  { word: "disney", description: "Parques temáticos famosos criados por Walt Disney" },
  { word: "hollywood", description: "Distrito de Los Angeles sede da indústria cinematográfica americana" },
  { word: "vegas", description: "Cidade do jogo e entretenimento no deserto de Nevada" },
  { word: "dubai", description: "Cidade dos Emirados Árabes com arranha-céus futuristas" },
  { word: "venezia", description: "Cidade italiana construída sobre canais, famosa pelos passeios de gôndola" },
  { word: "barcelona", description: "Cidade espanhola com arquitetura modernista de Gaudí" },
  { word: "kyoto", description: "Antiga capital do Japão com templos tradicionais e jardins zen" },
  { word: "angkor", description: "Complexo de templos no Camboja, maior monumento religioso do mundo" },
  { word: "ilhasmaldivas", description: "Paraíso tropical no Oceano Índico com águas cristalinas" },
  { word: "fiordes", description: "Enseadas marinhas alongadas entre montanhas, típicas da Noruega" },
  { word: "capadocia", description: "Região da Turquia com formações rochosas únicas e cidades subterrâneas" },
  { word: "santorini", description: "Ilha grega com arquitetura branca e azul sobre falésias" },
  { word: "ilhapascoa", description: "Ilha chilena famosa por suas misteriosas estátuas moai" },

  // Traços de personalidade (30)
  { word: "carismático", description: "Que atrai e cativa as pessoas naturalmente" },
  { word: "perspicaz", description: "Que percebe e compreende coisas rapidamente" },
  { word: "resiliente", description: "Capaz de se recuperar de adversidades" },
  { word: "empático", description: "Que se coloca no lugar do outro, compreendendo sentimentos alheios" },
  { word: "altruísta", description: "Que pratica o altruísmo, colocando os outros antes de si" },
  { word: "metódico", description: "Que age com método, de forma organizada e sistemática" },
  { word: "criativo", description: "Que tem capacidade de criar, inventar, inovar" },
  { word: "introspectivo", description: "Que tende a olhar para dentro, analisando seus próprios pensamentos" },
  { word: "extrovertido", description: "Sociável, que se volta mais para o exterior que para si mesmo" },
  { word: "magnânimo", description: "Generoso, que perdoa ofensas com nobreza de espírito" },
  { word: "perseverante", description: "Que persiste em seus objetivos apesar das dificuldades" },
  { word: "sincero", description: "Que fala e age com verdade, sem fingimento" },
  { word: "ousado", description: "Que tem coragem para enfrentar riscos e desafios" },
  { word: "prudente", description: "Cauteloso, que age com moderação e precaução" },
  { word: "sábio", description: "Que tem sabedoria, conhecimento profundo e bom julgamento" },
  { word: "humilde", description: "Que não tem orgulho excessivo, reconhece suas limitações" },
  { word: "ambicioso", description: "Que tem forte desejo de alcançar objetivos elevados" },
  { word: "idealista", description: "Que segue ideais, muitas vezes com certo desprezo pelo prático" },
  { word: "cético", description: "Que duvida sistematicamente, exigindo provas para crer" },
  { word: "otimista", description: "Que tende a ver o lado positivo das coisas" },
  { word: "pessimista", description: "Que tende a ver o lado negativo das coisas" },
  { word: "paciente", description: "Que sabe esperar e suportar adversidades sem irritação" },
  { word: "impaciente", description: "Que não tolera demoras ou obstáculos" },
  { word: "sensível", description: "Que sente com facilidade, emociona-se facilmente" },
  { word: "racional", description: "Que age baseado na razão mais que nas emoções" },
  { word: "espontâneo", description: "Que age naturalmente, sem planejamento ou artificialidade" },
  { word: "calculista", description: "Que planeja cuidadosamente suas ações, muitas vezes de forma fria" },
  { word: "temperamental", description: "De humor variável, que muda de atitude facilmente" },
  { word: "sedutor", description: "Que atrai e encanta, especialmente no campo amoroso" },
  { word: "disciplinado", description: "Que segue regras e métodos com rigor e ordem" },

  // Música (30)
  { word: "partitura", description: "Representação gráfica da música com notas e símbolos" },
  { word: "melodia", description: "Sucessão de sons musicais que formam uma linha musical reconhecível" },
  { word: "harmonia", description: "Combinação simultânea de notas musicais que soam agradavelmente" },
  { word: "ritmo", description: "Organização temporal dos sons musicais, padrão de batidas" },
  { word: "acorde", description: "Conjunto de três ou mais notas tocadas simultaneamente" },
  { word: "sopro", description: "Instrumentos musicais tocados com ar como flautas e trompetes" },
  { word: "percussão", description: "Instrumentos tocados por batida, como tambores e pratos" },
  { word: "sinfonia", description: "Composição musical extensa para orquestra, geralmente em quatro movimentos" },
  { word: "sonata", description: "Composição para um ou poucos instrumentos, geralmente em três ou quatro movimentos" },
  { word: "concerto", description: "Composição musical que destaca um solista acompanhado por orquestra" },
  { word: "ópera", description: "Drama musical encenado com cantores e orquestra" },
  { word: "coral", description: "Música composta para coro, muitas vezes com temas religiosos" },
  { word: "jazz", description: "Gênero musical originário dos EUA com improvisação e ritmos complexos" },
  { word: "blues", description: "Gênero musical de origem afro-americana com estrutura de doze compassos" },
  { word: "rock", description: "Gênero musical popular surgido nos anos 50 com guitarra elétrica" },
  { word: "samba", description: "Gênero musical brasileiro com raízes africanas, símbolo do Carnaval" },
  { word: "bossa", description: "Estilo musical brasileiro que mistura samba e jazz, popularizado nos anos 60" },
  { word: "funk", description: "Gênero musical com batida forte e ênfase no groove" },
  { word: "reggae", description: "Gênero musical jamaicano com batida característica e mensagens sociais" },
  { word: "hiphop", description: "Movimento cultural que inclui rap, DJing, breakdance e graffiti" },
  { word: "sertanejo", description: "Gênero musical brasileiro com raízes caipiras, muito popular no interior" },
  { word: "forró", description: "Gênero musical e dança típica do Nordeste brasileiro" },
  { word: "pagode", description: "Estilo musical brasileiro derivado do samba, com instrumentos como tantã e banjo" },
  { word: "mpb", description: "Música Popular Brasileira, movimento que mistura tradição e inovação" },
  { word: "trovador", description: "Compositor e cantor medieval; modernamente, cantor de música regional" },
  { word: "crooner", description: "Cantor que interpreta canções românticas com estilo suave" },
  { word: "cover", description: "Versão de uma música originalmente gravada por outro artista" },
  { word: "playlist", description: "Lista de músicas selecionadas para uma ocasião ou tema específico" },
  { word: "estrofe", description: "Conjunto de versos que formam uma unidade na estrutura de uma canção" },
  { word: "refrão", description: "Parte da música que se repete, geralmente a mais memorável" }
];
  

  // Preload sounds
  Object.values(sounds).forEach(sound => {
    sound.load();
    sound.volume = 0.3;
  });

  // Pixel fire effect
  function initFireEffect() {
    const canvas = fireCanvas;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Fire parameters
    const fireWidth = 100;
    const fireHeight = 100;
    const pixelSize = Math.max(5, Math.floor(canvas.width / fireWidth));
    
    // Create fire buffer
    const firePixels = new Array(fireWidth * fireHeight).fill(0);
    
    function updateFire() {
      // Move fire upwards
      for (let x = 0; x < fireWidth; x++) {
        for (let y = 1; y < fireHeight; y++) {
          const index = y * fireWidth + x;
          const newY = Math.max(0, y - Math.floor(Math.random() * 3));
          const newIndex = newY * fireWidth + x;
          firePixels[newIndex] = Math.max(0, firePixels[index] - Math.random() * 0.2);
        }
      }
      
      // Generate new fire at bottom
      for (let x = 0; x < fireWidth; x++) {
        const index = (fireHeight - 1) * fireWidth + x;
        firePixels[index] = Math.random() > 0.3 ? 1 : 0;
      }
      
      // Spread fire sideways
      for (let x = 1; x < fireWidth - 1; x++) {
        for (let y = 0; y < fireHeight; y++) {
          const index = y * fireWidth + x;
          if (firePixels[index] > 0.1) {
            const spread = Math.random() * 0.2;
            firePixels[index - 1] = Math.min(1, firePixels[index - 1] + spread);
            firePixels[index + 1] = Math.min(1, firePixels[index + 1] + spread);
          }
        }
      }
    }
    
    function renderFire() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let x = 0; x < fireWidth; x++) {
        for (let y = 0; y < fireHeight; y++) {
          const index = y * fireWidth + x;
          const intensity = firePixels[index];
          
          if (intensity > 0) {
            let r, g, b;
            if (intensity > 0.8) {
              r = 255;
              g = 255;
              b = 255 * (intensity - 0.8) * 5;
            } else if (intensity > 0.6) {
              r = 255;
              g = 255 * (intensity - 0.6) * 5;
              b = 0;
            } else if (intensity > 0.3) {
              r = 255;
              g = 165 * (intensity - 0.3) * 3.33;
              b = 0;
            } else {
              r = 255 * intensity * 3.33;
              g = 0;
              b = 0;
            }
            
            ctx.fillStyle = `rgba(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)}, ${intensity})`;
            ctx.fillRect(
              x * pixelSize, 
              canvas.height - (y * pixelSize), 
              pixelSize, 
              pixelSize
            );
          }
        }
      }
    }
    
    function animate() {
      updateFire();
      renderFire();
      animationFrameId = requestAnimationFrame(animate);
    }
    
    animate();
  }

  // Create fire sparks
  function createFireSparks() {
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        const spark = document.createElement("div");
        spark.classList.add("spark");
        
        const left = Math.random() * 100;
        spark.style.left = `${left}vw`;
        spark.style.bottom = "0";
        
        const hue = Math.random() * 20 + 10;
        spark.style.background = `linear-gradient(to top, hsl(${hue}, 100%, 50%), transparent`;
        
        const width = Math.random() * 4 + 2;
        spark.style.width = `${width}px`;
        spark.style.height = `${Math.random() * 30 + 15}px`;
        
        const duration = Math.random() * 5 + 3;
        spark.style.animationDuration = `${duration}s`;
        
        fireBackground.appendChild(spark);
        
        setTimeout(() => {
          spark.remove();
        }, duration * 1000);
      }, i * 100);
    }
  }

  // Create fire animation loop
  function startFireAnimation() {
    createFireSparks();
    setTimeout(startFireAnimation, 800);
    
    if (soundEnabled) {
      sounds.fire.loop = true;
      sounds.fire.play().catch(e => console.log("Fire sound error:", e));
    } else {
      sounds.fire.pause();
    }
  }

  function getRandomWord() {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    const selected = wordList[randomIndex];
    return {
      word: selected.word.toLowerCase(),
      hint: `DEFINIÇÃO: ${selected.description}\n\nDICA: ${generateSmartHint(selected.word)}`
    };
  }

  function initGame() {
    const { word, hint } = getRandomWord();
    selectedWord = normalizeWord(word);
    displayedWord = Array(selectedWord.length).fill("_");
    wrongGuesses = 0;

    wordDisplay.textContent = displayedWord.join(" ");
    wrongDisplay.textContent = wrongGuesses;
    message.textContent = "";
    message.className = "message";
    restartBtn.style.display = "none";
    
    // Formata a dica para melhor visualização
    const formattedHint = hint
      .replace(/\n/g, '<br>')
      .replace(/DEFINIÇÃO:/g, '<strong>DEFINIÇÃO:</strong>')
      .replace(/DICA:/g, '<strong>DICA:</strong>');
    
    hintText.innerHTML = formattedHint;
    
    // Reset hangman figure
    hangmanFigure.className = "hangman-figure";
    document.querySelector(".mouth").className = "mouth";
    document.querySelector(".blood").className = "blood";
    document.querySelector(".blood-stream").style.height = "0";
    document.querySelector(".blood-pool").style.height = "0";
    document.querySelectorAll(".blood-drip").forEach(drip => {
      drip.classList.remove("visible");
    });

    // Reset hearts
    hearts.forEach(heart => {
      heart.style.opacity = "1";
    });

    // Reset keyboard
    keyboard.innerHTML = "";
    for (let i = 65; i <= 90; i++) {
      const letter = String.fromCharCode(i).toLowerCase();
      const btn = document.createElement("button");
      btn.textContent = letter;
      btn.addEventListener("click", () => handleGuess(letter, btn));
      keyboard.appendChild(btn);
    }

    // Start fire animation
    initFireEffect();
    startFireAnimation();
  }

  function playSound(soundName) {
    if (!soundEnabled) return;
    
    const sound = sounds[soundName];
    sound.currentTime = 0;
    sound.play().catch(e => console.log("Audio play failed:", e));
  }

  function handleGuess(letter, btn) {
    playSound("click");
    btn.disabled = true;

    if (selectedWord.includes(letter)) {
      playSound("correct");
      btn.classList.add("correct");
      
      const rect = btn.getBoundingClientRect();
      createParticles(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        "#00ff7f",
        20
      );

      for (let i = 0; i < selectedWord.length; i++) {
        if (selectedWord[i] === letter) {
          displayedWord[i] = letter;
        }
      }
      wordDisplay.textContent = displayedWord.join(" ");
    } else {
      playSound("wrong");
      wrongGuesses++;
      wrongDisplay.textContent = wrongGuesses;
      btn.classList.add("wrong");
      
      hangmanFigure.classList.add(`show-${wrongGuesses}`);
      
      if (wrongGuesses <= hearts.length) {
        hearts[hearts.length - wrongGuesses].style.opacity = "0.3";
        const heartRect = hearts[hearts.length - wrongGuesses].getBoundingClientRect();
        createExplosion(
          heartRect.left + heartRect.width / 2,
          heartRect.top + heartRect.height / 2,
          0.5
        );
      }
      
      hangmanFigure.style.animation = "shake 0.5s";
      setTimeout(() => {
        hangmanFigure.style.animation = "";
      }, 500);
      
      const rect = btn.getBoundingClientRect();
      createExplosion(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        0.7
      );
      
      if (wrongGuesses >= 3) {
        const headRect = document.querySelector(".head").getBoundingClientRect();
        createBloodSplatter(
          headRect.left + headRect.width / 2,
          headRect.top + headRect.height / 2,
          8
        );
      }
    }

    checkGameStatus();
  }

  

  function checkGameStatus() {

    if (!displayedWord.includes("_")) {
      playSound("win");
      sounds.fire.pause();
      message.textContent = "🎉 PARABÉNS! VOCÊ VENCEU! 🎉";
      message.classList.add("show", "success");

      endGame();
      
      hangmanFigure.style.animation = "celebrate 2s";
      setTimeout(() => {
        hangmanFigure.style.animation = "";
      }, 2000);

      const winEffects = () => {
        const fireworks = document.createElement('div');
        fireworks.style.position = 'fixed';
        fireworks.style.top = '0';
        fireworks.style.left = '0';
        fireworks.style.width = '100%';
        fireworks.style.height = '100%';
        fireworks.style.background = 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)';
        fireworks.style.zIndex = '100';
        fireworks.style.animation = 'fadeOut 2s forwards';
        document.body.appendChild(fireworks);
        
        const style = document.createElement('style');
        style.textContent = `
          @keyframes fadeOut {
            0% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(1.5); }
          }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => {
          fireworks.remove();
          style.remove();
        }, 2000);
      };
      
      winEffects();
      
    } else if (wrongGuesses >= maxGuesses) {

      playSound("lose");
      sounds.fire.pause();


      message.textContent = `☠️ VOCÊ PERDEU! A PALAVRA ERA "${selectedWord.toUpperCase()}". ☠️`;
      message.classList.add("show", "error");
      endGame();
      
      hangmanFigure.classList.add("dead-eyes", "bleeding");
      document.querySelector(".mouth").classList.add("dead");
      document.querySelector(".blood").classList.add("visible");
      document.querySelector(".blood-stream").style.height = "140px";
      document.querySelector(".blood-pool").style.height = "30px";
      document.querySelectorAll(".blood-drip").forEach(drip => {
        drip.classList.add("visible");
      });
      
      hangmanFigure.style.animation = "dead 1s";
      setTimeout(() => {
        hangmanFigure.style.animation = "";
      }, 1000);
      
      const headRect = document.querySelector(".head").getBoundingClientRect();
      for (let i = 0; i < 50; i++) {
        setTimeout(() => {
          createBloodSplatter(
            headRect.left + headRect.width / 2,
            headRect.top + headRect.height / 2,
            5
          );
        }, i * 50);
      }
      
      setTimeout(() => {
        createExplosion(
          headRect.left + headRect.width / 2,
          headRect.top + headRect.height / 2,
          1.5
        );
      }, 300);
    }
  }

  function endGame() {
    const buttons = keyboard.querySelectorAll("button");
    buttons.forEach(btn => btn.disabled = true);
    restartBtn.style.display = "flex";
    
    // Para o som do fogo
    sounds.fire.pause();
        
  }

  function normalizeWord(word) {
    return word
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z]/g, "");
  }

  function generateSmartHint(word) {
    const wordLength = word.length;
    let hint = `PALAVRA COM ${wordLength} LETRAS: `;
    
    if (word.endsWith('ção') || word.endsWith('são')) {
      hint += "Provavelmente um substantivo que indica ação ou processo. ";
    } else if (word.endsWith('mente')) {
      hint += "Provavelmente um advérbio de modo. ";
    } else if (word.endsWith('ar') || word.endsWith('er') || word.endsWith('ir')) {
      hint += "Provavelmente um verbo no infinitivo. ";
    } else if (wordLength <= 4) {
      hint += "Palavra curta, pode ser artigo, preposição ou substantivo comum. ";
    } else if (wordLength <= 6) {
      hint += "Palavra de tamanho médio, possivelmente um substantivo ou verbo. ";
    } else {
      hint += "Palavra longa, frequentemente um substantivo ou adjetivo. ";
    }
    
    if (word.includes('rr')) hint += "Contém o dígrafo 'RR' (som forte). ";
    if (word.includes('ss')) hint += "Contém o dígrafo 'SS' (som sibilante). ";
    if (word.includes('nh')) hint += "Contém o dígrafo 'NH' (som nasal). ";
    
    if (word.startsWith('a')) hint += "Começa com a vogal 'A'. ";
    if (word.startsWith('z')) hint += "Começa com a consoante 'Z' (som de 'zê'). ";
    
    return hint;
  }

  function createParticles(x, y, color, count = 30) {
    for (let i = 0; i < count; i++) {
      const particle = document.createElement("div");
      particle.classList.add("particle");
      particle.style.backgroundColor = color;
      particle.style.width = `${Math.random() * 10 + 5}px`;
      particle.style.height = particle.style.width;
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 8 + 3;
      const xVelocity = Math.cos(angle) * velocity;
      const yVelocity = Math.sin(angle) * velocity;
      
      particlesContainer.appendChild(particle);
      
      let opacity = 1;
      const fadeInterval = setInterval(() => {
        opacity -= 0.05;
        particle.style.opacity = opacity;
        if (opacity <= 0) {
          clearInterval(fadeInterval);
          particle.remove();
        }
      }, 50);
      
      let posX = x;
      let posY = y;
      const moveInterval = setInterval(() => {
        posX += xVelocity;
        posY += yVelocity + 0.8;
        particle.style.left = `${posX}px`;
        particle.style.top = `${posY}px`;
      }, 30);
      
      setTimeout(() => {
        clearInterval(moveInterval);
      }, 1000);
    }
  }

  function createBloodSplatter(x, y, count = 20) {
    for (let i = 0; i < count; i++) {
      const bloodDrop = document.createElement("div");
      bloodDrop.classList.add("particle");
      bloodDrop.style.backgroundColor = `hsl(${Math.random() * 10 + 350}, 80%, 50%)`;
      bloodDrop.style.width = `${Math.random() * 8 + 3}px`;
      bloodDrop.style.height = `${Math.random() * 8 + 3}px`;
      bloodDrop.style.borderRadius = "50%";
      bloodDrop.style.left = `${x}px`;
      bloodDrop.style.top = `${y}px`;
      bloodDrop.style.boxShadow = `0 0 5px ${bloodDrop.style.backgroundColor}`;
      
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 5 + 2;
      const xVelocity = Math.cos(angle) * velocity;
      const yVelocity = Math.sin(angle) * velocity;
      
      document.body.appendChild(bloodDrop);
      
      let opacity = 1;
      const fadeInterval = setInterval(() => {
        opacity -= 0.03;
        bloodDrop.style.opacity = opacity;
        if (opacity <= 0) {
          clearInterval(fadeInterval);
          bloodDrop.remove();
        }
      }, 50);
      
      let posX = x;
      let posY = y;
      const moveInterval = setInterval(() => {
        posX += xVelocity;
        posY += yVelocity + 0.5;
        bloodDrop.style.left = `${posX}px`;
        bloodDrop.style.top = `${posY}px`;
      }, 30);
      
      setTimeout(() => {
        clearInterval(moveInterval);
      }, 2000);
    }
  }

  function createExplosion(x, y, size = 1) {
    const colors = ['#ff2a00', '#ff8c00', '#ffcc00', '#ffffff'];
    const container = document.querySelector('.game-container');

    for (let i = 0; i < 50 * size; i++) {
      const particle = document.createElement("div");
      particle.classList.add("particle");
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.width = `${Math.random() * 8 * size + 4}px`;
      particle.style.height = particle.style.width;
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.borderRadius = "50%";
      particle.style.boxShadow = `0 0 ${5 * size}px ${particle.style.backgroundColor}`;
      
      container.appendChild(particle);
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 10 * size + 5;
      const xVelocity = Math.cos(angle) * velocity;
      const yVelocity = Math.sin(angle) * velocity;
      
      document.body.appendChild(particle);
      
      let opacity = 1;
      const fadeInterval = setInterval(() => {
        opacity -= 0.02;
        particle.style.opacity = opacity;
        if (opacity <= 0) {
          clearInterval(fadeInterval);
          particle.remove();
        }
      }, 50);
      
      let posX = x;
      let posY = y;
      const moveInterval = setInterval(() => {
        posX += xVelocity;
        posY += yVelocity + 0.5;
        particle.style.left = `${posX}px`;
        particle.style.top = `${posY}px`;
      }, 30);
      
      setTimeout(() => {
        clearInterval(moveInterval);
      }, 2000);
    }
  }

  restartBtn.addEventListener("click", () => {
    playSound("click");
    initGame();
    sounds.win.pause();
    sounds.lose.pause();
  });

  document.addEventListener("keydown", (e) => {
    if (e.keyCode >= 65 && e.keyCode <= 90) {
      const letter = e.key.toLowerCase();
      const button = Array.from(keyboard.querySelectorAll("button")).find(
        btn => btn.textContent === letter && !btn.disabled
      );
      if (button) button.click();
    }
  });

  const style = document.createElement("style");
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0) translateZ(10px); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-10px) translateZ(10px); }
      20%, 40%, 60%, 80% { transform: translateX(10px) translateZ(10px); }
    }
    
    @keyframes dead {
      0% { transform: rotate(0) translateZ(10px); }
      100% { transform: rotate(90deg) translateZ(10px); }
    }
  `;
  document.head.appendChild(style);

  window.onload = initGame;

  window.addEventListener('resize', () => {
    const canvas = fireCanvas;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
