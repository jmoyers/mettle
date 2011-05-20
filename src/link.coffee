_ = require('underscore')

module.exports.link = (model, socket)->
  curr = {}
  
  model.on 'change', (attribs)->
    if _.isEqual(attribs, curr) then return
    
    update =
      route : model.route(),
      data  : attribs
    
    socket.send(update)

  socket.on 'message', (message)->
    if message.route? and message.route == model.route()
      curr = message.data
      model.set curr, no, ()->
        curr = {}