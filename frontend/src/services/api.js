import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

export const api = {
  getPrediction: async (formData) => {
    try {
      console.log('Sending to API:', formData); // Debug log
      const response = await axios.post(`${API_BASE_URL}/predict`, formData);
      console.log('API Response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      throw error;
    }
  },
  
  getDistribution: async (feature) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/charts/distribution?feature=${feature}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching distribution:', error);
      throw error;
    }
  },
  
  getCorrelation: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/charts/correlation`);
      return response.data;
    } catch (error) {
      console.error('Error fetching correlation:', error);
      throw error;
    }
  },
  
  getAverageRisk: async (feature) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/charts/avg_risk?feature=${feature}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching average risk:', error);
      throw error;
    }
  }
};
