

export default function RegisterAlertMessage () {
    return(
        <>
           <div className="flex flex-col items-center justify-center min-h-screen bg-customColor7">
            <div className="p-10 bg-customColor8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold mb-4 text-center text-green-600">Register Your venue </h3>
                <p className="text-lg mb-4 text-center">Your venue has been successfully registered and is awaiting admin approval.</p>
                <p className="text-lg text-center">The admin will send you an email once the venue is approved.</p>
            </div>
            </div>
        
        </>
    )
}