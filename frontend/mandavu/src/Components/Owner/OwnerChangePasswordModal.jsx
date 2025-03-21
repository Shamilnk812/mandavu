

export default function OwnerChangePasswordModal({ isOwnerChangePasswordModalOpen, formik3, handleCloseOwnerChangePasswordModal }) {
    if (!isOwnerChangePasswordModalOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative p-4 w-full max-w-md max-h-full overflow-y-auto">
                <div className="relative bg-white rounded-lg shadow-lg ">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
                        <h3 className="text-xl font-semibold text-gray-700 ">
                            Change Password
                        </h3>
                        <button
                            type="button"
                            className="text-gray-400 bg-transparent hover:bg-customColor7 hover:text-gray-600 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center "
                            onClick={handleCloseOwnerChangePasswordModal}
                        >
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="p-4 md:p-5">
                        <form className="space-y-4" onSubmit={formik3.handleSubmit}>
                            <div>
                                <label htmlFor="old_password" className="block mb-2 text-sm font-medium text-gray-700">Old Password</label>
                                <input
                                    type="password"
                                    name="old_password"
                                    id="old_password"
                                    className="bg-customColor7 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 "
                                    onChange={formik3.handleChange}
                                    value={formik3.values.old_password}
                                />
                                {formik3.touched.old_password && formik3.errors.old_password ? (
                                    <div className="text-red-500 text-sm mt-1">{formik3.errors.old_password}</div>
                                ) : null}
                            </div>
                            <div>
                                <label htmlFor="new_password" className="block mb-2 text-sm font-medium text-gray-700">New Password</label>
                                <input
                                    type="password"
                                    name="new_password"
                                    id="new_password"
                                    className="bg-customColor7 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 "
                                    onChange={formik3.handleChange}
                                    value={formik3.values.new_password}
                                />
                                {formik3.touched.new_password && formik3.errors.new_password ? (
                                    <div className="text-red-500 text-sm mt-1">{formik3.errors.new_password}</div>
                                ) : null}
                            </div>
                            <div>
                                <label htmlFor="confirm_password" className="block mb-2 text-sm font-medium text-gray-700">Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirm_password"
                                    id="confirm_password"
                                    className="bg-customColor7 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                    onChange={formik3.handleChange}
                                    value={formik3.values.confirm_password}
                                />
                                {formik3.touched.confirm_password && formik3.errors.confirm_password ? (
                                    <div className="text-red-500 text-sm mt-1">{formik3.errors.confirm_password}</div>
                                ) : null}
                            </div>
                            <div className="flex justify-center pt-4">
                                <button
                                    type="submit"
                                    className="w-1/2 mt-2 bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-800 transition-all duration-300"
                                >
                                    Change Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
