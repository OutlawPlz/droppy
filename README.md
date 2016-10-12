# Droppy

Pure JavaScript multi-level dropdown menu.

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
      <ul class="menu"> <!-- The dropdown selector li > ul -->
        <li><a href="#">Link #1</a></li>
        <li><a href="#">Link #2</a></li>
      </ul>
    </li>
    <li><a href="#">Link #2</a></li>
    <li><a href="#">Link #3</a></li>
  </ul>
</nav>
```

### dropdownSelector

Droppy will mark all elements found inside the Droppy's element as dropdown
menu. 

### triggerSelector

### closeOthers

[836c3e46]: https://github.com/OutlawPlz "Download"
