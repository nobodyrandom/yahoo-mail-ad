// ==UserScript==
// @name         Yahoo Mail Ad Bypass
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       NobodyRandom
// @match        https://mg.mail.yahoo.com/*
// @match        https://mail.yahoo.com/*
// @run-at       document-start
// @grant        unsafeWindow
// @noframes
// ==/UserScript==

(function() {
    'use strict';

    if (!Object.prototype.watch) {
        Object.defineProperty(Object.prototype, "watch", {
            enumerable: false, configurable: true, writable: false, 
            value: function (prop, handler) {
                var oldval = this[prop], newval = oldval, getter = function () {
                    return newval;
                }, setter = function (val) {
                    oldval = newval;
                    return newval = handler.call(this, prop, oldval, val);
                };

                if (delete this[prop]) { // can't watch constants
                    Object.defineProperty(this, prop, {
                        get: getter, set: setter
                        , enumerable: true
                        , configurable: true
                    });
                }
            }
        });
    }

    // object.unwatch
    if (!Object.prototype.unwatch) {
        Object.defineProperty(Object.prototype, "unwatch", {
            enumerable: false, configurable: true, writable: false, 
            value: function (prop) {
                var val = this[prop];
                delete this[prop]; // remove accessors
                this[prop] = val;
            }
        });
    }

    unsafeWindow.watch('AppBootstrapData', function(id, oldval, newval){
        newval.config.ads = false;
        return newval;
    });

    unsafeWindow.watch('AppState', function(id, oldval, newval){
        newval.fluxibleState.context.plugins.MailFluxibleContextPlugin.cofig.ads = false;
        unsafeWindow.unwatch('AppBootstrapData');
        return newval;
    });
})();
