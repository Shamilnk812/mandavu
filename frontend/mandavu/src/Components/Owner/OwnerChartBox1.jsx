import { Grid, Box } from "@mui/material"
import React from "react";
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
import DownloadSalesReoport from "./SalesReportModal";
import DownloadIcon from '@mui/icons-material/Download';

export default function OwnerChartBox1({ title, icon, bchart, totalRevenue, maintenanceStatus, fetchBookingStatus }) {
  const navigate = useNavigate();

  const [isOpenModal, setIsOpenModal] = useState(false)
  const [isSalesReportModalOpen, setIsSalesReportModalOpen] = useState(false);
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


  const handleOpenSalesReportModal = () => {
    setIsSalesReportModalOpen(true);

  }

  const handleCloseSalesReportModal = () => {
    setIsSalesReportModalOpen(false);
  }


  const removeMaintenance = async () => {
    try {
      await axiosOwnerInstance.patch(`remove-maintenance/${venueId}/`);
      toast.success("Your venue maintenance removed.")
      fetchBookingStatus();

    } catch (error) {
      toast.error("Failed to remove maintenance. Please try again later.")
    }
  }


  return (
    <>
      <Grid container sx={{
        width: '100%',
        minHeight: '600px',
        boxShadow: 2,
        borderRadius:'5px',
        justifyContent: 'space-between',
        marginBottom: '50px',
        flexDirection: { xs: 'column', md: 'row' } 
      }}>
       
        <Grid item xs={12} md={9} lg={9} sx={{
          minHeight: '400px',
          padding: { xs: '15px', md: '30px' }, 

        }}>
          <Box sx={{
            fontWeight: 'bold',
            fontSize: '20px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            <Box sx={{ marginRight: '10px',color:'#6B7280' }}>{icon}</Box>
            <Box sx={{fontWeight: 500, color:'#6B7280'}}>{title}</Box>
          </Box>
          <Box sx={{
            padding: '15px',
            height: { xs: '300px', sm: '400px', md: '100%' } 
          }}>
            {React.cloneElement(bchart, { isMobile: window.innerWidth < 600 })}
          </Box>
        </Grid>

       
        <Grid item xs={12} md={3} lg={3} sx={{
          minHeight: '300px',
          padding: { xs: '15px', md: '30px' },
          display: 'flex',
          flexDirection: 'column',
        }}>
          <Box sx={{
            height: '120px',
            marginTop: { xs: '20px', md: '30px' }, 
            padding: '20px',
            backgroundColor: '#f0f0f0',
            borderRadius: '8px',
            textAlign: 'center',
            boxShadow: 1,
            width: '100%'
          }}>
            <Box sx={{ fontWeight: 400, fontSize: '18px' }}>Total Revenue</Box>
            <Box sx={{ fontSize: '24px', marginTop: '8px' }}>₹{totalRevenue}</Box>
          </Box>

          <Box sx={{
            display: "flex",
            justifyContent: 'center',
            marginTop: { xs: '15px', md: '30px' }
          }}>
            <button
              className="w-full border border-purple-600 text-purple-600 py-3 px-4 rounded hover:bg-purple-600 hover:text-white transition-all duration-300"
              onClick={handleOpenSalesReportModal}
            >
              <DownloadIcon /> Sales Report
            </button>
          </Box>

          <Box sx={{
            display: "flex",
            justifyContent: 'center',
            marginTop: { xs: '15px', md: '30px' }
          }}>
            {maintenanceStatus === false ? (
              <button
                onClick={handleOpenModal}
                className="w-full border border-red-600 text-red-600 py-3 px-4 rounded hover:bg-red-600 hover:text-white transition-all duration-300"
              >
                <EngineeringIcon className="mr-2" />
                Set Maintenance
              </button>
            ) : (
              <button
                onClick={removeMaintenance}
                className="w-full border border-green-600 text-green-600 py-3 px-4 rounded hover:bg-green-600 hover:text-white transition-all duration-300"
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

      {isSalesReportModalOpen && (
        <DownloadSalesReoport isOpen={isSalesReportModalOpen} onClose={handleCloseSalesReportModal} venueId={venueId} />
      )}

    </>
  )
}