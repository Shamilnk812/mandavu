

export default function MaintenanceModal({ isOpen, formik, handleCloseModal, isMaintenanceProcessing }) {
    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="relative p-4 w-full max-w-md max-h-full">
                    <div className="relative bg-white rounded-lg shadow">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-800">
                                Set Maintenance
                            </h3>
                            <button
                                type="button"
                                className="text-gray-400 bg-transparent hover:bg-gray-500 hover:text-white rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
                                onClick={handleCloseModal}
                            >
                                <svg
                                    className="w-3 h-3"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 14 14"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                    />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <div className="p-4 md:p-5">
                            <form className="space-y-4" onSubmit={formik.handleSubmit}>
                                <div>
                                    <label
                                        htmlFor="start_date"
                                        className="block mb-2 text-sm font-medium text-gray-800"
                                    >
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        name="start_date"
                                        id="start_date"
                                        className="bg-customColor7 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                        value={formik.values.start_date}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        disabled
                                    />
                                    {formik.touched.start_date && formik.errors.start_date ? (
                                        <div className="text-red-500 text-sm mt-1">{formik.errors.start_date}</div>
                                    ) : null}
                                </div>
                                <div>
                                    <label
                                        htmlFor="end_date"
                                        className="block mb-2 text-sm font-medium text-gray-800"
                                    >
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        name="end_date"
                                        id="end_date"
                                        className="bg-customColor7 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                        value={formik.values.end_date}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.end_date && formik.errors.end_date ? (
                                        <div className="text-red-500 text-sm mt-1">{formik.errors.end_date}</div>
                                    ) : null}
                                </div>
                                <div>
                                    <label
                                        htmlFor="reason"
                                        className="block mb-2 text-sm font-medium text-gray-800"
                                    >
                                        Maintenance Reason
                                    </label>
                                    <textarea
                                        name="reason"
                                        id="reason"
                                        rows="4"
                                        className="bg-customColor7 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                        value={formik.values.reason}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    ></textarea>
                                    {formik.touched.reason && formik.errors.reason ? (
                                        <div className="text-red-500 text-sm mt-1">{formik.errors.reason}</div>
                                    ) : null}
                                </div>
                                <div className="text-yellow-700 bg-yellow-100 border border-yellow-400 rounded p-3 text-sm mt-4">
                                    ⚠️ <strong>Warning:</strong> If any valid bookings exist during the maintenance period, they will be <strong>canceled</strong> and <strong>refunded</strong>.
                                    <br />
                                    Are you sure you want to proceed?
                                </div>
                                <div className="flex justify-center pt-4">
                                    <button
                                        type="submit"
                                        disabled={isMaintenanceProcessing}
                                        className={`mt-2 bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-800 transition-all duration-300 ${isMaintenanceProcessing ? 'cursor-not-allowed opacity-70' : ''}`}
                                    >
                                        {isMaintenanceProcessing ? (
                                            <div className="w-5 h-5 border-4 border-t-white border-gray-300 rounded-full animate-spin"></div>
                                        ) : (
                                            "Set Maitenance"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}