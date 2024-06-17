// services/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000', // Ensure this points to your FastAPI server
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
