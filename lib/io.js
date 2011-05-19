module.exports.createLink = function(model, socket) {
  model.on('change', function(attribs) {
    var update;
    update = {
      type: 'update',
      id: attribs.id,
      data: attribs
    };
    return socket.send(update);
  });
  return socket.on('message', function(message) {
    if ((message.type != null) && message.type === 'update' && message.id === model.id) {
      return model.set(message.data);
    }
  });
};