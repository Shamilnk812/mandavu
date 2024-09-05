import React, { useState, useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

const VideoCall = ({ userId, access }) => {
    const [videoCallLink, setVideoCallLink] = useState('');
    const videoCallContainerRef = useRef(null);

    useEffect(() => {
        const socketUrl = `ws://127.0.0.1:8000/ws/video_call/${userId}/?token=${access}`;
        const ws = new WebSocket(socketUrl);

        ws.onopen = () => {
            console.log('WebSocket connection for video calls opened');
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.link) {
                setVideoCallLink(data.link);
            }
        };

        ws.onclose = () => {
            console.log('WebSocket connection for video calls closed');
        };

        ws.onerror = (event) => {
            console.error('WebSocket error for video calls:', event);
        };

        return () => {
            ws.close();
        };
    }, [userId, access]);

    const startVideoCall = async () => {
        const appID = 1387710959;
        const serverSecret = "3b21f678591c4f04ee738ad015fcf82b";
        const meetingId = `${userId}-${Date.now()}`;
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, meetingId, Date.now().toString(), userId);
        const zc = ZegoUIKitPrebuilt.create(kitToken);

        zc.joinRoom({
            container: videoCallContainerRef.current,
            scenario: {
                mode: ZegoUIKitPrebuilt.OneONoneCall,
            },
            showScreenSharingButton: true,
            onLeaveRoom: () => window.location.reload(),
        });

        const meetingLink = `http://127.0.0.1:8000/chat/join_call/${meetingId}/?token=${kitToken}`;
        setVideoCallLink(meetingLink);
    };

    const joinVideoCall = async () => {
        if (videoCallLink) {
            window.location.href = videoCallLink;
        }
    };

    const handleClosePopup = () => {
        setVideoCallLink('');
    };

    return (
        <>
            {videoCallLink && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                    <div className="bg-white w-1/2 p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Video Call Invitation</h2>
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
            )}
            <div ref={videoCallContainerRef}></div>
        </>
    );
};

export default VideoCall;
