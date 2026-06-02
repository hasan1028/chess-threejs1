export const BOARD_SIZE = 8;
export const TILE_SIZE = 1.15;

export const COLORS = Object.freeze({
  WHITE: 'white',
  BLACK: 'black',
});

export const PIECE_TYPES = Object.freeze({
  PAWN: 'pawn',
  ROOK: 'rook',
  KNIGHT: 'knight',
  BISHOP: 'bishop',
  QUEEN: 'queen',
  KING: 'king',
});

export const GAME_MODES = Object.freeze({
  PLAYER_VS_PLAYER: 'player_vs_player',
  PLAYER_VS_AI: 'player_vs_ai',
});

export const GAME_STATES = Object.freeze({
  PLAYING: 'playing',
  CHECK: 'check',
  CHECKMATE: 'checkmate',
  STALEMATE: 'stalemate',
});

export const PIECE_VALUES = Object.freeze({
  pawn: 1,
  knight: 3,
  bishop: 3,
  rook: 5,
  queen: 9,
  king: 1000,
});

export const BOARD_COLORS = Object.freeze({
  light: '#f0d9b5',
  dark: '#6b8e6f',
});
