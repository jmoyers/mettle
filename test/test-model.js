var Model   = require('model'),
   validator= require('validator'),
   sanitize = validator.sanitize,
   should   = require('should');
   
process.setMaxListeners(20);

var josh = new Model({
   name  : 'Joshua Moyers',
   phone : '555-555-5555',
   age   : 26
});

module.exports = {
   'model change event:': function(before){
      var m    = new Model(josh.json()),
         count = 0;
      
      m.on('change', function(attribs){
         attribs.should.have.property('name', 'Yolanda');
         attribs.should.have.property('phone', '555-555-5555');
         attribs.should.have.property('age', 26);
         count++;
      });
      
      m.name = 'Yolanda';
      
      before(function(){
         cound.should.equal(1);
      });
   }
}