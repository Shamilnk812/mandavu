import { Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import DownloadIcon from '@mui/icons-material/Download';
import GenerateSalesReport from "../../Admin/GenerateSalesReportModal";

export default function ChartBox2({ baarchart, titel, icon3, totalRevenue }) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen]  = useState(false);


  const handleOpenModal = ()=> {
    setIsModalOpen(true);
  }
  
  const handleCloseModal = ()=> {
    setIsModalOpen(false);
  }

  return (
    <Grid 
    container sx={{
      width: '100%',
      minHeight: '600px',
      boxShadow: 2,
      borderRadius:'5px',
      justifyContent: 'space-between',
      marginBottom: '50px',
      flexDirection: { xs: 'column', md: 'row' } 
    }}   >
      
      {/* Left Side: Chart (70%) */}
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
          <Box  sx={{ marginRight: '10px',color:'#6B7280' }}>{icon3}</Box>
          <Box>{titel}</Box>
        </Box>
        <Box sx={{
            padding: '15px',
            height: { xs: '300px', sm: '400px', md: '100%' } 
          }}>
         {React.cloneElement(baarchart, { isMobile: window.innerWidth < 600 })}
            
          {/* {baarchart} */}
        </Box>
      </Grid>

      {/* Right Side: Button and Boxes (30%) */}
  <Grid item xs={12} md={3} lg={3} sx={{
          minHeight: '300px',
          padding: { xs: '15px', md: '30px' },
          display: 'flex',
          flexDirection: 'column',
        }}>    


        {/* Button at the Top */}
        {/* <Box sx={{display:"flex", justifyContent:'end'}}>
          <button onClick={() => navigate('/admin/view-all-bookings')} className="bg-purple-600 text-white  py-2 px-4 rounded">
            View All Details
          </button>
        </Box> */}

        {/* Total Revenue Box */}
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
          <Box sx={{ fontSize: '24px', marginTop: '8px' }}>₹{totalRevenue}</Box> {/* Placeholder for revenue amount */}
        </Box>

        <Box sx={{
            display: "flex",
            justifyContent: 'center',
            marginTop: { xs: '15px', md: '30px' }
          }}>
            <button
              className="w-full border border-purple-600 text-purple-600 py-3 px-4 rounded hover:bg-purple-600 hover:text-white transition-all duration-300"
              onClick={handleOpenModal}
            >
              <DownloadIcon /> Sales Report
            </button>
          </Box>
        <Box sx={{
            display: "flex",
            justifyContent: 'center',
            marginTop: { xs: '15px', md: '30px' }
          }}>
            <button
              className="w-full border border-purple-600 text-purple-600 py-3 px-4 rounded hover:bg-purple-600 hover:text-white transition-all duration-300"
              onClick={()=> navigate('/admin/view-platform-profit')}
            >
             View Profit
            </button>
          </Box>

      </Grid>

      {isModalOpen && (
      <GenerateSalesReport isOpen={isModalOpen} onClose={handleCloseModal} />
      )}
      
    </Grid>

   
  );
}











