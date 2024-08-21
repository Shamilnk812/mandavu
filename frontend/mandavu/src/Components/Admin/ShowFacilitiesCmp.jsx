

export default function ShowFacilitiesCmp({facilities}) {
    return(
        <>
            <div className="w-1/2  ">
                <div className="bg-customColor7 overflow-hidden shadow-lg rounded-lg border">
                    <div className="px-4 py-5 sm:px-6 bg-gray-700">
                        <h3 className="text-lg leading-6 font-medium text-center text-white">
                            Facilities
                        </h3>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                           
                             {facilities.map((facility, index) => (
                                <div key={index} className="py-4 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-900 sm:col-span-3">
                                        {facility.facility}
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1 text-right">
                                        {facility.price}
                                    </dd>
                                </div>
                            ))}
                          
                        </dl>
                       
                    </div>
                </div> 
            </div>
        </>
    )
}