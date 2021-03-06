/*
    Collection of polyfills neededf or IE10+ support
*/

// Array.prototype.find() for IE10+
require('ie-array-find-polyfill');
// Object.assign for IE10+
require('es6-object-assign').polyfill();

// Allow use of object.constructor.staticFunc() in IE
// Not yet supported by babel
// https://gist.github.com/edoardocavazza/47246856759f2273e48b
(function () {
    if (typeof Object.setPrototypeOf === 'undefined' && typeof Object.getOwnPropertyNames === 'function') {
        var _exclude = ['length', 'name', 'arguments', 'caller', 'prototype'];

        function bindFunction(ctx, fn) {
            return function() {
                return fn.apply(this, arguments);
            }
        }

        function bindProperty(ctx, prop, parentDescriptor) {
            if (!parentDescriptor) {
                var defaultValue = ctx.__proto__[prop];
                parentDescriptor = {
                    get: function () {
                        return ctx['__' + prop] || defaultValue
                    },
                    set: function (val) {
                        ctx['__' + prop] = val;
                    }
                }
            }
            Object.defineProperty(ctx, prop, {
                get: parentDescriptor.get ? parentDescriptor.get.bind(ctx) : undefined,
                set: parentDescriptor.set ? parentDescriptor.set.bind(ctx) : undefined,
                configurable: true
            });

        }

        function iterateProps(subClass, superClass) {
            var props = Object.getOwnPropertyNames(superClass),
                proto;

            subClass.__proto__ = superClass;
            for (var i = 0, len = props.length; i < len; i++) {
                var prop = props[i];
                if (prop === '__proto__') {
                    proto = superClass[prop];
                } else if (_exclude.indexOf(i) === -1) {
                    var descriptor = Object.getOwnPropertyDescriptor(subClass, prop);
                    if (!descriptor) {
                        var superDescriptor = Object.getOwnPropertyDescriptor(superClass, prop);
                        if (typeof superDescriptor.get !== 'function' && typeof superClass[prop] === 'function') {
                            subClass[prop] = bindFunction(subClass, superClass[prop]);
                        } else if (typeof superDescriptor.get == 'function') {
                            bindProperty(subClass, prop, superDescriptor);
                        } else {
                            bindProperty(subClass, prop);
                        }
                    }
                }
            }
            if (proto) {
                iterateProps(subClass, proto);
            }
        }

        Object.setPrototypeOf = iterateProps;
    }
})();

// Use CustomEvent in IE
(function () {
  if ( typeof window.CustomEvent === "function" ) return false;

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();
