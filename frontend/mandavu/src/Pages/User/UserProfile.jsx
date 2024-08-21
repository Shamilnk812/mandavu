import { useEffect, useState } from "react"
import Navb from "../../Components/User/Navb"
import Sidebar from "../../Components/User/Sidebar"
import axios from "axios"
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
        try{
            const response = await axios.get(`http://127.0.0.1:8000/api/v1/auth/user-details/${userId}/`)
            setUser(response.data)
            console.log(response.data)
        }catch(error) {
            toast.error('Failed to fetch userdetails. Please try again later')
        }
    }
    useEffect(()=> {
        fetchUserDetails()
    },[userId])
    
    const formik = useFormik({
        initialValues: {
           first_name: user?.first_name || '',
           last_name: user?.last_name || '',
        },enableReinitialize : true,
        validationSchema:ChangeUserDetailsSchema,
        onSubmit: async (updatedUser)=> {
            try{
                const response = await axios.put(`http://127.0.0.1:8000/api/v1/auth/update/${userId}/`, updatedUser);
                fetchUserDetails();
                handleCloseUserDetailsEditModal();
                toast.success('User details updated successfully')

            }catch(error) {
                toast.error('Failed to update user details . please try again later')
            }
        }
    })


    const handleOpenUserDetailsEditModal = ()=> {
        setIsUserDetailsEditModalOpen(true)
    }

    const handleCloseUserDetailsEditModal = ()=> {
        formik.resetForm();
        setIsUserDetailsEditModalOpen(false)
    }

    const formik2 = useFormik({
        initialValues:{
            old_password:'',
            new_password:'',
            confirm_password:''
        },validationSchema:ChangePasswordSchema,
        onSubmit: async (values) => {
            const payload = {
                old_password: values.old_password,
                new_password: values.new_password,
            };

            try {
                const response = await axios.post(`http://127.0.0.1:8000/api/v1/auth/change-password/${userId}/`, payload);
                // Display success message
                handleCloseChangePasswordModal();
                toast.success(response.data.message);
            } catch (error) {
                // Display error message
                if (error.response && error.response.data && error.response.data.message) {
                    toast.error(error.response.data.message);
                } else {
                    console.error('dfadsfs',error)
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

    return(
        <>
        <Navb/>
        <Sidebar/>
        <div className="flex flex-col flex-1 ml-64 mt-14 bg-customColor7 min-h-screen">
          <div className="p-10">
            <div className="bg-customColor8 pb-10 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold  text-center text-white py-3 bg-gradient-to-r from-teal-500 to-gray-800 rounded-tl-lg rounded-tr-lg">User Details</h3>
            <div className="flex justify-center  px-10 py-10">
            <div className="bg-customColor7 overflow-hidden shadow rounded-lg border">
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg text-center leading-6 font-medium text-gray-900">
                    User Details
                </h3>
                {/* <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    This is some information about the user.
                </p> */}
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
           </div>
        </div>
       </div>
           {isUserDetailsEditModalOpen && (
            <UserDetailsEditModal isUserDetailsEditModalOpen={isUserDetailsEditModalOpen} formik={formik} handleCloseUserDetailsEditModal={handleCloseUserDetailsEditModal}/>
           )}
           {changepasswordModal && (
            <UserChangePasswordModal isUserChangePasswordModalOpen={changepasswordModal} formik2={formik2} handleCloseUserChangePasswordModal={handleCloseChangePasswordModal}/>
           )}
        </>
    )
}