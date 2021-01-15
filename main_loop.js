import MainScene from "./mainScene.mjs"


var canvas = document.getElementById("canvas");
var width = canvas.width = 300;
var height = canvas.height = width * window.innerHeight / window.innerWidth;

var ctx = canvas.getContext("2d");
var mainScene = new MainScene();

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

window.onload = window.onresize = function() {
  if (window.innerHeight > window.innerWidth) {
    width = canvas.width = 150;
  } else {
    width = canvas.width = 300;
  }
  height = canvas.height = width * window.innerHeight / window.innerWidth;
  mainScene.resultionChanged();
}

function update(delta, widht, height) {
  mainScene.update(delta, widht, height);
}

function draw() {
  clearPane();
  mainScene.draw(ctx)
}

function clearPane(pane) {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "teal";
  ctx.fillRect(0, 0, width, height);
}

function processClick(x, y) {
  mainScene.processClick(x, y);
}

canvas.addEventListener('mouseup', function(e) {
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (width / rect.width);
  const y = (e.clientY - rect.top) * (height / rect.height);
  processClick(x, y);
})
