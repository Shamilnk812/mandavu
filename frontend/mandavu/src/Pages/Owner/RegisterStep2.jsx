import React, { version } from 'react';
import { useFormik } from 'formik';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useState,useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../../Utils/ImageCropping/CroppingImage';
import RegisterationStep2Schema from '../../Validations/Owner/RegisterStep2Schema';



export default function RegisterationStep2() {

  const navigate = useNavigate();
  const [selectedImages, setSelectedImages] = useState([]);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [cropping, setCropping] = useState(false);



  useEffect(() => {
    const registrationData = JSON.parse(sessionStorage.getItem('registrationData')) || {};

    if (!registrationData || registrationData.step_1 !== 'completed') {
      toast.error('Please complete Step 1 first.');
      navigate('/owner/register-step-1'); // Redirect to Step 1
    }
  }, [navigate]);

  useEffect(()=> {
    const registrationData = JSON.parse(sessionStorage.getItem('registrationData')) || {};
    if (registrationData.step_2 === 'completed') {
      navigate('/owner/register-step-3'); // Redirect to Step 1
    }
  },[navigate])


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
  
  const handleCancel = () => {
    sessionStorage.removeItem('registrationData'); // Remove registration data from sessionStorage
    navigate('/owner/signup'); // Navigate to the owner signup page
  };

  const formik = useFormik({
    initialValues: {
      convention_center_name: '',
      short_description: '',
      description: '',
      dining_seat_count: '',
      auditorium_seat_count: '',
      condition: '',
      price:'',
      venue_images: [],
      venue_license: null,
      terms_conditions: null,
      state: '',
      district: '',
      city: '',
      pincode: '',
      full_address: '',
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
            ...existingData,
            ...values,
            venue_license,
            terms_conditions,
            venue_images : base64Images,
            progress: '50%',       
            step_2: 'completed'   

          };
  
          sessionStorage.setItem('registrationData', JSON.stringify(combinedData));
          toast.success('Step 2 is Completed');
          navigate('/owner/register-step-3');
        } catch (error) {
          console.error(error)
          toast.error('An error occurred while processing files');
        }
      },
    });


     const registrationData = JSON.parse(sessionStorage.getItem('registrationData')) || {};
     const progress = registrationData.progress;
    
  return (
    <div className="min-h-screen bg-teal-600 flex justify-center items-center py-20">
      <div className="absolute w-60 h-60 rounded-xl bg-teal-500 -top-5 -left-16 z-0 transform rotate-45 hidden md:block"></div>
      <div className="pb-12 pt-6 px-12 bg-white rounded-2xl shadow-xl z-20 w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-6">Venue Registration</h1>
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
                    onChange={formik.handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="condition" className="text-sm">AC</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="condition"
                    value="Non AC"
                    onChange={formik.handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="condition" className="text-sm">Non AC</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="condition"
                    value="Both"
                    onChange={formik.handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="condition" className="text-sm">Both</label>
                </div>
              </div>
              {formik.errors.condition && formik.touched.condition ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.condition}</div>
              ) : null}
            </div>
            
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                price
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
                Venue Images
            </label>
            <input
                id="venue_images"
                type="file"
                name="venue_images"
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
                Venue License
              </label>
              <input
                id="venue_license"
                type="file"
                name="venue_license"
                onChange={(event) => formik.setFieldValue('venue_license', event.currentTarget.files[0])}
                className="block text-sm py-3 px-4 rounded-lg w-full bg-white border border-gray-300 outline-teal-500"
              />
              {formik.errors.venue_license && formik.touched.venue_license ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.venue_license}</div>
              ) : null}
            </div>
            <div>
              <label htmlFor="terms_conditions" className="block text-sm font-medium text-gray-700">
                Terms & Conditions
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
              <label htmlFor="full_address" className="block text-sm font-medium text-gray-700">
                Full Address
              </label>
              <textarea
                id="full_address"
                name="full_address"
                value={formik.values.full_address}
                onChange={formik.handleChange}
                placeholder="Full Address"
                className="block text-sm py-3 px-4 rounded-lg w-full bg-white border border-gray-300 outline-teal-500"
              />
              {formik.errors.full_address && formik.touched.full_address ? (
                <div className="text-red-500 text-sm mt-1">{formik.errors.full_address}</div>
              ) : null}
            </div>
          </div>
          <div className='flex justify-center gap-4'>
          <button type="button"  onClick={handleCancel} className="mt-6 w-24 bg-red-600 text-white py-2 rounded-lg hover:bg-red-800 transition-colors duration-300 ease-in-out hover:shadow-lg">
            Cancel
          </button>
          <button type="submit" className="mt-6 w-24 bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-800 transition-colors duration-300 ease-in-out hover:shadow-lg">
            Next
          </button>
          </div>
          <div>
          <p className='text-center mb-4'>Fout step Registraion</p>
          <div className="w-full bg-gray-200 rounded-full">
              <div className={`bg-teal-500 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full`} style={{ width: progress }}> {progress}</div>
            </div>
            </div>  
        </form>
      </div>
      <div className="w-40 h-40 absolute bg-teal-500 rounded-full top-0 right-12 hidden md:block"></div>
      <div className="w-20 h-40 absolute bg-teal-500 rounded-full bottom-20 left-10 transform rotate-45 hidden md:block"></div>
    </div>
  );
}