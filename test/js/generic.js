
( function() {

  'use strict';

  // Init Droppy
  // ---------------------------------------------------------------------------

  var element = document.querySelector( 'ul.menu' ),
      callbacks,
      openButton = document.querySelector( 'button.open-all' ),
      closeButton = document.querySelector( 'button.close-all' );
  /*
  callbacks = {
    beforeOpen: function beforeOpen () {
      console.log( 'beforeOpen' );
    },
    afterOpen: function afterOpen () {
      console.log( 'afterOpen' );
    },
    beforeClose: function beforeClose () {
      console.log( 'beforeClose' );
    },
    afterClose: function afterClose () {
      console.log( 'afterClose' );
    },
    beforeOpenAll: function beforeOpenAll () {
      console.log( 'beforeOpenAll' );
    },
    afterOpenAll: function afterOpenAll () {
      console.log( 'afterOpenAll' );
    },
    beforeCloseAll: function beforeCloseAll () {
      console.log( 'beforeCloseAll' );
    },
    afterCloseAll: function afterCloseAll () {
      console.log( 'afterCloseAll' );
    },
    beforeInit: function beforeInit () {
      console.log( 'beforeInit' );
    },
    afterInit: function afterInit () {
      console.log( 'afterInit' );
    },
    beforeDestroy: function beforeDestroy () {
      console.log( 'beforeDestroy' );
    },
    afterDestroy: function afterDestroy () {
      console.log( 'afterDestroy' );
    }
  };
  */

  var droppy = new Droppy( element, {
    parentSelector: 'li',
    dropdownSelector: 'li > ul.menu',
    triggerSelector: 'a',
    animationIn: 'fade-in',
    animationOut: 'fade-out'
  }, callbacks );

  openButton.addEventListener( 'click', function () {
    droppy.openAll();
  } );

  closeButton.addEventListener( 'click', function () {
    droppy.closeAll();
  } );

  console.log( droppy );

} () );
