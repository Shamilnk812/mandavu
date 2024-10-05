import {Detector} from "react-detect-offline"
import WifiOffIcon from '@mui/icons-material/WifiOff';


const CheckInternetConnection = props => {
    return(
        <>
           <Detector
                render={({online})=> (
                    online ? (props.children):(
                        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                        <div className="bg-white shadow-md rounded-lg p-8 flex flex-col items-center text-center">
                          <WifiOffIcon className="text-teal-600" style={{ fontSize: '80px', marginBottom: '16px' }} />
                          <h1 className="text-2xl font-bold text-teal-700 mb-2">
                            You're Offline!
                          </h1>
                          <p className="text-gray-600 mb-6">
                            It seems like you lost your internet connection. Please check
                            your connection and try again.
                          </p>
                          <button
                            className="bg-teal-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-teal-700 focus:outline-none"
                            onClick={() => window.location.reload()}
                          >
                            Try Again
                          </button>
                        </div>
                      </div>
          
                  )
                )}
           />
        </>
    )
}

export default CheckInternetConnection ;