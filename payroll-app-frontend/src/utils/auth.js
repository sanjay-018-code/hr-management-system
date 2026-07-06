import {jwtDecode} from "jwt-decode"

export function getJWT(){
    return localStorage.getItem("token")
}

export function getCurrentUser(){
    const token = getJWT()    
    if(!token){
        return null
    }
    try{
        return jwtDecode(token)
    }catch(error){
        return null
    }
}

export function isAuthenticated(){
    return !!getJWT()
}
