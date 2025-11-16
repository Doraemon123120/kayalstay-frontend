import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { 
  getCart, 
  createOrder, 
  createPaymentIntent, 
  createRazorpayOrder, 
  verifyRazorpayPayment 
} from "../services/api";

interface CartItem {
  _id: string;
  accessory: {
    _id: string;
    name: string;
    images: Array<{ url: string }>;
    pricePerDay: number;
    pricePerWeek: number;
    pricePerMonth: number;
  };
  quantity: number;
  rentalPeriod: string;
  startDate: string;
  endDate: string;
}

export default function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activePaymentMethod, setActivePaymentMethod] = useState("razorpay");
  const [processing, setProcessing] = useState(false);
  
  // Shipping address state
  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India"
  });
  
  const [deliveryInstructions, setDeliveryInstructions] = useState("");

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const response = await getCart();
      setCartItems(response.data.items || []);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      let price = 0;
      switch (item.rentalPeriod) {
        case "day": price = item.accessory.pricePerDay; break;
        case "week": price = item.accessory.pricePerWeek; break;
        case "month": price = item.accessory.pricePerMonth; break;
      }
      return total + (price * item.quantity);
    }, 0);
  };

  const handlePlaceOrder = async () => {
    if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode) {
      alert("Please fill in all shipping address fields");
      return;
    }
    
    try {
      setProcessing(true);
      
      // Create order
      const orderData = {
        shippingAddress,
        deliveryInstructions
      };
      
      const orderResponse = await createOrder(orderData);
      const orderId = orderResponse.data._id;
      const totalAmount = orderResponse.data.totalAmount;
      
      if (activePaymentMethod === "razorpay") {
        await processRazorpayPayment(orderId, totalAmount);
      } else {
        await processStripePayment(orderId, totalAmount);
      }
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to place order");
    } finally {
      setProcessing(false);
    }
  };

  const processRazorpayPayment = async (orderId: string, amount: number) => {
    try {
      // Create Razorpay order
      const paymentResponse = await createRazorpayOrder({
        orderId,
        amount,
        currency: "INR"
      });
      
      const razorpayOrderId = paymentResponse.data.orderId;
      const paymentId = paymentResponse.data.paymentId;
      
      // Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount * 100, // Razorpay expects amount in paise
        currency: "INR",
        name: "Quickit",
        description: "Accessory Rental Payment",
        order_id: razorpayOrderId,
        handler: async function (response: any) {
          try {
            // Verify payment
            await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            
            // Payment successful
            alert("Payment successful!");
            navigate("/orders");
          } catch (err: any) {
            alert(err.response?.data?.error || "Payment verification failed");
          }
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#8B5CF6"
        }
      };
      
      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to initialize Razorpay payment");
    }
  };

  const processStripePayment = async (orderId: string, amount: number) => {
    try {
      // Create Stripe payment intent
      const paymentResponse = await createPaymentIntent({
        orderId,
        amount,
        currency: "inr"
      });
      
      const clientSecret = paymentResponse.data.clientSecret;
      
      // Initialize Stripe
      const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      const stripe = await stripePromise;
      
      if (!stripe) {
        throw new Error("Failed to load Stripe");
      }
      
      // Redirect to Stripe checkout
      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: {
            // In a real implementation, you would collect card details here
          },
          billing_details: {
            name: "Customer Name",
            email: "customer@example.com",
            address: {
              line1: shippingAddress.address,
              city: shippingAddress.city,
              state: shippingAddress.state,
              postal_code: shippingAddress.zipCode,
              country: "IN"
            }
          }
        }
      });
      
      if (error) {
        throw new Error(error.message);
      } else {
        // Payment successful
        alert("Payment successful!");
        navigate("/orders");
      }
    } catch (err: any) {
      alert(err.message || "Failed to process Stripe payment");
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px' 
      }}>
        <div> Loading checkout... </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px', 
        color: '#dc2626' 
      }}>
        {error}
      </div>
    );
  }

  const total = calculateTotal();

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
        borderRadius: '24px',
        padding: '48px 40px',
        marginBottom: '32px',
        textAlign: 'center',
        color: 'white',
        boxShadow: '0 20px 60px rgba(139, 92, 246, 0.3)'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>💳</div>
        <h1 style={{
          fontSize: '38px',
          fontWeight: 900,
          marginBottom: '12px',
          letterSpacing: '1px'
        }}>Checkout</h1>
        <p style={{
          fontSize: '16px',
          opacity: 0.95,
          fontWeight: 500
        }}>Complete your purchase securely</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '32px'
      }}>
        {/* Checkout Form */}
        <div>
          {/* Shipping Address */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: 700, 
              color: '#13343B', 
              marginBottom: '20px' 
            }}>
              Shipping Address
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 600 
                }}>
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid rgba(139, 92, 246, 0.2)',
                    borderRadius: '10px',
                    fontSize: '15px'
                  }}
                />
              </div>
              
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 600 
                }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid rgba(139, 92, 246, 0.2)',
                    borderRadius: '10px',
                    fontSize: '15px'
                  }}
                />
              </div>
            </div>
            
            <div style={{ marginTop: '16px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: 600 
              }}>
                Address
              </label>
              <input
                type="text"
                placeholder="Street address"
                value={shippingAddress.address}
                onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid rgba(139, 92, 246, 0.2)',
                  borderRadius: '10px',
                  fontSize: '15px',
                  marginBottom: '16px'
                }}
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 600 
                }}>
                  City
                </label>
                <input
                  type="text"
                  placeholder="City"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid rgba(139, 92, 246, 0.2)',
                    borderRadius: '10px',
                    fontSize: '15px'
                  }}
                />
              </div>
              
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 600 
                }}>
                  State
                </label>
                <input
                  type="text"
                  placeholder="State"
                  value={shippingAddress.state}
                  onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid rgba(139, 92, 246, 0.2)',
                    borderRadius: '10px',
                    fontSize: '15px'
                  }}
                />
              </div>
              
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 600 
                }}>
                  ZIP Code
                </label>
                <input
                  type="text"
                  placeholder="ZIP Code"
                  value={shippingAddress.zipCode}
                  onChange={(e) => setShippingAddress({...shippingAddress, zipCode: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid rgba(139, 92, 246, 0.2)',
                    borderRadius: '10px',
                    fontSize: '15px'
                  }}
                />
              </div>
            </div>
            
            <div style={{ marginTop: '16px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: 600 
              }}>
                Delivery Instructions (Optional)
              </label>
              <textarea
                placeholder="Any special delivery instructions..."
                value={deliveryInstructions}
                onChange={(e) => setDeliveryInstructions(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid rgba(139, 92, 246, 0.2)',
                  borderRadius: '10px',
                  fontSize: '15px',
                  minHeight: '80px'
                }}
              />
            </div>
          </div>
          
          {/* Payment Method */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: 700, 
              color: '#13343B', 
              marginBottom: '20px' 
            }}>
              Payment Method
            </h2>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '16px',
              marginBottom: '24px'
            }}>
              <button
                onClick={() => setActivePaymentMethod("razorpay")}
                style={{
                  padding: '16px',
                  border: activePaymentMethod === "razorpay" 
                    ? '2px solid #8B5CF6' 
                    : '2px solid rgba(139, 92, 246, 0.2)',
                  borderRadius: '10px',
                  background: activePaymentMethod === "razorpay" 
                    ? 'rgba(139, 92, 246, 0.1)' 
                    : 'white',
                  color: '#13343B',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
              >
                <span>💳</span>
                <span>Razorpay</span>
              </button>
              
              <button
                onClick={() => setActivePaymentMethod("stripe")}
                style={{
                  padding: '16px',
                  border: activePaymentMethod === "stripe" 
                    ? '2px solid #8B5CF6' 
                    : '2px solid rgba(139, 92, 246, 0.2)',
                  borderRadius: '10px',
                  background: activePaymentMethod === "stripe" 
                    ? 'rgba(139, 92, 246, 0.1)' 
                    : 'white',
                  color: '#13343B',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
              >
                <span>💳</span>
                <span>Stripe</span>
              </button>
            </div>
            
            {activePaymentMethod === "razorpay" ? (
              <div style={{
                padding: '20px',
                background: 'rgba(139, 92, 246, 0.05)',
                borderRadius: '10px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '24px', marginBottom: '12px' }}>🛡️</div>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: 700, 
                  marginBottom: '8px' 
                }}>
                  Secure Payment with Razorpay
                </h3>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#626C71',
                  marginBottom: '16px'
                }}>
                  Your payment information is securely processed by Razorpay
                </p>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: '8px' 
                }}>
                  <span style={{ fontSize: '24px' }}>💳</span>
                  <span style={{ fontSize: '24px' }}>📱</span>
                  <span style={{ fontSize: '24px' }}>🏦</span>
                </div>
              </div>
            ) : (
              <div style={{
                padding: '20px',
                background: 'rgba(139, 92, 246, 0.05)',
                borderRadius: '10px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '24px', marginBottom: '12px' }}>🔒</div>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: 700, 
                  marginBottom: '8px' 
                }}>
                  Secure Payment with Stripe
                </h3>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#626C71',
                  marginBottom: '16px'
                }}>
                  Your payment information is securely processed by Stripe
                </p>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: '8px' 
                }}>
                  <span style={{ fontSize: '24px' }}>💳</span>
                  <span style={{ fontSize: '24px' }}>📱</span>
                  <span style={{ fontSize: '24px' }}>🏦</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Order Summary */}
        <div>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            position: 'sticky',
            top: '24px'
          }}>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: 700, 
              color: '#13343B', 
              marginBottom: '20px' 
            }}>
              Order Summary
            </h2>
            
            <div style={{ 
              maxHeight: '300px', 
              overflowY: 'auto',
              marginBottom: '20px'
            }}>
              {cartItems.map((item) => {
                const price = 
                  item.rentalPeriod === "day" ? item.accessory.pricePerDay :
                  item.rentalPeriod === "week" ? item.accessory.pricePerWeek :
                  item.accessory.pricePerMonth;
                
                const totalPrice = price * item.quantity;
                
                return (
                  <div 
                    key={item._id}
                    style={{
                      display: 'flex',
                      padding: '12px 0',
                      borderBottom: '1px solid rgba(139, 92, 246, 0.1)'
                    }}
                  >
                    <div style={{ 
                      width: '60px', 
                      height: '60px', 
                      borderRadius: '8px',
                      overflow: 'hidden',
                      marginRight: '12px'
                    }}>
                      {item.accessory.images && item.accessory.images.length > 0 ? (
                        <img 
                          src={item.accessory.images[0].url} 
                          alt={item.accessory.name}
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover' 
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px'
                        }}>
                          📦
                        </div>
                      )}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <h4 style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        margin: 0,
                        color: '#13343B',
                        marginBottom: '4px'
                      }}>
                        {item.accessory.name}
                      </h4>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        fontSize: '13px',
                        color: '#626C71'
                      }}>
                        <span>Qty: {item.quantity}</span>
                        <span>₹{totalPrice}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '12px' 
              }}>
                <span style={{ color: '#626C71' }}>Subtotal</span>
                <span style={{ fontWeight: 600 }}>₹{total}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '12px' 
              }}>
                <span style={{ color: '#626C71' }}>Delivery</span>
                <span style={{ fontWeight: 600 }}>₹0</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '12px' 
              }}>
                <span style={{ color: '#626C71' }}>Tax</span>
                <span style={{ fontWeight: 600 }}>₹0</span>
              </div>
              <div style={{ 
                height: '1px', 
                background: 'rgba(139, 92, 246, 0.2)', 
                margin: '16px 0' 
              }}></div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                fontSize: '18px', 
                fontWeight: 700,
                color: '#13343B'
              }}>
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>
            
            <button
              onClick={handlePlaceOrder}
              disabled={processing || cartItems.length === 0}
              style={{
                width: '100%',
                padding: '16px',
                background: processing 
                  ? '#8B5CF6' 
                  : cartItems.length === 0
                    ? '#ccc'
                    : 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: 800,
                cursor: processing || cartItems.length === 0 ? 'not-allowed' : 'pointer',
                boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4)',
                transition: 'all 0.3s'
              }}
            >
              {processing ? '⏳ Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}