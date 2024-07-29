import axios from "axios";
import {jwtDecode} from "jwt-decode"
import dayjs from "dayjs"

// const token = localStorage.getItem('access_token') ? JSON.parse(localStorage.getItem('access_token')) : null
// const refresh_token = localStorage.getItem('refresh_token') ? JSON.parse(localStorage.getItem('refresh_token')) : null

const token = localStorage.getItem('access_token');
const refresh_token = localStorage.getItem('refresh_token');


const baseUrl="http://localhost:8000/api/v1"
const axiosInstance= axios.create({
    baseURL:baseUrl,
    'Content-type':'application/json',
    headers:{ 'Authorization' : localStorage.getItem('access_token') ? `Bearer ${token}` : null}
})

axiosInstance.interceptors.request.use( async req =>{
    if (token) {
        req.headers.Authorization = `Bearer ${token}`
        const user = jwtDecode(token)
        const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1
        console.log(isExpired)
        if (!isExpired) {
            return req
        }else {
            const res = await axios.post(`${baseUrl}/auth/token/refresh/`, {refresh:refresh_token})
            if (res.status === 200) {
                localStorage.setItem('access_token', JSON.stringify(res.data.access))
                req.headers.Authorization=`Bearer ${res.data.access_token}`
            }else{
                const res = await axios.post(`${baseUrl}/auth/logout/`, { "refresh_token": refresh_token });

                if (res.status === 200) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    localStorage.removeItem('user');
                    navigate("/login");
                    toast.success("Logout successfully");
                }
            }
        }
        return req
    }


})


export default axiosInstance