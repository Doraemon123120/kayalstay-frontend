import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, createBooking } from "../services/api";
import PaymentForm from "../components/PaymentForm";

type Property = {
  _id: string;
  title: string;
  city: string;
  price: number;
  propertyType: string;
  images?: { url: string }[];
};

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [specialRequests, setSpecialRequests] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await api.get(`/properties/${id}`);
        setProperty(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch property", err);
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const bookingData = {
        propertyId: id,
        startDate,
        endDate,
        guests,
        specialRequests
      };

      const res = await createBooking(bookingData);
      setBookingId(res.data._id);
      setShowPayment(true);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create booking");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentSuccess = () => {
    navigate("/my-bookings");
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
  };

  const calculateTotalPrice = () => {
    if (!property || !startDate || !endDate) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) return 0;
    
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return days * property.price;
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
        <div style={{ fontSize: '18px', color: '#626C71', fontWeight: 500 }}>Loading property details...</div>
      </div>
    );
  }

  if (!property) {
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
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏠</div>
        <h2 style={{
          fontSize: '28px',
          fontWeight: 700,
          color: '#13343B',
          marginBottom: '12px'
        }}>Property Not Found</h2>
        <p style={{
          color: '#626C71',
          marginBottom: '24px',
          fontSize: '16px'
        }}>The property you're trying to book doesn't exist.</p>
        <button
          onClick={() => navigate("/listings")}
          style={{
            background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
            color: 'white',
            padding: '14px 32px',
            borderRadius: '50px',
            border: 'none',
            fontSize: '16px',
            fontWeight: 700',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)'
          }}
        >
          Browse Properties
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '20px auto', padding: '20px' }}>
      <h1 style={{
        fontSize: '32px',
        fontWeight: 800,
        color: '#13343B',
        marginBottom: '24px'
      }}>
        Book Your Stay
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '30px'
      }}>
        {/* Property Info */}
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
            marginBottom: '20px'
          }}>
            Property Details
          </h2>
          
          {property.images && property.images.length > 0 && property.images[0]?.url ? (
            <img
              src={property.images[0].url}
              alt={property.title}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '12px',
                marginBottom: '20px'
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '200px',
              background: 'linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)',
              borderRadius: '12px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '64px'
            }}>
              🏠
            </div>
          )}
          
          <h3 style={{
            fontSize: '20px',
            fontWeight: 700,
            color: '#13343B',
            marginBottom: '8px'
          }}>
            {property.title}
          </h3>
          
          <div style={{
            fontSize: '16px',
            color: '#626C71',
            marginBottom: '12px'
          }}>
            📍 {property.city}
          </div>
          
          <div style={{
            fontSize: '24px',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '20px'
          }}>
            ₹{property.price.toLocaleString()} <span style={{ fontSize: '16px', fontWeight: 500, color: '#626C71' }}>/month</span>
          </div>
        </div>

        {/* Booking Form or Payment Form */}
        <div>
          {showPayment ? (
            <PaymentForm
              bookingId={bookingId}
              amount={calculateTotalPrice()}
              currency="INR"
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentCancel={handlePaymentCancel}
            />
          ) : (
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
                marginBottom: '20px'
              }}>
                Booking Information
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
              
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    color: '#13343B',
                    fontWeight: 600,
                    marginBottom: '8px',
                    fontSize: '14px'
                  }}>
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
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
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    color: '#13343B',
                    fontWeight: 600,
                    marginBottom: '8px',
                    fontSize: '14px'
                  }}>
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
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
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    color: '#13343B',
                    fontWeight: 600,
                    marginBottom: '8px',
                    fontSize: '14px'
                  }}>
                    Number of Guests
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
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
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    color: '#13343B',
                    fontWeight: 600,
                    marginBottom: '8px',
                    fontSize: '14px'
                  }}>
                    Special Requests (Optional)
                  </label>
                  <textarea
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: '2px solid rgba(6, 182, 212, 0.2)',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
                
                {startDate && endDate && (
                  <div style={{
                    background: 'linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)',
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
                      <span>₹{property.price.toLocaleString()} × {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))} days</span>
                      <span>₹{calculateTotalPrice().toLocaleString()}</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontWeight: 700,
                      fontSize: '18px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.3)',
                      paddingTop: '12px'
                    }}>
                      <span>Total</span>
                      <span>₹{calculateTotalPrice().toLocaleString()}</span>
                    </div>
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: 700,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)',
                    opacity: submitting ? 0.7 : 1
                  }}
                >
                  {submitting ? 'Processing...' : 'Proceed to Payment'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}