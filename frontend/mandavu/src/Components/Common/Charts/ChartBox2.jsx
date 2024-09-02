import { Box, Grid } from "@mui/material"
import { useNavigate } from "react-router-dom"

export default function ChartBox2({baarchart,titel,icon3}) {
    const navigate = useNavigate();
    return(
        <>
        <Grid container
        sx={{width:'100%', display:'flex', minHeight:'600px', boxShadow:3, justifyContent:'space-evenly',marginBottom:'40px'}}
        >
         <Grid
           sx={{minHeight:'500px', padding:'30px' }}>  
         <Box sx={{marginBottom:'20px', fontWeight:'bold', fontSize:'20px', display:'flex', flexDirection:'row' ,alignItems:'center'}}>
            <Box sx={{marginRight:'10px'}}>{icon3}</Box>
            <Box>{titel}</Box>
        </Box>   
         <Box sx={{padding:'15px',backgroundColor:'yellow'}}>{baarchart}</Box>
         </Grid> 


         <Grid
           sx={{minHeight:'500px', padding:'30px' }}>  
         <Box>
            {/* <Box>{titel}</Box> */}
            <Box><button onClick={()=> navigate('/admin/view-all-bookings')} className="bg-purple-600">View All Detailis</button></Box>

        </Box>   
         {/* <Box sx={{padding:'15px',backgroundColor:'yellow'}}>{baarchart}</Box> */}
         </Grid> 
        </Grid>
        </>
    )
}