import { useState, useEffect } from "react";
import ViewImageModal from "../Owner/ViewImageModal";

export default function ShowOwnerDetailsCmp({ owner }) {
  const [showModal, setShowModal] = useState(false);
  const [imageToShow, setImageToShow] = useState('');
  const [fadeIn, setFadeIn] = useState(false); // State for controlling fade-in effect

  useEffect(() => {
    // Trigger the fade-in effect when the component renders
    setFadeIn(true);
  }, []);

  const handleShowImage = (imageUrl) => {
    setImageToShow(imageUrl);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setImageToShow('');
  };

  return (
    <>
      <div
        className={`transform transition-opacity duration-500 ease-out ${fadeIn ? 'opacity-100' : 'opacity-0'
          }`}
      >
        <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100">
          {/* Header with gradient background */}
          {/* <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5"> */}
          <div className="bg-gray-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Owner Profile</h3>
              <div className="flex space-x-2">
                {owner.is_active ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white  text-green-600">
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white  text-red-500">
                    Not Active
                  </span>
                )}
              </div>
            </div>
          </div>

         
          <div className="px-6 py-5">
            {/* Personal Info Section */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Personal Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="text-lg font-semibold text-gray-600">
                    {owner.first_name} {owner.last_name}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-lg font-medium text-gray-600 break-all">
                    {owner.email}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm  text-gray-500">Primary Phone</p>
                  <p className="text-lg font-medium text-gray-600">
                    {owner.phone}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm  text-gray-500">Secondary Phone</p>
                  <p className="text-lg font-medium text-gray-600">
                    {owner.phone2 || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>

            {/* Documents Section */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Documents
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">ID Proof</p>
                  <button
                    onClick={() => handleShowImage(owner.id_proof)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    View ID Proof
                  </button>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Venue License</p>
                  <button
                    onClick={() => handleShowImage(owner.venue.venue_license)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                    View License
                  </button>
                </div>
              </div>
            </div>
          </div>         

        </div>
      </div>

      {showModal && (
        <ViewImageModal imageSrc={imageToShow} onClose={handleCloseModal} />
      )}
    </>
  );
}



