var servers = {
    iceServers: [     // Information about ICE servers - Use your own!
        {
            urls: "turn:" + window.location.hostname,  // A TURN server
            username: "webrtc",
            credential: "turnserver"
        }
    ]
};

let offerOptions = {
  offerToReceiveAudio: 1,
  offerToReceiveVideo: 1
};

function createPeerConnection(firstOne) {
    console.log('createPeer called');
    peer = new RTCPeerConnection(servers);

    peer.onicecandidate = handleICECandidateEvent;
    // once remote stream arrives, show it in the remote video element
    peer.onaddstream = handleAddStreamEvent;
    peer.onremovestream = handleRemoveStreamEvent;
    peer.oniceconnectionstatechange = handleICEConnectionStateChangeEvent;
    peer.onicegatheringstatechange = handleICEGatheringStateChangeEvent;
    peer.onsignalingstatechange = handleSignalingStateChangeEvent;
    if(firstOne)
        peer.onnegotiationneeded = handleNegotiationNeededEvent;
}

function handleICECandidateEvent(event) {
    console.log("onicecandidate event called");
    if (event.candidate && peer.remoteDescription.sdp) {
        sendToServer({
            type: "new-ice-candidate",
            targetID: id,
            room: room,
            candidate: event.candidate
        });
    }
        // if (event.candidate && peerConnection.remoteDescription.type ) {
        //     sendICECandidate(event.candidate);
        // }
}

function handleAddStreamEvent(event) {
    remoteView.srcObject = event.stream;
    // document.getElementById("hangup-button").disabled = false;
}

function handleRemoveStreamEvent(event) {
    closeVideoCall();
}

function handleICEConnectionStateChangeEvent(event) {
    console.log(event);
    console.log(peer.iceConnectionState);
    switch(peer.iceConnectionState) {
        case "connected":
        console.log(localView.srcObject);
            sendToServer({
                type: "src-object",
                id: id,
                data: localView.srcObject,
                room: room
            });
        case "closed":
        case "failed": //closeVideoCall();
                       //startCall();
                       break;
        case "disconnected":
            // closeVideoCall();
    }
}

function handleICEGatheringStateChangeEvent(event) {
    // Our sample just logs information to console here,
    // but you can do whatever you need.
}

function handleSignalingStateChangeEvent(event) {
    switch(peer.signalingState) {
        case "closed":
            // closeVideoCall();
            console.log('call disconnected');
            break;
    }
}

function handleNegotiationNeededEvent() {
    console.log('handle negotiation needed called');

    peer.createOffer().then(function (offer) {
        return peer.setLocalDescription(offer);
    })
    .then(function () {
        console.log('lets send data');
        sendToServer({
            targetID: id,
            type: "video-offer",
            room: room,
            sdp: peer.localDescription
        });
    })
    .catch((error) => {
        console.log(error);
    });
}

function closeVideoCall() {
    // var remoteVideo = document.getElementById("received_video");
    // var localVideo = document.getElementById("local_video");

    if (peer) {
        if (remoteView.srcObject) {
            remoteView.srcObject.getTracks().forEach(track => track.stop());
            remoteView.srcObject = null;
        }

        if (localView.srcObject) {
            localView.srcObject.getTracks().forEach(track => track.stop());
            localView.srcObject = null;
        }

        peer.close();
        peer = null;
    }

    // document.getElementById("hangup-button").disabled = true;

    // targetUsername = null;
}