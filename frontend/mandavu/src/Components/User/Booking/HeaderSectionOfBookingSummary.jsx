import toPascalCase from "../../../Utils/Extras/ConvertToPascalCase"


export default function HeaderSectionOfBookingSummary({ venue }) {
    return (
        <>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-600">Booking Summary</h2>
                <span className="text-sm text-gray-500 italic">
                    {new Date().toLocaleDateString()}
                </span>
            </div>

            {/* Venue Details */}
            <div className="mb-6">
                <div className="relative w-full h-48 rounded-lg overflow-hidden shadow-sm">
                    <img
                        src={
                            venue?.images?.length > 0
                                ? venue.images[0].venue_photo
                                : "https://via.placeholder.com/300x200"
                        }
                        alt="Venue"
                        className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                    <div className="absolute bottom-2 left-4 text-white">
                        <h3 className="text-xl font-semibold">
                            {toPascalCase(venue?.convention_center_name || 'Default Venue Name')}
                        </h3>
                    </div>
                </div>
            </div>

        </>
    )
}