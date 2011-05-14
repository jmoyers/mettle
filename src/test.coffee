Model     = require('./model')
validator = require('validator')
sanitize  = validator.sanitize
_         = require('underscore')

m = new Model({
  test  : '',
  num   : 0
})

dump = (label)->
  return (attribs, cb)->
    cb or= ()->
    console.log '===' + label + '==='
    console.log attribs
    cb(attribs)
    
m.on('change', dump('general change'))
m.on('test.change', dump('test changed'))
m.on('num.change', dump('num changed'))

# dump attributes being set
m.use dump('start middleware')

# define a generic html entity encode middleware
m.use (attribs, cb)->
  for k,v of attribs
    attribs[k] = sanitize(v).entityEncode()
  cb(attribs)
  
# define a property specific validator middleware
m.use 'num', (val, cb)->
  cb(sanitize(val).toInt())

# dump properties at the end of the middleware chain for inspection
m.use dump('end middlware')
  
# use fire and forget setters
m.test  = '<some>sweet</html>'
m.num   = '0123'

# use setters with a callback that gives output after mw
m.set('test', 'this is indeed a <a href="test">test</a>', (attribs)->
  # attributes after they've been committed
)