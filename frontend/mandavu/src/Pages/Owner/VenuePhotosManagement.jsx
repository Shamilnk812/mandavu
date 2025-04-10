import { useEffect, useState } from "react";
import Sidebar from "../../Components/Owner/Sidebar";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import AddVenuePhotoModal from "../../Components/Owner/AddVenuePhotoModal";
import { axiosOwnerFormInstance, axiosOwnerInstance } from "../../Utils/Axios/axiosInstance";
import SkeletonAnimation from "../../Components/Owner/SkeletonAnimation";
import EmptyDataShowMessage from "../../Components/Owner/EmptyDataShowMessage";


export default function VenuePhotosManagement() {

    const [isModalOpen, setIsModalOpen] = useState(false)
    const venueId = useSelector((state) => state.owner.venueId)
    const [venuePhotosList, setVenuePhotos] = useState([])
    const [isLoading, setIsLoading] = useState(false);


    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const addVenuePhoto = async (values) => {
        const formData = new FormData();
        formData.append('venue_photo', values.venue_photo);
        try {
            setIsLoading(true);
            const response = await axiosOwnerFormInstance.post(`add-venue-photo/${venueId}/`, formData,);
            //     {
            //     headers: {
            //         'Content-Type': 'multipart/form-data'
            //     }
            // }

            toast.success('New Venue photo added successfully');
            fetchVenuePhotos()
        } catch (error) {
            console.error('somerej', error)
            toast.error('Something went wrong')
        } finally {
            setIsLoading(false);
        }
    }

    const fetchVenuePhotos = async () => {
        try {
            setIsLoading(true);
            const response = await axiosOwnerInstance.get(`show-all-venue-photos/${venueId}/`)
            setVenuePhotos(response.data)
            console.log(response.data)
        } catch (error) {
            console.error('error: ', error)
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchVenuePhotos()
    }, [venueId])


    const blockVenuePhoto = async (venuePhotoId) => {
        try {
            const response = await axiosOwnerInstance.post(`block-venue-photo/${venuePhotoId}/`);
            toast.success('Banner image Blocked');
            fetchVenuePhotos();
        } catch (error) {
            console.error('Error blocking banner:', error);
        }
    };

    const unblockVenuePhoto = async (venuePhotoId) => {
        try {
            const response = await axiosOwnerInstance.post(`unblock-venue-photo/${venuePhotoId}/`);
            toast.success('Banner image Unblocked');
            fetchVenuePhotos();
        } catch (error) {
            console.error('Error unblocking banner:', error);
        }
    };




    return (
        <>
            <Sidebar />
            <div className="flex flex-col flex-1  mt-14 bg-customColor7 min-h-screen transition-all duration-300 md:ml-64">
                <div className="p-10">
                    <div className="bg-white border rounded-lg shadow-lg pb-10">
                        <div>
                            <h3 className="text-2xl font-semibold py-4  text-center text-gray-700 border-b border-gray-300">
                                Venue Photos
                            </h3>
                        </div>
                        <div className="px-8 py-6">


                            <div className="relative overflow-x-auto h-[600px] overflow-y-auto">
                                <div className="flex justify-end items-center py-4 pr-2">
                                    <button
                                        className="mt-2 bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-800 transition-all duration-300"
                                        onClick={handleOpenModal}
                                    >
                                        + Add Photo
                                    </button>
                                </div>


                                {isLoading ? (

                                    <SkeletonAnimation />
                                ) : (
                                    /* Actual Content */
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {venuePhotosList.length > 0 ? (
                                            venuePhotosList.map((venuePhoto, index) => (
                                                <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                                                    <div className="relative">
                                                        <img
                                                            src={venuePhoto.venue_photo}
                                                            alt="venue photo"
                                                            className="w-full h-48 object-cover"
                                                        />
                                                        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${venuePhoto.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                            {venuePhoto.is_active ? 'Active' : 'Inactive'}
                                                        </div>
                                                    </div>

                                                    <div className="p-5">
                                                        <div className="flex justify-end items-center mt-4">
                                                            {venuePhoto.is_active ? (
                                                                <button
                                                                    className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-800 transition-colors duration-200 flex items-center"
                                                                    onClick={() => blockVenuePhoto(venuePhoto.id)}
                                                                >
                                                                    Block
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-800 transition-colors duration-200 flex items-center"
                                                                    onClick={() => unblockVenuePhoto(venuePhoto.id)}
                                                                >
                                                                    Unblock
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (

                                            <EmptyDataShowMessage title={'Photo'} />
                                        )}
                                    </div>
                                )}

                            </div>

                        </div>
                    </div>
                </div>
            </div>



            {isModalOpen && (
                <>
                    <AddVenuePhotoModal handleCloseModal={handleCloseModal} handleAddVenuePhoto={addVenuePhoto} />
                </>
            )}
        </>
    )
}