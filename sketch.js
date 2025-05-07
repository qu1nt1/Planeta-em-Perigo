let planetaX, planetaY;
let raioOrbita = 130;
let angulo = 0;
let numeroLuas = 3;
let velocidadeRotacao = 0.05;
let direcaoRotacao = 0;

let luas = [];
let inimigos = [];
let intervaloSpawn = 60;
let contadorFrames = 0;

let pontuacao = 0;
let fimDeJogo = false;
let nivelAumentado = false;
let vidas = 3;

let imagemPlaneta;
let imagemLua;
let imagemFundo;
let imagemNivelUp;
let imagensInimigos = [];

let velocidadeInimigo = 1.5;

let musicaFundo;
let somNivelUp;
let somDerrota;

let tamanhoLua = 25;

function preload() {
  imagemPlaneta = loadImage('assets/planet.png');
  imagemLua = loadImage('assets/moon.png');
  imagemFundo = loadImage('assets/background.png');
  imagemNivelUp = loadImage('assets/levelup.png');
  for (let i = 1; i <= 3; i++) {
    imagensInimigos.push(loadImage('assets/enemy' + i + '.png'));
  }
  musicaFundo = loadSound('assets/bgmusic.mp3');
  somNivelUp = loadSound('assets/levelup.mp3');
  somDerrota = loadSound('assets/defeat.mp3');
}

function setup() {
  createCanvas(1600, 900);
  planetaX = width / 2;
  planetaY = height / 2;

  musicaFundo.setLoop(true);
  musicaFundo.play();
}

function draw() {
  imageMode(CORNER);
  image(imagemFundo, 0, 0, width, height);

  if (fimDeJogo) {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(32);
    text("Fim de Jogo", width / 2, height / 2 - 20);
    textSize(20);
    text("Pontuação: " + pontuacao, width / 2, height / 2 + 20);
    text("Pressione R para reiniciar", width / 2, height / 2 + 50);
    return;
  }

  if (nivelAumentado) {
    desenharTelaNivelUp();
    return;
  }

  angulo += direcaoRotacao * velocidadeRotacao;

  imageMode(CENTER);
  image(imagemPlaneta, planetaX, planetaY, 120, 120);

  luas = [];
  for (let i = 0; i < numeroLuas; i++) {
    let anguloLua = angulo + TWO_PI * i / numeroLuas;
    let luaX = planetaX + raioOrbita * cos(anguloLua);
    let luaY = planetaY + raioOrbita * sin(anguloLua);
    image(imagemLua, luaX, luaY, tamanhoLua, tamanhoLua);
    luas.push({ x: luaX, y: luaY });
  }

  for (let i = inimigos.length - 1; i >= 0; i--) {
    let inimigo = inimigos[i];

    let dx = planetaX - inimigo.x;
    let dy = planetaY - inimigo.y;
    let distanciaCentro = sqrt(dx * dx + dy * dy);
    inimigo.x += (dx / distanciaCentro) * inimigo.velocidade;
    inimigo.y += (dy / distanciaCentro) * inimigo.velocidade;

    image(inimigo.img, inimigo.x, inimigo.y, 40, 40);

    for (let lua of luas) {
      let d = dist(inimigo.x, inimigo.y, lua.x, lua.y);
      if (d < tamanhoLua / 2 + 10) {
        inimigos.splice(i, 1);
        pontuacao++;

        if (pontuacao % 25 === 0) {
          nivelAumentado = true;
          somNivelUp.play();
          velocidadeInimigo += 0.3;
          intervaloSpawn = max(10, intervaloSpawn - 6);
        }
        break;
      }
    }

    let dPlaneta = dist(inimigo.x, inimigo.y, planetaX, planetaY);
    if (dPlaneta < 60) {
      inimigos.splice(i, 1);
      vidas--;
      if (vidas <= 0 && !fimDeJogo) {
        fimDeJogo = true;
        somDerrota.play();
        musicaFundo.stop();
      }
    }
  }

  contadorFrames++;
  if (contadorFrames % intervaloSpawn === 0) {
    gerarInimigo();
  }

  fill(255);
  textSize(20);
  textAlign(LEFT, TOP);
  text("Pontuação: " + pontuacao, 10, 10);
  text("Vidas: " + vidas, 10, 40);
}

function desenharTelaNivelUp() {
  imageMode(CORNER);
  image(imagemNivelUp, 0, 0, width, height);
}

function gerarInimigo() {
  let angulo = random(TWO_PI);
  let distancia = 800;
  let x = planetaX + distancia * cos(angulo);
  let y = planetaY + distancia * sin(angulo);
  let img = random(imagensInimigos);
  inimigos.push({ x: x, y: y, velocidade: velocidadeInimigo, img: img });
}

function keyPressed() {
  if (fimDeJogo && (key === 'r' || key === 'R')) {
    reiniciarJogo();
    return;
  }

  if (nivelAumentado) {
    if (key === '1') {
      numeroLuas++;
      nivelAumentado = false;
    } else if (key === '2') {
      velocidadeRotacao += 0.01;
      nivelAumentado = false;
    } else if (key === '3') {
      tamanhoLua += 5;
      nivelAumentado = false;
    }
    return;
  }

  if (keyCode === LEFT_ARROW) {
    direcaoRotacao = -1;
  } else if (keyCode === RIGHT_ARROW) {
    direcaoRotacao = 1;
  }
}

function keyReleased() {
  if (keyCode === LEFT_ARROW && direcaoRotacao === -1) {
    direcaoRotacao = 0;
  } else if (keyCode === RIGHT_ARROW && direcaoRotacao === 1) {
    direcaoRotacao = 0;
  }
}

function reiniciarJogo() {
  pontuacao = 0;
  vidas = 3;
  inimigos = [];
  numeroLuas = 3;
  velocidadeRotacao = 0.05;
  tamanhoLua = 25;
  angulo = 0;
  fimDeJogo = false;
  nivelAumentado = false;
  velocidadeInimigo = 1.5;
  intervaloSpawn = 60;
  musicaFundo.play();
}
