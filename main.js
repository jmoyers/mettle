var express = require('express'),
    io      = require('socket.io'),
    fs      = require('fs'),
    sass    = require('sass'),
    jade    = require('jade'),
    mongoose= require('mongoose'),
    Topic   = require('./models/topic.js'),
    Session = require('./models/session.js'),
    User    = require('./models/user.js'),
    Auth    = require('./middle/auth.js'),
    auth    = Auth.auth,
    _       = require('underscore'),
    log     = require('./public/js/log');

mongoose.connect('localhost', 'grid', '3001');

var app = express.createServer();

app.configure(function(){
    app.set('view options',{layout: false});
    app.set('views', __dirname + '/views');
    app.register('html', jade);
    
    app.use(express.static(__dirname + '/public'));
    app.use(express.cookieParser());
    app.use(auth);
}) 

app.get('/api/v1/topics', function(req, res){
    Topic.find(function(err, docs){
        var topics = _(docs).map(function(doc){
            return doc.doc;
        });
        
        res.send(JSON.stringify(topics));
    });
});

app.get('/', function(req, res){
    Auth.login(req, res, 'jmoyers@gmail.com', 'fake');
    
    Topic.find(function(err, docs){
        var topics = _(docs).map(function(doc){
            return doc.doc;
        });
        
        res.render('main.html', {
            locals:{topics:topics}
        });
    });
});

app.listen(3000);

var socket = io.listen(app); 

clients = []

socket.on('connection', function(client){
    client.on('message', function(data){
        console.log(data);
    });
    
    client.on('disconnect', function(){
        console.log('client disconnected');
    });
});