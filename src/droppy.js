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

        this.trigger.addEventListener('click', (event) => {
            if (this.options.preventDefault) event.preventDefault();

            this.toggle();
        });

        this.drop = drop;

        this.options = { ...droppyOptions, ...options };

        this.context = context;

        this.context.instances.push(this);

        if (this.options.clickAwayToClose) {
            clickAwayContext.instances.push(this);
        }
    }

    show() {
        const promise = new Promise((resolve) => {
            this.drop.addEventListener('animationend', resolve);
        })
            .then(() => {
                if (this.options.animationIn) {
                    this.drop.classList.remove(this.options.animationIn);
                }
            });

        this.options.animationIn
            ? this.drop.classList.add(this.options.animationIn)
            : this.drop.dispatchEvent(new Event('animationend'));

        if (this.options.triggerActiveClass) {
            this.trigger.classList.add(this.options.triggerActiveClass);
        }

        this.drop.style.display = this.options.display;

        return promise;
    };

    hide() {
        const promise = new Promise((resolve) => {
            this.drop.addEventListener('animationend', resolve);
        }).then(() => {
            this.drop.style.display = 'none';

            if (this.options.animationOut) {
                this.drop.classList.remove(this.options.animationOut);
            }
        });

        this.options.animationOut
            ? this.drop.classList.add(this.options.animationOut)
            : this.drop.dispatchEvent(new Event('animationend'));

        if (this.options.triggerActiveClass) {
            this.trigger.classList.remove(this.options.triggerActiveClass);
        }

        return promise;
    };

    async toggle() {
        const beforeToggle = new CustomEvent('beforetoggle', {
            bubbles: true,
            cancelable: true,
            detail: { droppy: this },
        });

        this.drop.dispatchEvent(beforeToggle);

        if (beforeToggle.defaultPrevented) return;

        this.drop.checkVisibility()
            ? await this.hide()
            : await this.show();

        const toggle = new CustomEvent('toggle', {
            bubbles: true,
            cancelable: true,
            detail: { droppy: this },
        })

        this.drop.dispatchEvent(toggle);
    }
}

/**
 * @typedef {DroppyOptions} MenuGeneratorOptions
 * @extends DroppyOptions
 * @prop {string} wrapper CSS selector
 * @prop {string} trigger CSS selector
 * @prop {string} drop CSS selector
 */

/** @type {MenuGeneratorOptions} */
const menuGeneratorOptions = {
    wrapper: 'li',
    trigger: 'a',
    drop: 'ul',
    ...droppyOptions
}

/**
 * @param {HTMLElement} root
 * @param {Partial<MenuGeneratorOptions>} options
 * @param {DroppyContext} context
 * @returns {DroppyContext}
 */
export function menuGenerator(root, options, context = new DroppyContext()) {
    options = { ...menuGeneratorOptions, ...options };

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

/**
 * @typedef {DroppyOptions} ModalGeneratorOptions
 * @prop {string} modal CSS selector
 * @prop {string|HTMLElement} backdrop CSS selector
 */

/**
 * @param {HTMLElement} trigger
 * @param {ModalGeneratorOptions} options
 * @param {DroppyContext} context
 */
export function modalGenerator(trigger, options, context = new DroppyContext()) {
    const modal = document.querySelector(options.modal);

    if (options.backdrop && typeof options.backdrop === 'string') {
        options.backdrop = document.querySelector(options.backdrop);
    }

    new Droppy(trigger, modal, options, context);

    modal.addEventListener('beforetoggle', (event) => {
        /** @type {Droppy} */
        const droppy = event.detail.droppy;

        droppy.drop.checkVisibility()
            ? droppy.options.backdrop.style.display = 'none'
            : droppy.options.backdrop.style.display = 'block';
    })
}

document
    .querySelectorAll('[data-modal]')
    .forEach((root) => modalGenerator(root, JSON.parse(root.dataset.modal || "{}")));
