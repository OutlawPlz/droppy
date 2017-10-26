/**
 * Droppy - v1.1.1
 * Pure JavaScript multi-level drop-down menu.
 * By OutlawPlz, @license GPL-3.0.
 * https://github.com/OutlawPlz/droppy.git
 */
// Implements Element.prototype.classList() - v1.1.20150312
// By Eli Grey, http://eligrey.com
if ("document" in self) {

// Full polyfill for browsers with no classList support
// Including IE < Edge missing SVGElement.classList
  if (!("classList" in document.createElement("_"))
    || document.createElementNS && !("classList" in document.createElementNS("http://www.w3.org/2000/svg","g"))) {

    (function (view) {

      "use strict";

      if (!('Element' in view)) return;

      var
        classListProp = "classList"
        , protoProp = "prototype"
        , elemCtrProto = view.Element[protoProp]
        , objCtr = Object
        , strTrim = String[protoProp].trim || function () {
            return this.replace(/^\s+|\s+$/g, "");
          }
        , arrIndexOf = Array[protoProp].indexOf || function (item) {
            var
              i = 0
              , len = this.length
              ;
            for (; i < len; i++) {
              if (i in this && this[i] === item) {
                return i;
              }
            }
            return -1;
          }
        // Vendors: please allow content code to instantiate DOMExceptions
        , DOMEx = function (type, message) {
          this.name = type;
          this.code = DOMException[type];
          this.message = message;
        }
        , checkTokenAndGetIndex = function (classList, token) {
          if (token === "") {
            throw new DOMEx(
              "SYNTAX_ERR"
              , "An invalid or illegal string was specified"
            );
          }
          if (/\s/.test(token)) {
            throw new DOMEx(
              "INVALID_CHARACTER_ERR"
              , "String contains an invalid character"
            );
          }
          return arrIndexOf.call(classList, token);
        }
        , ClassList = function (elem) {
          var
            trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
            , classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
            , i = 0
            , len = classes.length
            ;
          for (; i < len; i++) {
            this.push(classes[i]);
          }
          this._updateClassName = function () {
            elem.setAttribute("class", this.toString());
          };
        }
        , classListProto = ClassList[protoProp] = []
        , classListGetter = function () {
          return new ClassList(this);
        }
        ;
// Most DOMException implementations don't allow calling DOMException's toString()
// on non-DOMExceptions. Error's toString() is sufficient here.
      DOMEx[protoProp] = Error[protoProp];
      classListProto.item = function (i) {
        return this[i] || null;
      };
      classListProto.contains = function (token) {
        token += "";
        return checkTokenAndGetIndex(this, token) !== -1;
      };
      classListProto.add = function () {
        var
          tokens = arguments
          , i = 0
          , l = tokens.length
          , token
          , updated = false
          ;
        do {
          token = tokens[i] + "";
          if (checkTokenAndGetIndex(this, token) === -1) {
            this.push(token);
            updated = true;
          }
        }
        while (++i < l);

        if (updated) {
          this._updateClassName();
        }
      };
      classListProto.remove = function () {
        var
          tokens = arguments
          , i = 0
          , l = tokens.length
          , token
          , updated = false
          , index
          ;
        do {
          token = tokens[i] + "";
          index = checkTokenAndGetIndex(this, token);
          while (index !== -1) {
            this.splice(index, 1);
            updated = true;
            index = checkTokenAndGetIndex(this, token);
          }
        }
        while (++i < l);

        if (updated) {
          this._updateClassName();
        }
      };
      classListProto.toggle = function (token, force) {
        token += "";

        var
          result = this.contains(token)
          , method = result ?
          force !== true && "remove"
            :
          force !== false && "add"
          ;

        if (method) {
          this[method](token);
        }

        if (force === true || force === false) {
          return force;
        } else {
          return !result;
        }
      };
      classListProto.toString = function () {
        return this.join(" ");
      };

      if (objCtr.defineProperty) {
        var classListPropDesc = {
          get: classListGetter
          , enumerable: true
          , configurable: true
        };
        try {
          objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
        } catch (ex) { // IE 8 doesn't support enumerable:true
          if (ex.number === -0x7FF5EC54) {
            classListPropDesc.enumerable = false;
            objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
          }
        }
      } else if (objCtr[protoProp].__defineGetter__) {
        elemCtrProto.__defineGetter__(classListProp, classListGetter);
      }

    }(self));

  } else {
// There is full or partial native classList support, so just check if we need
// to normalize the add/remove and toggle APIs.

    (function () {
      "use strict";

      var testElement = document.createElement("_");

      testElement.classList.add("c1", "c2");

      // Polyfill for IE 10/11 and Firefox <26, where classList.add and
      // classList.remove exist but support only one argument at a time.
      if (!testElement.classList.contains("c2")) {
        var createMethod = function(method) {
          var original = DOMTokenList.prototype[method];

          DOMTokenList.prototype[method] = function(token) {
            var i, len = arguments.length;

            for (i = 0; i < len; i++) {
              token = arguments[i];
              original.call(this, token);
            }
          };
        };
        createMethod('add');
        createMethod('remove');
      }

      testElement.classList.toggle("c3", false);

      // Polyfill for IE 10 and Firefox <24, where classList.toggle does not
      // support the second argument.
      if (testElement.classList.contains("c3")) {
        var _toggle = DOMTokenList.prototype.toggle;

        DOMTokenList.prototype.toggle = function(token, force) {
          if (1 in arguments && !this.contains(token) === !force) {
            return force;
          } else {
            return _toggle.call(this, token);
          }
        };

      }

      testElement = null;
    }());
  }
}

