(function() {
  var Model, async, m;
  Model = require('./model');
  async = require('async');
  m = new Model({
    test: 'test',
    hallo: 'hallo'
  });
  m.use('test', function(val, cb) {
    console.log('in test middleware');
    console.log(arguments);
    return cb(val);
  });
  m.use(function(attribs, cb) {
    console.log('in a generic middleware');
    console.log(arguments);
    return cb(attribs);
  });
  m.set('test', 'man', function(json) {
    return console.log('committed');
  });
}).call(this);
