
( function() {

  'use strict';

  // Init Droppy
  // ---------------------------------------------------------------------------

  var element = document.querySelector( 'ul.menu' );

  var droppy = new Droppy( element, {
    dropdownSelector: 'li > ul.menu',
    triggerSelector: 'a',
    closeOthers: true,
    clickOutToClose: true
  } );

  console.log( Droppy.prototype.getStore() );

} () );
