import GameObject from "./game_object.mjs"

export default class Text extends GameObject {

  constructor(x, y, text, fontAsset, color) {
    super(x, y);
    this.text = text;
    this.fontAsset = fontAsset;
    this.spaceing = 1;
    this.canvas = document.createElement('canvas');
    this.width = text.length * fontAsset.charWidth + (text.length - 1) * this.spaceing
    this.canvas.width = this.width;
    this.canvas.height = fontAsset.charHeight;
    var ctx = this.canvas.getContext("2d");
    ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    var currentX = 0;
    for (var i = 0; i < this.text.length; i++) {
      var char = this.fontAsset.charPos[this.text[i]];
      if (!char) char = this.fontAsset.charPos['?'];
      ctx.drawImage(this.fontAsset.font,
        char.x, char.y,
        this.fontAsset.charWidth, this.fontAsset.charHeight,
        currentX, 0,
        this.fontAsset.charWidth, this.fontAsset.charHeight);
      currentX += this.fontAsset.charWidth + 1;
    }
    ctx.globalCompositeOperation='source-atop';
    ctx.fillStyle=color;
    ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
    ctx.globalCompositeOperation='source-over';
  }

  draw(ctx) {
    ctx.drawImage(this.canvas, this.x, this.y);
  }

  update(timedelta, width, height) {
    this.x =  Math.round((width / 2) - (this.width / 2));
    this.y = Math.round(height * 1/3);
  }
}
