import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000/api';

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
    const response = await axios.get(`${API_BASE_URL}/charts/distribution?feature=${feature}`);
    return response.data;
  },
  
  getCorrelation: async () => {
    const response = await axios.get(`${API_BASE_URL}/charts/correlation`);
    return response.data;
  },
  
  getAverageRisk: async (feature) => {
    const response = await axios.get(`${API_BASE_URL}/charts/avg_risk?feature=${feature}`);
    return response.data;
  }
};
