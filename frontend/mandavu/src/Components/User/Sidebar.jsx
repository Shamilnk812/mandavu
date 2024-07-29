


export default function Sidebar() {
    return(
        <>
         <div class="bg-customColor2 text-white w-64 p-4 space-y-6">
            {/* <h1 class="text-2xl font-bold">User Profile</h1> */}
            <nav>
                <a href="#" class="block py-2.5 px-4 rounded transition duration-200 text-black hover:bg-customColor3">Dashboard</a>
                <a href="#" class="block py-2.5 px-4 rounded transition duration-200 text-black hover:bg-customColor3">Bookings</a>
                <a href="#" class="block py-2.5 px-4 rounded transition duration-200 text-black hover:bg-customColor3">Messages</a>
                <a href="#" class="block py-2.5 px-4 rounded transition duration-200 text-black hover:bg-customColor3">Logout</a>
            </nav>
        </div>
        </>
    )
}