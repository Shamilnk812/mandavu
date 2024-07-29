import { Link,useNavigate } from "react-router-dom"


export default function Dash() {
    
    const navigate = useNavigate()
    return(
        <>
         <div class="min-h-screen bg-customColor3 flex justify-center items-center">
  <div class="absolute w-60 h-60 rounded-xl bg-customColor2 -top-5 -left-16 z-0 transform rotate-45 hidden md:block"></div>
  {/* <div class="absolute w-48 h-48 rounded-xl bg-purple-300 -bottom-6 -right-10 transform rotate-12 hidden md:block"></div> */}
  <div class="py-12 px-12 bg-customColor4 rounded-2xl shadow-xl z-20">
    <div>
      <h1 class="text-3xl font-bold text-center mb-4 cursor-pointer">Continue as a User</h1>
      <p class="w-80 text-center text-sm mb-8 font-semibold text-gray-700 tracking-wide cursor-pointer">Create an account to enjoy all the services</p>
    </div>
   
    <div class="text-center mt-6">
      <button class="w-full py-2 text-xl text-white bg-customColor5 rounded-lg hover:bg-customColor3 transition-all" onClick={()=>navigate('/user/signup')}>Create Account</button>
      <p class="mt-4 text-sm">Already Have An Account? <span class="underline  cursor-pointer"> <Link to={"/user/login"}>Login</Link></span></p>
    </div>
  </div>
  <div class="py-12 ml-10 px-12 bg-customColor4 rounded-2xl shadow-xl z-20">
    <div>
      <h1 class="text-3xl font-bold text-center mb-4 cursor-pointer">Continue as a Owner</h1>
      <p class="w-80 text-center text-sm mb-8 font-semibold text-gray-700 tracking-wide cursor-pointer">Create an account to register your convention center</p>
    </div>
    
    <div class="text-center mt-6">
      <button class="w-full py-2 text-xl text-white bg-customColor5 rounded-lg hover:bg-customColor3 transition-all" onClick={()=>navigate('owner/signup')}>Create Account</button>
      <p class="mt-4 text-sm">Already Have An Account? <span class="underline  cursor-pointer"> <Link to={'/owner/login'}>Login</Link></span></p>
    </div>
  </div>
  <div class="w-40 h-40 absolute bg-customColor2 rounded-full top-0 right-12 hidden md:block"></div>
  <div class="w-20 h-40 absolute bg-customColor2 rounded-full bottom-20 left-10 transform rotate-45 hidden md:block"></div>
</div>
        
        </>
    )
}