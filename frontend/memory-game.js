import { LitElement, html, css } from "lit-element";
import "flippable-card";
const shuffle = require("shuffle-array");

class MemoryGame extends LitElement {
  static get styles() {
    return css`
      :host {
        --cards-horizontally: 8;
        --card-width: calc((100vw - 16px) / var(--cards-horizontally) - 4px);
      }
      [hidden] {
        visibility: hidden;
      }
      flippable-card {
        width: var(--card-width);
        height: calc(var(--card-width) * 1.4285714286);
      }
      .center {
        height: 100%;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        margin-left: auto;
        margin-right: auto;
        cursor: pointer;
      }
    `;
  }
  render() {
    return html`
      ${this.images.map(
        image => html`
          <flippable-card
            @click="${e => this.reveal(e.target)}"
            unrevealed
            front="${image}"
            back="https://upload.wikimedia.org/wikipedia/commons/8/87/Card_back_05.svg"
            .hidden="${false}"
          ></flippable-card>
        `
      )}
      <img
        src="images/alldone.png"
        class="center"
        @click="${e => this.restart()}"
        .hidden="${this.ongoing}"
      />
    `;
  }
  constructor() {
    super();

    const urls = [];
    for (var i = 1; i <= 10; i++) {
      urls.push(`images/${i}.png`);
    }

    this.images = [...urls, ...urls];

    shuffle(this.images);
    this.ongoing = true;
  }
  async reveal(card) {
    if (!this.ongoing) {
      return;
    }
    if (card.unrevealed) {
      if (!this.cardShown) {
        this.cardShown = card;
        card.flip();
      } else {
        const cardShown = this.cardShown;
        delete this.cardShown;
        await card.flip();
        await this.timeout(500);
        if (card.front == cardShown.front) {
          // Match
          card.hidden = true;
          cardShown.hidden = true;
          this.checkIfDone();
        } else {
          card.flip();
          cardShown.flip();
        }
      }
    }
  }
  timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  static get properties() {
    return {
      ongoing: {
        type: Boolean
      },
      images: {
        type: Array
      }
    };
  }
  checkIfDone() {
    if (!this.shadowRoot.querySelector("flippable-card[unrevealed]")) {
      // All revealed
      this.ongoing = false;
      window.document.documentElement.scrollTop=0;
    }
  }
  restart() {
    window.location.reload();
  }
}

customElements.define("memory-game", MemoryGame);
