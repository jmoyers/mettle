Model     = require('../lib/model')
should    = require('should')
io        = require('socket.io')
http      = require('http')
WebSocket = require('../node_modules/socket.io/support/node-websocket-client/lib/websocket').WebSocket;

server = (port)->
  server = http.createServer()
  server.listen(port);
  return server;

client = (port)->
  return new WebSocket('ws://localhost:'+port)

josh = new Model({
  name    : 'Joshua Moyers',
  phone   : '555-555-5555',
  age     : 26
})

module.exports = 
  'client receives updates from server': (before)->
    server_p = new Model(josh.json())
    client_p = new Model(josh.json())
    
    server_socket = io.listen(server(8000))
    
    server_socket.on 'connection', (client)->
      console.log 'connection'
      client.send({
        type: 'update',
        id  : server_p.id,
        data: {
          name: 'Lol'
        }
      })
      # client.on 'message', (data)->
      #     console.log(data);
      # 
      # client.on 'disconnect', ()->
      #     console.log('client disconnected');
  
    
    client_socket = client(8000)

    client.onmessage = (m)->
      console.log('message')
      console.log(m);    
    