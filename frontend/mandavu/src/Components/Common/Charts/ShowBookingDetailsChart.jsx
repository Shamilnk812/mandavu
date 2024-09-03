import * as React from 'react';
import { pieArcLabelClasses, PieChart } from '@mui/x-charts/PieChart';

export default function ShowBookingStatusChart({bookingStatus}) {
  const chartData = bookingStatus.map((status,index)=> ({
    id: index,
    value:status.value,
    label:status.label,
    color: index === 0 ? 'orange' : index === 1 ? 'green' : 'red',
  }))

  
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
