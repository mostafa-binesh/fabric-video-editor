import { toast } from 'react-toastify';
import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { getRefreshToken } from '@/utils/auth';



// Define the structure for the user data
// type User = {
//     id: number;
//     name: string;
//     email: string;
//     // Add other user properties as needed
// };

// Define the structure of a validation error response
type ValidationError = {
    detail: string;
    errors: {
        [field: string]: string[];
    };
};

const baseUrl: string = 'http://localhost:8000/api';
const refreshTokenUrl: string = 'auth/refresh';
// Create a function to refresh the token
async function refreshToken(): Promise<string> {
    // Here you should implement the logic to call your refresh token endpoint.
    // Assuming the endpoint is '/auth/refresh' and it returns a new access token.
    const refreshToken = localStorage.getItem('refreshToken'); // Retrieve refresh token from storage
    const response = await axios.post(refreshTokenUrl, { refreshToken });
    const newAccessToken = response.data.accessToken;

    // Update tokens in storage
    localStorage.setItem('accessToken', newAccessToken);
    return newAccessToken;
}

// Create an Axios instance
const axiosInstance: AxiosInstance = axios.create({
    baseURL: baseUrl, // Replace with your API base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the JWT token
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // const accessToken = localStorage.getItem('accessToken');
        const accessToken = getRefreshToken();
        if (config.url && !config.url.endsWith('/')) {
            config.url += '/';
        }
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle 403 errors
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const newAccessToken = await refreshToken();
                axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error('Error refreshing token:', refreshError);
                return Promise.reject(refreshError);
            }
        }
        // console.log('error.response :>> ', error.response);
        if (error.response?.data?.data?.detail) {
            console.log('its here');
            toast.error(error.response?.data?.data?.detail);
        }

        // return Promise.reject(error);
        if (error.response) {
            // Return the error response object
            return Promise.resolve(error.response);
        }
        // Return a custom error object for network errors or other issues
        return Promise.resolve({
            status: 500,
            data: null,
            headers: {},
            config: error.config,
            statusText: 'Network Error',
        });
    }
);

export default axiosInstance;
