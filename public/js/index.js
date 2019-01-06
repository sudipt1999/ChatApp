var socket = io();

socket.on('connect', function () {
    // console.log("connected to client");
    var user = QueryStringToJSON();
    // console.log(user);
    socket.emit('addUser', user);
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