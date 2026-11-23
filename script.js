const canvasNeve = document.getElementById('canvas-neve'); // Obtém o elemento canvas onde a neve será desenhada
const ctx = canvasNeve.getContext('2d'); // Obtém o contexto 2D para renderizar os flocos de neve
const treno = document.getElementById('papai-noel-treno'); // Obtém o contêiner SVG do trenó do Papai Noel
const contadorTreno = document.getElementById('contador-treno'); // Obtém o texto que mostra a contagem regressiva de 4 segundos
const grupoLuzes = document.getElementById('luzes-arvore'); // Obtém o grupo SVG onde as luzes piscantes serão inseridas
const btnMusica = document.getElementById('btn-musica'); // Obtém o botão de ligar/pausar música natalina
const btnLuzes = document.getElementById('btn-luzes'); // Obtém o botão que alterna o ritmo das luzes da árvore
const btnVoz = document.getElementById('btn-voz'); // Obtém o botão de leitura em voz alta (Web Speech API)
const btnTema = document.getElementById('btn-tema'); // Obtém o botão de alternância entre tema claro e escuro
const btnCelebrar = document.getElementById('btn-celebrar'); // Obtém o botão principal de celebração
const textoHomenagem = document.getElementById('texto-homenagem'); // Obtém o parágrafo que será narrado pelo leitor de voz

let flocos = []; // Inicializa o array que armazenará as coordenadas e velocidades de cada floco de neve
const quantidadeFlocos = 130; // Define a quantidade total de flocos simultâneos na tela

function ajustarTamanhoCanvas() { // Define a função que sincroniza o canvas com o tamanho da janela
  canvasNeve.width = window.innerWidth; // Ajusta a largura interna do canvas para a largura atual da tela
  canvasNeve.height = window.innerHeight; // Ajusta a altura interna do canvas para a altura atual da tela
} // Encerra a função de redimensionamento

function criarFlocos() { // Cria todos os flocos de neve com posições, raios e velocidades aleatórias
  flocos = []; // Reinicia a lista de flocos antes de preencher
  for (let i = 0; i < quantidadeFlocos; i++) { // Percorre de 0 até a quantidade total desejada de flocos
    flocos.push({ // Adiciona um objeto representando um floco individual
      x: Math.random() * canvasNeve.width, // Define posição horizontal aleatória dentro da tela
      y: Math.random() * canvasNeve.height, // Define posição vertical aleatória dentro da tela
      raio: Math.random() * 3.2 + 1.2, // Define tamanho variado para dar sensação de profundidade
      velocidadeY: Math.random() * 1.4 + 0.6, // Define a velocidade de queda vertical do floco
      oscilacao: Math.random() * Math.PI * 2, // Define fase inicial do balanço horizontal causado pelo vento
      opacidade: Math.random() * 0.65 + 0.25 // Define transparência variada para aspecto natural
    }); // Encerra o objeto do floco
  } // Encerra o laço de criação
} // Encerra a função criarFlocos

function animarNeve() { // Atualiza e redesenha os flocos de neve a cada quadro de animação
  ctx.clearRect(0, 0, canvasNeve.width, canvasNeve.height); // Limpa o quadro anterior do canvas antes de redesenhar
  const modoClaroAtivo = document.body.classList.contains('tema-claro'); // Verifica se o tema claro está ativo para ajustar a cor da neve

  for (const floco of flocos) { // Percorre cada floco cadastrado no array
    floco.y += floco.velocidadeY; // Move o floco para baixo conforme sua velocidade vertical
    floco.oscilacao += 0.015; // Avança o ângulo da ondulação do vento
    floco.x += Math.sin(floco.oscilacao) * 0.65; // Aplica balanço suave lateral imitando neve real

    if (floco.y > canvasNeve.height) { // Verifica se o floco ultrapassou a parte inferior da tela
      floco.y = -6; // Reposiciona o floco logo acima do topo da tela
      floco.x = Math.random() * canvasNeve.width; // Sorteia uma nova coluna horizontal para o floco
    } // Encerra o reposicionamento vertical

    ctx.beginPath(); // Inicia o desenho de um novo círculo no canvas
    ctx.arc(floco.x, floco.y, floco.raio, 0, Math.PI * 2); // Desenha o floco redondo nas coordenadas atuais
    ctx.fillStyle = modoClaroAtivo ? `rgba(14, 116, 144, ${floco.opacidade * 0.55})` : `rgba(255, 255, 255, ${floco.opacidade})`; // Escolhe cor visível tanto no tema escuro quanto no claro
    ctx.fill(); // Preenche o círculo desenhado na tela
  } // Encerra o laço de desenho dos flocos

  requestAnimationFrame(animarNeve); // Solicita ao navegador o próximo quadro suave (60 FPS)
} // Encerra a função animarNeve

