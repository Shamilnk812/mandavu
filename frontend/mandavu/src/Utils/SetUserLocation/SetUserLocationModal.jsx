import { useState } from "react"
import { useDispatch, useSelector } from 'react-redux';
import { setUserLocation } from "../../Redux/Slices/User";
import { motion } from 'framer-motion';

export default function SetUserLocationModal() {


    const [error, setError] = useState(null);
    const [isEnabled, setIsEnabled] = useState(false);
    const dispatch = useDispatch();

    const handleEnableLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    dispatch(
                        setUserLocation({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        })
                    );
                    setError(null); // Clear any previous errors
                },
                (error) => {
                    if (error.code === error.PERMISSION_DENIED) {
                        setError('Location access is needed to show nearby venues. Please enable location services in your browser or device settings.');
                    } else {
                        setError('An unexpected error occurred. Please try again.');
                    }
                },
                { enableHighAccuracy: true }
            );
        } else {
            setError('Geolocation is not supported by your browser.');
        }
    };

    const handleClose = () => {
        setError(null); // Reset error state on close
    };

    return (

        <>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            >
                <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                    {error ? (
                        <div className="text-center">
                            <p className="text-red-500 mb-4">{error}</p>
                            <button
                                onClick={handleClose}
                                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
                            >
                                Close
                            </button>
                        </div>
                    ) : (
                        <div className="text-center">
                            <img
                                src="/user/banner1.jpg"
                                alt="Enable location"
                                className="w-24 h-24 rounded-full mx-auto mb-4"
                            />
                            <p className="text-gray-700 mb-4">
                                Enable location to show nearby venues
                            </p>
                            <div className="flex items-center justify-center">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isEnabled}
                                        onChange={() => {
                                            setIsEnabled(!isEnabled);
                                            if (!isEnabled) handleEnableLocation();
                                        }}
                                        className="sr-only"
                                    />
                                    <div className="w-10 h-4 bg-gray-200 rounded-full shadow-inner">
                                        <div
                                            className={`w-6 h-6 bg-blue-500 rounded-full shadow transform transition ${isEnabled ? 'translate-x-5' : ''
                                                }`}
                                        ></div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </>
    )
}