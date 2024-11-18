import axios from "axios";
import axiosRetry from "axios-retry";

// Create an Axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api",
  timeout: 15000, // Set a timeout of 15 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Add retry functionality for failed requests
axiosRetry(api, {
  retries: 3, // Retry up to 3 times
  retryDelay: (retryCount) => retryCount * 1000, // Exponential backoff: 1s, 2s, 3s
  retryCondition: (error) =>
    error.response?.status >= 500 || !error.response, // Retry only on server errors or no response
});

// Request Interceptor: Add Authorization Token and Custom Headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Add additional custom headers if needed
    config.headers["X-Custom-Header"] = "CustomHeaderValue";
    return config;
  },
  (error) => {
    console.error("Error in request interceptor:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Errors and Logging
api.interceptors.response.use(
  (response) => {
    // Optionally log successful responses for debugging
    console.log("API Response:", response);
    return response;
  },
  (error) => {
    if (error.response) {
      // Log error responses for debugging
      console.error("API Error Response:", error.response);

      if (error.response.status === 401) {
        // Unauthorized: Log out the user and redirect to login
        console.warn("Unauthorized. Redirecting to login...");
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else if (error.response.status === 403) {
        // Forbidden: Show a permission error
        alert("You do not have permission to perform this action.");
      } else if (error.response.status >= 500) {
        // Server error: Display a generic message
        alert("A server error occurred. Please try again later.");
      }
    } else {
      // Handle network errors or no response
      console.error("Network error or no response:", error);
      alert("Network error. Please check your internet connection.");
    }

    return Promise.reject(error);
  }
);

// Export the Axios instance
export default api;
