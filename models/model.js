(function() {
  var EventEmitter, Model, extend, keys, _;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  if (!(typeof window !== "undefined" && window !== null)) {
    EventEmitter = require('events').EventEmitter;
    _ = require('underscore');
  }
  extend = _.extend;
  keys = Object.keys;
  Model = (function() {
    __extends(Model, EventEmitter);
    function Model(attribs) {
      attribs || (attribs = {});
      this.attribs || (this.attribs = {});
      this.attribs = extend(this.attribs, attribs);
      this.track(keys(this.attribs));
    }
    Model.prototype.track = function(keys) {
      if (!typeof keys === Array) {
        keys = [];
      }
      _.each(keys, __bind(function(key) {
        this.__defineGetter__(key, __bind(function() {
          return this.get(key);
        }, this));
        return this.__defineSetter__(key, __bind(function(val) {
          return this.set(key, val);
        }, this));
      }, this));
      return this;
    };
    Model.prototype.set = function(key, val, quiet) {
      var type;
      this.attribs[key] = val;
      if (!quiet) {
        this.emit('change', this.attribs);
        type = key + '.change';
        this.emit(type, val);
      }
      return this;
    };
    Model.prototype.get = function(key) {
      return this.attribs[key];
    };
    return Model;
  })();
  if (!(typeof window !== "undefined" && window !== null)) {
    module.exports = Model;
  }
}).call(this);
