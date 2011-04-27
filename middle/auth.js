var Session = require('../models/session'),
    User    = require('../models/user');

function auth(req, res, next){
    var sid = req.cookies['grid_auth'] || false;
        
    if (!sid) {
        logout(req, res);
        req.session = false;
        req.user    = false;
        next();
    } else {
        Session.findOne({sid: sid}, function(err, session){
            req.session = session || false;

            if (session) {
                req.user = User.findOne({_id: session.uid});
            }

            next(); 
        });
    }
}

function login(req, res, email, password){
    if( req.user ) return req.user;
    User.findOne({email: email}, function(err, user){
        if (user.checkPassword(password)) {
            console.log('password ' + password + ' is a match');
            session     = Session.createSession(user);
            req.session = session;
            req.user    = user;
            res.cookie('grid_auth', session.sid);
        } else {
            logout(req, res);
        }
        
        return req.user;
    });
}

function logout(req, res){
    res.cookie('grid_auth', '');
    req.user    = false;
    req.session = false;
}

module.exports.auth = auth;
module.exports.login = login;