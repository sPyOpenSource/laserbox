var width = window.innerWidth, height = window.innerHeight;
var size = 256;
var canvasFront,  ctxFront;
var canvasBack,   ctxBack;
var canvasLeft,   ctxLeft;
var canvasRight,  ctxRight;
var canvasBottom, ctxBottom;
var canvasTop,    ctxTop;
var camera, scene, renderer, geometry, mesh, projector;
var targetList = [];
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var textureRight, textureFront, textureTop, textureBack, textureFront, textureBottom;

function changeCanvas(text, ctx) {
    ctx.font = 'bold 40pt Arial';
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = 'white';
    ctx.fillRect(2, 2, size - 4, size - 4);
    ctx.fillStyle = 'grey';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, size / 2, size / 2);
}

function changeCircle(x, y, size, ctx) {
    ctx.lineWidth = 5;
    ctx.fillStyle = 'black'
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.stroke();
}

function changeText(x, y, text, ctx) {
    ctx.font = 'bold 40pt Arial';
    ctx.fillStyle = 'black'
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x, y);
}

function changeRect(x, y, width, hight, ctx) {
    ctx.lineWidth = 5;
    ctx.fillStyle = 'black'
    ctx.rect(x, y, width, hight);
    ctx.stroke();
}

function onMouseClick( event )
{
  // the following line would stop any other event handler from firing
  // (such as the mouse's TrackballControls)
  // event.preventDefault();

  // update the mouse variable
  var et = event.target, de = renderer.domElement;
  var trueX = (event.pageX - et.offsetLeft);
  var trueY = (event.pageY - et.offsetTop);
  mouse.x = ( trueX / de.width ) * 2 - 1;
  mouse.y = - ( trueY / de.height ) * 2 + 1;

  // find intersections
  // create a Ray with origin at the mouse position
  //   and direction into the scene (camera direction)
  raycaster.setFromCamera( mouse, camera );
  // create an array containing all objects in the scene with which the ray intersects
  var intersects = raycaster.intersectObjects( targetList );

  // if there is one (or more) intersections
  if ( intersects.length > 0 )
  {
    let faceIndex = intersects[0].faceIndex
    canvasRight.style.display = "none";
    canvasLeft.style.display = "none";
    canvasTop.style.display = "none";
    canvasBottom.style.display = "none";
    canvasFront.style.display = "none";
    canvasBack.style.display = "none";
    if (faceIndex < 2){
      canvasRight.style.display = "block";
      console.log("right")
    } else if (faceIndex < 4) {
      canvasLeft.style.display = "block";
      console.log("left")
    } else if (faceIndex < 6) {
      canvasTop.style.display = "block";
      console.log("top")
    } else if (faceIndex < 8) {
      canvasBottom.style.display = "block";
      console.log("bottom")
    } else if (faceIndex < 10) {
      canvasFront.style.display = "block";
      console.log("front")
    } else {
      canvasBack.style.display = "block";
      console.log("back")
    }
    // change the color of the closest face.
  }
}

function handleResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  var width = document.getElementById("laserbox").offsetWidth;
  renderer.setSize( width, width *  window.innerHeight / window.innerWidth );
}

function init() {
    renderer = new THREE.WebGLRenderer();
    var canvas = renderer.domElement;
    document.getElementById("laserbox").append(canvas);
    canvas.addEventListener("mousedown", onMouseClick);
    window.addEventListener('resize', handleResize);
    scene = new THREE.Scene();

    projector = new THREE.Projector();

    camera = new THREE.PerspectiveCamera(70, width / height, 1, 1000);
    camera.position.z = 500;
    camera.position.x = 500;
    camera.position.y = 500;

    canvasFront = document.getElementById('canvasFront'),
        ctxFront = canvasFront.getContext('2d');
    canvasBack = document.getElementById('canvasBack'),
        ctxBack = canvasBack.getContext('2d');
    canvasLeft = document.getElementById('canvasLeft'),
        ctxLeft = canvasLeft.getContext('2d');
    canvasRight = document.getElementById('canvasRight'),
        ctxRight = canvasRight.getContext('2d');
    canvasBottom = document.getElementById('canvasBottom'),
        ctxBottom = canvasBottom.getContext('2d');
    canvasTop = document.getElementById('canvasTop'),
        ctxTop = canvasTop.getContext('2d');

    canvasFront.width = canvasFront.height = size;
    canvasBack.width = canvasBack.height = size;
    canvasLeft.width = canvasLeft.height = size;
    canvasRight.width = canvasRight.height = size;
    canvasTop.width = canvasTop.height = size;
    canvasBottom.width = canvasBottom.height = size;
    textureRight = new THREE.Texture(canvasRight);
    textureLeft = new THREE.Texture(canvasLeft);
    textureTop = new THREE.Texture(canvasTop);
    textureBottom = new THREE.Texture(canvasBottom);
    textureFront = new THREE.Texture(canvasFront);
    textureBack = new THREE.Texture(canvasBack);

    changeCanvas("front", ctxFront);
    changeCanvas("back", ctxBack);
    changeCanvas("left", ctxLeft);
    changeCanvas("right", ctxRight);
    changeCanvas("bottom", ctxBottom);
    changeCanvas("top", ctxTop);

    var materials = [
      new THREE.MeshBasicMaterial({ map: textureRight }),
      new THREE.MeshBasicMaterial({ map: textureLeft }),
      new THREE.MeshBasicMaterial({ map: textureTop }),
      new THREE.MeshBasicMaterial({ map: textureBottom }),
      new THREE.MeshBasicMaterial({ map: textureFront }),
      new THREE.MeshBasicMaterial({ map: textureBack })
    ];
    geometry = new THREE.BoxGeometry( 200, 200, 200 );
    mesh = new THREE.Mesh( geometry, materials );
    scene.add( mesh );
    targetList.push(mesh);
    var controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.minDistance = 500;
    controls.maxDistance = 800;
}

function animate() {
    requestAnimationFrame(animate);
    textureRight.needsUpdate  = true;
    textureLeft.needsUpdate   = true;
    textureTop.needsUpdate    = true;
    textureBottom.needsUpdate = true;
    textureFront.needsUpdate  = true;
    textureBack.needsUpdate   = true;
    renderer.render(scene, camera);
}

$('document').ready(function(){
    init();
    handleResize();
    animate();
});
