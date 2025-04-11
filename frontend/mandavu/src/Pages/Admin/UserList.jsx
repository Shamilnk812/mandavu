import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "../../Components/Admin/Sidebar"
import { toast } from "react-toastify"
import { axiosAdminInstance } from "../../Utils/Axios/axiosInstance"
import PaginationCmp from "../../Components/Admin/PaginationCmp"
import BlockingReasonModal from "../../Components/Admin/BlockingReasonModal"
import NoDataFoundMessage from "../../Components/Admin/NoDataFoundMessage"
import DataLoadingSkeletonAnimation from "../../Components/Admin/DataLoadingSkeletonAnimation"
import PersonIcon from '@mui/icons-material/Person';



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
    const [unblockProcessing, setUnblockProcessing] = useState(null);
    const [animationLoading, setAnimationLoading] = useState(false);


    const fetchUserList = async () => {
        try {
            setAnimationLoading(true);
            const response = await axiosAdminInstance.get(`user-list/?search=${searchTerm}&page=${currentPage}`);
            // const response = await axiosAdminInstance.get(`user-list/?search=${searchTerm}`);
            setUserList(response.data.results);
            setTotalPages(response.data.total_pages);
        } catch (error) {
            console.error('Error fetching user list', error);
        } finally {
            setAnimationLoading(false);
        }
    };

    useEffect(() => {
        fetchUserList();
    }, [searchTerm, currentPage]);

    const handleSearchChange = (event) => {
        const value = event.target.value.trimStart();
        setSearchTerm(value);
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
        } finally {
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

            <div className="p-4 md:ml-64  ">
                <div className="p-4 border-2 border-gray-200 border-solid  rounded-lg mt-14">

                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">User Management</h2>
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="px-4 py-2 border rounded outline-none focus:border-gray-500 "
                        />
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="relative overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-200 text-gray-600 uppercase text-sm">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 font-medium">
                                            <div className="flex items-center">
                                                User Name
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-4 font-medium">
                                            Email
                                        </th>
                                        <th scope="col" className="px-6 py-4 font-medium">
                                            Date Joined
                                        </th>
                                        <th scope="col" className="px-6 py-4 font-medium">
                                            <div className="flex items-center">
                                                Status
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-4 font-medium text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">

                                    {animationLoading ? (
                                        // Skeleton Loading Rows
                                        <DataLoadingSkeletonAnimation />
                                    ) : userList.length > 0 ? (
                                        userList.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                            <PersonIcon className="text-gray-400" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="font-medium text-gray-900">
                                                                {user.first_name} {user.last_name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-gray-900">{user.email}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-gray-500">{new Date(user.date_joined).toLocaleDateString('en-GB')}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.is_active
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {user.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    {user.is_active ? (
                                                        <button
                                                            onClick={() => handleOpenModal(user.id)}
                                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                                                        >
                                                            Block
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleUnblockClick(user.id)}
                                                            // disabled={unblockProcessing === user.id}
                                                            className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none ${unblockProcessing === user.id ? 'opacity-70 cursor-not-allowed' : ''
                                                                }`}
                                                        >
                                                            {unblockProcessing === user.id ? (
                                                                <div className="w-4 h-4 border-2 border-t-white border-gray-300 rounded-full animate-spin"></div>
                                                            ) : (
                                                                <>
                                                                    Unblock
                                                                </>
                                                            )}
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <NoDataFoundMessage title={'users'} />
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <BlockingReasonModal
                        isModalOpen={isModalOpen}
                        loading={loading}
                        handleCloseModal={handleCloseModal}
                        handleSubmit={handleBlockClick}
                        blockingReason={blockingReason}
                        setBlockingReason={setBlockingReason}
                    />
                    {userList.length > 0 && (
                        <PaginationCmp setCurrentPage={setCurrentPage} currentPage={currentPage} totalPages={totalPages} />
                    )}


                </div>
            </div>




        </>
    )
}