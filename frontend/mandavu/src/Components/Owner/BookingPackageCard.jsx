
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import { useEffect, useState } from "react";
import { useFormik } from 'formik';
import toPascalCase from '../../Utils/Extras/ConvertToPascalCase';
import BookingPackagesShcema from '../../Validations/Owner/BookingPackagesSchema';
import AddBookingPackageModal from './AddBookingPackageModal';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function BookingPackageCard({ bookingPackage, onUpdateBookingPackage, handleBlockBookingPackage, handleUnblockBookingPackage }) {
  
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState(null);
  const [isAcSelected, setIsAcSelected] = useState(false);

  const navigate = useNavigate()


  const formik = useFormik({
    initialValues: {
      package_name: "",
      price: "",
      price_for_per_hour: "",
      description: "",
      air_condition: "",
      extra_price_for_aircondition: ""
    },
    validationSchema: BookingPackagesShcema,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (JSON.stringify(values) === JSON.stringify(initialFormValues)) {
        toast.warning('No changes detected.');
        return; // Stop form submission if no changes are detected
      }
      if (selectedPackage) {
        onUpdateBookingPackage(selectedPackage.id, values)
        console.log(values, selectedPackage.id)
      }

      handleCloseEditModal();
    }
  })

  const handleOpenEditModal = (bookingPackage) => {
    setSelectedPackage(bookingPackage)
    setIsEditModalOpen(true)
  };

  const handleCloseEditModal = () => {
    setSelectedPackage(null)
    setIsEditModalOpen(false)
  }

  const handleToggleDetails = (bookingPackage) => {
    if (selectedPackage?.id === bookingPackage.id) {
      setSelectedPackage(null); // Close dropdown if the same button is clicked again
    } else {
      setSelectedPackage(bookingPackage); // Show details
    }
  };

  useEffect(() => {
    if (selectedPackage) {
      const initialValues = {
        package_name: selectedPackage.package_name,
        price: selectedPackage.price,
        price_for_per_hour: selectedPackage.price_for_per_hour,
        description: selectedPackage.description,
        air_condition: selectedPackage.air_condition,
        extra_price_for_aircondition: selectedPackage.extra_price_for_aircondition,
      };

      // Set initial values for Formik
      formik.setValues(initialValues);
      setInitialFormValues(initialValues);
    }
  }, [selectedPackage])

  return (
    <>
      <div
        className="bg-white shadow-lg rounded-lg overflow-hidden my-4 mx-auto w-full max-w-md relative hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
        style={{ height: "420px" }} // Fixed height
      >

        {selectedPackage?.id !== bookingPackage.id && (
          <div className={`${bookingPackage.package_name.toLowerCase() === 'regular' ? 'bg-blue-900' : 'bg-teal-900'} p-4 mt-6 text-center`}>
            <h2 className="text-lg font-bold text-white">{toPascalCase(bookingPackage.package_name)}</h2>
          </div>
        )}

        <div className="p-4 flex flex-col justify-between" style={{ height: "calc(100% - 4rem)" }}>
          {/* Conditionally render fields based on dropdown state */}
          {selectedPackage?.id !== bookingPackage.id ? (
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-700">Price:</span>
                <span className="text-gray-700">₹{bookingPackage.price}</span>
              </div>
              {bookingPackage.price_for_per_hour !== 'Not Allowed' && (
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-gray-700">Price per Hour:</span>
                  <span className="text-gray-700">₹{bookingPackage.price_for_per_hour}</span>
                </div>
              )}
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-700">Air Condition:</span>
                <span className="text-gray-700">{bookingPackage.air_condition}</span>
              </div>
              {bookingPackage.air_condition === "AC" && (
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-gray-700">Extra Price for AC:</span>
                  <span className="text-gray-700">₹{bookingPackage.extra_price_for_aircondition}</span>
                </div>
              )}
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-700">Status:</span>

                {bookingPackage.is_rejected ? (
                  <span className="text-red-500 font-semibold">Rejected</span>
                ) : !bookingPackage.is_verified ? (
                  <span className="text-orange-500 font-semibold">Waiting for approval</span>
                ) : (
                  <span className={bookingPackage.is_active ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}>
                    {bookingPackage.is_active ? "Active" : "Inactive"}
                  </span>
                )}

                {/* <span className={bookingPackage.is_active ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}>
                {bookingPackage.is_active ? "Active" : "Inactive"}
              </span> */}

              </div>

              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-700">Details:</span>
                <span >
                  <button
                    // className="bg-purple-600 text-white py-1 px-2 rounded hover:bg-purple-700 transition duration-300"
                    className="bg-white text-blue-600 py-1 px-2 rounded border border-blue-700 hover:bg-blue-600 hover:text-white  transition duration-300"

                    onClick={() => handleToggleDetails(bookingPackage)}
                  >
                    {selectedPackage?.id === bookingPackage.id ? "Hide Details" : "View Details"}
                    <ArrowDropDownIcon />
                  </button>
                </span>
              </div>

              {bookingPackage.price_for_per_hour !== 'Not Allowed' && (
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-gray-700"></span>
                  <span >
                    <button
                      className={`bg-white text-purple-700 py-1 px-2 rounded border border-purple-700 hover:bg-purple-600 hover:text-white transition duration-300 ${!bookingPackage.is_editable ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      onClick={() => navigate(`/owner/manage-time-slotes/${bookingPackage.id}`)}
                      disabled={!bookingPackage.is_editable}
                    >
                      Manage time slotes <ManageHistoryIcon />
                    </button>
                  </span>
                </div>
              )}



            </div>
          ) : (
            <div className="overflow-y-scroll max-h-80 ">
              {/* add description  */}
              <div className="mt-4 bg-gray-100 text-gray-700 rounded-lg shadow-inner p-4  transition-all duration-500 ease-in-out transform-gpu">
                <h3 className="font-semibold mb-2 text-lg"> Package Details</h3>
                <p className="mb-2">{bookingPackage.description}</p>
              </div>
            </div>
          )}


          {/* Edit Button */}
          <div className="absolute bottom-4 right-4">
            {selectedPackage?.id !== bookingPackage.id ? (
              <>
                <button
                  className={`bg-yellow-600 text-white py-1 px-3 rounded hover:bg-yellow-700 ${!bookingPackage.is_editable ? 'opacity-50 cursor-not-allowed' : ''}`}
                  // className="bg-yellow-600 text-white py-1 px-3 rounded hover:bg-yellow-700 transition duration-300"
                  onClick={() => handleOpenEditModal(bookingPackage)}
                  disabled={!bookingPackage.is_editable}
                >
                  Edit
                </button>
                <span> </span>

                {bookingPackage.is_active ? (
                  <button
                    className={`bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700 transition duration-300 ${!bookingPackage.is_editable ? 'opacity-50 cursor-not-allowed' : ''}`}
                    // className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700 transition duration-300"
                    onClick={() => handleBlockBookingPackage(bookingPackage.id)}
                    disabled={!bookingPackage.is_editable}
                  >
                    Block
                  </button>
                ) : (
                  <button
                    className={`bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700 transition duration-300 ${!bookingPackage.is_editable ? 'opacity-50 cursor-not-allowed' : ''}`}
                    // className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700 transition duration-300"
                    onClick={() => handleUnblockBookingPackage(bookingPackage.id)}
                    disabled={!bookingPackage.is_editable}
                  >
                    Unblock
                  </button>
                )}
              </>
            ) : (
              <button
                className="bg-white text-blue-600 py-1 px-2 rounded border border-blue-700 hover:bg-blue-600 hover:text-white  transition duration-300"
                onClick={() => handleToggleDetails(bookingPackage)}
              >
                {selectedPackage?.id === bookingPackage.id ? "Hide Details" : "View Details"}
                <ArrowDropUpIcon />
              </button>
            )}
          </div>
        </div>
      </div>

      <AddBookingPackageModal 
        formik={formik} 
        isModalOpen={isEditModalOpen} 
        handleCloseModal={handleCloseEditModal} 
        isAcSelected={isAcSelected} 
        setIsAcSelected={setIsAcSelected} />

    </>

  );
}
