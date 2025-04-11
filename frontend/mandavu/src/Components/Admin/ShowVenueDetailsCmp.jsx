import { useState,useEffect } from "react";

export default function ShowVenueDetailsCmp({ owner }) {
    
    const [fadeIn, setFadeIn] = useState(false);

    const handleOpenPDF = (pdfUrl) => {
        window.open(pdfUrl, '_blank');
    };

    useEffect(() => {
        setFadeIn(true);
      }, []);



    return (
        <>

<div
        className={`transform transition-opacity duration-500 ease-out ${
          fadeIn ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          {/* Header with gradient background */}
          <div className="bg-gray-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Venue Details</h3>
              <div className="flex space-x-2">
                  {owner?.venue?.is_verified ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white  text-green-600">
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white  text-red-500">
                    Not Verified
                  </span>
                )}
              
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-5">
            {/* Basic Info Section */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-600 mb-4 pb-2 border-b border-gray-200">
                Basic Information
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-sm  text-gray-500">Convention Center</p>
                  <p className="text-lg font-medium text-gray-500">
                    {owner?.venue?.convention_center_name}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm  text-gray-500">Price</p>
                  <p className="text-lg font-medium text-gray-500">
                    ₹{owner?.venue?.price}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm  text-gray-500">Short Description</p>
                  <p className="text-lg font-medium text-gray-500">
                    {owner?.venue?.short_description}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Condition</p>
                  <p className="text-lg font-medium text-gray-500">
                    {owner?.venue?.condition}
                  </p>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
                Description
              </h4>
              <p className="text-gray-600 whitespace-pre-line p-2 bg-gray-100 rounded">
                * {owner?.venue?.description}
              </p>
            </div>

            {/* Capacity Section */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
                Capacity
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Dining Seats</p>
                  <p className="text-lg font-medium text-gray-500">
                    {owner?.venue?.dining_seat_count}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Auditorium Seats</p>
                  <p className="text-lg font-medium text-gray-500">
                    {owner?.venue?.auditorium_seat_count}
                  </p>
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
                Location
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-lg font-medium text-gray-500">
                    {owner?.venue?.address}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">City</p>
                  <p className="text-lg font-medium text-gray-500">
                    {owner?.venue?.city}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">District</p>
                  <p className="text-lg font-medium text-gray-500">
                    {owner?.venue?.district}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">State</p>
                  <p className="text-lg font-medium text-gray-500">
                    {owner?.venue?.state}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Pincode</p>
                  <p className="text-lg font-medium text-gray-500">
                    {owner?.venue?.pincode}
                  </p>
                </div>
              </div>
            </div>

            {/* Documents Section */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Documents
              </h4>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Terms and Conditions</p>
                  <button
                    onClick={() => handleOpenPDF(owner.venue.terms_and_conditions)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                    View Terms and Conditions
                  </button>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
            
        </>
    )
}
