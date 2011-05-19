module.exports.createLink = (model, socket)->
  model.on 'change', (attribs)->
    update = 
      type  : 'update',
      id    : attribs.id,
      data  : attribs
    
    socket.send(update)
    
  socket.on 'message', (message)->
    if message.type? and message.type == 'update' and message.id == model.id
      model.set(message.data)
