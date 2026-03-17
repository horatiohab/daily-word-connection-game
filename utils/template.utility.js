
// A utility to safely apply data bindings to a template
// By only updating the bindings using .textContent, we avoid the risk of XSS attacks that can occur when using innerHTML
// This way we can write dynamic templates/components with normal html structure
const bindingConfig = {
    props: {
        bindText: 'data-bind',
        conditional: 'data-if',
        cssClass: 'data-class',
        forLoop: 'data-for',
        onSubmit: 'data-on-submit',
        onClick: 'data-on-click',
        onInput: 'data-on-input',
        onChange: 'data-on-change',
        onKeyup: 'data-on-keyup',
        onKeydown: 'data-on-keydown'
    }
};

const dataBindings = [
    ...Object.values(bindingConfig.props),
].map(attr => `[${attr}]`).join(', ');

const DATA_PROP_PREFIX = 'data-prop-';

export class TemplateUtil {
    apply(node, props, options = {}) {
        const context = options.context || null;

        const elements = Array.from(node.querySelectorAll(dataBindings));
        if (node.nodeType === Node.ELEMENT_NODE && node.matches(dataBindings)) {
            elements.unshift(node);
        }

        elements.forEach(el => {
            // handle forLoop first so nested bindings can process within clones
            if (el.hasAttribute(bindingConfig.props.forLoop)) {
                this.handleForLoop(el, props);
                return;
            }

            for (const [key, attrName] of Object.entries(bindingConfig.props)) {
                if (!el.hasAttribute(attrName)) continue;

                switch (key) {
                    case 'bindText':
                        this.handleTextBinding(el, props);
                        break;
                    case 'conditional':
                        this.handleConditionalRendering(el, props, el.getAttribute(attrName));
                        break;
                    case 'cssClass':
                        this.handleClassBinding(el, props, el.getAttribute(attrName));
                        break;
                    case 'onSubmit':
                    case 'onClick':
                    case 'onInput':
                    case 'onChange':
                    case 'onKeyup':
                    case 'onKeydown':
                        this.handleEventListener(el, props, context, el.getAttribute(attrName), attrName);
                        break;
                }
            }

            this.handleAttributeBindings(el, props);
        });
    }

    resolveValue(props, key) {
        if (key === 'this') return props;
        if (key === '.' || key === 'item') {
            return props.item ?? props['0'];
        }

        const path = key.split('.').filter(Boolean);
        let current = props;
        for (const part of path) {
            if (current == null) return undefined;
            current = current[part];
            if (typeof current === 'function') {
                current = current.bind(props);
            }
        }
        return current;
    }

    handleTextBinding(el, props) {
        const rawKey = el.getAttribute(bindingConfig.props.bindText);
        const resolved = this.resolveValue(props, rawKey);
        el.textContent = resolved ?? '';
    }

    handleAttributeBindings(el, props) {
        for (const attr of Array.from(el.attributes)) {
            if (!attr.name.startsWith(DATA_PROP_PREFIX)) continue;

            const targetAttr = attr.name.slice(DATA_PROP_PREFIX.length);
            const rawKey = attr.value;
            const resolved = this.resolveValue(props, rawKey);
            if (resolved === undefined || resolved === null) {
                el.removeAttribute(targetAttr);
            } else {
                el.setAttribute(targetAttr, String(resolved));
            }
        }
    }

    handleConditionalRendering(el, props, condition) {
        el.hidden = !this.resolveValue(props, condition);
    }

    handleClassBinding(el, props, className) {
        const classValue = this.resolveValue(props, className);
        const previousClass = el.dataset.previousClass;

        if (previousClass) {
            el.classList.remove(previousClass);
            delete el.dataset.previousClass;
        }

        if (classValue && typeof classValue === 'string') {
            el.classList.add(classValue);
            el.dataset.previousClass = classValue;
        }
    }

    handleForLoop(el, props) {
        const propName = el.getAttribute(bindingConfig.props.forLoop);
        const list = this.resolveValue(props, propName);
        if (!Array.isArray(list)) {
            return;
        }

        const itemKey = el.getAttribute('data-as') || 'item';

        // Container loop mode: if element has at least one element child, keep the wrapper and repeat child templates inside.
        const elementChildren = Array.from(el.children);
        const isContainerLoop = elementChildren.length > 0;
        if (isContainerLoop) {
            const templateChildren = elementChildren.map(child => child.cloneNode(true));
            el.innerHTML = '';
            el.removeAttribute(bindingConfig.props.forLoop);
            el.removeAttribute('data-as');

            list.forEach((item, index) => {
                const loopProps = {
                    ...props,
                    [itemKey]: item,
                    index,
                    item,
                };

                templateChildren.forEach(childTemplate => {
                    const child = childTemplate.cloneNode(true);
                    this.apply(child, loopProps);
                    el.appendChild(child);
                });
            });

            return;
        }

        // Default block loop mode: repeat element itself (legacy behavior)
        const parent = el.parentNode;

        list.forEach((item, index) => {
            const clone = el.cloneNode(true);
            clone.removeAttribute(bindingConfig.props.forLoop);
            clone.removeAttribute('data-as');

            const loopProps = {
                ...props,
                [itemKey]: item,
                index,
                item,
            };

            this.apply(clone, loopProps);
            parent.insertBefore(clone, el);
        });
        el.remove();
    }

    handleEventListener(el, props, context, handlerName, attrName) {
        let handler = null;
        if (context && typeof context[handlerName] === 'function') {
            handler = context[handlerName].bind(context);
        } else if (typeof props[handlerName] === 'function') {
            handler = props[handlerName].bind(context || null);
        }

        const eventName = attrName.replace('data-on-', '');
        if (!eventName || !handler) return;

        if (!el._templateEventListenerMap) {
            el._templateEventListenerMap = new Map();
        }

        const existingListener = el._templateEventListenerMap.get(eventName);
        if (existingListener === handler) {
            // Same handler already attached; skip.
            return;
        }

        if (existingListener) {
            el.removeEventListener(eventName, existingListener);
        }

        el.addEventListener(eventName, handler);
        el._templateEventListenerMap.set(eventName, handler);
    }
}
