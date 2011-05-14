var Controller, EventEmitter, extend, _;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
if (!(typeof window !== "undefined" && window !== null)) {
  _ = require('underscore');
  EventEmitter = require('events').EventEmitter;
}
extend = _.extend;
Controller = (function() {
  __extends(Controller, EventEmitter);
  function Controller(attribs) {
    attribs || (attribs = {});
    this.events || (this.events = {});
    _.each(attribs, __bind(function(val, key) {
      return this[key] = val;
    }, this));
    _.each(this.events, __bind(function(fn, event) {
      return this.on(event, fn);
    }, this));
  }
  Controller.prototype.on = function(type, fn) {
    var tobind;
    fn || (fn = function() {});
    type = this.parse(type);
    if (!(tobind = this[type.attr])) {
      return;
    }
    if (type.qual && (tobind.find != null)) {
      tobind = tobind.find(type.qual);
    }
    this.binder(tobind)(type.event, fn);
    return Controller.__super__.on.call(this, type, fn);
  };
  Controller.prototype.binder = function(o) {
    var b, binder, _i, _len;
    binder = ['on', 'bind'];
    for (_i = 0, _len = binder.length; _i < _len; _i++) {
      b = binder[_i];
      if (typeof o[b] === 'function') {
        return function() {
          return o[b].apply(o, arguments);
        };
      }
    }
    return function() {};
  };
  Controller.prototype.parse = function(str) {
    var EVENT, attr, event, match, qual, _ref;
    EVENT = /^([^\x20.]+)(?:[\x20.])?(.+)?(?:[\x20.])([^\x20.]+)$/;
    _ref = EVENT.exec(str) || ['', '', '', ''], match = _ref[0], attr = _ref[1], qual = _ref[2], event = _ref[3];
    return {
      attr: attr,
      qual: qual,
      event: event
    };
  };
  return Controller;
})();
if (!(typeof window !== "undefined" && window !== null)) {
  module.exports = Controller;
}