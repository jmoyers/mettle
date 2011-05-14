Model = require('../lib/model')

josh = new Model({
  test:'josh'
})

josh.set('test2', 'lol')
josh.test = 'lol2'