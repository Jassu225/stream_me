document.getElementById("createToken").addEventListener("change", (event) => {
    // console.log(event.target.value);
    // startPeerConnection(event.target.value);
    room = event.target.value;
    startCall();
});

document.getElementById("connectToken").addEventListener("change", (event) => {
    room = event.target.value;
    // console.log(event.target.value);
    console.log('changed');
    connectCall();
});