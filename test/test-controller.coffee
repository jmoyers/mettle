Controller= require('controller')
Model     = require('model')
should    = require('should')
$         = require('jquery')

josh = new Model({
  name    : 'Joshua Moyers',
  phone   : '555-555-5555',
  age     : 26
})

# Set up test jquery div to pump events through
reset = '''
        <div id='view'>
          <input class='name' value='' type='text'></input>
          <input class='phone' value='' type='text'></input>
          <input class='age' value='' type='text'></input>
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
      
  'bad view selector': (beforeEnd)->
    c = new Controller
      view : {}
    
    c.on 'view.selector.click'
      
  'jquery "attrib.event" delegate': (beforeEnd)->
    c = new Controller
      nameView : $('#view').find('.name')
    
    typing  = 'Howdy'
    len     = typing.length
    i       = 0
    
    
    c.on 'nameView.keypress', (e)->
      $(this).val().should.equal(typing.substr(0, i))
    
    while len-- > 0
      # trigger keypress doesn't cause the value to update
      char = typing.charAt(i++)
      c.nameView.val c.nameView.val()+char
      c.nameView.trigger
        type  : 'keypress', 
        which : char.charCodeAt(0)
        
    beforeEnd ()->
      i.should.equal(typing.length)
        
  'non-existent selector': ()->
    c = new Controller
    
    c.on 'non', ()->
      
  
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
    
      
      