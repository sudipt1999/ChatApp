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
socket.on('receivedMessage', function(data) {
    console.log('RECEIVED MESSAGE', data);

    const messageWrap = document.createElement('div');
    messageWrap.setAttribute('class', 'message');
    const html = `
        <div class="letter">${data.from.charAt(0)}</div>
        <div class="">
            <div class="from-details flex items-end">
                <h3 class="from">${data.from}</h3>
                <time datetime="${data.time}" class="time">${new Date(data.time).toLocaleString()}</time>
            </div>
            <p>${data.text}</p>
        </div>
    `;
    messageWrap.innerHTML = html;
    const messagePanel = document.getElementById('message-panel');
    messagePanel.appendChild(messageWrap);
});

/*Function for sending image */
function sendImage() {
  console.log= ("SEND IMAGE CALLED");
  // const image = 
  const sendimage = {
      text: image
  }
  console.log("image", sendimage);
  socket.emit('newImage', sendimage);
}
/*Function for receiving image */
socket.on('receivedImage', function(img) {
  console.log('RECEIVED IMAGE', img);
})

/* Funtion for receiving list of people */
socket.on('updatedUserList', function (data) {
    console.log("user list", data);
    var peopleList = document.getElementById('people-list');
    peopleList.innerHTML = "";
    for (var i in data) {
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(`${data[i].name}`));
        peopleList.appendChild(li);
    }
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
