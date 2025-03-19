/*! v2.2.1-beta */
'use strict';

export class DroppyContext {
    /** @type {Droppy[]} */
    instances= [];

    hideAll() {
        for (const droppy of this.instances) {
            if (droppy.drop.checkVisibility()) droppy.hide();
        }
    }

    showAll() {
        for (const droppy of this.instances) {
            if (! droppy.drop.checkVisibility()) droppy.show();
        }
    }
}

export const clickAwayContext = new DroppyContext();

document.addEventListener('click', (event) => {
    for (const instance of clickAwayContext.instances) {
        if (instance.drop.checkVisibility()
            && instance.options.clickAwayToClose
            && ! instance.trigger.contains(event.target)
            && ! instance.drop.contains(event.target)) instance.toggle();
    }
});

/**
 * @typedef {Object} DroppyOptions
 * @prop {string} animationIn CSS class name
 * @prop {string} animationOut CSS class name
 * @prop {string} display CSS display property values
 * @prop {string} triggerActiveClass
 * @prop {boolean} preventDefault
 * @prop {boolean} clickAwayToClose
 */

/** @type {DroppyOptions} */
const droppyOptions = {
    animationIn: '',
    animationOut: '',
    display: 'block',
    triggerActiveClass: 'active',
    preventDefault: false,
    clickAwayToClose: true,
}

export default class Droppy {
    /** @type {HTMLElement} */
    trigger;
    /** @type {HTMLElement} */
    drop;
    /** @type {DroppyOptions} */
    options;
    /** @type {DroppyContext} */
    context;

    /**
     * @param {HTMLElement} trigger
     * @param {HTMLElement} drop
     * @param {Partial<DroppyOptions>} options
     * @param {DroppyContext=} context
     */
    constructor(trigger, drop, options = {}, context = new DroppyContext()) {
        this.trigger = trigger;

        this.trigger.addEventListener('click', () => this.toggle());

        this.drop = drop;

        this.options = { ...droppyOptions, ...options };

        this.context = context;

        this.context.instances.push(this);

        if (this.options.clickAwayToClose) {
            clickAwayContext.instances.push(this);
        }
    }

    show() {
        if (this.options.preventDefault) event.preventDefault();

        if (this.options.animationIn) {
            this.drop.addEventListener('animationend', () => {
                this.drop.classList.remove(this.options.animationIn);
            }, { once: true });

            this.drop.classList.add(this.options.animationIn);
        }

        if (this.options.triggerActiveClass) {
            this.trigger.classList.add(this.options.triggerActiveClass);
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

        if (this.options.triggerActiveClass) {
            this.trigger.classList.remove(this.options.triggerActiveClass);
        }
    };

    toggle() {
        const beforeToggle = new CustomEvent('beforetoggle', {
            bubbles: true,
            cancelable: true,
            detail: { droppy: this },
        });

        this.drop.dispatchEvent(beforeToggle);

        if (beforeToggle.defaultPrevented) return;

        this.drop.checkVisibility() ? this.hide() : this.show();

        const toggle = new CustomEvent('toggle', {
            bubbles: true,
            cancelable: true,
            detail: { droppy: this },
        })

        this.drop.dispatchEvent(toggle);
    }
}

/**
 * @typedef {DroppyOptions} GeneratorOptions
 * @extends DroppyOptions
 * @prop {string} wrapper CSS selector
 * @prop {string} trigger CSS selector
 * @prop {string} drop CSS selector
 * @prop {boolean} clickAwayToClose
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
 * @param {DroppyContext} context
 * @returns {DroppyContext}
 */
export function menuGenerator(root, options, context = new DroppyContext()) {
    options = { ...generatorOptions, ...options };

    const wrappers = root.querySelectorAll(options.wrapper);

    for (const wrapper of wrappers) {
        const trigger = wrapper.querySelector(options.trigger);
        const drop = wrapper.querySelector(options.drop);

        if (! trigger || ! drop) continue;

        new Droppy(trigger, drop, options, context);
    }

    return context;
}

document
    .querySelectorAll('[data-menu]')
    .forEach((root) => menuGenerator(root, JSON.parse(root.dataset.menu || "{}")));

/**
 * @param {HTMLElement} root
 * @param {Partial<DroppyOptions>} options
 * @param {DroppyContext} context
 * @returns {DroppyContext}
 */
export function tabsGenerator(root, options, context = new DroppyContext()) {
    options = { ...droppyOptions, ...options };

    root.addEventListener('beforetoggle', (event) => {
        /** @type {Droppy} */
        const droppy = event.detail.droppy;

        droppy.drop.checkVisibility()
            ? event.preventDefault()
            : droppy.context.hideAll();
    });

    const triggers = root.querySelectorAll('[data-target]');

    for (const trigger of triggers) {
        const drop = root.querySelector(trigger.dataset.target);

        if (! drop) continue;

        new Droppy(trigger, drop, options, context);
    }

    return context;
}

document
    .querySelectorAll('[data-tabs]')
    .forEach((root) => tabsGenerator(root, JSON.parse(root.dataset.tabs || "{}")));
