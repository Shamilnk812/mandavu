import { CircularProgress } from "@mui/material";


export default function AddBookingPackageModal({ formik, isModalOpen, isAcSelected, handleCloseModal, setIsAcSelected, loading }) {
  if (!isModalOpen) return null;
  return (
    <>

      <div className="fixed inset-0 z-50 flex justify-center items-center">
        {/* Dark Background */}
        <div className="fixed inset-0 bg-black opacity-50"></div>

        {/* Modal Content */}
        <div className="relative bg-white rounded-lg p-8 shadow-lg w-full max-w-md">
          {/* Close Button */}
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={handleCloseModal}
          >
            &#x2715; {/* Close (X) Icon */}
          </button>

          <h2 className="text-xl font-semibold mb-4 text-center">
            Add New Package
          </h2>

          {/* Form */}
          <form onSubmit={formik.handleSubmit}>
            {/* Package Name with Suggestions */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Package Namejkjkjj
              </label>
              <select
                list="package-names"
                id="package_name"
                name="package_name"
                value={formik.values.package_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Type or select package name"
                className="w-full border border-gray-300 p-2 rounded-lg"

              >
                <option value="" disabled>Select a package</option>
                <option value="Conference Hall">Conference Hall</option>
                {/* <option value="Auditorium">Auditorium</option> */}
              </select>
              {formik.touched.package_name && formik.errors.package_name && (
                <div className="text-red-600 text-sm mt-1">
                  {formik.errors.package_name}
                </div>
              )}
            </div>

            {/* Price per Event */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Price (Per Event)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter price"
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
              {formik.touched.price && formik.errors.price && (
                <div className="text-red-600 text-sm mt-1">
                  {formik.errors.price}
                </div>
              )}
            </div>

            {/* Price per Hour or Not Allowed */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Price (Per Hour)
              </label>
              <input
                type="text"
                id="price_for_per_hour"
                name="price_for_per_hour"
                value={formik.values.price_for_per_hour}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter price per hour or 'Not Allowed'"
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
              {formik.touched.price_for_per_hour &&
                formik.errors.price_for_per_hour && (
                  <div className="text-red-600 text-sm mt-1">
                    {formik.errors.price_for_per_hour}
                  </div>
                )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Description
              </label>
              <textarea
                type="text"
                id="description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter package details"
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
              {formik.touched.description && formik.errors.description && (
                <div className="text-red-600 text-sm mt-1">
                  {formik.errors.description}
                </div>
              )}
            </div>

            {/* AC / Non-AC Radio Buttons */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Air Conditioning
              </label>
              <div className="flex items-center space-x-4">
                <label>
                  <input
                    type="radio"
                    name="air_condition"
                    value="AC"
                    checked={formik.values.air_condition === "AC"}
                    onChange={(e) => {
                      formik.handleChange(e);
                      setIsAcSelected(true);
                    }}
                    onBlur={formik.handleBlur}
                  />
                  <span className="ml-2">AC</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="air_condition"
                    value="Non-AC"
                    checked={formik.values.air_condition === "Non-AC"}
                    onChange={(e) => {
                      formik.handleChange(e);
                      setIsAcSelected(false);
                    }}
                    onBlur={formik.handleBlur}
                  />
                  <span className="ml-2">Non-AC</span>
                </label>
              </div>
              {formik.touched.air_condition &&
                formik.errors.air_condition && (
                  <div className="text-red-600 text-sm mt-1">
                    {formik.errors.air_condition}
                  </div>
                )}
            </div>

            {/* Extra Price for AC (Conditional) */}
            {isAcSelected && (
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Extra Price for AC
                </label>
                <input
                  type="number"
                  id="extra_price_for_aircondition"
                  name="extra_price_for_aircondition"
                  value={formik.values.extra_price_for_aircondition}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter extra AC charge"
                  className="w-full border border-gray-300 p-2 rounded-lg"
                />
                {formik.touched.extra_price_for_aircondition &&
                  formik.errors.extra_price_for_aircondition && (
                    <div className="text-red-600 text-sm mt-1">
                      {formik.errors.extra_price_for_aircondition}
                    </div>
                  )}
              </div>
            )}

            {/* Submit and Cancel Buttons */}
            <div className="mt-6 flex justify-end space-x-4">
              <button
                type="button"
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-500 transition-all duration-300"
                onClick={handleCloseModal} // Close modal on cancel
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-800 transition-all duration-300"
              >
                {loading ? (
                  <CircularProgress size={20} style={{ color: 'white' }} />
                ) : (
                  'Submit'
                )}

              </button>
            </div>
          </form>
        </div>
      </div>

    </>
  )
}