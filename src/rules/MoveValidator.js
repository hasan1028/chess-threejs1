import CheckDetector from './CheckDetector.js';

export default class MoveValidator {
  static isValidMove(board, fromRow, fromCol, toRow, toCol, currentTurn) {
    const piece = board.getPiece(fromRow, fromCol);

    if (!piece) {
      return false;
    }

    if (piece.color !== currentTurn) {
      return false;
    }

    if (!board.isInsideBoard(toRow, toCol)) {
      return false;
    }

    const targetPiece = board.getPiece(toRow, toCol);

    if (targetPiece?.color === piece.color) {
      return false;
    }

    const isPossibleMove = piece
      .getPossibleMoves(board)
      .some((move) => move.row === toRow && move.col === toCol);

    if (!isPossibleMove) {
      return false;
    }

    if (
      MoveValidator.wouldLeaveKingInCheck(
        board,
        fromRow,
        fromCol,
        toRow,
        toCol,
        currentTurn,
      )
    ) {
      return false;
    }

    return true;
  }

  static wouldLeaveKingInCheck(board, fromRow, fromCol, toRow, toCol, currentTurn) {
    const clonedBoard = board.cloneBoard();
    const clonedPiece = clonedBoard.getPiece(fromRow, fromCol);

    if (!clonedPiece) {
      return true;
    }

    clonedBoard.movePiece(fromRow, fromCol, toRow, toCol);
    clonedPiece.setPosition(toRow, toCol);

    return CheckDetector.isKingInCheck(clonedBoard, currentTurn);
  }

  static getValidMoves(board, row, col, currentTurn) {
    const piece = board.getPiece(row, col);

    if (!piece || piece.color !== currentTurn) {
      return [];
    }

    return piece
      .getPossibleMoves(board)
      .filter((move) =>
        MoveValidator.isValidMove(
          board,
          row,
          col,
          move.row,
          move.col,
          currentTurn,
        ),
      );
  }
}
