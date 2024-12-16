import { useEffect, useState } from "react";
import { axiosAdminInstance, axiosOwnerInstance } from "../../Utils/Axios/axiosInstance";
import { toast } from "react-toastify";
import BookingPackageRejectionModal from "./BookingPackageRejectionModal";

export default function ShowVenueApprovalsCmp({ venueId }) {
    const [bookingPackages, setBookingPackages] = useState([]);
    const [expanded, setExpanded] = useState({});
    const [fadeIn, setFadeIn] = useState(false)


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPkgId, setCurrentPkgId] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [loadingPackageId, setLoadingPackageId] = useState(null);




    useEffect(() => {
        fetchBookingPackages();
    }, [venueId]);

    useEffect(() => {
        setFadeIn(true);
    }, []);


    const fetchBookingPackages = async () => {
        try {
            const response = await axiosOwnerInstance.get(`get-all-booking-packages/${venueId}/`);
            setBookingPackages(response.data);
        } catch (error) {
            console.error("Error fetching booking packages", error);
            toast.error("Failed to fetch booking packages. Please try again later.");
        }
    };

    const handleBookingPackageApproval = async (pkgId) => {
        setLoadingPackageId(pkgId);
        try {
            const response = await axiosAdminInstance.put(`booking-package-approval/${venueId}/`, { pkg_id: pkgId })
            const approvedPackage = response.data.package_name
            toast.success(`${approvedPackage} Booking Package approved successfully.`)
            fetchBookingPackages();
        } catch (error) {
            toast.error("Failed to approve booking package. Please try again later.")
        } finally {
            setLoadingPackageId(null); 
        }
    }

    const handleBookingPackageRejection = async () => {
        try {

            const response = await axiosAdminInstance.put(`booking-package-rejection/${venueId}/`, {
                pkg_id: currentPkgId,
                rejection_reason: rejectionReason,
            });
            const rejectedPackage = response.data.packag_name;
            toast.success(`${rejectedPackage} is rejected successfully.`);
            fetchBookingPackages();
            setIsModalOpen(false);
            setRejectionReason("");
        } catch (error) {
            toast.error("Failed to reject booking package. Please try again later.");
        }
    };



    const openModal = (pkgId) => {
        setCurrentPkgId(pkgId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setRejectionReason("");
    };


    return (
        <div
            className={`bg-white rounded-lg border transform transition-opacity duration-500 ease-out ${fadeIn ? 'opacity-100' : 'opacity-0'
                }`}
        >


            <div className="px-4 py-5 sm:px-6 bg-gray-700 rounded-t-lg">
                <h3 className="text-lg leading-6 font-medium text-center text-white">
                    Booking Packages
                </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                {bookingPackages.map((pkg) => (
                    <div
                        key={pkg.id}
                        className="bg-white rounded-lg shadow-lg border border-gray-400 p-4 transform hover:scale-105 hover:shadow-2xl transition-transform duration-300 ease-out"
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
                                    <button className="bg-red-600 text-white py-1 px-4 rounded shadow hover:bg-red-700 transition-colors"
                                        onClick={() => openModal(pkg.id)}
                                    >
                                        Reject

                                    </button>

                                    <button className="bg-green-600 text-white py-1 px-4 rounded shadow hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                        onClick={() => handleBookingPackageApproval(pkg.id)}
                                        disabled={loadingPackageId === pkg.id} 
                                    >
                                        {loadingPackageId === pkg.id ? (
                                            <div className="w-5 h-5 border-4 border-t-white border-gray-300 rounded-full animate-spin"></div>
                                        ) : (
                                            "Approve"
                                        )}
                                    </button>


                                </div>
                            )}
                        </div>

                    </div>
                ))}
            </div>



        {/* Modal to Specify the Rejection Reason */}
            <BookingPackageRejectionModal
                isModalOpen={isModalOpen}
                closeModal={closeModal}
                rejectionReason={rejectionReason}
                setRejectionReason={setRejectionReason}
                handleBookingPackageRejection={handleBookingPackageRejection}
            />

           


        </div>







    );
}
