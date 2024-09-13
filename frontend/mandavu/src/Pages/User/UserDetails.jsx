
import { useEffect, useState } from "react";
import Sidebar from "../../Components/User/Sidebar";
import axios from "axios";
import { toast } from "react-toastify";
import { axiosUserInstance } from "../../Utils/Axios/axiosInstance";




export default function UserDetails() {

    const userString = localStorage.getItem('user_id');
    const uid = JSON.parse(userString).user_id; 
    console.log(uid)
    const [user, setUser] = useState({
        first_name:'',
        last_name:'',
        email:''
    })

    const [firstName,setFirstName] = useState('')
    const [lastName,setLastName] = useState('')
    const [email,setEmail] = useState('')
    const [oldPassword,setOldPassword] = useState('')
    const [newPassword,setNewPassword] = useState('')
    const [confirmPassword,setConfirmPassword] = useState('')
    
    useEffect(() =>{
        const fetchUserDetails = async () =>{
            try{
                const response = await axiosUserInstance.get(`user-details/${uid}/`)
                console.log(response.data)
                setUser(response.data)
            }catch(error) {
                console.error('error fetchign user details',error)
            }
        }
        fetchUserDetails();
    },[uid])

    const handleUpdateUserDetails = async (event) => {
        event.preventDefault();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const nameRegex = /^[A-Za-z]{2,}$/;
        if (!firstName.trim()=== '') {
           alert('First name is required.');
           return;
        }
        if (!lastName.trim()=== '') {
           alert('Last name is required.');
           return;
        }
        if (!email.trim() === '') {
           alert('Email is required.');
           return;
        }
        
        const updatedUser = {
            first_name: firstName || user.first_name,
            last_name: lastName || user.last_name,
            email: email || user.email
        };
        try {
            const response = await axiosUserInstance.put(`update/${uid}/`, updatedUser);
            console.log(response.data);
            setUser(response.data);
            toast.success('User details updated successfully');
        } catch (error) {
            toast.error('Something Wrong');
            
        }
    };

    const handleChangePassword = async (event) =>{
        event.preventDefault();
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?/~`\\-]).{6,}$/;
        if (!oldPassword.trim()===''|| !newPassword.trim()==='' || !confirmPassword.trim()==='') {
            toast.error('All password fields are required.');
            return;
        }
        
        
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }
        if (!passwordRegex.test(newPassword)) {
            toast.error('Password must be at least 6 characters long and include at least one lowercase letter, one uppercase letter, and one special character.');
            return;
        }
        try{
            const response = await axiosUserInstance.post(`change-password/${uid}/`,{
                old_password:oldPassword,
                new_password:newPassword
            });
            toast.success('Passwords Changed successfully');
            console.log(response.data.message)
            setOldPassword('');
            setConfirmPassword('');
            setNewPassword('');
        }catch(error) {
            console.log(error.response.data.error)
        }
    };

 
    return(
        <>
    <div className="bg-customColor7 flex">
            <Sidebar />
            <div className="flex-1 p-10 text-2xl ml-64"> {/* Add margin-left to account for sidebar */}
                <div className="bg-customColor8 rounded-lg shadow-lg pb-10">
                <h3 className="text-2xl bg-gradient-to-r from-teal-500 to-gray-800 font-semibold mb-4 py-3 text-center text-white  rounded-tl-lg rounded-tr-lg">User Details</h3>
                    <div className=" p-8 ">
                    <div>
                        <form onSubmit={handleUpdateUserDetails} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label htmlFor="first-name" className="block text-lg font-medium text-gray-700">First Name</label>
                                    <input type="text" defaultValue={user.first_name} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" className="block text-sm py-3 px-4 rounded-lg w-full bg-customColor7 border border-gray-400 outline-teal-500" />
                                </div>
                                <div>
                                    <label htmlFor="last-name" className="block text-lg font-medium text-gray-700">Last Name</label>
                                    <input type="text" defaultValue={user.last_name} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" className="block text-sm py-3 px-4 rounded-lg w-full bg-customColor7 border border-gray-400 outline-teal-500" />
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <div className="w-1/2">
                                    <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email</label>
                                    <input type="text" defaultValue={user.email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" className="block text-sm py-3 px-4 rounded-lg w-full bg-customColor7 border border-gray-400 outline-teal-500" />
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <button type="submit" className="mt-2  bg-teal-600 text-white  text-sm py-2 px-4 rounded hover:bg-gradient-to-r from-teal-500 to-gray-800">Edit & Save Changes</button>
                            </div>
                        </form>
                    </div>
                    <div className="mt-12">
                        <h3 className="text-2xl font-semibold mb-4 text-center">Change Password</h3>

                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label htmlFor="old-password" className="block text-lg font-medium text-gray-700">Old Password</label>
                                    <input type="password" placeholder="Old password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="block text-sm py-3 px-4 rounded-lg w-full bg-customColor7 border border-gray-400 outline-teal-500" />
                                </div>
                                <div>
                                    <label htmlFor="new-password" className="block text-lg font-medium text-gray-700">New Password</label>
                                    <input type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="block text-sm py-3 px-4 rounded-lg w-full bg-customColor7 border border-gray-400 outline-teal-500" />
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <div className="w-1/2">
                                    <label htmlFor="confirm-password" className="block text-lg font-medium text-gray-700">Confirm Password</label>
                                    <input type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="block text-sm py-3 px-4 rounded-lg bg-customColor7 w-full border border-gray-400 outline-teal-500" />
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <button type="submit" className="mt-2 bg-teal-600 text-white text-sm py-2 px-4 rounded hover:bg-gradient-to-r from-teal-500 to-gray-800">Change Password</button>
                            </div>
                        </form>
                    </div>


                    </div>

                </div>
            </div>
        </div>
        </>
    )
}