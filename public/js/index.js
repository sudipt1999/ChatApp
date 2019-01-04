var socket = io();

socket.on('connect', function () {
    console.log("connected to client");
    socket.emit('newMessage', {
        text: 'hey buddy whatsapp'
    })

})



socket.on('resend', function (text) {
    console.log("resend", text);
})