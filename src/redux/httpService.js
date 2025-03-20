import axios from "axios";
import BASE_URL from "./config"; // Ensure you have this file with BASE_URL defined

const API_BASE_URL = BASE_URL;

// Create an Axios instance with default settings
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response Interceptor (For Handling Errors Globally)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

// HTTP Methods
const httpService = {
  get: async (url, params = {}) => {
    try {
      const response = await apiClient.get(url, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  post: async (url, data) => {
    try {
      const response = await apiClient.post(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  put: async (url, data) => {
    try {
      const response = await apiClient.put(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (url) => {
    try {
      const response = await apiClient.delete(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default httpService;