function montarLuzesArvore() { // Cria dinamicamente as lâmpadas piscantes sobre os galhos da árvore SVG
  const coordenadasLuzes = [ // Lista fixa de posições (x, y) distribuídas de forma equilibrada pela árvore
    { x: 160, y: 92 }, { x: 136, y: 120 }, { x: 184, y: 120 }, // Luzes da copa superior
    { x: 118, y: 152 }, { x: 152, y: 158 }, { x: 196, y: 150 }, // Luzes da base da copa
    { x: 130, y: 190 }, { x: 175, y: 194 }, { x: 96, y: 222 }, // Luzes da camada intermediária alta
    { x: 140, y: 230 }, { x: 188, y: 228 }, { x: 224, y: 220 }, // Luzes da camada intermediária baixa
    { x: 112, y: 266 }, { x: 160, y: 274 }, { x: 208, y: 266 }, // Luzes da camada inferior alta
    { x: 76, y: 306 }, { x: 124, y: 316 }, { x: 168, y: 318 }, // Luzes da camada inferior esquerda e centro
    { x: 212, y: 314 }, { x: 244, y: 304 } // Luzes da camada inferior direita
  ]; // Encerra a lista de coordenadas das lâmpadas

  const paletaCores = ['#ef4444', '#facc15', '#38bdf8', '#4ade80', '#f472b6']; // Define as 5 cores natalinas dos LEDs
  const svgNS = 'http://www.w3.org/2000/svg'; // Define o namespace oficial obrigatório para criar elementos SVG via JS

  coordenadasLuzes.forEach((ponto, indice) => { // Percorre cada ponto para gerar sua lâmpada correspondente
    const lampada = document.createElementNS(svgNS, 'circle'); // Cria um elemento <circle> válido dentro do SVG
    const cor = paletaCores[indice % paletaCores.length]; // Seleciona uma cor de forma cíclica na paleta

    lampada.setAttribute('cx', ponto.x); // Define a posição horizontal da lâmpada na árvore
    lampada.setAttribute('cy', ponto.y); // Define a posição vertical da lâmpada na árvore
    lampada.setAttribute('r', '6'); // Define o raio de cada lâmpada LED
    lampada.setAttribute('fill', cor); // Aplica a cor selecionada ao preenchimento do LED
    lampada.setAttribute('class', 'luz-led'); // Aplica a classe CSS que faz a lâmpada piscar
    lampada.style.animationDelay = `${(indice % 5) * 0.28}s`; // Defasa o tempo de cada lâmpada para piscar de forma alternada
    lampada.style.filter = `drop-shadow(0 0 8px ${cor})`; // Adiciona aura luminosa na própria cor da lâmpada

    grupoLuzes.appendChild(lampada); // Insere a lâmpada pronta dentro do grupo SVG da árvore
  }); // Encerra a iteração sobre as coordenadas
} // Encerra a função montarLuzesArvore

let segundosRestantes = 4; // Controla a contagem visual de 4 segundos até o próximo voo do trenó

function dispararPassagemTreno() { // Executa uma nova travessia do Papai Noel pela tela
  treno.classList.remove('voando'); // Remove a classe de animação para reiniciar o trajeto do zero
  void treno.offsetWidth; // Força o navegador a recalcular o layout para reativar o keyframe CSS
  treno.classList.add('voando'); // Reaplica a classe que faz o trenó cruzar o céu
  segundosRestantes = 4; // Reinicia a contagem regressiva exibida na interface
  contadorTreno.textContent = '🛷 Papai Noel passando agora!'; // Atualiza o aviso visual durante a travessia
} // Encerra a função dispararPassagemTreno

