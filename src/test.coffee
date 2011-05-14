$           = require('jquery')
Controller  = require('./').Controller

$('<div id="test"></div>').appendTo('body')

c = new Controller(test: $('body'))
i = 0

c.on 'test #test click', (e)->
  console.log i++

$('#test').trigger('click')