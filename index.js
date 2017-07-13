var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var usersArray = [];
var socketUserMap = [];


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

function addUsers(user, socket) { 
    var flag = usersArray.push(user);
    console.log('[+] added user [' + user +']', usersArray, flag);
    socketUserMap[user] = socket.id;
    return usersArray;
}

function removeUser(user) {
    if ( usersArray.indexOf(user) > -1 ) usersArray.splice(usersArray.indexOf(user), 1);
    console.log('[+] removed user [' + user +']', usersArray);
    return usersArray;
}

function getSocketId(user){
    console.log('[+] getSocketId[' + user +']', socketUserMap.user, socketUserMap);
    return socketUserMap[user];
}

io.on('connection', function(socket) {

    console.log('Connected: ', socket.id);

    socket.on('connect-username', function(username){
        console.log('[+] username: [' + socket.id +']',username, usersArray);
        socket.username = username;
        io.emit('user-list', addUsers(socket.username, socket));
    })

    socket.on('disconnect', function(){
        console.log('user disconnected [' + socket.id +']', socket.username);
        io.emit('user-list', removeUser(socket.username));
    });

    socket.on('send-message', function(data){
        console.log('Message from: '+socket.username+' :', data);
        io.sockets.connected[getSocketId(data.to)].emit('read-messages', {
            username: socket.username,
            message: data.msg
        });
    });


});

var port = process.env.PORT || 3000;
http.listen(port, function(){
    console.log('listening on *:' + port);
});
