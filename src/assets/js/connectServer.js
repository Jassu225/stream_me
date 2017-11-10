let socket = io.connect('https://192.168.31.138:3000');

socket.on('room created', function (data) {
    console.log(data);
    if(data.room === room)
        console.log("room created");
});

socket.on('room located', (data) => {
    console.log(data);
    let json = JSON.parse(decodeURIComponent(data.data));
    console.log('room locate');
    console.log(json);
    if( json.room  === room){
        console.log("room located");
        videoOfferReceived(json);
    }
});

socket.on("peer answer", (data) => {
    console.log(data);
    let json = JSON.parse(decodeURIComponent(data.data));
    if(id!= data.id && json.room === room) {
        console.log('peer answered');
        peerAnswered(json);
    }
});

socket.on('ice-candidate', (data) => {
    console.log('ice');
    console.log(id);
    let json = JSON.parse(decodeURIComponent(data.data));
    console.log(json);
    if( (id != json.id) && room === json.room) {
        peer.addIceCandidate( new RTCIceCandidate(json.candidate) ).then(
            function() {
                // onAddIceCandidateSuccess(peer);
                console.log("add ice candidate success");
            },
            (error) => {
                console.log(error);
            }
        );
    }
});

socket.on('srcObject', (data) => {
    console.log('src-object received');
    let json = JSON.parse(decodeURIComponent(data.data));
    if( id != json.id && room === json.room) {
        if(!remoteView.srcObject) {
            remoteView.srcObject = json.data;
        }
    }
});

function sendToServer(json) {
    console.log('sendToServer() called');
    let message = json.type;
    let encodedData = encodeURIComponent(JSON.stringify(json));
    console.log(message);
    let object = {
        data: encodedData
    };

    socket.emit(message, object);
}

// function connectToServer(json){

//     room = json.room;
//     socket.emit('create room or locate room', json);
// }

// function sendAnswer(desc){
//     socket.emit('answer', {id: id,room: room, answer: desc});
// }

function peerAnswered(object){
    peer.setRemoteDescription(new RTCSessionDescription(object.sdp), () => {
        console.log('set remote desc');
    });
}

function sendICECandidate(candidate){
    let encodedData = encodeURIComponent(JSON.stringify({ id: id, room: room,candidate: candidate}));
    socket.emit('new-ice-candidate', {data: encodedData});
}