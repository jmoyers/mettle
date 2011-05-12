(function() {
  var Controller, Model, c;
  Controller = require('./controller');
  Model = require('./model');
  c = new Controller({
    attr: 'test',
    model: new Model({
      test: 'testing',
      foo: 'test'
    })
  });
  c.on('model.change', function(e) {
    return console.log(e);
  });
  c.on('model.test.change', function(e) {
    return console.log(e);
  });
  c.model.test = 'test';
  c.model.foo = 'foo';
}).call(this);
