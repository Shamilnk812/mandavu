import React from 'react'
import ReportIcon from '@mui/icons-material/Report';

const EmptyDataShowMessage = ({title}) => {
    return (
        <div className="text-center py-12 col-span-full">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ReportIcon fontSize='large' className='text-gray-400'/>
            </div>
            <h4 className="text-lg font-medium text-gray-700 mb-2">No {title} Found</h4>
            <p className="text-gray-500 mb-4">Add your first {title} to get started</p>
        </div>
    )
}

export default EmptyDataShowMessage
