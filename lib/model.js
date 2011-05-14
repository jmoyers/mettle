(function() {
  var EventEmitter, Model, async, extend, keys, server, uuid, _;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  };
  if (!(typeof window !== "undefined" && window !== null)) {
    EventEmitter = require('events').EventEmitter;
    _ = require('underscore');
    uuid = require('node-uuid');
    server = true;
    async = require('async');
  }
  extend = _.extend;
  keys = Object.keys;
  Model = (function() {
    __extends(Model, EventEmitter);
    function Model(attribs) {
      attribs || (attribs = {});
      this.attribs || (this.attribs = {});
      if (!(this.attribs['id'] != null)) {
        this.attribs['id'] = uuid();
      }
      this.attribs = extend(this.attribs, attribs);
      this.track(keys(this.attribs));
      this.middleware || (this.middleware = []);
      this.filtered || (this.filtered = {});
      this.configure;
    }
    Model.prototype.configue = function() {};
    Model.prototype.use = function(attr, fn) {
      var m, _oldfn;
      if (typeof attr === 'function') {
        fn = attr;
        attr = 'any';
      }
      if (attr !== 'any') {
        _oldfn = fn;
        fn = function(attribs, cb) {
          return _oldfn(attribs[attr], function(val) {
            attribs[attr] = val;
            return cb(attribs);
          });
        };
      }
      m = {
        type: attr,
        fn: fn
      };
      return (this.middleware || (this.middleware = [])).push(m);
    };
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
    Model.prototype.filterMiddleware = function(initialData) {
      var middle, targets;
      targets = [];
      targets = keys(initialData);
      middle = _(this.middleware).select(function(m) {
        var _ref;
        return m.type === 'any' || (_ref = m.type, __indexOf.call(targets, _ref) >= 0);
      }).map(function(m) {
        return m.fn;
      });
      _.each(middle, function(m) {});
      return function(attribs, cb) {
        if (typeof attribs === 'function') {
          cb = attribs;
          attribs = initialData;
        }
        if (!middle) {
          cb(null, attribs);
        }
        middle = _.map(middle, function(m) {
          return function(attribs, cb) {
            return m(attribs, function(attribs) {
              return cb(null, attribs);
            });
          };
        });
        middle = [
          function(cb) {
            return cb(null, attribs);
          }
        ].concat(middle);
        return async.waterfall(middle, cb);
      };
    };
    /*      
    Set will either accept arguments in either of these formats
    
    1. set({key1:val1, key2:val2}, quiet)
    2. set(key, val, quiet)
    
    You want to use (1) to set multiple properties on a single pass
    because 'saving' is implicit, and thus will cause the changes
    to be sent up to the server in bulk with socket.io transport
    */
    Model.prototype.set = function() {
      var attribs, cb, commit, key, quiet, val, _oldcb;
      attribs = key = val = quiet = false;
      if (typeof arguments[0] !== 'object') {
        key = arguments[0], val = arguments[1], quiet = arguments[2], cb = arguments[3];
        attribs = {};
        attribs[key] = val;
      } else {
        attribs = arguments[0], quiet = arguments[1], cb = arguments[2];
      }
      if (typeof quiet === 'function') {
        cb = quiet;
        quiet = false;
      }
      cb || (cb = function() {});
      _oldcb = cb;
      console.log(_oldcb.toString());
      cb = __bind(function(err, attribs) {
        return _oldcb(this.json());
      }, this);
      console.log(cb.toString());
      commit = __bind(function(attribs, cb) {
        console.log('commit: ', arguments);
        _.each(attribs, __bind(function(v, k) {
          if (!(this.attribs[k] != null)) {
            this.track(k);
          }
          return this.attribs[k] = v;
        }, this));
        if (!quiet) {
          this.emit('change', this.attribs);
          _.each(attribs, __bind(function(v, k) {
            var type;
            type = k + '.change';
            return this.emit(type, v);
          }, this));
        }
        return cb(null, attribs);
      }, this);
      async.waterfall([this.filterMiddleware(attribs), commit], cb);
      return this;
    };
    Model.prototype.get = function(key) {
      return this.attribs[key];
    };
    Model.prototype.json = function() {
      return this.attribs;
    };
    return Model;
  })();
  if (!(typeof window !== "undefined" && window !== null)) {
    module.exports = Model;
  }
}).call(this);