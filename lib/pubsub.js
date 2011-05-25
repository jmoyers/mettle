var EventEmitter, PubSub, async, server, uuid, _;
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
  uuid = require('node-uuid');
  server = true;
  async = require('async');
}
PubSub = (function() {
  __extends(PubSub, EventEmitter);
  function PubSub() {
    this.subscribers = {};
    this.delim = [' ', '.', '/'];
    this.pattern = /[\x20. \/]/;
  }
  PubSub.prototype.routes = function(channel) {
    var routes;
    channel = channel.split(this.pattern);
    routes = [];
    _.each(channel, function(v, k) {
      return routes[k] = _.reduce(channel.slice(k), function(memo, next) {
        return memo + '.' + next;
      });
    });
    return [].concat(routes);
  };
  PubSub.prototype.pub = function(channel, message) {
    var responders, routes;
    routes = this.routes(channel);
    responders = [];
    return _.each(routes, __bind(function(r) {
      return _(this.subscribers[r]).chain().reject(__bind(function(sub) {
        return responders.indexOf(sub) !== -1;
      }, this)).each(__bind(function(sub) {
        responders.push(sub);
        return sub(message);
      }, this));
    }, this));
  };
  PubSub.prototype.sub = function(channel, listener) {
    var _base;
    return this.subscribers[channel] = ((_base = this.subscribers)[channel] || (_base[channel] = [])).concat(listener);
  };
  PubSub.prototype.unsub = function(listener) {
    return _.flatten(this.subscribers, function(s) {
      return console.log(s.toString());
    });
  };
  return PubSub;
})();
if (server) {
  module.exports = PubSub;
}