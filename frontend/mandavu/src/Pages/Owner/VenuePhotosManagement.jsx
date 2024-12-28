import { useEffect, useState } from "react";
import Sidebar from "../../Components/Owner/Sidebar";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import AddVenuePhotoModal from "../../Components/Owner/AddVenuePhotoModal";
import { axiosOwnerFormInstance,axiosOwnerInstance } from "../../Utils/Axios/axiosInstance";


export default function VenuePhotosManagement() {

    const [isModalOpen, setIsModalOpen] = useState(false)
    const venueId = useSelector((state)=> state.owner.venueId)
    const [venuePhotosList, setVenuePhotos]  = useState([])


    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const addVenuePhoto = async (values)=> {
        const formData = new FormData();
        formData.append('venue_photo', values.venue_photo);
        try {
            const response = await axiosOwnerFormInstance.post(`add-venue-photo/${venueId}/`, formData,  );
            //     {
            //     headers: {
            //         'Content-Type': 'multipart/form-data'
            //     }
            // }
       
            toast.success('New Venue photo added successfully');
            fetchVenuePhotos()
        } catch(error) {
            console.error('somerej',error)
            toast.error('Something went wrong')
          }
    }

    const fetchVenuePhotos = async () => {
        try{
            const response = await axiosOwnerInstance.get(`show-all-venue-photos/${venueId}/`)
            setVenuePhotos(response.data)
            console.log(response.data)
        }catch(error) {
            console.error('error: ',error)
        }
    }
    
    useEffect(()=>{
        fetchVenuePhotos()
    },[venueId])


    const blockVenuePhoto = async (venuePhotoId) => {
        try {
            const response = await axiosOwnerInstance.post(`block-venue-photo/${venuePhotoId}/`);
            toast.success('Banner image Blocked');
            fetchVenuePhotos();
        } catch (error) {
            console.error('Error blocking banner:', error);
        }
    };

    ``

    const unblockVenuePhoto = async (venuePhotoId) => {
        try {
            const response = await axiosOwnerInstance.post(`unblock-venue-photo/${venuePhotoId}/`);
            toast.success('Banner image Unblocked');
            fetchVenuePhotos();
        } catch (error) {
            console.error('Error unblocking banner:', error);
        }
    };




    return(
        <>
        <Sidebar/>
        <div className="flex flex-col flex-1 ml-64 mt-16 bg-customColor7 min-h-screen">
                <div className="p-10">
                    <div className="bg-white border rounded-lg shadow-lg pb-10">
                        <div>
                            <h3 className="text-2xl font-semibold py-4  text-center text-gray-700 border-b border-gray-300">
                                Venue Photos
                            </h3>
                        </div>
                        <div className="px-24 py-6">
                                <div className="relative overflow-x-auto h-[600px] overflow-y-auto">
                                    <div className="flex justify-end items-center py-4 pr-2">
                                        <button
                                            className="mt-2 bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-800 transition-all duration-300"
                                            onClick={handleOpenModal}
                                        >
                                           + Add Photo
                                        </button>
                                    </div>
                                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                                        <thead className="text-xs text-white uppercase bg-gray-700">
                                            <tr>
                                                <th scope="col" className="px-6 py-3">Banner</th>
                                                <th scope="col" className="px-6 py-3">Status</th>
                                                <th scope="col" className="px-6 py-3">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {venuePhotosList.map((venue, index) => (
                                                <tr key={index} className="bg-customColor7 border-b border-gray-300 dark:bg-customColor7 dark:border-gray-400">
                                                    <td className="px-6 py-4 font-medium text-gray-800 whitespace-nowrap">
                                                        <img src={venue.venue_photo} alt='venue-photo' className="w-12 h-12 object-cover rounded-lg border border-gray-400" />
                                                    </td>
                                                    <td className="px-6 py-4 ">
                                                        <span className={venue.is_active ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                                                                {venue.is_active ? 'Active' : 'Inactive'}
                                                         </span></td>
                                                    <td className="px-6 py-4">
                                                        {venue.is_active ? (
                                                            <button
                                                                className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-800 transition-all duration-300"
                                                                onClick={() => blockVenuePhoto(venue.id)}
                                                            >
                                                                Block
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-800 transition-all duration-300"
                                                                onClick={() => unblockVenuePhoto(venue.id)}
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
                        
                        </div>
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <>
                        {console.log("Modal is open")}

                <AddVenuePhotoModal handleCloseModal={handleCloseModal} handleAddVenuePhoto={addVenuePhoto}/>
                </>
            )}
        </>
    )
}