/**
 * Droppy - v1.0.4
 * Pure JavaScript multi-level dropdown menu.
 * By OutlawPlz, license GPL-3.0.
 * https://github.com/OutlawPlz/droppy.git
 */
// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.io/#x15.4.4.18
if (!Array.prototype.forEach) {

  Array.prototype.forEach = function(callback, thisArg) {

    var T, k;

    if (this === null) {
      throw new TypeError(' this is null or not defined');
    }

    // 1. Let O be the result of calling toObject() passing the
    // |this| value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get() internal
    // method of O with the argument "length".
    // 3. Let len be toUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If isCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== "function") {
      throw new TypeError(callback + ' is not a function');
    }

    // 5. If thisArg was supplied, let T be thisArg; else let
    // T be undefined.
    if (arguments.length > 1) {
      T = thisArg;
    }

    // 6. Let k be 0
    k = 0;

    // 7. Repeat, while k < len
    while (k < len) {

      var kValue;

      // a. Let Pk be ToString(k).
      //    This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty
      //    internal method of O with argument Pk.
      //    This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal
        // method of O with argument Pk.
        kValue = O[k];

        // ii. Call the Call internal method of callback with T as
        // the this value and argument list containing kValue, k, and O.
        callback.call(T, kValue, k, O);
      }
      // d. Increase k by 1.
      k++;
    }
    // 8. return undefined
  };
}

// Production steps of ECMA-262, Edition 5, 15.4.4.19
// Reference: http://es5.github.io/#x15.4.4.19
if (!Array.prototype.map) {

  Array.prototype.map = function(callback, thisArg) {

    var T, A, k;

    if (this == null) {
      throw new TypeError(' this is null or not defined');
    }

    // 1. Let O be the result of calling ToObject passing the |this|
    //    value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get internal
    //    method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If IsCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }

    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if (arguments.length > 1) {
      T = thisArg;
    }

    // 6. Let A be a new array created as if by the expression new Array(len)
    //    where Array is the standard built-in constructor with that name and
    //    len is the value of len.
    A = new Array(len);

    // 7. Let k be 0
    k = 0;

    // 8. Repeat, while k < len
    while (k < len) {

      var kValue, mappedValue;

      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal
      //    method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal
        //    method of O with argument Pk.
        kValue = O[k];

        // ii. Let mappedValue be the result of calling the Call internal
        //     method of callback with T as the this value and argument
        //     list containing kValue, k, and O.
        mappedValue = callback.call(T, kValue, k, O);

        // iii. Call the DefineOwnProperty internal method of A with arguments
        // Pk, Property Descriptor
        // { Value: mappedValue,
        //   Writable: true,
        //   Enumerable: true,
        //   Configurable: true },
        // and false.

        // In browsers that support Object.defineProperty, use the following:
        // Object.defineProperty(A, k, {
        //   value: mappedValue,
        //   writable: true,
        //   enumerable: true,
        //   configurable: true
        // });

        // For best browser support, use the following:
        A[k] = mappedValue;
      }
      // d. Increase k by 1.
      k++;
    }

    // 9. return A
    return A;
  };
}


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
/**
 * Droppy - Pure JavaScript multi-level dropdown menu.
 *
 * TODO - [x] Implements animations.
 * TODO - [ ] Implements UMD.
 * TODO - [ ] Init via jQuery.
 * TODO - [ ] ? Init open or close.
 * TODO - [x] Change options.
 * TODO - [x] Implements destroy().
 * TODO - [x] Click esc to close.
 * TODO - [x] Get instance by element.
 */

