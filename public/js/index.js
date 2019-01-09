var socket = io();
socket.on('connect', function () {
    // console.log("connected to client");
    var user = QueryStringToJSON();
    // console.log(user);
    socket.emit('addUser', user);
})


/* Function for sending message*/
function sendMessage() {
    console.log("SEND MESSAGE CALLED");
    const message = document.getElementById('text-message').value;
    if (message.trim().length === 0) {
        return;
    }
    const sendmessage = {
        text: message
    }
    console.log("SENDING MESSAGE AS", sendmessage);
    socket.emit('newMessage', sendmessage);

}

/* Function for receiving message */
socket.on('receivedMessage', function (data) {
    console.log("RECEIVED MESSAGE", data);
})

/* deparams function to convert it into a object of key value */
function QueryStringToJSON() {
    var pairs = location.search.slice(1).split('&');

    var result = {};
    pairs.forEach(function (pair) {
        pair = pair.split('=');
        result[pair[0]] = decodeURIComponent(pair[1] || '');
    });

    return JSON.parse(JSON.stringify(result));
}