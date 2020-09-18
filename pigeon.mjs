import GameObject from "./game_object.mjs"

export default class Pigeon extends GameObject {
  constructor(x, y) {
    super(x, y);
    this.walk = new Image()
    this.frameCount = 8;
    this.currentFrame = 0;
    this.width = 32;
    this.height = 32;
    this.animationSpeed = 150;
    this.accumulatedTime = 0;
    this.walk.src = "/assets/pigeonWalk.png"
  }

  draw(ctx) {
    ctx.drawImage(this.walk, this.width * this.currentFrame, 0, this.width, this.height, this.x, this.y, this.width, this.height)
  }

  update(timedelta, width, height) {
    this.accumulatedTime += timedelta;
    if (this.accumulatedTime >= this.animationSpeed) {
      this.accumulatedTime = 0;
      this.currentFrame = (this.currentFrame + 1) % this.frameCount;
    }
  }
}
