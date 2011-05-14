(function() {
  var Model, josh, sanitize, should, validator;
  Model = require('model');
  validator = require('validator');
  sanitize = validator.sanitize;
  should = require('should');
  josh = new Model({
    name: 'Joshua Moyers',
    phone: '555-555-5555',
    age: 26
  });
  module.exports = {
    'model change event': function(beforeEnd) {
      var cb, m;
      m = new Model(josh.json());
      cb = 0;
      m.on('change', function(attribs) {
        attribs.should.have.property('name', 'Yolanda');
        attribs.should.have.property('phone', '555-555-5555');
        attribs.should.have.property('age', 26);
        return cb++;
      });
      m.name = 'Yolanda';
      return beforeEnd(function() {
        return cb.should.equal(1);
      });
    },
    'attribute change event': function(beforeEnd) {
      var cb, m;
      m = new Model(josh.json());
      cb = 0;
      m.on('age.change', function(val) {
        val.should.equal(33);
        return cb++;
      });
      m.age = 33;
      return beforeEnd(function() {
        return cb.should.equal(1);
      });
    },
    'test middleware ordering': function(beforeEnd) {
      var count, m;
      m = new Model(josh.json());
      count = 0;
      m.use(function(attribs, cb) {
        count.should.equal(0);
        count++;
        return cb(attribs);
      });
      m.use(function(attribs, cb) {
        return setTimeout(function() {
          count.should.equal(1);
          count++;
          return cb(attribs);
        }, 200);
      });
      m.use(function(attribs, cb) {
        return setTimeout(function() {
          count.should.equal(2);
          count++;
          return cb(attribs);
        }, 200);
      });
      m.name = 'Kickoff';
      return beforeEnd(function() {
        return count.should.equal(3);
      });
    }
  };
}).call(this);
