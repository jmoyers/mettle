if (typeof(window) == 'undefined') {
  var inherits    = require('util').inherits,
    EventEmitter  = require('events').EventEmitter,
    _             = require('underscore');
}


function Model(attribs){
  EventEmitter.apply(this, arguments);
  attribs || {};
  this._attributes = this._attribues || attribs;
  this._attributes = _.extend(this.attribues, attribs);
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
  
  return keys;
}

Model.prototype.get = function(key, val){
  return this._attributes[key];
}

Model.prototype.set = function(key, val, quiet){
  this._attributes[key] = val;
  if (!quiet) {
    this.emit('change', {}[key] = val);
  }
  return this;
}

Model.prototype.source = function(a){
 
}

if (typeof(window) == 'undefined') {
  module.exports = Model;
}