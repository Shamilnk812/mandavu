import React, { useState } from 'react';
import ImageCropper from './ImageCropper';

export default function AddVenuePhotoModal({ handleCloseModal, handleAddVenuePhoto }) {
    const [imageSrc, setImageSrc] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCropComplete = (base64Image) => {
        setCroppedImage(base64Image);
        setImageSrc(null);
    };

    const handleSubmit = () => {
        if (croppedImage) {
            handleAddVenuePhoto({ venue_photo: croppedImage });
            handleCloseModal();
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                {imageSrc ? (
                    <ImageCropper
                        imageSrc={imageSrc}
                        onCropComplete={handleCropComplete}
                        onClose={() => setImageSrc(null)}
                    />
                ) : (
                    <>
                        <input 
                            type="file" 
                            onChange={handleFileChange} 
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-600 file:text-white hover:file:bg-teal-700"
                        />
                        <div className="flex justify-end space-x-4 mt-4">
                            <button 
                                onClick={handleSubmit} 
                                className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700"
                            >
                                Upload
                            </button>
                            <button 
                                onClick={handleCloseModal} 
                                className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
