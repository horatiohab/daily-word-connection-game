import { BaseComponent } from '/components/base.component.js';

const template = document.createElement('template');
template.innerHTML = /*html*/`
    <div class="keyboard__container">
        <div data-for="rowOne" data-as="key">
            <button data-bind="key" data-prop-data-key="key"></button>
        </div>
        <div data-for="rowTwo" data-as="key">
            <button data-bind="key" data-prop-data-key="key"></button>
        </div>
        <div data-for="rowThree" data-as="key">
            <button data-bind="key" data-prop-data-key="key"></button>
        </div>       
    </div>
`;

const styles = /*css*/`
    :host(keyboard-component) {
        position: fixed;
        bottom: 0;
        width: 100%;
        background-color: #7272724f;

    }

    .keyboard__container {
        background-color: #7272724f;
        div {
            display: flex;
            justify-content: center;
            width: 100%;
        }

        button {
            cursor: pointer;
            margin: 2px;
            height: 50px;
            width: 20%;
            padding: 0;

            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            text-transform: uppercase;

            background-color: #727272;
            color: #dae7f4;
            border: none;
            border-radius: 5px;
            font-weight: 600;

            &:focus {
                background-color: #727272da;
            }

            svg {
                display: flex;
                height: 100%;
                width: 100%;
                max-height: 30px;
                margin: auto;
            }
        }

        [data-key=" "] {
            flex: 0.5;
            visibility: hidden;
            margin: 1px;
        }

        [data-key="enter"], [data-key="delete"] {
            flex: 1.5;
            flex-basis: calc(0% + 2px);
        }
    }
`;

class KeyboardComponent extends BaseComponent {
    constructor() {
        super({template, styles});

        this.props = {
            rowOne: ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
            rowTwo: [" ", "A", "S", "D", "F", "G", "H", "J", "K", "L", " "],
            rowThree: ["enter", "Z", "X", "C", "V", "B", "N", "M", "delete"],
        }
    }

    connectedCallback() {
		this.render();
	}
}

customElements.define('keyboard-component', KeyboardComponent);