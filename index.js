var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var usersArray = [];

app.get('/', function(req, res){
    res.sendFile(__dirname + '/html/chat.html');
});

app.get('/chat/:roomId', function(req, res) {
    console.log(req.params.roomId);
    var roomId = req.params.roomId;
    res.send('Room: ' + roomId)
});

app.get('/userchat/:username', function(req, res){
    res.sendFile(__dirname + '/html/userchat.html');
});

app.get('/send', function(req, res){
    res.sendFile(__dirname + '/html/test.html');
});

function addUsers(user) { 
    usersArray.push(user);
    return usersArray;
}

function removeUser(user) {
    usersArray.splize(user, 1);
    return usersArray;

}

io.on('connection', function(socket) {

    socket.on('connect-username', function(username){
        console.log(username, usersArray);
        socket.username = username;
        console.log('[+] connect-username', socket.username);
        io.emit('user-list', addUsers(socket.username));
    })

    socket.on('disconnect', function(){
        console.log('user disconnected', socket.username);
        removeUser(socket.username);
    });

    socket.on('send-message', function(data){
        console.log('Message from: '+socket.username+' :', data);
        io.emit(data.to + '-message', {
            username: socket.username,
            message: data.msg
        });
    });


});

var port = process.env.PORT || 3000;
http.listen(port, function(){
    console.log('listening on *:3000');
});
