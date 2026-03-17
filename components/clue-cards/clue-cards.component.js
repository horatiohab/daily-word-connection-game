import { BaseComponent } from '/components/base.component.js';
import { roundService } from '/services/round.service.js';

const template = document.createElement('template');
template.innerHTML = /*html*/`
    <div class="clue-cards__card clue-cards__card--cold">
        <span data-bind="first">word 1</span>
    </div>

    <div class="clue-cards__card clue-cards__card--warm" data-class="unlockClue1">
        <span data-bind="second">word 2</span>
    </div>

    <div class="clue-cards__card clue-cards__card--warmer clue-cards__card--locked" data-class="unlockClue2">
        <span data-bind="third">word 3</span>
    </div>

    <div class="clue-cards__card clue-cards__card--hot clue-cards__card--locked" data-class="unlockClue3">
        <span data-bind="fourth">word 4</span>
    </div>
`;

const styles = /*css*/`
    :host(clue-cards) {
        width: 100%;
    }

    .clue-cards__card {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 10px;
        height: 70px;
        background-image: linear-gradient(45deg, #e7f8f2 0%, #c0f2e0 100%);
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        border: 2px solid #b2e8d7;
        border-radius: 8px;
        color: #00000082;
        font-size: 16px;
        font-weight: 600;
    }

    .clue-cards__card--warm {
        background-image: linear-gradient(45deg, #e0f7fa 0%, #b2ebf2 100%);
        border-color: #80deea;
    }

    .clue-cards__card--warmer {
        background-image: linear-gradient(45deg, #fff4e7 0%, #ffe1c6 100%);
        border-color: #ffd1a9;
    }

    .clue-cards__card--hot {
        background-image: linear-gradient(45deg, #fcefee 0%, #f8d7e0 100%);
        border-color: #f5b2c2;
    }

    .clue-cards__card--locked {
        opacity: 0.3;
        box-shadow: none;
    }
`;

class ClueCardsComponent extends BaseComponent {
    constructor() {
        super({template, styles});

        this.props = {
            first: '',
            second: '',
            third: '',
            fourth: '',
            unlockClue1: 'clue-cards__card--locked',
            unlockClue2: 'clue-cards__card--locked',
            unlockClue3: 'clue-cards__card--locked',
        };
    }

    getClueCardsForRound() {
        roundService.initialiseRound();
        this.setProps({
            ...roundService.getState().clueCards,
            unlockClue: this.unlockClueStyle(true),
        });
    }

    connectedCallback() {
        this.getClueCardsForRound();
    }

    unlockClueStyle(state) {
        return state ? 'clue-cards__card--locked' : '';
    }

    update() {
        const unlockKey = `unlockClue${roundService.guesses}`;
        this.setProps({
            ...roundService.getState().clueCards,
            [unlockKey]: this.unlockClueStyle(false),
        });
    }
}

customElements.define('clue-cards', ClueCardsComponent);