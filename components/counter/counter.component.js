import { BaseComponent } from '/components/base.component.js';

const template = document.createElement('template');
template.innerHTML = /*html*/`
    <div>
        <h1 data-bind="count"></h1>
        <button data-on-click="handleIncrement">Click!</button>
    </div>
`;

const styles = /*css*/`
    h1 {
        font-size: 48px;
        color: #8baaaa;
    }
`;

class CounterComponent extends BaseComponent {
    constructor() {
        super({template, styles});

        this.props.count = 0;
    }

    handleIncrement() {
        this.props.count++;
        this.render();
    }
}

customElements.define('counter-component', CounterComponent);