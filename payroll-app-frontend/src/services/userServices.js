import { apiClient } from "../utils/api-client";

export async function login(user){
    const {data} = await apiClient.post("/auth/login",user)
    localStorage.setItem("token",data.access_token)
    return data
}

export function logout(){
    localStorage.removeItem("token")
    window.location.href = "/"
}

