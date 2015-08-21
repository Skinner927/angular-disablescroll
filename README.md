angular-disablescroll
===

This is a port of [jquery-disablescroll](http://github.com/ultrapasty/jquery-disablescroll) by [Josh Harrison](http://www.joshharrison.net) from jQuery to Angular.

Disables scrolling from scrollbars, mousewheels, touchmoves and keypresses on a given scrollable element, typically `angular.element($window)`.

Has zero dependencies, pure Angular, **no** jQuery.


Demo
---
**https://jsfiddle.net/skinner927/haxcxva6/**


Example Usage
---

    angular.module('foo', ['ElementScroll'])
    
    .controller('fooCtrl', [
        '$scope', '$element', 'ElementScroll', 
        function($scope, $element, ElementScroll) {
            
            $scope.lockScroll = function(){
                ElementScroll.disableScrolling(angular.element($element));
            };
            
        });


Options
---

Can be passed on first use:

    ElementScroll.disableScrolling(element, {
        option : value
    })
    
or (granted an odd use case)

    ElementScroll.enableScrolling(element, {
        option : value
    })

Option            | Default Value                              | Description
:---------------- | :----------------------------------------- | :---------------------------------------------------------
handleWheel       | `true`                                     | Boolean indicating whether to disable mouse wheels.
handleScrollbar   | `true`                                     | Boolean indicating whether to disable scroll bar dragging. Set to `false` if you need to modify the scroll position whilst scrolling is disabled.
handleKeys        | `true`                                     | Boolean indicating whether to disable scrolling triggered by keypresses, e.g. the down button.
scrollEventKeys   | `[32, 33, 34, 35, 36, 37, 38, 39, 40]`     | Array of scroll-related keycodes to disable during scroll. See below for reference.


Keycode Reference
---

The following scroll-related keys are all included by default:

Keycode    | Key
:--------- | :-----------
32         | Spacebar
33         | Page Up
34         | Page Down
35         | End
36         | Home
37         | Left Arrow
38         | Up Arrow
39         | Right Arrow
40         | Down Arrow

Compatibility
---
Tested in:
- Mac: Chrome 44

Known Issues (from jquery-disablescroll)
---
- Mac Safari 7.1 is a bit flickery when dragging a disabled scrollbar.
- One report of IE flickering when dragging a disabled scrollbar, although I
was unable to reproduce this.
- Not sure if there is a workaround for these flickering issues, as scrolling by
dragging the scrollbar does not trigger any cancellable events. This only leaves
us with the option of setting the scroll position back to what it was before on
every scroll event. I'm surprised this doesn't flicker in more browsers.
