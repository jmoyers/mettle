if not window?
  EventEmitter  = require('events').EventEmitter
  _             = require('underscore')
  uuid          = require('node-uuid')
  server        = yes
  async         = require('async')
  
class PubSub extends EventEmitter
  constructor:()->
    @subscribers  = {}
    @delim        = [' ', '.', '/']
    @pattern      = /([\x20. \/])/
    
  routes: (channel)->
    channel = channel.split(@pattern)

    _.reject channel, (c)=>
        return @delim.indexOf(c) != -1

    routes = []

    _.each channel, (v, k)->
      routes[k] = _.reduce channel.slice(k), (memo, next)->
        return memo + '.' + next
        
    return routes
    
  pub: (channel, message)->
    routes = @routes(channel)
    
    responders = []
    
    _.each routes, (r)=>
      console.log 'subs on route ', @subscribers[r]
      _(@subscribers[r]).chain()
        .select((sub)=>
          console.log responders
          console.log sub
          console.log responders.indexOf(sub)
          responders.indexOf(sub) != -1
        ).each((sub)=>
          console.log(sub)
          #responders.push(s)
          #s(message)
        )
          
  sub: (channel, listener)->
    @subscribers[channel] = listener

  unsub: (listener)->
    _.flatten @subscribers, (s)->
      console.log s.toString()
    
    
if server then module.exports = PubSub