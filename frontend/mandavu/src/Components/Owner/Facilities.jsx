import { useFormik } from "formik";
import { useEffect, useState } from "react"
import AddFacilitySchema from "../../Validations/Owner/AddFacilitySchema";
import axios from "axios";
import { toast } from "react-toastify";
import ShowFacilityDetails from "./ShowFacilities";

export default function Facilities({venueId}) {
    
    const [facilityList, setFacility] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    


    const formik = useFormik({
        initialValues:{
            facility:'',
            price:'',
        },
        validationSchema:AddFacilitySchema,
        onSubmit: async (values) => {
            try{
                const response = await axios.post(`http://127.0.0.1:8000/api/v2/auth/add-facility/${venueId}/`,values);
                toast.success('Facility added successfully ')
                formik.resetForm()
                setIsModalOpen(false)
                fetchFacilities()
            }catch (error) {
                if (error.response && error.response.data) {
                    const errorMessage = error.response.data.facility || 'Something went wrong';
                    toast.error(errorMessage);
                    formik.setErrors(error.response.data);
                } else {
                    toast.error('Something went wrong');
                }
            }
        }
    })

    const updateFacility = async (id, updatedValues) => {
        try{
            console.log(updatedValues)
            const response = await axios.put(`http://127.0.0.1:8000/api/v2/auth/update-facility/${venueId}/`,{...updatedValues, facility_id : id})
            console.log(response.data)
            toast.success('Facility updated successfully ')
            fetchFacilities()
        }catch(error) {
            console.error('some this ',error)
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
            const response = await axios.get(`http://127.0.0.1:8000/api/v2/auth/get-facility/${venueId}/`)
            setFacility(response.data)
            console.log(response.data)
        }catch (error) {
            console.error('fetchi facility error',error)
        }
    }

    const blockFacilities = async (facility_id) => {
        try{
            console.log('facilliii',facility_id)
            const response = await axios.post(`http://127.0.0.1:8000/api/v2/auth/block-facility/${venueId}/`,{facility_id})
            toast.success('Facility blocked successfully')
            fetchFacilities()
        }catch (error) {
            console.error('some',error)
            toast.error('Someting went wrong')
        }}

    const unblockFacilities = async (facility_id) => {
        try{
            const response = await axios.post(`http://127.0.0.1:8000/api/v2/auth/unblock-facility/${venueId}/`,{facility_id})
            toast.success('Facility unblocked successfully')
            fetchFacilities()
        }catch (error) {
            console.error('some',error)
            toast.error('Someting went wrong')
        }}
    

    useEffect(()=> {
        fetchFacilities()
    },[])
    


      return(
        <>

                   <div className="bg-customColor8 mt-12 pb-10 rounded-lg shadow-lg">
                     <div>
                        <h1 className="text-2xl bg-gradient-to-r from-teal-500 to-gray-800 font-semibold py-3 rounded-tl-lg rounded-tr-lg text-center text-white" >Facilties</h1>
                     </div>

                     <div className="px-16">
                     {facilityList.length === 0 ? (
                        <div className="border-dashed border-2 border-gray-800 w-full h-40 mt-10 mb-10 rounded-lg flex items-center justify-center">
                            <button
                                onClick={handleOpenModal}
                                className="mt-2 bg-teal-600 text-white py-2 px-4 rounded hover:bg-gradient-to-r from-teal-500 to-gray-800"
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

                        />
                    )}
                       
                        </div>

                    </div>
                

            {isModalOpen && (
                <div id="authentication-modal" tabIndex="-1" className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden">
                    <div className="relative p-4 w-full max-w-md max-h-full">
                        <div className="relative bg-teal-800 rounded-lg shadow dark:bg-teal-800">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Add Facilites 
                                </h3>
                                <button
                                    type="button"
                                    className="text-gray-400 bg-transparent hover:bg-customColor7 hover:text-gray-600 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-customColor7 dark:hover:text-gray-600"
                                    onClick={handleCloseModal}
                                >
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            <div className="p-4 md:p-5">
                                <form className="space-y-4" onSubmit={formik.handleSubmit}>
                                <div>
                                        <label htmlFor="facility" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter your Facility</label>
                                        <input
                                            type="text"
                                            name="facility"
                                            id="facility"
                                            className="bg-customColor7 border border-teal-500 text-gray-900 text-sm rounded-lg  block w-full p-2.5 dark:bg-customColor7 dark:border-teal-500 dark:placeholder-teal-500 dark:text-gray-800"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.facility}
                                        />
                                        {formik.touched.facility && formik.errors.facility ? (
                                            <div className="text-red-500 text-sm mt-1">{formik.errors.facility}</div>
                                        ) : null}
                                    </div>
                                    <div>
                                        <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
                                        <input
                                            type="text"
                                            name="price"
                                            id="price"
                                            className="bg-customColor7 border border-teal-500 text-gray-900 text-sm rounded-lg  block w-full p-2.5 dark:bg-customColor7 dark:border-teal-500 dark:placeholder-teal-500 dark:text-gray-800"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.price}
                                    
                                        />
                                        {formik.touched.price && formik.errors.price ? (
                                            <div className="text-red-500 text-sm mt-1">{formik.errors.price}</div>
                                        ) : null}
                                    </div>

                                    
                                    <div className="flex justify-center pt-4">
                                    <button type="submit" className="w-1/2 mt-2 bg-teal-600 text-white py-2 px-4 rounded hover:bg-gradient-to-r from-teal-500 to-gray-800"> +Add</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        

        </>
      )
}