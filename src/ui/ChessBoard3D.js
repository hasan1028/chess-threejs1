import * as THREE from 'three';
import { BOARD_COLORS, BOARD_SIZE, TILE_SIZE } from '../utils/constants.js';

export default class ChessBoard3D {
  constructor(scene) {
    this.scene = scene;
    this.tiles = [];
    this.activeHighlights = new Map();
    this.hoveredSquare = null;
  }

  createBoard() {
    const geometry = new THREE.BoxGeometry(TILE_SIZE, 0.12, TILE_SIZE);
    const offset = ((BOARD_SIZE - 1) * TILE_SIZE) / 2;

    this.createPlatform();

    for (let row = 0; row < BOARD_SIZE; row += 1) {
      for (let col = 0; col < BOARD_SIZE; col += 1) {
        const isLightSquare = (row + col) % 2 === 0;
        const originalColor = isLightSquare
          ? BOARD_COLORS.light
          : BOARD_COLORS.dark;
        const material = new THREE.MeshStandardMaterial({
          color: originalColor,
        });
        const tile = new THREE.Mesh(geometry, material);

        tile.position.set(col * TILE_SIZE - offset, 0, row * TILE_SIZE - offset);
        tile.receiveShadow = true;
        tile.userData = {
          row,
          col,
          originalColor,
        };

        this.scene.add(tile);
        this.tiles.push(tile);
      }
    }
  }

  createPlatform() {
    const boardWidth = BOARD_SIZE * TILE_SIZE;
    const geometry = new THREE.BoxGeometry(boardWidth + 0.45, 0.16, boardWidth + 0.45);
    const material = new THREE.MeshStandardMaterial({
      color: 0x24292f,
      metalness: 0.08,
      roughness: 0.72,
    });
    const platform = new THREE.Mesh(geometry, material);

    platform.position.set(0, -0.16, 0);
    platform.receiveShadow = true;

    this.scene.add(platform);
  }

  clearHighlights() {
    for (const tile of this.tiles) {
      tile.material.color.set(tile.userData.originalColor);
    }

    this.activeHighlights.clear();
    this.hoveredSquare = null;
  }

  highlightSquare(row, col, color, persistent = true) {
    const tile = this.tiles.find(
      (currentTile) =>
        currentTile.userData.row === row && currentTile.userData.col === col,
    );

    if (tile) {
      tile.material.color.set(color);

      if (persistent) {
        this.activeHighlights.set(this.getSquareKey(row, col), color);
      }
    }
  }

  highlightSelectedSquare(row, col) {
    this.highlightSquare(row, col, '#4f9f68');
  }

  highlightHoverSquare(row, col) {
    const key = this.getSquareKey(row, col);

    if (this.activeHighlights.has(key)) {
      this.clearHoverSquare();
      return;
    }

    this.clearHoverSquare();
    this.highlightSquare(row, col, '#6f7f8f', false);
    this.hoveredSquare = { row, col };
  }

  clearHoverSquare() {
    if (!this.hoveredSquare) {
      return;
    }

    const { row, col } = this.hoveredSquare;
    const key = this.getSquareKey(row, col);

    if (!this.activeHighlights.has(key)) {
      const tile = this.getTile(row, col);
      tile?.material.color.set(tile.userData.originalColor);
    }

    this.hoveredSquare = null;
  }

  highlightMoves(moves) {
    for (const move of moves) {
      this.highlightSquare(
        move.row,
        move.col,
        move.capture ? '#b94b4b' : '#d8bc58',
      );
    }
  }

  getTile(row, col) {
    return this.tiles.find(
      (tile) => tile.userData.row === row && tile.userData.col === col,
    );
  }

  getSquareKey(row, col) {
    return `${row}-${col}`;
  }
}
