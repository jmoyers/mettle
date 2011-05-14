{spawn, exec} = require("child_process")

# ANSI Terminal Colors.
bold  = "\033[0;1m"
red   = "\033[0;31m"
green = "\033[0;32m"
reset = "\033[0m"

log = (message, color) ->
  console.log color + message + reset
  
onerror = (err) ->
  if err
    process.stdout.write "#{red}#{err.stack}#{reset}\n"
    process.exit -1

build = (callback)->
  log 'Building js', bold
  exec "rm -rf lib && coffee -c -l -b -o lib src", (err, stdout)->
    onerror err
    log 'Success', bold

task "build", "Compile CoffeeScript to JavaScript", -> build onerror