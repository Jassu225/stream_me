const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");
const fs = require("fs");

const app = express();
const https = require("https");

const credentials = {
    key: fs.readFileSync('./server/certificate/key.pem'),
    cert: fs.readFileSync('./server/certificate/cert.pem'),
    passphrase: "videochat"
};

let server  = https.createServer(credentials, app);
let io = require("socket.io")(server);

let options = {
    root: "."
};

// Body Parser middleware
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded(
        {
            extended: false
        }
    )
);

// console.log(path.join(__dirname, "..", "src"));
// Set static path to serve static files like css,js
app.use(
    express.static(
        path.join(__dirname, "..", "src")
    )
);

app.use('/socket',
    express.static(
        path.join(__dirname, "..", "socket.io")
    )
);

app.get("/", (req, res) => {
    res.send("hello");
});

let callerSocketID, receiverSocketID;
// Socket conections
io.on('connection', function(socket) {
    console.log('Connected!');
    socket.on("video-offer", function(data) {
        // Do stuff with data
        // Send data back to different listener
        let json = JSON.parse(decodeURIComponent(data.data));
        // console.log(json);
        let object = createRoom(json);
        callerSocketID = socket.id;
        // console.log(data);
        // console.log(object.key);
        // console.log(object.data);
        socket.emit(object.message, object.data);
    });

    socket.on("connect-peer", (data) => {
        let json = JSON.parse(decodeURIComponent(data.data));
        // console.log(json);
        receiverSocketID = socket.id;
        // console.log(data);
        let object = locateRoom(json);
        let message = object.message;
        let encodedData = encodeURIComponent(JSON.stringify(object.data));
        let obj = {
            data: encodedData
        };
        socket.emit(message, obj);
    });

    socket.on("video-answer", (data) => {
        // console.log(data);
        socket.broadcast.to(callerSocketID).emit("peer answer", data);
    });

    socket.on('new-ice-candidate', (data) => {
        socket.broadcast.emit('ice-candidate', data);     // Broadcast to all connected sockets including sender
    });

    socket.on("src-object", (data) => {
        console.log('src-object called');
        socket.broadcast.emit("srcObject", data);
    });
});

server.listen(3000, () => {
    console.log("Server started on  https://localhost:", 3000);
});

// require("./info.js");
// NOT server code
let peerConnections = [];

function createRoom(object) {
    peerConnections.push(object);
    return({
        message: 'room created',
        data: object
    });
}

function locateRoom(object){
   
    for(let i = 0; i < peerConnections.length; i++) {
        if(peerConnections[i].room === object.room){
            return( {
                message : 'room located',
                data: peerConnections[i]
            });
        }
    }
}