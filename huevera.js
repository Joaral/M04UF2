let canvas_w = 800;
let canvas_h = 450;

let config = {
  width: canvas_w,
  height: canvas_h,
  physics: {
    default: "arcade",
    arcade: { debug: false },
  },
  scene: {
    preload: precarga,
    create: crea,
    update: actualiza,
  },
};

let game = new Phaser.Game(config);

let contadorTexto;
let tiempo = 60;
let huevos = [];
let puntuacion = 0;
let contadorIntervalo;
let colores = [0xffffff, 0x8b4513, 0xffd700];
let musicaFondo,
  sonidoAgarrar,
  sonidoCorrecto,
  sonidoIncorrecto,
  musicaGameOver;
let huevosMaximos = 10;
let huevosGenerados = 0;

const TIEMPO_ACIERTO = 5;
const PUNTOS_ACIERTO = 10;
const TIEMPO_INCORRECTO = -5;
const PUNTOS_INCORRECTO = -5;

let finJuegoActivo = false; // Variable para evitar que se llame varias veces

function precarga() {
  console.log("Cargando imágenes y sonidos...");
  this.load.image("huevera", "/imgs/huevera.png");
  this.load.image("huevo", "/imgs/huevo.png");
  this.load.image("fondo", "/imgs/fondo.jpg");
  this.load.image("fondo_hueveras", "/imgs/fondo_hueveras.jpg");

  this.load.audio("musicaFondo", "/musica_fondo.mp3");
  this.load.audio("sonidoAgarrar", "/agarrar.wav");
  this.load.audio("sonidoCorrecto", "/correcto.ogg");
  this.load.audio("sonidoIncorrecto", "/incorrecto.ogg");
  this.load.audio("musicaGameOver", "/gameover.mp3");
}

function crea() {
  console.log("Creando escena...");

  this.add
    .image(canvas_w / 2, canvas_h / 2, "fondo")
    .setDisplaySize(canvas_w, canvas_h);

  let columna = this.add.image(150, canvas_h / 2, "fondo_hueveras");
  columna.setDisplaySize(300, canvas_h);

  let hueveras = [];
  for (let i = 0; i < 3; i++) {
    hueveras.push(
      this.add
        .image(150, 100 + i * 120, "huevera")
        .setScale(0.5)
        .setTint(colores[i])
    );
  }

  console.log("Hueveras posicionadas");

  musicaFondo = this.sound.add("musicaFondo", { loop: true, volume: 0.5 });
  sonidoAgarrar = this.sound.add("sonidoAgarrar");
  sonidoCorrecto = this.sound.add("sonidoCorrecto");
  sonidoIncorrecto = this.sound.add("sonidoIncorrecto");
  musicaGameOver = this.sound.add("musicaGameOver", { volume: 0.5 });

  musicaFondo.play();

  const crearHuevo = () => {
    if (huevosGenerados >= huevosMaximos) {
      // Puedes generar más huevos si lo deseas en función de alguna lógica, pero no se acaba el juego por la cantidad de huevos
      return;
    }

    let posicionRand = Phaser.Math.Between(350, 750);
    let color = Phaser.Math.RND.pick(colores);

    let huevo = this.physics.add.image(posicionRand, 100, "huevo");
    huevo.setScale(1);
    huevo.setTint(color);
    huevo.setVelocityY(100);
    huevo.setInteractive();

    this.input.setDraggable(huevo);

    this.input.on("drag", (pointer, object, x, y) => {
      object.x = x;
      object.y = y;
    });

    huevo.on("pointerdown", () => {
      console.log("Arrastrando");
      sonidoAgarrar.play();
      huevo.setVelocityY(0);
    });

    let huevoArrastrado = false;

    this.input.on("dragend", (pointer, object) => {
      if (huevoArrastrado) return;
      huevoArrastrado = true;

      let correcto = false;
      hueveras.forEach((huevera) => {
        if (
          Phaser.Geom.Intersects.RectangleToRectangle(
            huevera.getBounds(),
            object.getBounds()
          ) &&
          huevera.tintTopLeft === object.tintTopLeft
        ) {
          console.log("Correcto!");
          tiempo += TIEMPO_ACIERTO;
          puntuacion += PUNTOS_ACIERTO;
          correcto = true;
          sonidoCorrecto.play();
          huevos.splice(huevos.indexOf(huevo), 1); // Eliminar solo el huevo interactuado
          huevo.destroy();
          huevosMaximos++;
        }
      });

      if (!correcto) {
        console.log("Incorrecto!");
        tiempo += TIEMPO_INCORRECTO;
        puntuacion += PUNTOS_INCORRECTO;
        sonidoIncorrecto.play();
        huevo.destroy();
        huevos.splice(huevos.indexOf(huevo), 1); // Eliminar solo el huevo interactuado
      }

      contadorTexto.text = `Tiempo: ${tiempo}  Puntos: ${puntuacion}`;

      // Comprobar el fin del juego después de procesar la interacción
      if (tiempo <= 0) {
        finJuego.call(this); // Llamar a finJuego si el tiempo se ha agotado
      }
    });

    huevos.push(huevo);
    huevosGenerados++;
  };

  this.time.addEvent({
    delay: 2000,
    callback: crearHuevo,
    loop: true,
  });

  contadorTexto = this.add.text(
    400,
    50,
    `Tiempo: ${tiempo}  Puntos: ${puntuacion}`,
    {
      fontsize: "30px",
      fontStyle: "bold",
    }
  );

  let contadorInterval = setInterval(() => {
    if (finJuegoActivo) return; // Prevenir que el juego se termine más de una vez

    tiempo--;
    contadorTexto.text = `Tiempo: ${tiempo}  Puntos: ${puntuacion}`;

    if (tiempo <= 0) {
      clearInterval(contadorInterval);
      finJuego.call(this); // Llamar a finJuego cuando el tiempo se acaba
    }
  }, 1000);
}

function actualiza() {
  if (tiempo > 0 && tiempo <= 10) {
    musicaFondo.rate = 1.25;
  } else {
    musicaFondo.rate = 1;
  }
}

function finJuego() {
  if (finJuegoActivo) return; // Evitar múltiples llamadas a finJuego()
  finJuegoActivo = true;

  musicaFondo.stop();
  musicaGameOver.play();

  // Mostrar mensaje de Game Over y puntuación
  contadorTexto.setText(`¡Game Over!\nPuntuación: ${puntuacion}`);

  // Centrar el texto en el centro de la pantalla (en X y Y)
  contadorTexto.setOrigin(0.5); // Centrar el texto
  contadorTexto.setPosition(canvas_w / 2, canvas_h / 2); // Poner en el centro

  // Congelar huevos (deshabilitar la interacción)
  huevos.forEach((huevo) => huevo.setInteractive(false));

  // Detener la creación de nuevos huevos
  game.scene.remove("hueveras");
}
