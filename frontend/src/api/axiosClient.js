import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach the JWT (if present) to every outgoing request
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralize "session expired" handling: if the API ever returns 401,
// clear the stale session so the UI falls back to a logged-out state.
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

/**
 * Pulls a human-readable message out of an axios error, falling back
 * to a generic message if the API didn't send one.
 */
export const getErrorMessage = (error) => {
  return (
    error.response?.data?.message ||
    error.response?.data?.errors?.[0]?.message ||
    "Something went wrong. Please try again."
  );
};

/**
 * Express-validator errors come back as { errors: [{ field, message }] }.
 * Converts that into a simple { fieldName: message } map for inline
 * form field errors. Returns an empty object if there are none.
 */
export const getFieldErrors = (error) => {
  const errors = error.response?.data?.errors;
  if (!Array.isArray(errors)) return {};
  return errors.reduce((acc, err) => {
    if (err.field) acc[err.field] = err.message;
    return acc;
  }, {});
};

export default axiosClient;