


export default function SelectAdditionalFacilitiesSection({ facilities, selectedFacilities, setSelectedFacilities, setTotalAmount, setAdvanceAmount, totalAmount }) {



    const handleSelectFacilities = (facility) => {
        setSelectedFacilities((prevSelected) => {
            const exists = prevSelected.find((item) => item.id === facility.id);
            const facilityPrice = parseFloat(facility.price);
            const currentTotalAmount = parseFloat(totalAmount) || 0;

            if (exists) {
                const newTotal = currentTotalAmount - (facilityPrice || 0);
                setTotalAmount(newTotal);
                setAdvanceAmount(newTotal * 0.15)

                return prevSelected.filter((item) => item.id !== facility.id);

            } else {
                const newTotal = currentTotalAmount + (facilityPrice || 0);
                setTotalAmount(newTotal);
                setAdvanceAmount(newTotal * 0.15)

                return [...prevSelected, facility]
            }
        })
    }
    return (
        <>
            <div className="h-[300px] bg-gray-50 p-4 rounded-lg shadow-lg overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">Additional Facilities</h3>
                {facilities?.length > 0 ? (
                    <div>
                        {facilities
                            .filter((facility) => facility.price !== "FREE" && facility.is_active) // Filter out free facilities
                            .map((facility) => (
                                <div
                                    key={facility.id}
                                    className="flex justify-between items-center py-2 border-b border-gray-200"
                                >
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`facility-${facility.id}`}
                                            className="mr-2"
                                            name={`facility-${facility.id}`}
                                            onChange={() => handleSelectFacilities(facility)}
                                            checked={selectedFacilities.some((item) => item.id === facility.id)}
                                        />
                                        <label htmlFor={`facility-${facility.id}`} className="text-sm text-gray-700  break-all  max-w-[250px] lg:max-w-[450px]">
                                            {facility.facility}
                                        </label>
                                    </div>
                                    <span className="text-sm font-medium text-gray-500 ">
                                        ₹{facility.price}
                                    </span>
                                </div>
                            ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">No additional facilities available.</p>
                )}
            </div>
        </>
    )
}