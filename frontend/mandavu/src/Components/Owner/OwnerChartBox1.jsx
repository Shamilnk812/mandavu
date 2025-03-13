import { Grid, Box } from "@mui/material"
import { useNavigate } from "react-router-dom";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import EngineeringIcon from '@mui/icons-material/Engineering';
import { useState } from "react";
import { useSelector } from "react-redux";
import MaintenanceModal from "./MaintenanceModal";
import { useFormik } from "formik";
import MaintenanceValidationSchema from "../../Validations/Owner/MaintenanaceSchema";
import { axiosOwnerInstance } from "../../Utils/Axios/axiosInstance";
import { toast } from "react-toastify";

export default function OwnerChartBox1({ title, icon, bchart, totalRevenue, maintenanceStatus, fetchBookingStatus }) {
  const navigate = useNavigate();

  const [isOpenModal, setIsOpenModal] = useState(false)
  const venueId = useSelector((state) => state.owner.venueId);


  const formik = useFormik({
    initialValues: {
      start_date: '',
      end_date: '',
      reason: ''
    },
    validationSchema: MaintenanceValidationSchema,
    onSubmit: async (values) => {
      console.log("form sumbitted with ", values)

      
    try {
      const response = await axiosOwnerInstance.patch(`set-maintenance/${venueId}/`, values)
      toast.success("Venue maintenance details have been successfully updated.")
      fetchBookingStatus();
    } catch (error) {
      console.error("error", error)
      toast.error("Failed to set maintenance. Please try again later.")
    }
      handleCloseModal()

    }
  })

  const handleOpenModal = () => {
    setIsOpenModal(true)
  }

  const handleCloseModal = () => {
    setIsOpenModal(false)
    formik.resetForm()
  }


  const removeMaintenance = async ()=> {
    try{
      await axiosOwnerInstance.patch(`remove-maintenance/${venueId}/`);
      toast.success("Your venue maintenance removed.")
      fetchBookingStatus();

    }catch(error){
      toast.error("Failed to remove maintenance. Please try again later.")
    }
  }


  return (
    <>
      <Grid container sx={{ width: '100%', minHeight: '600px', boxShadow: 3, justifyContent: 'space-between', marginBottom: '40px' }}>


        <Grid item xs={9} sx={{ minHeight: '500px', padding: '30px' }}>
          <Box sx={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '20px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Box sx={{ marginRight: '10px' }}>{icon}</Box>
            <Box>{title}</Box>
          </Box>
          <Box sx={{ padding: '15px', backgroundColor: '#f0f5f5', boxShadow: 1 }}>
            {bchart}
          </Box>
        </Grid>


        <Grid item xs={3} sx={{ minHeight: '500px', padding: '30px', display: 'flex', flexDirection: 'column', }}>


          {/* <Box sx={{ display: "flex", justifyContent: 'end' }}>
            <button onClick={() => navigate('/owner/booking-management')} className="bg-purple-600 text-white  py-2 px-4 rounded">
              View All Details <ArrowRightAltIcon />
            </button>
          </Box> */}


          <Box sx={{ height: '150px', marginTop: '100px', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px', textAlign: 'center', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', }}>
            <Box sx={{ fontWeight: 'bold', fontSize: '18px' }}>Total Revenue</Box>
            <Box sx={{ fontSize: '24px', marginTop: '10px' }}>${totalRevenue}</Box>
          </Box>

          <Box sx={{ display: "flex", justifyContent: 'center', marginTop: '50px' }}>
            {maintenanceStatus === false ? (
              <button
                onClick={handleOpenModal}
                className="border border-red-600 text-red-600 py-3 px-4 rounded hover:bg-red-600 hover:text-white transition-all duration-300"
              >
                <EngineeringIcon className="mr-2" />
                Set Maintenance
              </button>
            ) : (
              <button
                onClick={removeMaintenance}
                className="border border-green-600 text-green-600 py-3 px-4 rounded hover:bg-green-600 hover:text-white transition-all duration-300"
              >
                <EngineeringIcon className="mr-2" />
                Remove Maintenance
              </button>
            )}
          
          </Box>

        


        </Grid>

      </Grid>
      {isOpenModal && (

        <MaintenanceModal isOpen={isOpenModal} formik={formik} handleCloseModal={handleCloseModal} />
      )}
    </>
  )
}