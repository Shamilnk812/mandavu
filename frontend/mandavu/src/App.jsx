import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import UserRoute from './Routes/UserRoute'
import AdminRoute from './Routes/AdminRoute'
import OwnerRoute from './Routes/OwnerRoute'
import Dash from './Pages/Common/Dash'



function App() {


  return (
    <>

      <Routes>
        <Route path='/' element={<Dash />} />
        <Route path='/user/*' element={<UserRoute />} />
        <Route path='/owner/*' element={<OwnerRoute />} />
        <Route path='/admin/*' element={<AdminRoute />} />
      </Routes> 
     
    </>
  )
}

export default App
