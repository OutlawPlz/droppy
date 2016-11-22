
( function() {

  'use strict';

  // Init Droppy
  // ---------------------------------------------------------------------------

  var element = document.querySelector( 'ul.menu' );

  var droppy = new Droppy( element, {
    parentSelector: 'li',
    dropdownSelector: 'li > ul.menu',
    triggerSelector: 'a',
    closeOthers: true,
    clickOutToClose: true
  } );

  console.log( Droppy.prototype.getStore() );

} () );
