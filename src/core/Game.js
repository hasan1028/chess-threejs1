import { Board } from './Board.js';
import Move from './Move.js';
import Player from './Player.js';
import MinimaxAI from '../ai/MinimaxAI.js';
import CheckDetector from '../rules/CheckDetector.js';
import MoveValidator from '../rules/MoveValidator.js';
import { COLORS, GAME_MODES, GAME_STATES } from '../utils/constants.js';



export default class Game {
  constructor() {
    this.board = new Board();
    this.board.initializeBoard();
    this.whitePlayer = new Player('White Player', COLORS.WHITE);
    this.blackPlayer = new Player('Black Player', COLORS.BLACK);
    this.currentTurn = COLORS.WHITE;
    this.gameState = GAME_STATES.PLAYING;
    this.moveHistory = [];
    this.selectedPiece = null;
    this.gameMode = GAME_MODES.PLAYER_VS_AI;
    this.blackPlayer.isAI = true;

    this.isAIThinking = false;
    this.isLocked = false;
    this.aiMoveTimeout = null;
  }

  startNewGame() {
    if (this.aiMoveTimeout) {
      clearTimeout(this.aiMoveTimeout);
      this.aiMoveTimeout = null;
    }

    this.board = new Board();
    this.board.initializeBoard();
    this.currentTurn = COLORS.WHITE;
    this.gameState = GAME_STATES.PLAYING;
    this.moveHistory = [];
    this.selectedPiece = null;
    this.isAIThinking = false;
    this.isLocked = false;
  }

  getCurrentPlayer() {
    return this.currentTurn === COLORS.WHITE ? this.whitePlayer : this.blackPlayer;
  }

  switchTurn() {
    this.currentTurn =
      this.currentTurn === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE;
  }

  selectPiece(row, col) {
    if (this.isLocked || this.isAIThinking) {
      return null;
    }

    const piece = this.board.getPiece(row, col);

    if (!piece || piece.color !== this.currentTurn) {
      this.selectedPiece = null;
      return null;
    }

    this.selectedPiece = piece;
    return this.selectedPiece;
  }

  movePiece(fromRow, fromCol, toRow, toCol, isAIMove = false) {
    if (this.isLocked && !isAIMove) return false;

    const isValid = MoveValidator.isValidMove(
      this.board,
      fromRow,
      fromCol,
      toRow,
      toCol,
      this.currentTurn,
    );

    if (!isValid) {
      return false;
    }

    const piece = this.board.getPiece(fromRow, fromCol);
    const capturedPiece = this.board.getPiece(toRow, toCol);
    const move = new Move(fromRow, fromCol, toRow, toCol, piece, capturedPiece);

    this.board.movePiece(fromRow, fromCol, toRow, toCol);
    piece.setPosition(toRow, toCol);
    piece.markAsMoved();
    this.moveHistory.push(move);
    this.selectedPiece = null;
    this.switchTurn();
    this.updateGameState();

    return true;
  }

  scheduleAIMove(delay = 900, onComplete = () => {}) {
    if (this.aiMoveTimeout || this.isLocked || this.isAIThinking) return false;
    if (this.gameMode !== GAME_MODES.PLAYER_VS_AI) return false;
    if (this.currentTurn !== COLORS.BLACK) return false;

    if (
      this.gameState === GAME_STATES.CHECKMATE ||
      this.gameState === GAME_STATES.STALEMATE
    ) {
      return false;
    }

    this.isAIThinking = true;
    this.isLocked = true;

    this.aiMoveTimeout = setTimeout(() => {
      this.aiMoveTimeout = null;
      const moved = this.makeAIMove();
      onComplete(moved);
    }, delay);

    return true;
  }

  makeAIMove() {
    if (
      this.gameState === GAME_STATES.CHECKMATE ||
      this.gameState === GAME_STATES.STALEMATE
    ) {
      this.isAIThinking = false;
      this.isLocked = false;
      return false;
    }
    if (this.currentTurn !== COLORS.BLACK) {
      this.isAIThinking = false;
      this.isLocked = false;
      return false;
    }

    this.isAIThinking = true;
    this.isLocked = true;

    try {
      const move = MinimaxAI.chooseMove(this.board, COLORS.BLACK, 2);

      if (!move) return false;

      return this.movePiece(
        move.fromRow,
        move.fromCol,
        move.toRow,
        move.toCol,
        true,
      );
    } finally {
      this.isAIThinking = false;
      this.isLocked = false;
    }
  }




  updateGameState() {
    if (CheckDetector.isCheckmate(this.board, this.currentTurn)) {
      this.gameState = GAME_STATES.CHECKMATE;
      return;
    }

    if (CheckDetector.isStalemate(this.board, this.currentTurn)) {
      this.gameState = GAME_STATES.STALEMATE;
      return;
    }

    if (CheckDetector.isKingInCheck(this.board, this.currentTurn)) {
      this.gameState = GAME_STATES.CHECK;
      return;
    }

    this.gameState = GAME_STATES.PLAYING;
  }

  getMoveHistory() {
    return [...this.moveHistory];
  }

  // setGameMode is intentionally removed; game is always PLAYER_VS_AI
  // blackPlayer is always the AI (MinimaxAI).
}
