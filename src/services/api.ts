import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = axios.create({ baseURL });

export function getToken() {
  try {
    const token = localStorage.getItem("token") || "";
    console.log("=== getToken function called ===");
    console.log("Token retrieved from localStorage:", token);
    console.log("Token type:", typeof token);
    console.log("Token length:", token ? token.length : 0);
    console.log("All localStorage items:", {...localStorage});
    return token;
  } catch (error) {
    console.error("ERROR: Failed to retrieve token from localStorage:", error);
    return "";
  }
}

export function setAuth(token: string, user: any) {
  console.log("=== setAuth function called ===");
  console.log("Token received:", token);
  console.log("User received:", user);
  console.log("Token type:", typeof token);
  console.log("Token length:", token ? token.length : 0);
  
  if (!token) {
    console.error("ERROR: No token provided to setAuth");
    return;
  }
  
  try {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    console.log("=== Token successfully stored in localStorage ===");
    console.log("Stored token:", localStorage.getItem("token"));
    console.log("Stored user:", localStorage.getItem("user"));
  } catch (error) {
    console.error("ERROR: Failed to store token in localStorage:", error);
  }
}

export function getUser() {
  const raw = localStorage.getItem("user");
  console.log("getUser raw data:", raw);
  return raw ? JSON.parse(raw) : null;
}

api.interceptors.request.use((config) => {
  console.log("=== Axios Interceptor ===");
  console.log("Config:", config);
  
  const token = getToken();
  console.log("Token from getToken():", token);
  console.log("Token length:", token ? token.length : 0);
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Authorization header set:", config.headers.Authorization);
  } else {
    console.log("No token available, not setting Authorization header");
  }
  
  console.log("Final config:", config);
  return config;
}, (error) => {
  console.error("Interceptor error:", error);
  return Promise.reject(error);
});

// Favorite functions
export const addFavorite = (propertyId: string) => {
  console.log("Adding favorite:", propertyId);
  return api.post(`/auth/favorites/${propertyId}`);
}

export const removeFavorite = (propertyId: string) => {
  console.log("Removing favorite:", propertyId);
  return api.delete(`/auth/favorites/${propertyId}`);
}

export const getFavorites = () => {
  console.log("Getting favorites");
  return api.get(`/auth/favorites`);
}

// Profile functions
export const getProfile = () => 
  api.get(`/profile`);

export const updateProfile = (profileData: any) => 
  api.put(`/profile`, profileData);

export const updateAvatar = (avatar: string) => 
  api.put(`/profile/avatar`, { avatar });

// Review functions
export const createReview = (reviewData: any) => 
  api.post(`/reviews`, reviewData);

export const getPropertyReviews = (propertyId: string, page: number = 1, limit: number = 10) => 
  api.get(`/reviews/property/${propertyId}?page=${page}&limit=${limit}`);

export const getPropertyAverageRating = (propertyId: string) => 
  api.get(`/reviews/property/${propertyId}/average`);

export const updateReview = (id: string, reviewData: any) => 
  api.put(`/reviews/${id}`, reviewData);

export const deleteReview = (id: string) => 
  api.delete(`/reviews/${id}`);

// Payment functions
export const createPaymentIntent = (paymentData: any) => 
  api.post(`/payments/create-payment-intent`, paymentData);

export const confirmPayment = (paymentData: any) => 
  api.post(`/payments/confirm`, paymentData);

export const getPayment = (id: string) => 
  api.get(`/payments/${id}`);

export const refundPayment = (id: string) => 
  api.post(`/payments/${id}/refund`);

// Booking functions
export const createBooking = (bookingData: any) => 
  api.post(`/bookings`, bookingData);

export const getMyBookings = () => 
  api.get(`/bookings/my-bookings`);

export const getBooking = (id: string) => 
  api.get(`/bookings/${id}`);

export const cancelBooking = (id: string) => 
  api.put(`/bookings/${id}/cancel`);

export const getPropertyBookings = (propertyId: string) => 
  api.get(`/bookings/property/${propertyId}`);