Model = require('./model')
async = require('async')

m = new Model({
  test: 'test',
  hallo: 'hallo'
})

m.use 'test', (val, cb) ->
  console.log 'in test middleware'
  console.log arguments
  cb(val)
  
m.use (attribs, cb)->
  console.log 'in a generic middleware'
  console.log arguments
  cb(attribs)

m.set('test', 'man', (json)->
  console.log 'committed'
)