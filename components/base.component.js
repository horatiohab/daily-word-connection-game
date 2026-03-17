import { TemplateUtil } from '/utils/template.utility.js';

export class BaseComponent extends HTMLElement {
	constructor({ template = null, styles = '', props = {} } = {}) {
		super();
		this.attachShadow({ mode: 'open' });

		this.templateUtil = new TemplateUtil();
		this.props = props;

		if (template) {
			this.shadowRoot.appendChild(template.content.cloneNode(true));
		}

		if (styles) {
			const sheet = new CSSStyleSheet();
			sheet.replaceSync(styles);
			this.shadowRoot.adoptedStyleSheets = [sheet];
		}
	}

	setProps(nextProps = {}) {
		this.props = { ...this.props, ...nextProps };
		this.render();
	}

	render() {
		if (!this.shadowRoot) return;
		this.templateUtil.apply(this.shadowRoot, this.props, { context: this });
	}

	connectedCallback() {
		this.render();
	}
}