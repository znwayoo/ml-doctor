import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor to handle errors
axiosInstance.interceptors.request.use(
  (config) => {
    // Ensure trailing slash is removed
    config.url = config.url.replace(/\/$/, '');
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const api = {
  getPrediction: async (formData) => {
    try {
      const response = await axiosInstance.post('/predict', formData);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  
  getDistribution: async (feature) => {
    try {
      const response = await axiosInstance.get(`/charts/distribution?feature=${feature}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching distribution:', error);
      throw error;
    }
  },
  
  getCorrelation: async () => {
    try {
      const response = await axiosInstance.get('/charts/correlation');
      return response.data;
    } catch (error) {
      console.error('Error fetching correlation:', error);
      throw error;
    }
  },
  
  getAverageRisk: async (feature) => {
    try {
      const response = await axiosInstance.get(`/charts/avg_risk?feature=${feature}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching average risk:', error);
      throw error;
    }
  }
};
