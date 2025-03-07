// https://cdn.jsdelivr.net/npm/droppy-menu@v2.x.x/src/droppy.min.js
import Droppy, { DroppyContext, globalContext } from "../src/droppy.js";

console.log(globalContext);

const tabs = document.querySelectorAll('[data-tab]');

const tabsContext = new DroppyContext();

for (const trigger of tabs) {
    new Droppy(
        trigger,
        document.querySelector(`#${trigger.dataset.tab}`),
        { clickAwayToClose: false, closeOthers: true },
        tabsContext,
    );
}
