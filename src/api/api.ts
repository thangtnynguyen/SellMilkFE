import axios from "axios";
export const apiClient = axios.create({ 
    baseURL: 'https://localhost:7061/api',
    timeout: 1000 * 60 * 30 * 3, // 90 minutes
  });
  apiClient.interceptors.request.use(
    function (config) {
      let user = JSON.parse(localStorage.getItem('authToken') || '{}');
      config.headers.Authorization = "Bearer " + user;
      return config;
    },
    function (error) {
      return Promise.reject(error);
    },
  );