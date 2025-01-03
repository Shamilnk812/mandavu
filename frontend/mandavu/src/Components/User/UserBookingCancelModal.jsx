import { CircularProgress } from "@mui/material";


const UserBookingCancelModal = ({ isModalOpen, handleCloseModal, handleFormSubmit, setCancelReason, cancelReason,loading }) => {

    if (!isModalOpen) return null;



    return (
        <div id="authentication-modal" tabIndex="-1" className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50">
            <div className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-white">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-xl font-semibold text-gray-600">
                            Cancel Booking
                        </h3>
                        <button
                            type="button"
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-400 dark:hover:text-white"
                            onClick={handleCloseModal}
                        >
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="p-4 md:p-5">
                        <form className="space-y-4" onSubmit={handleFormSubmit}>
                            <div>
                                <label htmlFor="cancelReason" className="block mb-2 text-sm font-medium text-gray-600">Reason for Cancellation</label>
                                <textarea
                                    id="cancelReason"
                                    name="cancelReason"
                                    rows="4"
                                    className="bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg block w-full p-2.5 focus:ring-gray-500 focus:border-gray-500" value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}

                                ></textarea>
                            </div>
                            <div className="flex justify-center pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-1/2 mt-2 bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-600  transition-all duration-300 ${loading ? 'cursor-not-allowed opacity-70' : ''} `}
                                >
                                    {loading ? (
                                        <CircularProgress size={20} style={{ color: 'white' }} />
                                    ) : (
                                        'Submit'
                                    )}

                                   
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default UserBookingCancelModal;