var scene, camera, renderer;
var panorama, texture;
var wMax;

var rotateStart = new THREE.Vector2();
var rotateEnd = new THREE.Vector2();
var rotateDelta = new THREE.Vector2();

function jsDrawPanorama(contentDIV, widthMax) {
    wMax = (widthMax && window.innerWidth > widthMax) ? (widthMax) : (window.innerWidth);
    jsPanoInit(contentDIV);
    jsPanoAnimate();
}

function jsPanoInit(contentDIV) {

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(112, wMax / window.innerHeight, 0.1, 2000);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(wMax, window.innerHeight);
    contentDIV.appendChild(renderer.domElement);
    var textureLoader = new THREE.TextureLoader();
    texture = textureLoader.load('./assets/image/temple_full.jpg');


    var geometry = new THREE.SphereGeometry(5, 60, 40);
    var material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
    panorama = new THREE.Mesh(geometry, material);
    panorama.scale.x = -1;

    scene.add(panorama);

    panorama.rotation.x = 0.3447633324650674;
    panorama.rotation.y = -7.961827030105459;

    camera.lookAt(panorama.position);

    window.addEventListener('resize', function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // drag move
    // renderer.domElement.addEventListener('mousedown', mousDown, false);
    // renderer.domElement.addEventListener('touchstart', mousDown, false);
}

function jsMovePano(direction, faster) {
    let mvOffest = (faster)?(0.025):(0.025);
    switch (direction) {
        case 1:
            //up
            panorama.rotation.x -= mvOffest;
            break;
        case 2:
            //down
            panorama.rotation.x += mvOffest;
            break;
        case 3:
            //left
            panorama.rotation.y -= mvOffest;
            break;
        case 4:
            //right
            panorama.rotation.y += mvOffest;
            break;
    }
}

var mousDown = function (event) {
    event.preventDefault();
    var cx = (event.clientX) ? (event.clientX) : (event.touches[0].clientX);
    var cy = (event.clientY) ? (event.clientY) : (event.touches[0].clientY);

    rotateStart.set(cx, cy);

    renderer.domElement.addEventListener('mousemove', mousMove, false);
    renderer.domElement.addEventListener('mouseup', mousUp, false);
    renderer.domElement.addEventListener('touchstart', mousDown, false);
    renderer.domElement.addEventListener('touchmove', mousMove, false);
}


var mousMove = function (event) {
    event.preventDefault();
    var cx = (event.clientX) ? (event.clientX) : (event.touches[0].clientX);
    var cy = (event.clientY) ? (event.clientY) : (event.touches[0].clientY);

    var currentMX = cx;
    var currentMY = cy;
    if (currentMX < 20 || currentMX > window.innerWidth - 20
        || currentMY < 20 || currentMY > window.innerHeight - 20) {
        renderer.domElement.removeEventListener('mousemove', mousMove, false);
        renderer.domElement.removeEventListener('mouseup', mousUp, false);
        renderer.domElement.removeEventListener('touchmove', mousMove, false);
        renderer.domElement.removeEventListener('touchend', mousUp, false);
        rotateStart.set(-1, -1);
    } else {
        if (rotateStart.x < 0 || rotateStart.y < 0) { return; }

        rotateEnd.set(cx, cy);
        rotateDelta.subVectors(rotateEnd, rotateStart).multiplyScalar(1.0);
        var element = renderer.domElement;
        panorama.rotation.y += 2 * Math.PI * rotateDelta.x / element.clientHeight;
        panorama.rotation.x += 2 * Math.PI * rotateDelta.y / element.clientHeight;

        rotateStart.copy(rotateEnd);
    }
}


var mousUp = function (event) {
    event.preventDefault();
    renderer.domElement.removeEventListener('mousemove', mousMove, false);
    renderer.domElement.removeEventListener('mouseup', mousUp, false);
    renderer.domElement.removeEventListener('touchmove', mousMove, false);
    renderer.domElement.removeEventListener('touchend', mousUp, false);

    rotateStart.set(-1, -1);
}

function jsPanoAnimate() {
    requestAnimationFrame(jsPanoAnimate);
    renderer.render(scene, camera);
}