( function() {

  'use strict';

  var console = window.console;


  // Constructor
  // ---------------------------------------------------------------------------

  /**
   * Instantiate a new Droppy object.
   *
   * @param  {Node} element
   *         The element on which Droppy will act.
   * @param  {Object} options
   *         An object containig Droppy options.
   * @return {Object}
   *         A new Droppy object.
   */
  window.Droppy = function( element, options )  {

    if ( element.nodeType != Node.ELEMENT_NODE ) {
      if ( console ) {
        console.error( 'Droppy: the given element is not valid.', element );
      }
      return;
    }

    this.element = element;

    // Default options
    var defaults = {
      dropdown_selector: 'li > ul',
      trigger_selector: 'a',
      close_others: true
    };

    if ( arguments[ 1 ] && typeof arguments[ 1 ] === 'object' ) {
      this.options = extendDefaults( defaults, arguments[ 1 ] );
    }

    var dropdowns = this.element.querySelectorAll( this.options.dropdown_selector ).length;

    if ( !dropdowns ) {
      if ( console ) {
        console.error( 'Droppy: the given dropdown_selector returns no value.', this.options.dropdown_selector );
      }
      return;
    }

    this.init();

    handleClick( this );
  };


  // Public methods
  // ---------------------------------------------------------------------------

  /**
   * Initialize a Droppy object. This function is called when a new Droppy
   * object is created.
   *
   * Adds classes 'droppy__parent', 'droppy__trigger' and 'droppy__drop'. The
   * 'droppy__parent' element must be the direct parent of
   * options.dropdown_selector. Then inside the parent it gets the first child
   * options.trigger_selector and adds 'droppy__trigger' class to it. Finally
   * adds 'droppy_drop' class to options.dropdown_selector.
   */
  Droppy.prototype.init = function() {
    // Add Droppy class.
    this.element.classList.add( 'droppy' );

    var dropdowns = this.element.querySelectorAll( this.options.dropdown_selector ),
        drp_index = dropdowns.length,
        parent;

    while ( drp_index-- ) {
      parent = dropdowns[ drp_index ].parentElement;
      parent.classList.add( 'droppy__parent' );
      parent.querySelector( this.options.trigger_selector ).classList.add( 'droppy__trigger' );
      dropdowns[ drp_index ].classList.add( 'droppy__drop' );
    }
  };

  /**
   * Open the given dropdown.
   *
   * @param  {Node} dropdown
   *         The dropdown element to open.
   */
  Droppy.prototype.open = function( dropdown ) {
    if ( this.options.close_others ) {
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
   * @param  {Node} dropdown
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
   * @param  {Node} dropdown
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


  // Private methods
  // ---------------------------------------------------------------------------

  /**
   * Take an object, loop through its properties, and if it isn't an internal
   * property, assigns it to the source object.
   *
   * @param  {Object} source
   *         An object representing the default options.
   * @param  {object} properties
   *         An object representing the user options.
   * @return {object}
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
   * @param  {Node} end
   *         The ending element.
   * @return {Array}
   *         An array containing active elements, paretns of the start element.
   */
  function getActiveParents( start, end ) {
    var active_items = [];

    while ( start != end ) {
      if ( start.classList.contains( 'droppy__drop--active' ) ) {
        active_items.push( start );
      }

      start = start.parentElement;
    }

    return active_items;
  }

  /**
   * In the given range of elements, looks for active elements that aren't
   * parents of the starting element.
   *
   * @param  {Node} start
   *         The starting node.
   * @param  {Node} end
   *         The eding node.
   * @return {Array}
   *         An array of active elements that aren't parents of the starting
   *         element.
   */
  function getItemsToClose( start, end ) {
    var parents_active = getActiveParents( start, end ),
        items_active = [].slice.call( end.querySelectorAll( '.droppy__drop--active' ) );

    var items_close = items_active.filter( function( item ) {
      return this.every( function( parent ) {
        return item != parent;
      } );
    }, parents_active );

    return items_close;
  }

  /**
   * Loop over start element's parents looking for the droppy__parent class,
   * then return the drop element.
   *
   * @param  {Node} start
   *         The starting node.
   * @param  {Node} end
   *         The ending node.
   * @return {Node|Boolean}
   *         The element to drop or false.
   */
  function getItemToOpen( start, end ) {

    while ( start != end ) {
      if ( start.classList.contains( 'droppy__trigger' ) ) {
        return start.parentElement.querySelector( '.droppy__drop' );
      }

      start = start.parentElement;
    }

    return false;
  }


  // Events
  // ---------------------------------------------------------------------------

  /**
   * Attach an event listener to the Droppy object. When user click on a trigegr
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

} () );
