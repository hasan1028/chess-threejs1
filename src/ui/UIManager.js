import { GAME_STATES } from '../utils/constants.js';


export default class UIManager {
  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'ui-panel';
    document.body.appendChild(this.container);

    this.createUI();
  }

  createUI() {
    this.container.innerHTML = `
      <div class="ui-panel__row">
        <span class="ui-panel__label">Sira</span>
        <strong data-role="current-turn">-</strong>
      </div>
      <div class="ui-panel__row">
        <span class="ui-panel__label">Durum</span>
        <strong data-role="game-state">-</strong>
      </div>
      <div class="ui-panel__row">
        <span class="ui-panel__label">Mod</span>
        <strong>Oyuncu vs AI</strong>
      </div>


      <button type="button" data-role="new-game">Yeni Oyun</button>
      <div class="ui-panel__history">
        <span class="ui-panel__label">Hamleler</span>
        <ol data-role="move-history"></ol>
      </div>
    `;

    this.currentTurnElement = this.container.querySelector(
      '[data-role="current-turn"]',
    );
    this.gameStateElement = this.container.querySelector(
      '[data-role="game-state"]',
    );
    this.newGameButton = this.container.querySelector('[data-role="new-game"]');
    this.moveHistoryElement = this.container.querySelector(
      '[data-role="move-history"]',
    );
  }

  update(game) {
    this.currentTurnElement.textContent =
      game.currentTurn === 'white' ? 'Beyaz' : 'Siyah';
    this.gameStateElement.textContent = this.getStateText(game.gameState);
    this.moveHistoryElement.innerHTML = '';


    for (const move of game.getMoveHistory()) {
      const item = document.createElement('li');
      item.textContent = move.toString();
      this.moveHistoryElement.appendChild(item);
    }
  }

  bindEvents(game, pieceRenderer, chessBoard3D) {
    this.newGameButton.addEventListener('click', () => {
      game.startNewGame();
      pieceRenderer.renderPieces(game.board);
      chessBoard3D.clearHighlights();
      this.update(game);
    });

    // Game mode selection removed (always PLAYER_VS_AI)
  
  }

  getStateText(state) {
    const stateTexts = {
      [GAME_STATES.PLAYING]: 'Oynaniyor',
      [GAME_STATES.CHECK]: 'Sah',
      [GAME_STATES.CHECKMATE]: 'Mat',
      [GAME_STATES.STALEMATE]: 'Pat',
    };

    return stateTexts[state] ?? 'Bilinmiyor';
  }
}
