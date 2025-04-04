import React, { version } from 'react';
import { useFormik } from 'formik';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../../Utils/ImageCropping/CroppingImage';
import RegisterationStep2Schema from '../../Validations/Owner/RegisterStep2Schema';
import { axiosOwnerInstance } from '../../Utils/Axios/axiosInstance';
import { CircularProgress } from "@mui/material";



export default function RegisterationStep2() {

  const navigate = useNavigate();
  const [selectedImages, setSelectedImages] = useState([]);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [cropping, setCropping] = useState(false);
  const [showExtraPrice, setShowExtraPrice] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);


  const registrationData = JSON.parse(sessionStorage.getItem('registrationData')) || {};
  //  const registrationData = JSON.parse(sessionStorage.getItem('registrationData')) || {};
  const progress = registrationData.progress;
  const tempVenueId = registrationData.registrationId;





  useEffect(() => {
    const registrationData = JSON.parse(sessionStorage.getItem('registrationData')) || {};

    if (!registrationData || registrationData.step_1 !== 'completed') {
      toast.error('Please complete Step 1 first.');
      navigate('/owner/register-step-1'); // Redirect to Step 1
    }
  }, [navigate]);

  useEffect(() => {
    const registrationData = JSON.parse(sessionStorage.getItem('registrationData')) || {};
    if (registrationData.step_2 === 'completed') {
      navigate('/owner/register-step-3'); // Redirect to Step 1
    }
  }, [navigate])


  const handleImageChange = (event) => {
    const files = Array.from(event.currentTarget.files);
    const newImage = files[0];
    if (newImage) {
      setCurrentImage(URL.createObjectURL(newImage));
      setCropping(true);
    }
  };

  const handleCropComplete = async () => {
    const croppedImage = await getCroppedImg(currentImage, croppedAreaPixels);
    setSelectedImages((prevImages) => [...prevImages, croppedImage]);
    formik.setFieldValue('venue_images', [...selectedImages, croppedImage]);
    setCropping(false);
  };

  const handleFileRead = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };



  const handleCancel = async () => {
    setCancelLoading(true);
    try {

      const response = await axiosOwnerInstance.delete(`cancel-registration/${tempVenueId}`)
      sessionStorage.removeItem('registrationData'); // Remove registration data from sessionStorage
      toast.success("Registration Cancelled.")
      navigate('/owner/register-step-1'); // Navigate to the owner signup page

    } catch (error) {
      console.error(error)
      toast.error("Failed to cancel registration. Please try again later.")
    }finally{
      setCancelLoading(false);
    }

  };



  const formik = useFormik({
    initialValues: {
      convention_center_name: '',
      short_description: '',
      description: '',
      dining_seat_count: '',
      auditorium_seat_count: '',
      condition: '',
      extra_ac_price: '',
      price: '',
      venue_images: [],
      venue_license: null,
      terms_conditions: null,
      state: '',
      district: '',
      city: '',
      pincode: '',
      address: '',
    },
    validationSchema: RegisterationStep2Schema,
    onSubmit: async (values) => {
      try {
        const existingData = JSON.parse(sessionStorage.getItem('registrationData')) || {};

        const [venue_license, terms_conditions] = await Promise.all([
          values.venue_license ? handleFileRead(values.venue_license) : null,
          values.terms_conditions ? handleFileRead(values.terms_conditions) : null,
        ]);

        const base64Images = await Promise.all(
          values.venue_images.map(file => handleFileRead(file))
        );

        const combinedData = {
          // ...existingData,
          ...values,
          venue_license,
          terms_conditions,
          venue_images: base64Images,
          // progress: '50%',       
          // step_2: 'completed'   

        };

        handleRegistrationStep2(combinedData)

        // sessionStorage.setItem('registrationData', JSON.stringify(combinedData));
        // toast.success('Step 2 is Completed');
        // navigate('/owner/register-step-3');
      } catch (error) {
        console.error(error)
        toast.error('An error occurred while processing files');
      }
    },
  });


  const handleConditionChange = (e) => {
    const value = e.target.value;
    formik.setFieldValue('condition', value);
    setShowExtraPrice(value === 'AC' || value === 'Both'); // Show input for "AC" or "Both"
    if (!showExtraPrice) {
      formik.setFieldValue('extra_ac_price', '');
    }
  };




  const handleRegistrationStep2 = async (formData) => {
    setIsLoading(true);
    try {
      const registrationData = JSON.parse(sessionStorage.getItem('registrationData')) || {};
      const tempVenueId = registrationData.registrationId;
      const response = await axiosOwnerInstance.post(`registration-step2/${tempVenueId}/`, formData)
      const { registrationId } = response.data;
      console.log('reggg id is step 2 ', registrationId)

      sessionStorage.setItem('registrationData', JSON.stringify({
        ...registrationData, registrationId: registrationId, progress: '50%',
        step_2: 'completed'
      }));
      toast.success('Step 2 is Completed');
      navigate('/owner/register-step-3');

    } catch (error) {

      console.error("Error response:", error.response); // Log the error for debugging
      const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
      toast.error(errorMessage); // Display error message in toast
    } finally {
      setIsLoading(false);
    }
  }




  return (
    <div className="min-h-screen bg-teal-600 flex justify-center items-center py-20">
      <div className="py-8 px-4 sm:px-12 bg-white rounded-2xl shadow-xl z-20 w-full max-w-3xl">

        <div className="flex justify-center mb-6">
          <img
            src="/user/mandavu-logo.png"
            alt="Mandavu Logo"
            className="w-24 h-auto sm:w-32"
          />
        </div>

        <h1 className="text-xl font-semibold text-center text-gray-700 mb-6">Venue Registration</h1>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label htmlFor="convention_center_name" className="block text-sm font-medium text-gray-700">
                Convention Center Name
              </label>
              <input
                id="convention_center_name"
                type="text"
                name="convention_center_name"
                value={formik.values.convention_center_name}
                onChange={formik.handleChange}
                placeholder="Convention Center Name"
                className="block text-sm py-3 px-4 rounded-lg w-full bg-white border border-gray-300 outline-teal-500"
              />
              {formik.errors.convention_center_name && formik.touched.convention_center_name ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.convention_center_name}</div>
              ) : null}
            </div>
            <div>
              <label htmlFor="short_description" className="block text-sm font-medium text-gray-700">
                Short Description
              </label>
              <input
                id="short_description"
                type="text"
                name="short_description"
                value={formik.values.short_description}
                onChange={formik.handleChange}
                placeholder="Short Description"
                className="block text-sm py-3 px-4 rounded-lg w-full bg-white border border-gray-300 outline-teal-500"
              />
              {formik.errors.short_description && formik.touched.short_description ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.short_description}</div>
              ) : null}
            </div>
            <div className="col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                placeholder="Description"
                className="block text-sm py-3 px-4 rounded-lg w-full bg-white border border-gray-300 outline-teal-500"
              />
              {formik.errors.description && formik.touched.description ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.description}</div>
              ) : null}
            </div>
            <div>
              <label htmlFor="dining_seat_count" className="block text-sm font-medium text-gray-700">
                Dining Seat Count
              </label>
              <input
                id="dining_seat_count"
                type="number"
                name="dining_seat_count"
                value={formik.values.dining_seat_count}
                onChange={formik.handleChange}
                placeholder="Dining Seat Count"
                className="block text-sm py-3 px-4 rounded-lg w-full bg-white border border-gray-300 outline-teal-500"
              />
              {formik.errors.dining_seat_count && formik.touched.dining_seat_count ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.dining_seat_count}</div>
              ) : null}
            </div>
            <div>
              <label htmlFor="auditorium_seat_count" className="block text-sm font-medium text-gray-700">
                Auditorium Seat Count
              </label>
              <input
                id="auditorium_seat_count"
                type="number"
                name="auditorium_seat_count"
                value={formik.values.auditorium_seat_count}
                onChange={formik.handleChange}
                placeholder="Auditorium Seat Count"
                className="block text-sm py-3 px-4 rounded-lg w-full bg-white border border-gray-300 outline-teal-500"
              />
              {formik.errors.auditorium_seat_count && formik.touched.auditorium_seat_count ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.auditorium_seat_count}</div>
              ) : null}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Condition</label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="condition"
                    value="AC"
                    onChange={handleConditionChange}
                    className="mr-2"
                  />
                  <label htmlFor="condition" className="text-sm">AC</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="condition"
                    value="Non AC"
                    onChange={handleConditionChange}
                    className="mr-2"
                  />
                  <label htmlFor="condition" className="text-sm">Non AC</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="condition"
                    value="Both"
                    onChange={handleConditionChange}
                    className="mr-2"
                  />
                  <label htmlFor="condition" className="text-sm">Both</label>
                </div>
              </div>
              {formik.errors.condition && formik.touched.condition ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.condition}</div>
              ) : null}
            </div>

            {showExtraPrice && (
              <div>
                <label htmlFor="extra_ac_price" className="block text-sm font-medium text-gray-700">
                  Extra Price for AC
                </label>
                <input
                  id="extra_ac_price"
                  type="number"
                  name="extra_ac_price"
                  value={formik.values.extra_ac_price}
                  onChange={formik.handleChange}
                  placeholder="Extra Price for AC"
                  className="block text-sm py-3 px-4 rounded-lg w-full bg-white border border-gray-300 outline-teal-500"
                />
                {formik.errors.extra_ac_price && formik.touched.extra_ac_price ? (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.extra_ac_price}</div>
                ) : null}
              </div>
            )}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                id="price"
                type="number"
                name="price"
                value={formik.values.price}
                onChange={formik.handleChange}
                placeholder="price"
                className="block text-sm py-3 px-4 rounded-lg w-full bg-white border border-gray-300 outline-teal-500"
              />
              {formik.errors.price && formik.touched.price ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.price}</div>
              ) : null}
            </div>


            <div className='col-span-2'>
              <label htmlFor="venue_images" className="block text-sm font-medium text-gray-700">
                Venue Images <span className='text-gray-400'>(Supports JPEG & PNG) </span>
              </label>
              <input
                id="venue_images"
                type="file"
                name="venue_images"
                accept="image/jpeg, image/png"
                onChange={handleImageChange}
                multiple
                className="block text-sm py-3 px-4 rounded-lg w-full bg-white border border-gray-300 outline-teal-500"
              />
              {formik.errors.venue_images && formik.touched.venue_images ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.venue_images}</div>
              ) : null}
              {cropping && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex flex-col justify-center">

                  <div className="flex items-center justify-center">
                    <div className="relative w-96 h-96 bg-white p-4 rounded-lg flex flex-col justify-between">
                      <div className="flex-grow">
                        <Cropper
                          image={currentImage}
                          crop={crop}
                          zoom={zoom}
                          aspect={4 / 3} // Adjust the aspect ratio to your needs
                          onCropChange={setCrop}
                          onZoomChange={setZoom}
                          onCropComplete={(croppedArea, croppedAreaPixels) => {
                            setCroppedAreaPixels(croppedAreaPixels);
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-center space-x-2">
                    <button
                      type="button"
                      onClick={handleCropComplete}
                      className="bg-teal-500 text-white px-4 py-2 rounded-lg"
                    >
                      Crop
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCropping(false)
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>

                </div>
              )}

              <div className="mt-4">
                {selectedImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-4">
                    {selectedImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Selected ${index + 1}`}
                          className="w-full h-auto object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = selectedImages.filter((_, i) => i !== index);
                            setSelectedImages(newImages);
                            formik.setFieldValue('venue_images', newImages);
                          }}
                          className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="venue_license" className="block text-sm font-medium text-gray-700">
                Venue License <span className='text-gray-400'>(Supports JPEG & PNG) </span>
              </label>
              <input
                id="venue_license"
                type="file"
                name="venue_license"
                accept="image/jpeg, image/png"
                onChange={(event) => formik.setFieldValue('venue_license', event.currentTarget.files[0])}
                className="block text-sm py-3 px-4 rounded-lg w-full bg-white border border-gray-300 outline-teal-500"
              />
              {formik.errors.venue_license && formik.touched.venue_license ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.venue_license}</div>
              ) : null}
            </div>
            <div>
              <label htmlFor="terms_conditions" className="block text-sm font-medium text-gray-700">
                Terms & Conditions <span className='text-gray-400'>(Supports PDF) </span>
              </label>
              <input
                id="terms_conditions"
                type="file"
                name="terms_conditions"
                onChange={(event) => formik.setFieldValue('terms_conditions', event.currentTarget.files[0])}
                className="block text-sm py-3 px-4 rounded-lg w-full bg-white border border-gray-300 outline-teal-500"
              />
              {formik.errors.terms_conditions && formik.touched.terms_conditions ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.terms_conditions}</div>
              ) : null}
            </div>

          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                id="state"
                type="text"
                name="state"
                value={formik.values.state}
                onChange={formik.handleChange}
                placeholder="State"
                className="block text-sm py-3 px-4 rounded-lg w-full bg-white border border-gray-300 outline-teal-500"
              />
              {formik.errors.state && formik.touched.state ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.state}</div>
              ) : null}
            </div>
            <div>
              <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                District
              </label>
              <input
                id="district"
                type="text"
                name="district"
                value={formik.values.district}
                onChange={formik.handleChange}
                placeholder="District"
                className="block text-sm py-3 px-4 rounded-lg w-full bg-white border border-gray-300 outline-teal-500"
              />
              {formik.errors.district && formik.touched.district ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.district}</div>
              ) : null}
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                id="city"
                type="text"
                name="city"
                value={formik.values.city}
                onChange={formik.handleChange}
                placeholder="City"
                className="block text-sm py-3 px-4 rounded-lg w-full bg-white border border-gray-300 outline-teal-500"
              />
              {formik.errors.city && formik.touched.city ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.city}</div>
              ) : null}
            </div>
            <div>
              <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
                Pincode
              </label>
              <input
                id="pincode"
                type="text"
                name="pincode"
                value={formik.values.pincode}
                onChange={formik.handleChange}
                placeholder="Pincode"
                className="block text-sm py-3 px-4 rounded-lg w-full bg-white border border-gray-300 outline-teal-500"
              />
              {formik.errors.pincode && formik.touched.pincode ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.pincode}</div>
              ) : null}
            </div>
            <div className="col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Full Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                placeholder="Full Address"
                className="block text-sm py-3 px-4 rounded-lg w-full bg-white border border-gray-300 outline-teal-500"
              />
              {formik.errors.address && formik.touched.address ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.address}</div>
              ) : null}
            </div>
          </div>
          <div className='flex justify-center gap-4'>
            <button 
              type="button" 
              onClick={handleCancel} 
              disabled={cancelLoading || isLoading}
              className={`mt-6 w-24 bg-red-600 text-white py-2 rounded-lg hover:bg-red-800 transition-colors duration-300 ease-in-out hover:shadow-lg ${cancelLoading || isLoading ? 'cursor-not-allowed opacity-70' : ''}`}>
              {cancelLoading ? (
                <CircularProgress size={20} style={{ color: 'white' }} />
              ) : (
                'Cancel'
              )}
            </button>

            <button
              type="submit"
              disabled={isLoading || cancelLoading}
              className={`mt-6 w-24 bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-800 transition-colors duration-300 ease-in-out hover:shadow-lg ${isLoading || cancelLoading ? 'cursor-not-allowed opacity-70' : ''}`}>
              {isLoading ? (
                <CircularProgress size={20} style={{ color: 'white' }} />
              ) : (
                'Next'
              )}
            </button>
          </div>
          <div>
            <p className='text-center mb-4'>4 step Registraion</p>
            <div className="w-full bg-gray-200 rounded-full">
              <div className={`bg-teal-500 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full`} style={{ width: progress }}> {progress}</div>
            </div>
          </div>
        </form>
      </div>

    </div>
  );
}
