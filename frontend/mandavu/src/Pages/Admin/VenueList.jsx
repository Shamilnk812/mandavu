import { useState, useEffect } from "react";
import Sidebar from "../../Components/Admin/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { axiosAdminInstance } from "../../Utils/Axios/axiosInstance";
import PaginationCmp from "../../Components/Admin/PaginationCmp";


export default function VenueList() {

    const navigate = useNavigate()
    const [venues, setVenues] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedVenueId, setSelectedVenueId] = useState(null)
    const [rejectionReason, setRejectionReason] = useState("")
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loadingVenue, setLoadingVenue] = useState(null);
    const [loadingVenue2, setLoadingVenue2] = useState(null);


    


    const fetchVenueList = async () => {
        try {
            const response = await axiosAdminInstance.get(`venue-list/?search=${searchTerm}&page=${currentPage}`);
            setVenues(response.data.results);
            setTotalPages(response.data.total_pages)
         
        } catch (error) {
            console.error('Something went wrong', error);
        }
    };

    useEffect(() => {
        fetchVenueList();
    }, [searchTerm,currentPage]);


    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value)
        setCurrentPage(1);
    }

    const handleBlockVenue = async (venueId) => {
        try {
            const response = await axiosAdminInstance.post(`block-venue/${venueId}/`)
            toast.success('Venue is blocked')
            fetchVenueList();

        } catch (error) {
            toast.error('something wrong')
        }
    }

    const handleUnblockVenue = async (venueId) => {
        try {
            const response = await axiosAdminInstance.post(`unblock-venue/${venueId}/`)
            toast.success('venue is unbloked')
            fetchVenueList();
        } catch (error) {
            toast.error('something wrong')
        }
    }

    const handleVerifyVenue = async (venueId) => {
        setLoadingVenue(venueId)
        try {
            const response = await axiosAdminInstance.post(`verify-venue/${venueId}/`);
            console.log(response.data)
            toast.success('venue is verified successfully')
            fetchVenueList()
        } catch (error) {
            toast.error('something wrong')
        }finally{
            setLoadingVenue(null)
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
        setLoadingVenue2(true)
        try {
            const response = await axiosAdminInstance.post(`reject-venue/${selectedVenueId}/`, { reason: rejectionReason })
            toast.success('Venues is rejected successfully')
            fetchVenueList()
            handleCloseModal()
        } catch (error) {
            toast.error('Failed to reject the venue!')
        }finally{
            setLoadingVenue2(false)
        }

    }

    const handleViewDetails = (venueId) => {
        // navigate(`/admin/show-venue-details/${venueId}`)
        navigate(`/admin/show-venue-details2/${venueId}`)
    }


    return (
        <>
            <Sidebar />
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
                            {venues.length > 0 ? (
                                venues.map((venue) => (
                                    <tr key={venue.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {venue.convention_center_name}
                                        </th>
                                        <td className="px-6 py-4">
                                            <button type="button"
                                                className="px-4 py-2 text-white bg-purple-700 rounded hover:bg-purple-800"
                                                onClick={() => handleViewDetails(venue.id)}
                                            >
                                                View Details</button>

                                        </td>
                                        <td className="px-6 py-4">
                                            {new Date(venue.created_at).toLocaleDateString('en-GB')}
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
                                                    onClick={() => handleBlockVenue(venue.id)}
                                                    className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
                                                >
                                                    Block
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleUnblockVenue(venue.id)}
                                                    className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
                                                >
                                                    Unblock
                                                </button>)}
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
                                                        disabled={loadingVenue === venue.id}
                                                        className="px-4 py-2 ml-2 text-white bg-green-600 rounded hover:bg-green-700"
                                                    >
                                                        {loadingVenue === venue.id ? (
                                                            <div className="w-5 h-5 border-4 border-t-white border-gray-300 rounded-full animate-spin"></div>
                                                        ) : (
                                                            " Verify"
                                                        )}
                                                       
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
                                ))
                            
                            ) : (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="px-6 py-8 text-center text-lg text-gray-700 dark:text-gray-700"
                                    >
                                        No records found
                                    </td>
                                </tr>
                            )}

                            </tbody>
                        </table>

                        {venues.length > 0 && (
                            <PaginationCmp  setCurrentPage={setCurrentPage} currentPage={currentPage} totalPages={totalPages}/>
                        )}
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                    <div className="relative p-4 w-full max-w-md max-h-full">
                        <div className="relative bg-white rounded-lg shadow ">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-xl font-semibold text-gray-700 ">
                                    Reject Venue
                                </h3>
                                <button
                                    type="button"
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center "
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
                                        <label htmlFor="cancelReason" className="block mb-2 text-sm font-medium text-gray-900 ">Reason for Rejection</label>
                                        <textarea
                                            id="cancelReason"
                                            name="cancelReason"
                                            rows="4"
                                            className="bg-customColor7 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 outline-none"
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="flex justify-center pt-4">
                                        <button 
                                            type="submit" 
                                            disabled={loadingVenue2}
                                            className="mt-2 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition-all duration-300">
                                            {loadingVenue2 ? (
                                                <div className="w-5 h-5 border-4 border-t-white border-gray-300 rounded-full animate-spin"></div>
                                                ) : (
                                                 " Submit"
                                                        )}
                                            </button>
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