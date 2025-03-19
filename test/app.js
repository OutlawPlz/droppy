// https://cdn.jsdelivr.net/npm/droppy-menu@v2.x.x/src/droppy.min.js
import Droppy, { DroppyContext } from "../src/droppy.js";

const triggers = document.querySelectorAll('[data-modal]');

for (const trigger of triggers) {
    const modal = document.querySelector(trigger.dataset.modal);

    if (! modal) continue;

    new Droppy(trigger, modal, { display: 'block', animationIn: 'fade-in', animationOut: 'fade-out' });

    modal.addEventListener('beforetoggle', (event) => {
        /** @type {Droppy} */
        const droppy = event.detail.droppy;

        const backdrop = document.querySelector('#backdrop');

        droppy.drop.checkVisibility()
            ? backdrop.style.display = 'none'
            : backdrop.style.display = 'block';
    });
}
