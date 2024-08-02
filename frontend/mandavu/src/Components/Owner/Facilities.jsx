import { useFormik } from "formik";
import { useEffect, useState } from "react"
import AddFacilitySchema from "../../Validations/Owner/AddFacilitySchema";
import axios from "axios";
import { toast } from "react-toastify";
import ShowFacilityDetails from "./ShowFacilities";
import AddFacilityModal from "./AddFacilityModal";

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



    const formik2 = useFormik({
        initialValues:{

        }
    })
    


    

    

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

    useEffect(()=> {
        fetchFacilities()
    },[])



      return(
        <>

                   <div className="bg-customColor2 mt-12 p-8 md:p-24 rounded-lg shadow-lg">
                            <div className="flex justify-center">
                            <button
                              onClick={handleOpenModal}
                             className="inline-block px-6 py-3 bg-blue-600 text-white font-medium text-sm leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                             >Add Facilites</button>
                           </div>  

                            <ShowFacilityDetails facilityList={facilityList}/>

                    </div>
                

            {isModalOpen && (
                <div id="authentication-modal" tabIndex="-1" className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden">
                    <div className="relative p-4 w-full max-w-md max-h-full">
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Add Facilites 
                                </h3>
                                <button
                                    type="button"
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
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
                                            className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.price}
                                    
                                        />
                                        {formik.touched.price && formik.errors.price ? (
                                            <div className="text-red-500 text-sm mt-1">{formik.errors.price}</div>
                                        ) : null}
                                    </div>

                                    
                                    <div className="flex justify-center pt-4">
                                    <button type="submit" className="w-1/2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        
        {/* <AddFacilityModal formik2={formik} isOpen={isEditModalOpen} handleClose={handleCloseEditModal}/> */}

        </>
      )
}