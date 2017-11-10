function connectCall() {
    console.log('connectCall() called')
    sendToServer({
        targetID: id,
        room: room,
        type: "connect-peer"
    });
}

// offer from other peer
function videoOfferReceived(object) {
    if(object.sdp){

        createPeerConnection(false);
        // addMedia();

        // peer.setRemoteDescription(new RTCSessionDescription(object.sdp), function () {
        //     // if we received an offer, we need to answer
        //     if (peer.remoteDescription.type == 'offer')
        //         peer.createAnswer( onCreateAnswerSuccess, (error) => {
        //             console.log(error);
        //         });
        // }, (error) => {
        //     console.log(error);
        // });
        peer.setRemoteDescription(new RTCSessionDescription(object.sdp))
        .then(addMedia)
        .then( () => {
            if (peer.remoteDescription.type == 'offer') {
                peer.createAnswer( onCreateAnswerSuccess, (error) => {
                    console.log(error);
                });
            }
        }).catch((error) => {
            console.log(error);
        });
    }
}

function onCreateAnswerSuccess(desc) {
    peer.setLocalDescription(desc).then(
        () => {
            // onSetLocalSuccess(pc2);
            console.log("set local descrition success other");
        },
        (error) => {
            console.log(error);
        }
    );

    sendToServer({
        id: id,
        type: "video-answer",
        room: room,
        sdp: desc
    });
}