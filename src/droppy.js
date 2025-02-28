'use strict';

/**
 * @typedef {Object} DroppyOptions
 * @prop {string} animationIn CSS class name
 * @prop {string} animationOut CSS class name
 * @prop {string} display CSS display property values
 * @prop {boolean} clickAwayToClose
 * @prop {boolean} preventDefault
 */

/** @type {DroppyOptions} */
const droppyOptions = {
    animationIn: '',
    animationOut: '',
    display: 'block',
    clickAwayToClose: true,
    preventDefault: false,
}

/** @type {Droppy[]} */
const clickAwayToClose = [];

document.body.addEventListener('click', (event) => {
    for (const droppy of clickAwayToClose) {
        if (droppy.drop.checkVisibility()
            && ! droppy.trigger.contains(event.target)
            && ! droppy.drop.contains(event.target)) droppy.hide();
    }
});

export default class Droppy {
    /** @type {HTMLElement} */
    trigger;
    /** @type {HTMLElement} */
    drop;
    /** @type {DroppyOptions} */
    options;

    /**
     * @param {HTMLElement} trigger
     * @param {HTMLElement} drop
     * @param {Partial<DroppyOptions>} options
     */
    constructor(trigger, drop, options) {
        this.trigger = trigger;

        this.trigger.addEventListener('click', () => this.toggle());

        this.drop = drop;

        this.options = { ...droppyOptions, ...options };

        if (this.options.clickAwayToClose) clickAwayToClose.push(this);
    }

    show() {
        if (this.options.preventDefault) event.preventDefault();

        if (this.options.animationIn) {
            this.drop.addEventListener('animationend', () => {
                this.drop.classList.remove(this.options.animationIn);
            }, { once: true });

            this.drop.classList.add(this.options.animationIn);
        }

        this.drop.style.display = this.options.display;
    };

    hide() {
        if (this.options.preventDefault) event.preventDefault();

        this.drop.addEventListener('animationend', () => {
            this.drop.style.display = 'none';

            if (this.options.animationOut) {
                this.drop.classList.remove(this.options.animationOut);
            }
        }, { once: true });

        this.options.animationOut
            ? this.drop.classList.add(this.options.animationOut)
            : this.drop.dispatchEvent(new Event('animationend'));
    };

    toggle() {
        this.drop.checkVisibility() ? this.hide() : this.show();
    }
}

/**
 * @typedef {DroppyOptions} GeneratorOptions
 * @extends DroppyOptions
 * @prop {string} wrapper CSS selector
 * @prop {string} trigger CSS selector
 * @prop {string} drop CSS selector
 */

/** @type {GeneratorOptions} */
const generatorOptions = {
    wrapper: 'li',
    trigger: 'a',
    drop: 'ul.menu',
    ...droppyOptions
}

/**
 * @param {HTMLElement} root
 * @param {Partial<GeneratorOptions>} options
 * @returns {Droppy[]}
 */
export function generator(root, options) {
    /** @type {Droppy[]} */
    const instances = [];

    options = { ...generatorOptions, ...options };

    const wrappers = root.querySelectorAll(options.wrapper);

    wrappers.forEach(wrapper => {
        const trigger = wrapper.querySelector(options.trigger);
        const drop = wrapper.querySelector(options.drop);

        if (! trigger || ! drop) return;

        instances.push(new Droppy(trigger, drop, options));
    });

    return instances;
}

document.querySelectorAll('[data-droppy]')
    .forEach(root => {
        generator(root, JSON.parse(root.dataset.droppy || "{}"));
    });
