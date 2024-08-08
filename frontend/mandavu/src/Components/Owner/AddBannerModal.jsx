import { useFormik } from "formik";
import AddBannerSchema from "../../Validations/Owner/AddBannerSchema";

export default function AddBannerModal({ handleCloseModal, handleAddBanner }) {
    const formik = useFormik({
        initialValues: {
            venue_photo: null,
            name: '',
        },
        validationSchema: AddBannerSchema,
        onSubmit: (values) => {
            handleAddBanner(values);
            handleCloseModal();
        },
    });

    const handleImageChange = (event) => {
        formik.setFieldValue('venue_photo', event.currentTarget.files[0]);
    };

    return (
        <div id="authentication-modal" tabIndex="-1" className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden">
            <div className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative bg-teal-800 rounded-lg shadow dark:bg-teal-800">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Add Banner
                        </h3>
                        <button
                            type="button"
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={handleCloseModal}
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
                                <label htmlFor="venue_photo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Upload Image</label>
                                <input
                                    type="file"
                                    name="venue_photo"
                                    id="venue_photo"
                                    className="bg-customColor7 border border-teal-500 text-gray-900 text-sm rounded-lg  block w-full p-2.5 dark:bg-customColor7 dark:border-teal-500 dark:placeholder-teal-500 dark:text-gray-800"
                                    onChange={handleImageChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.venue_photo && formik.errors.venue_photo ? (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.venue_photo}</div>
                                ) : null}
                            </div>
                            <div>
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Banner Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    className="bg-customColor7 border border-teal-500 text-gray-900 text-sm rounded-lg  block w-full p-2.5 dark:bg-customColor7 dark:border-teal-500 dark:placeholder-teal-500 dark:text-gray-800"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.name}
                                />
                                {formik.touched.name && formik.errors.name ? (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
                                ) : null}
                            </div>
                            <div className="flex justify-center pt-4">
                                <button type="submit"                         
                                className="mt-2 bg-teal-600 text-white py-2 px-4 rounded hover:bg-gradient-to-r from-teal-500 to-gray-800"                    
                                >+ Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
