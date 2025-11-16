# Quickit Frontend

This is the frontend for the Quickit rental platform.

## Setup Instructions

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Create `.env` and `.env.production` files with the required variables:
   
   `.env` (for development):
   ```
   VITE_API_URL=http://localhost:5000/api
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
   VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id_here
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```
   
   `.env.production` (for production):
   ```
   VITE_API_URL=https://your-backend-url.com/api
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_actual_publishable_key_here
   VITE_RAZORPAY_KEY_ID=rzp_live_your_key_id_here
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## Stripe Payment Configuration

To enable real payments, you need to configure your Stripe publishable key:

1. Get your publishable key from https://dashboard.stripe.com/test/apikeys
2. Update the `VITE_STRIPE_PUBLISHABLE_KEY` variable in your `.env` files

## Razorpay Payment Configuration

To enable Razorpay payments:

1. Get your Razorpay key ID from https://dashboard.razorpay.com/app/keys
2. Update the `VITE_RAZORPAY_KEY_ID` variable in your `.env` files

## Google Maps Configuration

To enable Google Maps integration:

1. Create a Google Cloud Platform project at https://console.cloud.google.com/
2. Enable the Maps JavaScript API
3. Create an API key
4. Update the `VITE_GOOGLE_MAPS_API_KEY` variable in your `.env` files

## Features

- Property browsing and searching
- User authentication (signup, login, logout)
- Property management (create, read, update, delete)
- Booking system
- Payment processing (Stripe and Razorpay)
- Tiffin center management
- Accessories rental system with cart and order management
- Reviews and ratings
- Favorites system
- Profile management
- Google Maps integration for location-based services

## Development

This frontend is built with:
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios for API calls
- Stripe and Razorpay for payments
- Google Maps API for location services

## Deployment

This frontend is configured for deployment on Vercel. Simply connect your GitHub repository to Vercel for automatic deployments.