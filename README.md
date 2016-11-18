# Droppy

Pure JavaScript multi-level drop-down menu.

At it's core, Droppy adds or removes CSS classes. This way you are able to
control the menu appearance, just editing the `.droppy_drop` and
`.droppy__drop--active` CSS classes.

## Quick Start

Start using Droppy in three steps.

1. Download latest Droppy package from [Github][836c3e46].

2. Add `dist/droppy.min.css` and `dist/droppy.min.js` to your web page.
  ```html
  <link href="/path/to/droppy.min.css" rel="stylesheet" media="screen">
  ```
  ```html
  <script src="/path/to/droppy.min.js"></script>
  ```

3. Initialize Droppy in a custom script.
  ```js
  var element = document.querySelector( '.dropdown-menu' )
  // Initialize Droppy.
  var droppy = new Droppy( element, {
    dropdownSelector: 'li > ul.menu',
    triggerSelector: 'a',
    closeOthers: true
  } )
  ```

That's it. You're all set to start using Droppy.

  [836c3e46]: https://github.com/OutlawPlz/droppy "Download"

### Initialize with HTML

You can initialize Droppy in HTML, just adding `data-droppy` attribute to the
menu element. Options can be set in its value using **valid JSON**.

```html
<!-- Init with HTML -->
<nav class="dropdown-menu" data-droppy='{ "dropdownSelector": "li > ul.menu", "triggerSelector": "a", "closeOthers": true }'>
```

## Options

None of Droppy's options are required, but to make it work properly with your
menu structure you should set `dropdownSelector` and `triggerSelector`.

```js
// Default options.
var droppy = new Droppy( element, {
  dropdownSelector: 'li > ul',
  triggerSelector: 'a',
  closeOthers: true
} );
```

```html
<nav class="dropdown-menu"> <!-- The Droppy's element -->
  <ul class="menu">
    <li>
      <a href="#">Link #1</a> <!-- The trigger selector a -->
      <ul class="menu"> <!-- The drop-down selector li > ul -->
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

- ***triggerSelector*** - It's a valid CSS selector of the element that triggers
the open or close event. In the example above the trigger is the `<a>` element.
That's why the `triggerSelector` is set to `a`.

- ***closeOthers*** - A boolean value. Set to `true` if you want keep open only
one drop-down at a time.

## Methods

Methods are actions done by Droppy instances.

```js
// Instantiate
var droppy = new Droppy( element, {
  dropdownSelector: 'ul > li',
  triggerSelector: 'a',
  closeOthers: true
} );
```

### init()

Initialize a Droppy object. This function is called when a new Droppy object is
instantiate.

```js
// Init Droppy object
droppy.init();
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

### getStore()

It's a **static method**. It returns an array containing every Droppy instance.
When you create a new Droppy object, the instance is saved in an array. This
way you can easily get an instance initialized via HTML.

```js
// Get the store
var droppyStore = Droppy.prototype.getStore();
```
