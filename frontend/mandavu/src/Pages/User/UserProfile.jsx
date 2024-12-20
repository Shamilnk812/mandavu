import { useEffect, useState } from "react"
import Navb from "../../Components/User/Navb"
import Sidebar from "../../Components/User/Sidebar"
import axios from "axios"
import { axiosUserInstance } from "../../Utils/Axios/axiosInstance"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import { useFormik } from "formik"
import ChangeUserDetailsSchema from "../../Validations/User/ChangeUserDetailsSchema"
import UserDetailsEditModal from "../../Components/User/UserDetailsEditModal"
import ChangePasswordSchema from "../../Validations/Owner/ChangePasswordSchema"
import UserChangePasswordModal from "../../Components/User/UserChangePassword"



export default function UserProfile() {

    const [user, setUser] = useState('')
    const userId = useSelector((state) => state.user.user?.id)
    const [isUserDetailsEditModalOpen, setIsUserDetailsEditModalOpen] = useState(false)
    const [changepasswordModal, setChangePasswordModal] = useState(false)

    const fetchUserDetails = async () => {
        try {
            const response = await axiosUserInstance.get(`user-details/${userId}/`)
            setUser(response.data)
            console.log(response.data)
        } catch (error) {
            toast.error('Failed to fetch userdetails. Please try again later')
        }
    }
    useEffect(() => {
        fetchUserDetails()
    }, [userId])

    const formik = useFormik({
        initialValues: {
            first_name: user?.first_name || '',
            last_name: user?.last_name || '',
        }, enableReinitialize: true,
        validationSchema: ChangeUserDetailsSchema,
        onSubmit: async (updatedUser) => {
            try {
                const response = await axiosUserInstance.put(`update/${userId}/`, updatedUser);
                fetchUserDetails();
                handleCloseUserDetailsEditModal();
                toast.success('User details updated successfully')

            } catch (error) {
                toast.error('Failed to update user details . please try again later')
            }
        }
    })


    const handleOpenUserDetailsEditModal = () => {
        setIsUserDetailsEditModalOpen(true)
    }

    const handleCloseUserDetailsEditModal = () => {
        formik.resetForm();
        setIsUserDetailsEditModalOpen(false)
    }

    const formik2 = useFormik({
        initialValues: {
            old_password: '',
            new_password: '',
            confirm_password: ''
        }, validationSchema: ChangePasswordSchema,
        onSubmit: async (values) => {
            const payload = {
                old_password: values.old_password,
                new_password: values.new_password,
            };

            try {
                const response = await axiosUserInstance.post(`change-password/${userId}/`, payload);
                // Display success message
                handleCloseChangePasswordModal();
                toast.success(response.data.message);
            } catch (error) {
                // Display error message
                if (error.response && error.response.data && error.response.data.message) {
                    toast.error(error.response.data.message);
                } else {
                    console.error('dfadsfs', error)
                    toast.error("An error occurred. Please try again.");
                }
            }
        }
    })

    const handleOpenChangePasswordModal = () => {
        setChangePasswordModal(true)
    }

    const handleCloseChangePasswordModal = () => {
        formik2.resetForm();
        setChangePasswordModal(false);
    }

    return (
        <>



            <Navb />
            <div className="flex flex-col lg:flex-row">
                <Sidebar />

                <main className="flex-1 px-4 py-6 bg-gray-100 lg:ml-64">
                    <div className="max-w-4xl mx-auto bg-white mt-16 shadow rounded-lg">

                        <div className="bg-white overflow-hidden shadow rounded-lg border">
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg text-center leading-6 font-medium text-gray-900">
                                    User Details
                                </h3>

                            </div>
                            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                                <dl className="sm:divide-y sm:divide-gray-200">
                                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-900">
                                            First Name
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {user.first_name}
                                        </dd>
                                    </div>
                                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-900">
                                            Last Name
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {user.last_name}
                                        </dd>
                                    </div>
                                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-900">
                                            Email address
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {user.email}
                                        </dd>
                                    </div>
                                </dl>
                                <div className="flex justify-end gap-2 m-4">
                                    <button className="bg-teal-600 text-white  px-4 py-2 rounded hover:bg-teal-700"
                                        onClick={handleOpenChangePasswordModal}
                                    >Change Password</button>
                                    <button className="bg-teal-600 text-white  px-4 py-2 rounded hover:bg-teal-700"
                                        onClick={handleOpenUserDetailsEditModal}
                                    >Edit</button>
                                </div>
                            </div>
                        </div>


                    </div>
                </main>
            </div>

            {isUserDetailsEditModalOpen && (
                <UserDetailsEditModal
                    isUserDetailsEditModalOpen={isUserDetailsEditModalOpen}
                    formik={formik}
                    handleCloseUserDetailsEditModal={handleCloseUserDetailsEditModal}
                />
            )}

            {changepasswordModal && (
                <UserChangePasswordModal
                    isUserChangePasswordModalOpen={changepasswordModal}
                    formik2={formik2}
                    handleCloseUserChangePasswordModal={handleCloseChangePasswordModal}
                />
            )}
        </>
    )
}