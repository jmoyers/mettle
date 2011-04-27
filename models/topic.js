var mongoose    = require('mongoose'),
    Schema      = mongoose.Schema,
    ObjectId    = Schema.ObjectId;
    
var Topic = new Schema({
      author    : ObjectId
    , title     : String
    , body      : String
    , topics    : [Topic]
});

mongoose.model('Topic', Topic);

module.exports = mongoose.model('Topic');