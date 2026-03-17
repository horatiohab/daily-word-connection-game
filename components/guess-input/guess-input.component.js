import { BaseComponent } from '/components/base.component.js';
import { roundService } from '/services/round.service.js';

const template = document.createElement('template');
template.innerHTML = /*html*/`
    <span data-bind="guess"></span>
    <form class="letter-input" data-on-submit="handleGuessClick">
        <input type="text" pattern="[A-Za-z]+" data-on-input="onlyAllowLetterInput" placeholder="Make your guess..." readonly/>
        <button type="submit">Guess</button>
    </form>
`;

const styles = /*css*/`
    :host(guess-input) {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100%;
        padding: 10px;
        text-align: center;
        font-size: 2em;
        font-weight: 600;
    }

    .letter-input {
        display: flex;
    }

    input {
        margin: 10px;
        width: 100%;
        height: 50px;
        border: none;
        border-bottom: 4px solid #8baaaa;
        font-size: 20px;
        font-weight: 600;
        text-align: center;
        background-color: transparent;
        text-transform: uppercase;
        color: #8baaaa;
        outline: none;
    }
`;

class GuessInputComponent extends BaseComponent {
    constructor() {
        super({template, styles});

        this.props.guess = 'Your Guess';
    }

    onlyAllowLetterInput(event) {
        const input = event.target;
        input.value = input.value.replace(/[^A-Za-z]/g, '');
    }

    handleGuessClick(event) {
        event.preventDefault();
        const input = this.shadowRoot.querySelector('input');
        const guess = input.value.trim().toUpperCase();
        if (guess) {
            input.value = '';
            this.props.guess = guess;
            roundService.getNextClue();

            const clueCards = document.querySelector('clue-cards');
            if (clueCards?.update) {
                clueCards.update();
            }

            this.render();
        }
    }
}

customElements.define('guess-input', GuessInputComponent);