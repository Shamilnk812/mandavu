import { useFormik } from "formik";
import { useState, useEffect } from "react";
import AddFacilitySchema from "../../Validations/Owner/AddFacilitySchema";

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

            {isEditModalOpen && (
                <div id="authentication-modal" tabIndex="-1" className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden">
                    <div className="relative p-4 w-full max-w-md max-h-full">
                        <div className="relative bg-teal-800 rounded-lg shadow dark:bg-teal-800">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Edit Facilities
                                </h3>
                                <button
                                    type="button"
                                    className="text-gray-400 bg-transparent hover:bg-customColor7 hover:text-gray-600 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-customColor7 dark:hover:text-gray-600"
                                    onClick={handleCloseEditModal}
                                >
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
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
                                            value={formik.values.price}
                                        />
                                        {formik.touched.price && formik.errors.price ? (
                                            <div className="text-red-500 text-sm mt-1">{formik.errors.price}</div>
                                        ) : null}
                                    </div>
                                    <div className="flex justify-center pt-4">
                                        <button type="submit" className="w-1/2 mt-2 bg-teal-600 text-white py-2 px-4 rounded hover:bg-gradient-to-r from-teal-500 to-gray-800">
                                            Update
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
