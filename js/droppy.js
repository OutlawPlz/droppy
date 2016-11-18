/*!
 * Droppy - v1.0.3
 * Pure JavaScript multi-level dropdown menu.
 */

/*
TODO - [x] Screen reader.
TODO - [ ] Implements animations.
TODO - [ ] Implements UMD.
TODO - [x] Improve docs.
TODO - [ ] Init via jQuery.
TODO - [ ] ? Init open or close.
TODO - [x] Click-out to close.
TODO - [ ] Click-out to close as option.
TODO - [ ] Add one click-out event for all Droppy instances.
TODO - [ ] ? Grow direction.
TODO - [x] Implements openAll().
TODO - [ ] Change options.
TODO - [ ] Implements destroy().
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
   * @return {Object|undefined}
   *         A new Droppy object.
   */
  function Droppy( element, options )  {

    if ( element.nodeType !== Node.ELEMENT_NODE ) {
      if ( console ) {
        console.error( 'Droppy: the given element is not valid.', element );
      }
      return;
    }

    this.element = element;

    // Default options
    var defaults = {
      dropdownSelector: 'li > ul',
      triggerSelector: 'a',
      closeOthers: true
    };

    if ( arguments[ 1 ] && typeof arguments[ 1 ] === 'object' ) {
      this.options = extendDefaults( defaults, arguments[ 1 ] );
    }
    else {
      this.options = defaults;
    }

    var dropdowns = this.element.querySelectorAll( this.options.dropdownSelector ).length;

    if ( !dropdowns ) {
      if ( console ) {
        console.error( 'Droppy: the given dropdownSelector returns no value.', this.options.dropdownSelector );
      }
      return;
    }

    // Init Droppy.
    this.init();

    // Add events.
    handleClick( this );
    handleClickOut( this );

    // Add the current object to the store.
    droppyStore.push( this );
  }


  // Public methods
  // ---------------------------------------------------------------------------

  /**
   * Initialize a Droppy object. This function is called when a new Droppy
   * object is created.
   *
   * Adds classes 'droppy__parent', 'droppy__trigger' and 'droppy__drop'. The
   * 'droppy__parent' element must be the direct parent of
   * options.dropdownSelector. Then inside the parent it gets the first child
   * options.triggerSelector and adds 'droppy__trigger' class to it. Finally
   * adds 'droppy_drop' class to options.dropdownSelector.
   */
  Droppy.prototype.init = function() {
    // Add Droppy class.
    this.element.classList.add( 'droppy' );

    var dropdowns = this.element.querySelectorAll( this.options.dropdownSelector ),
        drp_index = dropdowns.length,
        parent;

    while ( drp_index-- ) {
      parent = dropdowns[ drp_index ].parentNode;
      parent.classList.add( 'droppy__parent' );
      parent.querySelector( this.options.triggerSelector ).classList.add( 'droppy__trigger' );
      dropdowns[ drp_index ].classList.add( 'droppy__drop' );
    }
  };

  /**
   * Open the given dropdown.
   *
   * @param  {Element} dropdown
   *         The dropdown element to open.
   */
  Droppy.prototype.open = function( dropdown ) {
    if ( this.options.closeOthers ) {
      var items_close = getItemsToClose( dropdown, this.element ),
          itm_index = items_close.length;

      while ( itm_index-- ) {
        items_close[ itm_index ].classList.remove( 'droppy__drop--active' );
      }
    }

    dropdown.classList.add( 'droppy__drop--active' );
  };

  /**
   * Close the given dropdown.
   *
   * @param  {Element} dropdown
   *         The dropdown element to close.
   */
  Droppy.prototype.close = function( dropdown ) {
    var children = dropdown.querySelectorAll( '.droppy__drop--active' ),
        chl_index = children.length;

    while ( chl_index-- ) {
      children[ chl_index ].classList.remove( 'droppy__drop--active' );
    }

    dropdown.classList.remove( 'droppy__drop--active' );
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
    var items_close = this.element.querySelectorAll( '.droppy__drop--active' ),
        itm_index = items_close.length;

    while ( itm_index-- ) {
      items_close[ itm_index ].classList.remove( 'droppy__drop--active' );
    }
  };


  /**
   * Open all dropdown in a Droppy menu.
   */
  Droppy.prototype.openAll = function() {
    var items_open = this.element.querySelectorAll( '.droppy__drop' ),
        itm_index = items_open.length;

    while ( itm_index-- ) {
      items_open[ itm_index ].classList.add( 'droppy__drop--active' );
    }
  };


  // Static methods
  // ---------------------------------------------------------------------------

  /**
   * Return an array containing all Droppy's instances.
   *
   * @return {Array}
   *          An array containing all Droppy's instances.
   */
  Droppy.prototype.getStore = function() {
    return droppyStore;
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
    var active_items = [];

    while ( start !== end ) {
      if ( start.classList.contains( 'droppy__drop--active' ) ) {
        active_items.push( start );
      }

      start = start.parentNode;
    }

    return active_items;
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
    var parents_active = getActiveParents( start, end ),
        items_active = [].slice.call( end.querySelectorAll( '.droppy__drop--active' ) );

    return items_active.filter( function( item ) {
      return this.every( function( parent ) {
        return item !== parent;
      } );
    }, parents_active );
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


  // Events
  // ---------------------------------------------------------------------------

  /**
   * Attach an event listener to the Droppy object. When user click on a trigger
   * element, the relative dropdown will open or close.
   *
   * @param  {Object} droppy
   *         The Droppy object on which attach the event listener.
   */
  function handleClick( droppy ) {
    droppy.element.addEventListener( 'click', function( event ) {
      var drop = getItemToOpen( event.target, droppy.element );

      if ( drop ) {
        event.preventDefault();
        droppy.toggle( drop );
      }
    }, true );
  }

  /**
   * Attach an event listener to the body. When user click outside the menu, all
   * dropdown will close.
   *
   * @param {Droppy} droppy
   *        The Droppy object that will close dropdowns.
   */
  function handleClickOut( droppy ) {
    document.body.addEventListener( 'click', function ( event ) {
      var element = event.target,
          currentTarget = event.currentTarget;

      while ( !( element === currentTarget ) ) {
        if ( element === droppy.element ) {
          return false;
        }

        element = element.parentNode;
      }

      droppy.closeAll();
    } )
  }

  // Expose Droppy to the global object.
  window.Droppy = Droppy;

  // Init via HTML.
  var elements = document.querySelectorAll( '[data-droppy]' );

  for ( var e = 0; e < elements.length; ++e ) {
    new Droppy( elements[ e ], JSON.parse( elements[ e ].getAttribute( 'data-droppy' ) ) );
  }

} () );
