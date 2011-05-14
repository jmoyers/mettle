var Model, dump, m, sanitize, validator, _;
Model = require('./model');
validator = require('validator');
sanitize = validator.sanitize;
_ = require('underscore');
m = new Model({
  test: '',
  num: 0
});
dump = function(label) {
  return function(attribs, cb) {
    cb || (cb = function() {});
    console.log('===' + label + '===');
    console.log(attribs);
    return cb(attribs);
  };
};
m.on('change', dump('general change'));
m.on('test.change', dump('test changed'));
m.on('num.change', dump('num changed'));
m.use(dump('start middleware'));
m.use(function(attribs, cb) {
  var k, v;
  for (k in attribs) {
    v = attribs[k];
    attribs[k] = sanitize(v).entityEncode();
  }
  return cb(attribs);
});
m.use('num', function(val, cb) {
  return cb(sanitize(val).toInt());
});
m.use(dump('end middlware'));
m.test = '<some>sweet</html>';
m.num = '0123';
m.set('test', 'this is indeed a <a href="test">test</a>', function(attribs) {});