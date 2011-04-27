var mongoose    = require('mongoose'),
    Schema      = mongoose.Schema,
    ObjectId    = Schema.ObjectId,
    bcrypt      = require('bcrypt');
    
var User = new Schema({
      email     : String
    , password  : String
    , name      : String
});

User.path('password').set(function(p){
    var salt = bcrypt.gen_salt_sync(10);
    return bcrypt.encrypt_sync(p, salt);
});

User.method('checkPassword', function(password){
    return bcrypt.compare_sync(password, this.password);
});

mongoose.model('User', User);

module.exports = mongoose.model('User');