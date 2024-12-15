import { toast } from "react-toastify";
import { useState } from "react";



export default function BookingPackageRejectionModal({
    isModalOpen,
    closeModal,
    rejectionReason,
    setRejectionReason,
    handleBookingPackageRejection,
}) {


    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!rejectionReason.trim()) {
            toast.warning("Please enter a valid reason.");
            return;
        }

        setIsLoading(true); 
        try {
            await handleBookingPackageRejection(); 
            setIsLoading(false); 
        } catch (error) {
            console.error("Error handling rejection:", error);
            setIsLoading(false); 
            toast.error("An error occurred. Please try again.");
        }
    };


    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h2 className="text-lg text-center text-white rounded-lg font-semibold mb-4 bg-gray-700 py-2">
                    Reject Booking Package
                </h2>
                <textarea
                    className="w-full p-2 border rounded-lg mb-4"
                    rows="4"
                    placeholder="Type rejection reason..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                ></textarea>
                <div className="flex justify-end gap-4">
                    <button
                        className="bg-gray-600 text-white py-1 px-4 rounded hover:bg-gray-700"
                        onClick={closeModal}
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    

                    <button
                        className="py-1 px-4 rounded text-white bg-red-600 hover:bg-red-700"
                        onClick={handleSubmit}
                        disabled={isLoading} 
                    >

                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <div
                                    className="w-5 h-5 border-4 border-t-white border-gray-300 rounded-full animate-spin"
                                ></div>
                            </div>
                        ) : (
                            "Submit"
                        )}

                    </button>
                </div>
            </div>
        </div>
    );
}
