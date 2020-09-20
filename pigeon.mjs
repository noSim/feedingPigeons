import GameObject from "./game_object.mjs"

export default class Pigeon extends GameObject {
  constructor(x, y, pigeonAssets, eatables) {
    super(x, y);
    this.assets = pigeonAssets;
    this.states = {
      eating: 0,
      walking: 1, 
      flying: 2,
      landing: 3,
      starting: 4
    }
    this.currentState = this.states.walking;
    this.frameCount = 8;
    this.currentFrame = 0;
    this.width = 32;
    this.height = 32;
    this.animationSpeed = 150;
    this.accumulatedTime = 0;
    this.walkSpeed = 1 / 140;
    this.eatables = eatables;
    this.target = eatables[Math.floor(Math.random() * eatables.length)]
    this.directionRight = this.target.x > this.x
  }

  draw(ctx) {
    ctx.save();
    if (!this.directionRight) {
      ctx.translate(Math.round(this.x) + this.width/2, this.y + this.width/2);
      ctx.scale(-1, 1);
      ctx.translate(-(Math.round(this.x) + this.width/2), -(this.y + this.width/2));
    }
    const imgToDraw = this.assets.walk;
    ctx.drawImage(imgToDraw,
      this.width * this.currentFrame, 0, this.width, this.height,
      Math.round(this.x), this.y, this.width, this.height);

    // shadow
    if (this.floor) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(Math.round(this.x) + 4, this.floor, this.width - 8, 1);
    }
    ctx.restore();
  }

  update(timedelta, width, height) {
    this.floor = (4/5) * height
    // are there targets
    if (this.eatables.length === 0 || !this.target) {
      // TODO fly away
      return;
    }

    // find target and change direction
    if (this.target.isEaten()) {
      this.target = this.eatables[Math.floor(Math.random() * this.eatables.length)];
      this.directionRight = this.target.x > this.x
    }

    // walking to target
    if (this.currentState === this.states.walking) {
      if (this.directionRight && this.target.x > (this.x + this.width) ||
          !this.directionRight && this.target.x < this.x) {
        var direction = this.directionRight ? 1 : -1;
        this.x += timedelta * this.walkSpeed * direction;

        this.accumulatedTime += timedelta;
        if (this.accumulatedTime >= this.animationSpeed) {
          this.accumulatedTime = 0;
          this.currentFrame = (this.currentFrame + 1) % this.frameCount;
        }
      } else {
        // TODO do eating
        this.target.eat();
        this.eatables.splice(this.eatables.indexOf(this.target), 1)
      }
    }
  }
}
