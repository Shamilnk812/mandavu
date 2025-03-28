import { BarChart } from '@mui/x-charts/BarChart';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import axios from 'axios';
import { useState, useEffect } from 'react';
import moment from 'moment'; // Import moment.js for date manipulation
import { useSelector } from 'react-redux';
import { axiosOwnerInstance } from '../../Utils/Axios/axiosInstance';
import { Grid, Box } from "@mui/material"
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';




export default function OwnerRevenueChart() {
  const venueId = useSelector((state) => state.owner?.venueId);
  const [revenueData, setRevenueData] = useState([]);
  const [xLabels, setXLabels] = useState([]);
  const [selectedView, setSelectedView] = useState('monthly');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const [loading, setLoading]  = useState(false);
  
  const fetchRevenueData = async (view) => {
    setLoading(true)
    try {
      const response = await axiosOwnerInstance.get('get-all-revenue', {
        params: { 
          view,
          venue_id: venueId 
        }
      });

      const data = response.data.data;
      console.log('dta is :',data)
      const formattedData = [];
      const labels = [];
      const currentDate = new Date();

      if (view === 'daily') {
        for (let i = 7; i >= 0; i--) {
          const currentDay = new Date(currentDate);
          currentDay.setDate(currentDate.getDate() - i);
          const day = currentDay.getDate();
          const month = currentDay.toLocaleString('default', { month: 'short' });
          const dayLabel = `${day} ${month}`;
          labels.push(dayLabel);

          const foundData = data.find(item => new Date(item.day).getDate() === day);
          formattedData.push(foundData ? foundData.total_revenue : 0);
        }
      } else if (view === 'weekly') {
        for (let i = 7; i >= 0; i--) {
          const currentWeekStart = new Date(currentDate);
          currentWeekStart.setDate(currentDate.getDate() - i * 7);

          const weekStart = moment(currentWeekStart).startOf('week').format('DD MMM');
          const weekEnd = moment(currentWeekStart).endOf('week').format('DD MMM');
          const weekLabel = `${weekStart}`;
          labels.push(weekLabel);

          const foundData = data.find(item => {
            const weekStartDate = moment(item.week).startOf('week');
            return moment(currentWeekStart).startOf('week').isSame(weekStartDate, 'day');
          });
          formattedData.push(foundData ? foundData.total_revenue : 0);
        }
      } else if (view === 'monthly') {
        for (let i = 7; i >= 0; i--) {
          const currentMonth = new Date(currentDate);
          currentMonth.setMonth(currentDate.getMonth() - i);
          const monthNumber = currentMonth.getMonth() + 1;
          const monthName = currentMonth.toLocaleString('default', { month: 'long' });
          labels.push(monthName);

          const foundData = data.find(item => new Date(item.month).getMonth() + 1 === monthNumber);
          formattedData.push(foundData ? foundData.total_revenue : 0);
        }
      } else if (view === 'yearly') {
        for (let i = 7; i >= 0; i--) {
          const currentYear = new Date(currentDate);
          currentYear.setFullYear(currentDate.getFullYear() - i);
          const yearNumber = currentYear.getFullYear();
          labels.push(`Year ${yearNumber}`);

          const foundData = data.find(item => new Date(item.year).getFullYear() === yearNumber);
          formattedData.push(foundData ? foundData.total_revenue : 0);
        }
      }

      setXLabels(labels);
      setRevenueData(formattedData);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    }finally{
      setLoading(false);
    }
  };

  console.log('this is reveneu data',revenueData)

  useEffect(() => {
    fetchRevenueData(selectedView);
  }, [selectedView]);

  const handleViewChange = (view) => {
    setSelectedView(view);
  };


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isEmptyRevenue = revenueData.length === 0 || revenueData.every(value => value === 0);

  if (loading) {
    return (
      <div style={{ 
        width: '100%', 
        height: isMobile ? '250px' : '350px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <CircularProgress />
      </div>
    );
  }


  if (isEmptyRevenue) {
    return (
      <div style={{ 
        width: '100%', 
        height: isMobile ? '250px' : '350px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '8px',
        padding: '20px',
        textAlign: 'center'
      }}>
        <Box sx={{ 
          fontSize: isMobile ? '1rem' : '1.2rem',
          color: '#6c757d',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <InfoOutlinedIcon fontSize={isMobile ? 'medium' : 'large'} />
          No revenue records found
        </Box>
        <Typography variant="body2" sx={{ 
          color: '#adb5bd',
          marginBottom: '20px',
          maxWidth: '300px'
        }}>
          Your revenue data will appear here once bookings are made.
        </Typography>
      </div>
    );
  }


  return (
    <div style={{ width: '100%', height: isMobile ? '250px' : '350px' }}>
    <BarChart
      width={isMobile ? window.innerWidth - 60 : undefined} // Adjust for mobile
      height={isMobile ? 250 : 370}
      series={[
        { data: revenueData, label: 'Revenue', id: 'revenueId' },
      ]}
      xAxis={[{ data: xLabels, scaleType: 'band' }]}
      margin={{
        left: isMobile ? 30 : 50,
        right: isMobile ? 10 : 30,
        top: isMobile ? 10 : 20,
        bottom: isMobile ? 40 : 60,
      }}
      sx={{
        '& .MuiChartsAxis-tickLabel': {
          fontSize: isMobile ? '0.7rem' : '0.8rem',
        },
        '& .MuiChartsAxis-label': {
          fontSize: isMobile ? '0.8rem' : '1rem',
        }
      }}
    />
    <div className='flex justify-center mt-4 md:mt-10 gap-2 flex-wrap'>
      <button className='text-white bg-purple-600 py-1 px-2 md:px-4 rounded-sm hover:bg-purple-800 transition duration-300 text-sm md:text-base' 
        onClick={() => handleViewChange('daily')}>Daily</button>
      <button className='text-white bg-purple-600 py-1 px-2 md:px-4 rounded-sm hover:bg-purple-800 transition duration-300 text-sm md:text-base' 
        onClick={() => handleViewChange('weekly')}>Weekly</button>
      <button className='text-white bg-purple-600 py-1 px-2 md:px-4 rounded-sm hover:bg-purple-800 transition duration-300 text-sm md:text-base'  
        onClick={() => handleViewChange('monthly')}>Monthly</button>
      <button className='text-white bg-purple-600 py-1 px-2 md:px-4 rounded-sm hover:bg-purple-800 transition duration-300 text-sm md:text-base' 
        onClick={() => handleViewChange('yearly')}>Yearly</button>
    </div>
  </div>
  );
}


