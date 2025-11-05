import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = axios.create({ baseURL });

export function getToken() {
  return localStorage.getItem("token") || "";
}

export function setAuth(token: string, user: any) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

export function getUser() {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Favorite functions
export const addFavorite = (propertyId: string) => 
  api.post(`/auth/favorites/${propertyId}`);

export const removeFavorite = (propertyId: string) => 
  api.delete(`/auth/favorites/${propertyId}`);

export const getFavorites = () => 
  api.get(`/auth/favorites`);

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