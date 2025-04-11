import { useState,useEffect } from "react";
import ArrowRightOutlinedIcon from '@mui/icons-material/ArrowRightOutlined';

export default function ShowFacilitiesCmp({ facilities }) {
 
    const [fadeIn, setFadeIn] = useState(false);

     useEffect(() => {
        // Trigger the fade-in effect when the component renders
        setFadeIn(true);
      }, []);
    

    return (
        <>
            
            <div
      className={`transform transition-opacity duration-500 ease-out ${
        fadeIn ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-gray-600 px-6 py-4">
          <h3 className="text-xl font-semibold text-white">Available Facilities</h3>
        </div>

        {/* Facilities List */}
        <div className="divide-y divide-gray-100">
          {facilities.map((facility, index) => (
            <div
              key={index}
              className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 p-1 rounded-full">
                   <ArrowRightOutlinedIcon fontSize="small" className="text-gray-500"/>
                  </div>

                  <div>
                    <h4 className="text-md font-medium text-gray-700">
                      {facility.facility}
                    </h4>
                  </div>
                </div>
                <div
                  className={`text-lg font-semibold ${
                    facility.price === "FREE"
                      ? "text-emerald-600"
                      : "text-gray-600"
                  }`}
                >
                  {facility.price === "FREE" ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                      Included
                    </span>
                  ) : (
                    <span className="bg-gray-100 px-3 py-1 rounded-lg">
                      ₹{facility.price}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

     
       
      </div>
    </div>
        </>
    )
}