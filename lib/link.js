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
      route: model.route(),
      data: attribs
    };
    return socket.send(update);
  });
  return socket.on('message', function(message) {
    if ((message.route != null) && message.route === model.route()) {
      curr = message.data;
      return model.set(curr, false, function() {
        return curr = {};
      });
    }
  });
};