if not window?
  EventEmitter  = require('events').EventEmitter
  _             = require('underscore')

extend  = _.extend
keys    = Object.keys

class Model extends EventEmitter
  constructor: (attribs) ->
    attribs or= {}
    @attribs or= {}
    @attribs = extend(@attribs, attribs)
    @track keys(@attribs)
    
  track: (keys) ->
    if not typeof keys == Array
      keys = []
    
    _.each keys, (key) =>
      @__defineGetter__ key, () =>
        @get(key)
      @__defineSetter__ key, (val) =>
        @set(key, val)
    
    return @
          
  set: (key, val, quiet) ->
    @attribs[key] = val
    if not quiet
      # general, idempotent
      @emit 'change', @attribs

      # more targetted
      type = key + '.change'
      @emit type, val
    return @
      
  get: (key) ->
    return @attribs[key]
    
if not window?
  module.exports = Model