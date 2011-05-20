Model     = require('../lib/model')
createLink= require('../lib/link').createLink
should    = require('should')
io        = require('socket.io')
http      = require('http')
WebSocket = require('../node_modules/socket.io/support/node-websocket-client/lib/websocket').WebSocket
encode    = require('../node_modules/socket.io/lib/socket.io/utils').encode
decode    = require('../node_modules/socket.io/lib/socket.io/utils').decode

createServer = (port)->
  server = http.createServer()
  server.listen(port);
  return server;
  
createClient = (port)->
  return wrapClient(new WebSocket('ws://localhost:'+port+'/socket.io/websocket/'))
  
wrapClient = (client)->  
  old = client.emit
  
  # lets make emit 'message' behave like a socket.io client
  client.emit = (event, data)->
    if (event != 'message' or typeof data == 'object')
      return old.call(@,event,data)

    # strip off socket.io stuff
    data = decode(data.toString())[0];

    # grab the frame
    f = data.substr(0,3)
  
    # known frames
    frames = ['~j~', '~h~']
  
    # ignore shit we don't understand
    if f in frames then data = data.substr(3) else return
  
    # gimme that heartbeat, foo
    if f == '~h~'
      client.send(encode('~h~' + data))
      return
  
    # parse the payload as json by default
    data = JSON.parse(data)

    # re-emit
    client.emit(event, data)
    
  return client

josh = new Model({
  name    : 'Joshua Moyers',
  phone   : '555-555-5555',
  age     : 26
})

module.exports = 
  'client receives updates from server': (before)->
    server_model = new Model(josh.json())
    client_model = new Model(josh.json())
    server = createServer(8000)      
    client = createClient(8000)
    
    close = ()->
      server.close()
      client.close()
    
    receive = send = 3
    
    changes = ['fred', 'loudly', 'farted']
    
    client_model.on 'change', (attribs)->
      attribs.should.have.property('name', changes[--receive])
      receive or close()
    
    server_socket = io.listen(server)
    
    server_socket.on 'connection', (client)->
      createLink(server_model, client)
      
      id = setInterval(()->
        server_model.name = changes[--send]
        send or clearTimeout(id)
      ,1000)    
    
    createLink(client_model, client)
    
    before ()->
      send.should.equal(0)
      receive.should.equal(0)