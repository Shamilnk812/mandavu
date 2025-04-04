import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Import the icon if using MUI
import ReviewsIcon from '@mui/icons-material/Reviews';
import { Grid, Box } from "@mui/material";
import { axiosUserInstance } from "../../Utils/Axios/axiosInstance";
import React from "react";
import Typography from '@mui/material/Typography';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';


export default function OwnerChartBox2({ title, icon, pchart }) {
    const venueId = useSelector((state) => state.owner?.venueId);
    const [reviews, setReviews] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 900); 

    const fetchReviews = async () => {
        try {
            const response = await axiosUserInstance.get(`get-reviews/${venueId}/`);
            setReviews(response.data);
            console.log(response.data);
        } catch (error) {
            toast.error('Failed to fetch reviews. Please try again later');
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [venueId]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 900);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <Grid container sx={{ 
            width: '100%', 
            display: 'flex', 
            minHeight: '400px', 
            boxShadow: 2,
            borderRadius: '5px',
            flexDirection: { xs: 'column', md: 'row' } 
        }}>
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
                    <Box sx={{ marginRight: '10px' }}>{icon}</Box>
                    <Box>{title}</Box>
                </Box>
                <Box sx={{ 
                    padding: '15px',
                    height: '300px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    {React.cloneElement(pchart, { isMobile })}
                </Box>
            </Grid>

          
            <Grid item xs={12} md={6} sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                padding: { xs: '15px', md: '30px' },
                overflowY: 'auto',
                maxHeight: { xs: '400px', md: '500px' }
            }}>
                <Box sx={{ 
                    marginBottom: '20px', 
                    fontWeight: 'bold', 
                    fontSize: '20px', 
                    display: 'flex', 
                    flexDirection: 'row', 
                    alignItems: 'center' 
                }}>
                    <Box sx={{ marginRight: '10px' }}><ReviewsIcon/></Box>
                    <Box>Reviews</Box>
                </Box>
                <Box sx={{ 
                    padding: { xs: '5px', md: '15px' },
                    className: "py-5 px-10"
                }}>
                    {reviews.length > 0 ? (
                        reviews.map((review) => (
                            <div key={review.id} className="mb-4 p-4 bg-white rounded shadow-lg">
                                <div className="flex items-center mb-2">
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <svg key={index} className={`w-4 h-4 ${index < review.rating ? 'text-yellow-300' : 'text-gray-300'} me-1`} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="font-bold text-md mb-1"><AccountCircleIcon /> {review.user_first_name} {review.user_last_name}</p>
                                <p className="ml-8 text-sm text-gray-600">{review.review}</p>
                            </div>
                        ))
                    ) : (
                        <Box sx={{ 
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: '8px',
                            textAlign: 'center',
                            marginTop: '25px'
                          }}>
                            <InfoOutlinedIcon sx={{ fontSize: 20, color: '#6c757d', mb: 1}} />
                            <Typography  sx={{ color: '#6c757d', fontSize:15 }}>
                              No reviews added yet
                            </Typography>
                          </Box>
                    )}
                </Box>
            </Grid>
        </Grid>
    );
}





