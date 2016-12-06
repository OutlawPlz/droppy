/*
 * Droppy - Pure JavaScript multi-level dropdown menu.
 *
 * TODO - [ ] Implements UMD.
 * TODO - [ ] Init via jQuery.
 * TODO - [ ] Bower.
 * TODO - [ ] Accessibility.
 * TODO - [x] Callbacks.
 */

( function() {

  'use strict';

  var console = window.console,
      droppyStore = [],
      animationSupport = detectAnimationSupport();


  // Constructor
  // ---------------------------------------------------------------------------

  /**
   * Instantiate a new Droppy object.
   *
   * @param  {Element} element
   *         The element on which Droppy will act.
   * @param  {Object} options
   *         An object containing Droppy options.
   * @param {Object} callbacks
   *        An object containing callback functions.
   *
   * @return {Droppy|undefined}
   *         A new Droppy object.
   */
  function Droppy( element, options, callbacks )  {

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
    var defaultOptions = {
      parentSelector: 'li',
      dropdownSelector: 'li > ul',
      triggerSelector: 'a',
      closeOthers: true,
      clickOutToClose: true,
      clickEscToClose: true,
      animationIn: '',
      animationOut: ''
    };

    // Init options.
    if ( arguments[ 1 ] && typeof arguments[ 1 ] === 'object' ) {
      this.options = extendDefaults( defaultOptions, arguments[ 1 ] );
    }
    else {
      this.options = defaultOptions;
    }

    // Callbacks
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
    if ( arguments[ 2 ] && typeof arguments[ 2 ] === 'object' ) {
      this.callbacks = extendDefaults( defaultCallbacks, arguments[ 2 ] );
    }
    else {
      this.callbacks = defaultCallbacks;
    }

    // Define handlers.
    this.handler = {
      clickTrigger: clickHandler.bind( this ),
      clickOut: clickOutHandler,
      esc: escHandler
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

    if ( typeof this.callbacks.beforeInit === 'function' ) {
      this.callbacks.beforeInit();
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

    if ( droppyStore.length === 0 ) {
      document.body.addEventListener( 'click', this.handler.clickOut );
      document.body.addEventListener( 'keyup', this.handler.esc );
    }

    // Add instance to the store.
    droppyStore.push( this );

    if ( typeof this.callbacks.afterInit === 'function' ) {
      this.callbacks.afterInit();
    }
  };

  /**
   * Reset a Droppy instance to a pre-init state. It remove Droppy CSS classes,
   * events and the instance from the store.
   */
  Droppy.prototype.destroy = function() {

    if ( !Droppy.prototype.isInitialized( this ) ) {
      return;
    }

    if ( typeof this.callbacks.beforeDestroy === 'function' ) {
      this.callbacks.beforeDestroy();
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

    if ( droppyStore.length === 1 ) {
      document.body.removeEventListener( 'click', this.handler.clickOut );
      document.body.removeEventListener( 'keyup', this.handler.esc );
    }

    delete this.handler;

    // Remove instance from the store.
    i = droppyStore.length;

    while ( i-- ) {
      if ( droppyStore[ i ] === this ) {
        droppyStore.splice( i, 1);
      }
    }

    if ( typeof this.callbacks.afterDestroy === 'function' ) {
      this.callbacks.afterDestroy();
    }
  };

  /**
   * Open the given dropdown.
   *
   * @param  {Element} dropdown
   *         The drop-down element to open.
   * @param  {Boolean} [withDescendants=false]
   *         Should open or not all the drop-downs in the given drop-down.
   */
  Droppy.prototype.open = function( dropdown, withDescendants ) {

    if ( typeof this.callbacks.beforeOpen === 'function' ) {
      this.callbacks.beforeOpen();
    }

    if ( typeof withDescendants !== 'boolean' ) {
      withDescendants = false;
    }

    if ( this.options.closeOthers ) {
      var closing = getOthersToClose( dropdown, this.element ),
        i = closing.length;

      while ( i-- ) {
        close( closing[ i ], true, this.options.animationOut );
      }
    }

    open( dropdown, withDescendants, this.options.animationIn );

    if ( typeof this.callbacks.afterOpen === 'function' ) {
      this.callbacks.afterOpen();
    }
  };

  /**
   * Close the given dropdown.
   *
   * @param  {Element} dropdown
   *         The dropdown element to close.
   * @param  {Boolean} [withDescendants=true]
   *         Should close or not all the drop-downs in the given drop-down.
   */
  Droppy.prototype.close = function( dropdown, withDescendants ) {

    if ( typeof this.callbacks.beforeClose === 'function' ) {
      this.callbacks.beforeClose();
    }

    if ( typeof withDescendants !== 'boolean' ) {
      withDescendants = true;
    }

    close( dropdown, withDescendants, this.options.animationOut );

    if ( typeof this.callbacks.afterClose === 'function' ) {
      this.callbacks.afterClose();
    }
  };

  /**
   * Open or close the given dropdown.
   *
   * @param  {Element} dropdown
   *         The dropdown element to open or close.
   * @param  {Boolean|undefined} withDescendants
   *         Should open/close or not all the drop-downs in the given drop-down.
   */
  Droppy.prototype.toggle = function( dropdown, withDescendants ) {
    if ( dropdown.classList.contains( 'droppy__drop--active' ) ) {
      this.close( dropdown, withDescendants );
    }
    else if ( dropdown.classList.contains( 'droppy__drop' ) ) {
      this.open( dropdown, withDescendants );
    }
  };

  /**
   * Close all dropdown in a Droppy menu.
   */
  Droppy.prototype.closeAll = function() {

    if ( typeof this.callbacks.beforeCloseAll === 'function' ) {
      this.callbacks.beforeCloseAll();
    }

    var dropdowns = getFirstLevelDropdown( this.element, '.droppy__drop--active' ),
        i = dropdowns.length;

    while ( i-- ) {
      close( dropdowns[ i ], true, this.options.animationOut );
    }

    if ( typeof this.callbacks.afterCloseAll === 'function' ) {
      this.callbacks.afterCloseAll();
    }
  };


  /**
   * Open all dropdown in a Droppy menu.
   */
  Droppy.prototype.openAll = function() {

    if ( typeof this.callbacks.beforeOpenAll === 'function' ) {
      this.callbacks.beforeOpenAll();
    }

    var dropdowns = getFirstLevelDropdown( this.element, '.droppy__drop' ),
        i = dropdowns.length;

    while ( i-- ) {
      open( dropdowns[ i ], true, this.options.animationIn );
    }

    if ( typeof this.callbacks.afterOpenAll === 'function' ) {
      this.callbacks.afterOpenAll();
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
   * the given parentSelector, until reach the end element.
   *
   * @param  {Element} start
   *         The starting node.
   * @param  {Element} end
   *         The ending node.
   * @param  {string} parentSelector
   *         A valid CSS selector.
   *
   * @return {Element|undefined}
   *         The first parent element that matches the given selector.
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
   * Loop over the start element parents looking for the element that matches
   * the given selector, until reach the end element.
   *
   * @param  {Element} start
   *         The starting element.
   * @param  {Element} end
   *         The ending element.
   * @param  {string} parentSelector
   *         A valid CSS selector.
   *
   * @return {Array}
   *         An array containing active elements, parents of the start element.
   */
  function getParents( start, end, parentSelector ) {
    var itemsActive = [];

    while ( start !== end ) {
      if ( start.matches( parentSelector ) ) {
        itemsActive.push( start );
      }

      start = start.parentNode;
    }

    return itemsActive;
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
  function getOthersToClose( start, end ) {
    var parentsActive = getParents( start, end, '.droppy__drop--active' ),
        othersActive = getFirstLevelDropdown( end, '.droppy__drop--active' );

    return othersActive.filter( function( item ) {
      return this.every( function( parent ) {
        return item !== parent;
      } );
    }, parentsActive );
  }

  /**
   * Loop over start element's parents looking for the droppy__parent class,
   * then return the drop element.
   *
   * @param  {Element} start
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

  /**
   * Returns the first level elments children of the given element, that matches
   * the given selector.
   *
   * @param  {Element} element
   *         A parent element.
   * @param  {string} selector
   *         A valid CSS selector.
   *
   * @return {Array|undefined}
   *         An array containing the first level of elements that matchets the
   *         given selector.
   */
  function getFirstLevelDropdown( element, selector ) {
    var items = Array.prototype.slice.call( element.querySelectorAll( selector ) ),
        children = Array.prototype.slice.call( element.querySelectorAll( selector + ' ' + selector ) );

    return items.filter( function ( item ) {
      return this.indexOf( item ) === -1;
    }, children );
  }

  /**
   * Check if browser support animation.
   *
   * @return {boolean}
   *         Return true if the browser support CSS animation, false otherwise.
   */
  function detectAnimationSupport() {
    var support = false,
        element = document.createElement( 'div' ),
        domPrefixes = 'Webkit';

    if ( element.style.animationName !== undefined ) {
      support = true;
    }

    if ( !support ) {
      if ( element.style[ domPrefixes + 'AnimationName' ] !== undefined ) {
        support = true;
      }
    }

    return support;
  }

  /**
   * Add the CSS class .droppy__drop--active to the given element and relative
   * drop-downs descendants.
   *
   * @param {Element} element
   *        The element to which adds the CSS class .droppy__drop--active.
   * @param {Boolean} withDescendants
   *        True if add the CSS class to the descendants drop-down.
   * @param {string} animation
   *        A CSS class where is declared an animation.
   */
  function open( element, withDescendants, animation ) {

    if ( animationSupport && animation ) {
      element.addEventListener( 'animationend', function () {
        element.classList.remove( animation );
      }, { once: true } );

      element.classList.add( animation );
    }

    if ( withDescendants ) {
      var items = element.querySelectorAll( '.droppy__drop' ),
          i = items.length;

      while ( i-- ) {
        items[ i ].classList.add( 'droppy__drop--active' );
      }
    }

    element.classList.add( 'droppy__drop--active' );
  }

  /**
   * Remove the CSS class .droppy__drop--active to the given element and
   * relative drop-downs descendants.
   *
   * @param {Element} element
   *        The element to which adds the CSS class .droppy__drop--active.
   * @param {Boolean} withDescendants
   *        True if remove the CSS class to the descendants drop-down.
   * @param {string} animation
   *        A CSS class where is declared an animation.
   */
  function close( element, withDescendants, animation ) {

    if ( animationSupport && animation ) {
      element.addEventListener( 'animationend', function () {
        element.classList.remove( 'droppy__drop--active', animation );

        if ( withDescendants ) {
          var items = element.querySelectorAll( '.droppy__drop--active' ),
            i = items.length;

          while ( i-- ) {
            items[ i ].classList.remove( 'droppy__drop--active' );
          }
        }
      }, { once: true } );

      element.classList.add( animation );
    }
    else {
      element.classList.remove( 'droppy__drop--active' );

      if ( withDescendants ) {
        var items = element.querySelectorAll( '.droppy__drop--active' ),
          i = items.length;

        while ( i-- ) {
          items[ i ].classList.remove( 'droppy__drop--active' );
        }
      }
    }
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
    var closing = droppyStore.filter( function ( droppy ) {

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

      return true;
    } );

    var i = closing.length;

    while ( i-- ) {
      closing[ i ].closeAll();
    }
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
