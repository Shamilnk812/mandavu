import { useFormik } from "formik";
import { useEffect, useState } from "react";
import Sidebar from "../../Components/Owner/Sidebar";
import BookingPackagesShcema from "../../Validations/Owner/BookingPackagesSchema";
import AddBookingPackageModal from "../../Components/Owner/AddBookingPackageModal";
import { axiosOwnerInstance } from "../../Utils/Axios/axiosInstance";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import BookingPackageCard from "../../Components/Owner/BookingPackageCard";


export default function BookingPackages() {

  const venueId = useSelector((state)=> state.owner?.venueId)
  const [bookingPackages, setBookingPackages] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAcSelected, setIsAcSelected] = useState(false);

  const [selectedPackage, setSelectedPackage] = useState(null); 

  const handleToggleDetails = (bookingPackage) => {
    if (selectedPackage?.id === bookingPackage.id) {
      setSelectedPackage(null); // Close if the same button is clicked again
    } else {
      setSelectedPackage(bookingPackage);
    }
  };



  const formik = useFormik({
    initialValues: {
      package_name: "",
      price: "",
      price_for_per_hour: "",
      // description: "",
      air_condition: "",
      extra_price_for_aircondition: ""
    },
    validationSchema:BookingPackagesShcema,
    onSubmit: async (values) => {
      try{
        const response = await axiosOwnerInstance.post(`/add-booking-package/${venueId}/`,values)
        console.log(response.data)
        // console.log("form submitted with", values);
        formik.resetForm()
        handleCloseModal() 
        toast.success("New Booking Pckage addeddsuccessfully")
        fetchBookingPackages();
      }catch(error) {
        if (error.response && error.response.data) {
          // Handle backend validation errors here
          Object.keys(error.response.data).forEach((key) => {
            toast.error(error.response.data[key][0]);  // Show the backend error messages using toast
          });
        } else {
          toast.error('Failed to create new booking package. Please try again');
        }
      }
     
    }
  });

  const updateBookingPakcage = async(id, updatedValues)=> {
    try{
      const response = await axiosOwnerInstance.put(`update-booking-package/${venueId}/`,{...updatedValues, package_id:id})
      toast.success('Booking package updated successfully.')
      fetchBookingPackages();
    }catch(error) {
      if (error.response && error.response.data) {
        // Handle backend validation errors here
        Object.keys(error.response.data).forEach((key) => {
          toast.error(error.response.data[key][0]);  // Show the backend error messages using toast
        });
      } else {
        toast.error('Failed to update booking package. Please try again later');
      }
    }
  }

  const blockBookingPackage = async (id)=> {
    try {
      const response = await axiosOwnerInstance.patch(`block-booking-package/${venueId}/`,{package_id:id})
      toast.success('Booking packages is blocked')
      fetchBookingPackages()
    }catch(error) {
      console.error('feesf',error)
      toast.error('Failed to block booking package. Please try again later.')
    }
  }

  const unBlockBookingPackage = async (id)=> {
    try{
      await axiosOwnerInstance.patch(`unblock-booking-package/${venueId}/`,{package_id:id})
      toast.success('Booking pachage is unblocked.')
      fetchBookingPackages()
    }catch(error){
      toast.error('Failed to unblock booking package. Please try again later.')
    }
  }

  const handleOpenModal = ()=>{
    setIsModalOpen(true)
  }

  const handleCloseModal = ()=> {
    setIsModalOpen(false)
    formik.resetForm()
  }

  const fetchBookingPackages = async ()=> {
    try{
      const response = await axiosOwnerInstance.get(`/get-all-booking-packages/${venueId}/`)
      console.log(response.data)
      setBookingPackages(response.data)

    }catch(error){
      console.error('sommt',error)
      toast.error('Failed to fetch booking packages. Please try again later')
    }
  }

  useEffect(()=> {
    fetchBookingPackages();
  },[venueId])

  // const handleShowDetails = () => {
  //   setShowDetails(!showDetails);  
  // }


  return (
    <>
      <Sidebar />
      <div className="flex flex-col flex-1 ml-64 mt-14 bg-customColor7 min-h-screen">
        <div className="p-10">
          <div className="bg-customColor8 pb-10 rounded-lg shadow-lg">
            <div>
              <h1 className="text-2xl bg-gradient-to-r from-teal-500 to-gray-800 font-semibold py-3 rounded-tl-lg rounded-tr-lg text-center text-white">
                Booking Packages
              </h1>
            </div>
            <div className="px-10"> 
            <div className="flex justify-end items-center py-4 pr-2">
              <button
                className="mt-2 bg-teal-600 text-white py-2 px-4 rounded hover:bg-gradient-to-r from-teal-500 to-gray-800"
                onClick={handleOpenModal} 
              >
                + Add Package
              </button>
            </div>

            {/* Display booking packages */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* <div
                  className="bg-white shadow-lg rounded-lg overflow-hidden my-4 mx-auto w-full max-w-md relative hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                  style={{ minHeight: "320px" }}
                >
                  <div className="pt-10">
                    <h2 className="text-2xl font-bold text-center bg-teal-900 text-white mb-2 p-4">
                      Regular
                    </h2>
                    <p className="text-gray-600 text-center mb-4">Default Package</p>

                    <div className="text-center">
                      <button
                        className="mt-2 bg-teal-600 text-white py-1 px-3 rounded-full hover:bg-teal-700"
                        onClick={() =>
                          handleToggleDetails({
                            id: "regular",
                            package_name: "Regular",
                            description:
                              "This is the default package for regular booking. It includes a range of basic amenities such as air conditioning, seating for up to 100 guests, a spacious dining area, and parking facilities. Ideal for small to medium-sized events, this package offers great value with flexibility. Additional services can be added upon request.",
                            price: "₹5000",
                            features: [
                              "Air conditioning",
                              "Basic facilities",
                              "Up to 100 guests",
                              "Spacious dining area",
                              "Parking facilities",
                            ],
                          })
                        }
                      >
                        View Details
                      </button>
                      <p></p>
                    </div>

                    
                    <div
                      className={`${
                        selectedPackage?.id === "regular"
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                      } overflow-hidden transition-all duration-500 ease-in-out transform-gpu`}
                    >
                      {selectedPackage?.id === "regular" && (
                        <div className="mt-4 bg-gray-100 text-gray-700 rounded-lg shadow-inner p-4">
                          <h3 className="font-semibold mb-2 text-lg">
                            {selectedPackage.package_name} Package Details
                          </h3>
                          <p className="mb-2">{selectedPackage.description}</p>
                          <p className="font-semibold text-teal-700 mb-2">
                            Price: {selectedPackage.price}
                          </p>
                          <h4 className="font-bold mb-2">Features:</h4>
                          <ul className="list-disc list-inside">
                            {selectedPackage.features.map((feature, index) => (
                              <li key={index}>{feature}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div> */}

              {bookingPackages.map((bookingPackage) => (
                <BookingPackageCard
                  key={bookingPackage.id}
                  bookingPackage={bookingPackage}
                  onUpdateBookingPackage={updateBookingPakcage}
                  handleBlockBookingPackage={blockBookingPackage}
                  handleUnblockBookingPackage={unBlockBookingPackage}
         
                />
              ))}
            </div>
            </div>
          </div>
        </div>
      </div>

      <AddBookingPackageModal formik={formik} isModalOpen={isModalOpen} handleCloseModal={handleCloseModal} isAcSelected={isAcSelected} setIsAcSelected={setIsAcSelected} />

     
    </>
  );
}
