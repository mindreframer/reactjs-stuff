var socketio = require('socket.io')
var game = require('./game.js')
var availableUUID = 1;
var events = require('events');

module.exports.listen = function(app){
    io = socketio.listen(app)

    io.configure(function () { 
      io.set("transports", ["xhr-polling"]); 
      io.set("polling duration", 10); 
    });

    io.sockets.on('connection', function (socket) {
      socket.on('join', function(cb){

        //Turn off persistence
        uuid = availableUUID++;

        socket.set('uuid', uuid)
        game.join(uuid, function(err, res){
          if (err) { socket.emit("alert", err) }
          else{ 
              socket.emit('game', game.getGame() )
              socket.broadcast.emit("game", res )
          }
        })
        cb(game.getPlayer(uuid));
      })

      // User leaves
      socket.on('disconnect', function(){
        console.log("Disconnect: ", socket.id)
      })
      
      socket.on('name', function(data){
        socket.get('uuid', function(err, uuid){
          game.setName(uuid, encodeURI(data), function(err, res){
            if (err) { socket.emit("alert", err) }
            else{ io.sockets.emit("game", res ) }
          })
          
        })
      })

      // Answer
      socket.on('answer', function(answer){
        // add the entry
        socket.get('uuid', function(err, uuid){
          game.addAnswer(uuid, answer, function(err, res){
            if (err) { socket.emit("alert", err) }
            else{ io.sockets.emit("game", res ) }
          })  
        })
        
      })

      // State
      socket.on('state', function(data){
          game.setState(data, function(err, res){
            if (err) { socket.emit("alert", err) }
            else{ 
                io.sockets.emit("game", res )
            }
          })  
      })

      socket.on('reset', function(data){
        game.reset(function(err, res){
          if (err) { socket.emit("alert", err) }
          else{ 
            io.sockets.emit("game", res ) 
          }
        })
      })
    });

    game.eventEmitter.on('state', function(res) {
      io.sockets.emit("game", res )
      if(res.state == 'ended') {
        console.log("sending answers", game.getAnswers())
        io.sockets.emit('answers', game.getAnswers())
    }
    });
    return io
}