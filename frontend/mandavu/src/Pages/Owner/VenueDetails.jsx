import { useFormik } from "formik";
import Sidebar from "../../Components/Owner/Sidebar";
import VenueRegisterSchema from "../../Validations/Owner/VenueRegisterSchema";
import axios from "axios";
import {toast } from "react-toastify"
import Facilities from "../../Components/Owner/Facilities";
import { useEffect } from "react";


export default function VenueDetails({ venueDetails }) {

    
    const formik = useFormik({
        initialValues: {
            convention_center_name: venueDetails.convention_center_name || '',
            short_description: venueDetails.short_description || '',
            description: venueDetails.description || '',
            price: venueDetails.price || '',
            dining_seat_count: venueDetails.dining_seat_count || '',
            auditorium_seat_count: venueDetails.auditorium_seat_count || '',
            condition: venueDetails.condition || '',
            state: venueDetails.state || '',
            district: venueDetails.district || '',
            city: venueDetails.city || '',
            pincode: venueDetails.pincode || '',
            address: venueDetails.address || '',
        },validationSchema: VenueRegisterSchema,
        onSubmit: async values =>{
            if (JSON.stringify(values) === JSON.stringify(formik.initialValues)) {
                toast.warning('No changes found');
                return;
            }
           try{
                await updateVenue(values);
           }catch (error) {
            console.error("Failed to update venue",error)
           }
        }
       
    });

    const updateVenue = async (updatedValues) => {
        console.log('updataed values',updatedValues)
        try{
            const response = await axios.put(`http://127.0.0.1:8000/api/v2/auth/update-venue/${venueDetails.id}/`, updatedValues)
            console.log('Venue updated successfully:', response.data);
            toast.success('Venue Details Successfully updated')
            
        }catch (error) {
            console.error('Error updating venue:', error);
            toast.error('Error updating venue')

        }
    }


    return <>
       {/* <Sidebar></Sidebar> */}

       <div className="flex flex-col flex-1 ml-64 mt-14 bg-customColor7 min-h-screen">
                <div className="p-10">
                    <div className=" bg-customColor8 rounded-lg shadow-lg pb-12"  >
                    <h3 className="text-2xl bg-gradient-to-r from-teal-500 to-gray-800 font-semibold py-3 rounded-tl-lg rounded-tr-lg text-center text-white">Edit Your Venue</h3>
                    <div className="px-20 py-12">
                        <form className="space-y-4" onSubmit={formik.handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label htmlFor="convention_center_name" className="block text-md font-medium text-gray-700">Convention Center Name</label>
                                    <input
                                        type="text"
                                        name="convention_center_name"
                                        placeholder="Convention Center Name"
                                        className="block text-sm py-3 px-4 rounded-lg w-full bg-customColor7 border border-gray-400 outline-teal-500"
                                        value={formik.values.convention_center_name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.convention_center_name && formik.errors.convention_center_name ? (
                                        <div className="text-red-600 text-sm">{formik.errors.convention_center_name}</div>
                                    ) : null}
                                </div>
                                <div>
                                    <label htmlFor="short_description" className="block text-md font-medium text-gray-700">short_description</label>
                                    <input
                                        type="short_description"
                                        name="short_description"
                                        placeholder="short_description"
                                        className="block text-sm py-3 px-4 rounded-lg w-full bg-customColor7 border border-gray-400 outline-teal-500"
                                        value={formik.values.short_description}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.short_description && formik.errors.short_description ? (
                                        <div className="text-red-600 text-sm">{formik.errors.short_description}</div>
                                    ) : null}
                                </div>
                                <div className="col-span-2">
                                    <label htmlFor="description" className="block text-md font-medium text-gray-700">Description</label>
                                    <textarea
                                        name="description"
                                        placeholder="Description"
                                        className="block text-sm py-3 px-4 rounded-lg w-full bg-customColor7 border border-gray-400 outline-teal-500"
                                        value={formik.values.description}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.description && formik.errors.description ? (
                                        <div className="text-red-600 text-sm">{formik.errors.description}</div>
                                    ) : null}
                                </div>
                                <div>
                                    <label className="block text-md font-medium text-gray-700">Condition</label>
                                    <div className="flex items-center space-x-4">
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                name="condition"
                                                value="Air Conditioned"
                                                className="form-radio"
                                                checked={formik.values.condition === "AC"}
                                                onChange={formik.handleChange}
                                            />
                                            <span className="ml-2">Air Conditioned</span>
                                        </label>
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                name="condition"
                                                value="Non-AC"
                                                className="form-radio"
                                                checked={formik.values.condition === "Non AC"}
                                                onChange={formik.handleChange}
                                            />
                                            <span className="ml-2">Non-AC</span>
                                        </label>
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                name="condition"
                                                value="Both"
                                                className="form-radio"
                                                checked={formik.values.condition === "Both"}
                                                onChange={formik.handleChange}
                                            />
                                            <span className="ml-2">Both</span>
                                        </label>
                                    </div>
                                    {formik.touched.condition && formik.errors.condition ? (
                                        <div className="text-red-600 text-sm">{formik.errors.condition}</div>
                                    ) : null}
                                </div>
                                <div>
                                    <label htmlFor="price" className="block text-md font-medium text-gray-700">Price</label>
                                    <input
                                        type="number"
                                        name="price"
                                        placeholder="Price"
                                        className="block text-sm py-3 px-4 rounded-lg w-full bg-customColor7 border border-gray-400 outline-teal-500"
                                        value={formik.values.price}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.price && formik.errors.price ? (
                                        <div className="text-red-600 text-sm">{formik.errors.price}</div>
                                    ) : null}
                                </div>
                                <div>
                                    <label htmlFor="dining_seat_count" className="block text-md font-medium text-gray-700">Dining Seat Count</label>
                                    <input
                                        type="number"
                                        name="dining_seat_count"
                                        placeholder="Dining Seat Count"
                                        className="block text-sm py-3 px-4 rounded-lg w-full bg-customColor7 border border-gray-400 outline-teal-500"
                                        value={formik.values.dining_seat_count}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.dining_seat_count && formik.errors.dining_seat_count ? (
                                        <div className="text-red-600 text-sm">{formik.errors.dining_seat_count}</div>
                                    ) : null}
                                </div>
                                <div>
                                    <label htmlFor="auditorium_seat_count" className="block text-md font-medium text-gray-700">Auditorium Seat Count</label>
                                    <input
                                        type="number"
                                        name="auditorium_seat_count"
                                        placeholder="Auditorium Seat Count"
                                        className="block text-sm py-3 px-4 rounded-lg w-full bg-customColor7 border border-gray-400 outline-teal-500"
                                        value={formik.values.auditorium_seat_count}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.auditorium_seat_count && formik.errors.auditorium_seat_count ? (
                                        <div className="text-red-600 text-sm">{formik.errors.auditorium_seat_count}</div>
                                    ) : null}
                                </div>
                               
                                <div>
                                    <label htmlFor="state" className="block text-md font-medium text-gray-700">State</label>
                                    <input
                                        type="text"
                                        name="state"
                                        placeholder="State"
                                        className="block text-sm py-3 px-4 rounded-lg w-full bg-customColor7 border border-gray-400 outline-teal-500"
                                        value={formik.values.state}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.state && formik.errors.state ? (
                                        <div className="text-red-600 text-sm">{formik.errors.state}</div>
                                    ) : null}
                                </div>
                                <div>
                                    <label htmlFor="district" className="block text-md font-medium text-gray-700">District</label>
                                    <input
                                        type="text"
                                        name="district"
                                        placeholder="District"
                                        className="block text-sm py-3 px-4 rounded-lg w-full bg-customColor7 border border-gray-400 outline-teal-500"
                                        value={formik.values.district}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.district && formik.errors.district ? (
                                        <div className="text-red-600 text-sm">{formik.errors.district}</div>
                                    ) : null}
                                </div>
                                <div>
                                    <label htmlFor="city" className="block text-md font-medium text-gray-700">city</label>
                                    <input
                                        type="text"
                                        name="city"
                                        placeholder="city"
                                        className="block text-sm py-3 px-4 rounded-lg w-full bg-customColor7 border border-gray-400 outline-teal-500"
                                        value={formik.values.city}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.city && formik.errors.city ? (
                                        <div className="text-red-600 text-sm">{formik.errors.city}</div>
                                    ) : null}
                                </div>
                                <div>
                                    <label htmlFor="pincode" className="block text-md font-medium text-gray-700">Pincode</label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        placeholder="Pincode"
                                        className="block text-sm py-3 px-4 rounded-lg w-full bg-customColor7 border border-gray-400 outline-teal-500"
                                        value={formik.values.pincode}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.pincode && formik.errors.pincode ? (
                                        <div className="text-red-600 text-sm">{formik.errors.pincode}</div>
                                    ) : null}
                                </div>
                                <div className="col-span-2">
                                    <label htmlFor="address" className="block text-md font-medium text-gray-700">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder="Address"
                                        className="block text-sm py-3 px-4 rounded-lg w-full bg-customColor7 border border-gray-400 outline-teal-500"
                                        value={formik.values.address}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.address && formik.errors.address ? (
                                        <div className="text-red-600 text-sm">{formik.errors.address}</div>
                                    ) : null}
                                </div>
                            </div>
                            <div className="flex justify-center ">
                            <button type="submit"
                                className="mt-8 bg-teal-600 text-white py-2 px-4 rounded hover:bg-gradient-to-r from-teal-500 to-gray-800">Save changes</button>
                           </div>  
                        </form>
                    </div>
                </div>

                </div>
            </div>
    </>
}