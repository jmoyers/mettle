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
    @pattern      = /[\x20. \/]/
    
  routes: (channel)->
    channel = channel.split(@pattern)

    routes = []

    _.each channel, (v, k)->
      routes[k] = _.reduce channel.slice(k), (memo, next)->
        return memo + '.' + next
        
    return [].concat(routes)
    
  pub: (channel, message)->
    routes = @routes(channel)
    
    responders = []
    
    _.each routes, (r)=>
      _(@subscribers[r]).chain()
        .reject (sub)=>
          responders.indexOf(sub) != -1
        .tap(responders.push)
        .each (sub)=>
          sub(message)
          
  sub: (channel, listener)->
    @subscribers[channel] = (@subscribers[channel] or= []).concat(listener)

  unsub: (listener)->
    _.flatten @subscribers, (s)->
      console.log s.toString()
    
    
if server then module.exports = PubSub