import './style.css';
import Game from './core/Game.js';
import SceneManager from './ui/SceneManager.js';
import ChessBoard3D from './ui/ChessBoard3D.js';
import PieceRenderer from './ui/PieceRenderer.js';
import InputController from './ui/InputController.js';
import UIManager from './ui/UIManager.js';

const game = new Game();
const sceneManager = new SceneManager();
sceneManager.init();

const chessBoard3D = new ChessBoard3D(sceneManager.scene);
chessBoard3D.createBoard();

const pieceRenderer = new PieceRenderer(sceneManager.scene);
pieceRenderer.renderPieces(game.board);

const uiManager = new UIManager();
uiManager.update(game);
uiManager.bindEvents(game, pieceRenderer, chessBoard3D);

const inputController = new InputController({
  camera: sceneManager.camera,
  scene: sceneManager.scene,
  renderer: sceneManager.renderer,
  game,
  chessBoard3D,
  pieceRenderer,
  uiManager,
});

window.__chessApp = {
  game,
  sceneManager,
  chessBoard3D,
  pieceRenderer,
  uiManager,
  inputController,
};

sceneManager.animate();
