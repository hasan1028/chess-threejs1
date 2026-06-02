import puppeteer from 'puppeteer-core';
import * as THREE from 'three';

const executablePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const viewport = { width: 1280, height: 800 };
const delay = (milliseconds) =>
  new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });

function projectSquare(row, col) {
  const camera = new THREE.PerspectiveCamera(
    42,
    viewport.width / viewport.height,
    0.1,
    1000,
  );

  camera.position.set(0, 8.5, 8.5);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld();
  camera.updateProjectionMatrix();

  const tileSize = 1.15;
  const offset = 3.5 * tileSize;
  const vector = new THREE.Vector3(
    col * tileSize - offset,
    0.2,
    row * tileSize - offset,
  ).project(camera);

  return {
    x: ((vector.x + 1) / 2) * viewport.width,
    y: ((1 - vector.y) / 2) * viewport.height,
  };
}

const browser = await puppeteer.launch({
  executablePath,
  headless: true,
  args: ['--no-sandbox', '--use-gl=swiftshader'],
});

try {
  const page = await browser.newPage();
  await page.setViewport(viewport);

  const logs = [];
  page.on('console', (message) => {
    logs.push({ type: message.type(), text: message.text() });
  });
  page.on('pageerror', (error) => {
    logs.push({ type: 'pageerror', text: error.message });
  });

  await page.goto('http://localhost:5173/', {
    waitUntil: 'domcontentloaded',
    timeout: 30000,
  });
  await page.waitForSelector('canvas');
  await page.waitForSelector('.ui-panel');

  const canvasInfo = await page.$eval('canvas', (canvas) => {
    const context = canvas.getContext('webgl2') || canvas.getContext('webgl');
    const pixels = new Uint8Array(4);
    context.readPixels(
      Math.floor(canvas.width / 2),
      Math.floor(canvas.height / 2),
      1,
      1,
      context.RGBA,
      context.UNSIGNED_BYTE,
      pixels,
    );

    return {
      width: canvas.width,
      height: canvas.height,
      centerPixel: Array.from(pixels),
    };
  });

  const uiBefore = await page.evaluate(() => ({
    turn: document.querySelector('[data-role="current-turn"]').textContent,
    state: document.querySelector('[data-role="game-state"]').textContent,
    historyCount: document.querySelectorAll('[data-role="move-history"] li')
      .length,
  }));

  const pawn = projectSquare(6, 0);
  const target = projectSquare(5, 0);

  await page.mouse.click(pawn.x, pawn.y);
  await delay(200);

  const selectedAfterClick = await page.evaluate(() => {
    const selected = window.__chessApp.game.selectedPiece;
    return selected
      ? {
          type: selected.type,
          color: selected.color,
          row: selected.row,
          col: selected.col,
        }
      : null;
  });

  const afterSelectPixel = await page.$eval('canvas', (canvas) => {
    const context = canvas.getContext('webgl2') || canvas.getContext('webgl');
    const pixels = new Uint8Array(4);
    context.readPixels(
      Math.floor(canvas.width / 2),
      Math.floor(canvas.height / 2),
      1,
      1,
      context.RGBA,
      context.UNSIGNED_BYTE,
      pixels,
    );
    return Array.from(pixels);
  });

  await page.mouse.click(target.x, target.y);
  await delay(500);

  const uiAfterMove = await page.evaluate(() => ({
    turn: document.querySelector('[data-role="current-turn"]').textContent,
    state: document.querySelector('[data-role="game-state"]').textContent,
    historyCount: document.querySelectorAll('[data-role="move-history"] li')
      .length,
    history: [...document.querySelectorAll('[data-role="move-history"] li')].map(
      (item) => item.textContent,
    ),
    boardFrom: window.__chessApp.game.board.getPiece(6, 0)?.type ?? null,
    boardTo: window.__chessApp.game.board.getPiece(5, 0)?.type ?? null,
    turnValue: window.__chessApp.game.currentTurn,
  }));

  await page.click('[data-role="new-game"]');
  await delay(200);

  const uiAfterNewGame = await page.evaluate(() => ({
    turn: document.querySelector('[data-role="current-turn"]').textContent,
    state: document.querySelector('[data-role="game-state"]').textContent,
    historyCount: document.querySelectorAll('[data-role="move-history"] li')
      .length,
  }));

  console.log(
    JSON.stringify(
      {
        logs,
        canvasInfo,
        uiBefore,
        selectedAfterClick,
        afterSelectPixel,
        uiAfterMove,
        uiAfterNewGame,
        clicked: { pawn, target },
      },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
}
