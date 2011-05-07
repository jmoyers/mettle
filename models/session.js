var mongoose  = require('mongoose'),
  Schema    = mongoose.Schema,
  ObjectId  = Schema.ObjectId,
  uuid    = require('node-uuid');
  
var Session = new Schema({
    uid       : ObjectId
  , sid       : String
  , start     : Date
  , last      : Date
});

Session.method('heartbeat', function(password){
    this.last = new Date();
    this.save();
});

mongoose.model('Session', Session);

var Session = module.exports = mongoose.model('Session');

function createSession(user){
  user = user || {_id:false};
  
  var now = new Date();

  var session = new Session({
    uid   : user._id,
    sid   : uuid(),
    start : now,
    last  : now
  });
  
  session.save();
  
  return session;
}

module.exports.createSession = createSession;