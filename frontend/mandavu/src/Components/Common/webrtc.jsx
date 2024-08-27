import Peer from 'peerjs';

export const createPeer = (initiator, signalingData, onSignal, onStream, onConnect) => {
    const peer = new Peer(undefined, {
        host: 'localhost', // Replace with your PeerJS server URL or use the default PeerJS server
        port: 9000,
        path: '/mandavu/peerjs',
        secure: false,
        debug: 3
    });

    peer.on('open', (id) => {
        console.log(`My peer ID is: ${id}`);
        onSignal(id);
    });

    peer.on('call', (call) => {
        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            .then((stream) => {
                call.answer(stream); // Answer the call with our own stream
                call.on('stream', (remoteStream) => {
                    onStream(remoteStream);
                });
            });
    });

    peer.on('connection', (conn) => {
        conn.on('data', (data) => {
            if (data.type === 'offer' || data.type === 'answer' || data.type === 'ice_candidate') {
                onSignal(data);
            }
        });
    });

    const call = (peerId) => {
        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            .then((stream) => {
                const call = peer.call(peerId, stream);
                call.on('stream', (remoteStream) => {
                    onStream(remoteStream);
                });
            });
    };

    return { peer, call };
};
