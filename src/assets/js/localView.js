navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;

let constraints = {
    audio: false,
    video: true
};

let video = document.getElementById("localView");

function successCallback(stream) {
    localStream = stream; // stream available to console
    if (window.URL)
        video.src = window.URL.createObjectURL(stream);
    else
        video.src = stream;
    // console.log(stream);
}

function errorCallback(error) {
    console.log('navigator.getUserMedia error: ', error);
}

navigator.getUserMedia(constraints, successCallback, errorCallback);
// AdapterJS.webRTCReady(function(isUsingPlugin) {
//     // The WebRTC API is ready.
//     //isUsingPlugin: true is the WebRTC plugin is being used, false otherwise
//     navigator.getUserMedia(constraints, successCallback, errorCallback);
// });