(function() {
  var $, Controller, Model, josh, should;
  Controller = require('controller');
  Model = require('model');
  should = require('should');
  $ = require('jquery');
  process.setMaxListeners(20);
  josh = new Model({
    name: 'Joshua Moyers',
    phone: '555-555-5555',
    age: 26
  });
  $("<div id='test'></div>").appendTo("body");
  module.exports = {
    'event delegation': function(beforeEnd) {
      var c, i;
      c = new Controller({
        model: new Model(josh.json())
      });
      i = 0;
      c.on('model.change', function(attribs) {
        attribs.should.have.property('name', 'Joshua Moyers');
        attribs.should.have.property('age', 52);
        return i++;
      });
      c.model.age = 52;
      return beforeEnd(function() {
        return i.should.equal(1);
      });
    },
    'attribute selector event': function(beforeEnd) {
      var c, y;
      c = new Controller({
        view: $
      });
      y = 0;
      c.on('view.#test.click', function(attribs) {
        return y++;
      });
      $('#test').trigger('click');
      return beforeEnd(function() {
        return y.should.equal(1);
      });
    }
  };
}).call(this);
