var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var players = [];

const port = process.env.PORT || 8080;

server.listen(port, function() {
  console.log("Server is now running...");
});

io.on('connection', function(socket) {
  console.log("jugador conectado!");
  //socket.emit('socketID', { id: socket.id });
  //socket.emit('getPlayers', players);
  socket.broadcast.emit('usuarioConectado', { id: socket.id});
  socket.on('disconnect', function() {
      console.log("jugador desconectado");
      socket.broadcast.emit('usuarioDesconectado', {id: socket.id});
      for(var i = 0; i < players.length; i++) {
        if(players[i].id == socket.id) {
          players.splice(i, 1);
        }
      }
  });

  socket.on('mensaje', function(message) {
    socket.broadcast.emit('mensaje', {mensaje: message});
    socket.emit('mensaje', {mensaje: message});
  });


  players.push(new player(socket.id, 0, 0));
});

function player(id, x, y) {
  this.id = id;
  this.x = x;
  this.y = y;
}

