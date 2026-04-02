import { Elemental } from '/elemental/elemental.min.js';

class ResultModalComponent extends Elemental {
    static template = /*html*/`
        <div class="result-modal" data-class="{ 'result-modal--visible': isVisible }" role="dialog" aria-modal="true" aria-live="polite" aria-label="Game result">
            <div class="result-modal__backdrop" data-click="close()"></div>
            <div class="result-modal__content">
                <h2 class="result-modal__title"><bind>message</bind></h2>
                <button class="result-modal__button" type="button" data-click="close()">Close</button>
            </div>
        </div>
    `;

    static defaultProps() {
        return {
            isVisible: false,
            message: '',
        };
    }

    showResult(message) {
        this.setState({
            isVisible: true,
            message: String(message || ''),
        });
    }

    close() {
        this.setState({
            isVisible: false,
        });
    }

    static styles = /*css*/`
        :host(result-modal) {
            display: block;
        }

        .result-modal {
            position: fixed;
            inset: 0;
            pointer-events: none;
            opacity: 0;
            transition: opacity 120ms ease;
            z-index: 20;
        }

        .result-modal--visible {
            pointer-events: auto;
            opacity: 1;
        }

        .result-modal__backdrop {
            position: absolute;
            inset: 0;
            background-color: color-mix(in srgb, var(--bg-primary) 35%, black);
        }

        .result-modal__content {
            position: relative;
            margin: 20vh auto 0;
            width: min(92vw, 360px);
            background-color: var(--bg-surface);
            color: var(--text-primary);
            border-radius: 12px;
            padding: 18px 14px;
            box-shadow: var(--shadow-soft);
            text-align: center;
        }

        .result-modal__title {
            margin: 0;
            font-size: 1.5rem;
            text-transform: capitalize;
        }

        .result-modal__button {
            margin-top: 14px;
            border: none;
            border-radius: 8px;
            padding: 8px 12px;
            background-color: var(--accent-primary);
            color: var(--bg-surface);
            font-size: 0.95rem;
            font-weight: 700;
        }
    `;
}

customElements.define('result-modal', ResultModalComponent);
