
import { useEffect, useState } from "react";
import Sidebar from "../../Components/User/Sidebar";
import axios from "axios";
import { toast } from "react-toastify";

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
                const response = await axios.get(`http://127.0.0.1:8000/api/v1/auth/user-details/${uid}/`)
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
            const response = await axios.put(`http://127.0.0.1:8000/api/v1/auth/update/${uid}/`, updatedUser);
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
            const response = await axios.post(`http://127.0.0.1:8000/api/v1/auth/change-password/${uid}/`,{
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
         <div class="bg-customColor1">
    <div class="flex min-h-screen">
          <Sidebar/>
        <div class="flex-1 p-10 text-2xl">
    <h3 class="text-2xl font-semibold mb-4 text-center">User Details</h3>
    <div class="bg-customColor2 p-24 rounded-lg shadow-lg">
       <div>
        <form onSubmit={handleUpdateUserDetails} class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label for="first-name" class="block text-lg font-medium text-gray-700">First Name</label>
                    <input type="text"   defaultValue={user.first_name} onChange={(e)=>setFirstName(e.target.value)} placeholder="First Name" class="block text-sm py-3 px-4 rounded-lg w-full bg-customColor1 border border-gray-400 outline-customColor3" />
                </div>
                <div>
                    <label for="last-name" class="block text-lg font-medium text-gray-700">Last Name</label>
                    <input type="text" defaultValue={user.last_name} onChange={(e)=> setLastName(e.target.value)} placeholder="Last Name" class="block text-sm py-3 px-4 rounded-lg w-full bg-customColor1 border border-gray-400 outline-customColor3" />
                </div>
            </div>
            <div class="flex justify-center">
                <div class="w-1/2">
                    <label for="email" class="block text-lg font-medium text-gray-700">Email</label>
                    <input type="text" defaultValue={user.email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" class="block text-sm py-3 px-4 rounded-lg w-full bg-customColor1 border border-gray-400 outline-customColor3" />
                </div>
            </div>
            <div class="flex justify-center">
                <button type="submit" class="bg-orange-600 text-white  text-lg px-8 py-1 rounded-md shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500">Edit</button>
            </div>
        </form>
        </div>
       <div class="mt-12">
       <h3 class="text-2xl font-semibold mb-4 text-center">Change Password</h3>

        <form onSubmit={handleChangePassword} class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label for="old-password" class="block text-lg font-medium text-gray-700">Old Password</label>
                    <input type="password" placeholder="Old password" value={oldPassword} onChange={(e)=> setOldPassword(e.target.value)} class="block text-sm py-3 px-4 rounded-lg w-full bg-customColor1 border border-gray-400 outline-customColor3" />
                </div>
                <div>
                    <label for="new-password" class="block text-lg font-medium text-gray-700">New Password</label>
                    <input type="password" placeholder="New password" value={newPassword} onChange={(e)=> setNewPassword(e.target.value)} class="block text-sm py-3 px-4 rounded-lg w-full bg-customColor1 border border-gray-400 outline-customColor3" />
                </div>
            </div>
            <div class="flex justify-center">
                <div class="w-1/2">
                    <label for="confirm-password" class="block text-lg font-medium text-gray-700">Confirm Password</label>
                    <input type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e)=> setConfirmPassword(e.target.value)} class="block text-sm py-3 px-4 rounded-lg bg-customColor1 w-full border border-gray-400 outline-customColor3" />
                </div>
            </div>
            <div class="flex justify-center">
                <button type="submit" class="bg-orange-600 text-white text-lg px-4 py-2 rounded-md shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500">Change password</button>
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