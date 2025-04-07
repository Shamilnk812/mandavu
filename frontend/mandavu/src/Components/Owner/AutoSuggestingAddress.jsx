import { useState, useEffect } from "react";

const AutoSuggestingAddress = ({ formik }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const locationAccessToken = 'pk.a8be7274b6e35cdd8a4476f3bcc22984';

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query.length > 2) {
                console.log('Fetching suggestions from LocationIQ...');
                fetch(`https://api.locationiq.com/v1/autocomplete?key=${locationAccessToken}&q=${encodeURIComponent(query)}&limit=5&dedupe=1&countrycodes=in`)
                    .then(res => res.json())
                    .then(data => {
                        setSuggestions(data);
                        console.log(data, 'heyeyefsajlkdsjlkfdsjlkfj')
                    })
                    .catch(err => {
                        console.error("LocationIQ error:", err);
                        setSuggestions([]);
                    });
            } else {
                setSuggestions([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleSelect = async (address) => {
        console.log("selected address", address)
        const { address: addr, display_name, display_place, lat, lon } = address
        const pincode = addr?.postcode || "";
        const state = addr?.state || "";
        const city = display_place || addr?.city || addr?.town || addr?.name || "";

        try {

            const response = await fetch(`https://us1.locationiq.com/v1/reverse?key=${locationAccessToken}&lat=${lat}&lon=${lon}&format=json`);
            const data = await response.json();

            const sAddress = data?.address || {};
            const district = sAddress?.state_district || "";

            // formik.setFieldValue("address", display_name);
            formik.setFieldValue("pincode", pincode);
            formik.setFieldValue("state", state);
            formik.setFieldValue("district", district);
            formik.setFieldValue("city", city);
            formik.setFieldValue("latitude", lat);
            formik.setFieldValue("longitude", lon);

            setSuggestions([]);
            console.log('it is working')
        } catch (error) {
            console.error("Failed to find your locaiton, please try again later.", error);
        }
    };




    return (
        <div className="relative col-span-2 mt-6">
            <label htmlFor="address" className="block text-center text-sm font-medium text-gray-700">
                Setup your address
            </label>
            <input
                type="text"
                name="address"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Start typing address..."
                className="block text-sm py-3 px-4 rounded-lg w-full bg-white border border-gray-300 outline-teal-500"
            />
            {suggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-300 w-full rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
                    {suggestions.map((item, idx) => (
                        <li
                            key={idx}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSelect(item)}
                        >
                            {item.display_name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AutoSuggestingAddress;



// import { useState,useEffect } from "react";


// const AutoSuggestingAddress = ({formik}) => {
//     const [query, setQuery] = useState('');
//     const [suggestions, setSuggestions] = useState([]);

//     useEffect(() => {
//         const delayDebounceFn = setTimeout(() => {
//             console.log(' address fetching')
//             if (query.length > 2) {
//                 fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1`)
//                     .then((res) => res.json())
//                     .then((data) => {
//                         setSuggestions(data);
//                     });
//             } else {
//                 setSuggestions([]);
//             }
//         }, 300);

//         return () => clearTimeout(delayDebounceFn);
//     }, [query]);

//     const handleSelect = (address) => {
//         formik.setFieldValue("address", address.name); // update form
//         setQuery(address.name); // show in input
//         setSuggestions([]);
//     };

//     return (
//         <div className="relative">
//             <label htmlFor="address" className="block text-sm font-medium text-gray-700">
//                 Full Address
//             </label>
//             <input
//                 type="text"
//                 name="address"
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//                 placeholder="Start typing address..."
//                 className="block text-sm py-3 px-4 rounded-lg w-full bg-white border border-gray-300 outline-teal-500"
//             />
//             {suggestions.length > 0 && (
//                 <ul className="absolute z-10 bg-white border border-gray-300 w-full rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
//                     {suggestions.map((item, idx) => (
//                         <li
//                             key={idx}
//                             className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                             onClick={() => handleSelect(item)}
//                         >
//                             {item.name}
//                         </li>
//                     ))}
//                 </ul>
//             )}
//         </div>
//     );
// }


// export default AutoSuggestingAddress;