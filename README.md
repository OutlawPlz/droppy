# Droppy

Droppy is a pure JavaScript multi-level dropdown menu. It shows and hides elements using your custom animations. Styling the menu via custom CSS is up to you.

## Quick Start

Start using Droppy in three steps.

1. Add Droppy to your page.
  ```html
  <script defer type="module" src="https://cdn.jsdelivr.net/npm/droppy-menu@v2.x.x/src/droppy.js"></script>
  ```

2. Mark your menu with the `data-menu` attribute.
  ```html
  <nav data-menu>
    <ul class="menu">
      <li>
        <a href="#">First level - Link #1</a>
        <ul class="dropdown">
          <li><a href="#">Second level - Link #1</a></li>
        </ul>
      </li>
    </ul>
  </nav>
  ```

3. Style your brand-new dropdown menu.
  ```css
  li > .dropdown {
    display: none;
  }
  ```

That's it! You're all set to start using Droppy.

## Install via NPM

You can install Droppy via NPM by adding the package to your project.

```sh
npm install --save droppy-menu
```

### Init via `Droppy` class

Create a new Droppy instance by specifying the `trigger` and `dropdown` elements. Done!

```js
import Droppy from '@/droppy-menu/src/droppy.js';

const trigger = document.querySelector('li > a');
const dropdown = document.querySelector('li > ul');

const droppy = new Droppy(trigger, dropdown, {
    // Options...
});
```

A Droppy instance **represents a single node** of your dropdown menu. This is useful if you want to use Droppy for a modal or a single dropdown.

### Init via HTML attribute

You can initialize Droppy in HTML using the generator's attributes. Check the section related to generators.

## Options

You can customize `Droppy` using the options object.

```js
/** @type {DroppyOptions} Default values */
const droppyOptions = {
  animationIn: '', // A CSS class with animation.
  animationOut: '', // A CSS class with animation.
  display: 'block', // E.g. block, inline, flex, grid, etc.
  triggerActiveClass: 'active', // Adds the class to the trigger.
  preventDefault: false, // If the trigger is <a> element, prevent default action.
}
```

## Methods

Public methods of Droppy instances. They are self-explanatory.

```js
const droppy = new Droppy(trigger, dropdown);

droppy.show(); // Shows current dropdown.
droppy.hide(); // Hides current dropdown.
droppy.toggle(); // Shows/hides current dropdown.
```

## `DroppyContext` class

Each `Droppy` instance is added to a `DroppyContext`. If you don't specify a context when creating an instance, it will be added to the `globalContext`. You can access the `globalContext` by importing it into your script.

```js
import { globalContext } from '@/droppy-menu/src/droppy.js';
```

You can also define a custom context for a specific `Droppy` instance by specifying it in the constructor:

```js
import Droppy, { DroppyContext } from '@/droppy-menu/src/droppy.js';

const customContext = new DroppyContext();

new Droppy(trigger, drop, options, customContext);
```

The `DroppyContext` is used to group multiple `Droppy` instances together.

## Generators

Droppy provides functions that help you create specific behaviors. For example, `menuGenerator` allows you to create a dropdown menu, while `tabsGenerator` enables a tabbed interface. Each generator function has its own options, which are always a superset of `DroppyOptions`.

### The `menuGenerator` function

Define your menu structure using the `wrapper`, `trigger`, and `drop` options along with a `root` element. The generator will search for each `wrapper` and then select the `trigger` and `drop` elements inside it. If `clickAwayToClose` option is `true`, clicking outside the drop will close it.

```js
import { menuGenerator } from '/@/droppy-menu/src/droppy.js';

const options = {
    wrapper: 'li',
    trigger: 'a',
    drop: 'ul',
    clickAwayToClose: true,
    ...droppyOptions,
}

const nav = document.querySelector('nav');

/** @type {DroppyContext} */
const context = menuGenerator(nav, options);
```

As shown in the Quick Start section, you can initialize Droppy in HTML using the `data-menu` attribute. Options can be set in its value.

```html
<nav data-menu='{
    "wrapper": "li", 
    "trigger": "a", 
    "drop": "ul", 
    "animationIn": "fade-in", 
    "animationOut": "fade-out"
 }'>
   ...
</nav>
```

### The `tabsGenerator` function

Within the root element, the generator will look for the `data-target` attribute. Each `data-target` value must be a valid CSS selector. E.g. `data-target="#tab-1"`. The generator will ignore any missing or invalid selectors.

```js
import { tabsGenerator } from '/@/droppy-menu/src/droppy.js';

const options = { ...droppyOptions };

const root = document.querySelector('.tabs');

/** @type {DroppyContext} */
const context = tabsGenerator(root, options);
```

You can initialize tabs in HTML using the `data-tabs` attribute. Options can be set in its value.

```html
<div data-tabs='{ "animationIn":"fade-in" }'>
    <button data-target="#tab-1">Tab 1</button>
    <button data-target="#tab-2">Tab 2</button>
    <button data-target="#tab-3">Tab 3</button>
    
    <div id="tab-1">
        <!-- Content... -->
    </div>

    <div id="tab-2">
        <!-- Content... -->
    </div>

    <div id="tab-2">
        <!-- Content... -->
    </div>
</div>
```
