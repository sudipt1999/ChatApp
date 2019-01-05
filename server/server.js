var http = require('http');
var socketIO = require('socket.io');
var express = require('express');
var path = require('path');
var moment = require('moment');

const publicPath = path.join(__dirname, '../public');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);


app.use(express.static(publicPath));

app.get('/', (req, res) => {
    res.send(publicPath + '/join.html');
})

io.on('connection', (socket) => {
    console.log("someone connected");

    socket.on('newMessage', function (text) {
        console.log(text);
        socket.emit('resend', {
            text: "hey I didnt got your message so sorry"
        })
    })


})


server.listen(3000, () => {
    console.log("app started at port 3000");
})