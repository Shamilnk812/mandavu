
import React from 'react'
import ReportIcon from '@mui/icons-material/Report';

const NoDataFoundMessage = ({title}) => {
    return (
        <tr>
            <td colSpan="5" className="px-6 py-12 text-center">
                <div className="flex flex-col items-center justify-center">
                    <ReportIcon fontSize='large' className='text-gray-500'/>
                    <h3 className="text-lg font-medium text-gray-700">No {title} found</h3>
                    <p className="text-gray-500 mt-1">There are currently no {title} registered</p>
                </div>
            </td>
        </tr>
    )
}

export default NoDataFoundMessage
