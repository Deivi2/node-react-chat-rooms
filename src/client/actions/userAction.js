import axios from 'axios'
import {LOGIN_USER,AUTH_USER} from "./types";

export function loginUser(userData) {

    const request = axios.post('/api/user/loginUser', userData)
        .then(res => {
            return res.data
        });

    return{
        type: LOGIN_USER,
        payload: request
    }
}



export function authUser() {

    const request = axios.get('/api/users/auth')
        .then(res => res.data);

    return{
        type: AUTH_USER,
        payload: request
    }
}

