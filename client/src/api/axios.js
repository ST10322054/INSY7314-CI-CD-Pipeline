// client/src/api/axios.js
import axios from 'axios';

//(DeGuzman, 2022)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:443',
  withCredentials: true,
  timeout: 10000
});

export default api;
