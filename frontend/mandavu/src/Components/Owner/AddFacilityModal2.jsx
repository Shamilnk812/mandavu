import { CircularProgress } from "@mui/material";


export default function AddFacilityModal2({ showModal, handleCloseModal, formik , loading}) {

    
    if (!showModal) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-xl font-semibold text-gray-800 ">
                            Add Facility
                        </h3>
                        <button
                            type="button"
                            className="text-gray-400 bg-transparent hover:bg-gray-500 hover:text-white rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center "
                            onClick={handleCloseModal}
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
                                <label htmlFor="facility" className="block mb-2 text-sm font-medium text-gray-800">Facility</label>
                                <input
                                    type="text"
                                    name="facility"
                                    id="facility"
                                    className="bg-customColor7 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 "
                                    value={formik.values.facility}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.facility && formik.errors.facility ? (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.facility}</div>
                                ) : null}
                            </div>
                            <div>
                                <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-800">Price</label>
                                <input
                                    type="text"
                                    name="price"
                                    id="price"
                                    className="bg-customColor7 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                    value={formik.values.price}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.price && formik.errors.price ? (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.price}</div>
                                ) : null}
                            </div>
                            <div className="flex justify-center pt-4">
                                <button 
                                type="submit" 
                                disabled={loading}
                                className={`mt-2 bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-800 transition-all duration-300 ${loading ? 'cursor-not-allowed opacity-70' : ''}`}>
                                     {loading ? (
                                        <CircularProgress size={20} style={{ color: 'white' }} />
                                    ) : (
                                        'Add'
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
