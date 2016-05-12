( function() {

  'use strict';

  var console = window.console;

  // Constructor
  // ---------------------------------------------------------------------------

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
      close_others: true
    };

    if ( arguments[ 1 ] && typeof arguments === 'object' ) {
      this.options = extendDefaults( defaults, arguments[ 1 ] );
    }

    var dropdowns = document.querySelectorAll( this.options.dropdown_selector ).length;

    if ( !dropdowns ) {
      if ( console ) {
        console.error( 'Droppy: the given dropdown_selector returns no value.', this.options.dropdown_selector );
      }
      return;
    }

    this.init();
  };


  // Public methods
  // ---------------------------------------------------------------------------

  Droppy.prototype.init = function() {
    this.element.classList.add( 'droppy' );

    var dropdowns = this.element.querySelectorAll( this.options.dropdown_selector ),
        drp_index = dropdowns.length;

    while ( drp_index-- ) {
      dropdowns[ drp_index ].parentElement.classList.add( 'droppy__parent' );
      dropdowns[ drp_index ].previousElementSibling.classList.add( 'droppy__trigger' );
      dropdowns[ drp_index ].classList.add( 'droppy__drop' );
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


  // Events
  // ---------------------------------------------------------------------------


} () );
