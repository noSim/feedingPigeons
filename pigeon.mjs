import GameObject from "./game_object.mjs"

export default class Pigeon extends GameObject {
  constructor(x, y, pigeonAssets, eatables, pigeonHomeCallback, id) {
    super(x, y);
    this.assets = pigeonAssets;
    this.pigeonHomeCallback = pigeonHomeCallback;
    this.id = id;
    this.states = {
      eating: 0,
      walking: 1, 
      flying: 2,
      landing: 3,
      starting: 4,
      flyingHome: 5
    }
    this.frameCount = 8;
    this.width = 32; // asset width
    this.height = 32; // asset height
    this.headOffset = 5; // px distance from asset border to head
    this.feedOffset = 24; // px distance from asset top to feed
    this.animationSpeed = 150; // ms per frame
    this.landingDistance = 40; // distance to target where pigeon starts walking
    this.walkSpeed = 1 / 140; // px per ms in x direction
    this.flySpeed = 1 / 25; // px per ms in x direction
    this.landSpeed = 1 / 40; // px per ms in y direction (is calculated again dependendt on height)
    this.startSpeed = 1 / 40; // px per ms in y direction (is calculated again dependent on height)
    this.eatables = eatables;
    this.setDefaults()
  }

  reset(posX, posY) {
    this.x = posX;
    this.y = posY;
    this.setDefaults();
  }

  setDefaults() {
    this.currentState = this.states.flying;
    this.currentFrame = 0;
    this.accumulatedTime = 0;
    this.flyHome = false;
    this.target = this.eatables.length > 0 ? this.eatables[Math.floor(Math.random() * this.eatables.length)] : undefined;
    this.directionRight = this.target ? this.target.x > this.x : true;
  }

  draw(ctx) {
    ctx.save();
    if (!this.directionRight) {
      ctx.translate(Math.round(this.x) + this.width/2, Math.round(this.y) + this.width/2);
      ctx.scale(-1, 1);
      ctx.translate(-(Math.round(this.x) + this.width/2), -(Math.round(this.y) + this.width/2));
    }
    var imgToDraw;
    switch (this.currentState) {
      case this.states.walking:
        imgToDraw = this.assets.walk;
        break;
      case this.states.eating:
        imgToDraw = this.assets.eat;
        break;
      case this.states.flying:
        imgToDraw = this.assets.fly;
        break;
      case this.states.landing:
        imgToDraw = this.assets.land;
        break;
      case this.states.starting:
        imgToDraw = this.assets.land;
        break;
      case this.states.flyingHome:
        imgToDraw = this.assets.fly;
        break;
    }
    ctx.drawImage(imgToDraw,
      this.width * this.currentFrame, 0, this.width, this.height,
      Math.round(this.x), Math.round(this.y), this.width, this.height);

    // shadow
    if (this.floor) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(Math.round(this.x) + 4, this.floor, this.width - 8, 1);
    }
    ctx.restore();
  }

  update(timedelta, width, height) {
    this.floor = (4/5) * height
    
    // no food? -> prepare fly home
    if (this.eatables.length === 0 && !this.flyHome) {
      this.flyHome = true;
      // calculate takeoff speed
      var takeoffTime = this.animationSpeed * 7;
      var flyHeight = this.floor - this.feedOffset - 32 + Math.random() * 32;
      this.startSpeed = flyHeight / takeoffTime;

      this.currentState = this.states.starting;
      this.currentFrame = this.frameCount - 1;
      return;
    }

    // find target and change direction
    if (this.currentState !== this.states.eating
       && (!this.target || this.target.isEaten())
       && this.eatables.length !== 0) {
      this.target = this.eatables[Math.floor(Math.random() * this.eatables.length)];
      this.directionRight = this.target.x > (this.x + this.width / 2);
      this.flyHome = false;
    }

    // fly
    if (this.currentState === this.states.flying) {
      // target closby? -> time to land
      if (this.directionRight && (this.target.x - this.x) < (this.landingDistance + this.width) ||
        !this.directionRight && (this.x - this.target.x) < this.landingDistance) {
        this.currentState = this.states.landing;
        this.currentFrame = 0;

        // prepare landing speed
        var landTime = this.animationSpeed * 7;
        var distanceAboveFloor = this.floor - this.y - this.feedOffset;
        this.landSpeed = distanceAboveFloor / landTime;
        return;
      }

      var direction = this.directionRight ? 1 : -1;
      this.x += timedelta * this.flySpeed * direction;

      this.loopFrames(timedelta);
      return;
    }

    // land
    if (this.currentState == this.states.landing) {
      var direction = this.directionRight ? 1 : -1;
      this.x += this.walkSpeed * timedelta * direction;
      this.y += this.landSpeed * timedelta;
      if (this.y > (this.floor - this.feedOffset) || this.currentFrame == this.frameCount -1) {
        this.y = (this.floor - this.feedOffset);
      }
      if (this.currentFrame >= (this.frameCount - 1)) {
        this.currentState = this.states.walking;
        return;
      }
      this.playFramesOnce(timedelta)
      return;
    }

    // fly home
    if (this.currentState === this.states.flyingHome) {
      if (this.flyHome == false) {
        this.currentState = this.states.flying;
        return;
      }
      //out of screen?
      if (this.directionRight && this.x > width ||
        !this.directionRight && (this.x + this.width) < 0) {
        this.pigeonHomeCallback()
        return;
      }

      var direction = this.directionRight ? 1 : -1;
      this.x += timedelta * this.flySpeed * direction;

      this.loopFrames(timedelta);
      return;
    }

    // takeoff
    if (this.currentState == this.states.starting) {
      var direction = this.directionRight ? 1 : -1;
      this.x += this.walkSpeed * timedelta * direction;
      this.y -= this.startSpeed * timedelta;
      if (this.currentFrame <= 0) {
        this.currentState = this.states.flyingHome;
        return;
      }
      this.playFramesOnceInverse(timedelta);
      return;
    }

    // eat
    if (this.currentState === this.states.eating) {
      // wait until its on the ground
      if (!this.target.isOnFloor()) {
        return;
      }

      this.playFramesOnce(timedelta)
      if (this.currentFrame === 4) {
        this.target.eat();
      }
      if (this.currentFrame >= (this.frameCount - 1)) {
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

        this.loopFrames(timedelta)
      } else {
        this.currentState = this.states.eating;
        this.currentFrame = 0;
      }
      return;
    }
  }

  loopFrames(timedelta) {
    this.accumulatedTime += timedelta;
    if (this.accumulatedTime >= this.animationSpeed) {
      this.accumulatedTime = 0;
      this.currentFrame = (this.currentFrame + 1) % this.frameCount;
    }
  }

  playFramesOnce(timedelta) {
    this.accumulatedTime += timedelta;
    if (this.accumulatedTime >= this.animationSpeed) {
      this.accumulatedTime = 0;
      if (this.currentFrame < this.frameCount) {
        this.currentFrame = (this.currentFrame + 1);
      }
    }
  }

  playFramesOnceInverse(timedelta) {
    this.accumulatedTime += timedelta;
    if (this.accumulatedTime >= this.animationSpeed) {
      this.accumulatedTime = 0;
      if (this.currentFrame > 0) {
        this.currentFrame = (this.currentFrame -1);
      }
     }
  }
}
