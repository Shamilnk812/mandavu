// import React, { useState, useRef, useEffect } from 'react';
// import Peer from 'peerjs';

// const AudioCall = ({ remotePeerId, onClose }) => {
//   const [peerId, setPeerId] = useState('');
//   const peerInstance = useRef(null);

//   useEffect(() => {
//     const peer = new Peer();
//     peerInstance.current = peer;

//     peer.on('open', (id) => {
//       setPeerId(id);
//     });

//     peer.on('call', (call) => {
//       navigator.mediaDevices.getUserMedia({ audio: true, video: false })
//         .then((mediaStream) => {
//           call.answer(mediaStream);
//           call.on('stream', (remoteStream) => {
//             const audio = new Audio();
//             audio.srcObject = remoteStream;
//             audio.play();
//           });
//         });
//     });

//     return () => {
//       if (peer) {
//         peer.destroy();
//       }
//     };
//   }, []);

//   useEffect(() => {
//     if (remotePeerId && peerInstance.current) {
//       navigator.mediaDevices.getUserMedia({ audio: true, video: false })
//         .then((mediaStream) => {
//           const call = peerInstance.current.call(remotePeerId, mediaStream);
//           call.on('stream', (remoteStream) => {
//             const audio = new Audio();
//             audio.srcObject = remoteStream;
//             audio.play();
//           });
//         });
//     }
//   }, [remotePeerId]);

//   return (
//     <div>
//       <h2>Audio Call with {remotePeerId}</h2>
//       <button onClick={onClose}>End Call</button>
//     </div>
//   );
// };

// export default AudioCall;
