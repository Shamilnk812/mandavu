import { BarChart } from '@mui/x-charts/BarChart';
import axios from 'axios';
import { useState, useEffect } from 'react';
import moment from 'moment'; // Import moment.js for date manipulation
import { useSelector } from 'react-redux';

export default function OwnerRevenueChart() {
  const venueId = useSelector((state) => state.owner?.venueId);
  const [revenueData, setRevenueData] = useState([]);
  const [xLabels, setXLabels] = useState([]);
  const [selectedView, setSelectedView] = useState('monthly');
  
  const fetchRevenueData = async (view) => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/v2/auth/get-all-revenue', {
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
    }
  };

  useEffect(() => {
    fetchRevenueData(selectedView);
  }, [selectedView]);

  const handleViewChange = (view) => {
    setSelectedView(view);
  };

  return (
    <div>
      <BarChart
        width={800}
        height={400}
        series={[
          { data: revenueData, label: 'Revenue', id: 'revenueId' },
        ]}
        xAxis={[{ data: xLabels, scaleType: 'band' }]}
      />
      <div className='flex justify-center mt-10 gap-2'>
        <button className='text-white bg-purple-600 py-1 px-4 rounded-sm hover:bg-purple-800 transition duration-300' onClick={() => handleViewChange('daily')}>Daily</button>
        <button className='text-white bg-purple-600 py-1 px-4 rounded-sm hover:bg-purple-800 transition duration-300' onClick={() => handleViewChange('weekly')}>Weekly</button>
        <button className='text-white bg-purple-600 py-1 px-4 rounded-sm hover:bg-purple-800 transition duration-300'  onClick={() => handleViewChange('monthly')}>Monthly</button>
        <button className='text-white bg-purple-600 py-1 px-4 rounded-sm hover:bg-purple-800 transition duration-300' onClick={() => handleViewChange('yearly')}>Yearly</button>
      </div>
    </div>
  );
}


