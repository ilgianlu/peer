let peerConnection;
let localStream;
let remoteStream;

let servers = {
    iceServers: [
        {
            urls: ['stun:banana:3479']
        }
    ]
}

let init = async () => {
    localStream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});

    document.getElementById('user-1').srcObject = localStream;
}

let createOffer = async () => {
    peerConnection = new RTCPeerConnection(servers);

    remoteStream = new MediaStream();
    document.getElementById('user-2').srcObject = remoteStream;

    localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
    });

    peerConnection.ontrack = async (event) => {
        event.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track);
        });
    }

    peerConnection.onicecandidate = async (event) => {
        if (event.candidate) {
            document.getElementById('offer-sdp').value = JSON.stringify(peerConnection.localDescription);
        }
    }

    let offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    document.getElementById('offer-sdp').value = JSON.stringify(offer);
}

let createAnswer = async () => {
    peerConnection = new RTCPeerConnection(servers);

    remoteStream = new MediaStream();
    document.getElementById('user-2').srcObject = remoteStream;

    localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
    });

    peerConnection.ontrack = async (event) => {
        event.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track);
        });
    }

    peerConnection.onicecandidate = async (event) => {
        if (event.candidate) {
            document.getElementById('answer-sdp').value = JSON.stringify(peerConnection.localDescription);
        }
    }

    let offer = document.getElementById('offer-sdp').value;
    if (!offer) {
        alert('!!!!');
        return;
    }

    offer = JSON.parse(offer);
    await peerConnection.setRemoteDescription(offer);

    let answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    document.getElementById('answer-sdp').value = JSON.stringify(answer);
}

let addAnswer = async () => {
    let answer = document.getElementById('answer-sdp').value;
    if (!answer) {
        alert('!!!!');
        return;
    }
    answer = JSON.parse(answer);

    if (!peerConnection.currentRemoteDescription) {
        peerConnection.setRemoteDescription(answer);
    }
}

document.getElementById('create-offer').addEventListener('click', createOffer);
document.getElementById('create-answer').addEventListener('click', createAnswer);
document.getElementById('add-answer').addEventListener('click', addAnswer);

init()