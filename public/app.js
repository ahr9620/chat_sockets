
//variables for p5 sketch
let socket;
let userName;
let users = {};


window.addEventListener('load', function () {

    //Open and connect socket
    // let socket = io();
socket=io();

    //Listen for confirmation of connection
    socket.on('connect', function () {
        console.log("Connected");
    });

    /* --- Code to RECEIVE a socket message from the server --- */
    let chatBox = document.getElementById('chat-box-msgs');

    //Listen for messages named 'msg' from the server
    socket.on('msg', function (data) {
        console.log("Message arrived!");
        console.log(data);

        //Create a message string and page element
        let receivedMsg = data.name + ": " + data.msg;
        let msgEl = document.createElement('p');
        msgEl.innerHTML = receivedMsg;

        //Add the element with the message to the page
        chatBox.appendChild(msgEl);
        //Add a bit of auto scroll for the chat box
        chatBox.scrollTop = chatBox.scrollHeight;
    });
    
    /* --- Code to SEND a socket message to the Server --- */
    let nameInput = document.getElementById('name-input')
    let msgInput = document.getElementById('msg-input');
    let sendButton = document.getElementById('send-button');




    //creating new buttons FOR CHRISSY TO REFERENCE
    let dislikeButton = document.getElementById('dislike-button');
    let likeButton = document.getElementById('like-button');

    if (likeButton) likeButton.addEventListener('click', () => console.log('Like pressed'));
    if (dislikeButton) dislikeButton.addEventListener('click', () => console.log('Dislike pressed'));
    // These should work in console log to start







    sendButton.addEventListener('click', function () {
        let curName = nameInput.value;
        let curMsg = msgInput.value;
        let msgObj = { "name": curName, "msg": curMsg };

        //Send the message object to the server
        socket.emit('msg', msgObj);
    });
});






//drawing cursor position of multiple users

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);

  // Ask for user's name
  userName = prompt("Please enter your name:", "Anonymous");
  if (!userName) userName = "Anonymous";

  // Open and connect socket
//   socket = io();

  // Listen for confirmation of connection
  socket.on('connect', function() {
    console.log("Connected");
    // Send initial user data
    socket.emit('userData', { name: userName, x: mouseX, y: mouseY });
  });

  // Listen for messages named 'userData' from the server
  socket.on('userData', function(data) {
    users[data.id] = data;
  });

  // Listen for user disconnection
  socket.on('userDisconnected', function(userId) {
    delete users[userId];
  });
}

function draw() {
    //make background transparent to test

  background(255, 255, 255, 0.6);

  // Draw all users
  for (let id in users) {
    let user = users[id];
    fill(0);
    ellipse(user.x, user.y, 10, 10);
    textAlign(CENTER, BOTTOM);
    text(user.name, user.x, user.y - 10);
  }
}