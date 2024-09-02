import { Grid,Box } from "@mui/material"

export default function ChartBox1(props) {
  const {icon1,title1,chart1,icon2,title2,chart2} = props
  
    return(
        <>
        <Grid container
        sx={{width:'100%', display:'flex', minHeight:'300px', boxShadow:3, justifyContent:'space-evenly'}}
        >
          <Grid
                item xs={12} sm={12} md={6} lg={6}
                sx={{minHeight:'200px', padding:'20px', borderRight:'1px solid' }}
          >
                <Box sx={{marginBottom:'20px', fontWeight:'bold', fontSize:'20px', display:'flex', flexDirection:'row' ,alignItems:'center'}}>
                <Box sx={{marginRight:'10px'}}>{icon1} </Box>
                <Box>{title1} </Box>

                </Box>
                <Box>{chart1}</Box>
                
          </Grid>


          <Grid
                item xs={12} sm={12} md={6} lg={6}
                sx={{minHeight:'200px', padding:'20px',}}
          >
               <Box sx={{marginBottom:'20px', fontWeight:'bold', fontSize:'20px', display:'flex', flexDirection:'row' ,alignItems:'center'}}>
                <Box sx={{marginRight:'10px'}}>{icon2} </Box>
                <Box>{title2} </Box>

                </Box>
                <Box>{chart2}</Box>

          </Grid>
        </Grid>
        </>
    )
}