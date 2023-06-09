import axios from "axios";
import { getItem, setItem, removeItem, KEY_ACCESS_TOKEN } from "./localStorageManager";
import store from "../redux/store" 
import { showToast } from "../redux/slices/appConfigSlice";
import { TOAST_FAILURE } from "../App";
export const axiosClient=axios.create({
    baseURL:process.env.REACT_APP_SERVER_BASE_URL,
    withCredentials: true // to allow cookies from client-->server
})

axiosClient.interceptors.request.use(
    (request)=>{
        const accessToken=getItem(KEY_ACCESS_TOKEN);
        request.headers['Authorization']=`Bearer ${accessToken}`;
        console.log("authorization: ",request.headers.Authorization)
        return request;
    }
)

axiosClient.interceptors.response.use(
    async (response)=>{
        // console.log("response: ",response)
        const data=response.data;
        if(data.status ==='ok'){
            return data;
        }
        const originalRequest=response.config;
        const statusCode=data.statusCode;
        const error=data.message;

        store.dispatch(showToast({
            type: TOAST_FAILURE,
            message:error
        }))
  
        if(statusCode===401){
            console.log("refresh called")
            const response=await axios.create({
                // to avoid infinitly call we have to create to new instant of axios
                baseURL:process.env.REACT_APP_SERVER_BASE_URL,
                withCredentials: true // to allow cookies from client-->server
            }).get("/auth/refresh")  // direct call to refresh end point

            // console.log("response from backend", response);
            if(response.data.status==='ok'){
                console.log("----------------I'm inside ok---------------------")
                setItem(KEY_ACCESS_TOKEN,response.result.accessToken);
                originalRequest.headers['Authorization']=`Bearer ${response.result.accessToken}`;

                return axios(originalRequest); // direct call to original request
            }else
            {
                
                // when refresh token expires Send user to login page
    
                removeItem(KEY_ACCESS_TOKEN);
                window.location.replace('/login','_self');
                return Promise.reject(error);
            }
        }

        return Promise.reject(error)
    }, async(error) =>{
        store.dispatch(showToast({
            type:TOAST_FAILURE,
            message:error.message
        }))
        
        return Promise.reject(error)
})

