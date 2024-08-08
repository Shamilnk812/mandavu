import { useEffect, useState } from "react";
import Sidebar from "../../Components/Owner/Sidebar";
import AddBannerModal from "../../Components/Owner/AddBannerModal";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";


export default function BannerManagement() {

    const [isModalOpen, setIsModalOpen] = useState(false)
    const venueId = useSelector((state)=> state.owner.venueId)
    const [bannerList, setBannerList]  = useState([])


    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const addBanner = async (values)=> {
        const formData = new FormData();
        formData.append('venue_photo', values.venue_photo);
        formData.append('name', values.name);
        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/v2/auth/add-banner/${venueId}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('New Banner Added successfully');
            fetchBannerDetails()
        } catch(error) {
            console.error('somerej',error)
            toast.error('Something went wrong')
          }
    }

    const fetchBannerDetails = async () => {
        try{
            const response = await axios.get(`http://127.0.0.1:8000/api/v2/auth/banner-details/${venueId}/`)
            setBannerList(response.data)
            console.log(response.data)
        }catch(error) {
            console.error('error: ',error)
        }
    }
    
    useEffect(()=>{
        fetchBannerDetails()
    },[venueId])


    const blockBanner = async (bannerId) => {
        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/v2/auth/block-banner/${bannerId}/`);
            toast.success('Banner image Blocked');
            fetchBannerDetails();
        } catch (error) {
            console.error('Error blocking banner:', error);
        }
    };

    const unblockBanner = async (bannerId) => {
        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/v2/auth/unblock-banner/${bannerId}/`);
            toast.success('Banner image Unblocked');
            fetchBannerDetails();
        } catch (error) {
            console.error('Error unblocking banner:', error);
        }
    };




    return(
        <>
        
        <div className="flex flex-col flex-1 ml-64 mt-10 bg-customColor7 min-h-screen">
                <div className="p-10">
                    <div className="bg-customColor8 rounded-lg shadow-lg pb-10">
                        <div>
                            <h3 className="text-2xl font-semibold py-3 text-center text-white bg-gradient-to-r from-teal-500 to-gray-800 rounded-tl-lg rounded-tr-lg">
                                Edit Your Venue
                            </h3>
                        </div>
                        <div className="p-8">
                            {bannerList.length === 0 ? (
                                <div className="border-dashed border-2 border-gray-800 w-full h-40 rounded-lg flex items-center justify-center mb-10">
                                    <button
                                        className="mt-2 bg-teal-600 text-white py-2 px-4 rounded hover:bg-gradient-to-r from-teal-500 to-gray-800"
                                        onClick={handleOpenModal}
                                    >
                                        + Add Banner
                                    </button>
                                </div>
                            ) : (
                                <div className="relative overflow-x-auto">
                                    <div className="flex justify-end items-center py-4 pr-2">
                                        <button
                                            className="mt-2 bg-teal-600 text-white py-2 px-4 rounded hover:bg-gradient-to-r from-teal-500 to-gray-800"
                                            onClick={handleOpenModal}
                                        >
                                            Add Banner
                                        </button>
                                    </div>
                                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                        <thead className="text-xs text-white uppercase bg-gradient-to-r from-teal-500 to-gray-800 dark:bg-gradient-to-r from-teal-500 to-gray-800 dark:text-white">
                                            <tr>
                                                <th scope="col" className="px-6 py-3">Banner</th>
                                                <th scope="col" className="px-6 py-3">Name</th>
                                                <th scope="col" className="px-6 py-3">Status</th>
                                                <th scope="col" className="px-6 py-3">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bannerList.map((banner, index) => (
                                                <tr key={index} className="bg-customColor7 border-b border-gray-300 dark:bg-customColor7 dark:border-gray-400">
                                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                        <img src={banner.venue_photo} alt={banner.name} className="w-16 h-16 object-cover rounded-lg border border-gray-400" />
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-900">{banner.name}</td>
                                                    <td className="px-6 py-4 ">
                                                        <span className={banner.is_active ? 'text-green-600' : 'text-red-600'}>
                                                                {banner.is_active ? 'Active' : 'Inactive'}
                                                         </span></td>
                                                    <td className="px-6 py-4">
                                                        {banner.is_active ? (
                                                            <button
                                                                className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-800"
                                                                onClick={() => blockBanner(banner.id)}
                                                            >
                                                                Block
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-800"
                                                                onClick={() => unblockBanner(banner.id)}
                                                            >
                                                                Unblock
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <AddBannerModal handleCloseModal={handleCloseModal} handleAddBanner={addBanner} />
            )}
        </>
    )
}