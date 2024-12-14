import { useState,useEffect } from "react";

export default function ShowVenueDetailsCmp({ owner }) {
    
    const [fadeIn, setFadeIn] = useState(false);

    const handleOpenPDF = (pdfUrl) => {
        window.open(pdfUrl, '_blank');
    };

    useEffect(() => {
        // Trigger the fade-in effect when the component renders
        setFadeIn(true);
      }, []);



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
                            Venue Details
                        </h3>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-900">
                                    Convention Center
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {owner?.venue?.convention_center_name}
                                </dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-900">
                                    Short Description
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {owner?.venue?.short_description}
                                </dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-900">
                                    Description
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 break-all  max-w-[400px]">
                                    {owner?.venue?.description}
                                </dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-900">
                                    Condition
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {owner?.venue?.condition}
                                </dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-900">
                                    Dining Seat Count
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {owner?.venue?.dining_seat_count}
                                </dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-900">
                                    Auditorium Seat Count
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {owner?.venue?.auditorium_seat_count}
                                </dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-900">
                                    Price
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                &#8377; {owner?.venue?.price}
                                </dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-900">
                                    City
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {owner?.venue?.city}
                                </dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-900">
                                    District
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {owner?.venue?.district}
                                </dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-900">
                                    Pincode
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {owner?.venue?.pincode}
                                </dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-900">
                                    State
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {owner?.venue?.state}
                                </dd>
                            </div>
                            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-900">
                                    Full Address
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {owner?.venue?.address}
                                </dd>
                            </div>


                            <div className="py-4 sm:grid sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-900">
                                    Terms and Conditions
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <button className="text-teal-500 font-semibold hover:underline" onClick={() => handleOpenPDF(owner.venue.terms_and_conditions)}>
                                        View Terms and Conditons
                                    </button>
                                </dd>
                            </div>
                        </dl>

                    </div>
                </div>
            </div>
        </>
    )
}
