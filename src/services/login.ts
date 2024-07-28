import axiosInstance from '@/services/axiosInstance'; // Adjust the import path to where your axiosInstance is located
import axios, { AxiosResponse } from 'axios';
// Define the structure for the login response
// interface LoginResponse {
//     access: string;
//     refresh: string;
// }

// Function to handle login
export async function login(username: string, password: string): Promise<AxiosResponse<any>> {
    // try {
    const response = await axiosInstance.post('signin', {
        username,
        password,
    });
    return response;
}