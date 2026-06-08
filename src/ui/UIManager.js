import { GAME_STATES } from '../utils/constants.js';


export default class UIManager {
  constructor() {
    this.brand = document.createElement('div');
    this.brand.className = 'game-brand';
    this.brand.innerHTML = `
      <strong>3D Chess AI</strong>
    `;
    document.body.appendChild(this.brand);

    this.container = document.createElement('div');
    this.container.className = 'ui-panel';
    document.body.appendChild(this.container);

    this.createUI();
  }

  createUI() {
    this.container.innerHTML = `
      <div class="ui-panel__row">
        <span class="ui-panel__label ui-panel__label--turn">SIRA</span>
        <strong class="ui-panel__value" data-role="current-turn">-</strong>
      </div>
      <div class="ui-panel__row">
        <span class="ui-panel__label ui-panel__label--state">DURUM</span>
        <strong class="ui-panel__value" data-role="game-state">-</strong>
      </div>
      <div class="ui-panel__row">
        <span class="ui-panel__label ui-panel__label--mode">MOD</span>
        <strong class="ui-panel__value">Oyuncu vs AI</strong>
      </div>


      <button class="ui-panel__button" type="button" data-role="new-game">Yeni Oyun</button>
      <div class="ui-panel__history">
        <span class="ui-panel__label ui-panel__history-title">HAMLELER</span>
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
    const isWhiteTurn = game.currentTurn === 'white';

    this.currentTurnElement.textContent =
      isWhiteTurn ? 'Beyaz' : 'Siyah';
    this.currentTurnElement.className = `ui-panel__value ${
      isWhiteTurn ? 'ui-panel__value--white' : 'ui-panel__value--black'
    }`;
    this.gameStateElement.textContent = this.getStateText(game.gameState);
    this.gameStateElement.className = 'ui-panel__value ui-panel__value--state';
    this.moveHistoryElement.innerHTML = '';


    game.getMoveHistory().forEach((move, index) => {
      const item = document.createElement('li');
      item.className =
        index % 2 === 0 ? 'move-history__item--white' : 'move-history__item--black';
      item.textContent = move.toString();
      this.moveHistoryElement.appendChild(item);
    });
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
      [GAME_STATES.PLAYING]: 'Oynanıyor',
      [GAME_STATES.CHECK]: 'Sah',
      [GAME_STATES.CHECKMATE]: 'Mat',
      [GAME_STATES.STALEMATE]: 'Pat',
    };

    return stateTexts[state] ?? 'Bilinmiyor';
  }
}
