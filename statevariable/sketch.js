// Semi-constants
var WIDTH = window.innerWidth,
	HEIGHT = window.innerHeight,
	ASPECT = WIDTH / HEIGHT,
	UNITSIZE = 250,
	WALLHEIGHT = UNITSIZE / 3,
	MOVESPEED = 100,
	LOOKSPEED = 0.075,
	BULLETMOVESPEED = MOVESPEED * 5,
	NUMAI = 5,
	PROJECTILEDAMAGE = 20;
// Global vars
var t = THREE, scene, cam, renderer, controls, clock, projector, model, skin;
var runAnim = true, mouse = { x: 0, y: 0 }, kills = 0, health = 100;
var healthCube, lastHealthPickup = 0;
// Initialize and run on document ready
$(document).ready(function() {
	$('body').append('<div id="intro">Click to start</div>');
	$('#intro').css({width: WIDTH, height: HEIGHT}).one('click', function(e) {
		e.preventDefault();
		$(this).fadeOut();
		init();
		setInterval(drawRadar, 1000);
		animate();
	});
});
var map = [ // 1  2  3  4  5  6  7  8  9
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1,], // 0
  [1, 1, 0, 0, 0, 0, 0, 1, 1, 1,], // 1
  [1, 1, 0, 0, 2, 0, 0, 0, 0, 1,], // 2
  [1, 0, 0, 0, 0, 2, 0, 0, 0, 1,], // 3
  [1, 0, 0, 2, 0, 0, 2, 0, 0, 1,], // 4
  [1, 0, 0, 0, 2, 0, 0, 0, 1, 1,], // 5
  [1, 1, 1, 0, 0, 0, 0, 1, 1, 1,], // 6
  [1, 1, 1, 0, 0, 1, 0, 0, 1, 1,], // 7
  [1, 1, 1, 1, 1, 1, 0, 0, 1, 1,], // 8
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1,], // 9
  ], mapW = map.length, mapH = map[0].length;
  // Setup
function init() {
	clock = new t.Clock(); // A high-performance timer used to calculate the time between rendering frames in order to smooth animation
	projector = new t.Projector(); // A helper class for projecting 2D rays (on the screen) into 3D rays (in the virtual world)
	scene = new t.Scene(); // The "world" environment. Holds all other objects.
	scene.fog = new t.FogExp2(0xD6F1FF, 0.0005); // Add fog to the world. Helps with depth perception. Params are color (in hex) and density
 
	// Set up camera so we know from where to render the scene
	cam = new t.PerspectiveCamera(60, ASPECT, 1, 10000); // Field Of Viw, aspect ratio, near, far
	cam.position.y = UNITSIZE * .2; // Raise the camera off the ground
	scene.add(cam); // Add the camera to the scene
 
	// Camera moves with mouse, flies around with WASD/arrow keys
	controls = new t.FirstPersonControls(cam); // Handles camera control
	controls.movementSpeed = MOVESPEED; // How fast the player can walk around
	controls.lookSpeed = LOOKSPEED; // How fast the player can look around with the mouse
	controls.lookVertical = false; // Don't allow the player to look up or down. This is a temporary fix to keep people from flying
	controls.noFly = true; // Don't allow hitting R or F to go up or down
 
	// World objects
	setupScene(); // Adds physical objects to the world. Described later
 
	// Artificial Intelligence
	setupAI(); // Adds enemies to the world. Described later
 
	// Handle drawing as WebGL (faster than Canvas but less supported by browsers)
	renderer = new t.WebGLRenderer();
	renderer.setSize(WIDTH, HEIGHT); // Give the renderer the canvas size explicitly
 
	// Add the canvas to the document
	renderer.domElement.style.backgroundColor = '#D6F1FF'; // Make it easier to see that the canvas was added. Also this is the sky color
	document.body.appendChild(renderer.domElement); // Add the canvas to the document
 
	// Track mouse position (set mouse.x and mouse.y to pointer coordinates) so we know where to shoot
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
 
	// Shoot on click
	$(document).click(function(e) {
		e.preventDefault();
		if (e.which === 1) { // Left click only, courtesy of jQuery
			createBullet(); // Shoot a bullet. Described later
		}
	});
 
	// Display the HUD: radar, health, score, and credits/directions
	$('body').append('<canvas id="radar" width="200" height="200"></canvas>');
	$('body').append('<div id="hud"><p>Health: <span id="health">100</span><br />Score: <span id="score">0</span></p></div>');
	$('body').append('<div id="credits"><p>Created by <a href="http://www.isaacsukin.com/">Isaac Sukin</a> using <a href="http://mrdoob.github.com/three.js/">Three.js</a><br />WASD to move, mouse to look, click to shoot</p></div>');
 
	// Set up the brief red flash that shows when you get hurt
	$('body').append('<div id="hurt"></div>');
  $('#hurt').css({width: WIDTH, height: HEIGHT,});
}
  

  // Set up the objects in the world
