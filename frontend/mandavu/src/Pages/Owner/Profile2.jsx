import { useEffect, useState } from "react";
import Sidebar from "../../Components/Owner/Sidebar";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ViewImageModal from "../../Components/Owner/ViewImageModal";
import { useFormik } from "formik";
import OwnerDetailsEditSchema from "../../Validations/Owner/OwnerDetailsEditSchema";
import EditOwnerDetailsModal from "../../Components/Owner/EditOwnerDetailsModal";
import VenueDetailsEditModal from "../../Components/Owner/EditVenueDetailsModal";
import VenueRegisterSchema from "../../Validations/Owner/VenueRegisterSchema";
import OwnerChangePasswordModal from "../../Components/Owner/OwnerChangePasswordModal";
import ChangePasswordSchema from "../../Validations/Owner/ChangePasswordSchema";
import { axiosOwnerInstance } from "../../Utils/Axios/axiosInstance";




export default function OwnerDetails2() {

    const ownerId = useSelector((state) => state.owner.owner?.id);
    const [owner, setOwner] = useState(''); // Initialize as null
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false); // State for controlling modal visibility
    const [imageToShow, setImageToShow] = useState(''); // State for storing the image URL
    const [showOwnerDetailsEditModal, setShowOwnerDetailsEditModal] = useState(false);
    const [changePasswordModal, setChangePasswordModal] = useState(false)
    const [showVenueDetailsEditModal, setShowVenueDetailsEditModal] = useState(false)

    const fetchingOwnerAllDetails = async () => {
        if (!ownerId) return; // Avoid making the API call if ownerId is not available
        try {
            const response = await axiosOwnerInstance.get(`get-owner-venue-details/${ownerId}/`);
            setOwner(response.data);
            console.log(response.data);
        } catch (error) {
            toast.error('Failed to fetch owner details. Please try again later');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchingOwnerAllDetails();
    }, [ownerId]); // Re-run the effect when ownerId changes

    const handleShowImage = (imageUrl) => {
        setImageToShow(imageUrl);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setImageToShow('');
    };

    const handleOpenPDF = (pdfUrl) => {
        window.open(pdfUrl, '_blank'); // Open PDF in a new tab
    };

    const formik1 = useFormik({
        initialValues: {
            first_name: owner?.first_name || '',
            last_name: owner?.last_name || '',
            phone: owner?.phone || '',
            phone2: owner?.phone2 || '',
        },
        enableReinitialize: true, // This ensures that formik re-initializes when owner changes
        validationSchema: OwnerDetailsEditSchema,
        onSubmit: async (updatedValues) => {
            if (!formik1.dirty) { // Check if any field has been modified
                toast.warning('No changes detected. Please update the form before submitting.');
                return;
            }
            try {
                await axiosOwnerInstance.put(`update/${ownerId}/`, updatedValues);
                toast.success('Owner details updated successfully!');
                fetchingOwnerAllDetails(); // Refresh the details after update
                handleCloseOwnerDetailsEditModal();
            } catch (error) {
                toast.error('Failed to update owner details. Please try again later');
            }
        }
    });


    const handleOpenOwnerDetailsEditModal = () => {
        setShowOwnerDetailsEditModal(true);
    };

    const handleCloseOwnerDetailsEditModal = () => {
        setShowOwnerDetailsEditModal(false);
        formik1.resetForm();
    };


    const formik2 = useFormik({
        initialValues:{
            convention_center_name: owner?.venue?.convention_center_name  || '',
            short_description: owner?.venue?.short_description || '',
            description: owner?.venue?.description || '',
            price: owner?.venue?.price || '',
            dining_seat_count: owner?.venue?.dining_seat_count || '',
            auditorium_seat_count: owner?.venue?.auditorium_seat_count || '',
            condition: owner?.venue?.condition || '',
            state: owner?.venue?.state || '',
            district: owner?.venue?.district || '',
            city: owner?.venue?.city || '',
            pincode: owner?.venue?.pincode || '',
            address: owner?.venue?.address || '',
        }, enableReinitialize: true,
        validationSchema:VenueRegisterSchema,
        onSubmit: async (updataedValues)=> {
            console.log('updated values ',updataedValues)
            if (!formik1.dirty) { 
                toast.warning('No changes detected. Please update venue details before submitting.');
                return;
            }
            try{
                const response = await axiosOwnerInstance.put(`update-venue/${owner?.venue?.id}/`, updataedValues);
                toast.success('Venue details updated successfully')
                handleCloseVenueDetailsEditModal()
                fetchingOwnerAllDetails()
            }catch(error) {
                console.error('error',error)
                toast.error('Failed to update venue details. please try again later')
            }
        }
    })
    

    const handleOpenVenueDetailsEditModal = ()=> {
        setShowVenueDetailsEditModal(true)
    }

    const handleCloseVenueDetailsEditModal = ()=> {
        formik2.resetForm()
        setShowVenueDetailsEditModal(false)

    }
    

    const formik3 = useFormik({
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
                const response = await axiosOwnerInstance.post(`change-password/${owner?.id}/`, payload);
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


    const handleOpenChangePasswordModal = ()=>{
        setChangePasswordModal(true)
    }
    
    const handleCloseChangePasswordModal = ()=> {
        formik3.resetForm()
        setChangePasswordModal(false)
    }
    if (loading) {
        return <div>Loading...</div>;
    }
   
    
    return(
        <> 

        <Sidebar/>

        <div className="flex flex-col flex-1 ml-64 mt-14 bg-customColor7 min-h-screen">
        <div className="p-10">
          <div className="bg-customColor8 pb-10 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold  text-center text-white py-3 bg-gradient-to-r from-teal-500 to-gray-800 rounded-tl-lg rounded-tr-lg">Owner Details</h3>
            <div className="flex">
                <div className="w-1/2  py-10 px-10">

        <div className="bg-customColor7 overflow-hidden shadow rounded-lg border">
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg text-center leading-6 font-medium text-gray-900">
                    Owner Details
                </h3>
                {/* <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    This is some information about the user.
                </p> */}
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900">
                            Full name
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                           {owner.first_name} {owner.last_name}
                        </dd>
                    </div>
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900">
                            Email address
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {owner.email}
                        </dd>
                    </div>
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900">
                            Phone number
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {owner.phone}
                        </dd>
                    </div>
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900">
                           Additional Phone number
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {owner.phone2}
                        </dd>
                    </div>
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900">
                            Id Proof
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            <button className="text-teal-500 font-semibold hover:underline" onClick={() => handleShowImage(owner.id_proof)}>
                                View Proof
                            </button>
                        </dd>
                    </div>
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900">
                            Venue License
                        </dt>
                        <dd className="mt-1 text-sm font-semibold text-gray-900 sm:mt-0 sm:col-span-2">
                            <button className="text-teal-500 hover:underline" onClick={() => handleShowImage(owner.venue.venue_license)}>
                                View Licence
                            </button>
                        </dd>
                    </div>
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900">
                            Terms and Conditions
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            <button className="text-teal-500 font-semibold hover:underline" onClick={() => handleOpenPDF(owner.venue.terms_and_conditions)}>
                                View Terms and Conditons
                            </button>
                        </dd>
                    </div>
                    
                </dl>
                <div className="flex justify-end gap-2 m-4">
                       <button className="bg-teal-600 text-white  px-4 py-2 rounded hover:bg-teal-700"
                       onClick={handleOpenChangePasswordModal}
                       >Change Password</button>
                       <button className="bg-teal-600 text-white  px-4 py-2 rounded hover:bg-teal-700"
                       onClick={()=> handleOpenOwnerDetailsEditModal()}
                       >Edit</button>
                </div>
            </div>
        </div> 


                </div>

    <div className="w-1/2  py-10 px-10">

        <div className="bg-customColor7 overflow-hidden shadow rounded-lg border">
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-center text-gray-900">
                    Veneu details
                </h3>
                {/* <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    This is some information about the user.
                </p> */}
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900">
                            Convention Center
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                           {owner.venue.convention_center_name}
                        </dd>
                    </div>
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900">
                            Short Description
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {owner.venue.short_description}
                        </dd>
                    </div>
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900">
                            Condition 
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {owner.venue.condition}
                        </dd>
                    </div>
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900">
                            Dining Seat Count
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {owner.venue.dining_seat_count}
                        </dd>
                    </div>
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900">
                            Auditorium Seat Count
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                           {owner.venue.auditorium_seat_count}
                        </dd>
                    </div>
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900">
                            Price
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                           {owner.venue.price}
                        </dd>
                    </div>
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900">
                            Full Address
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {owner.venue.address} {owner.venue.district} {owner.venue.state}
                        </dd>
                    </div>
                    
                </dl>
                <div className="flex justify-end m-4">
                    <button 
                    onClick={handleOpenVenueDetailsEditModal}
                    className="bg-teal-600 text-white  px-4 py-2 rounded hover:bg-teal-700">
                        Edit
                    </button>
                </div>
            </div>
        </div> 


</div>
</div>
            
    
          </div>
          </div>
          </div>
        
          {showModal && (
            <ViewImageModal imageSrc={imageToShow} onClose={handleCloseModal} />
        )}

        {showOwnerDetailsEditModal && (
            <EditOwnerDetailsModal isOwnerDetailsEditModalOpen={showOwnerDetailsEditModal} formik1={formik1} handleCloseOwnerDetailsEditModal={handleCloseOwnerDetailsEditModal}/>
        )}
          
         {showVenueDetailsEditModal && (
            <VenueDetailsEditModal  isVenueDetailsEditModalOpen={showVenueDetailsEditModal} formik2={formik2} handleCloseVenueDetailsEditModal={handleCloseVenueDetailsEditModal} />
         )} 

         {changePasswordModal && (
            <OwnerChangePasswordModal isOwnerChangePasswordModalOpen={changePasswordModal} formik3={formik3} handleCloseOwnerChangePasswordModal={handleCloseChangePasswordModal}/>
         )}
        </>
    )
}
