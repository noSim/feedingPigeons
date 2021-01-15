export default class FontAssetsMonogram {
  constructor() {
    this.font = new Image();
    this.font.src = "./assets/monogram.png";
    this.charWidth = 5;
    this.charHeight = 9;
    this.charPos = {
      'A': {x: 2, y: 2},  'a': {x: 2, y: 29},
      'B': {x: 8, y: 2},  'b': {x: 8, y: 29},
      'C': {x: 14, y: 2}, 'c': {x: 14, y: 29},
      'D': {x: 20, y: 2}, 'd': {x: 20, y: 29},
      'E': {x: 26, y: 2}, 'e': {x: 26, y: 29},
      'F': {x: 32, y: 2}, 'f': {x: 32, y: 29},
      'G': {x: 38, y: 2}, 'g': {x: 38, y: 29},
      'H': {x: 44, y: 2}, 'h': {x: 44, y: 29},
      'I': {x: 50, y: 2}, 'i': {x: 50, y: 29},
      'J': {x: 56, y: 2}, 'j': {x: 56, y: 29},
      'K': {x: 62, y: 2}, 'k': {x: 62, y: 29},
      'L': {x: 68, y: 2}, 'l': {x: 68, y: 29},
      'M': {x: 74, y: 2}, 'm': {x: 74, y: 29},
      'N': {x: 2, y: 12}, 'n': {x: 2, y: 39},
      'O': {x: 8, y: 12}, 'o': {x: 8, y: 39},
      'P': {x: 14, y: 12},'p': {x: 14, y: 39},
      'Q': {x: 20, y: 12},'q': {x: 20, y: 39},
      'R': {x: 26, y: 12},'r': {x: 26, y: 39},
      'S': {x: 32, y: 12},'s': {x: 32, y: 39},
      'T': {x: 38, y: 12},'t': {x: 38, y: 39},
      'U': {x: 44, y: 12},'u': {x: 44, y: 39},
      'V': {x: 50, y: 12},'v': {x: 50, y: 39},
      'W': {x: 56, y: 12},'w': {x: 56, y: 39},
      'X': {x: 62, y: 12},'x': {x: 62, y: 39},
      'Y': {x: 68, y: 12},'y': {x: 68, y: 39},
      'Z': {x: 74, y: 12},'z': {x: 74, y: 39},

      'ä': {x: 80, y: 39},
      'ü': {x: 80, y: 29},
      'ö': {x: 80, y: 12},

      '1': {x: 2, y: 56},
      '2': {x: 8, y: 56},
      '3': {x: 14, y: 56},
      '4': {x: 20, y: 56},
      '5': {x: 26, y: 56},
      '6': {x: 32, y: 56},
      '7': {x: 38, y: 56},
      '8': {x: 44, y: 56},
      '9': {x: 50, y: 56},
      '0': {x: 56, y: 56},

      ' ': {x: 80, y: 2},
      '!': {x: 89, y: 23},
      '?': {x: 95, y: 23},
      '.': {x: 101, y: 23},
      ',': {x: 107, y: 23},
    }
  }

  load() {
    return new Promise((resolve, reject) => {
      this.font.onload = () => resolve()
      this.font.onerror = reject
    })
  }
}
