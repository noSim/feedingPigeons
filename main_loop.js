import BreadCrumb from "./breadCrumb.mjs"
import Pigeon from "./pigeon.mjs"

var canvas = document.getElementById("canvas");
var width = canvas.width;
var height = canvas.height;
var ctx = canvas.getContext("2d");
var gameObjects = [];
gameObjects.push(new Pigeon(30, height * 4/5 - 24))

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
  gameObjects.forEach(object => {
    object.update(delta, widht, height);
  });
}

function draw() {
  clearPane();
  gameObjects.forEach(object => {
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
    gameObjects.push(new BreadCrumb(Math.round(x), Math.round(y)));
  }
}

canvas.addEventListener('mouseup', function(e) {
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (width / rect.width);
  const y = (e.clientY - rect.top) * (height / rect.height);
  processClick(x, y);
})
