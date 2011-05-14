var $, Controller, c, i;
$ = require('jquery');
Controller = require('./').Controller;
$('<div id="test"></div>').appendTo('body');
c = new Controller({
  test: $('body')
});
i = 0;
c.on('test #test click', function(e) {
  return console.log(i++);
});
$('#test').trigger('click');