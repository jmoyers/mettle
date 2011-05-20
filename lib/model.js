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
      this.attribs['id'] = uuid().toLowerCase();
    }
    this.attribs = extend(this.attribs, attribs);
    this.tracked || (this.tracked = []);
    this.track(keys(this.attribs));
    this.middleware || (this.middleware = []);
    this.configure;
  }
  Model.prototype.configure = function() {};
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
    _.each(keys, __bind(function(key) {
      this.tracked.push(key);
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
    return __bind(function(attribs, cb) {
      if (typeof attribs === 'function') {
        cb = attribs;
        attribs = initialData;
      }
      middle = _.map(middle, __bind(function(m) {
        return __bind(function(attribs, cb) {
          return m.call(this, attribs, function(attribs) {
            return cb(null, attribs);
          });
        }, this);
      }, this));
      middle = [
        function(cb) {
          return cb(null, attribs);
        }
      ].concat(middle);
      return async.waterfall(middle, cb);
    }, this);
  };
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
    cb = __bind(function(err, attribs) {
      return _oldcb.call(this, this.json());
    }, this);
    commit = __bind(function(attribs, cb) {
      _.each(attribs, __bind(function(v, k) {
        if (__indexOf.call(this.tracked, k) < 0) {
          this.track([k]);
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
      return cb(null, this.attribs);
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