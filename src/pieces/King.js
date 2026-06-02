import { PIECE_TYPES } from '../utils/constants.js';
import Piece from './Piece.js';

export default class King extends Piece {
  constructor(color, row, col) {
    super(PIECE_TYPES.KING, color, row, col);
  }

  getPossibleMoves(board) {
    const moves = [];
    const directions = [
      { row: -1, col: -1 },
      { row: -1, col: 0 },
      { row: -1, col: 1 },
      { row: 0, col: -1 },
      { row: 0, col: 1 },
      { row: 1, col: -1 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
    ];

    for (const direction of directions) {
      const targetRow = this.row + direction.row;
      const targetCol = this.col + direction.col;

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
