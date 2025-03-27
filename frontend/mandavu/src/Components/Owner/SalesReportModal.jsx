import { useState } from "react";
import { toast } from "react-toastify";
import { axiosOwnerInstance } from "../../Utils/Axios/axiosInstance";
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import { CircularProgress } from "@mui/material";



const DownloadSalesReoport = ({ isOpen, onClose, venueId }) => {


    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateReport = async () => {
        setIsLoading(true);
        console.log('form submitted with values', startDate, endDate)
        if (!startDate || !endDate) {
            toast.error("Please select both start and end dates");
            return;
        }

        try {

            const response = await axiosOwnerInstance.post("generate-sales-report/",
                { start_date: startDate, end_date: endDate, venue_id: venueId },
                { responseType: "blob" }
            )

            // Create a link to download the PDF
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "sales_report.pdf");
            document.body.appendChild(link);
            link.click();
            link.remove();

            toast.success("Sales report downloaded successfully!");
            onClose();
        } catch (error) {
            toast.error("Failed to generate report");
        }finally{
            setIsLoading(false);
        }
    };

    return isOpen ? (




        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-xl font-semibold text-gray-700">
                            Download Sales Report
                        </h3>
                        <button
                            type="button"
                            className="text-gray-400 bg-transparent hover:bg-gray-500 hover:text-white rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
                        onClick={onClose}
                        >
                            
                            <CloseIcon/>
                        </button>
                    </div>


                    <div className="p-4 md:p-5 space-y-4">

                        <div>
                            <label
                                htmlFor="start_date"
                                className="block mb-2 text-sm font-medium text-gray-800"
                            >
                                Start Date
                            </label>
                            <input
                                type="date"
                                name="start_date"
                                id="start_date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="bg-customColor7 border border-gray-300 outline-none text-gray-800 text-sm rounded-lg block w-full p-2.5"
                            />

                        </div>
                        <div>
                            <label
                                htmlFor="end_date"
                                className="block mb-2 text-sm font-medium text-gray-800"
                            >
                                End Date
                            </label>
                            <input
                                type="date"
                                name="end_date"
                                id="end_date"
                                value={endDate}
                                className="bg-customColor7 border border-gray-300 outline-none text-gray-800 text-sm rounded-lg block w-full p-2.5"

                            />

                        </div>

                        <div className="flex justify-center pt-4">
                            <button
                               onClick={handleGenerateReport}
                               disabled={isLoading}
                               className={`mt-2 bg-teal-600 w-1/2 text-white py-2 px-4 rounded hover:bg-teal-800 transition-all duration-300 ${isLoading ? 'cursor-notallowed opacity-70': ''}`}
                            >
                                 {isLoading ? (
                                <CircularProgress size={20} style={{ color: 'white' }} />
                                ) : (
                                  <> <DownloadIcon/> Download </> 
                                )}
                              
                            </button>
                        </div>

                    </div>

                </div>
            </div>
        </div>

    ) : null;

}


export default DownloadSalesReoport;


