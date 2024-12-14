import { useState,useEffect } from "react";
import Sidebar from "../../Components/Admin/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { axiosAdminInstance } from "../../Utils/Axios/axiosInstance";


export default function VenueList() {
    
    const navigate = useNavigate()
    const [venues, setVenues] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedVenueId, setSelectedVenueId] = useState(null)
    const [rejectionReason, setRejectionReason] = useState("")

    // useEffect(()=>{
    //     const fetchVeneuList = async ()=>{
    //         try{
    //             const response = await axios.get(`http://127.0.0.1:8000/api/admin_dash/auth/venue-list/?search=${searchTerm}`);
    //             setVenues(response.data)
    //             console.log(response.data)
    //         }catch(error) {
    //             console.error('something wrong',error)
    //         }
    //     }
    //     fetchVeneuList()
    // },[searchTerm])


    const fetchVenueList = async () => {
        try {
            const response = await axiosAdminInstance.get(`venue-list/?search=${searchTerm}`);
            setVenues(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Something went wrong', error);
        }
    };
    
    useEffect(() => {
        fetchVenueList();
    }, [searchTerm]);
    

    const handleSearchChange = (event) =>{
        setSearchTerm(event.target.value)
    }

    const handleBlockVenue = async (venueId) => {
        try{
            const response = await axiosAdminInstance.post(`block-venue/${venueId}/`)
             toast.success('Venue is blocked')
             fetchVenueList();
           
        }catch (error) {
            toast.error('something wrong')
        }
    }

    const handleUnblockVenue = async (venueId) =>{
        try{
            const response = await axiosAdminInstance.post(`unblock-venue/${venueId}/`)
             toast.success('venue is unbloked')
             fetchVenueList();
        }catch (error) {
            toast.error('something wrong')
        }
    }

    const handleVerifyVenue = async (venueId) =>{
        try{
            const response = await axiosAdminInstance.post(`verify-venue/${venueId}/`);
            console.log(response.data)
            toast.success('venue is verified successfully')
            fetchVenueList()
        }catch (error) {
            toast.error('something wrong')
        }
    }
    
    const handleOpenModal = (venueId) => {
        setIsModalOpen(true)
        setSelectedVenueId(venueId)
    }
    
    const handleCloseModal = () => {
       setIsModalOpen(false)
       setRejectionReason("")
       setSelectedVenueId(null)
    }

    const handleRejectionVenue = async (e) => {
        e.preventDefault();
        if (!rejectionReason.trim()) {
            toast.error('Please enter a valid reason');
            return;
        }

        try{
             const response = await axiosAdminInstance.post(`reject-venue/${selectedVenueId}/`,{ reason: rejectionReason })
             toast.success('Venues is rejected successfully')
             fetchVenueList()
             handleCloseModal()
        }catch(error) {
            toast.error('Failed to reject the venue!')
        }
        
    }

    const handleViewDetails = (venueId) => {
        // navigate(`/admin/show-venue-details/${venueId}`)
        navigate(`/admin/show-venue-details2/${venueId}`)
    }


    return(
        <>
        <Sidebar/>
        <div className="p-4 sm:ml-64  ">
         <div className="p-4 border-2 border-gray-200 border-solid  rounded-lg dark:border-gray-700 mt-14">
         <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Venue Management</h2>
                        <input
                            type="text"
                            placeholder="Search Venue..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="px-4 py-2 border rounded"
                        />
                    </div>

<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-6 py-3">
                    Venue Name
                </th>
                <th scope="col" className="px-6 py-3">
                    Details
                </th>
                <th scope="col" className="px-6 py-3">
                    Created Date
                </th>
                <th scope="col" className="px-6 py-3">
                    Status
                </th>
                <th scope="col" className="px-6 py-3">
                    Approval Status
                </th>
                <th scope="col" className="px-6 py-3">
                    Action
                </th>
                <th scope="col" className="px-6 py-3">
                    Verification
                </th>
            </tr>
        </thead>
        <tbody>
            {venues.map((venue) =>(
                <tr key={venue.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {venue.name}
                </th>
                <td className="px-6 py-4">
                <button type="button" 
                 className="px-4 py-2 text-white bg-purple-700 rounded hover:bg-purple-800"
                 onClick={() => handleViewDetails(venue.id)}
                    >
                    View Details</button>

                </td>
                <td className="px-6 py-4">
                {venue.created_at}
                </td>
                <td className="px-6 py-4">
                    <span className={venue.is_active ? 'text-green-500' : 'text-red-500'}>
                        {venue.is_active ? 'Active' : 'Not Active'}
                    </span>
                    
                </td>
                <td className="px-6 py-4">
                {venue.is_verified ? (
                    <span className="text-green-500">Verified</span>
                ) : venue.is_rejected ? (
                    <span className="text-orange-500">Rejected</span>
                ) : (
                    <span className="text-purple-500">Pending</span>
                )}
                </td>
                <td className="px-6 py-4">
                {venue.is_active ? (
                            <button
                            onClick={()=> handleBlockVenue(venue.id)}
                            className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
                            >
                            Block
                           </button>
                           ) : (
                           <button
                            onClick={()=> handleUnblockVenue(venue.id)}
                            className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
                            >
                            Unblock
                    </button> )}
                </td>
                <td className="px-6 py-4">
                    
                {venue.is_verified ? (
                    <span className="text-green-500">Approved</span>
                ) : venue.is_rejected ? (
                    <span className="text-orange-500">Rejected</span>
                ) : (
                    <>
                        <button
                            onClick={() => handleVerifyVenue(venue.id)}
                            className="px-4 py-2 ml-2 text-white bg-green-600 rounded hover:bg-green-700"
                        >
                            Verify
                        </button>
                        <button
                            onClick={() => handleOpenModal(venue.id)}
                            className="px-4 py-2 ml-2 text-white bg-orange-600 rounded hover:bg-orange-700"
                        >
                            Reject
                        </button>
                    </>
                )}
                </td>
            </tr>
            ))}
             
        </tbody>
    </table>
</div>
   </div>
</div>

 {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                    <div className="relative p-4 w-full max-w-md max-h-full">
                        <div className="relative bg-gray-800 rounded-lg shadow dark:bg-gray-800">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Reject Venue
                                </h3>
                                <button
                                    type="button"
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                    onClick={handleCloseModal}
                                >
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            <div className="p-4 md:p-5">
                                <form className="space-y-4" onSubmit={handleRejectionVenue}>
                                    <div>
                                        <label htmlFor="cancelReason" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Reason for Rejection</label>
                                        <textarea
                                            id="cancelReason"
                                            name="cancelReason"
                                            rows="4"
                                            className="bg-customColor7 border border-teal-500 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-customColor7 dark:border-teal-500 dark:placeholder-teal-500 dark:text-gray-800"
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="flex justify-center pt-4">
                                        <button type="submit" className="mt-2 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700">Submit</button>
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