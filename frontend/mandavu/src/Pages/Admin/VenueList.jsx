import { useState, useEffect } from "react";
import Sidebar from "../../Components/Admin/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { axiosAdminInstance } from "../../Utils/Axios/axiosInstance";
import PaginationCmp from "../../Components/Admin/PaginationCmp";
import BlockingReasonModal from "../../Components/Admin/BlockingReasonModal";
import SearchIcon from '@mui/icons-material/Search';
import ReportIcon from '@mui/icons-material/Report';
import DataLoadingSkeletonAnimation from "../../Components/Admin/DataLoadingSkeletonAnimation";


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

    const [isBlockingModalOpen, setIsBlockingModalOpen] = useState(false);
    const [blockingReason, setBlockingReason] = useState("");
    const [blockingProcessing, setBlockingProcessing] = useState(false);
    const [unblockProcessing, setUnblockProcessing] = useState(null);
    const [animationLoading, setAnimationLoading] = useState(false);





    const fetchVenueList = async () => {
        try {
            setAnimationLoading(true);
            const response = await axiosAdminInstance.get(`venue-list/?search=${searchTerm}&page=${currentPage}`);
            setVenues(response.data.results);
            setTotalPages(response.data.total_pages)

        } catch (error) {
            console.error('Something went wrong', error);
        }finally{
            setAnimationLoading(false);
        }
    };

    useEffect(() => {
        fetchVenueList();
    }, [searchTerm, currentPage]);


    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value)
        setCurrentPage(1);
    }

    const handleBlockVenue = async () => {

        try {
            setBlockingProcessing(true)
            const response = await axiosAdminInstance.post(`block-venue/${selectedVenueId}/`, { blockingReason: blockingReason })
            toast.success('Venue is blocked')
            handleCloseVenueBlockingModal()
            fetchVenueList();

        } catch (error) {
            toast.error('something wrong')
        } finally {
            setBlockingProcessing(false);
        }
    }

    const handleUnblockVenue = async (venueId) => {
        try {
            setUnblockProcessing(venueId)
            const response = await axiosAdminInstance.post(`unblock-venue/${venueId}/`)
            toast.success('venue is unbloked')
            fetchVenueList();
        } catch (error) {
            toast.error('something wrong')
        } finally {
            setUnblockProcessing(null);
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
        } finally {
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
        } finally {
            setLoadingVenue2(false)
        }

    }

    const handleViewDetails = (venueId) => {
        // navigate(`/admin/show-venue-details/${venueId}`)
        navigate(`/admin/show-venue-details2/${venueId}`)
    }


    const handleVenueBlockingModalOpen = (vid) => {
        console.log('butten cliked')
        setIsBlockingModalOpen(true)
        setSelectedVenueId(vid)
    }

    const handleCloseVenueBlockingModal = () => {
        setBlockingReason("")
        setSelectedVenueId(null)
        setIsBlockingModalOpen(false);
    }


    return (
        <>
            <Sidebar />

            <div className="p-4 md:ml-64">
                <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 mt-14">

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800">Venue Management</h2>
                            <p className="text-gray-600">Manage all venue listings and approvals</p>
                        </div>
                        <div className="relative max-w-md">
                            <input
                                type="text"
                                placeholder="Search venues..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="block w-full pl-3 py-3 border border-gray-300 rounded leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                            />
                        </div>
                    </div>

                    {/* Table Container */}
                    {/* <div className="relative overflow-x-auto shadow-sm rounded-lg"> */}
                    <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
                        <div className="relative overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-200 text-gray-600 uppercase text-sm">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 font-medium">
                                            Venue Name
                                        </th>
                                        <th scope="col" className="px-6 py-4 font-medium">
                                            Details
                                        </th>
                                        <th scope="col" className="px-6 py-4 font-medium">
                                            Created Date
                                        </th>
                                        <th scope="col" className="px-6 py-4 font-medium">
                                            Status
                                        </th>
                                        <th scope="col" className="px-6 py-4 font-medium">
                                            Approval
                                        </th>
                                        <th scope="col" className="px-6 py-4 font-medium">
                                            Action
                                        </th>
                                        <th scope="col" className="px-6 py-4 font-medium">
                                            Verification
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {animationLoading ? (
                                        <DataLoadingSkeletonAnimation/>
                                    ) : venues.length > 0 ? (
                                        venues.map((venue) => (
                                            <tr key={venue.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-medium text-gray-900">
                                                        {venue.convention_center_name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button
                                                        onClick={() => handleViewDetails(venue.id)}
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-purple-600 hover:bg-purple-700"
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-gray-500">
                                                        {new Date(venue.created_at).toLocaleDateString('en-GB')}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${venue.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {venue.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${venue.is_verified ? 'bg-green-100 text-green-800' :
                                                            venue.is_rejected ? 'bg-orange-100 text-orange-800' : 'bg-purple-100 text-purple-800'
                                                        }`}>
                                                        {venue.is_verified ? 'Verified' : venue.is_rejected ? 'Rejected' : 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {venue.is_active ? (
                                                        <button
                                                            onClick={() => handleVenueBlockingModalOpen(venue.id)}
                                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700"
                                                        >
                                                            Block
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleUnblockVenue(venue.id)}
                                                            disabled={unblockProcessing === venue.id}
                                                            className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 ${unblockProcessing === venue.id ? 'opacity-70 cursor-not-allowed' : ''
                                                                }`}
                                                        >
                                                            {unblockProcessing === venue.id ? (
                                                                <div className="w-4 h-4 border-2 border-t-white border-gray-300 rounded-full animate-spin"></div>
                                                            ) : (
                                                                <>

                                                                    Unblock
                                                                </>
                                                            )}
                                                        </button>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {venue.is_verified ? (
                                                        <span className="text-green-500">Approved</span>
                                                    ) : venue.is_rejected ? (
                                                        <span className="text-orange-500">Rejected</span>
                                                    ) : (
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleVerifyVenue(venue.id)}
                                                                disabled={loadingVenue === venue.id}
                                                                className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 ${loadingVenue === venue.id ? 'opacity-70 cursor-not-allowed' : ''
                                                                    }`}
                                                            >
                                                                {loadingVenue === venue.id ? (
                                                                    <div className="w-4 h-4 border-2 border-t-white border-gray-300 rounded-full animate-spin"></div>
                                                                ) : (
                                                                    <>
                                                                        Verify
                                                                    </>
                                                                )}
                                                            </button>
                                                            <button
                                                                onClick={() => handleOpenModal(venue.id)}
                                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-orange-600 hover:bg-orange-700"
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <ReportIcon fontSize='large' className='text-gray-500' />
                                                    <h3 className="text-lg font-medium text-gray-700">No venues found</h3>
                                                    <p className="text-gray-500 mt-1">There are currently no venues registered</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}

                            
                                </tbody>
                            </table>



                            {/* Block Venue Modal */}
                            {isBlockingModalOpen && (
                                <BlockingReasonModal
                                    isModalOpen={isBlockingModalOpen}
                                    loading={blockingProcessing}
                                    handleCloseModal={handleCloseVenueBlockingModal}
                                    handleSubmit={handleBlockVenue}
                                    blockingReason={blockingReason}
                                    setBlockingReason={setBlockingReason}
                                />
                            )}


                        </div>
                    </div>

                    {/* Pagination */}
                    {venues.length > 0 && (
                        <div className="px-6 py-4 border-t border-gray-200">
                            <PaginationCmp
                                setCurrentPage={setCurrentPage}
                                currentPage={currentPage}
                                totalPages={totalPages}
                            />
                        </div>
                    )}

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

