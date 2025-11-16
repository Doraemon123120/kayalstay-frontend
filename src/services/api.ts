import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = axios.create({ baseURL });

export function getToken() {
  try {
    const token = localStorage.getItem("token") || "";
    return token;
  } catch (error) {
    console.error("Failed to retrieve token:", error);
    return "";
  }
}

export function setAuth(token: string, user: any) {
  if (!token) {
    console.error("No token provided to setAuth");
    return;
  }
  
  try {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  } catch (error) {
    console.error("Failed to store authentication:", error);
  }
}

export function getUser() {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}

api.interceptors.request.use((config) => {
  const token = getToken();
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  console.error("Request interceptor error:", error);
  return Promise.reject(error);
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized - Please login again");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

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

// Payment functions
export const createPaymentIntent = (paymentData: any) => 
  api.post(`/payments/create-payment-intent`, paymentData);

export const createRazorpayOrder = (paymentData: any) => 
  api.post(`/payments/create-razorpay-order`, paymentData);

export const verifyRazorpayPayment = (paymentData: any) => 
  api.post(`/payments/verify-razorpay-payment`, paymentData);

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

// Tiffin Center functions
export const getTiffinCenters = (params?: any) => 
  api.get(`/tiffin-centers`, { params });

export const getTiffinCenter = (id: string) => 
  api.get(`/tiffin-centers/${id}`);

export const createTiffinCenter = (tiffinCenterData: any) => 
  api.post(`/tiffin-centers`, tiffinCenterData);

export const updateTiffinCenter = (id: string, tiffinCenterData: any) => 
  api.put(`/tiffin-centers/${id}`, tiffinCenterData);

export const deleteTiffinCenter = (id: string) => 
  api.delete(`/tiffin-centers/${id}`);

export const addMenuItem = (tiffinCenterId: string, menuItem: any) => 
  api.post(`/tiffin-centers/${tiffinCenterId}/menu`, menuItem);

export const updateMenuItem = (tiffinCenterId: string, menuItemId: string, menuItem: any) => 
  api.put(`/tiffin-centers/${tiffinCenterId}/menu/${menuItemId}`, menuItem);

export const deleteMenuItem = (tiffinCenterId: string, menuItemId: string) => 
  api.delete(`/tiffin-centers/${tiffinCenterId}/menu/${menuItemId}`);

// Accessory functions
export const getAccessories = (params?: any) => 
  api.get(`/accessories`, { params });

export const getAccessory = (id: string) => 
  api.get(`/accessories/${id}`);

export const createAccessory = (accessoryData: any) => 
  api.post(`/accessories`, accessoryData);

export const updateAccessory = (id: string, accessoryData: any) => 
  api.put(`/accessories/${id}`, accessoryData);

export const deleteAccessory = (id: string) => 
  api.delete(`/accessories/${id}`);

// Cart functions
export const getCart = () => 
  api.get(`/cart`);

export const addToCart = (cartItem: any) => 
  api.post(`/cart/add`, cartItem);

export const updateCartItem = (itemId: string, quantity: number) => 
  api.put(`/cart/update/${itemId}`, { quantity });

export const removeFromCart = (itemId: string) => 
  api.delete(`/cart/remove/${itemId}`);

export const clearCart = () => 
  api.delete(`/cart/clear`);

// Order functions
export const getOrders = (params?: any) => 
  api.get(`/orders`, { params });

export const getOrder = (id: string) => 
  api.get(`/orders/${id}`);

export const createOrder = (orderData: any) => 
  api.post(`/orders`, orderData);

export const cancelOrder = (id: string) => 
  api.put(`/orders/${id}/cancel`);