if (!Element.prototype.matches) {
  Element.prototype.matches =
    Element.prototype.matchesSelector ||
    Element.prototype.mozMatchesSelector ||
    Element.prototype.msMatchesSelector ||
    Element.prototype.oMatchesSelector ||
    Element.prototype.webkitMatchesSelector ||
    function(s) {
      var matches = (this.document || this.ownerDocument).querySelectorAll(s),
        i = matches.length;
      while (--i >= 0 && matches.item(i) !== this) {}
      return i > -1;
    };
}
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.TinyEmitter = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function E () {
  // Keep this empty so it's easier to inherit from
  // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
}

E.prototype = {
  on: function (name, callback, ctx) {
    var e = this.e || (this.e = {});

    (e[name] || (e[name] = [])).push({
      fn: callback,
      ctx: ctx
    });

    return this;
  },

  once: function (name, callback, ctx) {
    var self = this;
    function listener () {
      self.off(name, listener);
      callback.apply(ctx, arguments);
    };

    listener._ = callback
    return this.on(name, listener, ctx);
  },

  emit: function (name) {
    var data = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i = 0;
    var len = evtArr.length;

    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data);
    }

    return this;
  },

  off: function (name, callback) {
    var e = this.e || (this.e = {});
    var evts = e[name];
    var liveEvents = [];

    if (evts && callback) {
      for (var i = 0, len = evts.length; i < len; i++) {
        if (evts[i].fn !== callback && evts[i].fn._ !== callback)
          liveEvents.push(evts[i]);
      }
    }

    // Remove event from queue to prevent memory leak
    // Suggested by https://github.com/lazd
    // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

    (liveEvents.length)
      ? e[name] = liveEvents
      : delete e[name];

    return this;
  }
};

module.exports = E;

},{}]},{},[1])(1)
});
/*
 * Droppy - Pure JavaScript multi-level drop-down menu.
 */

