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

//Listen for individual clients/users to connect
io.sockets.on('connection', function(socket) {
    console.log("We have a new client: " + socket.id);

    //Listen for a message named 'msg' from this client
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



    
// //Hopefully cursor data
// //Establish socket connection
// io.sockets.on('connection', function(socket) {
//     console.log("We have a new client: " + socket.id);

//     socket.on('userData', function(data) {
//         // Add socket id to user data
//         data.id = socket.id;

//         // Store user data
//         users[socket.id] = data;

//         // Broadcast updated user data to all clients
//         io.sockets.emit('userData', data);
//     });

//     socket.on('disconnect', function() {
//         console.log("A client has disconnected: " + socket.id);

//         // Remove user from users object
//         delete users[socket.id];

//         // Notify other clients about the disconnection
//         io.sockets.emit('userDisconnected', socket.id);
//     });
// });


let users = {};

//Establish socket connection
io.sockets.on('connection', function(socket) {
    console.log("We have a new client: " + socket.id);

    socket.on('userData', function(data) {
        // Add socket id to user data
        data.id = socket.id;

        // Store user data
        users[socket.id] = data;

        // Broadcast updated user data to all clients
        io.sockets.emit('userData', data);
    });

    socket.on('disconnect', function() {
        console.log("A client has disconnected: " + socket.id);

        // Remove user from users object
        delete users[socket.id];

        // Notify other clients about the disconnection
        io.sockets.emit('userDisconnected', socket.id);
    });
});






//     //Listen for this client to disconnect
//     socket.on('disconnect', function() {
//         console.log("A client has disconnected: " + socket.id);
//     });
// });












// let users = {};

