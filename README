Ex:
===========
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
    
Output
============
    ===start middleware===
    { test: '<some>sweet</html>' }
    ===start middleware===
    { num: '0123' }
    ===start middleware===
    { test: 'this is indeed a <a href="test">test</a>' }
    ===end middlware===
    { test: '&lt;some&gt;sweet&lt;/html&gt;' }
    ===end middlware===
    { test: 'this is indeed a &lt;a href=&quot;test&quot;&gt;test&lt;/a&gt;' }
    ===general change===
    { id: 'E12E0D5D-6054-48A5-B2A5-A5C0B8654331',
      test: '&lt;some&gt;sweet&lt;/html&gt;',
      num: 0 }
    ===test changed===
    &lt;some&gt;sweet&lt;/html&gt;
    ===end middlware===
    { num: 123 }
    ===general change===
    { id: 'E12E0D5D-6054-48A5-B2A5-A5C0B8654331',
      test: 'this is indeed a &lt;a href=&quot;test&quot;&gt;test&lt;/a&gt;',
      num: 0 }
    ===test changed===
    this is indeed a &lt;a href=&quot;test&quot;&gt;test&lt;/a&gt;
    ===general change===
    { id: 'E12E0D5D-6054-48A5-B2A5-A5C0B8654331',
      test: 'this is indeed a &lt;a href=&quot;test&quot;&gt;test&lt;/a&gt;',
      num: 123 }
    ===num changed===
    123
