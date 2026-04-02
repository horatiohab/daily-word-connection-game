import { Elemental } from '/elemental/elemental.min.js';
import { roundService } from '/services/round.service.js';


class ClueCardsComponent extends Elemental {

    static template = /*html*/`
        <div class="clue-cards__card clue-cards__card--first">
            <span><bind>first</bind></span>
        </div>

        <div class="clue-cards__card-container clue-cards__card-container--second">
            <div class="clue-cards__card-flipper" data-class="{ 'clue-cards__card-flipper--revealed': revealClue1, 'clue-cards__card-flipper--reveal': revealClue1 && !revealClue2 }">
                <div class="clue-cards__card-face clue-cards__card-face--front">
                    <span><bind>second</bind></span>
                </div>
                <div class="clue-cards__card-face clue-cards__card-face--back">
                    <span></span>
                </div>
            </div>
        </div>

        <div class="clue-cards__card-container clue-cards__card-container--third">
            <div class="clue-cards__card-flipper" data-class="{ 'clue-cards__card-flipper--revealed': revealClue2, 'clue-cards__card-flipper--reveal': revealClue2 && !revealClue3 }">
                <div class="clue-cards__card-face clue-cards__card-face--front">
                    <span><bind>third</bind></span>
                </div>
                <div class="clue-cards__card-face clue-cards__card-face--back">
                    <span></span>
                </div>
            </div>
        </div>

        <div class="clue-cards__card-container clue-cards__card-container--fourth">
            <div class="clue-cards__card-flipper" data-class="{ 'clue-cards__card-flipper--revealed': revealClue3, 'clue-cards__card-flipper--reveal': revealClue3 }">
                <div class="clue-cards__card-face clue-cards__card-face--front">
                    <span><bind>fourth</bind></span>
                </div>
                <div class="clue-cards__card-face clue-cards__card-face--back">
                    <span></span>
                </div>
            </div>
        </div>
    `;


    static defaultProps() {
        return {
            first: '',
            second: '',
            third: '',
            fourth: '',
            revealClue1: false,
            revealClue2: false,
            revealClue3: false,
        };
    }

    getClueCardState() {
        const { clueCards } = roundService.getState();

        return {
            first: clueCards.first || '',
            second: clueCards.second || '',
            third: clueCards.third || '',
            fourth: clueCards.fourth || '',
            revealClue1: roundService.guesses >= 1,
            revealClue2: roundService.guesses >= 2,
            revealClue3: roundService.guesses >= 3,
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

        .clue-cards__card,
        .clue-cards__card-face {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 60px;
            box-shadow: var(--shadow-soft);
            border-radius: 12px;
            font-size: 24px;
            font-weight: 1000;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            color: black;
        }

        .clue-cards__card--first {
            width: 100%;
            margin: 10px 0;
            background: var(--clue-first-bg);
        }

        .clue-cards__card-container {
            height: 60px;
            width: 100%;
            perspective: 500px;
            margin: 10px 0;
        }

        .clue-cards__card-flipper {
            width: 100%;
            height: 100%;
            position: relative;
            transition: transform 0.5s ease;
            transform-style: preserve-3d;
            transform: rotateX(0deg);
        }

        .clue-cards__card-face {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
        }

        .clue-cards__card-face--front {
            transform: rotateX(180deg);
        }

        .clue-cards__card-face--back {
            opacity: 0.3;
            filter: saturate(0.7);
            box-shadow: none;
        }

        .clue-cards__card-flipper--revealed {
            transform: rotateX(180deg);
        }

        .clue-cards__card-flipper--reveal {
            animation: clue-cards-flip-reveal 0.5s ease forwards;
        }

        @keyframes clue-cards-flip-reveal {
            from {
                transform: rotateX(0deg);
            }
            to {
                transform: rotateX(180deg);
            }
        }

        .clue-cards__card-container--second .clue-cards__card-face {
            background: var(--clue-second-bg);
        }

        .clue-cards__card-container--third .clue-cards__card-face {
            background: var(--clue-third-bg);
        }

        .clue-cards__card-container--fourth .clue-cards__card-face {
            background: var(--clue-fourth-bg);
        }

    `;
}

customElements.define('clue-cards', ClueCardsComponent);