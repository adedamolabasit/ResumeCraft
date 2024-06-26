import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://resumeclientserver.onrender.com', 
  timeout: 600000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
