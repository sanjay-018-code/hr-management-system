import axios from "axios";
import config from "../config.json";

export const apiClient = axios.create({
    baseURL: config.backend_url,
    headers:{
        "Content-Type":"application/json"
    }
});

apiClient.interceptors.request.use(
    config => {
        const token = localStorage.getItem("token")

        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)