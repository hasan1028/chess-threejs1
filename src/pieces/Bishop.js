import { PIECE_TYPES } from '../utils/constants.js';
import Piece from './Piece.js';

export default class Bishop extends Piece {
  constructor(color, row, col) {
    super(PIECE_TYPES.BISHOP, color, row, col);
  }

  getPossibleMoves(board) {
    const moves = [];
    const directions = [
      { row: -1, col: -1 },
      { row: -1, col: 1 },
      { row: 1, col: -1 },
      { row: 1, col: 1 },
    ];

    for (const direction of directions) {
      let targetRow = this.row + direction.row;
      let targetCol = this.col + direction.col;

      while (board.isInsideBoard(targetRow, targetCol)) {
        const targetPiece = board.getPiece(targetRow, targetCol);

        if (!targetPiece) {
          moves.push({ row: targetRow, col: targetCol, capture: false });
        } else {
          if (targetPiece.color !== this.color) {
            moves.push({ row: targetRow, col: targetCol, capture: true });
          }

          break;
        }

        targetRow += direction.row;
        targetCol += direction.col;
      }
    }

    return moves;
  }
}
