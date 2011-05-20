_ = require('underscore')

module.exports.createLink = (model, socket)->
  # prevent cyclic change events
  curr = {}
  
  model.on 'change', (attribs)->
    if _.isEqual(attribs, curr) then return
    
    update = 
      type  : 'update',
      id    : attribs.id,
      data  : attribs
    
    socket.send(update)

  socket.on 'message', (message)->
    if message.type? and message.type == 'update' and message.id == model.id
      curr = message.data
      model.set curr, no, ()->
        curr = {}
