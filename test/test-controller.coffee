Controller= require('controller')
Model     = require('model')
should    = require('should')
$         = require('jquery');

process.setMaxListeners(20)

josh = new Model({
  name    : 'Joshua Moyers',
  phone   : '555-555-5555',
  age     : 26
})

# Set up test jquery div to pump events through
$("<div id='test'></div>").appendTo("body");

module.exports = 
  'event delegation': (beforeEnd)->
    c = new Controller(model:new Model(josh.json()))
    i = 0
    
    c.on 'model.change', (attribs)->
      attribs.should.have.property('name', 'Joshua Moyers')
      attribs.should.have.property('age', 52)
      i++
    
    c.model.age = 52
    
    beforeEnd ()->
      i.should.equal(1)
  
  'attribute selector event': (beforeEnd)->
    c = new Controller(view:$)
    y = 0
    
    c.on 'view.#test.click', (attribs)->
      y++
    
    $('#test').trigger('click')
            
    beforeEnd ()->
      y.should.equal(1)
    
      
      