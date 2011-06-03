var PubSub, server;
if (!(typeof window !== "undefined" && window !== null)) {
  server = true;
}
PubSub = (function() {
  function PubSub() {
    this.listeners = {
      'root': {}
    };
    this.root = this.listeners['root'];
    this.delim = '.';
    this.wildcard = '*';
  }
  PubSub.prototype.getListeners = function(channel) {
    var bcounter, branch, branches, curr, freak, freaks, listeners, numbranches, trail, walk, wanderer, _i, _j, _k, _l, _len, _len2, _len3, _len4, _len5, _ref, _ref2, _results;
    branches = ['root'].concat(channel.split(this.delim));
    numbranches = branches.length;
    curr = this.listeners;
    listeners = [];
    walk = function(a, b) {
      var i, len, _ref;
      len = a.length > b.length ? b.length : a.length;
      for (i = 0, _ref = len - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
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
            if (walk(trail.reverse(), freak.markers.reverse())) {
              listeners.push(freak.listener);
            }
          }
          return listeners;
        } else {
          for (_j = 0, _len3 = freaks.length; _j < _len3; _j++) {
            freak = freaks[_j];
            listeners.push(freak.listener);
          }
          return listeners;
        }
      } else if (bcounter < (numbranches - 1)) {
        _ref = curr.wanderers;
        for (_k = 0, _len4 = _ref.length; _k < _len4; _k++) {
          wanderer = _ref[_k];
          if (walk(trail.reverse(), wanderer.markers.reverse())) {
            listeners.push(wanderer.listener);
          }
        }
      } else {
        _ref2 = curr.wanderers;
        for (_l = 0, _len5 = _ref2.length; _l < _len5; _l++) {
          wanderer = _ref2[_l];
          listeners.push(wanderer.listener);
        }
        return listeners.concat(curr.listeners || []);
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
    branches = channel.split(this.delim);
    curr = (this.root || (this.root = {}));
    for (i = 0, _len = branches.length; i < _len; i++) {
      p = branches[i];
      curr.wanderers || (curr.wanderers = []);
      curr.ghosts || (curr.ghosts = []);
      curr.listeners || (curr.listeners = []);
      curr.ghosts.push({
        listener: listener,
        markers: branches.slice(i)
      });
      if (p === this.wildcard) {
        curr.wanderers.push({
          listener: listener,
          markers: branches.slice(i + 1)
        });
        return;
      } else {
        curr = (curr[p] || (curr[p] = {}));
      }
    }
    (curr.listeners || (curr.listeners = [])).push(listener);
    curr.wanderers || (curr.wanderers = []);
    return curr.ghosts || (curr.ghosts = []);
  };
  PubSub.prototype.on = PubSub.prototype.addListener;
  PubSub.prototype.sub = PubSub.prototype.addListener;
  PubSub.prototype.removeListener = function(listener) {};
  return PubSub;
})();
if (server) {
  module.exports = PubSub;
}