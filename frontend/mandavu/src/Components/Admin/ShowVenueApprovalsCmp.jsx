import { useEffect, useState } from "react";
import { axiosAdminInstance, axiosOwnerInstance } from "../../Utils/Axios/axiosInstance";
import { toast } from "react-toastify";

export default function ShowVenueApprovalsCmp({ venueId }) {
    const [bookingPackages, setBookingPackages] = useState([]);
    const [expanded, setExpanded] = useState({});

    useEffect(() => {
      

        fetchBookingPackages();
    }, [venueId]);
    
    const fetchBookingPackages = async () => {
        try {
            const response = await axiosOwnerInstance.get(`get-all-booking-packages/${venueId}/`);
            setBookingPackages(response.data);
        } catch (error) {
            console.error("Error fetching booking packages", error);
            toast.error("Failed to fetch booking packages. Please try again later.");
        }
    };
   
    const handleBookingPackageApproval = async (pkgId)=> {
        try {
            const response = await axiosAdminInstance.put(`booking-package-approval/${venueId}/`,{pkg_id:pkgId})
            const approvedPackage = response.data.package_name
            toast.success(`${approvedPackage} Booking Package approved successfully.`)
            fetchBookingPackages()
        }catch(error){
            toast.error("Failed to approve booking package. Please try again later.")
        }
    }

    

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {bookingPackages.map((pkg) => (
                <div
                    key={pkg.id}
                    className="bg-white rounded-lg shadow-lg border p-4 transform hover:scale-105 hover:shadow-2xl transition-transform duration-300 ease-out"
                >
                    <h3 className="text-lg font-bold text-gray-800 text-center text-white rounded-lg mb-4 bg-teal-900 py-2">{pkg.package_name}</h3>
                    <div className="flex justify-between mb-2">
                        <span className="font-semibold text-gray-700">Price:</span>
                        <span className="text-gray-700">₹{pkg.price}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="font-semibold text-gray-700">Price Per Hour:</span>
                        <span className="text-gray-700">{pkg.price_for_per_hour}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="font-semibold text-gray-700">Air Condition:</span>
                        <span className="text-gray-700">{pkg.air_condition}</span>
                    </div>
                    <div className="flex justify-between mb-4">
                        <span className="font-semibold text-gray-700">Extra Price for AC:</span>
                        <span className="text-gray-700">₹{pkg.extra_price_for_aircondition}</span>
                    </div>
                    <div
                        className="text-gray-600 bg-gray-200 rounded-lg p-2 overflow-y-auto mb-4"
                        style={{ maxHeight: "250px" }}
                    >
                        {pkg.description}
                    </div>
                    
                    <div className="flex justify-end gap-4">
    {pkg.is_verified ? (
        <span className="text-green-600 font-semibold">Approved</span>
    ) : pkg.is_rejected ? (
        <div className="flex flex-col items-end">
            <span className="text-red-600 font-semibold">Rejected</span>
            <button
                className="text-blue-600 underline hover:text-blue-800"
                onClick={() => setExpanded((prev) => ({ ...prev, [pkg.id]: !prev[pkg.id] }))}
            >
                {expanded[pkg.id] ? "Collapse" : "Expand"}
            </button>
            {expanded[pkg.id] && (
                <div className="text-gray-700 mt-2 border rounded p-2">
                    <span className="font-semibold">Rejection Reason:</span> {pkg.rejection_reason || "No reason provided"}
                </div>
            )}
        </div>
    ) : (
        <div className="flex gap-4">
            <button className="bg-red-600 text-white py-1 px-4 rounded shadow hover:bg-red-700 transition-colors">
                Reject
            </button>
            <button className="bg-green-600 text-white py-1 px-4 rounded shadow hover:bg-green-700 transition-colors"
            onClick={()=> handleBookingPackageApproval(pkg.id)}
            >
                Approve
            </button>
        </div>
    )}
</div>





                </div>
            ))}
        </div>
    );
}
