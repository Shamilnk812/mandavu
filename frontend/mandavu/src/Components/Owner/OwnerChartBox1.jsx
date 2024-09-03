import { Grid,Box } from "@mui/material"
import { useNavigate } from "react-router-dom";

export default function OwnerChartBox1({title,icon,bchart,totalRevenue}){
    const navigate = useNavigate();

    return(
        <>
        <Grid container sx={{ width: '100%', minHeight: '600px', boxShadow: 3, justifyContent: 'space-between', marginBottom: '40px' }}>
      
    
      <Grid item xs={9} sx={{ minHeight: '500px', padding: '30px' }}>
        <Box sx={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '20px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Box sx={{ marginRight: '10px' }}>{icon}</Box>
          <Box>{title}</Box>
        </Box>
        <Box sx={{ padding: '15px', backgroundColor: 'yellow'}}>
          {bchart}
        </Box>
      </Grid>

      
      <Grid item xs={3} sx={{ minHeight: '500px', padding: '30px', display: 'flex', flexDirection: 'column', }}>
        
        
        <Box sx={{display:"flex", justifyContent:'end'}}>
          <button onClick={() => navigate('/owner/booking-management')} className="bg-purple-600 text-white  py-2 px-4 rounded">
            View All Details
          </button>
        </Box>

        
        <Box sx={{height:'150px', marginTop:'100px', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px', textAlign: 'center', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', }}>
          <Box sx={{ fontWeight: 'bold', fontSize: '18px' }}>Total Revenue</Box>
          <Box sx={{ fontSize: '24px', marginTop: '10px' }}>${totalRevenue}</Box> 
        </Box>

        {/* <Box sx={{ height:'150px', marginTop:'100px', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px', textAlign: 'center',  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', }}>
          <Box sx={{ fontWeight: 'bold', fontSize: '18px' }}>Total Revenue</Box>
          <Box sx={{ fontSize: '24px', marginTop: '10px' }}>$0.00</Box> 
        </Box> */}

       

      </Grid>
      
    </Grid>
        </>
    )
}