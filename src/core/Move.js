export default class Move {
  constructor(fromRow, fromCol, toRow, toCol, piece, capturedPiece = null) {
    this.fromRow = fromRow;
    this.fromCol = fromCol;
    this.toRow = toRow;
    this.toCol = toCol;
    this.piece = piece;
    this.capturedPiece = capturedPiece;
    this.timestamp = new Date();
  }

  toString() {
    const color = this.piece?.color ?? 'unknown';
    const type = this.piece?.type ?? 'piece';

    return `${color} ${type}: (${this.fromRow},${this.fromCol}) -> (${this.toRow},${this.toCol})`;
  }
}
