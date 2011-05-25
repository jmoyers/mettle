PubSub    = require('pubsub')

module.exports = 
  'publish': (beforeEnd)->
    pb    = new PubSub()
    count = 0

    pb.sub 'test.test', (m)->
      count++
      m.should.equal('thing')
      
    pb.unsub()

    pb.pub 'test.test', 'thing'

    beforeEnd ()->
      count.should.equal(1)