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

1. Download latest Droppy package from [Github][836c3e46] or via NPM or Bower.
  ```sh
  # NPM
  npm install droppy-menu --save
  # Bower
  bower install droppy-menu --save
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
    triggerSelector: 'a'
  } );
  ```

That's it. You're all set to start using Droppy.

  [836c3e46]: https://github.com/OutlawPlz/droppy "Download"

### Initialize with HTML

You can initialize Droppy in HTML, just adding `data-droppy` attribute to the
menu element. Options can be set in its value using **valid JSON**.

```html
<!-- Init with HTML -->
<nav class="dropdown-menu" data-droppy='{ "parentSelector": "li", "dropdownSelector": "li > ul.menu", "triggerSelector": "a", "closeOthers": true, "clickOutToClose": true, "clickEscToClose": true, "animationIn": '', "animationOut": '', "preventDefault": true }'>
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
  clickEscToClose: true,
  animationIn: '',
  animationOut: '',
  preventDefault: true
}, callbacks );
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

- ***dropdownSelector*** - It's a valid CSS selector of your drop-down. In the
example above I have a drop-down when there is a `<ul class="menu">` son of a
`<li>`. That's why the `dropdownSelector` is set to `li > ul.menu`.

- ***parentSelector*** - It's a valid CSS selector of your parent element. The
parent element **have to contain** the trigger element and the drop-down
element. It should be the closest parent. In the example above the closest
parent of both - `dropdownSelector` and `triggerSelector` - is the `<li>`
element. That's why the `parentSelector` is set to `li`.

- ***triggerSelector*** - It's a valid CSS selector of the element that triggers
the open or close event. In the example above the trigger is the `<a>` element.
That's why the `triggerSelector` is set to `a`.

- ***closeOthers*** - A boolean value. Set to `true` if you want keep open only
one drop-down at a time.

- ***clickOutToClose*** - A boolean value. Set to `true` if you want to close
all the drop-downs by clicking on the outside of the current menu.

- ***clickEscToClose*** - A boolean value. Set to `true` if you want to close
all the drop-downs by clicking ESC.

- ***animationIn*** - A CSS class where is declared an animation. This class
will be applied at the open of a drop-down and removed at the end of the
animation.

- ***animationOut*** - A CSS class where is declared an animation. This class
will be applied at the close of a drop-down and removed at the end of the
animation.

- ***preventDefault*** - A boolean value. If the `triggerSelector` is an element
that fires an event, you can prevent the execution of the default behavior
setting this option to `true`. E.g. If `triggerSelector` is a link, we want the
browser opens the drop-down, not follows the link. Setting `preventDefault` to
`true` prevents the browser to follow the link.

## Methods

Methods are actions done by Droppy instances.

```js
// Instantiate
var droppy = new Droppy( element, options, callbacks );
```

### init()

Initialize a Droppy object. It adds Droppy CSS classes and events.

```js
// Init Droppy object
droppy.init();
```

### destroy()

Reset a Droppy instance to a pre-init state. It removes Droppy CSS classes and
events.

```js
// Reset Droppy instance to a pre-init state
droppy.destroy();
```

### open( dropdown, withDescendants )

Open the given drop-down. If `closeOthers` is set to `true`, the other
drop-downs will be closed before opening the current one.

- `{Element} dropdown` - The drop-down element to open.
- `{Boolean} [withDescendants=false]` - Should open or not all the drop-downs
in the given drop-down.

```js
var dropdown = document.querySelector( '#menu-main .droppy__drop' )
// Open a drop-down
droppy.open( dropdown );
```

### close( dropdown, withDescendants )

Close the given drop-down and all its descendants.

- `{Element} dropdown` - The drop-down element to close.
- `{Boolean} [withDescendants=true]` - Should close or not all the drop-downs
in the given drop-down.

```js
var dropdown = document.querySelector( '#menu-main .droppy__drop' )
// Close a drop-down
droppy.close( dropdown );
```

### toggle( dropdown, withDescendants )

Open or close the given drop-down.

- `{Element} dropdown` - The drop-down element to toggle.
- `{Boolean} [withDescendants=undefined]` - Should toggle or not all the drop-downs
in the given drop-down.

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

It returns true if the given Droppy instance is
initialized, false otherwise.

```js
var droppy = new Droppy( element, options );
// Check if initialized
var initialized = Droppy.prototype.isInitialized( droppy );
```

### Droppy.prototype.getInstance( element )

It returns the Droppy instance used by the given
element.

```js
var element = document.querySelector( '[data-droppy]' );
// Get the instance
var droppy = Droppy.prototype.getInstance( element );
```

## Callbacks

Callbacks are function called at a specific point of execution. Callbacks does
not wait for animation end, this may cause the execution of `afterOpen`,
`afterClose`, `afterOpenAll` and `afterCloseAll` when the drop-down is not
completely opened or closed yet.

```js
// Default callbacks.
var droppy = new Droppy( element, options, {
  beforeOpen: null,
  afterOpen: null,
  beforeClose: null,
  afterClose: null,
  beforeOpenAll: null,
  afterOpenAll: null,
  beforeCloseAll: null,
  afterCloseAll: null,
  beforeInit: null,
  afterInit: null,
  beforeDestroy: null,
  afterDestroy: null
} );
```

### Define a callback

Define a callback in three steps.

1. Create your callback function.
  ```js
  function alertCallback() {
    alert( 'Before open.' );
  }
  ```

2. Assign the function to the `callbacks` object.
  ```js
  var callbacks = {
    beforeOpen: alertCallback
  }
  ```

3. Create a Droppy object with the callbacks.
  ```js
  var droppy = new Droppy(element, options, callbacks);
  ```

## Detect drop-down structure

Understanding how Droppy detect your drop-down menu structure, can help you set
`*Selector` options correctly.

Droppy starts from `dropdownSelector` to detect your drop-down menu structure.
For each drop-down, Droppy loops through element parents until reach the first
element that matches the `parentSelector`. Once got the parent element, Droppy
selects the first element child of the parent element that matches the
`triggerSelector`.

Instead of querying at every click the DOM, Droppy stores your drop-down menu
structure in the `tree` property. The `tree` is an array of `DroppyNode`
instances.

```js
var droppy = new Droppy( element, options, callbacks );
// Print the tree
console.log( droppy.tree );
```

## Polyfills

Droppy uses a bunch of polyfills to be compatible with old browsers. Here's a
list of polyfills used.

- [Element.prototype.classList()][ad792cb7]
- [Element.prototype.matches()][92b6fcf0]

  [ad792cb7]: https://github.com/eligrey/classList.js "Polyfill Element.prototype.classList()"
  [92b6fcf0]: https://developer.mozilla.org/it/docs/Web/API/Element/matches#Polyfill "Polyfill Element.prototype.matches()"
