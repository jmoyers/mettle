var mettle    = require('../'),
    Model     = mettle.Model,
    Controller= mettle.Controller,
    $         = require('jquery'),
    inherits  = require('util').inherits,
    validator = require('validator')
    sanitize  = validator.sanitize;

// run time extension, track all attributes that are passed in
person = new Model({
  name    : 'josh',
  location: 'sf',
  phone   : 'phone',
  status  : 'reddit is a black hole'
})

// if no id is passed in, a guid will be assigned
console.log('my automatically assigned id: ', person.id);

// generic ordered middleware
person.use(function(attribs, cb){
  // html entity encode all attributes before commit
  for (var key in attribs) {
    attribs[key] = sanitize(attribs[key]).entityEncode()
  }
  
  // pass modified attributes to next middleware
  cb(attribs)
});

// generic property change events
person.on('change', function(attribs){
  console.log('attributes after middleware applied (change event):');
  console.log(attribs);
  console.log('')
});

person.on('name.change', function(val){
  // Any time the name property changes, we get access to its value here
  // middleware has been applied at this point
  console.log('a new name was committed: ', val)
});

// Fire and forget setter
person.status = '<a href="twitter.com/joshuamoyers">My Twitter</a>';
// person.status will be '&lt;a href=&quot;twitter.com/joshuamoyers&quot;&gt;My Twitter&lt;/a&gt;'

// property specific middleware
person.use('name', function(val, cb){
  // make sure we're a string, and force to lower case
  cb(val.toString().toLowerCase());
});

person.name = 'JOSH';
// person.name will be 'josh'

person.set('name', 'joshua Moyers', function(attributes){
  // All middleware has been applied, change events have been fired
  console.log('long form setter callback:');
  console.log(attributes);
  console.log('')
});

// Multi set (one change event fired)
person.set({
  name  : 'Joshua',
  status: 'Hmmmm'
})