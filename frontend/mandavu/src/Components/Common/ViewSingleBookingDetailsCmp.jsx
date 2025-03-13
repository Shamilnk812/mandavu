



export default function ViewSingleBookingDetailsCmp({booking,id}){
    console.log('prorro',booking)
     // Format dates
     const formattedDates = booking.dates.length === 1
     ? booking.dates[0]
     : `${booking.dates[0]} to ${booking.dates[booking.dates.length - 1]}`;

 // Format times
 const formattedTimes = booking.times.some(time => typeof time === 'string')
     ? booking.times.join(' | ')
     : booking.times.map(slot => `${slot[0]} - ${slot[1]}`).join(' | ');
    return(
        <>

        
            <div className="bg-customColor7 overflow-hidden shadow rounded-lg border">
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg text-center leading-6 font-medium text-gray-700">
                  Booking Details
                </h3>
                {/* <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    This is some information about the user.
                </p> */}
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                {id === booking.venue ? (
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-900">
                                Username
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {booking.name}
                            </dd>
                        </div>
                    ) : (
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-900">
                                Convention Center Name
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {booking.venue_name}
                            </dd>
                        </div>
                    )}
                    {/* <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900">
                            Email address
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {booking.email}
                        </dd>
                    </div> */}
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900">
                            Phone number
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {booking.phone}
                        </dd>
                    </div>
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900">
                           Additional Phone number
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                           {booking.additional_phone}
                        </dd>
                    </div>
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900">
                           Date
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                           {/* {formattedDates} */}
                           {formattedDates}
                        </dd>
                    </div>
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900">
                           Time
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                           {formattedTimes}
                        </dd>
                    </div>
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900">
                           Total Price
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                           {booking.total_price}
                        </dd>
                    </div>
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900">
                           Booking Amount
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                           {booking.booking_amount}
                        </dd>
                    </div>
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900">
                           Remaining Amount
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {booking.remaining_amount}
                        </dd>
                    </div>
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900">
                           Status
                        </dt>
                        <dd>
                            <span
                            className={`mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 px-4 py-2 rounded 
                                ${booking.status === 'Booking Confirmed' ? 'bg-orange-500 text-white' : ''} 
                                ${booking.status === 'Booking Completed' ? 'bg-green-500 text-white' : ''} 
                                ${booking.status === 'Booking Canceled' ? 'bg-red-500 text-white' : ''}`}
                            > {booking.status} </span>
                        </dd>
                    </div>
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-900">
                           Full Address
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                           {booking.address} {booking.city} {booking.state} 
                        </dd>
                    </div>
                    
                    
                    
                </dl>
                
            </div>
        </div> 


    
        </>
    )
}