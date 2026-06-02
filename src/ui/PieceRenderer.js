import * as THREE from 'three';
import { BOARD_SIZE, COLORS, PIECE_TYPES, TILE_SIZE } from '../utils/constants.js';

export default class PieceRenderer {
  constructor(scene) {
    this.scene = scene;
    this.pieceMeshes = new Map();
  }

  createPieceMesh(piece) {
    const group = new THREE.Group();
    const material = this.createPieceMaterial(piece.color);

    switch (piece.type) {
      case PIECE_TYPES.PAWN:
        this.buildPawn(group, material);
        break;
      case PIECE_TYPES.ROOK:
        this.buildRook(group, material);
        break;
      case PIECE_TYPES.KNIGHT:
        this.buildKnight(group, material);
        break;
      case PIECE_TYPES.BISHOP:
        this.buildBishop(group, material);
        break;
      case PIECE_TYPES.QUEEN:
        this.buildQueen(group, material);
        break;
      case PIECE_TYPES.KING:
        this.buildKing(group, material);
        break;
      default:
        this.buildPawn(group, material);
        break;
    }

    const pieceScale = TILE_SIZE * 0.95;
    group.scale.setScalar(pieceScale);

    group.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    return group;
  }

  createPieceMaterial(color) {
    const isWhite = color === COLORS.WHITE;

    return new THREE.MeshStandardMaterial({
      color: isWhite ? 0xe8e4d8 : 0x30343a,
      metalness: isWhite ? 0.08 : 0.36,
      roughness: isWhite ? 0.48 : 0.46,
    });
  }

  buildPawn(group, material) {
    this.addBase(group, material, 0.28);
    group.add(this.createCylinder(0.16, 0.28, material, 0.28, 24));
    group.add(this.createSphere(0.19, material, 0.54, 24, 16));
  }

  buildRook(group, material) {
    this.addBase(group, material, 0.34);
    group.add(this.createCylinder(0.22, 0.42, material, 0.34, 32));
    group.add(this.createCylinder(0.31, 0.12, material, 0.61, 32));

    const crenelOffsets = [
      { x: 0, z: 0.2 },
      { x: 0.2, z: 0 },
      { x: 0, z: -0.2 },
      { x: -0.2, z: 0 },
    ];

    for (const offset of crenelOffsets) {
      const block = this.createBox(0.15, 0.12, 0.15, material, 0.72);
      block.position.x = offset.x;
      block.position.z = offset.z;
      group.add(block);
    }
  }

  buildKnight(group, material) {
    this.addBase(group, material, 0.31);
    group.add(this.createCylinder(0.2, 0.32, material, 0.28, 24));

    const neck = this.createBox(0.24, 0.48, 0.22, material, 0.55);
    neck.rotation.z = -0.22;
    neck.position.x = -0.04;
    group.add(neck);

    const head = this.createCone(0.24, 0.44, material, 0.82, 4);
    head.rotation.z = -0.7;
    head.rotation.y = Math.PI / 4;
    head.position.x = 0.11;
    head.position.z = -0.03;
    group.add(head);

    const muzzle = this.createBox(0.22, 0.12, 0.18, material, 0.79);
    muzzle.position.x = 0.25;
    muzzle.position.z = -0.02;
    group.add(muzzle);
  }

  buildBishop(group, material) {
    this.addBase(group, material, 0.27);
    group.add(this.createCylinder(0.15, 0.46, material, 0.36, 32));
    group.add(this.createCone(0.23, 0.58, material, 0.74, 32));
    group.add(this.createSphere(0.1, material, 1.06, 20, 12));

    const notch = this.createBox(0.045, 0.42, 0.08, material, 0.87);
    notch.rotation.z = 0.55;
    notch.position.x = 0.07;
    group.add(notch);
  }

  buildQueen(group, material) {
    this.addBase(group, material, 0.35);
    group.add(this.createCylinder(0.23, 0.58, material, 0.42, 32));
    group.add(this.createSphere(0.25, material, 0.78, 28, 16));
    group.add(this.createTorus(0.22, 0.035, material, 0.96));

    const crownPositions = [
      { x: 0, z: 0.18 },
      { x: 0.16, z: 0.08 },
      { x: 0.16, z: -0.08 },
      { x: 0, z: -0.18 },
      { x: -0.16, z: -0.08 },
      { x: -0.16, z: 0.08 },
    ];

    for (const position of crownPositions) {
      const jewel = this.createSphere(0.055, material, 1.08, 12, 8);
      jewel.position.x = position.x;
      jewel.position.z = position.z;
      group.add(jewel);
    }

    group.add(this.createSphere(0.11, material, 1.18, 18, 12));
  }

