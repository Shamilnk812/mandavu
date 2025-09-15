import React, { useEffect,useState} from 'react'
import Sidebar from '../../Components/Admin/Sidebar'
import axios from 'axios';
import { axiosAdminInstance } from '../../Utils/Axios/axiosInstance';


function ViewPlatformProfit() {

    const [transactions, setTransactions] = useState([]);
    const [totalFee, setTotalFee] = useState(0);

    const fetchPlatformFee  = async ()=> {
        try{
            const response = await axiosAdminInstance.get('get-platformfee')
            setTransactions(response.data.transactions);
            setTotalFee(response.data.total_fee);
        }catch (error){
            console.error('Error fetching platform fees:', error);
        }

    }

    useEffect(()=> {
        fetchPlatformFee()
    },[])


    return (
   <>
            <Sidebar />
            <div className="p-4 md:ml-64">
                <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 mt-14">
                     <div className="flex flex-col md:flex-row mb-6 border-b justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-700">Platform Profit</h2>
                        </div>
                        <div className="text-gray-700 font-medium text-lg">
                            Total: ₹{totalFee}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="relative overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-200 text-gray-600 uppercase text-sm">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 font-medium">
                                            <div className="flex items-center">
                                                User name
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-4 font-medium">
                                            Venue
                                        </th>
                                        <th scope="col" className="px-6 py-4 font-medium">
                                            <div className="flex items-center">
                                            Amount
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-4 font-medium">
                                            <div className="flex items-center">
                                            Date
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {transactions.length > 0 ? (
                                        transactions.map((t) => (
                                            <tr key={t.id}>
                                                <td  className="px-6 py-4 whitespace-nowrap">{t.username}</td>
                                                <td  className="px-6 py-4 whitespace-nowrap">{t.venue_name}</td>
                                                <td  className="px-6 py-4 whitespace-nowrap">₹{t.fee_collected}</td>
                                                <td  className="px-6 py-4 whitespace-nowrap">{new Date(t.created_at).toLocaleDateString()}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                                No transactions found
                                            </td>
                                        </tr>
                                    )}

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            </>
            )
}

            export default ViewPlatformProfit
