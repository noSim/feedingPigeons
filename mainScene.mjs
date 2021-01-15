import BreadCrumb from "./breadCrumb.mjs"
import Pigeon from "./pigeon.mjs"
import PigeonAssets from "./pigeonAssets.mjs"
import FontAssetsMonogram from "./fontAssetsMonogram.mjs"
import Text from "./text.mjs"

export default class MainScene {

  constructor() {
    this.eatableObjects = [];
    this.eatablePool = [];
    this.pigeonObjects = [];
    this.pigeonPool = [];
    this.pigeonAssets = new PigeonAssets();
    this.fontAssets = new FontAssetsMonogram();
    this.pigeonCounter = 1;
    this.showClickIndicatr = true;
    this.clickIndicator;
    this.width;
    this.height;
    this.loadingCompleted = false;

    Promise.all([
      this.pigeonAssets.load(),
      this.fontAssets.load()])
    .then(() => {
      this.loadingCompleted = true;
      this.clickIndicator = new Text(1, 1,
         "Klick für Krümel!", this.fontAssets, '#80bfbf');
    })
  }

  draw(ctx) {
    if (this.loadingCompleted) {
      this.eatableObjects.forEach(object => {
        object.draw(ctx);
      })
      this.pigeonObjects.forEach(object => {
        object.draw(ctx);
      })
      if (this.showClickIndicatr) {
        this.clickIndicator.draw(ctx)
      }
    }
  }

  update(delta, width, height) {
    if (this.loadingCompleted) {
      this.width = width;
      this.height = height;
      this.spawnPigeonIfRequired()
      this.eatableObjects.forEach(object => {
        object.update(delta, width, height);
      });
      this.pigeonObjects.forEach(object => {
        object.update(delta, width, height);
      })
      this.clickIndicator.update(delta, width, height)
    }
  }

  processClick(x, y) {
    if (this.loadingCompleted) {
      if (Math.round(y) < this.height * 4/5) {
        this.eatableObjects.push(this.getBreadCrumb(x, y));
        if (this.showClickIndicatr) {
          this.showClickIndicatr = false;
          
        }
      }
    }
  }

  resultionChanged(width, height) {
    this.width = width;
    this.height = height;
    this.eatablePool.push.apply(this.eatablePool, this.eatableObjects.splice(0, this.eatableObjects.length));
    this.pigeonPool.push.apply(this.pigeonPool, this.pigeonObjects.splice(0, this.pigeonObjects.length));
  }

  spawnPigeonIfRequired() {
    if (this.eatableObjects.length > this.pigeonObjects.length * 3) {
      this.pigeonObjects.push(this.getPigeon());
    }
  }

  getBreadCrumb(x, y) {
    var crumb = this.eatablePool.pop();
    if (!crumb) {
      crumb = new BreadCrumb(Math.round(x), Math.round(y), () => this.removeBreadCrumb(crumb));
    } else {
      crumb.reset(Math.round(x), Math.round(y));
    }
    return crumb;
  }
  
  removeBreadCrumb(crumb) {
    this.eatablePool.push(crumb)
    this.eatableObjects.splice(this.eatableObjects.indexOf(crumb), 1);
  }
  
  getPigeon() {
    var pigeon = this.pigeonPool.pop();
    var feedOffset = 24; // distance top to feed in pigeon asset
    var pigeonHeight = 32 + Math.random() * 32; // height is random 32 to 64 px
    var floorHeight = this.height * 4/5;
    var posY = floorHeight - feedOffset - pigeonHeight;
    var posX = Math.random() >= 0.5 ? - 32 : this.width; // either left or right of screen
    if (!pigeon) {
      pigeon = new Pigeon(posX, posY, this.pigeonAssets, this.eatableObjects,
         () => this.removePigeon(pigeon), this.pigeonCounter++);
    } else {
      pigeon.reset(posX, posY);
    }
    return pigeon;
  }
  
  removePigeon(pigeon) {
    this.pigeonPool.push(pigeon);
    this.pigeonObjects.splice(this.pigeonObjects.indexOf(pigeon), 1);
  }
}
