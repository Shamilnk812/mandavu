import React from 'react'

const UserInquiryReplayModal = ({isModalOpen, inquiryReply, setInquiryReply, handleCloseModal, loading, handleSubmit}) => {
    if (!isModalOpen) return null
    return (
        <div>

            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                <div className="relative p-4 w-full max-w-md max-h-full">
                    <div className="relative bg-white rounded-lg shadow ">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-700 ">
                              Send Reply Message ..
                            </h3>
                            <button
                                type="button"
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center "
                                onClick={handleCloseModal}
                            >
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <div className="p-4 md:p-5">
                            <form className="space-y-4" onSubmit={(e) => {
                                e.preventDefault();
                                handleSubmit();
                            }}>
                                <div>
                                    <label htmlFor="inquiryReply" className="block mb-2 text-sm font-medium text-gray-900 ">Reply message</label>
                                    <textarea
                                        id="inquiryReply"
                                        name="inquiryReply"
                                        rows="4"
                                        className="bg-customColor7 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 outline-none"
                                        value={inquiryReply}
                                        onChange={(e) => setInquiryReply(e.target.value)}
                                        required
                                    ></textarea>
                                </div>
                                <div className="flex justify-center pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="mt-2 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition-all duration-300">
                                        {loading ? (
                                            <div className="w-5 h-5 border-4 border-t-white border-gray-300 rounded-full animate-spin"></div>
                                        ) : (
                                            " Submit"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    )
}

export default UserInquiryReplayModal
