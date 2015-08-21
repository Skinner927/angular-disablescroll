/**
 * angular-disablescroll.js
 * Version 1.0
 * https://github.com/Skinner927/angular-disablescroll
 * (c) 2015 MIT License, Dennis Skinner
 */

(function(root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    // CommonJS
    if (typeof angular === 'undefined') {
      module.exports = factory(require('angular'));
    } else {
      module.exports = factory(angular);
    }
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define(['angular'], factory);
  } else {
    // Global Variables
    factory(root.angular);
  }
}(this, function(angular) {

  var m = angular.module('ElementScroll', []);

  m.service('ElementScroll', ['$window', function($window) {
    var proto;
    var instances = {};
    var instances_index = 1;


    function UserScrollDisabler($container, options) {
      // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
      // left: 37, up: 38, right: 39, down: 40
      this.opts = angular.extend({
        handleWheel: true,
        handleScrollbar: true,
        handleKeys: true,
        scrollEventKeys: [32, 33, 34, 35, 36, 37, 38, 39, 40]
      }, options);

      this.$container = $container;
      this.$document = angular.element($window.document);
      this.lockToScrollPos = [0, 0];

      this.scrollDisabled = false;

      // due to scope issues, we can't make these prototypes.
      // This is mainly because we need to pass the same function reference
      // to the on/off bindings because jqLite doesn't have namespaces.
      var t = this;
      this._handleScrollbar = function() {
        // window has a special way to scroll
        var el = t.$container[0];
        if(el === $window){
          el.scrollTo(t.lockToScrollPos[0], t.lockToScrollPos[1]);
        }else {
          el.scrollLeft = t.lockToScrollPos[0];
          el.scrollTop = t.lockToScrollPos[1];
        }
      };

      this._handleKeydown = function(event) {
        for (var i = 0; i < t.opts.scrollEventKeys.length; i++) {
          if (event.keyCode === t.opts.scrollEventKeys[i]) {
            event.preventDefault();
            return;
          }
        }
      };

      this._handleWheel = function(event) {
        event.preventDefault();
      };
    }

    proto = UserScrollDisabler.prototype;

    // Disable the scrolling (locks it)
    proto.disable = function() {
      var t = this;

      if(t.scrollDisabled){
        return;
      }
      t.scrollDisabled = true;

      if (t.opts.handleWheel) {
        t.$container.on(
          "mousewheel DOMMouseScroll touchmove",
          t._handleWheel
        );
      }

      if (t.opts.handleScrollbar) {
        var el = t.$container[0];
        t.lockToScrollPos = [
          angular.isNumber(el.scrollX) ? el.scrollX : el.scrollLeft,
          angular.isNumber(el.scrollY) ? el.scrollY: el.scrollTop
        ];

        t.$container.on("scroll", t._handleScrollbar);
      }

      if (t.opts.handleKeys) {
        t.$document.on("keydown", t._handleKeydown);
      }
    };

    // Undo removes the scroll disabling (unlocks)
    proto.undo = function() {
      var t = this;

      if(!t.scrollDisabled){
        return;
      }
      t.scrollDisabled = false;

      if (t.opts.handleWheel) {
        t.$container.off("mousewheel DOMMouseScroll touchmove", t._handleWheel);
      }

      if (t.opts.handleScrollbar) {
        t.$container.off("scroll", t._handleScrollbar);
      }

      if (t.opts.handleKeys) {
        t.$document.off("keydown", t._handleKeydown);
      }
    };

    /**
     * This method will essentially setup each UserScrollDisabler if not already there
     * all while returning the id to use.
     * @param element Single angular.element wrapped element
     * @param options (optional) Options to pass to UserScrollDisabler constructor
     * @returns {number|Number}
     */
    function getIdFromElement(element, options) {
      var id = parseInt(element.data('_disableScrollId'), 10);

      if (!id) {
        // If no ID we need to do a setup
        instances_index++;
        id = instances_index;
        element.data('_disableScrollId', id);

        element.on('$destroy', function() {
          instances[id] = undefined;
        });
      }

      if (!instances[id]) {
        instances[id] = new UserScrollDisabler(element, options);
      }

      return id;
    }


    // Expose service methods
    var service = this;

    /**
     * Disables scrolling for the passed in element
     * @param element Single angular.element wrapped element
     * @param options (optional) Options object to pass to UserScrollDisabler. This can only
     *  be passed once on the first call of either via `disableScrolling` or `enableScrolling`.
     *  Options will *not* be updated on subsequent uses.
     */
    service.disableScrolling = function disableScrolling(element, options) {
      var id = getIdFromElement(element, options);

      instances[id].disable();
    };

    /**
     * Enables scrolling for the passed in element
     * @param element Single angular.element wrapped element
     * @param options (optional) See `disableScrolling`
     */
    service.enableScrolling = function enableScrolling(element, options) {
      var id = getIdFromElement(element, options);

      instances[id].undo();
    };

  }]);

  return m;
}));

