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
  exec "rm -rf lib && coffee -c -l -b -o lib src", (err, stdout)->
    onerror err
    log 'Compiled', bold
    cb()

test = (cb)->
  log 'Running lib/test.js', bold
  exec "node lib/test.js", (err, stdout)->
    onerror err
    log ''
    log ''
    log stdout
    


task "build", "Compile CoffeeScript to JavaScript", -> build onerror
task "test", "Compile CoffeeScript to JavaScript and test", ->
  build ()->
    test()