function setupScene() {
	var units = mapW;
 
	// Geometry: floor
	var floor = new t.Mesh(
			new t.CubeGeometry(units * UNITSIZE, 10, units * UNITSIZE),
			new t.MeshLambertMaterial({color: 0xEDCBA0})
	);
	scene.add(floor);
 
	// Geometry: walls
	var cube = new t.CubeGeometry(UNITSIZE, WALLHEIGHT, UNITSIZE);
	var materials = [
	                 new t.MeshLambertMaterial({map: t.ImageUtils.loadTexture('images/wall-1.jpg')}),
	                 new t.MeshLambertMaterial({map: t.ImageUtils.loadTexture('images/wall-2.jpg')}),
	                 ];
	for (var i = 0; i < mapW; i++) {
		for (var j = 0, m = map[i].length; j < m; j++) {
			if (map[i][j]) {
				var wall = new t.Mesh(cube, materials[map[i][j]-1]);
				wall.position.x = (i - units/2) * UNITSIZE;
				wall.position.y = WALLHEIGHT/2;
				wall.position.z = (j - units/2) * UNITSIZE;
				scene.add(wall);
			}
		}
	}
 
	// Health cube
	healthcube = new t.Mesh(
			new t.CubeGeometry(30, 30, 30),
			new t.MeshBasicMaterial({map: t.ImageUtils.loadTexture('images/health.png')})
	);
	healthcube.position.set(-UNITSIZE-15, 35, -UNITSIZE-15);
	scene.add(healthcube);
 
	// Lighting
	var directionalLight1 = new t.DirectionalLight( 0xF7EFBE, 0.7 );
	directionalLight1.position.set( 0.5, 1, 0.5 );
	scene.add( directionalLight1 );
	var directionalLight2 = new t.DirectionalLight( 0xF7EFBE, 0.5 );
	directionalLight2.position.set( -0.5, -1, -0.5 );
	scene.add( directionalLight2 );
}

// Helper function for browser frames
function animate() {
	if (runAnim) {
		requestAnimationFrame(animate);
	}
	render();
}
var delta = clock.getDelta();
controls.update(delta); // Move camera

