{spawn, exec} = require("child_process")

# ANSI Terminal Colors.
bold  = "\033[0;1m"
red   = "\033[0;31m"
green = "\033[0;32m"
reset = "\033[0m"

log = (message, color) ->
  if not color then color=reset
  console.log color + message + reset
  
onerror = (err) ->
  if err
    process.stdout.write "#{red}#{err.stack}#{reset}\n"
    process.exit -1

build = (cb)->
  log 'Building', bold
  op = 2
  exec "rm -rf lib & coffee -c -l -b -o lib src", (err, stdout)->
    onerror err
    log 'Compiled src', bold
    -- op or cb()

  exec "rm test/*.js & rm -rf lib-cov", (err, stdout)->
    onerror err
    log 'Reset tests', bold
    -- op or cb()
    

test = (cb)->
  log 'Running tests', bold
  exec "expresso -i lib -c", (err, stdout, stderr)->
    log 'Finished tests', bold
    onerror err
    log stdout
    log stderr
    
    


task "build", "Compile CoffeeScript to JavaScript", -> build onerror
task "test", "Compile CoffeeScript to JavaScript and test", ->
  build ()->
    test()