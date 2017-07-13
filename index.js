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
    var flag = usersArray.push(user);
    console.log('[+] added user [' + user +']', usersArray, flag);
    return usersArray;
}

function removeUser(user) {
    if ( usersArray.indexOf(user) > -1 ) usersArray.splice(usersArray.indexOf(user), 1);
    console.log('[+] removed user [' + user +']', usersArray);
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
        io.emit('user-list', removeUser(socket.username));
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
    console.log('listening on *:' + port);
});
