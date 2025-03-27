import { Grid, Box } from "@mui/material"


export default function ChartBox1(props) {
      const { icon1, title1, chart1, icon2, title2, chart2 } = props
     
      return (
            <>
                  <Grid container sx={{
                        width: '100%',
                        display: 'flex',
                        minHeight: '400px',
                        boxShadow: 2,
                        borderRadius: '5px',
                        flexDirection: { xs: 'column', md: 'row' }
                  }}>
                        {/* left side */}
                        <Grid item xs={12} md={6} sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              padding: { xs: '15px', md: '30px' },
                              borderBottom: { xs: '0.5px solid', md: 'none' },
                              borderRight: { xs: 'none', md: '0.5px solid' }
                        }}>


                              <Box sx={{
                                    marginBottom: '20px',
                                    fontWeight: 'bold',
                                    fontSize: '20px',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center'
                              }}>
                                    <Box sx={{ marginRight: '10px' }}>{icon1} </Box>
                                    <Box>{title1} </Box>

                              </Box>

                              <Box sx={{
                                    padding: '15px',
                                    height: '300px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                              }}>
                                    {chart1}
                              </Box>

                        </Grid>

                        {/* right side */}
                        <Grid item xs={12} md={6} sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              padding: { xs: '15px', md: '30px' },
                              borderBottom: { xs: '0.5px solid', md: 'none' },
                              borderRight: { xs: 'none', md: '0.5px solid' }
                        }}>

                              <Box sx={{
                                    marginBottom: '20px',
                                    fontWeight: 'bold',
                                    fontSize: '20px',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center'
                              }}>

                                    <Box sx={{ marginRight: '10px' }}>{icon2} </Box>
                                    <Box>{title2} </Box>

                              </Box>
                              <Box sx={{
                                    padding: '15px',
                                    height: '300px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                              }}>
                                    {chart2}
                              </Box>

                        </Grid>
                  </Grid>
            </>
      )
}