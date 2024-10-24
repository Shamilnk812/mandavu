import { useState } from "react";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import toPascalCase from "../../Utils/Extras/ConvertToPascalCase";

export default function SelectBookingPackagesCard({
  bookingPackage,
  handlePackageSelect,
  selectedPackage,
}) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  return (
    <div
      className={`cursor-pointer pt-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300 relative ${selectedPackage?.id === bookingPackage.id
        ? bookingPackage.package_name.toLowerCase() === 'regular'
          ? 'border-2 border-amber-500 shadow-[0_4px_10px_rgba(255,193,7,0.5)]'
          : 'border-2 border-teal-600 shadow-[0_4px_10px_rgba(0,128,128,0.5)]'
        : 'border border-gray-400'
        }`}
      onClick={() => handlePackageSelect(bookingPackage)}
      style={{ height: "320px" }}
    >
      {!isDescriptionExpanded && (
        <div>
          <h4 className={`text-white ${bookingPackage.package_name.toLowerCase() === 'regular' ? 'bg-amber-600' : 'bg-teal-800'
            } p-2 font-bold text-lg text-center mb-3`}>
            {toPascalCase(bookingPackage.package_name)}
          </h4>
        </div>
      )}
      <div className={`${!isDescriptionExpanded ? 'px-4' : 'p-0'}`}>

        {!isDescriptionExpanded ? (
          <>
            {/* Price */}
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-700">Price:</span>
              <span className="text-lg  text-gray-800">
                ₹{Math.floor(bookingPackage.price)}
              </span>
            </div>

            {/* Price Per Hour */}
            {bookingPackage.price_for_per_hour !== "Not Allowed" && (
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-700">Per Hour:</span>
                <span className="text-gray-600">
                  ₹{bookingPackage.price_for_per_hour}
                </span>
              </div>
            )}

            {/* Air Condition */}
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-700">Air Condition:</span>
              <span
                className={
                  bookingPackage.air_condition === "Non-AC"
                    ? "text-red-900"
                    : "text-green-600"
                }
              >
                {bookingPackage.air_condition}
              </span>
            </div>

            {/* Extra Price for AC */}
            {bookingPackage.air_condition !== "Non-AC" &&
              bookingPackage.extra_price_for_aircondition && (
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-700">
                    Extra price for AC:
                  </span>
                  <span className="text-gray-600">
                    ₹{Math.floor(bookingPackage.extra_price_for_aircondition)}
                  </span>
                </div>
              )}


            {/* <div className="text-gray-700 text-sm mt-4 overflow-hidden">
              {bookingPackage.description.length > 60 
                ? `${bookingPackage.description.slice(0, 60)}...` 
                : bookingPackage.description}
            </div> */}

            <div className={`text-gray-700 text-sm mt-4 overflow-hidden transition-all duration-300 ease-in-out ${isDescriptionExpanded ? 'max-h-none' : 'max-h-12'}`}>
              {isDescriptionExpanded
                ? bookingPackage.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vehicula lorem sit amet nibh hendrerit, id facilisis mauris accumsan."
                : `${(bookingPackage.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vehicula lorem sit amet nibh hendrerit, id facilisis mauris accumsan.").slice(0, 60)}...`}
            </div>

          
            <div className="flex justify-end mt-2">
              <button
                className={`${bookingPackage.package_name.toLowerCase() === 'regular' ? 'text-amber-600 ' : 'text-teal-800'} text-sm  hover:underline`}
                onClick={(e) => {
                  e.stopPropagation(); 
                  setIsDescriptionExpanded(true);
                }}
              >
                Read More<ArrowDropDownIcon />
              </button>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col">

            <div
              className="text-gray-700 px-4 py-2 bg-gray-100 text-sm  overflow-y-auto"
              style={{
                maxHeight: "240px",
                transition: "max-height 0.3s ease-in-out",
              }}
            >
              <h2 className="text-lg text-center font-semibold mb-1  ">Package Details</h2>
              is simply dummy text of theting and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley
              is simply dummy text of theting and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley
            </div>

            <button
              className={`${bookingPackage.package_name.toLowerCase() === 'regular' ? 'text-amber-600 ' : 'text-teal-800'} text-sm  hover:underline self-end`}
              onClick={(e) => {
                e.stopPropagation();
                setIsDescriptionExpanded(false);
              }}
            >
              Show Less<ArrowDropUpIcon />
            </button>
          </div>
        )}


      </div>
    </div>
  );
}
