import { useSelector } from "react-redux"
import axios from "axios"
import { useFormik } from "formik"
import VenueRegisterSchema from "../../Validations/Owner/VenueRegisterSchema"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';


export default function VenueRegister() {
    
    const navigate = useNavigate()
    const ownerId = useSelector((state) => state.owner.owner?.id); // Correctly access the owner ID from Redux state
    console.log('ownerid',ownerId)
    const formik = useFormik({
        initialValues:{
            name:'',
            email:'',
            description:'',
            phone:'',
            price:'',
            dining_seat_count :'',
            auditorium_seat_count:'',
            condition:'',
            state:'',
            district:'',
            pincode:'',
            address:''
        },validationSchema:VenueRegisterSchema,
        onSubmit: async (values) => {
          try{
            const formData ={
              ...values,
              owner:ownerId
            }
            console.log("this is form data",formData)
            const response = await axios.post('http://127.0.0.1:8000/api/v2/auth/register-venue/',formData)
            console.log(response.data)
            toast.success('Your Venue successfully registerd')
            navigate('/owner/success-register')
          }catch(errors) {
            toast.error('')
          }
        }
    })
    return(
        <>

  
  <div className="flex flex-col flex-1 ml-64 mt-14 bg-customColor7 min-h-screen">
      <div className="p-10">
        <div>
        <h3 className="text-2xl font-semibold text-center text-white py-3 rounded-tl-lg rounded-tr-lg bg-gradient-to-r from-teal-500 to-gray-800">Register Your Venue</h3>
        </div>
        <div className="bg-customColor8 px-12  py-10 rounded-bl-lg rounded-br-lg">
        <div className=" p-8 ">
          <form className="space-y-4" onSubmit={formik.handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="name" className="block text-md font-medium text-gray-700">Convention Center Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Convention Center Name"
                  className="block text-sm py-3 px-4 rounded-lg w-full bg-customColor7 border border-gray-400 outline-teal-500"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.name && formik.errors.name ? (
                  <div className="text-red-600 text-sm">{formik.errors.name}</div>
                ) : null}
              </div>
              <div>
                <label htmlFor="email" className="block text-md font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="block text-sm py-3 px-4 rounded-lg w-full bg-customColor7 border border-gray-400 outline-teal-500"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-red-600 text-sm">{formik.errors.email}</div>
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
                <label htmlFor="phone" className="block text-md font-medium text-gray-700">Phone</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  className="block text-sm py-3 px-4 rounded-lg w-full bg-customColor7 border border-gray-400 outline-teal-500"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.phone && formik.errors.phone ? (
                  <div className="text-red-600 text-sm">{formik.errors.phone}</div>
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
                <label className="block text-md font-medium text-gray-700">Condition</label>
                <div className="flex items-center space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="condition"
                      value="AC"
                      className="form-radio"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      checked={formik.values.condition === 'AC'}
                    />
                    <span className="ml-2">AC</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="condition"
                      value="Non-AC"
                      className="form-radio"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      checked={formik.values.condition === 'Non-AC'}
                    />
                    <span className="ml-2">Non-AC</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="condition"
                      value="Both"
                      className="form-radio"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      checked={formik.values.condition === 'Both'}
                    />
                    <span className="ml-2">Both</span>
                  </label>
                </div>
                {formik.touched.condition && formik.errors.condition ? (
                  <div className="text-red-600 text-sm">{formik.errors.condition}</div>
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
                <textarea
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
            <div className="flex justify-center">
              <button
                type="submit"
                className="mt-2 bg-teal-600 text-white mt-6 py-2 px-4 rounded hover:bg-gradient-to-r from-teal-500 to-gray-800"              >
                Register Venue
              </button>
            </div>
          </form>
        </div>



        </div>

      </div>
    </div>
        </>
    )
}