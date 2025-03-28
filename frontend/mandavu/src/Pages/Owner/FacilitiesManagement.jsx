import { useSelector } from "react-redux";
import Sidebar from "../../Components/Owner/Sidebar";
import { useFormik } from "formik";
import { useEffect, useState } from "react"
import AddFacilitySchema from "../../Validations/Owner/AddFacilitySchema";
import axios from "axios";
import { toast } from "react-toastify";
import ShowFacilityDetails from "../../Components/Owner/ShowFacilities";
import AddFacilityModal2 from "../../Components/Owner/AddFacilityModal2";
import { axiosOwnerInstance } from "../../Utils/Axios/axiosInstance";


export default function FacilitesManagement () {
    const [facilityList, setFacility] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addingFacility, setAddingFacility] = useState(false);
    const [updatingFacility, setUpdateFacility] = useState(false);
    


    const formik = useFormik({
        initialValues:{
            facility:'',
            price:'',
        },
        validationSchema:AddFacilitySchema,
        onSubmit: async (values) => {
            setAddingFacility(true);
            try{
                const response = await axiosOwnerInstance.post(`add-facility/${venueId}/`,values);
                toast.success('Facility added successfully ')
                formik.resetForm()
                setIsModalOpen(false)
                fetchFacilities()
            }catch (error) {
                if (error.response && error.response.data) {
                    // Extract the error message from the response
                    const errorMessage = error.response.data.detail || error.response.data.non_field_errors?.[0] || error.response.data.facility?.[0] || "An error occurred";
                    toast.error(errorMessage);
                } else {
                    console.error('An unexpected error occurred', error);
                    toast.error('An unexpected error occurred');
                }
            }finally{
                setAddingFacility(false)
            }
        }
    })

    const updateFacility = async (id, updatedValues) => {
        setUpdateFacility(true);
        try{
            console.log(updatedValues)
            const response = await axiosOwnerInstance.put(`update-facility/${venueId}/`,{...updatedValues, facility_id : id})
            console.log(response.data)
            toast.success('Facility updated successfully ')
            fetchFacilities()
        }catch(error) {
            if (error.response && error.response.data) {
                // Extract the error message from the response
                const errorMessage = error.response.data.detail || error.response.data.non_field_errors?.[0] || error.response.data.facility?.[0] || "An error occurred";
                toast.error(errorMessage);
            } else {
                console.error('An unexpected error occurred', error);
                toast.error('An unexpected error occurred');
            }
        }finally{
            setUpdateFacility(false);
        }
        
    }


    const handleOpenModal = () => {
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    
    
    const fetchFacilities = async ()=>{
        try{
            const response = await axiosOwnerInstance.get(`get-facility/${venueId}/`)
            setFacility(response.data)
            console.log(response.data)
        }catch (error) {
            console.error('fetchi facility error',error)
        }
    }

    const blockFacilities = async (facility_id) => {
        try{
            console.log('facilliii',facility_id)
            const response = await axiosOwnerInstance.post(`block-facility/${venueId}/`,{facility_id})
            toast.success('Facility blocked successfully')
            fetchFacilities()
        }catch (error) {
            console.error('some',error)
            toast.error('Someting went wrong')
        }}

    const unblockFacilities = async (facility_id) => {
        try{
            const response = await axiosOwnerInstance.post(`unblock-facility/${venueId}/`,{facility_id})
            toast.success('Facility unblocked successfully')
            fetchFacilities()
        }catch (error) {
            console.error('some',error)
            toast.error('Someting went wrong')
        }}
    

    useEffect(()=> {
        fetchFacilities()
    },[])

    const venueId = useSelector((state) => state.owner?.venueId);
    console.log(venueId)
    return(
        <>
            <Sidebar/>
            <div className="flex flex-col flex-1 ml-64 mt-14 bg-customColor7 min-h-screen">
                <div className="p-10">
                <div className="bg-white pb-10 border rounded-lg shadow-lg">
                     <div>
                        <h1 className="text-2xl border-b border-gray-300 font-semibold py-3  text-center text-gray-700" >Facilties</h1>
                     </div>

                     <div className="px-16">
                     {facilityList.length === 0 ? (
                        <div className="border-dashed border-2 border-gray-800 w-full h-40 mt-10 mb-10 rounded-lg flex items-center justify-center">
                            <button
                                onClick={handleOpenModal}
                                className="mt-2 bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-800 transition-all duration-300"
                            >
                                + Add Facilities
                            </button>
                        </div>
                    ) : (
                        <ShowFacilityDetails 
                            facilityList={facilityList} 
                            onUpdateFacility={updateFacility} 
                            blockFacilities={blockFacilities} 
                            unblockFacilities={unblockFacilities}
                            facilityAddingModal={handleOpenModal}
                            loading={updatingFacility}

                        />
                    )}
                       
                        </div>

                    </div>

               </div>
            </div>
            

            <AddFacilityModal2 
                showModal={isModalOpen}
                handleCloseModal={handleCloseModal}
                formik={formik}
                loading={addingFacility}
                />
        </>
    )
}