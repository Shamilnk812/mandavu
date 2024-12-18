import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';



export default function PaginationCmp({ setCurrentPage, currentPage, totalPages }) {
    return (
        <>
            <div className="flex justify-center mt-10 mb-5">
                <div className="p-4 flex items-center">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`p-1 rounded-full text-white transition-colors duration-300 
                                        ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-700 cursor-pointer'}`}
                    >
                        <NavigateBeforeIcon />
                    </button>
                    <span className="mx-4">Page {currentPage} of {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`p-1 rounded-full text-white transition-colors duration-300 
                                        ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-700 cursor-pointer'}`}
                    >
                        <NavigateNextIcon />
                    </button>
                </div>
            </div>
        </>
    )
}