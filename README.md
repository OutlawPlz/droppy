# Droppy

Droppy is a pure JavaScript multi-level dropdown menu. It shows and hides elements using your custom animations. Styling the menu via custom CSS is up to you.

## Quick Start

Start using Droppy in three steps.

1. Add Droppy to your page.
  ```html
  <script defer type="module" src="https://cdn.jsdelivr.net/npm/droppy-menu@v2.x.x/src/droppy.js"></script>
  ```

2. Mark your menu with the `data-droppy` attribute.
  ```html
  <nav data-droppy>
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

### Use `Droppy` class

Instantiate a new Droppy object the trigger and dropdown elements. Done!

```js
import Droppy from '@/droppy-menu/src/droppy.js';

const trigger = document.querySelector('li > a');
const dropdown = document.querySelector('li > ul');

const droppy = new Droppy(trigger, dropdown, {
    // Options...
});
```

A Droppy instance **represents a single node** of your dropdown menu. This is useful if you want to use Droppy for a modal or a single dropdown.

### Use `generator()` function

If you wish to handle a whole menu, the Droppy generator is the way to go. Define your menu structure using the `wrapper`, `trigger`, and `drop` options.
The generator returns an array of Droppy instances. The `generator()` function ignores wrappers that don't contain a trigger or drop element.

```js
import Droppy, {generator} from '@/droppy-menu/src/droppy.js'

const root = document.querySelector('[data-droppy]');

/** @type {Droppy[]} */
const instances = generator(root, { 
  wrapper: 'li', 
  trigger: 'a', 
  drop: 'ul' 
});
```

## Initialize via HTML

As shown in the Quick Start section, you can initialize Droppy in HTML using the `data-droppy` attribute. Options can be set in its value.

```html
<script defer type="module" src="https://cdn.jsdelivr.net/npm/droppy-menu@v2.x.x/src/droppy.js"></script>

<nav data-droppy='{
    "wrapper": "li", 
    "trigger": "a", 
    "drop": "ul", 
    "animationIn": "fade-in", 
    "animationOut": "fade-out"
 }'>
   ...
</nav>
```

## Options

You can customize `Droppy` and `generator` function using the options object.

```js
/** @type {DroppyOptions} Default values */
const droppyOptions = {
  animationIn: '',
  animationOut: '',
  display: 'block',
  clickAwayToClose: true,
  preventDefault: false,
}
```

The `generator` options accepts all `Droppy` options.

```js
/** @type {GeneratorOptions} Default values */
const generatorOptions = {
  wrapper: 'li',
  trigger: 'a',
  drop: 'ul',
  ...droppyOptions,
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