// https://cdn.jsdelivr.net/npm/droppy-menu@v2.x.x/src/droppy.min.js
import Droppy, { DroppyContext, globalContext } from "../src/droppy.js";

/**
 * @param {HTMLElement} root
 * @param {Partial<GeneratorOptions>} options
 * @returns {Droppy[]}
 */
function tabsGenerator(root, options = { clickAwayToClose: false, animationIn: 'fade-in' }) {
    const tabs = root.querySelectorAll('[data-tab]');

    const tabsContext = new DroppyContext();

    for (const trigger of tabs) {
        const drop = root.querySelector(`#${trigger.dataset.tab}`);

        drop.addEventListener('beforetoggle', (event) => {
            /** @type {Droppy} */
            const droppy = event.detail.droppy;

            // TODO: Forse è più semplice una preventClose?

            droppy.drop.checkVisibility()
                ? event.preventDefault()
                : droppy.context.closeAll();
        });

        new Droppy(trigger, drop, options, tabsContext);
    }
};

const tabWrapper = document.getElementById('tabs');

tabsGenerator(tabWrapper);
