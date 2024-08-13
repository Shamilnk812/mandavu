import { useFormik } from "formik";
import { useState, useEffect } from "react";
import AddFacilitySchema from "../../Validations/Owner/AddFacilitySchema";
import EditFacilitModal from "./EditFacilityModal";

export default function ShowFacilityDetails({ facilityList, onUpdateFacility,blockFacilities, unblockFacilities, facilityAddingModal }) {
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
            if (selectedFacility) {
                onUpdateFacility(selectedFacility.id, values)
                console.log(values,selectedFacility.id);
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
            <div className="relative overflow-x-auto ">
                <div className="flex justify-end items-center py-4 pr-2">
                    <button
                        className="mt-2 bg-teal-600 text-white py-2 px-4 rounded hover:bg-gradient-to-r from-teal-500 to-gray-800"
                        onClick={facilityAddingModal}
                    >
                       + Add Facility
                    </button>
                </div>

                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-white uppercase bg-gradient-to-r from-teal-500 to-gray-800 dark:bg-gradient-to-r from-teal-500 to-gray-800 dark:text-white">
                        <tr>
                            <th scope="col" className="px-6 py-3">Facilities</th>
                            <th scope="col" className="px-6 py-3">Price</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {facilityList.map((facility) => (
                            <tr className="bg-customColor7 border-b border-gray-400 dark:bg-customColor7 dark:border-gray-400" key={facility.id}>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-700 whitespace-nowrap dark:text-gray-700">
                                    {facility.facility}
                                </th>
                                <td className="px-6 py-4 text-gray-700">{facility.price}</td>
                                <td className="px-6 py-4"><span
                                    className={
                                        facility.is_active
                                            ? "text-green-500 font-semibold"
                                            : "text-red-500 font-semibold"
                                    }
                                >
                                    {facility.is_active ? "Active" : "Not Active"}
                                </span></td>
                                <td className="px-6 py-4">
                                    <button
                                        type="button"
                                        className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500  font-medium rounded-lg text-sm px-5 py-2 me-1 mb-1 "
                                        onClick={() => handleOpenEditModal(facility)}
                                    >
                                        Edit
                                    </button>
                                    {facility.is_active ? (
                                            <button
                                                type="button"
                                                className="focus:outline-none ml-2 text-white  bg-red-500 hover:bg-red-600   font-medium rounded-lg text-sm px-5 py-2 me-1 mb-1 "
                                                onClick={()=> blockFacilities(facility.id)}
                                            >

                                                Block
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                className="focus:outline-none ml-2 text-white bg-green-500 hover:bg-green-600 font-medium rounded-lg text-sm px-5 py-2 me-1 mb-1 "
                                                onClick={()=> unblockFacilities(facility.id)}
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



            <EditFacilitModal isEditModalOpen={isEditModalOpen} handleCloseEditModal={handleCloseEditModal} formik={formik}/>
        </>
    );
}
