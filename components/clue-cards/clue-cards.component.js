import { Elemental } from '/elemental/elemental.min.js';
import { roundService } from '/services/round.service.js';


class ClueCardsComponent extends Elemental {

    static template = /*html*/`
        <div class="clue-cards__card clue-cards__card--first">
            <span><bind>first</bind></span>
        </div>

        <div class="clue-cards__card clue-cards__card--second" data-class="{ 'clue-cards__card--locked': unlockClue1 }">
            <span><bind>second</bind></span>
        </div>

        <div class="clue-cards__card clue-cards__card--third" data-class="{ 'clue-cards__card--locked': unlockClue2 }">
            <span><bind>third</bind></span>
        </div>

        <div class="clue-cards__card clue-cards__card--fourth" data-class="{ 'clue-cards__card--locked': unlockClue3 }">
            <span><bind>fourth</bind></span>
        </div>
    `;


    static defaultProps() {
        return {
            first: '',
            second: '',
            third: '',
            fourth: '',
            unlockClue1: true,
            unlockClue2: true,
            unlockClue3: true,
        };
    }

    getClueCardState() {
        const { clueCards } = roundService.getState();

        return {
            first: clueCards.first || '',
            second: clueCards.second || '',
            third: clueCards.third || '',
            fourth: clueCards.fourth || '',
            unlockClue1: roundService.guesses < 1,
            unlockClue2: roundService.guesses < 2,
            unlockClue3: roundService.guesses < 3,
        };
    }

    loadRoundClues() {
        roundService.initialiseRound();

        this.setState(this.getClueCardState());
    }

    connectedCallback() {
        super.connectedCallback();
        this.loadRoundClues();
    }

    update() {
        this.setState(this.getClueCardState());
    }

    
    static styles = /*css*/`
        :host(clue-cards) {
            display: block;
            width: 100%;
        }

        .clue-cards__card {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 10px 0;
            height: 60px;
            box-shadow: var(--shadow-soft);
            border-radius: 12px;
            font-size: 20px;
            font-weight: 800;
            letter-spacing: 0.02em;
            text-transform: capitalize;
            color: black;
        }

        .clue-cards__card--first {
            background: var(--clue-first-bg);
        }

        .clue-cards__card--second {
            background: var(--clue-second-bg);
        }

        .clue-cards__card--third {
            background: var(--clue-third-bg);
        }

        .clue-cards__card--fourth {
            background: var(--clue-fourth-bg);
        }

        .clue-cards__card--locked {
            opacity: 0.3;
            filter: saturate(0.7);
            box-shadow: none;
        }
    `;
}

customElements.define('clue-cards', ClueCardsComponent);