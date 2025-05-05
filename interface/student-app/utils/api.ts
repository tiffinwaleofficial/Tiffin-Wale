import axios from 'axios';

// API base URL from environment or fallback to default
const API_URL = process.env.API_BASE_URL || 'http://127.0.0.1:3001/';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api; 