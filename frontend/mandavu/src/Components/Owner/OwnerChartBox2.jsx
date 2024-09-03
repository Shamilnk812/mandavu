import { Grid,Box } from "@mui/material"



export default function OwnerChartBox2({title,icon,pchart}){
    return(
        <>
        <Grid container
        sx={{width:'100%', display:'flex', minHeight:'400px', boxShadow:3, justifyContent:'space-evenly'}}
        >
         
         <Grid
           sx={{minHeight:'500px', padding:'30px' }}>  
         <Box sx={{marginBottom:'20px', fontWeight:'bold', fontSize:'20px', display:'flex', flexDirection:'row' ,alignItems:'center'}}>
            <Box sx={{marginRight:'10px'}}>{icon}</Box>
            <Box>{title}</Box>
        </Box>   
         <Box sx={{padding:'15px'}}>{pchart}</Box>
         </Grid> 

        </Grid>
        </>
    )
}