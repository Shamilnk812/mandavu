import { useState } from "react";



export default function ShowFacilityDetails({facilityList}) {

    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    
    const handleOpenEditModal = () => {
        setIsEditModalOpen(true)
    };
    const handleCloseEditModal = () => {
        setIsEditModalOpen(false)
    }



    return(
<>
<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
    {/* Container for heading and button */}
    <div className="flex justify-between items-center py-4">
        <h2 className="text-lg font-bold text-gray-700 dark:text-white">Facilities</h2>
        <button
            // Function to handle opening the modal for adding a facility
            className="bg-blue-600 text-white font-medium text-sm px-4 py-2 rounded-md hover:bg-blue-700 transition duration-150"
        >
            Add Facility
        </button>
    </div>

    {/* Table */}
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-6 py-3">
                    Facilities
                </th>
                <th scope="col" className="px-6 py-3">
                    Price
                </th>
                <th scope="col" className="px-6 py-3">
                    Action
                </th>
            </tr>
        </thead>
        <tbody>
            {facilityList.map((facility) => (
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={facility.id}>
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {facility.facility}
                    </th>
                    <td className="px-6 py-4">
                        {facility.price}
                    </td>
                    <td className="px-6 py-4">
                        <button
                            type="button"
                            className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2 me-1 mb-1 dark:focus:ring-yellow-900"
                        >
                            Edit
                            
                        </button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
</div>


     { isEditModalOpen && (

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
                // onClick={handleCloseModal}
            >
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
                <span className="sr-only">Close modal</span>
            </button>
        </div>
        <div className="p-4 md:p-5">
            <form className="space-y-4" onSubmit={formik.handleSubmit}>
            <div>
                    <label htmlFor="facility" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter your Facility</label>
                    <input
                        type="text"
                        name="facility"
                        id="facility"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        // onChange={formik.handleChange}
                        // onBlur={formik.handleBlur}
                        // value={formik.values.facility}
                    />
                    {/* {formik.touched.facility && formik.errors.facility ? (
                        <div className="text-red-500 text-sm mt-1">{formik.errors.facility}</div>
                    ) : null} */}
                </div>
                <div>
                    <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
                    <input
                        type="text"
                        name="price"
                        id="price"
                        className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        // onChange={formik.handleChange}
                        // onBlur={formik.handleBlur}
                        // value={formik.values.price}
                
                    />
                    {/* {formik.touched.price && formik.errors.price ? (
                        <div className="text-red-500 text-sm mt-1">{formik.errors.price}</div>
                    ) : null} */}
                </div>

                
                <div className="flex justify-center pt-4">
                <button type="submit" className="w-1/2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add</button>
                </div>
            </form>
        </div>
    </div>
</div>
</div>
     )}





        </>
    )
}