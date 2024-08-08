import axios from "axios";
import { useEffect, useState } from "react"
import {toast } from "react-toastify"
import Sidebar from "../../Components/Owner/Sidebar";

export default function OwnerDetails() {

    const ownerString = localStorage.getItem('owner_id');
    const uid = JSON.parse(ownerString).owner_id; 
    console.log(uid)

    const [owner, setOwner] = useState({
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
    

    useEffect(()=>{
        const fetchOwnerDetails = async ()=>{
            try{
                const response = await axios.get(`http://127.0.0.1:8000/api/v2/auth/owner-details/${uid}/`)
                console.log(response.data)
                setOwner(response.data)
            }catch(error){
                console.error('error fetchign user details',error)
            }
        }
        fetchOwnerDetails();
    },[uid])

    const handleUpdateOwnerDetails = async (event) =>{
        event.preventDefault();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const nameRegex = /^[A-Za-z]{2,}$/;
        if (!firstName.trim()==='') {
           alert('First name is required.');
           return;
        }
        if (!lastName.trim()==='') {
           alert('Last name is required.');
           return;
        }
        if (!email.trim()==='') {
           alert('Email is required.');
           return;
        }
       
        const updateOwner ={
            first_name: firstName || owner.first_name,
            last_name : lastName || owner.last_name,
            email: email || owner.email
        };
        try{
            const response = await axios.put(`http://127.0.0.1:8000/api/v2/auth/update/${uid}/`, updateOwner);
            console.log(response.data);
            setOwner(response.data)
            toast.success('Your details updated successfully')
        }catch (error) {
            toast.error('Something wrong')
            
        }
    }
    
    const handleOwnerChangePassword = async (event)=> {
        event.preventDefault();
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?/~`\\-]).{6,}$/;
        if (oldPassword.trim()==='' || newPassword.trim()==='' || confirmPassword.trim()==='' ) {
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
            const response = await axios.post(`http://127.0.0.1:8000/api/v2/auth/change-password/${uid}/`,{
                old_password:oldPassword,
                new_password:newPassword
            });
            toast.success('Your password changed successfully')
            setOldPassword('');
            setConfirmPassword('');
            setNewPassword('');
        }catch(error) {
            toast.error('Something wrong')
        }
    }

    return(
        <>
        <Sidebar/>
 <div className="flex flex-col flex-1 ml-64 mt-14 bg-customColor7 min-h-screen">
        <div className="p-10">
          <div className="bg-customColor8 pb-10 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold  text-center text-white py-3 bg-gradient-to-r from-teal-500 to-gray-800 rounded-tl-lg rounded-tr-lg">Owner Details</h3>
            
          <div className="p-8">
            <form onSubmit={handleUpdateOwnerDetails} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="first-name" className="block text-md font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    placeholder="First Name"
                    defaultValue={owner.first_name}
                    onChange={(e)=>setFirstName(e.target.value)}
                    className="block text-sm py-3 px-4 rounded-lg w-full bg-customColor7 border border-gray-400 outline-teal-500"
                  />
                </div>
                <div>
                  <label htmlFor="last-name" className="block text-md font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    placeholder="Last Name"
                    defaultValue={owner.last_name}
                    onChange={(e)=>setLastName(e.target.value)}
                    className="block text-sm py-3 px-4 rounded-lg w-full bg-customColor7 border border-gray-400 outline-teal-500"
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-full md:w-1/2">
                  <label htmlFor="email" className="block text-md font-medium text-gray-700">Email</label>
                  <input
                    type="text"
                    placeholder="Email Address"
                    defaultValue={owner.email}
                    onRateChange={(e)=>setEmail(e.target.value)}
                    className="block text-sm py-3 px-4 rounded-lg w-full bg-customColor7 border border-gray-400 outline-teal-500"
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="mt-2 bg-teal-600 text-white py-2 px-4 rounded hover:bg-gradient-to-r from-teal-500 to-gray-800"
                >
                  Save Details
                </button>
              </div>
            </form>

            <form onSubmit={handleOwnerChangePassword} className="space-y-4 mt-24">
            <h3 className="text-2xl font-semibold mb-4 text-center">Change Password</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="first-name" className="block text-md font-medium text-gray-700">Old Password</label>
                  <input
                    type="password"
                    placeholder="Old Password"
                    value={oldPassword}
                    onChange={(e)=> setOldPassword(e.target.value)}
                    className="block text-sm py-3 px-4 rounded-lg w-full bg-customColor7 border border-gray-400 outline-teal-500"
                  />
                </div>
                <div>
                  <label htmlFor="last-name" className="block text-md font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e)=> setNewPassword(e.target.value)}
                    className="block text-sm py-3 px-4 rounded-lg w-full bg-customColor7 border border-gray-400 outline-teal-500"
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-full md:w-1/2">
                  <label htmlFor="email" className="block text-md font-medium text-gray-700">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword} 
                    onChange={(e)=> setConfirmPassword(e.target.value)}
                    className="block text-sm py-3 px-4 rounded-lg w-full bg-customColor7 border border-gray-400 outline-teal-500"
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="mt-2 bg-teal-600 text-white py-2 px-4 rounded hover:bg-gradient-to-r from-teal-500 to-gray-800"                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>



        </div>
      </div>
        </>
    )
}