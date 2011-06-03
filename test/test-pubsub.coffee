PubSub    = require('pubsub')

module.exports = 
  'publish': (beforeEnd)->
    pb    = new PubSub()
    count = 0

    pb.on 'josh.*', (data)->
      console.log 'josh.*', data
      
    pb.on 'josh.name.change', (data)->
      console.log 'josh.name.change', data
      
    pb.emit 'josh', 'should appear once'
    pb.emit 'josh.name.change', 'should appear twice'
        
    beforeEnd ()->