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
reset = '''
  <div id='view'>
    <div class='name'>Josh</div>
    <div class='phone'>555-565-5555</div>
    <div class='age'>24</div>
  </div>
  '''

$('body').html(reset);

module.exports = 
  'event delegation': (beforeEnd)->
    p = new Model(josh.json())
    c = new Controller(person: p)
    i = 0
    
    c.on 'person.change', (attribs)->
      attribs.should.have.property('name', 'Joshua Moyers')
      attribs.should.have.property('age', 52)
      i++
    
    c.person.age = 52
    
    beforeEnd ()->
      i.should.equal(1)
  
  'jquery "attrib.selector.event" delegate': (beforeEnd)->
    c = new Controller 
      view : $('#view')
      
    x = xx = 0
    
    c.on 'view..name.click', (e)->
      x++
    
    c.on 'view .name click', (e)->
      xx++
      
    
    c.view.find('.name').click();
            
    beforeEnd ()->
      x.should.equal(1)
      xx.should.equal(1)
    
      
      