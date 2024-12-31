
export default function SetUserLocationModal({ isOpen }) {

    if (!isOpen) return null;


    return (

        <>

<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
          {/* Header Section */}
          <div className="text-center mb-6">
            <img
              src="/user/location_img.jpeg"
              alt="Enable location"
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-gray-200"
            />
            <h2 className="text-xl font-semibold text-gray-800">
              Location Access Required
            </h2>
          </div>

          {/* Message Section */}
          <p className="text-gray-600 text-sm text-center mb-6">
            Location access is needed to show nearby venues. Please enable location services in your browser or device settings.
          </p>

        </div>
      </div>
        </>
    )
}