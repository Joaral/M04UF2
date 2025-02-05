	let canvas_w=800;
		let canvas_h=450;
		
		let config = {width: 800,
		height:450,
		
		physics: {
		default:"arcade", //habilita el motor de fisica
		arcade: {gravity: { y: 200 }, debug:true } //activamos la gravedad
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

let colores = [0xffffff, 0x8B4513, 0xFFD700]; // Blanco, marron y dorado

function precarga ()
{
	console.log("cargando imagenes...");
	this.load.image('huevera', '/imgs/huevera.png');
	this.load.image('huevo', '/imgs/huevo.png');
	this.load.image('fondo', '/imgs/fondo.jpg');
    this.load.image('fondo_hueveras', '/imgs/fondo_hueveras.jpg');
}

function crea () 
{
	// Fondo principal
		console.log("creando escena...");
    let fondo = this.add.image(canvas_w / 2, canvas_h / 2, 'fondo').setDisplaySize(canvas_w, canvas_h);
    
    // Fondo de las hueveras
    let columna = this.add.image(150, canvas_h / 2, 'fondo_hueveras');
    columna.setDisplaySize(300, canvas_h);

    // Posicionar hueveras en columna
     let huevera1 = this.add.image(150, 100, 'huevera').setScale(0.5).setTint(colores[0]);
		 let huevera2 = this.add.image(150, 220, 'huevera').setScale(0.5).setTint(colores[1]);
		 let huevera3 = this.add.image(150, 340, 'huevera').setScale(0.5).setTint(colores[2]);

		console.log("hueveras posicionadas");

    // Posicionar huevos en fila y detectar clics
    let huevo1 = this.add.image(500,300,'huevo').setScale(0.5).setTint(colores[0]).setInteractive();

    let huevo2 = this.add.image(620,300,'huevo').setScale(0.5).setTint(colores[1]).setInteractive();
    

		let huevo3 = this.add.image(740,300,'huevo').setScale(0.5).setTint(colores[2]).setInteractive();

		this.input.setDraggable(huevo1);
		this.input.setDraggable(huevo2);
		this.input.setDraggable(huevo3);

		console.log("huevos colocados");

//arrastre
		huevo1.on('pointerdown', function () {
		console.log('Arrastrando');
		});

this.input.on('drag', function (pointer,object, x, y) {
object.x = x;
object.y = y;

if (Phaser.Geom.Intersects.RectangleToRectangle(huevera1.getBounds(), object.getBounds())){
	console.log("Huevo dentro de huevera");	
}

});

this.input.on('dragend', function (pointer, obj) {
console.log("Soltado: ", obj);
});

//Huevos con gravedad aleatorizados
function crearHuevo(scene) {
    let posicionRand = Phaser.Math.Between(200, 600);
    let color = Phaser.Math.RND.pick(colores);

    let huevo = scene.physics.add.image(posicionRand, 50, 'huevo');
        huevo.setScale(0.5);
        huevo.setTint(color);
        huevo.setVelocityY(10);
				huevo.setInteractive();
		this.input.setDraggable(huevo);
		huevo.on('pointersown', function () {
		coonsole.log('Arrastrando');
		});
		this.input.on('drag', function (pointer, object, x, y){
		object.x = x;
		object.y = y;
		//if (color == huevera		
    console.log("Huevo creado en X:", posicionRand);
}
//loop de creacion de huevos

let escena = this;

this.time.addEvent({
    delay: 2000,
    callback: () => crearHuevo(escena),
    loop: true
});

contadorTexto = this.add.text(400,50,tiempo, {
	fontsize: '90px',
	fontStyle:'bold'
	});

contadorInterval = setInterval(() => {
tiempo--;
contadorTexto.text = tiempo;

if (tiempo <= 0){
	clearInterval(contadorInterval);
	contadorTexto.setText("¡Tiempo terminado!");
	}
	}, 1000);
}

function actualiza (){}

