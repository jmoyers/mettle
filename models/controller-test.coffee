Controller = require('./controller')
Model = require('./model')

c = new Controller({
  attr: 'test'
  model: new Model({
    test: 'testing',
    foo: 'test'
  })
})

c.on 'attr sel name'
c.on 'attr div#id event'
c.on 'attr .class event'
c.on 'attr event'
c.on 'name eventtype'

c.on 'model.change', (e) ->
  console.log e
  
c.on 'model.test.change', (e) ->
  console.log e

c.model.test = 'test'
c.model.foo = 'foo'
