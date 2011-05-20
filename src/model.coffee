if not window?
  EventEmitter  = require('events').EventEmitter
  _             = require('underscore')
  uuid          = require('node-uuid')
  server        = yes
  async         = require('async')

extend          = _.extend
keys            = Object.keys

class Model extends EventEmitter
  constructor: (attribs) ->
    attribs or= {}
    @attribs or= {}
    
    if not @attribs['id']?
      @attribs['id'] = uuid().toLowerCase()
    
    @attribs = extend(@attribs, attribs)

    @tracked or= []
    @track keys(@attribs)
    
    # all and targetted middleware
    @middleware or= []
    
    # empty in base class, used in conjuction with
    # @use to set up validation and such like express
    @configure
    
  configure: ()->
        
  use: (attr, fn) -> 
    if typeof attr == 'function'
      fn    = attr
      attr  = 'any'
    
    # Modify callback signature so that it takes a value
    # and can modify it on the return cb, for targetted mw
    if attr != 'any'
      _oldfn = fn
      fn = (attribs, cb)->
        _oldfn(attribs[attr], (val)->
          attribs[attr]=val
          cb(attribs)
        )
    
    m = 
      type: attr
      fn  : fn
    
    (@middleware or= []).push(m)
      
    
  track: (keys) ->
    _.each keys, (key) =>
      @tracked.push(key)
      @__defineGetter__ key, () =>
        @get(key)
      @__defineSetter__ key, (val) =>
        @set(key, val)
    
    return @

  filterMiddleware: (initialData) ->
    targets = []
    
    targets = keys(initialData)
    
    middle = _(@middleware).select((m)->
      return m.type == 'any' or m.type in targets
    ).map((m)->
      return m.fn
    )
    
    # now we normalize the callbacks in the middlware list to conform
    # to either function(val) or function(attributes hash). we're going
    # to drop the err from async
    return (attribs, cb)=>
      if typeof attribs == 'function'
        cb = attribs
        attribs = initialData
        
      # favor simplicity and drop err from function signature
      middle = _.map middle, (m)=>
        return (attribs, cb)=>
          m.call @, attribs, (attribs)->
            cb null, attribs
      
      # since the first callback only receives one param (the cb)
      # in async.waterfall, we're going to take over the first position
      # and normalize so that all take (attributes, cb) -- the first param
      # is null because async.waterfall expects an err object there
      middle = [(cb)->
        cb(null, attribs)
      ].concat(middle)
      
      async.waterfall(middle, cb)
   
  set: () ->
    attribs = key = val = quiet = false
    if typeof arguments[0] != 'object'
      [key, val, quiet, cb] = arguments
      attribs = {}
      attribs[key] = val
    else
      [attribs, quiet, cb] = arguments
        
    if typeof quiet == 'function'
      cb    = quiet
      quiet = false
    
    cb or= ()->
        
    _oldcb = cb
    
    cb = (err, attribs)=>
      _oldcb.call @, @json()
      
    commit = (attribs, cb)=>
      _.each attribs, (v, k)=>
        # Lets track this key if we're not already
        if k not in @tracked
          @track([k])

        @attribs[k] = v
      
      if not quiet
        # general, idempotent
        @emit 'change', @attribs

        # more targetted
        _.each attribs, (v, k)=>
          type = k + '.change'
          @emit type, v        

      cb(null, @attribs)
    
    async.waterfall([
      @filterMiddleware(attribs),
      commit
    ],cb)
        
    return @
      
  get: (key) ->
    return @attribs[key]
  
  json: ()->
    return @attribs
    
if not window?
  module.exports = Model