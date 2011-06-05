if (typeof window == 'undefined') {
   var EventEmitter  = require('events').EventEmitter,
      _              = require('underscore'),
      uuid           = require('node-uuid'),
      async          = require('async'),
      inherits       = require('util').inherits,
      server         = true;
}

function Model(attribs){
   EventEmitter.call(this);

   attribs = attribs || {};   
   this.attribs = this.attribs || {};

   if (typeof attribs['id'] == 'undefined') {
      attribs['id'] = uuid().toLowerCase();
   }
   
   _.extend(this.attribs, attribs);
   
   this.tracked = this.tracked || [];
   this.track(Object.keys(this.attribs));
   
   this.middleware = this.middleware || [];

   this.configure();
}

inherits(Model, EventEmitter);

Model.prototype.configure = function(){}

Model.prototype.route = function(){
   return this.constructor.name.toLowerCase() + '/' + this.id;
}

Model.prototype.use = function(attr, fn){
   if (typeof attr == 'function') {
      fn    = attr;
      attr  = 'any';
   }   
   // Modify callback such that if we are targetting a specific property
   // we are only dealing with the value rather than the entire hash
   if (attr != 'any') {
      old = fn;
      fn = _.bind(function(old, attribs, cb){
         old(attribs[attr], function(val){
            attribs[attr] = val;
            cb(attribs);
         });
      }, this, old);
   }
   
   this.middleware.push({
      type  : attr,
      fn    : fn
   });
}

Model.prototype.track = function(keys){
   for(var i=0; i<keys.length;i++){
      if (~this.tracked.indexOf(keys[i])) continue;
      this.tracked.push(keys[i]);
      this.__defineGetter__(keys[i], _.bind(function(key){
         return this.get(keys[i]);
      }, this, keys[i]));
      this.__defineSetter__(keys[i], _.bind(function(key, val){
         return this.set(key, val);
      }, this, keys[i]));
   }
}

Model.prototype.filterMiddleware = function(initialData){
   var targets = Object.keys(initialData);
   
   var set = _(this.middleware).select(function(m){
      return m.type == 'any' || ~targets.indexOf(m.type);
   }).map(function(m){
      return m.fn;
   });
   
   return function(attribs, cb){
      if (typeof attribs == 'function') {
         cb       = attribs;
         attribs  = initialData;
      }
      
      set = _.map(set, _.bind(function(m){
         return _.bind(function(attribs, cb){
            m.call(this, attribs, function(attribs){
               cb(null, attribs);
            });
         }, this);
      }, this));
      
      set = [function(cb){
         cb(null, attribs);
      }].concat(set);
      
      async.waterfall(set, cb);
   }
}

Model.prototype.set = function(){
   var attribs = false,
      key      = false,
      val      = false,
      quiet    = false,
      me       = this,
      args     = Array.prototype.slice.call(arguments);
   
   if (typeof arguments[0] != 'object') {
      key   = args[0];
      val   = args[1];
      quiet = typeof args[2] == 'function' ? false : args[2];
      cb    = typeof args[2] == 'function' 
         ? args[2]
         : typeof args[3] == 'function' ? args[3] : function(){};
      attribs = {}
      attribs[key] = val;
   } else {
      attribs  = args[0];
      quiet    = typeof args[1] == 'function' ? false : args[1];
      cb       = typeof args[1] == 'function' 
         ? args[1]
         : typeof args[2] == 'function' ? args[2] : function(){};
   }
         
   old = cb;
   
   cb = function(err, attribs){
      old.call(me, me.json());
   }
   
   var commit = function(attribs, cb){
      var keys = Object.keys(attribs);
      
      for (var i=0;i<keys.length;i++) {
         if (typeof me.attribs[keys[i]] == 'undefined') {
            me.track([keys[i]]);
         }
         me.attribs[keys[i]] = attribs[keys[i]];
      }
      
      if (!quiet) {
         me.emit('change', me.attribs);
         
         for (var i=0;i<keys.length;i++) {
            var type = keys[i] + '.change';
            me.emit(type, me.attribs[keys[i]]);
         }
      }
      
      cb(null, attribs);
   }
   
   async.waterfall([
      me.filterMiddleware(attribs),
      commit
   ], cb);
      
   return this;
}

Model.prototype.get = function(key){
   return this.attribs[key];
}

Model.prototype.json = function(){
   return this.attribs;
}

if (server) {
   module.exports = Model;
}