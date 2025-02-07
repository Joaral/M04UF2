let canvas_w = 800;
let canvas_h = 450;

let config = {
    width: canvas_w,
    height: canvas_h,
    physics: {
        default: "arcade",
        arcade: { debug: false } // Eliminando la gravedad
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
    
    this.load.audio('musicaFondo', '/audio/musica_fondo.mp3');
    this.load.audio('sonidoAgarrar', '/audio/agarrar.wav');
    this.load.audio('sonidoCorrecto', '/audio/correcto.ogg');
    this.load.audio('sonidoIncorrecto', '/audio/incorrecto.ogg');
    this.load.audio('musicaGameOver', '/audio/gameover.mp3');
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
    musicaGameOver = this.sound.add('musicaGameOver', { volume: 0.5 });

    musicaFondo.play();

    // Corregimos la función crearHuevo asegurando que `this` apunte a la escena
    const crearHuevo = () => {
        let posicionRand = Phaser.Math.Between(350, 750);
        let color = Phaser.Math.RND.pick(colores);

        let huevo = this.physics.add.image(posicionRand, 100, 'huevo');
        huevo.setScale(1);
        huevo.setTint(color);
        huevo.setVelocityY(100);
        huevo.setInteractive();

        this.input.setDraggable(huevo);
		
		this.input.on('drag', (pointer, object, x, y) => {
    object.x = x;
    object.y = y;
});


        huevo.on('pointerdown', () => {
            console.log('Arrastrando');
            sonidoAgarrar.play();
						huevo.setVelocityY(0);
        });

        this.input.on('dragend', (pointer, object) => {
            let correcto = false;
            hueveras.forEach(huevera => {
                if (Phaser.Geom.Intersects.RectangleToRectangle(huevera.getBounds(), object.getBounds()) && huevera.tintTopLeft === object.tintTopLeft) {
                    console.log("Correcto!");
                    tiempo += 1;
                    correcto = true;
                    sonidoCorrecto.play();
										huevo.destroy();

                }
            });
            if (!correcto) {
                console.log("Incorrecto!");
                tiempo -= 1;
                sonidoIncorrecto.play();
								huevo.destroy();
            }
            contadorTexto.text = tiempo;

            if (tiempo <= 0) {
                musicaFondo.stop();
                musicaGameOver.play();
                contadorTexto.setText("¡Tiempo terminado!");
            }
        });
    };

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

function actualiza() {
	if (tiempo > 10){
	musicaFondo.rate = 1.25;
}
if (tiempo > 10){
musicaFondo.rate = 1;
}
