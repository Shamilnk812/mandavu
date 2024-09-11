import React, {  createContext, useContext, useEffect, useState } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';




const VideoCallWebSocketContext  = createContext();

export const VideoCallWebSocketProvider = ({children}) => {

    const [vws, setVws] = useState(null);
    const [videoCallLink, setVideoCallLink] = useState('');


    const User_token = useSelector((state) => state.user.access_token);
    const Owner_token = useSelector((state) => state.owner.access_token);
    const access = User_token || Owner_token;
    const userId = access ? jwtDecode(access).user_id : null;

    useEffect(() => {
        if (userId && access) {
            const videoCallSocket = new WebSocket(`ws://localhost:8000/ws/video_call/${userId}/?token=${access}`);

            videoCallSocket.onopen = () => {
                console.log('Video call WebSocket connected globally');
                setVws(videoCallSocket);
            };

            videoCallSocket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log('Received global video call message:', data);
                if (data.link) {
                    setVideoCallLink(data.link);  // Store the link globally
                }
            };

            videoCallSocket.onclose = () => {
                console.log('Video call WebSocket disconnected globally');
            };

            return () => {
                if (videoCallSocket) {
                    videoCallSocket.close();
                }
            };
        }
    }, [userId, access]);




    return (
    <VideoCallWebSocketContext.Provider value={{vws, videoCallLink, setVideoCallLink, userId }}>
        {children}
    </VideoCallWebSocketContext.Provider>
    )
}


export const useVideoCallWebSocket = () => useContext(VideoCallWebSocketContext)


const GlobalVideoCallInvitation = () => {

    const { videoCallLink,setVideoCallLink,userId } = useVideoCallWebSocket();

    const handleClosePopup = () => {
        setVideoCallLink('')
    }

    const joinVideoCall = ()=> {
        if (videoCallLink) {
            const appID = 1387710959;
            const serverSecret = "3b21f678591c4f04ee738ad015fcf82b";
            const meetingId = videoCallLink.split('/join_call/')[1].split('/?token=')[0];
            const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, meetingId, Date.now().toString(), userId);
            const zc = ZegoUIKitPrebuilt.create(kitToken);
            // const videoCallContainer = document.getElementById('video-call-container');
            // if (videoCallContainer) {
            //     videoCallContainer.innerHTML = '';  // Clear any previous content
            // }

            zc.joinRoom({
                scenario: {
                    mode: ZegoUIKitPrebuilt.OneONoneCall,
                },
                showScreenSharingButton: true,
                onLeaveRoom: () => {
                    window.location.reload(); 
                }  
            });

            setVideoCallLink('');
        }
    };

    

    

    if (!videoCallLink) return null;  

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
        <div className="bg-white w-1/2 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Video Call Invitation</h2>
            <p className="mb-4">
                You have been invited to join a video call.
            </p>
            <button
                onClick={joinVideoCall}
                className="bg-teal-500 text-white px-4 py-2 rounded mr-2"
            >
                Join the Video Call
            </button>
            <button
                onClick={handleClosePopup}
                className="bg-red-600 text-white px-4 py-2 rounded"
            >
                Close
            </button>
        </div>
    </div>
    );
};

export default GlobalVideoCallInvitation;