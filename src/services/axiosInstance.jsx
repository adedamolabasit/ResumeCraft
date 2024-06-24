// services/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://0.0.0.0:8000', // Ensure this points to your FastAPI server
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
