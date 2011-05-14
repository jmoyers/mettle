Model     = require('model')
validator = require('validator')
sanitize  = validator.sanitize
should    = require('should')

josh = new Model({
  name    : 'Joshua Moyers',
  phone   : '555-555-5555',
  age     : 26
})

module.exports = 
  'model change event': (beforeEnd)->
    m   = new Model(josh.json())
    cb  = 0

    m.on 'change', (attribs)->
      attribs.should.have.property('name', 'Yolanda')
      attribs.should.have.property('phone', '555-555-5555')
      attribs.should.have.property('age', 26)
      cb++
    
    m.name = 'Yolanda'

    beforeEnd ()->
      cb.should.equal(1)
      
  'attribute change event': (beforeEnd)->
    m = new Model(josh.json())
    cb = 0
    
    m.on 'age.change', (val)->
      val.should.equal(33)
      cb++
      
    m.age = 33
    
    beforeEnd ()->
      cb.should.equal(1)
    
  'test middleware ordering': (beforeEnd)->
    m = new Model(josh.json())
    count = 0
    
    m.use (attribs, cb)->
      count.should.equal(0)
      count++
      cb(attribs)
    
    m.use (attribs, cb)->
      setTimeout(()->
        count.should.equal(1)
        count++
        cb(attribs)
      , 200)
      
    m.use (attribs, cb)->
      setTimeout(()->
        count.should.equal(2)
        count++
        cb(attribs)
      , 200)
      
    m.name = 'Kickoff'
    
    beforeEnd ()->
      count.should.equal(3)
            
      
      