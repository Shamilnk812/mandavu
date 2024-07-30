import { useState,useEffect } from "react";
import Sidebar from "../../Components/Admin/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Slide } from "react-toastify";


export default function VenueList() {
    
    const navigate = useNavigate()
    const [venues, setVenues] = useState([])
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(()=>{
        const fetchVeneuList = async ()=>{
            try{
                const response = await axios.get(`http://127.0.0.1:8000/api/admin_dash/auth/venue-list/?search=${searchTerm}`);
                setVenues(response.data)
                console.log(response.data)
            }catch(error) {
                console.error('something wrong',error)
            }
        }
        fetchVeneuList()
    },[searchTerm])

    const handleSearchChange = (event) =>{
        setSearchTerm(event.target.value)
    }

    const handleBlockVenue = async (venueId) => {
        try{
            const response = await axios.post(`http://localhost:8000/api/admin_dash/auth/block-venue/${venueId}/`)
            alert('Veneu is bloked')
            navigate(0)
            
        }catch (error) {
            alert('something wrong')
        }
    }

    const handleUnblockVenue = async (venueId) =>{
        try{
            const response = await axios.post(`http://localhost:8000/api/admin_dash/auth/unblock-venue/${venueId}/`)
            alert('Venue is unbloked')
            navigate(0)
        }catch (error) {
            alert('something wrong')
        }
    }

    const handleVerifyVenue = async (venueId) =>{
        try{
            const response = await axios.post(`http://localhost:8000/api/admin_dash/auth/verify-venue/${venueId}/`);
            console.log(response.data)
            alert('venue is verified succes fully')
            navigate(0)
        }catch (error) {
            alert('somethign wrong')
        }
    }

    const handleUnVerifyVenue = async (venueId) =>{
        try{
            const response = await axios.post(`http://localhost:8000/api/admin_dash/auth/unverify-venue/${venueId}/`);
            alert('venue is unverified succes fully')
            navigate(0)
        }catch (error) {
            alert('somethign wrong')
        }
    }

    return(
        <>
        <Sidebar/>
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
                    Verification
                </th>
                <th scope="col" className="px-6 py-3">
                    Action
                </th>
            </tr>
        </thead>
        <tbody>
            {venues.map((venue) =>(
                <tr key={venue.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {venue.name}
                </th>
                <td className="px-6 py-4">
                   details
                </td>
                <td className="px-6 py-4">
                {venue.created_at}
                </td>
                <td className="px-6 py-4">
                    <span className={venue.is_active ? 'text-green-500' : 'text-red-500'}>
                        {venue.is_active ? 'Active' : 'Not Active'}
                    </span>
                    
                </td>
                <td className="px-6 py-4">
                    <span className={venue.is_verified ? 'text-green-500' : 'text-pink-500'}>
                        {venue.is_verified ? 'Verified' : 'Pending'}
                    </span>
                </td>
                <td className="px-6 py-4">
                    {venue.is_active ? (
                            <button
                            onClick={()=> handleBlockVenue(venue.id)}
                            className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
                            >
                            Block
                           </button>
                           ) : (
                           <button
                            onClick={()=> handleUnblockVenue(venue.id)}
                            className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
                            >
                            Unblock
                    </button> )}
                    {venue.is_verified ? <span className="text-green-500" > Approved </span> : <button
                    onClick={()=> handleVerifyVenue(venue.id)}
                    className="px-4 py-2 ml-2 text-white bg-green-600 rounded hover:bg-green-700"
                    >Verify</button>}
                
                </td>
            </tr>
            ))}
             
        </tbody>
    </table>
</div>
   </div>
</div>
        </>
    )
}