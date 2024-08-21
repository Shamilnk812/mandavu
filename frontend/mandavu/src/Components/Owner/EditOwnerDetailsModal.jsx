

export default function EditOwnerDetailsModal ({isOwnerDetailsEditModalOpen , formik1,handleCloseOwnerDetailsEditModal}) {
    if (!isOwnerDetailsEditModalOpen) return null
    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-teal-800 rounded-lg shadow dark:bg-teal-800">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Edit Facilities
                    </h3>
                    <button
                        type="button"
                        className="text-gray-400 bg-transparent hover:bg-customColor7 hover:text-gray-600 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-customColor7 dark:hover:text-gray-600"
                        onClick={handleCloseOwnerDetailsEditModal}
                    >
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>
                <div className="p-4 md:p-5">
                    <form className="space-y-4" onSubmit={formik1.handleSubmit}>
                        <div>
                            <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name</label>
                            <input
                                type="text"
                                name="first_name"
                                id="first_name"
                                className="bg-customColor7 border border-teal-500 text-gray-900 text-sm rounded-lg  block w-full p-2.5 dark:bg-customColor7 dark:border-teal-500 dark:placeholder-teal-500 dark:text-gray-800"
                                onChange={formik1.handleChange}
                                value={formik1.values.first_name}
                            />
                            {formik1.touched.first_name && formik1.errors.first_name ? (
                                <div className="text-red-500 text-sm mt-1">{formik1.errors.first_name}</div>
                            ) : null}
                        </div>
                        <div>
                            <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Name</label>
                            <input
                                type="text"
                                name="last_name"
                                id="last_name"
                                className="bg-customColor7 border border-teal-500 text-gray-900 text-sm rounded-lg  block w-full p-2.5 dark:bg-customColor7 dark:border-teal-500 dark:placeholder-teal-500 dark:text-gray-800"
                                onChange={formik1.handleChange}
                                value={formik1.values.last_name}
                            />
                            {formik1.touched.last_name && formik1.errors.last_name ? (
                                <div className="text-red-500 text-sm mt-1">{formik1.errors.last_name}</div>
                            ) : null}
                        </div>
                        <div>
                            <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone Number</label>
                            <input
                                type="text"
                                name="phone"
                                id="phone"
                                className="bg-customColor7 border border-teal-500 text-gray-900 text-sm rounded-lg  block w-full p-2.5 dark:bg-customColor7 dark:border-teal-500 dark:placeholder-teal-500 dark:text-gray-800"
                                onChange={formik1.handleChange}
                                value={formik1.values.phone}
                            />
                            {formik1.touched.phone && formik1.errors.phone ? (
                                <div className="text-red-500 text-sm mt-1">{formik1.errors.phone}</div>
                            ) : null}
                        </div>
                        <div>
                            <label htmlFor="phone2" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Additional Phone Number</label>
                            <input
                                type="text"
                                name="phone2"
                                id="phone2"
                                className="bg-customColor7 border border-teal-500 text-gray-900 text-sm rounded-lg  block w-full p-2.5 dark:bg-customColor7 dark:border-teal-500 dark:placeholder-teal-500 dark:text-gray-800"
                                onChange={formik1.handleChange}
                                value={formik1.values.phone2}
                            />
                            {formik1.touched.phone2 && formik1.errors.phone2 ? (
                                <div className="text-red-500 text-sm mt-1">{formik1.errors.phone2}</div>
                            ) : null}
                        </div>
                        
                        <div className="flex justify-center pt-4">
                            <button type="submit" className="w-1/2 mt-2 bg-teal-600 text-white py-2 px-4 rounded hover:bg-gradient-to-r from-teal-500 to-gray-800">
                                Update
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    )
}