import axios from 'axios';
import { config } from '../config/environment';

const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Interceptor to add auth token (if later we store one in cookies/localStorage)
apiClient.interceptors.request.use((cfg) => {
  // Example: read token from cookie
  // const token = cookies().get('admin_token');
  // if (token) cfg.headers!['Authorization'] = `Bearer ${token}`;
  return cfg;
});

export default apiClient;