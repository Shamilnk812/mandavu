import { Grid,Box } from "@mui/material"

export default function ChartBox() {
    return(
        <>
        <Grid container
        sx={{width:'100%', display:'flex', minHeight:'300px', boxShadow:3, justifyContent:'space-evenly'}}
        >
          <Grid
                item xs={12} sm={12} md={6} lg={6}
                sx={{minHeight:'200px', padding:'20px', backgroundColor:'yellow'}}
          >

          </Grid>
          <Grid
                item xs={12} sm={12} md={6} lg={6}
                sx={{minHeight:'200px', padding:'20px', backgroundColor:'yellowgreen'}}
          >

          </Grid>
        </Grid>
        </>
    )
}