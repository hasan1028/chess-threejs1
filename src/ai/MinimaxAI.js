import MoveValidator from '../rules/MoveValidator.js';
import { BOARD_SIZE, COLORS, PIECE_VALUES } from '../utils/constants.js';

export default class MinimaxAI {
  static chooseMove(board, color, depth = 2) {
    const validMoves = MinimaxAI.getAllValidMoves(board, color);

    if (validMoves.length === 0) {
      return null;
    }

    let bestMove = null;
    let bestScore = -Infinity;

    for (const move of validMoves) {
      const simulatedBoard = MinimaxAI.simulateMove(board, move);
      const score = MinimaxAI.minimax(simulatedBoard, depth - 1, false, color);

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  }

  static minimax(board, depth, isMaximizing, aiColor) {
    if (depth === 0) {
      return MinimaxAI.evaluateBoard(board, aiColor);
    }

    const currentColor = isMaximizing
      ? aiColor
      : MinimaxAI.getOpponentColor(aiColor);
    const validMoves = MinimaxAI.getAllValidMoves(board, currentColor);

    if (validMoves.length === 0) {
      return MinimaxAI.evaluateBoard(board, aiColor);
    }

    if (isMaximizing) {
      let bestScore = -Infinity;

      for (const move of validMoves) {
        const simulatedBoard = MinimaxAI.simulateMove(board, move);
        const score = MinimaxAI.minimax(
          simulatedBoard,
          depth - 1,
          false,
          aiColor,
        );

        bestScore = Math.max(bestScore, score);
      }

      return bestScore;
    }

    let bestScore = Infinity;

    for (const move of validMoves) {
      const simulatedBoard = MinimaxAI.simulateMove(board, move);
      const score = MinimaxAI.minimax(
        simulatedBoard,
        depth - 1,
        true,
        aiColor,
      );

      bestScore = Math.min(bestScore, score);
    }

    return bestScore;
  }

  static evaluateBoard(board, aiColor) {
    let score = 0;

    for (let row = 0; row < BOARD_SIZE; row += 1) {
      for (let col = 0; col < BOARD_SIZE; col += 1) {
        const piece = board.getPiece(row, col);

        if (!piece) {
          continue;
        }

        const pieceValue = PIECE_VALUES[piece.type] ?? 0;
        score += piece.color === aiColor ? pieceValue : -pieceValue;
      }
    }

    return score;
  }

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

  static simulateMove(board, move) {
    const clonedBoard = board.cloneBoard();
    const piece = clonedBoard.getPiece(move.fromRow, move.fromCol);

    clonedBoard.movePiece(move.fromRow, move.fromCol, move.toRow, move.toCol);

    if (piece) {
      piece.setPosition(move.toRow, move.toCol);
      piece.markAsMoved();
    }

    return clonedBoard;
  }

  static getOpponentColor(color) {
    return color === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE;
  }
}
