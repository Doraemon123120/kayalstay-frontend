import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyBookings, cancelBooking } from "../services/api";

type Booking = {
  _id: string;
  property: {
    _id: string;
    title: string;
    city: string;
    price: number;
    images?: { url: string }[];
  };
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  guests: number;
  createdAt: string;
};

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await getMyBookings();
      setBookings(res.data);
    } catch (err) {
      console.error("Failed to load bookings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancel = async (id: string) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    
    setCancelling(id);
    try {
      await cancelBooking(id);
      loadBookings(); // Refresh the list
    } catch (err) {
      console.error("Failed to cancel booking", err);
      alert("Failed to cancel booking");
    } finally {
      setCancelling(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "#10B981";
      case "pending": return "#F59E0B";
      case "cancelled": return "#EF4444";
      case "completed": return "#8B5CF6";
      default: return "#6B7280";
    }
  };

  if (loading) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '80px 20px',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
        maxWidth: '1200px',
        margin: '20px auto'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
        <div style={{ fontSize: '18px', color: '#626C71', fontWeight: 500 }}>Loading your bookings...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '20px auto', padding: '20px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 800,
          color: '#13343B'
        }}>
          My Bookings
        </h1>
        <Link
          to="/listings"
          style={{
            background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '50px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '14px',
            boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)'
          }}
        >
          Book New Stay
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '80px 40px',
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>📅</div>
          <h2 style={{
            fontSize: '28px',
            fontWeight: 700,
            color: '#13343B',
            marginBottom: '12px'
          }}>No Bookings Yet</h2>
          <p style={{
            color: '#626C71',
            marginBottom: '24px',
            fontSize: '16px'
          }}>Start exploring properties and book your perfect stay!</p>
          <Link
            to="/listings"
            style={{
              background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
              color: 'white',
              padding: '14px 32px',
              borderRadius: '50px',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '16px',
              boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)',
              display: 'inline-block'
            }}
          >
            Browse Properties
          </Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '24px'
        }}>
          {bookings.map((booking) => (
            <div
              key={booking._id}
              style={{
                background: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                border: '1px solid rgba(6, 182, 212, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}
            >
              {booking.property.images && booking.property.images.length > 0 && booking.property.images[0]?.url ? (
                <img
                  src={booking.property.images[0].url}
                  alt={booking.property.title}
                  style={{
                    height: '160px',
                    width: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <div style={{
                  height: '160px',
                  background: 'linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px'
                }}>
                  🏠
                </div>
              )}
              
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '12px'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#13343B',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {booking.property.title}
                  </h3>
                  <span style={{
                    background: getStatusColor(booking.status),
                    color: 'white',
                    padding: '4px 10px',
                    borderRadius: '50px',
                    fontSize: '12px',
                    fontWeight: 600,
                    textTransform: 'capitalize'
                  }}>
                    {booking.status}
                  </span>
                </div>
                
                <div style={{
                  fontSize: '14px',
                  color: '#626C71',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  📍 {booking.property.city}
                </div>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <div>
                    <div style={{
                      fontSize: '12px',
                      color: '#626C71',
                      marginBottom: '4px'
                    }}>
                      Check-in
                    </div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#13343B'
                    }}>
                      {new Date(booking.startDate).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div>
                    <div style={{
                      fontSize: '12px',
                      color: '#626C71',
                      marginBottom: '4px'
                    }}>
                      Check-out
                    </div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#13343B'
                    }}>
                      {new Date(booking.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div>
                    <div style={{
                      fontSize: '12px',
                      color: '#626C71',
                      marginBottom: '4px'
                    }}>
                      Guests
                    </div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#13343B'
                    }}>
                      {booking.guests}
                    </div>
                  </div>
                  
                  <div>
                    <div style={{
                      fontSize: '12px',
                      color: '#626C71',
                      marginBottom: '4px'
                    }}>
                      Total
                    </div>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: '#13343B'
                    }}>
                      ₹{booking.totalPrice.toLocaleString()}
                    </div>
                  </div>
                </div>
                
                <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                  <Link
                    to={`/listings/${booking.property._id}`}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: 'rgba(6, 182, 212, 0.1)',
                      color: '#06B6D4',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontWeight: 600,
                      fontSize: '14px',
                      textAlign: 'center',
                      border: '1px solid rgba(6, 182, 212, 0.2)'
                    }}
                  >
                    View Property
                  </Link>
                  
                  {booking.status === "pending" || booking.status === "confirmed" ? (
                    <button
                      onClick={() => handleCancel(booking._id)}
                      disabled={cancelling === booking._id}
                      style={{
                        flex: 1,
                        padding: '10px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#EF4444',
                        borderRadius: '8px',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        fontWeight: 600,
                        fontSize: '14px',
                        cursor: cancelling === booking._id ? 'not-allowed' : 'pointer',
                        opacity: cancelling === booking._id ? 0.7 : 1
                      }}
                    >
                      {cancelling === booking._id ? 'Cancelling...' : 'Cancel'}
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}