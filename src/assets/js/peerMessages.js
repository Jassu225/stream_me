function handleVideoOfferMsg(msg) {
    var localStream = null;

    targetUsername = msg.name;

    createPeerConnection();

    var desc = new RTCSessionDescription(msg.sdp);

    peer.setRemoteDescription(desc).then(function () {
        return navigator.mediaDevices.getUserMedia(mediaConstraints);
    })
    .then(function(stream) {
        localStream = stream;
        localView.srcObject = localStream;
        return peer.addStream(localStream);
    }).then(function() {
        return peer.createAnswer();
    })
    .then(function(answer) {
        return peer.setLocalDescription(answer);
    })
    .then(function() {
        var msg = {
            name: myUsername,
            target: targetUsername,
            type: "video-answer",
            sdp: peer.localDescription
        };

        sendToServer(msg);
    })
    .catch(handleGetUserMediaError);
}

function handleNewICECandidateMsg(msg) {
    var candidate = new RTCIceCandidate(msg.candidate);

    peer.addIceCandidate(candidate)
    .catch(reportError);
}

function hangUpCall() {
    closeVideoCall();
    sendToServer({
        name: myUsername,
        target: targetUsername,
        type: "hang-up"
    });
}