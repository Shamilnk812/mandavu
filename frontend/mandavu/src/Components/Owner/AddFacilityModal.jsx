

export default function AddFacilityModal({isOpen, formik2, handleClose}) {
    if(!isOpen) return null;
    return(
        <>
           <div id="authentication-modal" tabIndex="-1" className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden">
                    <div className="relative p-4 w-full max-w-md max-h-full">
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Add Facilites 
                                </h3>
                                <button
                                    type="button"
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                    onClick={handleClose}
                                >
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            <div className="p-4 md:p-5">
                                <form className="space-y-4" onSubmit={formik2.handleSubmit}>
                                <div>
                                        <label htmlFor="facility" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter your Facility</label>
                                        <input
                                            type="text"
                                            name="facility"
                                            id="facility"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            onChange={formik2.handleChange}
                                            onBlur={formik2.handleBlur}
                                            value={formik2.values.facility}
                                        />
                                        {formik2.touched.facility && formik2.errors.facility ? (
                                            <div className="text-red-500 text-sm mt-1">{formik2.errors.facility}</div>
                                        ) : null}
                                    </div>
                                    <div>
                                        <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
                                        <input
                                            type="text"
                                            name="price"
                                            id="price"
                                            className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            onChange={formik2.handleChange}
                                            onBlur={formik2.handleBlur}
                                            value={formik2.values.price}
                                    
                                        />
                                        {formik2.touched.price && formik2.errors.price ? (
                                            <div className="text-red-500 text-sm mt-1">{formik2.errors.price}</div>
                                        ) : null}
                                    </div>

                                    
                                    <div className="flex justify-center pt-4">
                                    <button type="submit" className="w-1/2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
           
        </>
    )
}