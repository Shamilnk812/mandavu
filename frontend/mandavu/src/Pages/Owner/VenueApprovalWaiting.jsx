



export default function VenueApprovalWaiting() {
    return(
        <>
            <div className="min-h-screen bg-teal-600 flex justify-center items-center">
        <div className="absolute w-60 h-60 rounded-xl bg-teal-500 -top-5 -left-16 z-0 transform rotate-45 hidden md:block"></div>
        <div className="py-12 px-12 bg-white rounded-2xl shadow-xl z-20">
          {/* <div>
            <h1 className="text-3xl font-bold text-center mb-4 cursor-pointer">Create An Account</h1>
          </div> */}
          <div className="p-16 bg-customColor8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 text-center text-green-600">Registration Successful!</h3>
            <p className="text-lg mb-4 text-center">Your venue has been successfully registered and is awaiting admin approval.</p>
            <p className="text-lg text-center">The admin will send you an email once the venue is approved.</p>
      </div>
        </div>
        <div className="w-40 h-40 absolute bg-teal-500 rounded-full top-0 right-12 hidden md:block"></div>
        <div className="w-20 h-40 absolute bg-teal-500 rounded-full bottom-20 left-10 transform rotate-45 hidden md:block"></div>
      </div>
        </>
    )
}