function iniciarCicloTreno() { // Configura o ciclo exato de 4 segundos para o trenó do Papai Noel
  dispararPassagemTreno(); // Dispara a primeira passagem imediatamente ao carregar a página
  setInterval(dispararPassagemTreno, 4000); // Agenda uma nova passagem exata a cada 4000 milissegundos (4 segundos)

  setInterval(() => { // Atualiza o indicador de contagem regressiva segundo a segundo
    segundosRestantes -= 1; // Decrementa 1 segundo do contador visual
    if (segundosRestantes > 0) { // Verifica se ainda faltam segundos para a próxima passagem
      contadorTreno.textContent = `🛷 Próxima passagem do trenó em ${segundosRestantes}s`; // Atualiza o texto na tela
    } // Encerra a verificação do contador
  }, 1000); // Executa a atualização visual a cada 1 segundo
} // Encerra a função iniciarCicloTreno

let audioCtx = null; // Armazena o contexto de áudio da Web Audio API (criado após interação do usuário)
let musicaTocando = false; // Controla se a trilha sonora natalina está tocando no momento
let temporizadorNota = null; // Guarda o ID do setTimeout para conseguir pausar a música imediatamente
let indiceNotaAtual = 0; // Indica qual nota da melodia "Jingle Bells" será tocada em seguida

const melodiaNatal = [ // Partitura simplificada de "Jingle Bells" com frequência (Hz) e duração (em batidas)
  { freq: 659.25, dur: 1 }, { freq: 659.25, dur: 1 }, { freq: 659.25, dur: 2 }, // Jin-gle bells
  { freq: 659.25, dur: 1 }, { freq: 659.25, dur: 1 }, { freq: 659.25, dur: 2 }, // Jin-gle bells
  { freq: 659.25, dur: 1 }, { freq: 783.99, dur: 1 }, { freq: 523.25, dur: 1.5 }, { freq: 587.33, dur: 0.5 }, { freq: 659.25, dur: 4 }, // Jin-gle all the way
  { freq: 698.46, dur: 1 }, { freq: 698.46, dur: 1 }, { freq: 698.46, dur: 1.5 }, { freq: 698.46, dur: 0.5 }, // Oh what fun it
  { freq: 698.46, dur: 1 }, { freq: 659.25, dur: 1 }, { freq: 659.25, dur: 1 }, { freq: 659.25, dur: 0.5 }, { freq: 659.25, dur: 0.5 }, // is to ride in a
  { freq: 659.25, dur: 1 }, { freq: 587.33, dur: 1 }, { freq: 587.33, dur: 1 }, { freq: 659.25, dur: 1 }, { freq: 587.33, dur: 2 }, { freq: 783.99, dur: 2 }, // one-horse o-pen sleigh
  { freq: 659.25, dur: 1 }, { freq: 659.25, dur: 1 }, { freq: 659.25, dur: 2 }, // Jin-gle bells (repetição)
  { freq: 659.25, dur: 1 }, { freq: 659.25, dur: 1 }, { freq: 659.25, dur: 2 }, // Jin-gle bells (repetição)
  { freq: 659.25, dur: 1 }, { freq: 783.99, dur: 1 }, { freq: 523.25, dur: 1.5 }, { freq: 587.33, dur: 0.5 }, { freq: 659.25, dur: 4 }, // Jin-gle all the way
  { freq: 698.46, dur: 1 }, { freq: 698.46, dur: 1 }, { freq: 698.46, dur: 1.5 }, { freq: 698.46, dur: 0.5 }, // Oh what fun it
  { freq: 698.46, dur: 1 }, { freq: 659.25, dur: 1 }, { freq: 659.25, dur: 1 }, { freq: 659.25, dur: 0.5 }, { freq: 659.25, dur: 0.5 }, // is to ride in a
  { freq: 783.99, dur: 1 }, { freq: 783.99, dur: 1 }, { freq: 698.46, dur: 1 }, { freq: 587.33, dur: 1 }, { freq: 523.25, dur: 4 } // one-horse o-pen sleigh (final)
]; // Encerra a partitura da melodia natalina

