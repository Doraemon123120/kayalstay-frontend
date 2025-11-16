# KAYALSTAY Frontend

This is the frontend for the KAYALSTAY rental platform.

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
   ```
   
   `.env.production` (for production):
   ```
   VITE_API_URL=https://your-backend-url.com/api
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_actual_publishable_key_here
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
2. Update the `VITE_STRIPE_PUBLISHABLE_KEY` in your `.env` files:
   - For development: Use pk_test_ key
   - For production: Use pk_live_ key

## Testing Payments

For testing payments, use Stripe's test card numbers:
- Card: 4242 4242 4242 4242
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

## Deployment

This frontend is configured for deployment on Vercel. Connect your GitHub repository to Vercel for automatic deployments.