import { BOARD_SIZE, COLORS, PIECE_TYPES } from '../utils/constants.js';

export default class CheckDetector {
  static findKing(board, color) {
    for (let row = 0; row < BOARD_SIZE; row += 1) {
      for (let col = 0; col < BOARD_SIZE; col += 1) {
        const piece = board.getPiece(row, col);

        if (piece?.type === PIECE_TYPES.KING && piece.color === color) {
          return { row, col, piece };
        }
      }
    }

    return null;
  }

  static isSquareUnderAttack(board, row, col, byColor) {
    for (let pieceRow = 0; pieceRow < BOARD_SIZE; pieceRow += 1) {
      for (let pieceCol = 0; pieceCol < BOARD_SIZE; pieceCol += 1) {
        const piece = board.getPiece(pieceRow, pieceCol);

        if (!piece || piece.color !== byColor) {
          continue;
        }

        const attacksSquare = piece
          .getPossibleMoves(board)
          .some((move) => move.row === row && move.col === col);

        if (attacksSquare) {
          return true;
        }
      }
    }

    return false;
  }

  static isKingInCheck(board, color) {
    const king = CheckDetector.findKing(board, color);

    if (!king) {
      return false;
    }

    const opponentColor = CheckDetector.getOpponentColor(color);
    return CheckDetector.isSquareUnderAttack(
      board,
      king.row,
      king.col,
      opponentColor,
    );
  }

  static hasAnyLegalMove(board, color) {
    for (let row = 0; row < BOARD_SIZE; row += 1) {
      for (let col = 0; col < BOARD_SIZE; col += 1) {
        const piece = board.getPiece(row, col);

        if (!piece || piece.color !== color) {
          continue;
        }

        const possibleMoves = piece.getPossibleMoves(board);

        for (const move of possibleMoves) {
          const clonedBoard = board.cloneBoard();
          const clonedPiece = clonedBoard.getPiece(row, col);

          if (!clonedPiece) {
            continue;
          }

          clonedBoard.movePiece(row, col, move.row, move.col);
          clonedPiece.setPosition(move.row, move.col);

          if (!CheckDetector.isKingInCheck(clonedBoard, color)) {
            return true;
          }
        }
      }
    }

    return false;
  }

  static isCheckmate(board, color) {
    if (!CheckDetector.isKingInCheck(board, color)) {
      return false;
    }

    return !CheckDetector.hasAnyLegalMove(board, color);
  }

  static isStalemate(board, color) {
    if (CheckDetector.isKingInCheck(board, color)) {
      return false;
    }

    return !CheckDetector.hasAnyLegalMove(board, color);
  }

  static getOpponentColor(color) {
    return color === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE;
  }
}
