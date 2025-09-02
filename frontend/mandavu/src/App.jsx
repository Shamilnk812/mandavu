import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import UserRoute from './Routes/UserRoute'
import AdminRoute from './Routes/AdminRoute'
import OwnerRoute from './Routes/OwnerRoute'
import { ToastContainer } from 'react-toastify'
import CheckInternetConnection from './Utils/CheckConnection/CheckConnection'
import NotificationProvider from './Utils/NotificationContext/NotificationContext'
import LandingPage from './Pages/Common/LandingPage'


function App() {




  return (
    // <CheckInternetConnection>

    <div className="min-h-screen bg-customColor7">
      <NotificationProvider>
        <Routes>
          {/* <Route path='/' element={<Login />} /> */}
          <Route path='/' element={<LandingPage />} />
          <Route path='/user/*' element={<UserRoute />} />
          <Route path='/owner/*' element={<OwnerRoute />} />
          <Route path='/admin/*' element={<AdminRoute />} />
        </Routes>
      </NotificationProvider>

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
