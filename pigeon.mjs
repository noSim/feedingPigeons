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
    this.headOffset = 5;
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
    var imgToDraw;
    switch (this.currentState) {
      case this.states.walking:
        imgToDraw = this.assets.walk
        break;
      case this.states.eating:
        imgToDraw = this.assets.eat
        break;
      case this.states.flying:
        imgToDraw = this.assets.fly
        break;
      case this.states.landing:
        imgToDraw = this.assets.land
          break;
    }
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
    if (this.eatables.length === 0) {
      console.log("no target available " + this.currentState)
      // TODO fly away
      return;
    }

    // find target and change direction
    if (this.currentState !== this.states.eating
       && (!this.target || this.target.isEaten())) {
      this.target = this.eatables[Math.floor(Math.random() * this.eatables.length)];
      this.directionRight = this.target.x > (this.x + this.width / 2);
    }

    // eat
    if (this.currentState === this.states.eating) {
      // wait until its on the ground
      if (!this.target.isOnFloor()) {
        return;
      }

      this.accumulatedTime += timedelta;
      if (this.accumulatedTime >= this.animationSpeed) {
        this.accumulatedTime = 0;
        if (this.currentFrame < this.frameCount) {
          this.currentFrame = (this.currentFrame + 1);
        }
      }
      if (this.currentFrame === 4) {
        this.target.eat();
      }
      if (this.currentFrame >= (this.frameCount - 1)) {
        this.eatables.splice(this.eatables.indexOf(this.target), 1);
        this.currentState = this.states.walking;
      }
      return;
    }

    // walking to target
    if (this.currentState === this.states.walking) {
      // walked to far, turn around
      if (this.directionRight && this.target.x < Math.round(this.x) ||
        !this.directionRight && this.target.x > (Math.round(this.x) + this.width)) {
        this.directionRight = !this.directionRight;
      }
      // walk to target
      if (this.directionRight && (this.target.x !== (Math.round(this.x) + this.width - this.headOffset)) ||
          !this.directionRight && (this.target.x !== (Math.round(this.x) - 1 + this.headOffset))) {
        var direction = this.directionRight ? 1 : -1;
        this.x += timedelta * this.walkSpeed * direction;

        this.accumulatedTime += timedelta;
        if (this.accumulatedTime >= this.animationSpeed) {
          this.accumulatedTime = 0;
          this.currentFrame = (this.currentFrame + 1) % this.frameCount;
        }
      } else {
        this.currentState = this.states.eating;
        this.currentFrame = 0;
      }
      return;
    }
  }
}
