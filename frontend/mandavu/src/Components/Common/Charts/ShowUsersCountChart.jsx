import * as React from 'react';
import { PieChart,pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';

const size = {
  width: 400,
  height: 200,
};

// Styling for the center label
const StyledText = styled('text')(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fontSize: 20,
}));

// Center label component
function PieCenterLabel({ children }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

export default function AllUsersCountChart({ allUsersCount }) {
//  
console.log('adfdsf',allUsersCount)
  const pieData = [
    { value: allUsersCount.users_count, label: 'Users', color: '#FFA500' }, // Orange for Users
    { value: allUsersCount.owners_count, label: 'Owners', color: '#FF6347' } // Red for Owners
  ];

  return (
    <PieChart 
    series={[
        {
          data: pieData,
          innerRadius: 50,
          highlightScope: { faded: 'global', highlighted: 'item' },
          faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
          arcLabel: (item) => `${item.value} `,
        }
      ]}
      {...size}
      sx={{
        [`& .${pieArcLabelClasses.root}`]: {
          fill: 'white',
          fontSize: 20,
        },
      }}
    >
      <PieCenterLabel>Total: {allUsersCount.allusers} </PieCenterLabel>
    </PieChart>
  );
}
