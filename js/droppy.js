/*
 * Droppy - Pure JavaScript multi-level dropdown menu.
 *
 * TODO - [x] Nested Droppy.
 * TODO - [x] preventDefault as option.
 * TODO - [x] Implements a tree instead of querying DOM every click.
 * TODO - [x] Remove unused shims.
 * TODO - [x] Do not instance twice on same element.
 * TODO - [ ] Open a drop-down with a parent closed.
 */

( function ( window, factory ) {

  if ( typeof define === 'function' && define.amd ) {
    define( [], factory );
  }
  else if ( typeof exports === 'object' ) {
    module.exports = factory();
  }
  else {
    window.Droppy = factory();
  }

} ( window, function () {

  'use strict';

  var console = window.console,
      droppyStore = [],
      animationSupport = detectAnimationSupport();


  // Constructor
  // ---------------------------------------------------------------------------

  /**
   * Instantiate a new Droppy object.
   *
   * @param {Element} element
   *        The element on which Droppy will act.
   * @param {Object} options
   *        An object containing Droppy options.
   * @param {Object} callbacks
   *        An object containing callback functions.
   * @constructor
   */
  function Droppy ( element, options, callbacks )  {

    // Do not instantiate twice on same element.
    if ( Droppy.prototype.getInstance( element ) ) {
      if ( console ) {
        console.error( 'Droppy: another Droppy instance was found for this element.', element );
      }
      return;
    }

    // Check Droppy element.
    if ( element.nodeType !== Node.ELEMENT_NODE ) {
      if ( console ) {
        console.error( 'Droppy: the given element is not valid.', element );
      }
      return;
    }

    this.element = element;

    // Check dropdown selector.
    var dropdown = this.element.querySelector( options.dropdownSelector );

    if ( !dropdown ) {
      if ( console ) {
        console.error( 'Droppy: the given dropdownSelector returns no value.', options.dropdownSelector );
      }
      return;
    }

    // Check parent selector.
    var parent = this.element.querySelector( options.parentSelector );

    if ( !parent ) {
      if ( console ) {
        console.error( 'Droppy: the given parentSelector returns no value.', options.parentSelector );
      }
      return;
    }

    // Check trigger selector.
    var trigger = this.element.querySelector( options.triggerSelector );

    if ( !trigger ) {
      if ( console ) {
        console.error( 'Droppy: the given triggerSelector returns no value.', options.triggerSelector );
      }
      return;
    }

    // Default options.
    var defaultOptions = {
      parentSelector: 'li',
      dropdownSelector: 'li > ul',
      triggerSelector: 'a',
      closeOthers: true,
      clickOutToClose: true,
      clickEscToClose: true,
      animationIn: '',
      animationOut: '',
      preventDefault: true
    };

    // Init options.
    if ( options && typeof options === 'object' ) {
      this.options = extendDefaults( defaultOptions, options );
    }
    else {
      this.options = defaultOptions;
    }

    // Default callbacks.
    var defaultCallbacks = {
      beforeOpen: null,
      afterOpen: null,
      beforeClose: null,
      afterClose: null,
      beforeOpenAll: null,
      afterOpenAll: null,
      beforeCloseAll: null,
      afterCloseAll: null,
      beforeInit: null,
      afterInit: null,
      beforeDestroy: null,
      afterDestroy: null
    };

    // Init callbacks.
    if ( callbacks && typeof callbacks === 'object' ) {
      this.callbacks = extendDefaults( defaultCallbacks, callbacks );
    }
    else {
      this.callbacks = defaultCallbacks;
    }

    // Init Droppy.
    this.init();
  }

  /**
   * Instantiate a new DroppyNode object.
   *
   * @constructor
   */
  function DroppyNode () {

    this.dropdown = '';
    this.parent = '';
    this.dropdown = '';
    this.parentsNode = [];
    this.descendantsNode = [];
    this.level = 0;
    this.status = false;
  }


  // Public methods
  // ---------------------------------------------------------------------------

  /**
   * Initialize a Droppy object. This function is called when a new Droppy
   * object is created. It adds CSS classes, aria attributes and events.
   */
  Droppy.prototype.init = function () {

    // Do not initialize twice.
    if ( Droppy.prototype.isInitialized( this ) ) {
      return;
    }

    // Before callback.
    if ( typeof this.callbacks.beforeInit === 'function' ) {
      this.callbacks.beforeInit();
    }

    // Generate the tree.
    this.tree = generateTree(
      this.element,
      this.options.dropdownSelector,
      this.options.parentSelector,
      this.options.triggerSelector
    );

    // Add Droppy attributes.
    this.element.classList.add( 'droppy' );

    for ( var i = this.tree.length, node; i--, node = this.tree[ i ]; ) {

      node.dropdown.classList.add( 'droppy__drop' );

      node.parent.classList.add( 'droppy__parent' );

      node.trigger.classList.add( 'droppy__trigger' );
      node.trigger.setAttribute( 'aria-haspopup', 'true' );
      node.trigger.setAttribute( 'aria-expanded', 'false' );
    }

    // Add events.
    if ( droppyStore.length === 0 ) {
      document.body.addEventListener( 'click', clickHandler );
      document.body.addEventListener( 'keyup', escHandler );
    }

    // Add instance to the store.
    droppyStore.push( this );

    // After callback.
    if ( typeof this.callbacks.afterInit === 'function' ) {
      this.callbacks.afterInit();
    }
  };

  /**
   * Reset a Droppy instance to a pre-init state. It remove Droppy CSS classes,
   * aria attributes and events.
   */
  Droppy.prototype.destroy = function () {

    // If not initialized, do not destroy.
    if ( !Droppy.prototype.isInitialized( this ) ) {
      return;
    }

    // Before callback.
    if ( typeof this.callbacks.beforeDestroy === 'function' ) {
      this.callbacks.beforeDestroy();
    }

    // Remove Droppy attributes.
    this.element.classList.remove( 'droppy' );

    for ( var i = this.tree.length, node; i--, node = this.tree[ i ]; ) {

      node.dropdown.classList.remove( 'droppy__drop', 'droppy__drop--active' );

      node.parent.classList.remove( 'droppy__parent' );

      node.trigger.classList.remove( 'droppy__trigger' );
      node.trigger.removeAttribute( 'aria-haspopup' );
      node.trigger.removeAttribute( 'aria-expanded' );
    }

    delete this.tree;

    // Remove events.
    if ( droppyStore.length === 1 ) {
      document.body.removeEventListener( 'click', clickHandler );
      document.body.removeEventListener( 'keyup', escHandler );
    }

    delete this.handler;

    // Remove instance from the store.
    for ( var j = droppyStore.length, droppy; j--, droppy = droppyStore[ j ]; ) {
      if ( droppy === this ) {
        droppyStore.splice( j, 1 );
      }
    }

    // After callback.
    if ( typeof this.callbacks.afterDestroy === 'function' ) {
      this.callbacks.afterDestroy();
    }
  };

  /**
   * Open the given drop-down.
   *
   * @param {Element|DroppyNode} dropdown
   *        The drop-down element to open.
   * @param {Boolean} [withDescendants=false]
   *        Should open or not all the drop-downs in the given drop-down.
   */
  Droppy.prototype.open = function ( dropdown, withDescendants ) {

    var node;

    // Check if dropdown is a node or an element. We need a node.
    if ( dropdown instanceof DroppyNode ) {
      node = dropdown;
    }
    else {
      node = getNodeByProperty( 'dropdown', dropdown, this.tree );
    }

    // If opened yet, return.
    if ( node.status ) {
      return;
    }

    // Before callback.
    if ( typeof this.callbacks.beforeOpen === 'function' ) {
      this.callbacks.beforeOpen();
    }

    // If closeOthers set to true, close all open siblings of the current node.
    if ( this.options.closeOthers ) {

      var siblings = getNodesByProperty( 'level', node.level, this.tree );

      for ( var i = siblings.length, sibling; i--, sibling = siblings[ i ]; ) {
        if ( sibling.status ) {
          close( sibling, true, this.options.animationOut );
        }
      }
    }

    // Call open().
    open( node, withDescendants, this.options.animationIn );

    // After callback.
    if ( typeof this.callbacks.afterOpen === 'function' ) {
      this.callbacks.afterOpen();
    }
  };

  /**
   * Close the given drop-down.
   *
   * @param  {Element|DroppyNode} dropdown
   *         The dropdown element to close.
   * @param  {Boolean} [withDescendants=true]
   *         Should close or not all the drop-downs in the given drop-down.
   */
  Droppy.prototype.close = function ( dropdown, withDescendants ) {

    var node;

    // Check if dropdown is a node or an element. We need a node.
    if ( dropdown instanceof DroppyNode ) {
      node = dropdown;
    }
    else {
      node = getNodeByProperty( 'dropdown', dropdown, this.tree );
    }

    // If closed yet, return.
    if ( !node.status ) {
      return;
    }

    // Before callback.
    if ( typeof this.callbacks.beforeClose === 'function' ) {
      this.callbacks.beforeClose();
    }

    // Call close().
    close( node, withDescendants, this.options.animationOut );

    if ( typeof this.callbacks.afterClose === 'function' ) {
      this.callbacks.afterClose();
    }
  };

  /**
   * Open or close the given drop-down.
   *
   * @param  {Element|DroppyNode} dropdown
   *         The drop-down element to open or close.
   * @param  {Boolean|undefined} withDescendants
   *         Should open/close or not all the drop-downs in the given drop-down.
   */
  Droppy.prototype.toggle = function ( dropdown, withDescendants ) {

    var node;

    // Check if dropdown is a node or an element. We need a node.
    if ( dropdown instanceof DroppyNode ) {
      node = dropdown;
    }
    else {
      node = getNodeByProperty( 'dropdown', dropdown, this.tree );
    }

    // If open call close, call open otherwise.
    if ( node.status ) {
      this.close( node, withDescendants );
    }
    else {
      this.open( node, withDescendants );
    }
  };

  /**
   * Close all drop-down in a Droppy menu.
   */
  Droppy.prototype.closeAll = function () {

    // If no node is open, return.
    var openNode = getNodeByProperty( 'status', true, this.tree );

    if ( !openNode ) {
      return;
    }

    // Before callback.
    if ( typeof this.callbacks.beforeCloseAll === 'function' ) {
      this.callbacks.beforeCloseAll();
    }

    // Close the drop-downs.
    var nodes = getNodesByProperty( 'level', 0, this.tree );

    for ( var i = nodes.length, node; i--, node = nodes[ i ]; ) {
      if ( node.status ) {
        close( node, true, this.options.animationOut );
      }
    }

    // After callback.
    if ( typeof this.callbacks.afterCloseAll === 'function' ) {
      this.callbacks.afterCloseAll();
    }
  };

  /**
   * Open all drop-down in a Droppy menu.
   */
  Droppy.prototype.openAll = function () {

    // If no node is closed, return.
    var closedNode = getNodeByProperty( 'status', false, this.tree );

    if ( !closedNode ) {
      return;
    }

    // Before callback.
    if ( typeof this.callbacks.beforeOpenAll === 'function' ) {
      this.callbacks.beforeOpenAll();
    }

    // Open the drop-downs.
    var nodes = getNodesByProperty( 'level', 0, this.tree );

    for ( var i = nodes.length, node; i--, node = nodes[ i ]; ) {
      if ( !node.status ) {
        open( node, true, this.options.animationIn );

        continue;
      }

      /*
       If node is open, check the descendants. If a descendant is not open,
       open it.
       */
      for ( var j = 0, l = node.descendantsNode.length, descendant;
            j < l, descendant = node.descendantsNode[ j ]; ++j ) {
        if ( !descendant.status ) {
          open( descendant, true, this.options.animationIn );
        }
      }
    }

    // After callback.
    if ( typeof this.callbacks.afterOpenAll === 'function' ) {
      this.callbacks.afterOpenAll();
    }
  };


  // Static methods
  // ---------------------------------------------------------------------------

  /**
   * Check if the given Droppy instance was initialized.
   *
   * @param  {Droppy} droppy
   *         A Droppy instance to check.
   * @return {Boolean}
   *         True if the given Droppy instance was initialized, false otherwise.
   */
  Droppy.prototype.isInitialized = function ( droppy ) {

    for ( var i = droppyStore.length, inStore; i--, inStore = droppyStore[ i ]; ) {
      if ( droppy === inStore ) {
        return true;
      }
    }

    return false;
  };

  /**
   * Return the Droppy instance used by the given element.
   *
   * @param  {Element} element
   *         The element used at Droppy creation.
   * @return {Droppy|undefined}
   *         The Droppy instance used by the given element. If none instance is
   *         found, return undefined.
   */
  Droppy.prototype.getInstance = function ( element ) {

    for ( var i = droppyStore.length, droppy; i--, droppy = droppyStore[ i ]; ) {
      if ( droppy.element === element ) {
        return droppy;
      }
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
   * @param  {Object} properties
   *         An object representing the user options.
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
   * Returns the element that matches the given CSS selector in the given range
   * of elements.
   *
   * @param  {Element} start
   *         The starting element.
   * @param  {Element} end
   *         The ending element.
   * @param  {String} parentSelector
   *         A valid CSS selector.
   * @param  {Boolean} includeSelf
   *         A boolean indicating if include start element or not.
   * @return {Element}
   *         The parent element that matches the given CSS selector.
   */
  function getParent ( start, end, parentSelector, includeSelf ) {

    if ( !includeSelf ) {
      start = start.parentNode;
    }

    while ( start !== end ) {
      if ( start.matches( parentSelector ) ) {
        return start;
      }

      start = start.parentNode;
    }
  }

  /**
   * Returns an array of elements that matches the given CSS selector in the
   * given range of elements.
   *
   * @param  {Element} start
   *         The starting element.
   * @param  {Element} end
   *         The ending element.
   * @param  {String} parentSelector
   *         A valid CSS selector.
   * @param  {Boolean} includeSelf
   *         A boolean indicating if include start element or not.
   * @return {Array}
   *         An array of elements that matches the given CSS selector.
   */
  function getParents ( start, end, parentSelector, includeSelf ) {

    if ( !includeSelf ) {
      start = start.parentNode
    }

    var parents = [];

    while ( start !== end ) {
      if ( start.matches( parentSelector ) ) {
        parents.push( start );
      }

      start = start.parentNode;
    }

    return parents;
  }

  /**
   * Build a tree of drop-downs, triggers and parents.
   *
   * @param  {Element} element
   *         The element on which Droppy will act.
   * @param  {String} dropdownSelector
   *         A valid CSS selector.
   * @param  {String} parentSelector
   *         A valid CSS selector.
   * @param  {String} triggerSelector
   *         A valid CSS selector.
   * @return {Array}
   *         The tree.
   */
  function generateTree ( element, dropdownSelector, parentSelector, triggerSelector ) {

    // Get all drop-downs.
    var dropdowns = Array.prototype.slice.call( element.querySelectorAll( dropdownSelector ) ),
        tree = [];

    // For each drop-down, build a DroppyNode.
    for ( var i = 0, l = dropdowns.length, dropdown; i < l, dropdown = dropdowns[ i ]; i++ ) {

      var node = new DroppyNode();

      node.dropdown = dropdown;
      node.parent = getParent( dropdown, element, parentSelector, false );
      node.trigger = node.parent.querySelector( triggerSelector );

      var parentsDropdowns = getParents( dropdown, element, dropdownSelector, false ),
          parentNode;

      for ( var j = parentsDropdowns.length, parentDropdown; j--, parentDropdown = parentsDropdowns[ j ]; ) {
        parentNode = getNodeByProperty( 'dropdown', parentDropdown, tree );
        node.parentsNode.push( parentNode );
        parentNode.descendantsNode.push( node );
      }

      node.level = node.parentsNode.length;
      tree.push( node );
    }

    return tree;
  }

  /**
   * Return the node corresponding to the given property and value in the given
   * tree.
   *
   * @param  {String} property
   *         The property of a node.
   * @param  {*} value
   *         The value of the given property.
   * @param  {Array} tree
   *         The tree on which search for the node.
   * @return {DroppyNode}
   *         The node corresponding to the given property and value.
   */
  function getNodeByProperty ( property, value, tree ) {

    for ( var i = tree.length, node; i--, node = tree[ i ]; ) {
      if ( node[ property ] === value ) {
        return node;
      }
    }
  }

  /**
   * Return an array of nodes corresponding to the given property and value in
   * the given tree.
   *
   * @param  {String} property
   *         The property of a node.
   * @param  {*} value
   *         The value of the given property.
   * @param  {Array} tree
   *         The tree on which search for the node.
   * @return {Array}
   *         An array of nodes corresponding to the given property and value.
   */
  function getNodesByProperty ( property, value, tree ) {

    var nodes = [];

    for ( var i = tree.length, node; i--, node = tree[ i ]; ) {
      if ( node[ property ] === value ) {
        nodes.push( node );
      }
    }

    return nodes;
  }

  /**
   * Check if browser support animation.
   *
   * @return {Boolean}
   *         Return true if the browser support CSS animation, false otherwise.
   */
  function detectAnimationSupport () {

    var support = false,
        element = document.createElement( 'div' ),
        domPrefixes = 'Webkit';

    if ( element.style.animationName !== undefined ) {
      support = true;
    }

    if ( !support ) {
      if ( element.style[ domPrefixes + 'AnimationName' ] !== undefined ) {
        support = true;
      }
    }

    return support;
  }

  /**
   * Check if the open should be animated, set withDescendants and then call
   * open.
   *
   * @param {DroppyNode} node
   *        The element to which adds the CSS class .droppy__drop--active.
   * @param {Boolean} withDescendants
   *        True if add the CSS class to the descendants drop-down.
   * @param {String} animation
   *        A CSS class where is declared an animation.
   */
  function open ( node, withDescendants, animation ) {

    // If withDescendants is not set, set it to default.
    if ( typeof withDescendants !== 'boolean' ) {
      withDescendants = false;
    }

    /*
     If browser support animation and there is an animation, animate it and
     call open.
     */
    if ( animationSupport && animation ) {
      handleOpenAnimation( node, animation );
    }

    setOpenAttributes( node, withDescendants );
  }

  /**
   * Check if the close should be animated, set withDescendants and then call
   * setCloseAttributes().
   *
   * @param {DroppyNode} node
   *        The element to which adds the CSS class .droppy__drop--active.
   * @param {Boolean} withDescendants
   *        True if remove the CSS class to the descendants drop-down.
   * @param {String} animation
   *        A CSS class where is declared an animation.
   */
  function close ( node, withDescendants, animation ) {

    // If withDescendants is not set, set it to default.
    if ( typeof withDescendants !== 'boolean' ) {
      withDescendants = true;
    }

    /*
     If browser support animation and there is an animation, animate it.
     Otherwise call close. As opposed to open, the close should be called at
     the animation end.
     */
    if ( animationSupport && animation ) {
      handleCloseAnimation( node,withDescendants, animation );
    }
    else {
      setCloseAttributes( node, withDescendants );
    }
  }

  /**
   * Add animation CSS class and removes it when animation ends.
   *
   * @param {DroppyNode} node
   *        The node to animate.
   * @param {String} animation
   *        The animation CSS class.
   */
  function handleOpenAnimation ( node, animation ) {

    node.dropdown.addEventListener( 'animationend', function handler () {

      // At animation end, remove animation class.
      node.dropdown.classList.remove( animation );
      node.dropdown.removeEventListener( 'animationend', handler );
    } );

    node.dropdown.classList.add( animation );
  }

  /**
   * Add animation CSS class and removes it when animation ends. Then call
   * setCloseAttributes().
   *
   * @param {DroppyNode} node
   *        The node to animate.
   * @param {Boolean} withDescendants
   *        Close all drop-downs descendants of the current drop-down.
   * @param {String} animation
   *        The animation CSS class.
   */
  function handleCloseAnimation ( node, withDescendants, animation ) {

    node.dropdown.addEventListener( 'animationend', function handler () {

      // In animation end, remove animation class and set close attributes.
      node.dropdown.classList.remove( animation );
      setCloseAttributes( node, withDescendants );

      node.dropdown.removeEventListener( 'animationend', handler );
    } );

    node.dropdown.classList.add( animation );
  }

  /**
   * Set open attributes on the given DroppyNode. Attributes are
   * .droppy__drop--active on drop-down, and aria-expanded on trigger.
   *
   * @param {DroppyNode} node
   *        The element to which adds the CSS class .droppy__drop--active.
   * @param {Boolean} withDescendants
   *        True if add the CSS class to the descendants drop-down.
   */
  function setOpenAttributes ( node, withDescendants ) {

    if ( withDescendants ) {

      for ( var i = node.descendantsNode.length, descendant; i--, descendant = node.descendantsNode[ i ]; ) {

        if ( descendant.status ) {
          continue;
        }

        descendant.dropdown.classList.add( 'droppy__drop--active' );
        descendant.trigger.setAttribute( 'aria-expanded', 'true' );
        descendant.status = true;
      }
    }

    node.dropdown.classList.add( 'droppy__drop--active' );
    node.trigger.setAttribute( 'aria-expanded', 'true' );
    node.status = true;
  }

  /**
   * Set close attributes on the given DroppyNode. Attributes are
   * .droppy__drop--active on drop-down, and aria-expanded on trigger.
   *
   * @param {DroppyNode} node
   *        The drop-down to close.
   * @param {Boolean} withDescendants
   *        Close all drop-downs descendants of the current drop-down.
   */
  function setCloseAttributes ( node, withDescendants ) {

    node.dropdown.classList.remove( 'droppy__drop--active' );
    node.trigger.setAttribute( 'aria-expanded', 'false' );
    node.status = false;


    if ( withDescendants ) {

      for ( var i = node.descendantsNode.length, descendant; i--, descendant = node.descendantsNode[ i ]; ) {

        if ( !descendant.status ) {
          continue;
        }

        descendant.dropdown.classList.remove( 'droppy__drop--active' );
        descendant.trigger.setAttribute( 'aria-expanded', 'false' );
        descendant.status = false;
      }
    }
  }


  // Event handler
  // ---------------------------------------------------------------------------

  /**
   * Calls toggle when a trigger is clicked. If clickOutToClose, close others
   * menu.
   *
   * @param {Event} event
   *        The event object.
   */
  function clickHandler ( event ) {

    var trigger = getParent( event.target, document.body, '.droppy__trigger', true ),
        roots = getParents( event.target, document.body, '.droppy', false ),
        droppiesToClose = [];

    /*
     Populate droppiesToClose with Droppy instances that has cliOutToClose set
     to true.
     */
    for ( var k = droppyStore.length, droppy; k--, droppy = droppyStore[ k ]; ) {
      if ( droppy.options.clickOutToClose ) {
        droppiesToClose.push( droppy );
      }
    }

    // From droppiesToClose remove the Droppy instance I'm in and all its parents.
    droppiesToClose = droppiesToClose.filter( function ( droppyToClose ) {

      for ( var i = this.length, root; i--, root = this[ i ]; ) {
        if ( Droppy.prototype.getInstance( root ) === droppyToClose ) {
          return false;
        }
      }

      return true;
    }, roots );

    // I've clicked in a trigger! Let's toggle some drop-downs.
    if ( trigger ) {

      droppy = Droppy.prototype.getInstance( getParent( event.target, document.body, '.droppy', false ) );

      var withDescendants = event.shiftKey ? true : undefined,
          node = getNodeByProperty( 'trigger', trigger, droppy.tree );

      droppy.toggle( node, withDescendants );

      if ( droppy.options.preventDefault ) {
        event.preventDefault();
      }
    }

    // Now I should close the menu with clickOutToClose set to true.
    for ( var i = droppiesToClose.length, droppyToClose; i--, droppyToClose = droppiesToClose[ i ]; ) {
      droppyToClose.closeAll();
    }
  }

  /**
   * Close drop-downs when click ESC.
   *
   * @param {Event} event
   *        The event object.
   */
  function escHandler ( event ) {

    if ( event.which === 27 ) {

      for ( var i = droppyStore.length, droppy; i--, droppy = droppyStore[ i ]; ) {
        if ( droppy.options.clickEscToClose ) {
          droppy.closeAll();
        }
      }
    }
  }


  // Expose & Init
  // ---------------------------------------------------------------------------

  // Init via HTML.
  var elements = document.querySelectorAll( '[data-droppy]' );

  for ( var i = 0; i < elements.length; ++i ) {
    new Droppy( elements[ i ], JSON.parse( elements[ i ].getAttribute( 'data-droppy' ) ) );
  }

  // Expose Droppy to the global object.
  return Droppy;

} ) );
