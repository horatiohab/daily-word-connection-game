import { Elemental } from '/elemental/elemental.min.js';
import { roundService } from '/services/round.service.js';

const KEY_ENTER = 'enter';
const KEY_DELETE = 'delete';
const MAX_GUESSES = 4;

class GuessInputComponent extends Elemental {
    static template = /*html*/`
        <span class="guess-input__guess" data-class="{ 'guess-input__guess--correct': feedbackClass === 'guess-input__feedback--correct', 'guess-input__guess--incorrect': feedbackClass === 'guess-input__feedback--incorrect' }"><bind>guess</bind></span>
        <p class="guess-input__feedback" data-class="{ 'guess-input__feedback--correct': feedbackClass === 'guess-input__feedback--correct', 'guess-input__feedback--incorrect': feedbackClass === 'guess-input__feedback--incorrect' }" aria-live="polite"><bind>feedbackMessage</bind></p>
        <if condition="!roundFinished">
            <form class="guess-input__form" data-submit="handleGuessClick(event)">
                <div class="guess-input__field" role="textbox" aria-readonly="true">
                    <span><bind>currentInput</bind></span>
                    <span class="guess-input__caret"></span>
                </div>
            </form>
        </if>

        <if condition="roundFinished">
            <p class="guess-input__final-answer">The answer was: <strong><bind>answer</bind></strong></p>
        </if>
    `;

    static defaultProps() {
        return {
            guess: '',
            currentInput: '',
            feedbackMessage: '',
            feedbackClass: '',
            roundFinished: false,
            answer: roundService.getState()?.answer.toUpperCase() || '',
        };
    }

    showResultModal(message) {
        const resultModal = document.querySelector('result-modal');
        if (resultModal?.showResult) {
            resultModal.showResult(message);
        }
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

        const currentInput = this.props?.currentInput || '';

        if (normalisedKey === KEY_DELETE) {
            this.setState((prev) => ({ ...prev, currentInput: currentInput.slice(0, -1) }));
            return;
        }

        if (/^[a-z]$/i.test(key)) {
            this.setState((prev) => ({ ...prev, currentInput: `${currentInput}${key.toUpperCase()}` }));
        }
    }

    submitGuess() {
        if (this.isRoundFinished()) return;

        const guess = String(this.props?.currentInput || '').trim().toUpperCase();
        if (!guess) return;

        const answer = this.getCurrentAnswer();
        const isCorrectGuess = answer && guess === answer;

        this.setState((prev) => ({
            ...prev,
            guess,
            currentInput: '',
            feedbackMessage: isCorrectGuess ? 'Correct! Nice work.' : 'is not the right answer. Try again!',
            feedbackClass: isCorrectGuess ? 'guess-input__feedback--correct' : 'guess-input__feedback--incorrect',
        }));

        if (isCorrectGuess) {
            this.setState((prev) => ({ ...prev, roundFinished: true }));
            this.showResultModal('you won');
            return;
        }

        const nextGuessCount = roundService.guesses + 1;
        roundService.getNextClue();

        if (nextGuessCount >= MAX_GUESSES) {
            this.setState((prev) => ({
                ...prev,
                feedbackMessage: 'No more guesses left.',
                feedbackClass: 'guess-input__feedback--incorrect',
                roundFinished: true,
            }));
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
            min-height: 29px;
            font-size: 24px;
            font-weight: 1000;
            letter-spacing: 0.05em;
            text-transform: uppercase;
        }

        .guess-input__guess--correct {
            color: var(--clue-green-bg);
        }

        .guess-input__guess--incorrect {
            color: var(--clue-red-bg);
        }

        .guess-input__form {
            display: flex;
            justify-content: center;
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
            border-bottom: 4px solid var(--border-primary);
            padding: 0 14px;
            font-size: 20px;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background-color: var(--bg-surface);
            text-transform: uppercase;
            color: var(--text-primary);
        }

        .guess-input__caret {
            width: 4px;
            height: 1.2em;
            margin-left: 2px;
            background: var(--text-primary);
            animation: guess-input-caret-blink 1s steps(1, end) infinite;
        }

        @keyframes guess-input-caret-blink {
            50% {
                opacity: 0;
            }
        }
    `;
}

customElements.define('guess-input', GuessInputComponent);