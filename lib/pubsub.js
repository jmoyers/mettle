var EventEmitter, PubSub, async, server, uuid, _;
if (!(typeof window !== "undefined" && window !== null)) {
  EventEmitter = require('events').EventEmitter;
  _ = require('underscore');
  uuid = require('node-uuid');
  async = require('async');
  server = true;
}
PubSub = (function() {
  function PubSub() {
    this.listeners = {
      'root': {}
    };
    this.root = this.listeners['root'];
    this.delim = [' ', '.', '/'];
    this.pattern = /[\x20. \/]/;
    this.wildcard = '*';
  }
  PubSub.prototype.getListeners = function(channel) {
    var bcounter, branch, branches, curr, diff, freak, freaks, listeners, match, numbranches, trail, walk, _i, _len, _len2, _results;
    branches = ['root'].concat(channel.split(this.pattern));
    numbranches = branches.length;
    curr = this.listeners;
    listeners = [];
    walk = function(a, b) {
      var i, v, _len;
      for (i = 0, _len = a.length; i < _len; i++) {
        v = a[i];
        if (a[i] !== b[i]) {
          return false;
        }
      }
      return true;
    };
    _results = [];
    for (bcounter = 0, _len = branches.length; bcounter < _len; bcounter++) {
      branch = branches[bcounter];
      if (typeof curr[branch] === 'object') {
        curr = curr[branch];
      }
      trail = branches.slice(bcounter + 1);
      if (branch === this.wildcard) {
        freaks = curr.ghosts.concat(curr.wanderers);
        if (bcounter < (numbranches - 1)) {
          for (_i = 0, _len2 = freaks.length; _i < _len2; _i++) {
            freak = freaks[_i];
            diff = freak.markers.length - trail.length;
            match = diff >= 0 && walk(trail.reverse(), freak.markers.reverse());
            if (match) {
              listeners.push(freak.listener);
            }
          }
          return listeners;
        } else {
          return _.pluck(freaks, 'listener');
        }
      } else if (bcounter < (numbranches - 1)) {
        listeners = listeners.concat(_.pluck(curr.wanderers, 'listener'));
      } else {
        return listeners.concat(_.pluck(curr.wanderers, 'listener')).concat(curr.listeners || []);
      }
    }
    return _results;
  };
  PubSub.prototype.emit = function(channel, message) {
    var listener, set, _i, _len, _results;
    set = this.getListeners(channel) || [];
    _results = [];
    for (_i = 0, _len = set.length; _i < _len; _i++) {
      listener = set[_i];
      _results.push(listener(message));
    }
    return _results;
  };
  PubSub.prototype.pub = PubSub.prototype.emit;
  PubSub.prototype.trigger = PubSub.prototype.emit;
  PubSub.prototype.addListener = function(channel, listener) {
    var branches, curr, i, p, _len;
    branches = channel.split(this.pattern);
    curr = (this.root || (this.root = {}));
    for (i = 0, _len = branches.length; i < _len; i++) {
      p = branches[i];
      curr.wanderers || (curr.wanderers = []);
      curr.ghosts || (curr.ghosts = []);
      curr.ghosts.push({
        listener: listener,
        markers: branches.slice(i)
      });
      if (p === this.wildcard) {
        curr.wanderers.push({
          listener: listener,
          markers: branches.slice(i)
        });
        return;
      } else {
        curr = (curr[p] || (curr[p] = {}));
      }
    }
    return (curr.listeners || (curr.listeners = [])).push(listener);
  };
  PubSub.prototype.on = PubSub.prototype.addListener;
  PubSub.prototype.sub = PubSub.prototype.addListener;
  PubSub.prototype.removeListener = function(listener) {
    return _.flatten(this.listeners, function(s) {
      return console.log(s.toString());
    });
  };
  return PubSub;
})();
if (server) {
  module.exports = PubSub;
}