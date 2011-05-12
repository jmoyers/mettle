if (typeof(window) == 'undefined') {
  var inherits    = require('util').inherits,
    Model         = require('./model');
}

function User(attribs){
  Model.apply(this, arguments);
  
  this._attributes = {
    name      : '',
    location  : {}
  }
}

inherits(User, Model);

if (typeof(window) == 'undefined') {
  module.exports = User;
}