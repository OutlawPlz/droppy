/*! v2.1.0 */
'use strict';

export class DroppyContext {
    /** @type {Droppy[]} */
    context= [];

    constructor() {
        document.addEventListener('click', this.handleClose);
    }

    /**
     * @param {...Droppy} items
     */
    push(...items) {
        this.context.push(...items);
    }

    /**
     * @param {Event} event
     */
    handleClose = (event) => {
        for (const droppy of this.context) {
            if (droppy.drop.checkVisibility()
                && droppy.options.clickAwayToClose
                && ! droppy.trigger.contains(event.target)
                && ! droppy.drop.contains(event.target)) droppy.hide();
        }
    }

    closeAll() {
        console.log(this.context);
        for (const droppy of this.context) {
            if (droppy.drop.checkVisibility()) droppy.hide();
        }
    }
}

export const globalContext = new DroppyContext();

/**
 * @typedef {Object} DroppyOptions
 * @prop {string} animationIn CSS class name
 * @prop {string} animationOut CSS class name
 * @prop {string} display CSS display property values
 * @prop {boolean} clickAwayToClose
 * @prop {boolean} closeOthers
 * @prop {boolean} preventDefault
 */

/** @type {DroppyOptions} */
const droppyOptions = {
    animationIn: '',
    animationOut: '',
    display: 'block',
    clickAwayToClose: true,
    closeOthers: false,
    preventDefault: false,
}

export default class Droppy {
    /** @type {HTMLElement} */
    trigger;
    /** @type {HTMLElement} */
    drop;
    /** @type {DroppyOptions} */
    options;
    /** @type {DroppyContext} */
    #context = globalContext;

    /**
     * @param {HTMLElement} trigger
     * @param {HTMLElement} drop
     * @param {Partial<DroppyOptions>} options
     * @param {DroppyContext|undefined} context
     */
    constructor(trigger, drop, options = {}, context) {
        this.trigger = trigger;

        this.trigger.addEventListener('click', () => this.toggle());

        this.drop = drop;

        this.options = { ...droppyOptions, ...options };

        if (context) this.#context = context;

        this.#context.push(this);
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
    drop: 'ul',
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
