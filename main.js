var express = require('express'),
    io      = require('socket.io'),
    fs      = require('fs'),
    mustache= require('./lib/mustache.js'),
    mongoose= require('mongoose'),
    Topic   = require('./models/topic.js'),
    Session = require('./models/session.js'),
    User    = require('./models/user.js'),
    auth    = require('./middle/auth.js'),
    _       = require('underscore');

mongoose.connect('localhost', 'grid', '3001');

var app = express.createServer();

app.configure(function(){
    app.use(express.cookieParser());
    app.use(express.static(__dirname + '/public'));
    app.use(auth.auth);
    
    app.set('views', __dirname + '/views');
    app.set('view options', {layout: false});
    app.register('html', mustache);
}) 

app.get('/', function(req, res){
    auth.login(req, res, 'jmoyers@gmail.com', 'fake');
    
    Topic.find(function(err, docs){
        var topics = _(docs).map(function(doc){
            return doc.doc;
        });
        
        res.render('main.html', {
            locals: {
                topics_top: topics
            }
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