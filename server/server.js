var http = require('http');
var socketIO = require('socket.io');
var express = require('express');
var path = require('path');
var moment = require('moment');
const Users = require('./utils/users');
const User = new Users();

const publicPath = path.join(__dirname, '../public');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

app.get('/', (req, res) => {
    console.log('/someone entered');
    console.log("req", req.originalUrl);
    if (req.originalUrl === '/') {
        console.log("basic file");
        res.sendFile(publicPath + '/join.html');
    }
    else {
        console.log("chat file");
        res.sendFile(publicPath + '/chat.html');
    }
})



io.on('connection', (socket) => {
    // console.log("someone connected");
    var id = socket.id;
    // console.log("socket.id", id);
    socket.on('addUser', (data) => {
        // console.log("inside addUSer socket");
        // console.log(data);
        if (User.findUser(socket.id)) {
            User.deleteUser(socket.id);
        }
        const newUser = {
            id: socket.id,
            name: data.name,
            room: data.room
        };
        // console.log(newUser);
        /*adding user to the dynamic storage */
        User.addUser(newUser);
        const userInRoom = User.findRoomUser(data.room);
        socket.to(data.room).emit('updatedUserList', userInRoom);
    })


    socket.on('disconnect', () => {
        var user = User.deleteUser(socket.id);
        const userInRoom = User.findRoomUser(user.room);
        socket.to(User.room).emit('updatedUserList', userInRoom);
    })

})


server.listen(3000, () => {
    console.log("app started at port 3000");
})