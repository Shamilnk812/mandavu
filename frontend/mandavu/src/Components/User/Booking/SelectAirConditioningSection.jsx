


export default function SelectAirConditioningSection({selectedPackage,setAirConditionSelection, airConditionSelection, setTotalAmount, setAdvanceAmount,totalAmount }) {

    const handleSelectionChange = (event) => {
        const selectedAirCondition = event.target.value;
        const extraPriceForAirCondition = parseFloat(selectedPackage?.extra_price_for_aircondition) 
        const currentTotalAmount = parseFloat(totalAmount) || 0;
           
        // Check if the selected air condition is changing
        setAirConditionSelection((prevSelection) => {
           
           
            if (selectedAirCondition === 'AC' && prevSelection !== 'AC') {
                const newTotal = currentTotalAmount + (extraPriceForAirCondition || 0)
                setTotalAmount(newTotal);
                setAdvanceAmount(newTotal * 0.15)
            }
            else if (selectedAirCondition === 'Non A/C' && prevSelection !== 'Non A/C') {
                const newTotal = currentTotalAmount - (extraPriceForAirCondition || 0 )
                setTotalAmount(newTotal);
                setAdvanceAmount(newTotal * 0.15)
            }
            return selectedAirCondition;
        });
    };


    return (
        <>
            {/* <div className="flex flex-wrap -mx-3 mb-4 mt-2"> */}
                <div className="w-full md:w-1/2 px-3">
                    <label className="block text-gray-700 text-sm font-bold mb-2 ml-2">
                      Select Air-Conditioning
                    </label>
                    <div className="flex items-center space-x-12 ml-2 mt-3">
                        {/* A/C Radio Button */}
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="airCondition"
                                value="AC"
                                className={`form-radio h-5 w-5 text-teal-600 ${selectedPackage?.air_condition === 'Non A/C'
                                        ? 'cursor-not-allowed opacity-50'
                                        : 'cursor-pointer'
                                    }`}
                                onChange={handleSelectionChange}
                                checked={airConditionSelection === 'AC'}
                                disabled={selectedPackage?.air_condition === 'Non A/C'}
                            />
                            <span
                                className={`${selectedPackage?.air_condition === 'Non A/C'
                                        ? 'text-gray-400 text-sm'
                                        : 'text-gray-800 text-sm'
                                    }`}
                            >
                                A/C
                            </span>
                        </label>

                        {/* Non A/C Radio Button */}
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="airCondition"
                                value="Non A/C"
                                className={`form-radio h-5 w-5  text-teal-600${selectedPackage?.air_condition === 'AC'
                                        ? 'cursor-not-allowed opacity-50'
                                        : 'cursor-pointer'
                                    }`}
                                onChange={handleSelectionChange}
                                checked={airConditionSelection === 'Non A/C'}
                                disabled={selectedPackage?.air_condition === 'AC'}
                            />
                            <span
                                className={`${selectedPackage?.air_condition === 'AC'
                                        ? 'text-gray-400 text-sm'
                                        : 'text-gray-800 text-sm '
                                    }`}
                            >
                                Non A/C
                            </span>
                        </label>
                    </div>
                </div>


            {/* </div> */}

        </>
    )
}