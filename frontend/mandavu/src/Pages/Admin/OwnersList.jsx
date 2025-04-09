import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "../../Components/Admin/Sidebar"
import { toast } from "react-toastify"
import { axiosAdminInstance } from "../../Utils/Axios/axiosInstance"
import PaginationCmp from "../../Components/Admin/PaginationCmp"
import BlockingReasonModal from "../../Components/Admin/BlockingReasonModal"



export default function OwnersList() {
    const navigate = useNavigate()
    const [owners, setOwners] = useState([])
    const [searchTerm, setSearchTerm] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [blockingReason, setBlockingReason] = useState("");
    const [selectedOwner, setSelectedOwner] = useState(null)
    const [loading, setLoading] = useState(false);
    const [unblockProcessing , setUnblockProcessing ] = useState(null);


    const fetchOwnerslist = async () => {
        try {
            const response = await axiosAdminInstance.get(`owner-list/?search=${searchTerm}&page=${currentPage}`)
            // setOwners(response.data)
            setOwners(response.data.results)
            setTotalPages(response.data.total_pages);
            console.log(response.data)
        } catch (error) {
            console.error('somethin wrong ', error)
        }
    }

    useEffect(() => {
        fetchOwnerslist();
    }, [searchTerm, currentPage]);


    const handleBlockOwner = async () => {
        console.log('owner :',selectedOwner, 'reson ',blockingReason)
        try {
            setLoading(true);
            const response = await axiosAdminInstance.post(`block-owner/${selectedOwner}/`,{blockingReason:blockingReason})
            toast.success('Owner Account is bloked ')
            handleCloseModal()
            fetchOwnerslist()
        } catch (error) {
            toast.error('Something wrong')
        }finally{
            setLoading(false);
        }
    }

    const handleUnblockOwner = async (uid) => {
        try {
            setUnblockProcessing(uid)
            const response = await axiosAdminInstance.post(`unblock-owner/${uid}/`)
            console.log('unbloked', response.data)
            toast.success('Owner Account is unblocked')
            fetchOwnerslist()
        } catch (error) {
            toast.error('Something wrong')
        }finally{
            setUnblockProcessing(null)
        }
    }

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };
    
    const handleOpenModal = (ownerId)=> {
        setSelectedOwner(ownerId)
        setIsModalOpen(true)
    }

    const handleCloseModal = ()=> {
        setSelectedOwner(null)
        setBlockingReason("")
        setIsModalOpen(false)
    }


    return (
        <>
            <Sidebar />
            <div className="p-4 sm:ml-64  ">
                <div className="p-4 border-2 border-gray-200 border-solid  rounded-lg dark:border-gray-700 mt-14">

                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Owner Management</h2>
                        <input
                            type="text"
                            placeholder="Search users..."
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
                                        Owner Name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Venue Name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Email
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {owners.length > 0 ? (
                                    owners.map((owner, index) => (
                                        <tr key={owner.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {owner.first_name} {owner.last_name}
                                            </th>
                                            <td className="px-6 py-4">
                                                {owner.venue.convention_center_name}
                                            </td>
                                            <td className="px-6 py-4">
                                                {owner.email}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={owner.is_active ? 'text-green-500' : 'text-red-500'}>
                                                    {owner.is_active ? 'Active' : 'Not Active'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {owner.is_active ? (
                                                    <button
                                                        onClick={() => handleOpenModal(owner.id)}
                                                        // onClick={() => handleBlockOwner(owner.id)}
                                                        className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
                                                    >
                                                        Block
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleUnblockOwner(owner.id)}
                                                        disabled={unblockProcessing === owner.id}
                                                        className={`px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700 ${unblockProcessing ? 'cursor-not-allowed opacity-70' : ''}`}

                                                    >
                                                        {unblockProcessing === owner.id ? (
                                                            <div className="w-5 h-5 border-4 border-t-white border-gray-300 rounded-full animate-spin"></div>
                                                        ) : (
                                                            "Unblock"
                                                        )}
                                                    </button>)}
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

                        <BlockingReasonModal 
                            isModalOpen={isModalOpen} 
                            loading={loading} 
                            handleCloseModal={handleCloseModal}  
                            handleSubmit={handleBlockOwner}
                            blockingReason={blockingReason}
                            setBlockingReason={setBlockingReason}
                        />
                        {owners.length > 0 && (
                            <PaginationCmp setCurrentPage={setCurrentPage} currentPage={currentPage} totalPages={totalPages} />
                        )}

                    </div>
                </div>
            </div>
        </>
    )

}