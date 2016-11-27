
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
    clickOutToClose: true,
    animationIn: 'fadeIn',
    animationOut: 'fadeOut'
  } );

  console.log( Droppy.prototype.getStore() );

} () );
