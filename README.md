# Droppy

Pure JavaScript multi-level drop-down menu.

At it's core, Droppy adds or removes CSS classes. This way you are able to
control the menu appearance, just editing the `.droppy_drop` and
`.droppy__drop--active` CSS classes.

```html
<!-- Classic HTML menu -->
<nav>
  <ul class="menu">
    <li>
      <a href="#">First level - Link #1</a>
      <ul class="menu">
        <li><a href="#">Second level - Link #1</a></li>
        <li><a href="#">Second level - Link #2</a></li>
      </ul>
    </li>
    <li><a href="#">First level - Link #2</a></li>
    <li><a href="#">First level - Link #3</a></li>
  </ul>
</nav>

```

## Quick Start

Start using Droppy in three steps.

1. Download latest Droppy package from [Github][836c3e46] or via NPM.
  ```sh
  npm install droppy-menu --save
  ```

2. Add `dist/droppy.min.css` and `dist/droppy.min.js` to your web page.
  ```html
  <link href="/path/to/droppy/dist/droppy.min.css" rel="stylesheet" media="screen">
  ```
  ```html
  <script src="/path/to/droppy/dist/droppy.min.js"></script>
  ```

3. Initialize Droppy in a custom script.
  ```js
  var element = document.querySelector( '.dropdown-menu' );
  // Initialize Droppy.
  var droppy = new Droppy( element, {
    parentSelector: 'li',
    dropdownSelector: 'li > ul.menu',
    triggerSelector: 'a',
    closeOthers: true,
    clickOutToClose: true,
    clickEscToClose: true
  } );
  ```

That's it. You're all set to start using Droppy.

  [836c3e46]: https://github.com/OutlawPlz/droppy "Download"

### Initialize with HTML

You can initialize Droppy in HTML, just adding `data-droppy` attribute to the
menu element. Options can be set in its value using **valid JSON**.

```html
<!-- Init with HTML -->
<nav class="dropdown-menu" data-droppy='{ "parentSelector": "li", "dropdownSelector": "li > ul.menu", "triggerSelector": "a", "closeOthers": true, "clickOutToClose": true, "clickEscToClose": true }'>
```

## Options

None of Droppy's options are required, but to make it work properly you should
describe your menu structure by setting the options `parentSelector`,
`dropdownSelector` and `triggerSelector`.

```js
// Default options.
var droppy = new Droppy( element, {
  parentSelector: 'li',
  dropdownSelector: 'li > ul',
  triggerSelector: 'a',
  closeOthers: true,
  clickOutToClose: true,
  clickEscToClose: true
} );
```

```html
<nav class="dropdown-menu"> <!-- The Droppy's element -->
  <ul class="menu">
    <li> <!-- The parent selector "li" -->
      <a href="#">Link #1</a> <!-- The trigger selector "a" -->
      <ul class="menu"> <!-- The drop-down selector "li > ul" -->
        <li><a href="#">Link #1</a></li>
        <li><a href="#">Link #2</a></li>
      </ul>
    </li>
    <li><a href="#">Link #2</a></li>
    <li><a href="#">Link #3</a></li>
  </ul>
</nav>
```

- ***parentSelector*** - It's a valid CSS selector of your parent element. The
parent element **have to contain** the trigger element and the dropdown element.
It should be the closest parent. In the example above the closest parent of
both - `dropdownSelector` and `triggerSelector` - is the `<li>` element. That's
why the `parentSelector` is set to `li`.

- ***dropdownSelector*** - It's a valid CSS selector of your drop-down. In the
example above I have a drop-down when there is a `<ul class="menu">` son of a
`<li>`. That's why the `dropdownSelector` is set to `li > ul.menu`.

- ***triggerSelector*** - It's a valid CSS selector of the element that triggers
the open or close event. In the example above the trigger is the `<a>` element.
That's why the `triggerSelector` is set to `a`.

- ***closeOthers*** - A boolean value. Set to `true` if you want keep open only
one drop-down at a time.

- ***clickOutToClose*** - A boolean value. Set to `true` if you want to close
all the drop-downs by clicking on the outside of the current menu.

- ***clickEscToClose*** - A boolean value. Set to `true` if you want to close
all the drop-downs by clicking ESC.

## Methods

Methods are actions done by Droppy instances.

```js
// Instantiate
var droppy = new Droppy( element, {
  parentSelector: 'li',
  dropdownSelector: 'ul > li',
  triggerSelector: 'a',
  closeOthers: true,
  clickOutToClose: true,
  clickEscToClose: true
} );
```

### init()

Initialize a Droppy object. It adds Droppy CSS classes and events.

```js
// Init Droppy object
droppy.init();
```

### destroy()

Reset a Droppy instance to a pre-init state. It remove Droppy CSS classes and
events.

```js
// Reset Droppy instance to a pre-init state
droppy.destroy();
```

### open( dropdown )

Open the given drop-down. If `closeOthers` is set to `true`, the other
drop-downs will be closed before opening the current one.

```js
var dropdown = document.querySelector( '#menu-main .droppy__drop' )
// Open a drop-down
droppy.open( dropdown );
```

### close( dropdown )

Close the given drop-down and all its descendants.

```js
var dropdown = document.querySelector( '#menu-main .droppy__drop' )
// Close a drop-down
droppy.close( dropdown );
```

### toggle( dropdown )

Open or close the given drop-down.

```js
var dropdown = document.querySelector( '#menu-main .droppy__drop' )

// Toggle a dropdown
droppy.toggle( dropdown );
```

### openAll()

Open all drop-downs of a menu.

```js
// Open all drop-downs
droppy.openAll();
```

### closeAll()

Close all drop-downs of a menu.

```js
// Close all drop-downs
droppy.closeAll();
```

### Droppy.prototype.isInitialized( droppy )

It's a **static method**. It returns true if the given Droppy instance is found
in the store.

```js
var droppy = new Droppy( element, options );

// Check if initialized
var initialized = Droppy.prototype.isInitialized( droppy );
```

### Droppy.prototype.getInstance( element )

It's a **static method**. It returns the Droppy instance used by a given
element.

```js
var element = document.querySelector( '[data-droppy]' );

// Get the instance
var droppy = Droppy.prototype.getInstance( element );
```

### Droppy.prototype.getStore()

It's a **static method**. It returns an array containing every Droppy instance.
When you create a new Droppy object, the instance is saved in an array. This
way you can easily get an instance initialized via HTML.

**DEPRECATED** - This function will be removed in Droppy v1.0.6.

```js
// Get the store
var droppyStore = Droppy.prototype.getStore();
```

## Polyfills

Droppy uses a bunch of polyfills to be compatible with old browsers. Here's a
list of polyfills used.

- [Array.prototype.forEach()][9a8a4327]
- [Array.prototype.map()][548b200b]
- [Element.prototype.classList()][ad792cb7]
- [Element.prototype.matches()][92b6fcf0]

  [9a8a4327]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#Polyfill "Polyfill Array.prototype.forEach()"
  [548b200b]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map#Polyfill "Polyfill Array.prototype.map()"
  [ad792cb7]: https://github.com/eligrey/classList.js "Polyfill Element.prototype.classList()"
  [92b6fcf0]: https://developer.mozilla.org/it/docs/Web/API/Element/matches#Polyfill "Polyfill Element.prototype.matches()"
