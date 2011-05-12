var express = require('express'),
  io      = require('socket.io'),
  fs      = require('fs'),
  mongoose= require('mongoose'),
  jade    = require('jade'),
  Auth    = require('./middle/auth.js'),
  User    = require('./models/user.js'),
  Session = require('./models/session.js'),
  auth    = Auth.auth,
  _       = require('underscore'),
  winston = require('winston'),
  log     = winston.log,
  info    = winston.info,
  bad     = console.log,
  async   = require('async'),
  Controller = require('./models/controller.js');
    
function parseCookie(str){
  if(!str) return {};
  var obj = {}
    , pairs = str.split(/[;,] */);
  for (var i = 0, len = pairs.length; i < len; ++i) {
    var pair = pairs[i]
      , eqlIndex = pair.indexOf('=')
      , key = pair.substr(0, eqlIndex).trim().toLowerCase()
      , val = pair.substr(++eqlIndex, pair.length).trim();

    // Quoted values
    if (val[0] === '"') {
      val = val.slice(1, -1);
    }

    // Only assign once
    if (obj[key] === undefined) {
      obj[key] = decodeURIComponent(val.replace(/\+/g, ' '));
    }
  }
  return obj;
};

mongoose.connect('localhost', 'grid', '3001');

var app = express.createServer();

app.configure(function(){
  app.set('view engine', jade);
  app.set('view options', {layout: false});
  app.register('html', jade);
  app.use(express.static(__dirname + '/public'));
  app.use(express.static(__dirname + '/models'));
  app.use(express.cookieParser());
  app.use(auth);
});

app.get('/',function(req,res){
  res.render('main.html');
});

app.listen(3000);

var socket = io.listen(app, '10.1.10.133'); 

var users = {}

socket.on('connection', function(client){
  var cookies = parseCookie(client.request.headers.cookie),
    sid       = cookies['mud'],
    session   = client.session = false;
      
  async.series({
    establishSession: function(cb){
      if (!sid) {
        info('Session does not exists, creating new');
        session = client.session = Session.createSession();
        return cb();
      }

      info('Looking up session for ' + sid);
      Session.findOne({_id:sid}, function(err, doc){
        info('Session found ' + sid);
        session = client.session = doc;

        info('Refreshing session');
        session.heartbeat();
        return cb();
      });
    },
    addClient: function(cb){
      if (clients[client.session._id]) {
        return cb();
      } else {
        info('Adding client');    
        users[client.session._id] = new User({
          client: client,
          name  : 'Josh'
        });
        return cb();
      }
    },
    notifyClient: function(cb){
      info('Notifying client of app session id');

      sid = session._id;

      client.send({
        type  : 'session',
        data  : {mud: session._id}
      });

      info('Current ' + Object.keys(clients).length + ' clients connected');
      return cb();
    }
  });
  
  client.on('message', function(m){
    session.heartbeat();
    
    if (!m.type) {
      info('Invalid message from client ' + sid + ', discarding');
      return;
    }
    
    client.emit(m.type, m);
  });
  
  client.on('update', function(m){
    info('update request', m);
  });
  
  client.on('chat', function(m){
    info('chat message', m);
    _(clients).chain()
      .select(function(c){
        return c.session._id != sid;
      })
      .each(function(c){
        c.send(_.extend(m,{
          from: client._sid
        }));
      })
  })
  
  client.on('disconnect', function(){
    if (clients[client.session._id]) {
      delete clients[client.session._id];
    } 
    
    info('Client disconnected ' + (client.session?client.session._id:'(no session)'));
  });
});