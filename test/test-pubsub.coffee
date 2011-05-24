PubSub    = require('pubsub')

module.exports = 
  'publish': (beforeEnd)->
    pb    = new PubSub()
    count = 1

    pb.sub 'test', (m)->
      count++
      m.should.equal('thing')
      
    pb.unsub()

    pb.pub 'test', 'thing'

    beforeEnd ()->
      count.should.equal(1)