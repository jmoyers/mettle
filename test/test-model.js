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
   // 'model change event:': function(before){
   //    var m    = new Model(josh.json()),
   //       count = 0;
   //    
   //    m.on('change', function(attribs){
   //       attribs.should.have.property('name', 'Yolanda');
   //       attribs.should.have.property('phone', '555-555-5555');
   //       attribs.should.have.property('age', 26);
   //       count++;
   //    });
   //    
   //    m.name = 'Yolanda';
   //    
   //    before(function(){
   //       count.should.equal(1);
   //    });
   // },
   // 
   // 'attribute change event': function(before){
   //    var m    = new Model(josh.json()),
   //       count = 0;
   // 
   //    m.on('age.change', function(val){
   //       val.should.equal(33);
   //       count++;
   //    });
   // 
   //    m.age = 33;
   // 
   //    before(function(){
   //       count.should.equal(1);
   //    });
   // },
   // 
   // 'middleware ordering' : function(before){
   //    var m    = new Model(josh.json()),
   //       count = 0;
   //    
   //    m.use(function(attribs, cb){
   //       count.should.equal(0);
   //       count++;
   //       attribs['name'] = 'Hey';
   //       cb(attribs);
   //    });
   //    
   //    m.use(function(attribs, cb){
   //       attribs.should.have.property('name', 'Hey');
   //       count.should.equal(1);
   //       count++;
   //       attribs['name'] = "you";
   //       cb(attribs);
   //    });
   //    
   //    m.use(function(attribs, cb){
   //       attribs.should.have.property('name', 'you');
   //       count.should.equal(2);
   //       count++;
   //       attribs['name'] = "guuuuuyyysss";
   //       cb(attribs);
   //    });
   //    
   //    m.name = 'Kickoff';
   //    
   //    before(function(){
   //       count.should.equal(3);
   //    });
   // },
   
   'attribute middleware' : function(before){
      var m    = new Model(josh.json()),
         count = 0;
         
      m.use('name', function(val, cb){
         count.should.equal(0);
         count++;
         val = "Hey";
         cb(val);
      });

      m.use('name', function(val, cb){
         val.should.equal("Hey");
         count.should.equal(1);
         count++;
         val = "you";
         cb(val);
      });

      m.use('name', function(val, cb){
         val.should.equal("you");
         count.should.equal(2);
         val = "guuuuuyssss";
         count++;
         cb(val);
      });

      m.name = 'Kickoff';
      
      before(function(){
         count.should.equal(3);
      });
   }
}