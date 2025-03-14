import { Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ChartBox2({ baarchart, titel, icon3, totalRevenue }) {
  const navigate = useNavigate();
  
  return (
    <Grid container sx={{ width: '100%', minHeight: '600px', boxShadow: 3, justifyContent: 'space-between', marginBottom: '40px' }}>
      
      {/* Left Side: Chart (70%) */}
      <Grid item xs={9} sx={{ minHeight: '500px', padding: '30px' }}>
        <Box sx={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '20px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Box sx={{ marginRight: '10px' }}>{icon3}</Box>
          <Box>{titel}</Box>
        </Box>
        <Box sx={{ padding: '15px', backgroundColor: 'white' ,boxShadow: 3 }}>
          {baarchart}
        </Box>
      </Grid>

      {/* Right Side: Button and Boxes (30%) */}
      <Grid item xs={3} sx={{ minHeight: '500px', padding: '30px', display: 'flex', flexDirection: 'column', }}>
        
        {/* Button at the Top */}
        {/* <Box sx={{display:"flex", justifyContent:'end'}}>
          <button onClick={() => navigate('/admin/view-all-bookings')} className="bg-purple-600 text-white  py-2 px-4 rounded">
            View All Details
          </button>
        </Box> */}

        {/* Total Revenue Box */}
        <Box sx={{height:'150px', marginTop:'100px', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px', textAlign: 'center', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', }}>
          <Box sx={{ fontWeight: 'bold', fontSize: '18px' }}>Total Revenue</Box>
          <Box sx={{ fontSize: '24px', marginTop: '10px' }}>₹{totalRevenue}</Box> {/* Placeholder for revenue amount */}
        </Box>

        {/* <Box sx={{ height:'150px', marginTop:'100px', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px', textAlign: 'center',  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', }}>
          <Box sx={{ fontWeight: 'bold', fontSize: '18px' }}>Total Revenue</Box>
          <Box sx={{ fontSize: '24px', marginTop: '10px' }}>$0.00</Box> 
        </Box> */}

       

      </Grid>
      
    </Grid>
  );
}
