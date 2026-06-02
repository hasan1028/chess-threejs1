import { PIECE_TYPES } from '../utils/constants.js';
import Piece from './Piece.js';

export default class Knight extends Piece {
  constructor(color, row, col) {
    super(PIECE_TYPES.KNIGHT, color, row, col);
  }

  getPossibleMoves(board) {
    const moves = [];
    const offsets = [
      { row: -2, col: -1 },
      { row: -2, col: 1 },
      { row: -1, col: -2 },
      { row: -1, col: 2 },
      { row: 1, col: -2 },
      { row: 1, col: 2 },
      { row: 2, col: -1 },
      { row: 2, col: 1 },
    ];

    for (const offset of offsets) {
      const targetRow = this.row + offset.row;
      const targetCol = this.col + offset.col;

      if (!board.isInsideBoard(targetRow, targetCol)) {
        continue;
      }

      const targetPiece = board.getPiece(targetRow, targetCol);

      if (!targetPiece) {
        moves.push({ row: targetRow, col: targetCol, capture: false });
      } else if (targetPiece.color !== this.color) {
        moves.push({ row: targetRow, col: targetCol, capture: true });
      }
    }

    return moves;
  }
}
