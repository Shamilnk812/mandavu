import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../../Utils/ImageCropping/CroppingImage';

export default function ImageCropper({ imageSrc, onCropComplete, onClose }) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropChange = (crop) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom) => {
        setZoom(zoom);
    };

    const onCropCompleteCallback = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleCropComplete = async () => {
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Image = reader.result; // This is your Base64 image
            onCropComplete(base64Image);
        };
        reader.readAsDataURL(croppedImage); // Convert to Base64
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex flex-col justify-center items-center">
            <div className="relative w-96 h-96 bg-white p-4 rounded-lg flex flex-col justify-between">
                <div className="flex-grow">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={4 / 3}
                        onCropChange={onCropChange}
                        onZoomChange={onZoomChange}
                        onCropComplete={onCropCompleteCallback}
                    />
                </div>
               
            </div>
            <div className="mt-4 space-x-2">
                    <button
                        type="button"
                        onClick={handleCropComplete}
                        className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600"
                    >
                        Crop
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                </div>
        </div>
    );
}
