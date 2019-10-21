var http = require('http');
var socketIO = require('socket.io');
var express = require('express');
var path = require('path');
var moment = require('moment');
const Users = require('./utils/users');
const User = new Users();
const fs = require('fs');

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
        /* MAKING ROOM SO THAT MESSAGE CAN BE SENT TO IT */
        socket.join(data.room);
        // console.log(newUser);
        /*adding user to the dynamic storage */
        User.addUser(newUser);
        const userInRoom = User.findRoomUser(data.room);
        const welcomeText = {
            from: 'Admin',
            text: `${newUser.name} joined the room`,
            time: new Date()
        }
        socket.broadcast.to(data.room).emit('receivedMessage', welcomeText);
        io.to(data.room).emit('updatedUserList', userInRoom);
    })

    /*  METHOD FOR REGISTERING MESSAGE AND EMITING TO ROOM */
    socket.on('newMessage', (data) => {
        console.log("NEW MESSAGE RECEIVED ", data);
        const user = User.findUser(id);
        const message = {
            from: user.name,
            text: data.text,
            time: new Date().getTime()
        }
        console.log("MESSAGE READY To SEND TO OTHERS ", message);
        console.log("found user ", user);
        User.findRoomUser(user.room);
        io.to(user.room).emit('receivedMessage', message);
    })

    /*  METHOD FOR REGISTERING IMAGE AND EMITING TO ROOM */
    socket.on('newImage', (img) => {
      console.log("NEW IMAGE RECEIVED", img);
      const user = User.findUser(id);
      io.to(user.room).emit('receivedImage', message);
    })


    socket.on('disconnect', () => {
        var user = User.deleteUser(socket.id);
        const userInRoom = User.findRoomUser(user.room);
        var departureText = {
            from: 'Admin',
            text: `${user.name} left the room`,
            time: new Date().getTime()
        }
        socket.broadcast.to(user.room).emit('receivedMessage', departureText);
        io.to(user.room).emit('updatedUserList', userInRoom);
    })

})


server.listen(3000, () => {
    console.log("app started at port 3000");
})
