import { COLORS, PIECE_TYPES } from '../utils/constants.js';
import Piece from './Piece.js';

export default class Pawn extends Piece {
  constructor(color, row, col) {
    super(PIECE_TYPES.PAWN, color, row, col);
  }

  getPossibleMoves(board) {
    const moves = [];
    const direction = this.color === COLORS.WHITE ? -1 : 1;
    const startRow = this.color === COLORS.WHITE ? 6 : 1;
    const oneStepRow = this.row + direction;
    const twoStepRow = this.row + direction * 2;

    if (
      board.isInsideBoard(oneStepRow, this.col) &&
      !board.getPiece(oneStepRow, this.col)
    ) {
      moves.push({ row: oneStepRow, col: this.col, capture: false });

      if (
        this.row === startRow &&
        !this.hasMoved &&
        board.isInsideBoard(twoStepRow, this.col) &&
        !board.getPiece(twoStepRow, this.col)
      ) {
        moves.push({ row: twoStepRow, col: this.col, capture: false });
      }
    }

    const captureColumns = [this.col - 1, this.col + 1];

    for (const col of captureColumns) {
      if (!board.isInsideBoard(oneStepRow, col)) {
        continue;
      }

      const targetPiece = board.getPiece(oneStepRow, col);

      if (targetPiece && targetPiece.color !== this.color) {
        moves.push({ row: oneStepRow, col, capture: true });
      }
    }

    return moves;
  }
}
