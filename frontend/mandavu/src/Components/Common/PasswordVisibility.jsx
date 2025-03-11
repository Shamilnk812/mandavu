
import React from 'react'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

function PasswordVisibility({showPassword,togglePasswordVisibility}) {
    return (
        <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
        > {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
        </button>
    )
}

export default PasswordVisibility
