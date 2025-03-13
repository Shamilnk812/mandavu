import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import SignupStep1Schema from '../../Validations/Owner/RegisterStep1Schema';
import { axiosOwnerInstance } from '../../Utils/Axios/axiosInstance';
import PasswordVisibility from '../../Components/Common/PasswordVisibility';

export default function RegisterationStep1() {
  const navigate = useNavigate();
  const [showPassword1, setShowPassword1]  = useState(false);
  const [showPassword2, setShowPassword2]  =  useState(false);

  


  useEffect(()=> {
    const registrationData = JSON.parse(sessionStorage.getItem('registrationData')) || {};
    if (registrationData.step_1 === 'completed') {
      navigate('/owner/register-step-2'); // Redirect to Step 1
    }
  },[navigate])

  const formik = useFormik({
    initialValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      phone2: '',
      id_proof: null,
      password: '',
      password2: ''
    },
    validationSchema: SignupStep1Schema,
    onSubmit: async (values) => {
      if (values.id_proof) {
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64String = reader.result.split(',')[1];
          const formData = {
            ...values,
            id_proof: base64String,
           
          };
         

          handleRegistrationStep1(formData)
        };

        reader.readAsDataURL(values.id_proof);
      } else {
        toast.error('ID Proof is required');
      }
    },
  });


  const handleRegistrationStep1 = async (formData)=> {
    try{
      const response = await axiosOwnerInstance.post('registration-step1/', formData)
      const { registrationId } = response.data;
      console.log('reggg id is ',registrationId)
      sessionStorage.setItem(
        'registrationData',
        JSON.stringify({ ...registrationData, registrationId : registrationId, progress: '25%', step_1: 'completed' })
      );
    
      localStorage.setItem('email', formData.email);
      console.log('registre one form data',formData)
      
      toast.success('Step 1 is Completed');
      navigate('/owner/register-step-2');
    }catch (error) {
      console.error("Error response:", error.response); // Log the error for debugging
    const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
    toast.error(errorMessage); // Display error message in toast
    }

  }



  const registrationData = JSON.parse(sessionStorage.getItem('registrationData')) || {};
  const progress = registrationData.progress || '0%';

  const togglePasswordVisibility1 = ()=> {
    setShowPassword1((prev)=> !prev)
  }

  const togglePasswordVisibility2 = ()=> {
    setShowPassword2((prev)=> !prev)
  }

  return (
    <>
      <div className="min-h-screen bg-teal-600 flex justify-center items-center">
        {/* <div className="absolute w-60 h-60 rounded-xl bg-teal-500 -top-5 -left-16 z-0 transform rotate-45 hidden md:block"></div> */}
        <div className="py-8 px-4 sm:px-12 bg-white rounded-2xl shadow-xl z-20 w-full max-w-3xl">
          
        <div className="flex justify-center mb-6">
          <img
            src="/user/mandavu-logo.png"
            alt="Mandavu Logo"
            className="w-24 h-auto sm:w-32"
          />
        </div>

          <div>
            <h1 className="text-xl font-semibold text-center text-gray-700 mb-4 cursor-pointer">Create An Account</h1>
          </div>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name</label>
                <input 
                  type="text" 
                  id="first_name" 
                  name='first_name' 
                  value={formik.values.first_name} 
                  onChange={formik.handleChange} 
                  placeholder="Full Name" 
                  className="block text-sm py-3 px-4 rounded-lg w-full bg-white border border-gray-300 outline-teal-500" 
                />
                {formik.errors.first_name && formik.touched.first_name ? (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.first_name}</div>
                ) : null}
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name</label>
                <input 
                  type="text" 
                  id="last_name" 
                  name='last_name' 
                  value={formik.values.last_name} 
                  onChange={formik.handleChange} 
                  placeholder="Full Name" 
                  className="block text-sm py-3 px-4 rounded-lg w-full bg-white border border-gray-300 outline-teal-500" 
                />
                {formik.errors.last_name && formik.touched.last_name ? (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.last_name}</div>
                ) : null}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input 
                  type="text" 
                  id="email" 
                  name='email' 
                  value={formik.values.email} 
                  onChange={formik.handleChange} 
                  placeholder="Email Address" 
                  className="block text-sm py-3 px-4 rounded-lg w-full bg-white border border-gray-300 outline-teal-500" 
                />
                {formik.errors.email && formik.touched.email ? (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                ) : null}
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input 
                  type="text" 
                  id="phone" 
                  name='phone' 
                  value={formik.values.phone} 
                  onChange={formik.handleChange} 
                  placeholder="Phone Number" 
                  className="block text-sm py-3 px-4 rounded-lg w-full bg-white border border-gray-300 outline-teal-500" 
                />
                {formik.errors.phone && formik.touched.phone ? (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.phone}</div>
                ) : null}
              </div>
              <div>
                <label htmlFor="phone2" className="block text-sm font-medium text-gray-700">Additional Phone Number</label>
                <input 
                  type="text" 
                  id="phone2" 
                  name='phone2' 
                  value={formik.values.phone2} 
                  onChange={formik.handleChange} 
                  placeholder="Phone2 Number" 
                  className="block text-sm py-3 px-4 rounded-lg w-full bg-white border border-gray-300 outline-teal-500" 
                />
                {formik.errors.phone2 && formik.touched.phone2 ? (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.phone2}</div>
                ) : null}
              </div>
              
              <div>
                <label htmlFor="id_proof" className="block text-sm font-medium text-gray-700">ID Proof</label>
                <input 
                  type="file" 
                  id="id_proof" 
                  name='id_proof' 
                  onChange={(event) => formik.setFieldValue('id_proof', event.currentTarget.files[0])} 
                  className="block text-sm py-3 px-4 rounded-lg w-full bg-white border border-gray-300 outline-teal-500" 
                />
                {formik.errors.id_proof && formik.touched.id_proof ? (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.id_proof}</div>
                ) : null}
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <div className='relative'>
                <input 
                  type={showPassword1 ? "text" : "password"} 
                  id="password" 
                  name='password' 
                  value={formik.values.password} 
                  onChange={formik.handleChange} 
                  placeholder="Password" 
                  className="block text-sm py-3 px-4 rounded-lg w-full bg-white border border-gray-300 outline-teal-500" 
                />
                <PasswordVisibility showPassword={showPassword1} togglePasswordVisibility={togglePasswordVisibility1}/>
                </div>
                {formik.errors.password && formik.touched.password ? (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
                ) : null}
              </div>

              <div>
              
                <label htmlFor="password2" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <div className='relative'>
                <input 
                  type={showPassword2 ? "text" : "password"}
                  id="password2" 
                  name='password2' 
                  value={formik.values.password2} 
                  onChange={formik.handleChange} 
                  placeholder="Confirm Password" 
                  className="block text-sm py-3 px-4 rounded-lg w-full bg-white border border-gray-300 outline-teal-500" 
                />
                <PasswordVisibility showPassword={showPassword2} togglePasswordVisibility={togglePasswordVisibility2}/>
                </div>
                {formik.errors.password2 && formik.touched.password2 ? (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.password2}</div>
                ) : null}
              </div>
            </div>
            <div className="text-center mt-6">
              <button type='submit' className="w-24 py-2 mt-2  text-white bg-teal-600 rounded-lg hover:bg-teal-800 transition-all duration-300">Next</button>
               <p className="mt-4 text-sm">Already Have An Account? <span className="underline cursor-pointer ml-1 text-teal-600"><Link to={'/owner/login'}>Login</Link></span></p>
            </div>
                 
            <div className="w-full bg-gray-200 rounded-full">
              <div className={`bg-teal-500 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full`} style={{ width: progress }}> {progress}</div>
            </div>
          </form>
        </div>
        {/* <div className="w-40 h-40 absolute bg-teal-500 rounded-full top-0 right-12 hidden md:block"></div>
        <div className="w-20 h-40 absolute bg-teal-500 rounded-full bottom-20 left-10 transform rotate-45 hidden md:block"></div> */}
      </div>
    </>
  );
}
