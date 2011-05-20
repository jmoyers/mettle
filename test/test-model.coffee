Model     = require('model')
validator = require('validator')
sanitize  = validator.sanitize
should    = require('should')

process.setMaxListeners(20)

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
    
  'middleware ordering': (beforeEnd)->
    m = new Model(josh.json())
    count = 0
    
    m.use (attribs, cb)->
      count.should.equal(0)
      count++
      attribs['name'] = 'Hey'
      cb(attribs)
    
    m.use (attribs, cb)->
      setTimeout(()->
        count.should.equal(1)
        attribs.should.have.property('name', 'Hey')
        count++
        attribs['name'] = "You"
        cb(attribs)
      , 200)
      
    m.use (attribs, cb)->
      setTimeout(()->
        count.should.equal(2)
        attribs.should.have.property('name', 'You')
        count++
        cb(attribs)
      , 200)
      
    m.name = 'Kickoff'
    
    beforeEnd ()->
      count.should.equal(3)
      
  'attribute middleware': (beforeEnd)->
    m = new Model(josh.json())
    count = 0
    
    m.use 'name', (val, cb)->
      val.should.equal('Hey')
      count++
      cb('Josh')
      
    m.use 'name', (val, cb)->
      val.should.equal('Josh')
      count++
      cb('Man')
      
      
    m.use 'name', (val, cb)->
      val.should.equal('Man')
      count++
      
    m.name = 'Hey'
      
    beforeEnd ()->
      count.should.equal(3)
      
  'multi set': (beforeEnd)->
    m     = new Model(josh.json())
    count = 0
    
    m.set({name: 'Yolanda',phone: 'sexy times'}, (attribs)->
      m.name.should.equal('Yolanda')
      m.phone.should.equal('sexy times')
      m.age.should.equal(26)
      count++
    )
    
    beforeEnd ()->
      count.should.equal(1)
    
  'new variable gets tracked': (beforeEnd)->
    m         = new Model(josh.json())
    count     = 0

    m.set 'stinks', true, (attribs)->
      attribs.should.have.property('stinks', true)
      count++

      m.on 'stinks.change', (val)->
        val.should.equal(false)
        count++

      m.stinks = false
    
    beforeEnd ()->
      count.should.equal(2)
    
  'test default route': (beforeEnd)->
    m = new Model(josh.json());
    m.route().should.equal('model/'+m.id)
    beforeEnd(()->)
  
  'long form asyncronous setter': (beforeEnd)->
    m     = new Model(josh.json())
    count = 0
    
    m.set 'phone', 'xxx', (attribs)->
      attribs.should.have.property('name', 'Joshua Moyers')
      attribs.should.have.property('phone', 'xxx')
      attribs.should.have.property('age', 26)
      
      count++
    
      m.set 'name', 'Yolanda', (attribs)->
        attribs.should.have.property('name', 'Yolanda')
        attribs.should.have.property('phone', 'xxx')
        attribs.should.have.property('age', 26)
        
        count++
        
        m.set 'age', 55, (attribs)->
          attribs.should.have.property('name', 'Yolanda')
          attribs.should.have.property('phone', 'xxx')
          attribs.should.have.property('age', 55)
          
          count++
          
    beforeEnd ()->
      count.should.equal(3)
          
      
      