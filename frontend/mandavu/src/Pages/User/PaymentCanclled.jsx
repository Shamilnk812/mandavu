import Navb from "../../Components/User/Navb";



export default function PaymentCanclled() {
    return(
        <>
        <Navb/>
            <div className="container mx-auto max-w-screen-xl px-4 py-6">
            <div className="p-6 bg-red-100 border border-red-300 rounded-md">
                    <h2 className="text-2xl font-bold text-red-700 mb-4">Payment Canceled</h2>
                    <p className="text-lg text-red-600">Your payment was canceled. Please try again or contact support if you need assistance.</p>
                </div>
            </div>   

        </>
    )
}