let canvas_w = 800;
let canvas_h = 450;

let config = {
    width: canvas_w,
    height: canvas_h,
    physics: {
        default: "arcade",
        arcade: { gravity: { y: 0 }, debug: true } // Eliminando la gravedad
    },
    scene: {
        preload: precarga,
        create: crea,
        update: actualiza
    }
};

let game = new Phaser.Game(config);

let contadorTexto;
let tiempo = 60;
let contadorIntervalo;
let colores = [0xffffff, 0x8B4513, 0xFFD700]; // Blanco, marrón y dorado
let musicaFondo, sonidoAgarrar, sonidoCorrecto, sonidoIncorrecto, musicaGameOver;

function precarga() {
    console.log("Cargando imágenes y sonidos...");
    this.load.image('huevera', '/imgs/huevera.png');
    this.load.image('huevo', '/imgs/huevo.png');
    this.load.image('fondo', '/imgs/fondo.jpg');
    this.load.image('fondo_hueveras', '/imgs/fondo_hueveras.jpg');
    
    this.load.audio('musicaFondo', '/musica_fondo.mp3');
    this.load.audio('sonidoAgarrar', '/agarrar.wav');
    this.load.audio('sonidoCorrecto', '/correcto.ogg');
    this.load.audio('sonidoIncorrecto', '/incorrecto.ogg');
    this.load.audio('musicaGameOver', '/gameover.mp3');
}

function crea() {
    console.log("Creando escena...");
    
    // Fondo principal
    this.add.image(canvas_w / 2, canvas_h / 2, 'fondo').setDisplaySize(canvas_w, canvas_h);
    
    // Fondo de las hueveras
    let columna = this.add.image(150, canvas_h / 2, 'fondo_hueveras');
    columna.setDisplaySize(300, canvas_h);
    
    // Posicionar hueveras en columna
    let hueveras = [];
    for (let i = 0; i < 3; i++) {
        hueveras.push(this.add.image(150, 100 + (i * 120), 'huevera').setScale(0.5).setTint(colores[i]));
    }
    
    console.log("Hueveras posicionadas");
    
    // Cargar sonidos
    musicaFondo = this.sound.add('musicaFondo', { loop: true, volume: 0.5 });
    sonidoAgarrar = this.sound.add('sonidoAgarrar');
    sonidoCorrecto = this.sound.add('sonidoCorrecto');
    sonidoIncorrecto = this.sound.add('sonidoIncorrecto');
    musicaGameOver = this.sound.add('musicaGameOver');
    
    musicaFondo.play();
    
    function crearHuevo() {
        let posicionRand = Phaser.Math.Between(200, 600);
        let color = Phaser.Math.RND.pick(colores);

        let huevo = this.physics.add.image(posicionRand, 50, 'huevo');
        huevo.setScale(0.5);
        huevo.setTint(color);
        huevo.setVelocityY(100); // Velocidad constante en Y
        huevo.setInteractive();
        
        this.input.setDraggable(huevo);
        
        huevo.on('pointerdown', function () {
            console.log('Arrastrando');
            sonidoAgarrar.play();
        });

        this.input.on('dragend', function (pointer, object) {
            let correcto = false;
            hueveras.forEach(huevera => {
                if (Phaser.Geom.Intersects.RectangleToRectangle(huevera.getBounds(), object.getBounds()) && huevera.tintTopLeft === object.tintTopLeft) {
                    console.log("Correcto!");
                    tiempo += 1;
                    correcto = true;
                    sonidoCorrecto.play();
                }
            });
            if (!correcto) {
                console.log("Incorrecto!");
                tiempo -= 1;
                sonidoIncorrecto.play();
            }
            contadorTexto.text = tiempo;

            if (tiempo <= 0) {
                musicaFondo.stop();
                musicaGameOver.play();
                contadorTexto.setText("¡Tiempo terminado!");
            }
        });
    }

    // Loop de creación de huevos
    this.time.addEvent({
        delay: 2000,
        callback: crearHuevo,
        loop: true
    });

    // Contador de tiempo
    contadorTexto = this.add.text(400, 50, tiempo, {
        fontsize: '90px',
        fontStyle: 'bold'
    });

    contadorInterval = setInterval(() => {
        tiempo--;
        contadorTexto.text = tiempo;

        if (tiempo <= 0) {
            clearInterval(contadorInterval);
            musicaFondo.stop();
            musicaGameOver.play();
            contadorTexto.setText("¡Tiempo terminado!");
        }
    }, 1000);
}

function actualiza() {}