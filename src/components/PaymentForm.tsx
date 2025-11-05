import { useState } from "react";
import { createPaymentIntent, confirmPayment } from "../services/api";

type PaymentFormProps = {
  bookingId: string;
  amount: number;
  currency: string;
  onPaymentSuccess: () => void;
  onPaymentCancel: () => void;
};

export default function PaymentForm({ 
  bookingId, 
  amount, 
  currency, 
  onPaymentSuccess, 
  onPaymentCancel 
}: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [upiId, setUpiId] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"form" | "processing" | "success">("form");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError("");

    try {
      // Create payment intent
      const paymentIntentRes = await createPaymentIntent({
        bookingId,
        amount,
        currency
      });

      // In a real implementation, you would integrate with a payment provider here
      // For now, we'll simulate the payment processing
      setStep("processing");
      
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Confirm payment (in a real app, this would be done after actual payment processing)
      const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await confirmPayment({
        paymentId: paymentIntentRes.data.paymentId,
        transactionId
      });
      
      setStep("success");
      
      // Call success callback
      setTimeout(() => {
        onPaymentSuccess();
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Payment failed");
      setStep("form");
    } finally {
      setProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  if (step === "processing") {
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
          Processing Payment
        </h2>
        <p style={{
          fontSize: '16px',
          color: '#626C71',
          marginBottom: '24px'
        }}>
          Please wait while we process your payment...
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

  if (step === "success") {
    return (
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
        border: '1px solid rgba(6, 182, 212, 0.1)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>✅</div>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 700,
          color: '#13343B',
          marginBottom: '12px'
        }}>
          Payment Successful!
        </h2>
        <p style={{
          fontSize: '16px',
          color: '#626C71',
          marginBottom: '24px'
        }}>
          Your payment has been processed successfully.
        </p>
        <div style={{
          fontSize: '20px',
          fontWeight: 700,
          color: '#06B6D4',
          marginBottom: '24px'
        }}>
          ₹{amount.toLocaleString()}
        </div>
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
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            color: '#13343B',
            fontWeight: 600,
            marginBottom: '8px',
            fontSize: '14px'
          }}>
            Payment Method
          </label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px'
          }}>
            <button
              type="button"
              onClick={() => setPaymentMethod("credit_card")}
              style={{
                padding: '12px',
                background: paymentMethod === "credit_card" 
                  ? 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)' 
                  : 'rgba(6, 182, 212, 0.1)',
                color: paymentMethod === "credit_card" ? 'white' : '#06B6D4',
                borderRadius: '10px',
                border: '1px solid rgba(6, 182, 212, 0.2)',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Credit Card
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("debit_card")}
              style={{
                padding: '12px',
                background: paymentMethod === "debit_card" 
                  ? 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)' 
                  : 'rgba(6, 182, 212, 0.1)',
                color: paymentMethod === "debit_card" ? 'white' : '#06B6D4',
                borderRadius: '10px',
                border: '1px solid rgba(6, 182, 212, 0.2)',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Debit Card
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("upi")}
              style={{
                padding: '12px',
                background: paymentMethod === "upi" 
                  ? 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)' 
                  : 'rgba(6, 182, 212, 0.1)',
                color: paymentMethod === "upi" ? 'white' : '#06B6D4',
                borderRadius: '10px',
                border: '1px solid rgba(6, 182, 212, 0.2)',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              UPI
            </button>
          </div>
        </div>
        
        {paymentMethod === "upi" ? (
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: '#13343B',
              fontWeight: 600,
              marginBottom: '8px',
              fontSize: '14px'
            }}>
              UPI ID
            </label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="yourname@upi"
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '2px solid rgba(6, 182, 212, 0.2)',
                borderRadius: '10px',
                fontSize: '14px'
              }}
            />
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                color: '#13343B',
                fontWeight: 600,
                marginBottom: '8px',
                fontSize: '14px'
              }}>
                Card Number
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '2px solid rgba(6, 182, 212, 0.2)',
                  borderRadius: '10px',
                  fontSize: '14px'
                }}
              />
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              marginBottom: '20px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  color: '#13343B',
                  fontWeight: 600,
                  marginBottom: '8px',
                  fontSize: '14px'
                }}>
                  Expiry Date
                </label>
                <input
                  type="text"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  placeholder="MM/YY"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '2px solid rgba(6, 182, 212, 0.2)',
                    borderRadius: '10px',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  color: '#13343B',
                  fontWeight: 600,
                  marginBottom: '8px',
                  fontSize: '14px'
                }}>
                  CVV
                </label>
                <input
                  type="password"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="123"
                  maxLength={4}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '2px solid rgba(6, 182, 212, 0.2)',
                    borderRadius: '10px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>
          </>
        )}
        
        <div style={{
          display: 'flex',
          gap: '12px'
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
            disabled={processing}
            style={{
              flex: 1,
              padding: '14px',
              background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
              color: 'white',
              borderRadius: '12px',
              border: 'none',
              fontSize: '16px',
              fontWeight: 700,
              cursor: processing ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)',
              opacity: processing ? 0.7 : 1
            }}
          >
            {processing ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      </form>
    </div>
  );
}