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
        className={`bg-gray-800 transform transition-opacity duration-500 ease-out ${
          fadeIn ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="bg-customColor7 overflow-hidden shadow-lg rounded-lg border">
          <div className="px-4 py-5 sm:px-6 bg-gray-700">
            <h3 className="text-lg leading-6 font-medium text-center text-white">
              Owner Details
            </h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-900">Full name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {owner.first_name} {owner.last_name}
                </dd>
              </div>
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-900">Email address</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {owner.email}
                </dd>
              </div>
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-900">Phone number</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {owner.phone}
                </dd>
              </div>
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-900">
                  Additional Phone number
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {owner.phone2}
                </dd>
              </div>
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-900">Id Proof</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <button
                    className="text-teal-500 font-semibold hover:underline"
                    onClick={() => handleShowImage(owner.id_proof)}
                  >
                    View Proof
                  </button>
                </dd>
              </div>
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-900">Venue License</dt>
                <dd className="mt-1 text-sm font-semibold text-gray-900 sm:mt-0 sm:col-span-2">
                  <button
                    className="text-teal-500 hover:underline"
                    onClick={() => handleShowImage(owner.venue.venue_license)}
                  >
                    View Licence
                  </button>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {showModal && (
        <ViewImageModal imageSrc={imageToShow} onClose={handleCloseModal} />
      )}
    </>
  );
}
