

export default function ShowSelectedAdditionalFacilities({selectedFacilities}) {
    return (

        <>

            <div>
                <div className="flex items-start bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition mb-4">
                    <div className="mx-4  w-full">
                        <div className="flex justify-center  to-gray-800 rounded-lg py-1 mb-4">
                            <h4 className="text-lg text-gray-900 font-semibold ">
                                Additional Facilities
                            </h4>
                        </div>

                        {/* RENDER FACILITIES */}


                        {selectedFacilities.length > 0 ? (
                            <div>
                                <div className="mt-2">
                                    {selectedFacilities.map((facility) => (
                                        <div
                                            key={facility.id}
                                            className="flex justify-between items-center py-2 border-b border-gray-200"
                                        >
                                            <span className="text-sm text-gray-700">
                                                {facility.facility}
                                            </span>
                                            <span className="text-sm font-medium text-gray-700">
                                                ₹{facility.price}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">No facilities selected.</p>
                        )}

                    </div>
                </div>
            </div>

        </>
    )
}