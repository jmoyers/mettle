if not window?
  _             = require('underscore')
  EventEmitter  = require('events').EventEmitter

extend = _.extend
  
class Controller extends EventEmitter
  constructor: (attribs) ->
    attribs or= {}
    @events or= {}
    
    _.each attribs, (val, key)=>
      @[key] = val
    
    _.each @events, (fn, event)=>
      @on(event, fn)
            
  on: (type, fn) ->
    fn or= ()->
    
    type = @parse type
    
    if not tobind = @[type.attr]
      return
      
    if type.qual && tobind.find?
      tobind = tobind.find(type.qual)
    
    @binder(tobind) type.event, fn
    super type, fn
    
  binder: (o) ->
    binder = ['on', 'bind'];
    for b in binder
      if typeof o[b] == 'function'
        return ()->
          o[b].apply(o, arguments)
    return ()->
        
  parse: (str) ->
    EVENT = ///
      ^([^\x20.]+)            # attribute
      (?:[\x20.])?(.+)?       # further qualifier/selector (optional)
      (?:[\x20.])([^\x20.]+)$ # event
    ///
    
    [match, attr, qual, event] = EVENT.exec(str) or ['','','','']
    
    return {
      attr  : attr
      qual  : qual
      event : event
    }
        
if not window?
  module.exports = Controller