import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "../../Components/Admin/Sidebar"
import { toast } from "react-toastify"
import { axiosAdminInstance } from "../../Utils/Axios/axiosInstance"
import PaginationCmp from "../../Components/Admin/PaginationCmp"
import BlockingReasonModal from "../../Components/Admin/BlockingReasonModal"

export default function UserList() {

    const navigate = useNavigate()
    const [userList, setUserList] = useState([])
    const [searchTerm, setSearchTerm] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [blockingReason, setBlockingReason] = useState('');
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [unblockProcessing , setUnblockProcessing ] = useState(null);

    const fetchUserList = async () => {
        try {
            const response = await axiosAdminInstance.get(`user-list/?search=${searchTerm}&page=${currentPage}`);
            // const response = await axiosAdminInstance.get(`user-list/?search=${searchTerm}`);
            setUserList(response.data.results);
            setTotalPages(response.data.total_pages);
        } catch (error) {
            console.error('Error fetching user list', error);
        }
    };

    useEffect(() => {
        fetchUserList();
    }, [searchTerm, currentPage]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handleBlockClick = async () => {
        console.log('user ', selectedUserId, 'reason ', blockingReason)
        const trimmedReason = blockingReason.trim();
        if (!trimmedReason) {
            toast.warning("Enter a valid reason");
            return;
        }

        if (/^\d+$/.test(trimmedReason)) {
            toast.warning("Reason should not contain only numbers. Enter valid one");
            return;
        }

        try {
            setLoading(true)
            const response = await axiosAdminInstance.post(`block-user/${selectedUserId}/`, { blockingReason: blockingReason })
            toast.success('User account is blocked ')
            handleCloseModal()
            fetchUserList()
        } catch (error) {
            console.error('Error Blocking user', error)
            toast.error('Something wrong')
        } finally {
            setLoading(false);
        }
    };

    const handleUnblockClick = async (uid) => {
        try {
            setUnblockProcessing(uid);
            const response = await axiosAdminInstance.post(`unblock-user/${uid}/`)
            toast.success('User account is Unblock.')
            fetchUserList()
        } catch (error) {
            toast.error('Something Wrong')
        }finally{
            setUnblockProcessing(null);
        }

    };


    const handleOpenModal = (uid) => {
        setSelectedUserId(uid)
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedUserId(null)
        setBlockingReason("")
    }




    return (
        <>
            <Sidebar />
            <div className="p-4 sm:ml-64  ">
                <div className="p-4 border-2 border-gray-200 border-solid  rounded-lg dark:border-gray-700 mt-14">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">User Management</h2>
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
                                        Full Name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Email
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Date Joined
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
                                {userList.length > 0 ? (
                                    userList.map((user, index) => (
                                        <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {user.first_name} {user.last_name}
                                            </th>
                                            <td className="px-6 py-4">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4">
                                                {new Date(user.date_joined).toLocaleDateString('en-GB')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={user.is_active ? 'text-green-500' : 'text-red-500'}>
                                                    {user.is_active ? 'Active' : 'Not Active'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.is_active ? (
                                                    <button
                                                        onClick={() => handleOpenModal(user.id)}
                                                        className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
                                                    >
                                                        Block
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleUnblockClick(user.id)}
                                                        disabled={unblockProcessing === user.id}
                                                        className={`px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700 ${unblockProcessing ? 'cursor-not-allowed opacity-70' : ''}`}
                                                    >
                                                        {unblockProcessing === user.id ? (
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



                        {userList.length > 0 && (
                            <PaginationCmp setCurrentPage={setCurrentPage} totalPages={totalPages} currentPage={currentPage} />
                        )}

                        {isModalOpen && (
                            <BlockingReasonModal
                                isModalOpen={isModalOpen}
                                loading={loading}
                                handleCloseModal={handleCloseModal}
                                handleSubmit={handleBlockClick}
                                blockingReason={blockingReason}
                                setBlockingReason={setBlockingReason}
                            />
                        )}


                    </div>
                </div>
            </div>
        </>
    )
}