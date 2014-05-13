//Express - This Will manage the server and the response to the user
var express = require("express")
, app = express();

//app.set('views', __dirname + '/views');
//app.set('view engine', "html");
app.engine('html', require('ejs').renderFile);
//app.set("view options", {layout: false});
//we will use an external JavaScript file that will hold the front-end logic, 
//we need to inform ExpressJS where to look for such resources.
app.use(express.static(__dirname + '/public'));
//app.engine('html', require('jade').__express);
app.get("/", function(req, res){
	res.render('chat.html');
});

//Socket.io - Allows for real time communication between the front-end and back-end
//express application and socke will listen by the same port
var io = require('socket.io').listen(app.listen(8080));

// usernames which are currently connected to the chat
var usernames = {};

io.sockets.on('connection', function (socket) {

  // when the client emits 'sendchat', this listens and executes
  socket.on('sendMessage', function (data) {
    // For all socket I write message
    socket.broadcast.emit('notificationMessage', {
      user: data.user,
      text: data.message
    });
  });

  // when the client emits 'adduser', this listens and executes
  socket.on('addUser', function(username){
    // we store the username in the socket session for this client
    socket.username = username;
    // add the client's username to the global list
    usernames[username] = username;
    // update the list of users in chat, client-side
    io.sockets.emit('user_join', {userJoined : username});
  });

  // On disconnect, call chat controller to inform.
  socket.on('disconnect', function(){
    // remove the username from global usernames list
    delete usernames[socket.username];
    // update list of users in chat, client-side
    io.sockets.emit('notificationMessage', {
      user: 'SERVER SAYS: ',
      text: 'User ' + socket.username + ' is disconnected.'
    });
    
  });
});