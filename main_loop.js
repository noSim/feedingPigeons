import BreadCrumb from "./breadCrumb.mjs"
import Pigeon from "./pigeon.mjs"
import PigeonAssets from "./pigeonAssets.mjs"

var canvas = document.getElementById("canvas");
var width = canvas.width;
var height = canvas.height;
var ctx = canvas.getContext("2d");
var eatableObjects = [];
var eatablePool = [];
var pigeonObjects = [];
var pigeonPool = [];
var pigeonAssets = new PigeonAssets();
var pigeonCounter = 1;
pigeonAssets.loading().then(
  console.log("loading pigeon assets finished") // TODO prevent first draw if not loaded?
)


var lastFrameTime = 0;
var maxFPS = 180;
function mainLoop(timestamp) {
  if (timestamp < lastFrameTime + (1000 / maxFPS)) {
      window.requestAnimationFrame(mainLoop);
      return;
  }
  var delta = timestamp - lastFrameTime;
  lastFrameTime = timestamp;
  update(delta, width, height);
  draw();
  window.requestAnimationFrame(mainLoop);
};
window.requestAnimationFrame(mainLoop);

function update(delta, widht, height) {
  // console.log("Pigeons active: " + pigeonObjects.length + " pooled: " + pigeonPool.length + " | " + "Crumbs active: " + eatableObjects.length + " pooled: " + eatablePool.length);
  spawnPigeonIfRequired()
  eatableObjects.forEach(object => {
    object.update(delta, widht, height);
  });
  pigeonObjects.forEach(object => {
    object.update(delta, widht, height);
  })
}

function spawnPigeonIfRequired() {
  if (eatableObjects.length > pigeonObjects.length * 3) {
    pigeonObjects.push(getPigeon());
  }
}

function draw() {
  clearPane();
  eatableObjects.forEach(object => {
    object.draw(ctx);
  })
  pigeonObjects.forEach(object => {
    object.draw(ctx);
  })
}

function clearPane(pane) {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "teal";
  ctx.fillRect(0, 0, width, height);
}

function processClick(x, y) {
  if (Math.round(y) < height * 4/5) {
    eatableObjects.push(getBreadCrumb(x, y));
  }
}

canvas.addEventListener('mouseup', function(e) {
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (width / rect.width);
  const y = (e.clientY - rect.top) * (height / rect.height);
  processClick(x, y);
})

function getBreadCrumb(x, y) {
  var crumb = eatablePool.pop();
  if (!crumb) {
    crumb = new BreadCrumb(Math.round(x), Math.round(y), () => removeBreadCrumb(crumb));
  } else {
    crumb.reset(Math.round(x), Math.round(y));
  }
  return crumb;
}

function removeBreadCrumb(crumb) {
  eatablePool.push(crumb)
  eatableObjects.splice(eatableObjects.indexOf(crumb), 1);
}

function getPigeon() {
  var pigeon = pigeonPool.pop();
  var feedOffset = 24; // distance top to feed in pigeon asset
  var pigeonHeight = 32 + Math.random() * 32; // height is random 32 to 64 px
  var floorHeight = height * 4/5;
  var posY = floorHeight - feedOffset - pigeonHeight;
  var posX = Math.random() >= 0.5 ? - 32 : width; // either left or right of screen
  if (!pigeon) {
    pigeon = new Pigeon(posX, posY, pigeonAssets, eatableObjects, () => removePigeon(pigeon), pigeonCounter++);
  } else {
    pigeon.reset(posX, posY);
  }
  return pigeon;
}

function removePigeon(pigeon) {
  pigeonObjects.splice(pigeonObjects.indexOf(pigeon), 1);
  pigeonPool.push(pigeon);
}
