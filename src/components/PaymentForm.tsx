import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { createPaymentIntent, confirmPayment } from "../services/api";

// Make sure to add your Stripe publishable key to your .env file
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_your_stripe_publishable_key_here");

type PaymentFormProps = {
  bookingId: string;
  amount: number;
  currency: string;
  onPaymentSuccess: () => void;
  onPaymentCancel: () => void;
};

// Stripe Payment Form Component
function StripePaymentForm({ 
  bookingId, 
  amount, 
  currency, 
  onPaymentSuccess, 
  onPaymentCancel 
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    const createPaymentIntentAsync = async () => {
      try {
        const res = await createPaymentIntent({
          bookingId,
          amount,
          currency
        });
        
        setClientSecret(res.data.clientSecret);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to initialize payment");
      }
    };

    createPaymentIntentAsync();
  }, [bookingId, amount, currency]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    setProcessing(true);
    setError(null);

    // Confirm the payment with Stripe
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: "if_required"
    });

    if (result.error) {
      setError(result.error.message || "Payment failed");
      setProcessing(false);
    } else {
      // Payment succeeded
      try {
        // Confirm payment on our backend
        await confirmPayment({
          paymentIntentId: result.paymentIntent?.id
        });
        
        onPaymentSuccess();
      } catch (err: any) {
        setError(err.response?.data?.error || "Payment confirmation failed");
      } finally {
        setProcessing(false);
      }
    }
  };

  if (!clientSecret) {
    return (
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
        border: '1px solid rgba(6, 182, 212, 0.1)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>💳</div>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 700,
          color: '#13343B',
          marginBottom: '12px'
        }}>
          Initializing Payment
        </h2>
        <p style={{
          fontSize: '16px',
          color: '#626C71',
          marginBottom: '24px'
        }}>
          Please wait while we prepare your payment...
        </p>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid rgba(6, 182, 212, 0.2)',
          borderTop: '4px solid #06B6D4',
          borderRadius: '50%',
          margin: '0 auto',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
      border: '1px solid rgba(6, 182, 212, 0.1)'
    }}>
      <h2 style={{
        fontSize: '24px',
        fontWeight: 700,
        color: '#13343B',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        Complete Your Payment
      </h2>
      
      <div style={{
        background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        color: 'white'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '8px'
        }}>
          <span>Total Amount</span>
          <span>₹{amount.toLocaleString()}</span>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontWeight: 700,
          fontSize: '18px',
          borderTop: '1px solid rgba(255, 255, 255, 0.3)',
          paddingTop: '12px'
        }}>
          <span>Payable Amount</span>
          <span>₹{amount.toLocaleString()}</span>
        </div>
      </div>
      
      {error && (
        <div style={{
          background: '#FEF2F2',
          border: '1px solid #FECACA',
          color: '#B91C1C',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <PaymentElement />
        
        <div style={{
          display: 'flex',
          gap: '12px',
          marginTop: '20px'
        }}>
          <button
            type="button"
            onClick={onPaymentCancel}
            disabled={processing}
            style={{
              flex: 1,
              padding: '14px',
              background: 'transparent',
              color: '#13343B',
              borderRadius: '12px',
              border: '2px solid rgba(6, 182, 212, 0.2)',
              fontSize: '16px',
              fontWeight: 700,
              cursor: processing ? 'not-allowed' : 'pointer',
              opacity: processing ? 0.7 : 1
            }}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={processing || !stripe}
            style={{
              flex: 1,
              padding: '14px',
              background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
              color: 'white',
              borderRadius: '12px',
              border: 'none',
              fontSize: '16px',
              fontWeight: 700,
              cursor: processing || !stripe ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)',
              opacity: processing || !stripe ? 0.7 : 1
            }}
          >
            {processing ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      </form>
    </div>
  );
}

// Main Payment Form Component
export default function PaymentForm(props: PaymentFormProps) {
  const [useStripe, setUseStripe] = useState(true);
  
  // For now, we'll always use Stripe. In a real app, you might want to 
  // allow users to choose between different payment methods.
  
  return (
    <Elements stripe={stripePromise}>
      <StripePaymentForm {...props} />
    </Elements>
  );
}
