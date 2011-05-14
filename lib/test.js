var coffee, test;
coffee = require('coffee-script');
test = require('../test/test-controller.coffee')['jquery "attrib.event" delegate'];
console.log('starting test');
test();
console.log('test over');