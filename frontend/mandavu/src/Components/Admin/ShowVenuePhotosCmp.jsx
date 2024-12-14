import { useState,useEffect } from "react"; 
  
export default function ShowVenuePhotosCmp({ photos }) {

    const [fadeIn, setFadeIn] = useState(false);

    useEffect(() => {
        setFadeIn(true);
    }, []);

    return (
        <>
            <div
                className={`bg-white rounded-lg shadow-lg border transform transition-opacity duration-500 ease-out ${
                fadeIn ? 'opacity-100' : 'opacity-0'
                }`}
            >
                {/* Main Heading */}
                <h2 className="text-lg leading-6 font-medium text-center text-white py-5 mb-6 bg-gray-700 rounded-t-lg">Photos</h2>

                <div className="h-[600px] overflow-y-auto">

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 pb-12">
                        {photos.map((photo, index) => (
                            <div
                                key={photo.id}
                                className="relative bg-white shadow-xl rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl border"
                            >
                                {/* Venue Photo */}
                                <img
                                    src={photo.venue_photo}
                                    alt="venue photo"
                                    className="w-full h-48 object-cover"
                                />

                            </div>
                        ))}
                    </div>
                </div>



            </div>
        </>
    )
}