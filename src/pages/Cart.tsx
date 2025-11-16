import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCart, updateCartItem, removeFromCart, clearCart } from "../services/api";

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

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    try {
      await updateCartItem(itemId, newQuantity);
      loadCart(); // Refresh cart
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to update quantity");
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeFromCart(itemId);
      loadCart(); // Refresh cart
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to remove item");
    }
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      try {
        await clearCart();
        setCartItems([]);
      } catch (err: any) {
        alert(err.response?.data?.error || "Failed to clear cart");
      }
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

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px' 
      }}>
        <div> Loading cart... </div>
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
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛒</div>
        <h1 style={{
          fontSize: '38px',
          fontWeight: 900,
          marginBottom: '12px',
          letterSpacing: '1px'
        }}>Your Cart</h1>
        <p style={{
          fontSize: '16px',
          opacity: 0.95,
          fontWeight: 500
        }}>Review your selected accessories before checkout</p>
      </div>

      {cartItems.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px', 
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛒</div>
          <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>Your cart is empty</h3>
          <p style={{ color: '#626C71', marginBottom: '24px' }}>Add some accessories to get started</p>
          <button
            onClick={() => navigate("/accessories")}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
            }}
          >
            Browse Accessories
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '32px'
        }}>
          {/* Cart Items */}
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#13343B' }}>
                Cart ({cartItems.length} items)
              </h2>
              <button
                onClick={handleClearCart}
                style={{
                  padding: '8px 16px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#dc2626',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Clear Cart
              </button>
            </div>
            
            <div style={{ 
              background: 'white', 
              borderRadius: '16px', 
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' 
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
                      padding: '24px',
                      borderBottom: '1px solid rgba(139, 92, 246, 0.1)'
                    }}
                  >
                    <div style={{ 
                      width: '120px', 
                      height: '120px', 
                      borderRadius: '12px',
                      overflow: 'hidden',
                      marginRight: '20px'
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
                          fontSize: '24px'
                        }}>
                          📦
                        </div>
                      )}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        marginBottom: '8px'
                      }}>
                        <h3 style={{
                          fontSize: '18px',
                          fontWeight: 700,
                          margin: 0,
                          color: '#13343B'
                        }}>
                          {item.accessory.name}
                        </h3>
                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#dc2626',
                            cursor: 'pointer',
                            fontSize: '18px'
                          }}
                        >
                          ✕
                        </button>
                      </div>
                      
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px',
                        marginBottom: '16px'
                      }}>
                        <span style={{
                          background: 'rgba(139, 92, 246, 0.1)',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 600
                        }}>
                          {item.rentalPeriod}
                        </span>
                        <span style={{ color: '#626C71' }}>
                          {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <button
                            onClick={() => handleUpdateQuantity(item._id, Math.max(1, item.quantity - 1))}
                            style={{
                              width: '32px',
                              height: '32px',
                              border: '2px solid rgba(139, 92, 246, 0.2)',
                              borderRadius: '8px',
                              background: 'white',
                              color: '#13343B',
                              fontSize: '16px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            -
                          </button>
                          <span style={{
                            minWidth: '32px',
                            textAlign: 'center',
                            fontSize: '16px',
                            fontWeight: 700
                          }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                            style={{
                              width: '32px',
                              height: '32px',
                              border: '2px solid rgba(139, 92, 246, 0.2)',
                              borderRadius: '8px',
                              background: 'white',
                              color: '#13343B',
                              fontSize: '16px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            +
                          </button>
                        </div>
                        
                        <div style={{ fontSize: '18px', fontWeight: 700, color: '#13343B' }}>
                          ₹{totalPrice}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
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
                onClick={handleCheckout}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '18px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4)',
                  transition: 'all 0.3s'
                }}
              >
                Proceed to Checkout
              </button>
              
              <button
                onClick={() => navigate("/accessories")}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: 'white',
                  color: '#8B5CF6',
                  border: '2px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginTop: '12px'
                }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}