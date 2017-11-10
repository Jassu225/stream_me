// Global variables
var root = document.getElementById("root");
var localView, remoteView;
var peer;
var room;
var id = new Date().getTime();

root.innerHTML = `<div>` +
                    `<video id="localView" autoplay></video>` +
                    `<input id="createToken" type="text" />` +
                    `<input id="connectToken" type="text" />` +
                    `<h2>Target Stream</h2>`+
                    `<video id="remoteView" autoplay></video>` +
                 `</div>`;

localView = document.getElementById("localView");
remoteView = document.getElementById("remoteView");