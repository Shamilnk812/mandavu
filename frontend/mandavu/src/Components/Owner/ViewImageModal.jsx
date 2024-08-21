


export default function ViewImageModal({ imageSrc, onClose }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <img src={imageSrc} alt="Modal Content" className="max-w-full h-auto" />
                <button onClick={onClose} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg">
                    Close
                </button>
            </div>
        </div>
    );
}