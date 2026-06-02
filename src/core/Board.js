import Bishop from '../pieces/Bishop.js';
import King from '../pieces/King.js';
import Knight from '../pieces/Knight.js';
import Pawn from '../pieces/Pawn.js';
import Queen from '../pieces/Queen.js';
import Rook from '../pieces/Rook.js';
import { BOARD_SIZE, COLORS } from '../utils/constants.js';

export class Board {
  constructor() {
    this.board = this.createEmptyBoard();
    this.initializeBoard();
  }

  initializeBoard() {
    this.board = this.createEmptyBoard();

    for (let col = 0; col < BOARD_SIZE; col += 1) {
      this.placePiece(new Pawn(COLORS.BLACK, 1, col), 1, col);
      this.placePiece(new Pawn(COLORS.WHITE, 6, col), 6, col);
    }

    const backRank = [Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook];

    backRank.forEach((PieceClass, col) => {
      this.placePiece(new PieceClass(COLORS.BLACK, 0, col), 0, col);
      this.placePiece(new PieceClass(COLORS.WHITE, 7, col), 7, col);
    });
  }

  createEmptyBoard() {
    return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));
  }

  placePiece(piece, row, col) {
    if (!this.isInsideBoard(row, col)) {
      return false;
    }

    this.board[row][col] = piece;
    return true;
  }

  movePiece(fromRow, fromCol, toRow, toCol) {
    if (!this.isInsideBoard(fromRow, fromCol) || !this.isInsideBoard(toRow, toCol)) {
      return false;
    }

    const piece = this.getPiece(fromRow, fromCol);
    if (!piece) {
      return false;
    }

    this.board[toRow][toCol] = piece;
    this.board[fromRow][fromCol] = null;
    return true;
  }

  getPiece(row, col) {
    if (!this.isInsideBoard(row, col)) {
      return null;
    }

    return this.board[row][col];
  }

  isInsideBoard(row, col) {
    return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
  }

  removePiece(row, col) {
    if (!this.isInsideBoard(row, col)) {
      return false;
    }

    this.board[row][col] = null;
    return true;
  }

  cloneBoard() {
    const clonedBoard = Object.create(Board.prototype);

    clonedBoard.board = this.board.map((row) =>
      row.map((piece) => (piece ? piece.clone() : null)),
    );

    return clonedBoard;
  }

}
