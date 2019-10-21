import { LitElement, html, css } from "lit-element";
import "a-flippable-card";
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
      a-flippable-card {
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
          <a-flippable-card
            @click="${e => this.reveal(e.target)}"
            unrevealed
            front="${image}"
            back="images/back.png"
            .hidden="${false}"
          ></a-flippable-card>
        `
      )}
      <img
        src="images/alldone.png"
        class="center"
        @click="${e => this.restart()}"
        .hidden="${this.ongoing}"
      />
      <audio id="alldone">
        <source src="alldone.mp3" type="audio/mpeg" />
      </audio>
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
    this.findSize();
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
  findSize() {
    const value = window.innerWidth;
    if (value == 736 || value == 667) {
      // Iphone
      this.style.setProperty("--cards-horizontally", 11);
    } else if (value == 812 || value == 635) {
      // Iphone X
      this.style.setProperty("--cards-horizontally", 13);
    } else if (value == 414 || value == 375) {
      // Iphone hor
      this.style.setProperty("--cards-horizontally", 6.5);
    } else if (value == 375) {
      // Iphone X hor
      this.style.setProperty("--cards-horizontally", 5.1);
    } else if (value <= 568) {
      this.style.setProperty("--cards-horizontally", 8);
    } else if (value == 768 || value == 665) {
      // ipad hor
      this.style.setProperty("--cards-horizontally", 6.5);
    } else if (value == 1024 || value == 921) {
      // ipad
      this.style.setProperty("--cards-horizontally", 9);
    } else {
    }
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
    if (!this.shadowRoot.querySelector("a-flippable-card[unrevealed]")) {
      // All revealed
      this.ongoing = false;
      window.document.documentElement.scrollTop = 0;
      this.shadowRoot.querySelector("#alldone").play();
    }
  }
  restart() {
    window.location.reload();
  }
}

customElements.define("memory-game", MemoryGame);
