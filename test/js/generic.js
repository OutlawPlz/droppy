
( function() {

  'use strict';

  // Init Droppy
  // ---------------------------------------------------------------------------

  var element = document.querySelector( 'ul.menu' );

  var droppy = new Droppy( element, {
    parentSelector: 'li',
    dropdownSelector: 'li > ul.menu',
    triggerSelector: 'a',
    animationIn: 'fadeIn',
    animationOut: 'fadeOut'
  } );

} () );
