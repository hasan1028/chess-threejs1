import * as THREE from 'three';
import MoveValidator from '../rules/MoveValidator.js';
import { COLORS } from '../utils/constants.js';


export default class InputController {
  constructor({
    camera,
    scene,
    renderer,
    game,
    chessBoard3D,
    pieceRenderer,
    uiManager,
  }) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.game = game;
    this.chessBoard3D = chessBoard3D;
    this.pieceRenderer = pieceRenderer;
    this.uiManager = uiManager;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.selectedPosition = null;
    this.isAnimating = false;
    this.hoveredSquare = null;
    this.isLocked = false;


    this.onMouseClick = this.onMouseClick.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.renderer.domElement.addEventListener('click', this.onMouseClick);
    this.renderer.domElement.addEventListener('mousemove', this.onMouseMove);
    this.renderer.domElement.addEventListener('mouseleave', this.onMouseLeave);
  }

  onMouseClick(event) {
    // Prevent the player from moving while the AI is thinking/moving.
    if (this.isLocked) return;
    if (this.isAnimating) return;
    if (this.game.isAIThinking) return;
    if (this.game.isLocked) return;

    // Player controls only WHITE.
    if (this.game.currentTurn !== COLORS.WHITE) return;









    const clickedSquare = this.getClickedSquare(event);

    if (!clickedSquare) {
      this.selectedPosition = null;
      this.hoveredSquare = null;
      this.chessBoard3D.clearHighlights();
      return;
    }

    const { row, col } = clickedSquare;

    if (!this.selectedPosition) {
      const selectedPiece = this.game.selectPiece(row, col);

      if (!selectedPiece) {
        return;
      }

      this.selectedPosition = { row, col };
      this.hoveredSquare = null;
      this.chessBoard3D.clearHighlights();
      this.chessBoard3D.highlightSelectedSquare(row, col);

      const moves = MoveValidator.getValidMoves(
        this.game.board,
        row,
        col,
        this.game.currentTurn,
      );
      this.chessBoard3D.highlightMoves(moves);
      return;
    }

    const moveSucceeded = this.game.movePiece(
      this.selectedPosition.row,
      this.selectedPosition.col,
      row,
      col,
    );

    if (moveSucceeded) {
      this.isAnimating = true;
      this.pieceRenderer.animatePieceMove(
        this.selectedPosition.row,
        this.selectedPosition.col,
        row,
        col,
        () => {
          this.pieceRenderer.renderPieces(this.game.board);
          this.chessBoard3D.clearHighlights();
          this.hoveredSquare = null;
          this.uiManager.update(this.game);

          this.isAnimating = false;

          this.game.scheduleAIMove(900, () => {
            this.pieceRenderer.renderPieces(this.game.board);
            this.chessBoard3D.clearHighlights();
            this.hoveredSquare = null;
            this.uiManager.update(this.game);
          });
        },
      );
    } else {
      this.hoveredSquare = null;
      this.chessBoard3D.clearHighlights();
    }


    this.selectedPosition = null;
  }

  onMouseMove(event) {
    if (this.isAnimating) return;
    if (this.game.isAIThinking) return;
    if (this.game.isLocked) return;

    // Sadece beyaz sıra iken hover yapılabilsin
    if (this.game.currentTurn !== COLORS.WHITE) return;



    const hoveredSquare = this.getClickedSquare(event);

    if (!hoveredSquare) {
      this.hoveredSquare = null;
      this.chessBoard3D.clearHoverSquare();
      return;
    }

    const isSameSquare =
      this.hoveredSquare?.row === hoveredSquare.row &&
      this.hoveredSquare?.col === hoveredSquare.col;

    if (isSameSquare) {
      return;
    }

    this.hoveredSquare = hoveredSquare;
    this.chessBoard3D.highlightHoverSquare(hoveredSquare.row, hoveredSquare.col);
  }

  onMouseLeave() {
    this.hoveredSquare = null;
    this.chessBoard3D.clearHoverSquare();
  }

  getClickedSquare(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();

    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.camera.updateMatrixWorld(true);
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const clickableObjects = [
      ...this.chessBoard3D.tiles,
      ...this.pieceRenderer.pieceMeshes.values(),
    ];
    const intersections = this.raycaster.intersectObjects(clickableObjects, true);

    if (intersections.length === 0) {
      return null;
    }

    const hitObject = intersections[0].object;
    const sourceObject = this.findObjectWithPositionData(hitObject);

    if (!sourceObject) {
      return null;
    }

    return {
      row: sourceObject.userData.row,
      col: sourceObject.userData.col,
    };
  }

  findObjectWithPositionData(object) {
    let currentObject = object;

    while (currentObject) {
      if (
        Number.isInteger(currentObject.userData.row) &&
        Number.isInteger(currentObject.userData.col)
      ) {
        return currentObject;
      }

      currentObject = currentObject.parent;
    }

    return null;
  }
}
