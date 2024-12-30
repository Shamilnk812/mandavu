import { motion } from 'framer-motion';
import FooterCmp from "../../Components/User/Footer";
import Navb from "../../Components/User/Navb";
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import SendIcon from '@mui/icons-material/Send';
import { useFormik } from "formik"
import ContactUsFormSchema from "../../Validations/User/ContactUsFormSchema";
import { axiosUserInstance } from "../../Utils/Axios/axiosInstance";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useState } from "react";
import { CircularProgress } from "@mui/material";



export default function ContactUs() {


    const userId = useSelector((state) => state.user.user?.id)
    const [loading, setLoading] = useState(false)

    const scrollVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" },
        },
    };

    const formik = useFormik({
        initialValues: {
            user_name: "",
            email: "",
            message: "",
        },
        validationSchema: ContactUsFormSchema,
        onSubmit: async (values) => {
            setLoading(true)
            console.log("Form submitted with these values:", values);
            try {

                await axiosUserInstance.post(`user-inquiry/${userId}/`, values)
                toast.success("Your message has been sent successfully. We will get back to you soon")
                formik.resetForm()
            }
            catch (error) {
                console.error("An error occurred:", error)
                toast.error("Something went wrong. Please try again later.")
            } finally {
                setLoading(false)
            }
        },
    });


    return (
        <>
            <Navb />

            <motion.div
                className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
                initial="hidden"
                whileInView="visible"
                variants={scrollVariants}
                viewport={{ once: true }}
            >
                <motion.div
                    className="max-w-4xl w-full bg-white shadow-xl border rounded-lg p-8"
                    initial="hidden"
                    whileInView="visible"
                    variants={scrollVariants}
                    viewport={{ once: true }}
                >
                    <h1 className="text-2xl font-semibold text-gray-600 text-center border-b border-gray-300 pb-3 mb-4">Contact Us</h1>
                    <p className="text-gray-600 text-center mb-8">
                        We’re here to assist you! Whether you have questions about our venues, need support with bookings, or want to provide feedback, feel free to reach out.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Contact Information */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-gray-700">Our Office</h2>
                            <p className="text-gray-600">
                                Mandavu Headquarters<br />
                                123 Event Plaza, Second City<br />
                                Kerala, India, 898989
                            </p>
                            <p className="text-gray-600">
                                <strong>Phone:</strong> +91 99999 99998
                            </p>
                            <p className="text-gray-600">
                                <strong>Email:</strong> support@mandavu.com
                            </p>
                        </div>

                        {/* Contact Form */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">Get in Touch</h2>
                            <form onSubmit={formik.handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 mb-1" htmlFor="name">Your Name</label>
                                    <input
                                        type="text"
                                        id="user_name"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-teal-600 focus:border-teal-600"
                                        placeholder="Enter your name"
                                        value={formik.values.user_name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.errors.user_name && formik.touched.user_name ? (
                                        <div className="text-red-500 text-sm">{formik.errors.user_name}</div>
                                    ) : null}
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-1" htmlFor="email">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-teal-600 focus:border-teal-600"
                                        placeholder="Enter your email"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.errors.email && formik.touched.email ? (
                                        <div className="text-red-500 text-sm">{formik.errors.email}</div>
                                    ) : null}
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-1" htmlFor="message">Message</label>
                                    <textarea
                                        id="message"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-teal-600 focus:border-teal-600"
                                        rows="5"
                                        placeholder="Enter your message"
                                        value={formik.values.message}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    ></textarea>
                                    {formik.errors.message && formik.touched.message ? (
                                        <div className="text-red-500 text-sm">{formik.errors.message}</div>
                                    ) : null}
                                </div>
                                <div className="text-center">
                                    <button
                                        type="submit"
                                        className={`bg-teal-600  text-white py-2 px-6 rounded-lg shadow-lg hover:bg-teal-800 transition-all duration-300 ${loading ? 'cursor-not-allowed opacity-70' : ''}`}
                                    >
                                        {loading ? (
                                            <CircularProgress size={20} style={{ color: 'white' }} />
                                        ) : (
                                            <>
                                                <SendIcon className="mr-1" /> Send Message
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <h2 className="text-lg font-semibold text-gray-600">Follow Us</h2>
                        <p className="text-gray-600">Stay connected through our social media channels.</p>
                        <div className="flex justify-center space-x-4 mt-4">
                            <a href="" className="text-teal-700 hover:text-teal-800">
                                <FacebookIcon />
                            </a>
                            <a href="" className="text-teal-700 hover:text-teal-800">
                                <TwitterIcon />
                            </a>
                            <a href="" className="text-teal-700 hover:text-teal-800">
                                <InstagramIcon />
                            </a>
                        </div>
                    </div>
                </motion.div>
            </motion.div>


            <FooterCmp />


        </>
    )
}