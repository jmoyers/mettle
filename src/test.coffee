$ = require('jquery')

$('<div id="test"></div>').appendTo('body')

$('#test').click ()->
  console.log('test');

$('#test').trigger('click')