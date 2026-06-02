import MoveValidator from '../rules/MoveValidator.js';
import { BOARD_SIZE } from '../utils/constants.js';

export default class RandomAI {
  static getAllValidMoves(board, color) {
    const validMoves = [];

    for (let row = 0; row < BOARD_SIZE; row += 1) {
      for (let col = 0; col < BOARD_SIZE; col += 1) {
        const piece = board.getPiece(row, col);

        if (!piece || piece.color !== color) {
          continue;
        }

        const pieceMoves = MoveValidator.getValidMoves(board, row, col, color);

        for (const move of pieceMoves) {
          validMoves.push({
            fromRow: row,
            fromCol: col,
            toRow: move.row,
            toCol: move.col,
          });
        }
      }
    }

    return validMoves;
  }

  static chooseMove(board, color) {
    const validMoves = RandomAI.getAllValidMoves(board, color);

    if (validMoves.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * validMoves.length);
    return validMoves[randomIndex];
  }
}
