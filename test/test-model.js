(function() {
  var Model, josh, sanitize, should, validator;
  Model = require('model');
  validator = require('validator');
  sanitize = validator.sanitize;
  should = require('should');
  process.setMaxListeners(20);
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
    'middleware ordering': function(beforeEnd) {
      var count, m;
      m = new Model(josh.json());
      count = 0;
      m.use(function(attribs, cb) {
        count.should.equal(0);
        count++;
        attribs['name'] = 'Hey';
        return cb(attribs);
      });
      m.use(function(attribs, cb) {
        return setTimeout(function() {
          count.should.equal(1);
          attribs.should.have.property('name', 'Hey');
          count++;
          attribs['name'] = "You";
          return cb(attribs);
        }, 200);
      });
      m.use(function(attribs, cb) {
        return setTimeout(function() {
          count.should.equal(2);
          attribs.should.have.property('name', 'You');
          count++;
          return cb(attribs);
        }, 200);
      });
      m.name = 'Kickoff';
      return beforeEnd(function() {
        return count.should.equal(3);
      });
    },
    'attribute middleware': function(beforeEnd) {
      var count, m;
      m = new Model(josh.json());
      count = 0;
      m.use('name', function(val, cb) {
        val.should.equal('Hey');
        count++;
        return cb('Josh');
      });
      m.use('name', function(val, cb) {
        val.should.equal('Josh');
        count++;
        return cb('Man');
      });
      m.use('name', function(val, cb) {
        val.should.equal('Man');
        return count++;
      });
      m.name = 'Hey';
      return beforeEnd(function() {
        return count.should.equal(3);
      });
    },
    'multi set': function(beforeEnd) {
      var count, m;
      m = new Model(josh.json());
      count = 0;
      m.set({
        name: 'Yolanda',
        phone: 'sexy times'
      }, function(attribs) {
        m.name.should.equal('Yolanda');
        m.phone.should.equal('sexy times');
        m.age.should.equal(26);
        return count++;
      });
      return beforeEnd(function() {
        return count.should.equal(1);
      });
    },
    'new variable gets tracked': function(beforeEnd) {
      var count, m;
      m = new Model(josh.json());
      count = 0;
      m.set('stinks', true, function(attribs) {
        attribs.should.have.property('stinks', true);
        count++;
        m.on('stinks.change', function(val) {
          val.should.equal(false);
          return count++;
        });
        return m.stinks = false;
      });
      return beforeEnd(function() {
        return count.should.equal(2);
      });
    },
    'long form asyncronous setter': function(beforeEnd) {
      var count, m;
      m = new Model(josh.json());
      count = 0;
      m.set('phone', 'xxx', function(attribs) {
        attribs.should.have.property('name', 'Joshua Moyers');
        attribs.should.have.property('phone', 'xxx');
        attribs.should.have.property('age', 26);
        count++;
        return m.set('name', 'Yolanda', function(attribs) {
          attribs.should.have.property('name', 'Yolanda');
          attribs.should.have.property('phone', 'xxx');
          attribs.should.have.property('age', 26);
          count++;
          return m.set('age', 55, function(attribs) {
            attribs.should.have.property('name', 'Yolanda');
            attribs.should.have.property('phone', 'xxx');
            attribs.should.have.property('age', 55);
            return count++;
          });
        });
      });
      return beforeEnd(function() {
        return count.should.equal(3);
      });
    }
  };
}).call(this);
