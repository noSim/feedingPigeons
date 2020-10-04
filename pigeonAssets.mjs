export default class PigeonAssets {
  constructor() {
    this.walk = new Image();
    this.walk.src = "./assets/pigeonWalk.png";
    this.fly = new Image();
    this.fly.src = "./assets/pigeonFly.png";
    this.land = new Image();
    this.land.src = "./assets/pigeonLand.png";
    this.eat = new Image();
    this.eat.src = "./assets/pigeonEat.png";
  }

  loading() {
    var promiseWalk = new Promise((resolve, reject) => {
      this.walk.onload = () => resolve()
      this.walk.onerror = reject
    });
    var promiseFly = new Promise((resolve, reject) => {
      this.fly.onload = () => resolve()
      this.fly.onerror = reject
    });
    var promiseLand = new Promise((resolve, reject) => {
      this.land.onload = () => resolve()
      this.land.onerror = reject
    });
    var promiseEat = new Promise((resolve, reject) => {
      this.eat.onload = () => resolve()
      this.eat.onerror = reject
    });
    return Promise.all([
      promiseWalk,
      promiseFly,
      promiseLand,
      promiseEat])
  }
}
