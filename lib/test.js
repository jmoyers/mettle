var $;
$ = require('jquery');
$('<div id="test"></div>').appendTo('body');
$('#test').click(function() {
  return console.log('test');
});
$('#test').trigger('click');