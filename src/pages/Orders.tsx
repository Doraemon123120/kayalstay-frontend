import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getOrders, cancelOrder } from "../services/api";

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
  createdAt: string;
  updatedAt: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadOrders();
  }, [filter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const params = filter !== "all" ? { status: filter } : {};
      const response = await getOrders(params);
      setOrders(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await cancelOrder(orderId);
        loadOrders(); // Refresh orders
      } catch (err: any) {
        alert(err.response?.data?.error || "Failed to cancel order");
      }
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
        <div> Loading orders... </div>
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

  const filteredOrders = filter === "all" 
    ? orders 
    : orders.filter(order => order.status === filter);

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
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
        <h1 style={{
          fontSize: '38px',
          fontWeight: 900,
          marginBottom: '12px',
          letterSpacing: '1px'
        }}>My Orders</h1>
        <p style={{
          fontSize: '16px',
          opacity: 0.95,
          fontWeight: 500
        }}>Track your accessory rental orders</p>
      </div>

      {/* Filters */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '16px',
        marginBottom: '32px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
      }}>
        <div style={{ 
          display: 'flex', 
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          {["all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '20px',
                background: filter === status 
                  ? 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)' 
                  : 'rgba(139, 92, 246, 0.1)',
                color: filter === status ? 'white' : '#8B5CF6',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px', 
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
          <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>
            No orders found
          </h3>
          <p style={{ color: '#626C71', marginBottom: '24px' }}>
            {filter === "all" 
              ? "You haven't placed any orders yet" 
              : `You don't have any ${filter} orders`}
          </p>
          <Link
            to="/accessories"
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '10px',
              fontWeight: 700,
              boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
            }}
          >
            Browse Accessories
          </Link>
        </div>
      ) : (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '24px' 
        }}>
          {filteredOrders.map((order) => (
            <div 
              key={order._id}
              style={{
                background: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
              }}
            >
              {/* Order Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px 24px',
                borderBottom: '1px solid rgba(139, 92, 246, 0.1)'
              }}>
                <div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    marginBottom: '8px'
                  }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: 700,
                      margin: 0,
                      color: '#13343B'
                    }}>
                      Order #{order._id.substring(0, 8)}
                    </h3>
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
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '20px',
                    fontSize: '14px',
                    color: '#626C71'
                  }}>
                    <span>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                    <span>
                      ₹{order.totalAmount}
                    </span>
                    <span>
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '12px' }}>
                  {order.status === "pending" && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
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
                      Cancel
                    </button>
                  )}
                  <Link
                    to={`/orders/${order._id}`}
                    style={{
                      padding: '8px 16px',
                      background: 'rgba(139, 92, 246, 0.1)',
                      color: '#8B5CF6',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      borderRadius: '8px',
                      fontWeight: 600,
                      textDecoration: 'none'
                    }}
                  >
                    View Details
                  </Link>
                </div>
              </div>
              
              {/* Order Items */}
              <div style={{ padding: '16px 24px' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '16px'
                }}>
                  {order.items.slice(0, 3).map((item) => (
                    <div 
                      key={item._id}
                      style={{
                        display: 'flex',
                        gap: '12px'
                      }}
                    >
                      <div style={{ 
                        width: '60px', 
                        height: '60px', 
                        borderRadius: '8px',
                        overflow: 'hidden'
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
                      
                      <div>
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
                          fontSize: '13px', 
                          color: '#626C71' 
                        }}>
                          Qty: {item.quantity}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {order.items.length > 3 && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(139, 92, 246, 0.05)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#8B5CF6'
                    }}>
                      +{order.items.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}