( function ( window, factory ) {

  // AMD
  if ( typeof define === 'function' && define.amd ) {
    define( [
      'tiny-emitter'
    ], factory );
  }
  // CommonJS
  else if ( typeof exports === 'object' ) {
    module.exports = factory(
      require('tiny-emitter')
    );
  }
  // Browser global
  else {
    window.Droppy = factory(
      window.TinyEmitter
    );
  }
} ( window, function ( TinyEmitter ) {

  'use strict';

  var console = window.console,
      droppyStore = [],
      animationSupport = detectAnimationSupport();


  // Constructor
  // ---------------------------------------------------------------------------

  /**
   * Instantiate a new Droppy object.
   *
   * @param {Element} element
   *        The element on which Droppy will act.
   * @param {Object} options
   *        An object containing Droppy options.
   * @param {Object} callbacks
   *        An object containing callback functions.
   * @constructor
   */
  function Droppy ( element, options, callbacks )  {

    // Do not instantiate twice on same element.
    if ( Droppy.prototype.getInstance( element ) ) {
      if ( console ) {
        console.error( 'Droppy: another Droppy instance was found for this element.', element );
      }
      return;
    }

    // Check Droppy element.
    if ( element.nodeType !== Node.ELEMENT_NODE ) {
      if ( console ) {
        console.error( 'Droppy: the given element is not valid.', element );
      }
      return;
    }

    this.element = element;

    // Check dropdown selector.
    var dropdown = this.element.querySelector( options.dropdownSelector );

    if ( !dropdown ) {
      if ( console ) {
        console.error( 'Droppy: the given dropdownSelector returns no value.', options.dropdownSelector );
      }
      return;
    }

    // Check parent selector.
    var parent = this.element.querySelector( options.parentSelector );

    if ( !parent ) {
      if ( console ) {
        console.error( 'Droppy: the given parentSelector returns no value.', options.parentSelector );
      }
      return;
    }

    // Check trigger selector.
    var trigger = this.element.querySelector( options.triggerSelector );

    if ( !trigger ) {
      if ( console ) {
        console.error( 'Droppy: the given triggerSelector returns no value.', options.triggerSelector );
      }
      return;
    }

    // Default options.
    var defaultOptions = {
      parentSelector: 'li',
      dropdownSelector: 'li > ul',
      triggerSelector: 'a',
      closeOthers: true,
      clickOutToClose: true,
      clickEscToClose: true,
      animationIn: '',
      animationOut: '',
      preventDefault: true
    };

    // Init options.
    if ( options && typeof options === 'object' ) {
      this.options = extendDefaults( defaultOptions, options );
    }
    else {
      this.options = defaultOptions;
    }

    // Default callbacks.
    var defaultCallbacks = {
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
    };

    // Init callbacks.
    if ( callbacks && typeof callbacks === 'object' ) {
      this.callbacks = extendDefaults( defaultCallbacks, callbacks );
    }
    else {
      this.callbacks = defaultCallbacks;
    }

    // Init Droppy.
    this.init();
  }

  // Inherit methods from TinyEmitter.
  Droppy.prototype = Object.create( TinyEmitter.prototype );
  Droppy.prototype.constructor = Droppy;

  /**
   * Instantiate a new DroppyNode object.
   *
   * @constructor
   */
  function DroppyNode () {

    this.dropdown = '';
    this.parent = '';
    this.trigger = '';
    this.parentNodes = [];
    this.descendantNodes = [];
    this.level = 0;
    this.open = false;
  }


  // Public methods
  // ---------------------------------------------------------------------------

  /**
   * Initialize a Droppy object. This function is called when a new Droppy
   * object is created. It adds CSS classes, aria attributes and events.
   */
  Droppy.prototype.init = function () {

    // Do not initialize twice.
    if ( Droppy.prototype.isInitialized( this ) ) {
      return;
    }

    // Before callback.
    if ( typeof this.callbacks.beforeInit === 'function' ) {
      this.callbacks.beforeInit();
    }

    // Generate the tree.
    this.tree = generateTree(
      this.element,
      this.options.dropdownSelector,
      this.options.parentSelector,
      this.options.triggerSelector
    );

    // Add Droppy attributes.
    this.element.classList.add( 'droppy' );

    for ( var i = this.tree.length, node; i--, node = this.tree[ i ]; ) {

      node.dropdown.classList.add( 'droppy__drop' );

      node.parent.classList.add( 'droppy__parent' );

      node.trigger.classList.add( 'droppy__trigger' );
      node.trigger.setAttribute( 'aria-haspopup', 'true' );
      node.trigger.setAttribute( 'aria-expanded', 'false' );
    }

    // Add events.
    if ( droppyStore.length === 0 ) {
      document.body.addEventListener( 'click', clickHandler );
      document.body.addEventListener( 'keyup', escHandler );
    }

    // Add instance to the store.
    droppyStore.push( this );

    // After callback.
    if ( typeof this.callbacks.afterInit === 'function' ) {
      this.callbacks.afterInit();
    }

    // Dispatch event.
    this.emit( 'init', {
      droppy: this
    } );
  };

  /**
   * Reset a Droppy instance to a pre-init state. It remove Droppy CSS classes,
   * aria attributes and events.
   */
  Droppy.prototype.destroy = function () {

    // If not initialized, do not destroy.
    if ( !Droppy.prototype.isInitialized( this ) ) {
      return;
    }

    // Before callback.
    if ( typeof this.callbacks.beforeDestroy === 'function' ) {
      this.callbacks.beforeDestroy();
    }

    // Remove Droppy attributes.
    this.element.classList.remove( 'droppy' );

    for ( var i = this.tree.length, node; i--, node = this.tree[ i ]; ) {

      node.dropdown.classList.remove( 'droppy__drop', 'droppy__drop--active' );

      node.parent.classList.remove( 'droppy__parent' );

      node.trigger.classList.remove( 'droppy__trigger' );
      node.trigger.removeAttribute( 'aria-haspopup' );
      node.trigger.removeAttribute( 'aria-expanded' );
    }

    delete this.tree;

    // Remove events.
    if ( droppyStore.length === 1 ) {
      document.body.removeEventListener( 'click', clickHandler );
      document.body.removeEventListener( 'keyup', escHandler );
    }

    // Remove instance from the store.
    for ( var j = droppyStore.length, droppy; j--, droppy = droppyStore[ j ]; ) {
      if ( droppy === this ) {
        droppyStore.splice( j, 1 );
      }
    }

    // After callback.
    if ( typeof this.callbacks.afterDestroy === 'function' ) {
      this.callbacks.afterDestroy();
    }

    // Dispatch event.
    this.emit( 'destroy', {
      droppy: this
    } );
  };

  /**
   * Open the given drop-down.
   *
   * @param {Element|DroppyNode} dropdown
   *        The drop-down element to open.
   * @param {Boolean} [withDescendants=false]
   *        Should open or not all the drop-downs in the given drop-down.
   */
  Droppy.prototype.open = function ( dropdown, withDescendants ) {

    /** @var DroppyNode node */
    var node;

    // Check if dropdown is a node or an element. We need a node.
    if ( dropdown instanceof DroppyNode ) {
      node = dropdown;
    }
    else {
      node = getNodeByProperty( 'dropdown', dropdown, this.tree );
    }

    // If opened yet, return.
    if ( node.open ) {
      return;
    }

    // Before callback.
    if ( typeof this.callbacks.beforeOpen === 'function' ) {
      this.callbacks.beforeOpen();
    }

    // If closeOthers set to true, close all open siblings of the current node.
    if ( this.options.closeOthers ) {

      var siblings = getNodesByProperty( 'level', node.level, this.tree );

      for ( var i = siblings.length, sibling; i--, sibling = siblings[ i ]; ) {
        if ( sibling.open ) {
          close( sibling, true, this.options.animationOut );
        }
      }
    }

    // Call open().
    open( node, withDescendants, this.options.animationIn );

    // After callback.
    if ( typeof this.callbacks.afterOpen === 'function' ) {
      this.callbacks.afterOpen();
    }

    // Dispatch event.
    this.emit( 'open', {
      droppy: this,
      dropdown: node
    } );
  };

  /**
   * Close the given drop-down.
   *
   * @param  {Element|DroppyNode} dropdown
   *         The dropdown element to close.
   * @param  {Boolean} [withDescendants=true]
   *         Should close or not all the drop-downs in the given drop-down.
   */
  Droppy.prototype.close = function ( dropdown, withDescendants ) {

    var node;

    // Check if dropdown is a node or an element. We need a node.
    if ( dropdown instanceof DroppyNode ) {
      node = dropdown;
    }
    else {
      node = getNodeByProperty( 'dropdown', dropdown, this.tree );
    }

    // If closed yet, return.
    if ( !node.open ) {
      return;
    }

    // Before callback.
    if ( typeof this.callbacks.beforeClose === 'function' ) {
      this.callbacks.beforeClose();
    }

    // Call close().
    close( node, withDescendants, this.options.animationOut );

    if ( typeof this.callbacks.afterClose === 'function' ) {
      this.callbacks.afterClose();
    }

    // Dispatch event.
    this.emit( 'close', {
      droppy: this,
      dropdown: node
    } );
  };

  /**
   * Open or close the given drop-down.
   *
   * @param  {Element|DroppyNode} dropdown
   *         The drop-down element to open or close.
   * @param  {Boolean|undefined} withDescendants
   *         Should open/close or not all the drop-downs in the given drop-down.
   */
  Droppy.prototype.toggle = function ( dropdown, withDescendants ) {

    var node;

    // Check if dropdown is a node or an element. We need a node.
    if ( dropdown instanceof DroppyNode ) {
      node = dropdown;
    }
    else {
      node = getNodeByProperty( 'dropdown', dropdown, this.tree );
    }

    // If open call close, call open otherwise.
    if ( node.open ) {
      this.close( node, withDescendants );
    }
    else {
      this.open( node, withDescendants );
    }
  };

  /**
   * Close all drop-down in a Droppy menu.
   */
  Droppy.prototype.closeAll = function () {

    // If no node is open, return.
    var openNode = getNodeByProperty( 'open', true, this.tree );

    if ( !openNode ) {
      return;
    }

    // Before callback.
    if ( typeof this.callbacks.beforeCloseAll === 'function' ) {
      this.callbacks.beforeCloseAll();
    }

    // Close the drop-downs.
    var nodes = getNodesByProperty( 'level', 0, this.tree );

    for ( var i = nodes.length, node; i--, node = nodes[ i ]; ) {
      if ( node.open ) {
        close( node, true, this.options.animationOut );
      }
    }

    // After callback.
    if ( typeof this.callbacks.afterCloseAll === 'function' ) {
      this.callbacks.afterCloseAll();
    }

    // Dispatch event.
    this.emit( 'closeAll', {
      droppy: this
    } );
  };

  /**
   * Open all drop-down in a Droppy menu.
   */
  Droppy.prototype.openAll = function () {

    // If no node is closed, return.
    var closedNode = getNodeByProperty( 'open', false, this.tree );

    if ( !closedNode ) {
      return;
    }

    // Before callback.
    if ( typeof this.callbacks.beforeOpenAll === 'function' ) {
      this.callbacks.beforeOpenAll();
    }

    // Open the drop-downs.
    var nodes = getNodesByProperty( 'level', 0, this.tree );

    for ( var i = nodes.length, node; i--, node = nodes[ i ]; ) {
      if ( !node.open ) {
        open( node, true, this.options.animationIn );

        continue;
      }

      /*
       If node is open, check the descendants. If a descendant is not open,
       open it.
       */
      for ( var j = 0, l = node.descendantNodes.length, descendant;
            j < l, descendant = node.descendantNodes[ j ]; ++j ) {
        if ( !descendant.open ) {
          open( descendant, true, this.options.animationIn );
        }
      }
    }

    // After callback.
    if ( typeof this.callbacks.afterOpenAll === 'function' ) {
      this.callbacks.afterOpenAll();
    }

    // Dispatch event.
    this.emit( 'openAll', {
      droppy: this
    } );
  };


  // Static methods
  // ---------------------------------------------------------------------------

  /**
   * Check if the given Droppy instance was initialized.
   *
   * @param  {Droppy} droppy
   *         A Droppy instance to check.
   * @return {Boolean}
   *         True if the given Droppy instance was initialized, false otherwise.
   */
  Droppy.prototype.isInitialized = function ( droppy ) {

    for ( var i = droppyStore.length, inStore; i--, inStore = droppyStore[ i ]; ) {
      if ( droppy === inStore ) {
        return true;
      }
    }

    return false
  };

  /**
   * Return the Droppy instance used by the given element.
   *
   * @param  {Element} element
   *         The element used at Droppy creation.
   * @return {Droppy|undefined}
   *         The Droppy instance used by the given element. If none instance is
   *         found, return undefined.
   */
  Droppy.prototype.getInstance = function ( element ) {

    for ( var i = droppyStore.length, droppy; i--, droppy = droppyStore[ i ]; ) {
      if ( droppy.element === element ) {
        return droppy
      }
    }
  };


  // Private methods
  // ---------------------------------------------------------------------------

  /**
   * Take an object, loop through its properties, and if it isn't an internal
   * property, assigns it to the source object.
   *
   * @param  {Object} source
   *         An object representing the default options.
   * @param  {Object} properties
   *         An object representing the user options.
   * @return {Object} source
   *         An updated object with merged options.
   */
  function extendDefaults( source, properties ) {

    var property

    for ( property in properties ) {
      if ( source.hasOwnProperty( property ) ) {
        source[ property ] = properties[ property ]
      }
    }

    return source
  }

  /**
   * Returns the element that matches the given CSS selector in the given range
   * of elements. If it reaches the document body, interrupt.
   *
   * @param  {Node} start
   *   The starting element.
   * @param  {Node} end
   *   The ending element.
   * @param  {String} parentSelector
   *   A valid CSS selector.
   * @param  {Boolean} includeSelf
   *   A boolean indicating if include start element or not.
   *
   * @return {Node}
   *   The parent element that matches the given CSS selector.
   */
  function getParent ( start, end, parentSelector, includeSelf ) {

    // If includeSelf is false, get the start's parent element.
    if ( !includeSelf ) {
      start = start.parentNode
    }
    // Loop over start elements's parents until it matches the parent selector.
    // If it reaches the document body, interrupt.
    while ( start !== end && start !== document.body ) {
      /** @type start {Element} */
      if ( start.matches( parentSelector ) ) {
        return start
      }
      // Get the parent element.
      start = start.parentNode
    }
  }

  /**
   * Returns an array of elements that matches the given CSS selector in the
   * given range of elements. If it reaches the document body, interrupt.
   *
   * @param  {Node} start
   *   The starting element.
   * @param  {Node} end
   *   The ending element.
   * @param  {String} parentSelector
   *   A valid CSS selector.
   * @param  {Boolean} includeSelf
   *   A boolean indicating if include start element or not.
   *
   * @return {Array}
   *         An array of elements that matches the given CSS selector.
   */
  function getParents ( start, end, parentSelector, includeSelf ) {

    // If includeSelf is false, get the start's parent element.
    if ( !includeSelf ) {
      start = start.parentNode
    }

    var parents = []

    // Loop over start elements's parents until it matches the parent selector.
    // If it reaches the document body, interrupt.
    while ( start !== end && start !== document.body ) {
      if ( start.matches( parentSelector ) ) {
        parents.push( start )
      }
      // Get the parent element.
      start = start.parentNode
    }

    return parents
  }

  /**
   * Build a tree of drop-downs, triggers and parents.
   *
   * @param  {Element} element
   *         The element on which Droppy will act.
   * @param  {String} dropdownSelector
   *         A valid CSS selector.
   * @param  {String} parentSelector
   *         A valid CSS selector.
   * @param  {String} triggerSelector
   *         A valid CSS selector.
   * @return {Array}
   *         The tree.
   */
  function generateTree ( element, dropdownSelector, parentSelector, triggerSelector ) {

    // Get all drop-downs.
    var dropdowns = Array.prototype.slice.call( element.querySelectorAll( dropdownSelector ) ),
        tree = []

    // For each drop-down, build a DroppyNode.
    for ( var i = 0, l = dropdowns.length, dropdown; i < l, dropdown = dropdowns[ i ]; i++ ) {

      var node = new DroppyNode()

      node.dropdown = dropdown
      node.parent = getParent( dropdown, element, parentSelector, false )
      node.trigger = node.parent.querySelector( triggerSelector )

      var parentsDropdowns = getParents( dropdown, element, dropdownSelector, false ),
          parentNode

      for ( var j = parentsDropdowns.length, parentDropdown; j--, parentDropdown = parentsDropdowns[ j ]; ) {
        parentNode = getNodeByProperty( 'dropdown', parentDropdown, tree )
        node.parentNodes.push( parentNode )
        parentNode.descendantNodes.push( node )
      }

      node.level = node.parentNodes.length;
      tree.push( node )
    }

    return tree
  }

  /**
   * Return the node corresponding to the given property and value in the given
   * tree.
   *
   * @param  {String} property
   *         The property of a node.
   * @param  {*} value
   *         The value of the given property.
   * @param  {Array} tree
   *         The tree on which search for the node.
   * @return {DroppyNode}
   *         The node corresponding to the given property and value.
   */
  function getNodeByProperty ( property, value, tree ) {

    for ( var i = tree.length, node; i--, node = tree[ i ]; ) {
      if ( node[ property ] === value ) {
        return node
      }
    }
  }

  /**
   * Return an array of nodes corresponding to the given property and value in
   * the given tree.
   *
   * @param  {String} property
   *         The property of a node.
   * @param  {*} value
   *         The value of the given property.
   * @param  {Array} tree
   *         The tree on which search for the node.
   * @return {Array}
   *         An array of nodes corresponding to the given property and value.
   */
  function getNodesByProperty ( property, value, tree ) {

    var nodes = []

    for ( var i = tree.length, node; i--, node = tree[ i ]; ) {
      if ( node[ property ] === value ) {
        nodes.push( node )
      }
    }

    return nodes
  }

  /**
   * Check if browser support animation.
   *
   * @return {Boolean}
   *         Return true if the browser support CSS animation, false otherwise.
   */
  function detectAnimationSupport () {

    var support = false,
        element = document.createElement( 'div' ),
        domPrefixes = 'Webkit'

    if ( element.style.animationName !== undefined ) {
      support = true
    }

    if ( !support ) {
      if ( element.style[ domPrefixes + 'AnimationName' ] !== undefined ) {
        support = true
      }
    }

    return support
  }

  /**
   * Check if the open should be animated, set withDescendants and then call
   * open.
   *
   * @param {DroppyNode} node
   *        The element to which adds the CSS class .droppy__drop--active.
   * @param {Boolean} withDescendants
   *        True if add the CSS class to the descendants drop-down.
   * @param {String} animation
   *        A CSS class where is declared an animation.
   */
  function open ( node, withDescendants, animation ) {

    // If withDescendants is not set, set it to default.
    if ( typeof withDescendants !== 'boolean' ) {
      withDescendants = false
    }

    var root = node,
        openIt = [ node ]

    // Check if parents are open.
    for ( var i = node.parentNodes.length, parent; i--, parent = node.parentNodes[ i ]; ) {

      if ( !parent.open ) {
        openIt.push( parent )
        root = parent
      }
    }

    // Invert order. Last dropdown to open should be the root.
    openIt = openIt.reverse()

    // If browser support animation and there is an animation, animate it and
    // call open.
    if ( animationSupport && animation ) {
      handleOpenAnimation( root, animation )
    }

    for ( i = openIt.length, node; i--, node = openIt[ i ]; ) {
      setOpenAttributes( node, withDescendants )
    }
  }

  /**
   * Check if the close should be animated, set withDescendants and then call
   * setCloseAttributes().
   *
   * @param {DroppyNode} node
   *        The element to which adds the CSS class .droppy__drop--active.
   * @param {Boolean} withDescendants
   *        True if remove the CSS class to the descendants drop-down.
   * @param {String} animation
   *        A CSS class where is declared an animation.
   */
  function close ( node, withDescendants, animation ) {

    // If withDescendants is not set, set it to default.
    if ( typeof withDescendants !== 'boolean' ) {
      withDescendants = true
    }

    /*
     If browser support animation and there is an animation, animate it.
     Otherwise call close. As opposed to open, the close should be called in
     the animation end.
     */
    if ( animationSupport && animation ) {
      handleCloseAnimation( node,withDescendants, animation )
    }
    else {
      setCloseAttributes( node, withDescendants )
    }
  }

  /**
   * Add animation CSS class and removes it when animation ends.
   *
   * @param {DroppyNode} node
   *        The node to animate.
   * @param {String} animation
   *        The animation CSS class.
   */
  function handleOpenAnimation ( node, animation ) {

    node.dropdown.addEventListener( 'animationend', function handler () {

      // At animation end, remove animation class.
      node.dropdown.classList.remove( animation )
      node.dropdown.removeEventListener( 'animationend', handler )
    } );

    node.dropdown.classList.add( animation )
  }

  /**
   * Add animation CSS class and removes it when animation ends. Then call
   * setCloseAttributes().
   *
   * @param {DroppyNode} node
   *        The node to animate.
   * @param {Boolean} withDescendants
   *        Close all drop-downs descendants of the current drop-down.
   * @param {String} animation
   *        The animation CSS class.
   */
  function handleCloseAnimation ( node, withDescendants, animation ) {

    node.dropdown.addEventListener( 'animationend', function handler () {

      // In animation end, remove animation class and set close attributes.
      node.dropdown.classList.remove( animation )
      setCloseAttributes( node, withDescendants )

      node.dropdown.removeEventListener( 'animationend', handler )
    } );

    node.dropdown.classList.add( animation )
  }

  /**
   * Set open attributes on the given DroppyNode. Attributes are
   * .droppy__drop--active on drop-down, and aria-expanded on trigger.
   *
   * @param {DroppyNode} node
   *        The element to which adds the CSS class .droppy__drop--active.
   * @param {Boolean} withDescendants
   *        True if add the CSS class to the descendants drop-down.
   */
  function setOpenAttributes ( node, withDescendants ) {

    if ( withDescendants ) {

      for ( var i = node.descendantNodes.length, descendant; i--, descendant = node.descendantNodes[ i ]; ) {

        if ( descendant.open ) {
          continue
        }

        descendant.dropdown.classList.add( 'droppy__drop--active' )
        descendant.trigger.setAttribute( 'aria-expanded', 'true' )
        descendant.open = true
      }
    }

    node.dropdown.classList.add( 'droppy__drop--active' )
    node.trigger.setAttribute( 'aria-expanded', 'true' )
    node.open = true
  }

  /**
   * Set close attributes on the given DroppyNode. Attributes are
   * .droppy__drop--active on drop-down, and aria-expanded on trigger.
   *
   * @param {DroppyNode} node
   *        The drop-down to close.
   * @param {Boolean} withDescendants
   *        Close all drop-downs descendants of the current drop-down.
   */
  function setCloseAttributes ( node, withDescendants ) {

    node.dropdown.classList.remove( 'droppy__drop--active' )
    node.trigger.setAttribute( 'aria-expanded', 'false' )
    node.open = false

    if ( withDescendants ) {

      for ( var i = node.descendantNodes.length, descendant; i--, descendant = node.descendantNodes[ i ]; ) {

        if ( !descendant.open ) {
          continue
        }

        descendant.dropdown.classList.remove( 'droppy__drop--active' )
        descendant.trigger.setAttribute( 'aria-expanded', 'false' )
        descendant.open = false
      }
    }
  }


  // Event handler
  // ---------------------------------------------------------------------------

  /**
   * Calls toggle when a trigger is clicked.
   *
   * @param {Event} event
   *   The event object.
   */
  function clickHandler ( event ) {

    var trigger, withDescendants, node;

    // For every Droppy in droppyStore...
    for ( var i = droppyStore.length, droppy; i--, droppy = droppyStore[ i ]; ) {
      // Check if I've clicked in a Droppy instance.
      if ( !droppy.element.contains( event.target ) && droppy.options.clickOutToClose ) {
        // I'm not in a Droppy instance, close this one and continue.
        droppy.closeAll();
        continue;
      }
      // I'm in a Droppy instance, get the trigger.
      trigger = getParent( event.target, droppy.element, '.droppy__trigger', true );
      // If I'm in a trigger, try to get the node.
      trigger ? node = getNodeByProperty( 'trigger', trigger, droppy.tree ) : node = false;
      // If node doesn't exists, I'm in a nested Droppy and the current instance
      // must be a parent. Do nothing...
      if ( !node ) {
        continue;
      }
      // I'm in trigger and node exists. Let's toggle some drop-down!
      withDescendants = event.shiftKey ? true : undefined;
      droppy.toggle( node, withDescendants );
      // If user wants it, prevent default behaviour.
      if ( droppy.options.preventDefault && !event.ctrlKey ) {
        event.preventDefault();
      }
    }
  }

  /**
   * Close drop-downs when click ESC.
   *
   * @param {Event} event
   *        The event object.
   */
  function escHandler ( event ) {

    // Check if I've clicked ESC.
    if ( event.which === 27 ) {
      for ( var i = droppyStore.length, droppy; i--, droppy = droppyStore[ i ]; ) {
        // If clickEscToClose is true, close all drop-downs.
        if ( droppy.options.clickEscToClose ) {
          droppy.closeAll();
        }
      }
    }
  }


  // Expose & Init
  // ---------------------------------------------------------------------------

  // Init via HTML.
  var elements = document.querySelectorAll( '[data-droppy]' );

  for ( var i = elements.length, element; i--, element = elements[ i ]; ) {
    new Droppy( element, JSON.parse( element.getAttribute( 'data-droppy' ) ) )
  }

  // Expose Droppy to the global object.
  return Droppy;

} ) );
