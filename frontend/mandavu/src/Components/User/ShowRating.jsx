import axios from "axios"
import { axiosUserInstance } from "../../Utils/Axios/axiosInstance";
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { motion } from "framer-motion";


export default function ShowRating({ venueId, scrollVariants }) {
  const [reviews, setReviews] = useState([])
  const [ratingData, setRatingData] = useState({
    overall_rating: 0,
    total_ratings: 0,
    rating_distribution: []
  })

  const fetchRatings = async () => {
    try {
      const response = await axiosUserInstance.get(`get-ratings/${venueId}/`)
      setRatingData(response.data)
    } catch (error) {
      console.log(error)
      toast.error('Failed to fetch reviews. Please try again later')
    }
  }

  const fetchReviews = async () => {
    try {
      const response = await axiosUserInstance.get(`get-reviews/${venueId}/`)
      setReviews(response.data)
     
    } catch (error) {
      console.log(error)
      toast.error('Failed to fetch reviews. Please try again later')
    }
  }

  useEffect(() => {
    fetchRatings();
    fetchReviews();
  }, [venueId])

  return (
    <>


      <div className="my-16 rounded-lg bg-white shadow-lg lg:h-[465px] h-auto">
        <motion.div
          variants={scrollVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="text-center py-3">
            <h2 className="text-xl mt-3 font-semibold text-gray-600">Review & Ratings</h2>
            <p className="text-gray-600 text-sm mt-2">
              See what others are saying about our venues and share your own experience.
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={scrollVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="pl-4 py-5 md:flex md:justify-between md:pl-5"
        >
          {reviews.length > 0 && (
            <div className="w-full md:w-2/5 bg-white border p-4 mr-2 rounded shadow-xl mb-6 md:mb-0">
              <div className="flex justify-center mb-6">
                <h2 className="font-semibold text-gray-600 text-md">Overall Rating</h2>
              </div>
              <div className="flex items-center mb-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <svg
                    key={index}
                    className={`w-4 h-4 ${index < Math.round(ratingData.overall_rating)
                        ? "text-yellow-300"
                        : "text-gray-300"
                      } me-1`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 20"
                  >
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                  </svg>
                ))}
                <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                  {ratingData.overall_rating} out of 5
                </p>
              </div>
              <p className="text-md font-medium text-gray-500 dark:text-gray-400">
                {ratingData.total_ratings} global ratings
              </p>
              {ratingData.rating_distribution.map((item) => (
                <div key={item.rating} className="flex items-center mt-4">
                  <a
                    href="#"
                    className="text-sm font-medium text-blue-600 dark:text-blue-500"
                  >
                    {item.rating} star
                  </a>
                  <div className="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                    <div
                      className="h-5 bg-yellow-300 rounded"
                      style={{
                        width: `${(item.count / ratingData.total_ratings) * 100
                          }%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {Math.round((item.count / ratingData.total_ratings) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          
          
          )}

          <div className="py-5 md:px-10 bg-gray-100 h-[320px] rounded shadow overflow-y-auto px-4 lg:mx-4 w-full">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div
                  key={review.id}
                  className="mb-4 p-4 bg-white rounded shadow-lg"
                >
                  <div className="flex items-center mb-2">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <svg
                        key={index}
                        className={`w-4 h-4 ${index < review.rating
                            ? "text-yellow-300"
                            : "text-gray-300"
                          } me-1`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20"
                      >
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      </svg>
                    ))}
                  </div>
                  <p className="font-bold text-md mb-1">
                    <AccountCircleIcon /> {review.user_first_name}{" "}
                    {review.user_last_name}
                  </p>
                  <p className="ml-8 text-sm text-gray-600">{review.review}</p>
                </div>
              ))
            ) : (
              <p className="text-lg text-gray-500 text-center">No reviews available.</p>
            )}
          </div>
        </motion.div>
      </div>
    </>
  )
}
