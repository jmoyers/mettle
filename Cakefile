{spawn, exec} = require("child_process")

log = (message) ->
  console.log message
  
onerror = (err) ->
  if err
    process.stdout.write "#{err.stack}\n"
    process.exit -1

build = (cb)->
  log 'Building'
  op = 2
  exec "rm -rf lib & coffee -c -o lib src", (err, stdout)->
    onerror err
    log 'Compiled src'
    -- op or cb()

  exec "rm test/*.js & rm -rf lib-cov", (err, stdout)->
    onerror err
    log 'Reset tests'
    -- op or cb()
    
test = (cb)->
  log 'Running tests'
  exec "expresso -i lib", (err, stdout, stderr)->
    log 'Finished tests'
    log stdout
    log stderr
    onerror err

task "build", "Compile CoffeeScript to JavaScript", -> build onerror
task "test", "Compile CoffeeScript to JavaScript and test", ->
  build ()->
    test()
