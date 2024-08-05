import Sidebar from "../../Components/Owner/Sidebar";


export default function EventsManagement() {
    return(
        <>
        <Sidebar/>
        <div className="flex flex-col flex-1 ml-64 mt-10 bg-customColor1 min-h-screen">
                <div className="p-10">
                    <h3 className="text-2xl font-semibold mb-4 text-center">Edit Your Venue</h3>
                    <div className="bg-customColor2 mt-12 p-8  rounded-lg shadow-lg">

                    <div className="border-dashed border-2 border-gray-400 w-full h-40  rounded-lg flex items-center justify-center">
                            <button className="px-4 py-2 bg-blue-500 text-white rounded"> + Add Events</button>
                            
                        </div>
                        
                      
             <div className="relative overflow-x-auto bg-gray-700  shadow-md sm:rounded-lg">
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

                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Banner</th>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" >
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    new
                                </th>
                                <td className="px-6 py-4">price</td>
                                <td className="px-6 py-4"> 
                                    active
                                    {/* <span
                                    className={
                                        facility.is_active
                                            ? "text-green-500 font-semibold"
                                            : "text-red-500 font-semibold"
                                    }
                                >
                                    {facility.is_active ? "Active" : "Not Active"}
                                </span> */}
                                </td>
                                <td className="px-6 py-4">
                                    edit
                                    {/* <button
                                        type="button"
                                        className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2 me-1 mb-1 dark:focus:ring-yellow-900"
                                        onClick={() => handleOpenEditModal(facility)}
                                    >
                                        Edit
                                    </button> */}
                                    {/* {facility.is_active ? (
                                            <button
                                                type="button"
                                                className="focus:outline-none ml-2 text-white  bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2 me-1 mb-1 dark:focus:ring-red-900"
                                                onClick={()=> blockFacilities(facility.id)}
                                            >

                                                Block
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                className="focus:outline-none ml-2 text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2 me-1 mb-1 dark:focus:ring-green-900"
                                                onClick={()=> unblockFacilities(facility.id)}
                                            >
                                                Unblock
                                            </button>
                                        )} */}
                                </td>
                            </tr>
                    
                    </tbody>
                </table>
            </div>



                    </div>
                </div>
            </div>
        </>
    )
}