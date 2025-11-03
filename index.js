//Initialize the express 'app' object
let express = require('express');
let app = express();
app.use('/', express.static('public'));

//Initialize the actual HTTP server
let http = require('http');
let server = http.createServer(app);
let port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log("Server listening at port: " + port);
});


//Initialize socket.io
let io = require('socket.io');
io = new io.Server(server);

let users = {};

io.sockets.on('connection', function(socket) {
  console.log("We have a new client: " + socket.id);
  console.log("Total connected clients:", io.sockets.sockets.size);

  socket.on('userData', function(data) {
    console.log("Server received userData from:", socket.id);
    data.id = socket.id;
    users[socket.id] = data;
    console.log("Broadcasting to all clients. Connected sockets:", io.sockets.sockets.size);
    io.sockets.emit('userData', data);
  });

  socket.on('disconnect', function() {
    console.log("A client has disconnected: " + socket.id);
    console.log("Remaining clients:", io.sockets.sockets.size);
    delete users[socket.id];
    io.sockets.emit('userDisconnected', socket.id);
  });

  socket.on('msg', function(data) {
    //Data can be numbers, strings, objects
    console.log("Received a 'msg' event");
    console.log(data);

    //Send a response to all clients, including this one
    io.sockets.emit('msg', data);

    //Send a response to all other clients, not including this one
    // socket.broadcast.emit('msg', data);

    //Send a response to just this client
    // socket.emit('msg', data);

  });
});