function tocarNotaCaixinha(frequencia, duracaoSegundos) { // Sintetiza uma nota com timbre suave de caixinha de música
  const osciladorPrincipal = audioCtx.createOscillator(); // Cria o gerador de onda sonora principal
  const osciladorBrilho = audioCtx.createOscillator(); // Cria uma segunda onda uma oitava acima para brilho cristalino
  const ganho = audioCtx.createGain(); // Cria o controle de volume para suavizar ataque e decaimento

  osciladorPrincipal.type = 'sine'; // Usa onda senoidal pura para som doce e agradável
  osciladorBrilho.type = 'triangle'; // Usa onda triangular suave como harmônico de sino
  osciladorPrincipal.frequency.setValueAtTime(frequencia, audioCtx.currentTime); // Ajusta a frequência principal da nota
  osciladorBrilho.frequency.setValueAtTime(frequencia * 2, audioCtx.currentTime); // Ajusta o harmônico na oitava superior

  ganho.gain.setValueAtTime(0.001, audioCtx.currentTime); // Inicia em silêncio mínimo para evitar estalos de áudio
  ganho.gain.exponentialRampToValueAtTime(0.14, audioCtx.currentTime + 0.03); // Sobe o volume suavemente no ataque
  ganho.gain.exponentialRampToValueAtTime(0.0008, audioCtx.currentTime + duracaoSegundos); // Faz o som desaparecer como um sino

  osciladorPrincipal.connect(ganho); // Liga a onda principal ao controle de volume
  osciladorBrilho.connect(ganho); // Liga o harmônico de sino ao mesmo controle de volume
  ganho.connect(audioCtx.destination); // Envia o áudio final para os alto-falantes do dispositivo

  osciladorPrincipal.start(); // Inicia a reprodução da onda principal
  osciladorBrilho.start(); // Inicia a reprodução da onda harmônica
  osciladorPrincipal.stop(audioCtx.currentTime + duracaoSegundos + 0.02); // Encerra a onda principal após a duração da nota
  osciladorBrilho.stop(audioCtx.currentTime + duracaoSegundos + 0.02); // Encerra a onda harmônica após a duração da nota
} // Encerra a função sintetizadora de notas

function tocarProximaNota() { // Reproduz a melodia continuamente nota por nota enquanto estiver ligada
  if (!musicaTocando) return; // Interrompe imediatamente se o usuário tiver pausado a música

  const nota = melodiaNatal[indiceNotaAtual]; // Seleciona o objeto da nota atual na partitura
  const duracaoMs = nota.dur * 290; // Converte a duração rítmica em milissegundos (andamento natalino alegre)
  tocarNotaCaixinha(nota.freq, duracaoMs / 1000); // Toca a nota sintetizada na duração calculada

  indiceNotaAtual = (indiceNotaAtual + 1) % melodiaNatal.length; // Avança para a próxima nota e reinicia ao fim da música
  temporizadorNota = setTimeout(tocarProximaNota, duracaoMs); // Agenda a execução exata da próxima nota
} // Encerra a função tocarProximaNota

function alternarMusica(forcarLigar = false) { // Liga ou pausa a trilha sonora natalina
  if (!audioCtx) { // Verifica se o contexto de áudio ainda não foi criado
    audioCtx = new (window.AudioContext || window.webkitAudioContext)(); // Inicializa a Web Audio API com suporte compatível
  } // Encerra a criação do contexto de áudio

  if (audioCtx.state === 'suspended') { // Verifica se o navegador suspendeu o áudio por política de autoplay
    audioCtx.resume(); // Retoma o motor de áudio após o clique do usuário
  } // Encerra a retomada do contexto

  if (musicaTocando && !forcarLigar) { // Se estiver tocando e o botão for clicado para pausar
    musicaTocando = false; // Atualiza o estado para pausado
    clearTimeout(temporizadorNota); // Cancela o agendamento da próxima nota
    btnMusica.textContent = '🎵 Tocar Música'; // Atualiza o rótulo do botão
    btnMusica.setAttribute('aria-pressed', 'false'); // Atualiza o estado acessível do botão
  } else if (!musicaTocando) { // Se estiver pausada e precisar iniciar
    musicaTocando = true; // Atualiza o estado para tocando
    btnMusica.textContent = '⏸️ Pausar Música'; // Atualiza o rótulo do botão para pausa
    btnMusica.setAttribute('aria-pressed', 'true'); // Atualiza o estado acessível do botão
    tocarProximaNota(); // Inicia o loop musical
  } // Encerra a lógica condicional de liga/pausa
} // Encerra a função alternarMusica

const modosLuz = ['', 'modo-festa', 'modo-suave']; // Lista os três ritmos disponíveis para o pisca-pisca da árvore
const nomesModosLuz = ['✨ Luzes: Padrão', '⚡ Luzes: Festa', '🌙 Luzes: Suave']; // Rótulos correspondentes para o botão
let indiceModoLuz = 0; // Guarda o índice do modo de iluminação atual

