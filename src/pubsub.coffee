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
    @delim        = '.'
    @wildcard     = '*'
    
  getListeners: (channel)->
    branches    = ['root'].concat(channel.split(@delim))
    numbranches = branches.length
    curr        = @listeners
    listeners   = []
    
    walk = (a, b)->
      len = if a.length > b.length then b.length else a.length
      for i in [0..len-1]
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
            if walk(trail.reverse(), freak.markers.reverse())
              listeners.push(freak.listener)
          return listeners
        else
          for freak in freaks
            listeners.push(freak.listener)
          return listeners
      else if bcounter < (numbranches-1)
        for wanderer in curr.wanderers
          if walk(trail.reverse(), wanderer.markers.reverse())
            listeners.push(wanderer.listener)
      else
        for wanderer in curr.wanderers
          listeners.push(wanderer.listener)
        return listeners.concat(curr.listeners or [])
            
  emit: (channel, message)->
    set = @getListeners(channel) or []
    for listener in set 
      listener(message)
  
  pub: PubSub::emit
  trigger: PubSub::emit
          
  addListener: (channel, listener)->
    branches  = channel.split(@delim)
    curr      = (@root or= {})
    for p, i in branches
      curr.wanderers  or= []
      curr.ghosts     or= []
      curr.listeners  or= []
      
      curr.ghosts.push(
        listener: listener
        markers : branches.slice(i)
      )
      
      if p is @wildcard
        curr.wanderers.push(
          listener: listener
          markers : branches.slice(i+1)
        )
        return
      else 
        curr = (curr[p] or= {})

    (curr.listeners or= []).push(listener)
    curr.wanderers  or= []
    curr.ghosts     or= []    
  
  on: @.prototype.addListener
  sub: @.prototype.addListener

  removeListener: (listener)->
    _.flatten @listeners, (s)->
      console.log s.toString()
    
    
if server then module.exports = PubSub