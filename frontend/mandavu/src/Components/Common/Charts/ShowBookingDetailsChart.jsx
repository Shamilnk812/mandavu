import * as React from 'react';
import { pieArcLabelClasses, PieChart } from '@mui/x-charts/PieChart';
import Typography from '@mui/material/Typography';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Box from '@mui/material/Box';



export default function ShowBookingStatusChart({bookingStatus}) {
  const hasData = bookingStatus.some(item => item.value > 0);
  const chartData = bookingStatus.map((status,index)=> ({
    id: index,
    value:status.value,
    label:status.label,
    color: index === 0 ? 'orange' : index === 1 ? 'green' : 'red',
  }))
  

  if (!hasData) {
    return (
      <Box sx={{ 
        width: 500, 
        height: 300,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <InfoOutlinedIcon sx={{ fontSize: 20, color: '#6c757d', mb: 2 }} />
        <Typography  sx={{ color: '#6c757d', fontSize:17 }}>
          No booking records found
        </Typography>
        <Typography  sx={{ color: '#adb5bd', fontSize:14, mt: 1 }}>
          Your booking data will appear here once available
        </Typography>
      </Box>
    );
  }
  
  return (
    <PieChart
      series={[
        {
          arcLabel: (item) => `${item.value} `,
          data:chartData,
          highlightScope: { faded: 'global', highlighted: 'item' },
          faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
        },
      ]}
      sx={{
        [`& .${pieArcLabelClasses.root}`]:{
          fill: 'white',
          fontSize: 20,

        }
      }}
      width={500}
      height={300}
    />
  );
}
