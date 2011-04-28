var Session = require('../models/session'),
    User    = require('../models/user');

function requireAuth(req, res, next){
    if (req.user) {
        next();
    } else {
        res.send('You must log in to access this resource',403);
    }
}

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

            req.user = (session) 
                ? User.findOne({_id: session.uid})
                : false;

            next(); 
        });
    }
}

function login(req, res, email, password){
    if( req.user ) return req.user;
    User.findOne({email: email}, function(err, user){
        if (user.checkPassword(password)) {
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