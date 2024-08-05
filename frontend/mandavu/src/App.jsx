import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import UserRoute from './Routes/UserRoute'
import AdminRoute from './Routes/AdminRoute'
import OwnerRoute from './Routes/OwnerRoute'
import Dash from './Pages/Common/Dash'
import { ToastContainer } from 'react-toastify'


function App() {


  return (
    <div className="min-h-screen bg-customColor1">

      <Routes>
        <Route path='/' element={<Dash />} />
        <Route path='/user/*' element={<UserRoute />} />
        <Route path='/owner/*' element={<OwnerRoute />} />
        <Route path='/admin/*' element={<AdminRoute />} />
      </Routes> 
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
  )
}

export default App
