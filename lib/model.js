if(typeof window == 'undefined'){
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

   if(typeof attribs['id'] == 'undefined'){
      attribs['id'] = uuid().toLowerCase();
   }
   
   _.extend(this.attribs, attribs);
   
   this.tracked = this.tracked || [];
   this.track(Object.keys(this.tracked));
   
   this.middleware = this.middleware 
}

inherits(Model, EventEmitter);