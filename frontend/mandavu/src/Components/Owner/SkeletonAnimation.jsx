import React from 'react'

const SkeletonAnimation = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                    <div className="animate-pulse">
                        <div className="bg-gray-200 h-48 w-full"></div>
                        <div className="p-5">
                            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                            <div className="flex justify-between mt-6">
                                <div className="h-8 bg-gray-200 rounded w-20"></div>
                                <div className="h-8 bg-gray-200 rounded w-8"></div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default SkeletonAnimation
