import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrder } from "../services/api";

interface OrderItem {
  _id: string;
  accessory: {
    _id: string;
    name: string;
    images: Array<{ url: string }>;
  };
  quantity: number;
  rentalPeriod: string;
  startDate: string;
  endDate: string;
  pricePerUnit: number;
  totalPrice: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  paymentStatus: string;
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  deliveryInstructions: string;
  trackingNumber: string;
  estimatedDelivery: string;
  createdAt: string;
  updatedAt: string;
}

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const response = await getOrder(id!);
      setOrder(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "rgba(245, 158, 11, 0.1)";
      case "confirmed": return "rgba(59, 130, 246, 0.1)";
      case "processing": return "rgba(147, 51, 234, 0.1)";
      case "shipped": return "rgba(96, 165, 250, 0.1)";
      case "delivered": return "rgba(16, 185, 129, 0.1)";
      case "cancelled": return "rgba(239, 68, 68, 0.1)";
      default: return "rgba(156, 163, 175, 0.1)";
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "pending": return "#f59e0b";
      case "confirmed": return "#3b82f6";
      case "processing": return "#9333ea";
      case "shipped": return "#60a5fa";
      case "delivered": return "#10b981";
      case "cancelled": return "#ef4444";
      default: return "#9ca3af";
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
        <div> Loading order details... </div>
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

  if (!order) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px' 
      }}>
        Order not found
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: '24px' }}>
        <button 
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            color: '#8B5CF6',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          ← Back
        </button>
      </div>

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
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
        <h1 style={{
          fontSize: '38px',
          fontWeight: 900,
          marginBottom: '12px',
          letterSpacing: '1px'
        }}>
          Order Details
        </h1>
        <p style={{
          fontSize: '16px',
          opacity: 0.95,
          fontWeight: 500
        }}>
          Order #{order._id.substring(0, 8)}
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '32px'
      }}>
        {/* Order Items */}
        <div>
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
              Order Items
            </h2>
            
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '20px' 
            }}>
              {order.items.map((item) => (
                <div 
                  key={item._id}
                  style={{
                    display: 'flex',
                    padding: '16px',
                    borderBottom: '1px solid rgba(139, 92, 246, 0.1)'
                  }}
                >
                  <div style={{ 
                    width: '100px', 
                    height: '100px', 
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
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: 700,
                      margin: 0,
                      color: '#13343B',
                      marginBottom: '8px'
                    }}>
                      {item.accessory.name}
                    </h3>
                    
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr 1fr', 
                      gap: '16px',
                      marginBottom: '12px'
                    }}>
                      <div>
                        <div style={{ 
                          fontSize: '14px', 
                          color: '#626C71', 
                          marginBottom: '4px' 
                        }}>
                          Rental Period
                        </div>
                        <div style={{ 
                          fontSize: '16px', 
                          fontWeight: 600 
                        }}>
                          {item.rentalPeriod}
                        </div>
                      </div>
                      
                      <div>
                        <div style={{ 
                          fontSize: '14px', 
                          color: '#626C71', 
                          marginBottom: '4px' 
                        }}>
                          Dates
                        </div>
                        <div style={{ 
                          fontSize: '16px', 
                          fontWeight: 600 
                        }}>
                          {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div>
                        <div style={{ 
                          fontSize: '14px', 
                          color: '#626C71', 
                          marginBottom: '4px' 
                        }}>
                          Quantity
                        </div>
                        <div style={{ 
                          fontSize: '16px', 
                          fontWeight: 600 
                        }}>
                          {item.quantity}
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ 
                          fontSize: '14px', 
                          color: '#626C71', 
                          marginBottom: '4px' 
                        }}>
                          Price
                        </div>
                        <div style={{ 
                          fontSize: '16px', 
                          fontWeight: 600 
                        }}>
                          ₹{item.pricePerUnit} × {item.quantity}
                        </div>
                      </div>
                      
                      <div style={{ 
                        fontSize: '18px', 
                        fontWeight: 700,
                        color: '#13343B'
                      }}>
                        ₹{item.totalPrice}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Shipping Information */}
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
              Shipping Information
            </h2>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '20px' 
            }}>
              <div>
                <div style={{ 
                  fontSize: '14px', 
                  color: '#626C71', 
                  marginBottom: '8px' 
                }}>
                  Delivery Address
                </div>
                <div style={{ 
                  fontSize: '16px', 
                  fontWeight: 600,
                  marginBottom: '4px'
                }}>
                  {order.shippingAddress.address}
                </div>
                <div style={{ 
                  fontSize: '16px', 
                  color: '#626C71'
                }}>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </div>
                <div style={{ 
                  fontSize: '16px', 
                  color: '#626C71'
                }}>
                  {order.shippingAddress.country}
                </div>
              </div>
              
              {order.deliveryInstructions && (
                <div>
                  <div style={{ 
                    fontSize: '14px', 
                    color: '#626C71', 
                    marginBottom: '8px' 
                  }}>
                    Delivery Instructions
                  </div>
                  <div style={{ 
                    fontSize: '16px', 
                    color: '#626C71'
                  }}>
                    {order.deliveryInstructions}
                  </div>
                </div>
              )}
              
              {order.trackingNumber && (
                <div>
                  <div style={{ 
                    fontSize: '14px', 
                    color: '#626C71', 
                    marginBottom: '8px' 
                  }}>
                    Tracking Number
                  </div>
                  <div style={{ 
                    fontSize: '16px', 
                    fontWeight: 600
                  }}>
                    {order.trackingNumber}
                  </div>
                </div>
              )}
              
              {order.estimatedDelivery && (
                <div>
                  <div style={{ 
                    fontSize: '14px', 
                    color: '#626C71', 
                    marginBottom: '8px' 
                  }}>
                    Estimated Delivery
                  </div>
                  <div style={{ 
                    fontSize: '16px', 
                    fontWeight: 600
                  }}>
                    {new Date(order.estimatedDelivery).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
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
                <span style={{ color: '#626C71' }}>Order ID</span>
                <span style={{ fontWeight: 600 }}>#{order._id.substring(0, 8)}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '12px' 
              }}>
                <span style={{ color: '#626C71' }}>Order Date</span>
                <span style={{ fontWeight: 600 }}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '12px' 
              }}>
                <span style={{ color: '#626C71' }}>Status</span>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 600,
                  background: getStatusColor(order.status),
                  color: getStatusTextColor(order.status)
                }}>
                  {order.status}
                </span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '12px' 
              }}>
                <span style={{ color: '#626C71' }}>Payment Status</span>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 600,
                  background: order.paymentStatus === "paid" 
                    ? 'rgba(16, 185, 129, 0.1)' 
                    : 'rgba(245, 158, 11, 0.1)',
                  color: order.paymentStatus === "paid" 
                    ? '#10b981' 
                    : '#f59e0b'
                }}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '12px' 
              }}>
                <span style={{ color: '#626C71' }}>Subtotal</span>
                <span style={{ fontWeight: 600 }}>₹{order.totalAmount}</span>
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
                <span>₹{order.totalAmount}</span>
              </div>
            </div>
            
            {order.status === "pending" && (
              <button
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#dc2626',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel Order
              </button>
            )}
          </div>
          
          {/* Status Timeline */}
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
              Order Status
            </h2>
            
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: '16px'
            }}>
              {['pending', 'confirmed', 'processing', 'shipped', 'delivered'].map((status) => (
                <div 
                  key={status}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: order.status === status 
                      ? 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'
                      : getStatusColor(status),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 700
                  }}>
                    {order.status === status ? '✓' : ''}
                  </div>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: order.status === status ? 700 : 500,
                    color: order.status === status ? '#8B5CF6' : '#626C71'
                  }}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}