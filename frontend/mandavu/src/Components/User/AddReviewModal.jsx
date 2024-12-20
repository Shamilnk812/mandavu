import React, { useState } from "react";
import { toast } from "react-toastify";

const AddReviewModal = ({ isOpen, onClose, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState("");

    const handleStarClick = (index) => {
        setRating(index + 1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (rating === 0) {
            toast.warning("Please add a rating!");
            return;
        }
        onSubmit({ rating, reviewText });
        setRating(0);
        setReviewText("");
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                <h3 className="text-lg font-semibold mb-4">Add Review</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Rating</label>
                        <div className="flex mt-2">
                            {[...Array(5)].map((_, index) => (
                                <svg
                                    key={index}
                                    className={`w-6 h-6 cursor-pointer ${index < rating ? "text-yellow-500" : "text-gray-400"}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    onClick={() => handleStarClick(index)}
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.148c.969 0 1.371 1.24.588 1.81l-3.356 2.44a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.538 1.118l-3.357-2.44a1 1 0 00-1.175 0l-3.356 2.44c-.783.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118l-3.356-2.44c-.783-.57-.38-1.81.588-1.81h4.148a1 1 0 00.95-.69L9.049 2.927z" />
                                </svg>
                            ))}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Review</label>
                        <textarea
                            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                            rows="4"
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="mr-2 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-teal-700 text-white py-2 px-4 rounded-lg hover:bg-teal-800"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddReviewModal;
