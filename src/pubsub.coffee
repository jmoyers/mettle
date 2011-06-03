if not window?
  EventEmitter  = require('events').EventEmitter
  _             = require('underscore')
  uuid          = require('node-uuid')
  async         = require('async')
  server        = yes

class PubSub
  constructor:()->
    @listeners    = {'root':{}}
    @root         = @listeners['root']
    @delim        = [' ', '.', '/']
    @pattern      = /[\x20. \/]/
    @wildcard     = '*'
    
  getListeners: (channel)->
    branches    = ['root'].concat(channel.split(@pattern))
    numbranches = branches.length
    curr        = @listeners
    listeners   = []
    
    walk = (a, b)->
      for v,i in a
        if a[i] != b[i] then return false
      return true 
    
    for branch, bcounter in branches
      if typeof curr[branch] == 'object'
        curr = curr[branch]
      
      trail     = branches.slice(bcounter+1)

      if branch is @wildcard
        freaks = curr.ghosts.concat(curr.wanderers)
        if bcounter < (numbranches - 1)
          for freak in freaks
            diff  = freak.markers.length - trail.length
            match = diff >= 0 and walk(trail.reverse(), freak.markers.reverse())
            if match then listeners.push(freak.listener)
          return listeners
        else
          return _.pluck(freaks, 'listener')
      else if bcounter < (numbranches-1)
        listeners = listeners.concat(_.pluck(curr.wanderers, 'listener'))
      else
        return listeners.concat(_.pluck(curr.wanderers, 'listener'))
          .concat(curr.listeners or [])
            
  emit: (channel, message)->
    set = @getListeners(channel) or []
    for listener in set 
      listener(message)
  
  pub: PubSub::emit
  trigger: PubSub::emit
          
  addListener: (channel, listener)->
    branches  = channel.split(@pattern)
    curr      = (@root or= {})
    for p, i in branches
      curr.wanderers  or= []
      curr.ghosts     or= []
      
      curr.ghosts.push(
        listener: listener
        markers : branches.slice(i)
      )
      
      if p is @wildcard
        curr.wanderers.push(
          listener: listener
          markers : branches.slice(i)
        )
        return
      else 
        curr = (curr[p] or= {})
    (curr.listeners or= []).push(listener)
  
  on: @.prototype.addListener
  sub: @.prototype.addListener

  removeListener: (listener)->
    _.flatten @listeners, (s)->
      console.log s.toString()
    
    
if server then module.exports = PubSub