import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import UserRoute from './Routes/UserRoute'
import AdminRoute from './Routes/AdminRoute'
import OwnerRoute from './Routes/OwnerRoute'
import Dash from './Pages/Common/Dash'
import { ToastContainer } from 'react-toastify'
// import { WebSocketProvider } from './Utils/ChatContext/ChatContext'
import { VideoCallWebSocketProvider } from './Utils/VideoCallContext/VideoCallContext'
import GlobalVideoCallInvitation from './Utils/VideoCallContext/VideoCallContext'
import CheckInternetConnection from './Utils/CheckConnection/CheckConnection'

function App() {


  return (
    // <CheckInternetConnection>
      
    <div className="min-h-screen bg-customColor7">
     <VideoCallWebSocketProvider>
     {/* <WebSocketProvider> */}
      <Routes>
        <Route path='/' element={<Dash />} />
        <Route path='/user/*' element={<UserRoute />} />
        <Route path='/owner/*' element={<OwnerRoute />} />
        <Route path='/admin/*' element={<AdminRoute />} />
      </Routes> 
      <GlobalVideoCallInvitation/>
      {/* </WebSocketProvider> */}
      </VideoCallWebSocketProvider> 
      
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
     
     </div>

    //  </CheckInternetConnection>
  )
}

export default App
