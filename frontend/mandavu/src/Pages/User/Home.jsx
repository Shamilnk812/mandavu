import Navb from "../../Components/User/Navb";
import { Link } from 'react-router-dom';



export default function Home() {
    return(
        <>
    <div className="min-h-screen flex flex-col">

        <Navb/>
        <main className="flex-grow flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Welcome, To Mandavu</h1>
                    <Link className="mt-2 bg-teal-600 text-white py-2 px-4 rounded hover:bg-gradient-to-r from-teal-500 to-gray-800" to='/user/show-all-venues'>View All Venues</Link> 
                    {/* <p className="text-xl">Enjoy your stay at our application.</p> */}
                </div>
        </main>
        </div>
        </>
    )
}