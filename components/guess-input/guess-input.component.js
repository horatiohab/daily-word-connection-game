import { Elemental } from '/elemental/elemental.min.js';
import { roundService } from '/services/round.service.js';

const KEY_ENTER = 'enter';
const KEY_DELETE = 'delete';
const MAX_GUESSES = 4;

class GuessInputComponent extends Elemental {
    static template = /*html*/`
        <span class="guess-input__guess" data-class="{ 'guess-input__guess--correct': feedbackClass === 'guess-input__feedback--correct', 'guess-input__guess--incorrect': feedbackClass === 'guess-input__feedback--incorrect' }"><bind>guess</bind></span>
        <p class="guess-input__feedback" data-class="{ 'guess-input__feedback--correct': feedbackClass === 'guess-input__feedback--correct', 'guess-input__feedback--incorrect': feedbackClass === 'guess-input__feedback--incorrect' }" aria-live="polite"><bind>feedbackMessage</bind></p>
        <form class="guess-input__form" data-submit="handleGuessClick(event)">
            <input class="guess-input__field" type="text" pattern="[A-Za-z]+" data-input="onlyAllowLetterInput(event)" readonly/>
        </form>
    `;

    static defaultProps() {
        return {
            guess: '',
            feedbackMessage: '',
            feedbackClass: '',
            roundFinished: false,
        };
    }

    showResultModal(message) {
        const resultModal = document.querySelector('result-modal');
        if (resultModal?.showResult) {
            resultModal.showResult(message);
        }
    }

    getInputElement() {
        return this.shadowRoot?.querySelector('.guess-input__field');
    }

    isRoundFinished() {
        return Boolean(this.props?.roundFinished);
    }

    applyKeyboardKey(key) {
        if (!key || this.isRoundFinished()) return;

        const normalisedKey = String(key).toLowerCase();

        if (normalisedKey === KEY_ENTER) {
            this.submitGuess();
            return;
        }

        const input = this.getInputElement();
        if (!input) return;

        if (normalisedKey === KEY_DELETE) {
            input.value = input.value.slice(0, -1);
            return;
        }

        if (/^[a-z]$/i.test(key)) {
            input.value += key.toUpperCase();
        }
    }

    submitGuess() {
        if (this.isRoundFinished()) return;

        const input = this.getInputElement();
        if (!input) return;

        const guess = input.value.trim().toUpperCase();
        if (!guess) return;

        const answer = this.getCurrentAnswer();
        const isCorrectGuess = answer && guess === answer;

        input.value = '';
        this.setState({
            guess,
            feedbackMessage: isCorrectGuess ? 'Correct! Nice work.' : 'is not the right answer. Try again!',
            feedbackClass: isCorrectGuess ? 'guess-input__feedback--correct' : 'guess-input__feedback--incorrect',
        });

        if (isCorrectGuess) {
            this.setState({ roundFinished: true });
            this.showResultModal('you won');
            return;
        }

        const nextGuessCount = roundService.guesses + 1;
        roundService.getNextClue();

        if (nextGuessCount >= MAX_GUESSES) {
            this.setState({
                feedbackMessage: 'No more guesses left.',
                feedbackClass: 'guess-input__feedback--incorrect',
                roundFinished: true,
            });
            this.showResultModal('you lose');
            return;
        }

        this.updateClueCards();
    }

    getCurrentAnswer() {
        const currentAnswer = roundService.getState()?.answer;
        if (currentAnswer) return String(currentAnswer).trim().toUpperCase();

        roundService.initialiseRound();
        return String(roundService.getState()?.answer || '').trim().toUpperCase();
    }

    updateClueCards() {
        const clueCards = document.querySelector('clue-cards');
        if (clueCards?.update) {
            clueCards.update();
        }
    }

    onlyAllowLetterInput(event) {
        const input = event.target;
        input.value = input.value.replace(/[^A-Za-z]/g, '');
    }

    handleGuessClick(event) {
        event.preventDefault();
        this.submitGuess();
    }


    static styles = /*css*/`
        :host(guess-input) {
            display: flex;
            flex-direction: column;
            justify-content: center;
            width: 100%;
            padding: 8px 2px;
            text-align: center;
            gap: 10px;
        }

        .guess-input__guess {
            color: var(--text-muted);
            font-size: 1.4rem;
            min-height: 27px;
        }

        .guess-input__guess--correct {
            color: var(--clue-green-bg);
        }

        .guess-input__guess--incorrect {
            color: var(--clue-red-bg);
        }

        .guess-input__form {
            display: flex;
            gap: 8px;
        }

        .guess-input__feedback {
            margin: 0;
            min-height: 24px;
            font-size: 1rem;
            font-weight: 700;
            color: var(--text-muted);
        }

        .guess-input__feedback--correct {
            color: var(--accent-primary-strong);
        }

        .guess-input__feedback--incorrect {
            color: var(--clue-fourth-bg);
        }

        .guess-input__field {
            width: 100%;
            height: 50px;
            border: 1px;
            border: solid var(--border-primary);
            border-top: none;
            border-right: none;
            border-left: none;
            padding: 0 14px;
            font-size: 20px;
            font-weight: 600;
            text-align: center;
            background-color: var(--bg-surface);
            text-transform: uppercase;
            color: var(--text-primary);
            outline: none;
            caret-color: red;
        }

        .guess-input__field::after {
            content: "";
            width: 5px;
            height: 20px;
            background: #ec7fff;
            display: inline-block;
        }

        .guess-input__field::placeholder {
            color: var(--text-muted);
            text-transform: none;
        }
    `;
}

customElements.define('guess-input', GuessInputComponent);