  buildKing(group, material) {
    this.addBase(group, material, 0.37);
    group.add(this.createCylinder(0.25, 0.66, material, 0.46, 32));
    group.add(this.createSphere(0.24, material, 0.85, 28, 16));
    group.add(this.createTorus(0.2, 0.03, material, 1.02));

    const vertical = this.createBox(0.08, 0.42, 0.08, material, 1.22);
    const horizontal = this.createBox(0.3, 0.07, 0.07, material, 1.31);
    group.add(vertical, horizontal);
  }

  addBase(group, material, radius) {
    group.add(this.createCylinder(radius, 0.1, material, 0.05, 40));
    group.add(this.createTorus(radius * 0.82, 0.035, material, 0.12));
  }

  renderPieces(board) {
    this.clearPieces();

    for (let row = 0; row < BOARD_SIZE; row += 1) {
      for (let col = 0; col < BOARD_SIZE; col += 1) {
        const piece = board.getPiece(row, col);

        if (!piece) {
          continue;
        }

        const mesh = this.createPieceMesh(piece);
        const position = this.getWorldPosition(row, col);

        mesh.position.set(position.x, position.y, position.z);
        mesh.userData = { piece, row, col };

        this.scene.add(mesh);
        this.pieceMeshes.set(`${row}-${col}`, mesh);
      }
    }
  }

  animatePieceMove(fromRow, fromCol, toRow, toCol, onComplete) {
    const mesh = this.pieceMeshes.get(`${fromRow}-${fromCol}`);

    if (!mesh) {
      onComplete?.();
      return;
    }

    const startPosition = this.getWorldPosition(fromRow, fromCol);
    const endPosition = this.getWorldPosition(toRow, toCol);
    const startTime = performance.now();
    const duration = 250;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - (1 - progress) ** 3;

      mesh.position.x = THREE.MathUtils.lerp(
        startPosition.x,
        endPosition.x,
        easedProgress,
      );
      mesh.position.y =
        THREE.MathUtils.lerp(startPosition.y, endPosition.y, easedProgress) +
        Math.sin(progress * Math.PI) * 0.18;
      mesh.position.z = THREE.MathUtils.lerp(
        startPosition.z,
        endPosition.z,
        easedProgress,
      );

      if (progress < 1) {
        requestAnimationFrame(animate);
        return;
      }

      mesh.position.set(endPosition.x, endPosition.y, endPosition.z);
      onComplete?.();
    };

    requestAnimationFrame(animate);
  }

  clearPieces() {
    for (const mesh of this.pieceMeshes.values()) {
      this.scene.remove(mesh);
    }

    this.pieceMeshes.clear();
  }

  getWorldPosition(row, col) {
    const offset = ((BOARD_SIZE - 1) * TILE_SIZE) / 2;

    return {
      x: col * TILE_SIZE - offset,
      y: 0.12,
      z: row * TILE_SIZE - offset,
    };
  }

  createCylinder(radius, height, material, y = height / 2, segments = 32) {
    const geometry = new THREE.CylinderGeometry(radius, radius, height, segments);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = y;
    return mesh;
  }

  createCone(radius, height, material, y, segments = 32) {
    const geometry = new THREE.ConeGeometry(radius, height, segments);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = y;
    return mesh;
  }

  createSphere(radius, material, y, widthSegments = 24, heightSegments = 16) {
    const geometry = new THREE.SphereGeometry(
      radius,
      widthSegments,
      heightSegments,
    );
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = y;
    return mesh;
  }

  createBox(width, height, depth, material, y) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = y;
    return mesh;
  }

  createTorus(radius, tube, material, y) {
    const geometry = new THREE.TorusGeometry(radius, tube, 12, 40);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = y;
    mesh.rotation.x = Math.PI / 2;
    return mesh;
  }
}