function alternarModoLuzes() { // Alterna ciclicamente a velocidade do pisca-pisca da árvore
  document.body.classList.remove('modo-festa', 'modo-suave'); // Remove eventuais classes anteriores de ritmo
  indiceModoLuz = (indiceModoLuz + 1) % modosLuz.length; // Avança para o próximo modo da lista
  const classeNova = modosLuz[indiceModoLuz]; // Obtém a nova classe CSS correspondente
  if (classeNova) document.body.classList.add(classeNova); // Aplica a classe no body se não for o modo padrão
  btnLuzes.textContent = nomesModosLuz[indiceModoLuz]; // Atualiza o texto do botão para refletir o modo ativo
} // Encerra a função alternarModoLuzes

function alternarLeituraVoz() { // Lê a homenagem em voz alta em português usando a Web Speech API
  if (!('speechSynthesis' in window)) { // Verifica se o navegador suporta síntese de voz
    alert('Seu navegador não suporta leitura em voz alta.'); // Informa o usuário caso o recurso não exista
    return; // Sai da função para evitar erros
  } // Encerra a verificação de suporte

  if (window.speechSynthesis.speaking) { // Verifica se já existe uma narração em andamento
    window.speechSynthesis.cancel(); // Interrompe a leitura atual imediatamente
    btnVoz.textContent = '🔊 Ouvir Homenagem'; // Restaura o texto original do botão
    btnVoz.setAttribute('aria-pressed', 'false'); // Atualiza o atributo acessível
    return; // Encerra a função após cancelar a fala
  } // Encerra o controle de parada

  const fala = new SpeechSynthesisUtterance(`Feliz Natal! ${textoHomenagem.textContent.trim()}`); // Cria o objeto de fala com a saudação e a homenagem
  fala.lang = 'pt-BR'; // Define o idioma de pronúncia como português do Brasil
  fala.rate = 0.98; // Define velocidade natural e acolhedora de leitura
  fala.onend = () => { // Define o que acontece quando a leitura termina naturalmente
    btnVoz.textContent = '🔊 Ouvir Homenagem'; // Restaura o rótulo do botão
    btnVoz.setAttribute('aria-pressed', 'false'); // Marca o botão como inativo novamente
  }; // Encerra o callback de término

  btnVoz.textContent = '⏹️ Parar Leitura'; // Indica que o botão agora serve para interromper a narração
  btnVoz.setAttribute('aria-pressed', 'true'); // Atualiza o estado acessível para ativo
  window.speechSynthesis.speak(fala); // Inicia a narração em voz alta
} // Encerra a função alternarLeituraVoz

function alternarTema() { // Alterna a página entre Noite Natalina (escuro) e Neve Clara (claro)
  const ficouClaro = document.body.classList.toggle('tema-claro'); // Adiciona ou remove a classe do tema claro no body
  btnTema.textContent = ficouClaro ? '🌙 Tema Escuro' : '☀️ Tema Claro'; // Atualiza o ícone e texto do botão de tema
} // Encerra a função alternarTema

btnMusica.addEventListener('click', () => alternarMusica(false)); // Liga o evento de clique do botão de música
btnLuzes.addEventListener('click', alternarModoLuzes); // Liga o evento de clique para alternar o pisca-pisca
btnVoz.addEventListener('click', alternarLeituraVoz); // Liga o evento de clique do leitor de voz
btnTema.addEventListener('click', alternarTema); // Liga o evento de clique do alternador de tema
btnCelebrar.addEventListener('click', () => { // Liga o botão principal para acender a experiência completa
  alternarMusica(true); // Garante que a música comece a tocar
  dispararPassagemTreno(); // Faz o Papai Noel passar na hora como resposta imediata ao clique
}); // Encerra o evento do botão celebrar

window.addEventListener('resize', () => { // Atualiza o canvas caso a janela do navegador seja redimensionada
  ajustarTamanhoCanvas(); // Recalcula a largura e altura do canvas de neve
  criarFlocos(); // Redistribui os flocos proporcionalmente à nova área
}); // Encerra o ouvinte de redimensionamento

ajustarTamanhoCanvas(); // Executa o ajuste inicial do canvas ao carregar o script
criarFlocos(); // Gera os primeiros 130 flocos de neve
animarNeve(); // Inicia o loop contínuo de queda da neve
montarLuzesArvore(); // Injeta e ilumina as 20 lâmpadas piscantes na árvore de Natal
iniciarCicloTreno(); // Inicia a passagem recorrente do Papai Noel a cada 4 segundos