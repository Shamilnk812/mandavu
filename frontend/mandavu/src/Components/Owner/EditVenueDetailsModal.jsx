
import { CircularProgress } from "@mui/material";


export default function VenueDetailsEditModal({ isVenueDetailsEditModalOpen, formik2, handleCloseVenueDetailsEditModal, loading }) {
    if (!isVenueDetailsEditModalOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative w-full max-w-2xl max-h-full">
                <div className="relative bg-white rounded-lg shadow ">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
                        <h3 className="text-xl font-semibold text-gray-800">
                            Edit Venue Details
                        </h3>
                        <button
                            type="button"
                            className="text-gray-400 bg-transparent hover:bg-customColor7 hover:text-gray-600 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center d"
                            onClick={handleCloseVenueDetailsEditModal}
                        >
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="p-4 md:p-5 max-h-[80vh] overflow-auto">
                        <form className="space-y-4" onSubmit={formik2.handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="convention_center_name" className="block mb-2 text-sm font-medium text-gray-700 ">Convention Center Name</label>
                                    <input
                                        type="text"
                                        name="convention_center_name"
                                        id="convention_center_name"
                                        className="bg-customColor7 border border-gray-300 text-gray-700 text-sm rounded-lg block w-full p-2.5 "
                                        onChange={formik2.handleChange}
                                        value={formik2.values.convention_center_name}
                                    />
                                    {formik2.touched.convention_center_name && formik2.errors.convention_center_name ? (
                                        <div className="text-red-500 text-sm mt-1">{formik2.errors.convention_center_name}</div>
                                    ) : null}
                                </div>
                                <div>
                                    <label htmlFor="short_description" className="block mb-2 text-sm font-medium text-gray-700 ">Short Description</label>
                                    <input
                                        type="text"
                                        name="short_description"
                                        id="short_description"
                                        className="bg-customColor7 border border-gray-300 text-gray-700 text-sm rounded-lg block w-full p-2.5 "
                                        onChange={formik2.handleChange}
                                        value={formik2.values.short_description}
                                    />
                                    {formik2.touched.short_description && formik2.errors.short_description ? (
                                        <div className="text-red-500 text-sm mt-1">{formik2.errors.short_description}</div>
                                    ) : null}
                                </div>
                                <div className="col-span-2">
                                    <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700 ">Description</label>
                                    <textarea
                                        name="description"
                                        id="description"
                                        className="bg-customColor7 border border-gray-300 text-gray-700 text-sm rounded-lg block w-full p-2.5 "
                                        onChange={formik2.handleChange}
                                        value={formik2.values.description}
                                        rows="3"
                                    />
                                    {formik2.touched.description && formik2.errors.description ? (
                                        <div className="text-red-500 text-sm mt-1">{formik2.errors.description}</div>
                                    ) : null}
                                </div>
                                <div>
                                    <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-700 ">Price</label>
                                    <input
                                        type="number"
                                        name="price"
                                        id="price"
                                        className="bg-customColor7 border border-gray-300 text-gray-700 text-sm rounded-lg block w-full p-2.5 "
                                        onChange={formik2.handleChange}
                                        value={formik2.values.price}
                                    />
                                    {formik2.touched.price && formik2.errors.price ? (
                                        <div className="text-red-500 text-sm mt-1">{formik2.errors.price}</div>
                                    ) : null}
                                </div>
                                <div>
                                    <label htmlFor="dining_seat_count" className="block mb-2 text-sm font-medium text-gray-700 ">Dining Seat Count</label>
                                    <input
                                        type="number"
                                        name="dining_seat_count"
                                        id="dining_seat_count"
                                        className="bg-customColor7 border border-gray-300 text-gray-700 text-sm rounded-lg block w-full p-2.5 "
                                        onChange={formik2.handleChange}
                                        value={formik2.values.dining_seat_count}
                                    />
                                    {formik2.touched.dining_seat_count && formik2.errors.dining_seat_count ? (
                                        <div className="text-red-500 text-sm mt-1">{formik2.errors.dining_seat_count}</div>
                                    ) : null}
                                </div>
                                <div>
                                    <label htmlFor="auditorium_seat_count" className="block mb-2 text-sm font-medium text-gray-700 ">Auditorium Seat Count</label>
                                    <input
                                        type="number"
                                        name="auditorium_seat_count"
                                        id="auditorium_seat_count"
                                        className="bg-customColor7 border border-gray-300 text-gray-700 text-sm rounded-lg block w-full p-2.5 "
                                        onChange={formik2.handleChange}
                                        value={formik2.values.auditorium_seat_count}
                                    />
                                    {formik2.touched.auditorium_seat_count && formik2.errors.auditorium_seat_count ? (
                                        <div className="text-red-500 text-sm mt-1">{formik2.errors.auditorium_seat_count}</div>
                                    ) : null}
                                </div>
                                {/* <div>
                                    <label htmlFor="condition" className="block mb-2 text-sm font-medium text-gray-700 ">Condition</label>
                                    <input
                                        type="text"
                                        name="condition"
                                        id="condition"
                                        className="bg-customColor7 border border-gray-300 text-gray-700 text-sm rounded-lg block w-full p-2.5 "
                                        onChange={formik2.handleChange}
                                        value={formik2.values.condition}
                                    />
                                    {formik2.touched.condition && formik2.errors.condition ? (
                                        <div className="text-red-500 text-sm mt-1">{formik2.errors.condition}</div>
                                    ) : null}
                                </div> */}
                                <div>
                                    <label htmlFor="state" className="block mb-2 text-sm font-medium text-gray-700 ">State</label>
                                    <input
                                        type="text"
                                        name="state"
                                        id="state"
                                        className="bg-customColor7 border border-gray-300 text-gray-700 text-sm rounded-lg block w-full p-2.5 "
                                        onChange={formik2.handleChange}
                                        value={formik2.values.state}
                                    />
                                    {formik2.touched.state && formik2.errors.state ? (
                                        <div className="text-red-500 text-sm mt-1">{formik2.errors.state}</div>
                                    ) : null}
                                </div>
                                <div>
                                    <label htmlFor="district" className="block mb-2 text-sm font-medium text-gray-700 ">District</label>
                                    <input
                                        type="text"
                                        name="district"
                                        id="district"
                                        className="bg-customColor7 border border-gray-300 text-gray-700 text-sm rounded-lg block w-full p-2.5 "
                                        onChange={formik2.handleChange}
                                        value={formik2.values.district}
                                    />
                                    {formik2.touched.district && formik2.errors.district ? (
                                        <div className="text-red-500 text-sm mt-1">{formik2.errors.district}</div>
                                    ) : null}
                                </div>
                                <div>
                                    <label htmlFor="pincode" className="block mb-2 text-sm font-medium text-gray-700 ">Pincode</label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        id="pincode"
                                        className="bg-customColor7 border border-gray-300 text-gray-700 text-sm rounded-lg block w-full p-2.5 "
                                        onChange={formik2.handleChange}
                                        value={formik2.values.pincode}
                                    />
                                    {formik2.touched.pincode && formik2.errors.pincode ? (
                                        <div className="text-red-500 text-sm mt-1">{formik2.errors.pincode}</div>
                                    ) : null}
                                </div>
                                <div className="col-span-2">
                                    <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-700 ">Full Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        id="address"
                                        className="bg-customColor7 border border-gray-300 text-gray-700 text-sm rounded-lg block w-full p-2.5 "
                                        onChange={formik2.handleChange}
                                        value={formik2.values.address}
                                    />
                                    {formik2.touched.address && formik2.errors.address ? (
                                        <div className="text-red-500 text-sm mt-1">{formik2.errors.address}</div>
                                    ) : null}
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`text-white  bg-teal-500 hover:bg-teal-800 font-medium rounded-lg text-sm mt-2 px-5 py-2.5 text-center transition-all duration-300 ${loading ? 'cursor-not-allowed opacity-70' : ''}`}
                                >
                                    {loading ? (
                                        <CircularProgress size={20} style={{ color: 'white' }} />
                                    ) : (
                                        'Save changes'
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
