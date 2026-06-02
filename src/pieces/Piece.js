export default class Piece {
  constructor(type, color, row, col) {
    this.type = type;
    this.color = color;
    this.row = row;
    this.col = col;
    this.hasMoved = false;
  }

  setPosition(row, col) {
    this.row = row;
    this.col = col;
  }

  markAsMoved() {
    this.hasMoved = true;
  }

  getPossibleMoves() {
    return [];
  }

  clone() {
    const clonedPiece = new this.constructor(this.color, this.row, this.col);
    clonedPiece.hasMoved = this.hasMoved;
    return clonedPiece;
  }
}
