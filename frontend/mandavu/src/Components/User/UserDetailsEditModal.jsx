import { CircularProgress } from "@mui/material";



export default function UserDetailsEditModal ({isUserDetailsEditModalOpen, formik, handleCloseUserDetailsEditModal, loading}) {
    if (!isUserDetailsEditModalOpen) return null;
    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-600">
                            Edit User Details
                        </h3>
                        <button
                            type="button"
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-600 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
                            onClick={handleCloseUserDetailsEditModal}
                        >
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="p-4 md:p-5">
                        <form className="space-y-4" onSubmit={formik.handleSubmit}>
                            <div>
                                <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-600">First Name</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    id="first_name"
                                    className="bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg block w-full p-2.5 focus:ring-gray-500 focus:border-gray-500"
                                    onChange={formik.handleChange}
                                    value={formik.values.first_name}
                                />
                                {formik.touched.first_name && formik.errors.first_name ? (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.first_name}</div>
                                ) : null}
                            </div>
                            <div>
                                <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-600">Last Name</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    id="last_name"
                                    className="bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg block w-full p-2.5 focus:ring-gray-500 focus:border-gray-500"
                                    onChange={formik.handleChange}
                                    value={formik.values.last_name}
                                />
                                {formik.touched.last_name && formik.errors.last_name ? (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.last_name}</div>
                                ) : null}
                            </div>
                            
                            <div className="flex justify-center pt-4">
                                <button 
                                type="submit" 
                                disabled={loading}
                                className={`w-1/2 mt-2 bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-800 transition-all duration-300 ${loading ? 'cursor-not-allowed opacity-70' : ''}`}>
                                {loading ? (
                                        <CircularProgress size={20} style={{ color: 'white' }} />
                                    ) : (
                                        'Save Changes'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
