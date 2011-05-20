var _;
_ = require('underscore');
module.exports.link = function(model, socket) {
  var curr;
  curr = {};
  model.on('change', function(attribs) {
    var update;
    if (_.isEqual(attribs, curr)) {
      return;
    }
    update = {
      type: 'update',
      id: attribs.id,
      data: attribs
    };
    return socket.send(update);
  });
  return socket.on('message', function(message) {
    if ((message.type != null) && message.type === 'update' && message.id === model.id) {
      curr = message.data;
      return model.set(curr, false, function() {
        return curr = {};
      });
    }
  });
};