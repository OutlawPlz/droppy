
( function() {

  'use strict';

  // Init Droppy
  // ---------------------------------------------------------------------------

  var element = document.querySelector( 'ul.menu' );

  var droppy = new Droppy( element, {
    dropdown_selector: 'li > ul.menu',
    trigger_selector: 'a',
    close_others: true
  } );

} () );