( function() {

  'use strict';

  var console = window.console,
      droppyStore = [];


  // Constructor
  // ---------------------------------------------------------------------------

  /**
   * Instantiate a new Droppy object.
   *
   * @param  {Element} element
   *         The element on which Droppy will act.
   * @param  {Object} options
   *         An object containing Droppy options.
   *
   * @return {Droppy|undefined}
   *         A new Droppy object.
   */
  function Droppy( element, options )  {

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
        console.err( 'Droppy: the given parentSelector returns no value.', options.parentSelector );
      }
      return;
    }

    // Check trigger selector.
    var trigger = this.element.querySelector( options.triggerSelector );

    if ( !trigger ) {
      if ( console ) {
        console.err( 'Droppy: the given triggerSelector returns no value.', options.triggerSelector );
      }
      return;
    }

    // Default options
    var defaults = {
      parentSelector: 'li',
      dropdownSelector: 'li > ul',
      triggerSelector: 'a',
      closeOthers: true,
      clickOutToClose: true,
      clickEscToClose: true,
      animationIn: false,
      animationOut: false
    };

    // Init options.
    if ( arguments[ 1 ] && typeof arguments[ 1 ] === 'object' ) {
      this.options = extendDefaults( defaults, arguments[ 1 ] );
    }
    else {
      this.options = defaults;
    }

    // Define handlers.
    this.handler = {
      clickTrigger: clickHandler.bind( this ),
      clickOut: clickOutHandler,
      esc: escHandler,
      animationEnd: animationEndHandler.bind( this )
    };

    // Init Droppy.
    this.init();
  }


  // Public methods
  // ---------------------------------------------------------------------------

  /**
   * Initialize a Droppy object. This function is called when a new Droppy
   * object is created. Adds classes 'droppy__parent', 'droppy__trigger' and
   * 'droppy__drop'. Adds events.
   */
  Droppy.prototype.init = function() {

    if ( Droppy.prototype.isInitialized( this ) ) {
      return;
    }

    // Add Droppy CSS classes.
    this.element.classList.add( 'droppy' );

    var dropdowns = this.element.querySelectorAll( this.options.dropdownSelector ),
        i = dropdowns.length,
        parent;

    while ( i-- ) {
      parent = getParent( dropdowns[ i ], this.element, this.options.parentSelector );
      parent.classList.add( 'droppy__parent' );
      parent.querySelector( this.options.triggerSelector ).classList.add( 'droppy__trigger' );
      dropdowns[ i ].classList.add( 'droppy__drop' );
    }

    // Add events.
    this.element.addEventListener( 'click', this.handler.clickTrigger );
    this.element.addEventListener( 'animationend', this.handler.animationEnd );

    if ( droppyStore.length === 0 ) {
      document.body.addEventListener( 'click', this.handler.clickOut );
      document.body.addEventListener( 'keyup', this.handler.esc );
    }

    // Add instance to the store.
    droppyStore.push( this );
  };

  /**
   * Reset a Droppy instance to a pre-init state. It remove Droppy CSS classes,
   * events and the instance from the store.
   */
  Droppy.prototype.destroy = function() {

    if ( !Droppy.prototype.isInitialized( this ) ) {
      return;
    }

    // Remove Droppy CSS classes.
    this.closeAll();
    this.element.classList.remove( 'droppy' );

    var dropdowns = this.element.querySelectorAll( '.droppy__drop' ),
        parents = this.element.querySelectorAll( '.droppy__parent' ),
        triggers = this.element.querySelectorAll( '.droppy__trigger' ),
        i = dropdowns.length;

    while ( i-- ) {
      dropdowns[ i ].classList.remove( 'droppy__drop' );
      parents[ i ].classList.remove( 'droppy__parent' );
      triggers[ i ].classList.remove( 'droppy__trigger' );
    }

    // Remove events.
    this.element.removeEventListener( 'click', this.handler.clickTrigger );
    this.element.removeEventListener( 'animationend', this.handler.animationEnd );

    if ( droppyStore.length === 1 ) {
      document.body.removeEventListener( 'click', this.handler.clickOut );
      document.body.removeEventListener( 'keyup', this.handler.esc );
    }

    // Remove instance from the store.
    i = droppyStore.length;

    while ( i-- ) {
      if ( droppyStore[ i ] === this ) {
        droppyStore.splice( i, 1);
      }
    }
  };

  /**
   * Open the given dropdown.
   *
   * @param  {Element} dropdown
   *         The dropdown element to open.
   */
  Droppy.prototype.open = function( dropdown ) {

    // Close others drop-downs if specified in options.
    if ( this.options.closeOthers ) {
      var itemsClose = getItemsToClose( dropdown, this.element ),
          i = itemsClose.length;

      while ( i-- ) {
        this.close( itemsClose[ i ] );
      }
    }

    // Display the drop-down.
    dropdown.classList.add( 'droppy__drop--active' );

    /*
    If specified in the options, animate the drop-down menu. At the end of the
    animation, call the function animationEndHandler() where the animation class
    is removed.
     */
    if ( this.options.animationIn ) {
      dropdown.classList.add( this.options.animationIn );
    }
  };

  /**
   * Close the given dropdown.
   *
   * @param  {Element} dropdown
   *         The dropdown element to close.
   */
  Droppy.prototype.close = function( dropdown ) {

    /*
    If specified in the options, animate the drop-down menu. At the end of the
    animation, call the function animationEndHandler() where the animation class
    and the .droppy__drop--active are removed.
     */
    if ( this.options.animationOut ) {
      dropdown.classList.add( this.options.animationOut );
    }
    else {
      dropdown.classList.remove( 'droppy__drop--active' );
    }
  };

  /**
   * Open or close the given dropdown.
   *
   * @param  {Element} dropdown
   *         The dropdown element to open or close.
   */
  Droppy.prototype.toggle = function( dropdown ) {
    if ( dropdown.classList.contains( 'droppy__drop--active' ) ) {
      this.close( dropdown );
    }
    else {
      this.open( dropdown );
    }
  };

  /**
   * Close all dropdown in a Droppy menu.
   */
  Droppy.prototype.closeAll = function() {
    var itemsClose = this.element.querySelectorAll( '.droppy__drop--active' ),
        i = itemsClose.length;

    while ( i-- ) {
      itemsClose[ i ].classList.remove( 'droppy__drop--active' );
    }
  };


  /**
   * Open all dropdown in a Droppy menu.
   */
  Droppy.prototype.openAll = function() {
    var itemsOpen = this.element.querySelectorAll( '.droppy__drop' ),
        i = itemsOpen.length;

    while ( i-- ) {
      itemsOpen[ i ].classList.add( 'droppy__drop--active' );
    }
  };


  // Static methods
  // ---------------------------------------------------------------------------

  /**
   * Check if the given Droppy instance was initialized.
   *
   * @param {Droppy} droppy
   *        A Droppy instance to check.
   *
   * @return {boolean}
   *         True if the given Droppy instance was initialized, false otherwise.
   */
  Droppy.prototype.isInitialized = function( droppy ) {
    return droppyStore.some( function( obj ) {
      return obj === droppy;
    } );
  };

  /**
   * Return an array containing all Droppy's instances.
   *
   * @return {Array}
   *         An array containing all Droppy's instances.
   */
  Droppy.prototype.getStore = function() {
    return droppyStore;
  };

  /**
   * Return the Droppy instance used by the given element.
   *
   * @param {Node} element
   *        The element used at Droppy creation.
   *
   * @return {Droppy|undefined}
   *         The Droppy instance used by the given element. If none instance is
   *         found, return undefined.
   */
  Droppy.prototype.getInstance = function ( element ) {
    var i = droppyStore.length;

    while ( i-- ) {
      if ( droppyStore[ i ].element === element ) {
        return droppyStore[ i ];
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
   *
   * @return {Object} source
   *         An updated object with merged options.
   */
  function extendDefaults( source, properties ) {
    var property;

    for ( property in properties ) {
      if ( source.hasOwnProperty( property ) ) {
        source[ property ] = properties[ property ];
      }
    }

    return source;
  }

  /**
   * Loop over the start element parents looking for the element that matches
   * the given parentSelector.
   *
   * @param {Element} start
   *        The starting node.
   * @param {Node} end
   *        The ending node.
   * @param parentSelector
   *        A valid CSS selector.
   *
   * @returns {Node|undefined}
   */
  function getParent( start, end, parentSelector ) {
    while ( start !== end ) {
      if ( start.matches( parentSelector ) ) {
        return start;
      }

      start = start.parentNode;
    }
  }

  /**
   * Loop over the start element parents looking for active elements, until
   * reach the end element.
   *
   * @param  {Node} start
   *         The starting element.
   * @param  {Element} end
   *         The ending element.
   *
   * @return {Array}
   *         An array containing active elements, parents of the start element.
   */
  function getActiveParents( start, end ) {
    var activeItems = [];

    while ( start !== end ) {
      if ( start.classList.contains( 'droppy__drop--active' ) ) {
        activeItems.push( start );
      }

      start = start.parentNode;
    }

    return activeItems;
  }

  /**
   * In the given range of elements, looks for active elements that aren't
   * parents of the starting element.
   *
   * @param  {Element} start
   *         The starting node.
   * @param  {Element} end
   *         The ending node.
   *
   * @return {Array}
   *         An array of active elements that aren't parents of the starting
   *         element.
   */
  function getItemsToClose( start, end ) {
    var parentsActive = getActiveParents( start, end ),
        itemsActive = [].slice.call( end.querySelectorAll( '.droppy__drop--active' ) );

    return itemsActive.filter( function( item ) {
      return this.every( function( parent ) {
        return item !== parent;
      } );
    }, parentsActive );
  }

  /**
   * Loop over start element's parents looking for the droppy__parent class,
   * then return the drop element.
   *
   * @param  {Node} start
   *         The starting node.
   * @param  {Element} end
   *         The ending node.
   *
   * @return {Element|Boolean}
   *         The element to drop or false.
   */
  function getItemToOpen( start, end ) {

    while ( start !== end ) {
      if ( start.classList.contains( 'droppy__trigger' ) ) {
        return start.parentNode.querySelector( '.droppy__drop' );
      }

      start = start.parentNode;
    }

    return false;
  }


  // Event handler
  // ---------------------------------------------------------------------------

  /**
   * Calls toggle when a trigger is clicked.
   *
   * @param {Event} event
   *        The event object.
   */
  function clickHandler( event ) {
    var dropdown = getItemToOpen( event.target, this.element );

    if ( dropdown ) {
      if ( event.cancelable ) {
        event.preventDefault();
      }

      this.toggle( dropdown );
    }
  }

  /**
   * Close dropdown when click outside.
   *
   * @param {Event} event
   *        The event object.
   */
  function clickOutHandler( event ) {
    /*
     For each Droppy instance in droppyStore it loops over the parents, to see
     if the click event was generated in the current menu. If true, then the
     current menu should not be closed, otherwise close it.
     */
    var toClose = droppyStore.map( function ( droppy ) {

      // If clickOutToClose is false, then the menu should not be closed.
      if ( !droppy.options.clickOutToClose ) {
        return false;
      }

      var element = event.target,
        currentTarget = event.currentTarget;

      while ( element !== currentTarget ) {
        if ( element === droppy.element ) {
          return false;
        }

        element = element.parentNode;
      }

      return droppy;
    } );

    toClose.forEach( function ( droppy ) {
      if ( droppy ) {
        droppy.closeAll();
      }
    } );
  }

  /**
   * Close dropdowns when click ESC.
   *
   * @param {Event} event
   *        The event object.
   */
  function escHandler( event ) {
    if ( event.which === 27 ) {
      droppyStore.forEach( function( droppy ) {
        if ( droppy.options.clickEscToClose ) {
          droppy.closeAll();
        }
      } );
    }
  }

  /**
   * Remove the animation CSS class. If the menu is closing, remove the
   * .droppy__drop--active and the animation CSS class.
   *
   * @param {Event} event
   *        The event object.
   */
  function animationEndHandler( event ) {

    if ( event.target.classList.contains( this.options.animationIn ) ) {
      event.target.classList.remove( this.options.animationIn );
    }
    else if ( event.target.classList.contains( this.options.animationOut ) ) {
      event.target.classList.remove( 'droppy__drop--active' );
      event.target.classList.remove( this.options.animationOut );

      // Close all the children of the current drop-down.
      var itemsClose = event.target.querySelectorAll( '.droppy__drop--active' ),
          i = itemsClose.length;

      while ( i-- ) {
        itemsClose[ i ].classList.remove( 'droppy__drop--active' );
      }
    }
  }


  // Expose & Init
  // ---------------------------------------------------------------------------

  // Expose Droppy to the global object.
  window.Droppy = Droppy;

  // Init via HTML.
  var elements = document.querySelectorAll( '[data-droppy]' );

  for ( var i = 0; i < elements.length; ++i ) {
    new Droppy( elements[ i ], JSON.parse( elements[ i ].getAttribute( 'data-droppy' ) ) );
  }

} () );
