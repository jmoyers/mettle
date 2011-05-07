if (module) {
  var inherits    = require('util').inherits,
    EventEmitter  = require('events').EventEmitter,
    _             = require('underscore');
}


function Model(attribs){
  EventEmitter.apply(this, arguments);
  this._attributes = attribs || {};
  this.track(Object.keys(this._attributes));
}

inherits(Model, EventEmitter);

Model.prototype.track = function(keys){
  keys = _.isArray(keys)
    ? keys
    : [keys];
  
  var me = this;

  _.each(keys, function(key){
    me.__defineGetter__(key, function(){
      return me.get(key);
    })

    me.__defineSetter__(key, function(val){
      return me.set(key, val);
    });
  });
  
  return me;
}

Model.prototype.get = function(key, val){
  return this._attributes[key];
}

Model.prototype.set = function(key, val){
  this._attributes[key] = val;
  this.emit('change', {}[key] = val);
}

if (module) {
  module.exports = Model;
}