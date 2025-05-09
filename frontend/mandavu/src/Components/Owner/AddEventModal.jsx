

export default function AddEventModal({ showModal, handleCloseModal, formik, handleImageChange }) {

    
    if (!showModal) return null;

    const events = [
        "Wedding",
        "Birthday",
        "Business Meetings",
        "Corporate",
        "Conference",
        "Anniversary",
        "Engagement",
        "Baby Shower",
        "Graduation Party",
        "Product Launch",
        "Award Ceremonies",
        "Exhibitions",
        "Cultural Programs",
        "School Functions"
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow"> {/* Changed background color to white */}
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                    <h3 className="text-xl font-semibold text-gray-800 "> {/* Updated text color for light theme */}
                        Add Event
                    </h3>
                    <button
                        type="button"
                        className="text-gray-400 bg-transparent hover:bg-gray-100 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-200 dark:hover:text-gray-700"
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
                            <label htmlFor="eventName" className="block mb-2 text-sm font-medium text-gray-600 ">Event Name</label>
                            <select
                                name="eventName"
                                id="eventName"
                                className="bg-customColor7 border text-gray-700 text-sm rounded-lg block w-full p-2.5 "
                                value={formik.values.eventName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <option value="" disabled>Select Event</option>
                                {events.map((event, index)=> (
                                    <option key={index} value={event}>
                                    {event}
                                </option>
                                ))}
                               
                            </select>
                            {formik.touched.eventName && formik.errors.eventName ? (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.eventName}</div>
                            ) : null}
                        </div>
                        <div>
                            <label htmlFor="eventImage" className="block mb-2 text-sm font-medium text-gray-600 ">Upload Image <span className="text-gray-500"> (Supports JPEG & PNG) </span></label>
                            <input
                                type="file"
                                name="eventImage"
                                id="eventImage"
                                accept="image/jpeg, image/png"
                                className="bg-customColor7 border  text-gray-600 text-sm rounded-lg block w-full p-2.5 "
                                onChange={handleImageChange}
                            />
                            {formik.touched.eventImage && formik.errors.eventImage ? (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.eventImage}</div>
                            ) : null}
                        </div>
                        
                        <div className="flex justify-center pt-4">
                            <button type="submit" className="mt-2 bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-800 transition-all duration-300">
                                Add
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    );
}

