var world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 5000 );
camera.position.z = 8;
camera.position.x = 3.5;
var step = 60;

const scene = new THREE.Scene();

const RAINgeometry = new THREE.BoxGeometry( 0.01, 0.04, 0.01 );
const RAINmaterial = new THREE.MeshNormalMaterial();

function startRain() {
    var x = Math.floor(Math.random() * 1000)/100
    var z = Math.floor(Math.random() * 1000)/100
    var mesh = new THREE.Mesh( RAINgeometry, RAINmaterial );
    scene.add( mesh );
    mesh.position.x = x
    mesh.position.z = z
    mesh.position.y = 10

    var sphereBody = new CANNON.Body({
        mass: 0.001, // kg
        position: new CANNON.Vec3(x, 10, z),
        shape: new CANNON.Sphere(0.01)
    });

    world.addBody(sphereBody)

    sphereBody.three = mesh

    setTimeout(() => {
        startRain()
    }, 1*step/60)
}

startRain()

var slider = document.getElementById("myRange");

slider.oninput = function() {
    step = this.value;
}

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

function animate() {

    requestAnimationFrame(animate);

    world.step(1/step);

    world.bodies.forEach((body) => {
        if (body.three) {
            if (body.position.y < -2) {
                world.remove(body)
                scene.remove(body.three)
            }
            body.three.position.copy(body.position)
        }
    })

	renderer.render( scene, camera );

}

animate()