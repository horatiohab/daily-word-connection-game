// Just an example component to demonstrate the bindings and how to use the BaseComponent class
import { BaseComponent } from '/components/base.component.js';

const template = document.createElement('template');
template.innerHTML = /*html*/`
    <div>
        <h1 data-bind="title"></h1>

        <h2 data-bind="subtitle"></h2>

        <div data-if="showContent" data-class="testMakePurple" class="other-class-name">
            <p data-bind="content"></p>
        </div>

        <ul>
            <li data-for="listItems">test list</li>
        </ul>

        <h3 data-bind="count"></h3>
        <button data-on-click="handleIncrement">Click!</button>
    </div>
`;

const styles = /*css*/`
    .purple {
        color: #9a4dff;
    }
`;

class UserCardComponent extends BaseComponent {
    constructor() {
        super({template, styles});
        this.props = {
            title: 'My Title',
            get subtitle() {
                return this.owner.isPurple();
            },
            showContent: true,
            content: 'This is the content to show when showContent is true.',
            get testMakePurple() {
                return this.owner.isPurple();
            },
            listItems: ['Item 1', 'Item 2', 'Item 3'],
            count: 0,
            owner: this,
        };

        this.isTrueState = true;
        this.handleIncrement = this.handleIncrement.bind(this);
    }

    isPurple() {
        return this.isTrueState ? 'purple' : 'blue';
    }

    handleIncrement() {
        this.props.count += 1;
        this.isTrueState = !this.isTrueState;
        this.render();
    }
}

customElements.define('user-card', UserCardComponent);