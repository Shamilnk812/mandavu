import { useParams } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../../Components/Admin/Sidebar";
import { useEffect } from "react";
import { axiosAdminInstance } from "../../Utils/Axios/axiosInstance";
import { axiosOwnerInstance } from "../../Utils/Axios/axiosInstance";
import ShowVenueDetailsCmp from "../../Components/Admin/ShowVenueDetailsCmp";
import ShowOwnerDetailsCmp from "../../Components/Admin/ShowOwnerDetailsCmp";
import ShowFacilitiesCmp from "../../Components/Admin/ShowFacilitiesCmp";
import ShowEventsCmp from "../../Components/Admin/ShowEventsCmp";
import { toast } from "react-toastify";
import ShowVenuePhotosCmp from "../../Components/Admin/ShowVenuePhotosCmp";
import ShowVenueApprovalsCmp from "../../Components/Admin/ShowVenueApprovalsCmp";



export default function ShowVenueDetails2() {


    const { venueId } = useParams();
    const [owner, setOwner] = useState('')
    const [facilities, setFacilities] = useState([])
    const [events, setEvents] = useState([])
    const [photos, setPhotos] = useState([])
    const [activeComponent, setActiveComponent] = useState("approvals")


    useEffect(() => {
        const fetchVenueDetails = async () => {
            try {
                const response = await axiosAdminInstance.get(`venue-details/${venueId}/`)
                setOwner(response.data)
                console.log(response.data)
            } catch (error) {
                console.error('Error fetching venue details', error);
            }
        }
        fetchVenueDetails()
    }, [venueId])


    useEffect(() => {
        const fetchFacilities = async () => {
            try {
                const response = await axiosOwnerInstance.get(`get-facility/${venueId}/`)
                setFacilities(response.data)
            } catch (error) {
                toast.error('Failed to fetch facilities. Plase try again later')
            }
        }
        fetchFacilities();
    }, [venueId])


    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axiosOwnerInstance.get(`get-all-events/${venueId}/`)
                setEvents(response.data)
                console.log(response.data)
            } catch (error) {
                toast.error('Failed to fetch facilities. Plase try again later')
            }
        }
        fetchEvents();
    }, [venueId])



    useEffect(() => {
        const fetchVenuePhotos = async () => {
            try {
                const response = await axiosOwnerInstance.get(`show-all-venue-photos/${venueId}/`)
                setPhotos(response.data)

            } catch (error) {
                toast.error("Failed to fetch venue photos. Please try again later.")
            }
        }

        fetchVenuePhotos()
    }, [venueId])




    const renderComponent = () => {
        switch (activeComponent) {
            case "approvals":
                return <ShowVenueApprovalsCmp venueId={venueId} />;
            case "ownerDetails":
                return <ShowOwnerDetailsCmp owner={owner} />;
            case "venueDetails":
                return <ShowVenueDetailsCmp owner={owner} />;
            case "facilities":
                return <ShowFacilitiesCmp facilities={facilities} />;
            case "events":
                return <ShowEventsCmp events={events} />;
            case "photos":
                return <ShowVenuePhotosCmp photos={photos} />;
            default:
                return null;
        }
    };

    return (
        <>
            <Sidebar />
            <div className="p-4 sm:ml-64">
                <div className="p-4 border-2 border-gray-200 border-solid rounded-lg dark:border-gray-700 mt-14">
                    <div className="flex justify-center items-center mb-4">
                        <h2 className="text-xl font-semibold">Venue Details</h2>
                    </div>


                    {/*  Buttons For Navigate */}
                    <div className="flex justify-center items-center flex-wrap gap-4 my-6 ">


                        <button
                            className={`flex-grow text-base py-2 px-4 rounded text-center ${activeComponent === "approvals"
                                ? "bg-purple-900 text-white"
                                : "bg-purple-600 hover:bg-purple-700 text-white"
                                }`}
                            onClick={() => setActiveComponent("approvals")}
                        >
                            Approvals
                        </button>
                        <button
                            className={`flex-grow text-base py-2 px-4 rounded text-center ${activeComponent === "ownerDetails"
                                ? "bg-purple-900 text-white"
                                : "bg-purple-600 hover:bg-purple-700 text-white"
                                }`}
                            onClick={() => setActiveComponent("ownerDetails")}
                        >
                            Owner Details
                        </button>
                        <button
                            className={`flex-grow text-base py-2 px-4 rounded text-center ${activeComponent === "venueDetails"
                                ? "bg-purple-900 text-white"
                                : "bg-purple-600 hover:bg-purple-700 text-white"
                                }`}
                            onClick={() => setActiveComponent("venueDetails")}
                        >
                            Venue Details
                        </button>
                        <button
                            className={`flex-grow text-base py-2 px-4 rounded text-center ${activeComponent === "facilities"
                                ? "bg-purple-900 text-white"
                                : "bg-purple-600 hover:bg-purple-700 text-white"
                                }`}
                            onClick={() => setActiveComponent("facilities")}
                        >
                            Facilities
                        </button>
                        <button
                            className={`flex-grow text-base py-2 px-4 rounded text-center ${activeComponent === "events"
                                ? "bg-purple-900 text-white"
                                : "bg-purple-600 hover:bg-purple-700 text-white"
                                }`}
                            onClick={() => setActiveComponent("events")}
                        >
                            Events
                        </button>
                        <button
                            className={`flex-grow text-base py-2 px-4 rounded text-center ${activeComponent === "photos"
                                ? "bg-purple-900 text-white"
                                : "bg-purple-600 hover:bg-purple-700 text-white"
                                }`}
                            onClick={() => setActiveComponent("photos")}
                        >
                            Photos
                        </button>

                    </div>

                    {/* Section for render components */}
                    <div className="flex justify-center bg-gray-800 p-12 rounded-lg ">
                        {renderComponent()}
                    </div>


                </div>
            </div>

        </>
    )
}