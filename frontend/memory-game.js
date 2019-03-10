import { LitElement, html, css } from "lit-element";
import "image-card";
const shuffle = require('shuffle-array');

class MemoryGame extends LitElement {
  static get styles() {
    return css`
      [hidden] {
        visibility: hidden;
      }
    `;
  }
  render() {
    return html`
      ${this.images.map(
        image => html`
          <image-card
            @click="${e => this.reveal(e.target)}"
            unrevealed
            front="${image}"
            back="https://upload.wikimedia.org/wikipedia/commons/8/87/Card_back_05.svg"
          ></image-card>
      `)}
    `;
  }
  constructor() {
    super();

    const urls = [];
    for (var i=1; i <= 10; i++) {
      urls.push(`images/${i}.png`);
    }

    this.images = [...urls, ...urls];
    shuffle(this.images);
  }
  async reveal(card) {
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
}

customElements.define("memory-game", MemoryGame);
