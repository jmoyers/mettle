if not window?
  _             = require('underscore')
  Model         = require('./model')
  
class Controller extends Model
  constructor: (attribs) ->
    super attribs
    
    @bindings or= {}

    _.each @bindings, (event, key)=>
      console.log key, event
      @on(key, event)
      
  on: (type, fn) ->
    fn or= ()->
    
    console.log type
    type = @parse type
    console.log type, ''
    
    if not tobind = @attribs[type.attr]
      return
    
    if type.qual && tobind.find?
      tobind = tobind.find(type.qual)
    else if type.qual and @attribs[type.attr][type.qual]?
      type.event = type.qual + '.' + type.event
    
    @binder(tobind) type.event, fn
    super type, fn
    
  bind: (o,f)->
    return f.apply(o)
    
  binder: (o) ->
    binder = ['on', 'bind'];
    for b in binder
      if typeof o[b] == 'function'
        return ()->
          o[b].apply(o, arguments)
    return ()->
        
  parse: (str) ->
    EVENT = ///
      ^([^\x20.]+)                # attribute
      (?:[\x20.])?(.+)?          # further qualifier/selector (optional)
      (?:[\x20.])([^\x20.]+)$    # event
    ///
    
    [match, attr, qual, event] = EVENT.exec(str) || ['','','','']
    
    return {
      attr  : attr
      qual  : qual
      event : event
    }
        
if not window?
  module.exports = Controller