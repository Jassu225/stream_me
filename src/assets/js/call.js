let constraints = {
    audio: true,
    video: false
};

function startCall() {
    if (peer) {
        alert("You can't start a call because you already have one open!");
    } else {

        createPeerConnection(true);
        addMedia();
    }
}

function addMedia() {
    navigator.mediaDevices.getUserMedia(constraints)
    .then(function (localStream) {
        localView.srcObject = localStream;
        peer.addStream(localStream);
    })
    .catch(handleGetUserMediaError);
}

function handleGetUserMediaError(e) {
    switch (e.name) {
        case "NotFoundError":
            alert("Unable to open your call because no camera and/or microphone" + "were found.");
            break;
        case "SecurityError":
        case "PermissionDeniedError":
            // Do nothing; this is the same as the user canceling the call.
            break;
        default:
            alert("Error opening your camera and/or microphone: " + e.message);
            break;
    }

    closeVideoCall();
}