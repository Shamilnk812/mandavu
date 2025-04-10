import { useFormik } from "formik";
import { useState, useEffect } from "react";
import AddFacilitySchema from "../../Validations/Owner/AddFacilitySchema";
import EditFacilitModal from "./EditFacilityModal";
import { toast } from "react-toastify";
import EmptyDataShowMessage from "./EmptyDataShowMessage";


export default function ShowFacilityDetails({ facilityList, onUpdateFacility, blockFacilities, unblockFacilities, facilityAddingModal, loading }) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedFacility, setSelectedFacility] = useState(null);

    const formik = useFormik({
        initialValues: {
            facility: '',
            price: ''
        },
        validationSchema: AddFacilitySchema,
        enableReinitialize: true,
        onSubmit: (values) => {
            console.log('heyy  iam working')
            if (
                selectedFacility &&
                values.facility === selectedFacility.facility &&
                values.price === selectedFacility.price
            ) {
                toast.info("No changes detected");
                return;
            }
            if (selectedFacility) {
                onUpdateFacility(selectedFacility.id, values)
                console.log(values, selectedFacility.id);
            }

            handleCloseEditModal();
            console.log('working');
        }
    });

    useEffect(() => {
        if (selectedFacility) {
            formik.setValues({
                facility: selectedFacility.facility,
                price: selectedFacility.price
            });
        }
    }, [selectedFacility]);

    const handleOpenEditModal = (facility) => {
        setSelectedFacility(facility);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setSelectedFacility(null);
        setIsEditModalOpen(false);
    };

    return (
        <>

            <div className="relative h-[600px] overflow-y-auto px-4">
                <div className="flex justify-end items-center py-4 sticky top-0 bg-white z-10">
                    <button
                        className="bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-800 transition-all duration-300 flex items-center shadow-md"
                        onClick={facilityAddingModal}
                    >
                        + Add Facility
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 pb-8">
                    {facilityList.map((facility) => (
                        <div
                            key={facility.id}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden"
                        >
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-md font-normal text-gray-600 truncate">
                                        {facility.facility}
                                    </h3>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-sm font-normal bg-teal-100 text-teal-800">
                                        ₹{facility.price}
                                    </span>
                                </div>

                                <div className="flex items-center mb-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${facility.is_active
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                        }`}>
                                        {facility.is_active ? "Active" : "Inactive"}
                                    </span>
                                </div>

                                <div className="flex justify-end space-x-2 mt-8">
                                    <button
                                        onClick={() => handleOpenEditModal(facility)}
                                        className="flex-1 ml-28 inline-flex justify-center items-center py-2 px-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-all"
                                    >
                                        Edit
                                    </button>

                                    {facility.is_active ? (
                                        <button
                                            onClick={() => blockFacilities(facility.id)}
                                            className="flex-1 inline-flex justify-center items-center py-2 px-3 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none transition-all"
                                        >
                                            Block
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => unblockFacilities(facility.id)}
                                            className="flex-1 inline-flex justify-center items-center py-2 px-3 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none transition-all"
                                        >
                                            Unblock
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>


                {facilityList.length === 0 && (
                    <EmptyDataShowMessage title={'Facility'} />
                )}
            </div>


            <EditFacilitModal isEditModalOpen={isEditModalOpen} handleCloseEditModal={handleCloseEditModal} formik={formik} loading={loading} />
        </>
    );
}
