/**
 * Axios Configuration
 *
 * This file creates a custom Axios instance for communicating with
 * the backend API.
 *
 * It performs the following tasks:
 * 1. Sets the base URL of the backend server.
 * 2. Automatically attaches the JWT token to every request.
 * 3. Exports the configured Axios instance so that it can be reused
 *    throughout the application.
 */

import axios from "axios";

// Define a base url so we dont have to specify base URL again and again  
// Axios instance
const api = axios.create({
    baseURL: 'http://localhost:8080/api'
});


/**
 * Request interceptor.
 *
 * This function runs before every HTTP request.
 * It retrieves the JWT token from local storage and adds it
 * to the Authorization header.
 */

api.interceptors.request.use((config)=>{

    //Retrieve the token stored after sucessful login
    const token = localStorage.getItem("token");

    //Add the Authorization header only if a token exists.
    if(token)
        config.headers.Authorization = 'Bearer ' + token;

    //Return the modified configuration
    return config;

})

/**
 * Response Interceptor.
 *
 * This function intercepts responses from the API.
 * If the API returns a 401 Unauthorized status (e.g. token expired),
 * it clears local storage session data and redirects the user to the login page.
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("userName");
            localStorage.removeItem("userId");

            if (window.location.pathname !== "/") {
                window.location.href = "/";
            }
        }
        return Promise.reject(error);
    }
);

//export the configure Axios instance
export default api;

