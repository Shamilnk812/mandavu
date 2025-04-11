import React from 'react'

const DataLoadingSkeletonAnimation = () => {
    return (
        [...Array(5)].map((_, index) => (
            <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                        <div className="ml-4 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                            <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                        </div>
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
                </td>
            </tr>
        ))
    )
}

export default DataLoadingSkeletonAnimation
