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
    // Store token
    localStorage.setItem("token", token);
    console.log("Token stored in localStorage");
    
    // Store user
    localStorage.setItem("user", JSON.stringify(user));
    console.log("User stored in localStorage");
    
    // Verify storage
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    console.log("=== Verification ===");
    console.log("Stored token:", storedToken);
    console.log("Stored token length:", storedToken ? storedToken.length : 0);
    console.log("Stored user:", storedUser);
    
    if (storedToken !== token) {
      console.error("ERROR: Token mismatch after storage!");
    }
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

// Add response interceptor for detailed error logging
api.interceptors.response.use(
  (response) => {
    console.log("Response received:", response);
    return response;
  },
  (error) => {
    console.error("=== Axios Response Error ===");
    console.error("Error:", error);
    
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      console.error("Error response headers:", error.response.headers);
    } else if (error.request) {
      console.error("Error request:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
    
    return Promise.reject(error);
  }
);

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
