import axios from "axios";

// Define backend ports for different environments
const API_PORTS: Record<string, string> = {
  "localhost": "9000", // Development
  "staging.example.com": "8000", // Staging
  "production.example.com": "8080", // Production
};

// Get the current host (e.g., localhost, staging.example.com)
const currentHost = window.location.hostname;
// const currentHost = '143.244.143.15';
console.log('currentHost', currentHost)

// Set the base URL dynamically
const BASE_URL = `http://${currentHost}:${API_PORTS[currentHost] || "9000"}/api`;

console.log("API Base URL:", BASE_URL); // Debugging - remove in production

// Create Axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


// Common API Service
const apiService = {
  get: async (endpoint: string, params = {}) => {
    try {
      const response = await apiClient.get(endpoint, { params });
      return response.data;
    } catch (error) {
      console.error(`GET ${endpoint} failed`, error);
      throw error;
    }
  },

  post: async (endpoint: string, data: any) => {
    try {
      const response = await apiClient.post(endpoint, data);
      return response.data;
    } catch (error) {
      console.error(`POST ${endpoint} failed`, error);
      throw error;
    }
  },

  put: async (endpoint: string, data: any) => {
    try {
      const response = await apiClient.put(endpoint, data);
      return response.data;
    } catch (error) {
      console.error(`PUT ${endpoint} failed`, error);
      throw error;
    }
  },

  // delete: async (endpoint: string) => {
  //   try {
  //     await apiClient.delete(endpoint);
  //   } catch (error) {
  //     console.error(`DELETE ${endpoint} failed`, error);
  //     throw error;
  //   }
  // },

  // Ensure apiService.delete() returns the API response
  delete: async (endpoint: string) => {
    try {
      const response = await apiClient.delete(endpoint);
      return response.data;  // ✅ Ensure the function returns data
    } catch (error) {
      console.error(`DELETE ${endpoint} failed`, error);
      throw error;
    }
  },



};

export default apiService;
