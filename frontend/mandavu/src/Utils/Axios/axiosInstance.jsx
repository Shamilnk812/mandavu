import axios from "axios";
import {jwtDecode} from "jwt-decode"
import dayjs from "dayjs"
import { UserLogin } from "../../Redux/Slices/User";
import { useDispatch } from "react-redux";
import { userUrl,ownerUrl,adminUrl} from "./EndPoints";
import { ChatUrl } from "./EndPoints";


const token = localStorage.getItem('access_token');
const refresh_token = localStorage.getItem('refresh_token');




const baseUrl="http://localhost:8000/api/v1"
// const baseUrl="https://mandavu.kickoffsaga.online/"



const refreshToken = async ()=> {
    const refreshToken = localStorage.getItem('refresh_token');
    // console.log('previous refresh token ',refreshToken)
       try{
        const response = await axios.post(`${baseUrl}/auth/token/refresh/`,{
            refresh:refreshToken
            
        })
        if (response.status === 200 || response.status === 201){
            localStorage.setItem("access_token", response.data.access);
            localStorage.setItem("refresh_token", response.data.refresh);
            // console.log('new tokens',response.data)
            return response.data.access

        }

      
    
    }catch(error){
        console.log("Failed to refresh token",error)
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user_email");
        localStorage.removeItem("user_id");
    }   
    return null
}







const addAuthInterceptor = (axiosInstance) =>{
    axiosInstance.interceptors.request.use(
        async (config) =>{
            const accessToken = localStorage.getItem('access_token')
            if (accessToken){
                const user = jwtDecode(accessToken)
                const isExp = dayjs.unix(user.exp).diff(dayjs())<1
                if (isExp){
                    const newAccessToken = await refreshToken()
                    if (newAccessToken){
                        config.headers.Authorization = ` Bearer ${newAccessToken}`
                    }
                }else{
                    config.headers.Authorization = `Bearer ${accessToken}`
                }
            }
            return config
        },
        (error)=>{
            return Promise.reject(error)
        }
    )
}






const axiosInstance= axios.create({
    baseURL:baseUrl,
    'Content-type':'application/json',
})
addAuthInterceptor(axiosInstance)


export const axiosUserInstance = axios.create({
        baseURL:userUrl,
        'Content-type':'application/json',        
    })
addAuthInterceptor(axiosUserInstance)    




    
export const axiosOwnerInstance = axios.create({
    baseURL:ownerUrl,
    'Content-type':'application/json',
}) 
addAuthInterceptor(axiosOwnerInstance)



export const axiosOwnerFormInstance = axios.create({
    baseURL:ownerUrl,
    'Content-type': 'multipart/form-data',
})
addAuthInterceptor(axiosOwnerFormInstance)



export const axiosChatInstance = axios.create({
    baseURL:ChatUrl,
    'Content-type':'application/json',

})
addAuthInterceptor(axiosChatInstance)


export const axiosAdminInstance = axios.create({
    baseURL:adminUrl,
    'Content-type':'application/json',
})
addAuthInterceptor(axiosAdminInstance)
    


export default axiosInstance