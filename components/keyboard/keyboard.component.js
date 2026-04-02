import { Elemental } from '/elemental/elemental.min.js';

const HIDDEN_KEY = ' ';

const KEYBOARD_LAYOUT = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    [HIDDEN_KEY, 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', HIDDEN_KEY],
    ['enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'delete'],
];

class KeyboardComponent extends Elemental {
    static template = /*html*/`
        <div class="keyboard">
            <for each="keyboard" as="row">
                <div class="keyboard__row">
                    <for each="row" as="key">
                        <div class="keyboard__key" data-class="{ 'keyboard__key--hidden': key === ' ', 'keyboard__key--wide': key === 'enter' || key === 'delete' }">
                            <div class="keyboard__key-preview keyboard__key-preview--hidden"><bind>key</bind></div>
                            <button class="keyboard__key-button" data-click="handleKeyClick(event)"><bind>key</bind></button>
                        </div>
                    </for>
                </div>
            </for>
        </div>
    `;


    static defaultProps() {
        return {
            keyboard: KEYBOARD_LAYOUT,
        };
    }

    getKeyFromButton(button) {
        const key = button?.textContent?.trim();

        if (key === undefined || key === '' || key === HIDDEN_KEY) {
            return null;
        }

        if (key.toLowerCase() === 'enter' || key.toLowerCase() === 'delete') {
            return key.toLowerCase();
        }

        return key.toUpperCase();
    }

    emitKey(button, source = 'click') {
        const key = this.getKeyFromButton(button);
        if (!key) return;

        this.dispatchEvent(new CustomEvent('keyboard-drag-key', {
            detail: { key, source },
            bubbles: true,
            composed: true,
        }));
    }

    handleKeyClick(event) {
        this.emitKey(event?.currentTarget, 'click');
    }


    static styles = /*css*/`
        :host(keyboard-component) {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
        }

        .keyboard {
            margin: 0 auto;
            padding: 10px 8px 16px;
            background-image: linear-gradient(180deg, transparent 0%, color-mix(in srgb, var(--bg-primary) 84%, transparent) 28%, var(--bg-primary) 100%);
            max-width: 800px;
        }

        .keyboard__row {
            display: flex;
            justify-content: center;
            width: 100%;
        }

        .keyboard__key {
            position: relative;
            color: var(--key-text);
            margin: 2px;
            height: 50px;
            flex: 1;
        }

        .keyboard__key--hidden {
            flex: 0.5;
            visibility: hidden;
            margin: 1px;
        }

        .keyboard__key--wide {
            flex: 1.5;
            flex-basis: calc(0% + 2px);

            button {
                font-size: 12px;
            }
        }

        .keyboard__key-preview {
            position: absolute;
            left: 0;
            right: 0;
            width: 100%;
            height: 100%;
            bottom: 60px;
            background-color: var(--key-preview-bg);
            color: var(--key-preview-text);
            border: 1px solid var(--border-primary);
            border-radius: 8px;
            font-size: 30px;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1;
        }

        .keyboard__key-button {
            width: 100%;
            height: 100%;
            /* border: 1px solid var(--key-border); */
            border: none;
            border-radius: 8px;
            background-color: var(--key-bg);
            color: var(--key-text);
            font-size: 16px;
            font-weight: 700;
            text-transform: uppercase;
        }

        .keyboard__key-button:active {
            background-color: var(--key-bg-active);
        }

        .keyboard__key-preview--hidden {
            display: none;
        }
    `;

}

customElements.define('keyboard-component', KeyboardComponent);