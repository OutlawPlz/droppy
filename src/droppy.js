'use strict';

/**
 * @typedef {Object} DroppyOptions
 * @prop {string} animationIn CSS class name
 * @prop {string} animationOut CSS class name
 * @prop {string} display CSS display property values
 * @prop {boolean} clickAwayToClose
 */

/** @type {DroppyOptions} */
const defaultOptions = {
    animationIn: '',
    animationOut: '',
    display: 'block',
    clickAwayToClose: true,
}

/** @type {Droppy[]} */
const clickAwayToClose = [];

document.body.addEventListener('click', (event) => {
    for (const droppy of clickAwayToClose) {
        if (droppy.trigger !== event.target
            && droppy.drop.checkVisibility()
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
     * @param {DroppyOptions} options
     */
    constructor(trigger, drop, options) {
        this.trigger = trigger;

        this.trigger.addEventListener('click', () => this.toggle());

        this.drop = drop;

        this.options = { ...defaultOptions, ...options };

        if (this.options.clickAwayToClose) clickAwayToClose.push(this);
    }

    show() {
        if (this.options.animationIn) {
            this.drop.addEventListener('animationend', () => {
                this.drop.classList.remove(this.options.animationIn);
            }, { once: true });

            this.drop.classList.add(this.options.animationIn);
        }

        this.drop.style.display = this.options.display;
    };

    hide() {
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

/**
 * @param {HTMLElement} root
 * @param {GeneratorOptions} options
 * @returns {Droppy[]}
 */
export const generator = (root, options) => {
    /** @type {Droppy[]} */
    const instances = [];

    const nodes = root.querySelectorAll(options.wrapper);

    nodes.forEach(node => {
        instances.push(new Droppy(
            node.querySelector(options.trigger),
            node.querySelector(options.drop),
            options
        ));
    });

    return instances;
}

document.querySelectorAll('[data-droppy]')
    .forEach(root => {
        generator(root, JSON.parse(root.dataset.droppy));
    });
