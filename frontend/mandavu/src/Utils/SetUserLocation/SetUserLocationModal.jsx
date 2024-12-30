
export default function SetUserLocationModal({ isOpen }) {

    if (!isOpen) return null;


    return (

        <>

<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
          {/* Header Section */}
          <div className="text-center mb-6">
            <img
              src="/user/banner1.jpg"
              alt="Enable location"
              className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-4 border-gray-200"
            />
            <h2 className="text-xl font-semibold text-gray-800">
              Location Access Required
            </h2>
          </div>

          {/* Message Section */}
          <p className="text-gray-600 text-sm text-center mb-6">
            Location access is needed to show nearby venues. Please enable location services in your browser or device settings.
          </p>

          {/* Action Button */}
          {/* <div className="flex justify-center gap-4">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
              onClick={() => alert('Location enabled!')}
            >
              Enable Location
            </button>
            <button
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-300"
              onClick={() => alert('Action canceled.')}
            >
              Cancel
            </button>
          </div> */}
        </div>
      </div>
        </>
    )
}