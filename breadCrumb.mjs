import GameObject from "./game_object.mjs"

export default class BreadCrumb extends GameObject {

  constructor(x, y) {
    super(x, y);
    this.height = 1;
    this.width = 1;
    this.eaten = false;
  }

  draw(ctx) {
    if (!this.eaten) {
      // crumb
      ctx.fillStyle = "rgb(139,69,19)";
      ctx.fillRect(this.x, this.y, this.width, this.height);
      // shadow
      if (this.floor) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        ctx.fillRect(this.x, this.floor, this.width, this.height);
      }
    }
  }

  update(timedelta, width, height) {
    this.floor = (4/5) * height
    var fallSpeed = 1 / 30;
    this.y = this.y + timedelta * fallSpeed;
    if (this.y > (this.floor - this.height)) this.y = this.floor - this.height;
  }

  isEaten() {
    return this.eaten;
  }

  eat() {
    this.eaten = true;
  }
}