if (Date.now() > lastHealthPickup + 60000) {
  if (distance(cam.position.x, cam.position.z, healthcube.position.x, healthcube.position.z) < 15 && health != 100) {
    health = Math.min(health + 50, 100);
    $('#health').html(health);
    lastHealthPickup = Date.now();
  }
  healthcube.material.wireframe = false;
}
else {
  healthcube.material.wireframe = true;
}
for (var i = bullets.length-1; i >= 0; i--) {
  var b = bullets[i], p = b.position, d = b.ray.direction;
  if (checkWallCollision(p)) {
    bullets.splice(i, 1);
    scene.remove(b);
    continue;
  }
  if (p.x < c.x + x && p.x > c.x - x &&
    p.z < c.z + z && p.z > c.z - z &&
    b.owner != a) {
  bullets.splice(i, 1);
  scene.remove(b);
  a.health -= PROJECTILEDAMAGE;
  var color = a.material.color, percent = a.health / 100;
  a.material.color.setRGB(
      percent * color.r,
      percent * color.g,
      percent * color.b
  );
  hit = true;
  break;
}if (distance(p.x, p.z, cam.position.x, cam.position.z) < 25 && b.owner != cam) {
  $('#hurt').fadeIn(75);
  // ... hurt the player ...
  $('#hurt').fadeOut(350);
}	// Move AI
var r = Math.random();
if (r > 0.995) {
  a.lastRandomX = Math.random() * 2 - 1;
  a.lastRandomZ = Math.random() * 2 - 1;
}
a.translateX(aispeed * a.lastRandomX);
a.translateZ(aispeed * a.lastRandomZ);
var c = getMapSector(a.position);
if (c.x < 0 || c.x >= mapW || c.y < 0 || c.y >= mapH || checkWallCollision(a.position)) {
  a.translateX(-2 * aispeed * a.lastRandomX);
  a.translateZ(-2 * aispeed * a.lastRandomZ);
  a.lastRandomX = Math.random() * 2 - 1;
  a.lastRandomZ = Math.random() * 2 - 1;
}
if (c.x < -1 || c.x > mapW || c.z < -1 || c.z > mapH) {
  ai.splice(i, 1);
  scene.remove(a);
  addAI();
}	renderer.render(scene, cam); // Repaintfunction addAI() {
	var c = getMapSector(cam.position);
	var aiMaterial = new t.MeshBasicMaterial({map: t.ImageUtils.loadTexture('images/face.png')});
	var o = new t.Mesh(aiGeo, aiMaterial);
	do {
		var x = getRandBetween(0, mapW-1);
		var z = getRandBetween(0, mapH-1);
	} while (map[x][z] > 0 || (x == c.x && z == c.z));
	x = Math.floor(x - mapW/2) * UNITSIZE;
	z = Math.floor(z - mapW/2) * UNITSIZE;
	o.position.set(x, UNITSIZE * 0.15, z);
	o.health = 100;
	o.pathPos = 1;
	o.lastRandomX = Math.random();
	o.lastRandomZ = Math.random();
	o.lastShot = Date.now(); // Higher-fidelity timers aren't a big deal here.
	ai.push(o);
	scene.add(o);
}// Radar
function drawRadar() {
	var c = getMapSector(cam.position), context = document.getElementById('radar').getContext('2d');
	context.font = '10px Helvetica';
	for (var i = 0; i < mapW; i++) {
		for (var j = 0, m = map[i].length; j < m; j++) {
			var d = 0;
			for (var k = 0, n = ai.length; k < n; k++) {
				var e = getMapSector(ai[k].position);
				if (i == e.x && j == e.z) {
					d++;
				}
			}
			if (i == c.x && j == c.z && d == 0) {
				context.fillStyle = '#0000FF';
				context.fillRect(i * 20, j * 20, (i+1)*20, (j+1)*20);
			}
			else if (i == c.x && j == c.z) {
				context.fillStyle = '#AA33FF';
				context.fillRect(i * 20, j * 20, (i+1)*20, (j+1)*20);
				context.fillStyle = '#000000';
				context.fillText(''+d, i*20+8, j*20+12);
			}
			else if (d > 0 && d < 10) {
				context.fillStyle = '#FF0000';
				context.fillRect(i * 20, j * 20, (i+1)*20, (j+1)*20);
				context.fillStyle = '#000000';
				context.fillText(''+d, i*20+8, j*20+12);
			}
			else if (map[i][j] > 0) {
				context.fillStyle = '#666666';
				context.fillRect(i * 20, j * 20, (i+1)*20, (j+1)*20);
			}
			else {
				context.fillStyle = '#CCCCCC';
				context.fillRect(i * 20, j * 20, (i+1)*20, (j+1)*20);
			}
		}
	}
}var bullets = [];
var sphereMaterial = new t.MeshBasicMaterial({color: 0x333333});
var sphereGeo = new t.SphereGeometry(2, 6, 6);
function createBullet(obj) {
	if (obj === undefined) {
		obj = cam;
	}
	var sphere = new t.Mesh(sphereGeo, sphereMaterial);
	sphere.position.set(obj.position.x, obj.position.y * 0.8, obj.position.z);
 
	if (obj instanceof t.Camera) {
		var vector = new t.Vector3(mouse.x, mouse.y, 1);
		projector.unprojectVector(vector, obj);
		sphere.ray = new t.Ray(
				obj.position,
				vector.subSelf(obj.position).normalize()
		);
	}
	else {
		var vector = cam.position.clone();
		sphere.ray = new t.Ray(
				obj.position,
				vector.subSelf(obj.position).normalize()
		);
	}
	sphere.owner = obj;
 
	bullets.push(sphere);
	scene.add(sphere);
 
	return sphere;
}// Handle window resizing
$(window).resize(function() {
	WIDTH = window.innerWidth;
	HEIGHT = window.innerHeight;
	ASPECT = WIDTH / HEIGHT;
	if (cam) {
		cam.aspect = ASPECT;
		cam.updateProjectionMatrix();
	}
	if (renderer) {
		renderer.setSize(WIDTH, HEIGHT);
	}
	$('#intro, #hurt').css({width: WIDTH, height: HEIGHT,});
});
 
// Stop moving around when the window is unfocused (keeps my sanity!)
$(window).focus(function() {
	if (controls) controls.freeze = false;
});
$(window).blur(function() {
	if (controls) controls.freeze = true;
});