
( function() {

  'use strict';

  // Init Droppy
  // ---------------------------------------------------------------------------

  var element = document.querySelector( 'ul.menu' ),
      openButton = document.querySelector( 'button.open-all' ),
      closeButton = document.querySelector( 'button.close-all' );

  var droppy = new Droppy( element, {
    parentSelector: 'li',
    dropdownSelector: 'li > ul.menu',
    triggerSelector: 'a',
    animationIn: 'fade-in',
    animationOut: 'fade-out',
    // closeOthers: false,
    preventDefault: true
  } );

  openButton.addEventListener( 'click', function () {
    droppy.openAll();
  } );

  closeButton.addEventListener( 'click', function () {
    droppy.closeAll();
  } );

  console.log( droppy );
  console.log( droppy.tree );

  var testButton = document.querySelector( '.test-button' ),
      testDroprown = document.querySelector( '.test-dropdown' );

  testButton.addEventListener( 'click', function() {
    droppy.open( testDroprown );
  } )

} () );
