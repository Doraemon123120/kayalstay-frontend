import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAccessory, addToCart } from "../services/api";

interface Accessory {
  _id: string;
  name: string;
  description: string;
  category: string;
  pricePerDay: number;
  pricePerWeek: number;
  pricePerMonth: number;
  quantity: number;
  condition: string;
  images: Array<{ url: string }>;
  rating: number;
  reviewCount: number;
  owner: {
    name: string;
  };
}

export default function AccessoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [accessory, setAccessory] = useState<Accessory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("day");
  const [quantity, setQuantity] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    loadAccessory();
  }, [id]);

  const loadAccessory = async () => {
    try {
      setLoading(true);
      const response = await getAccessory(id!);
      setAccessory(response.data);
      
      // Set default dates
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      setStartDate(today.toISOString().split('T')[0]);
      setEndDate(tomorrow.toISOString().split('T')[0]);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load accessory");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!accessory) return;
    
    try {
      setAddingToCart(true);
      await addToCart({
        accessoryId: accessory._id,
        quantity,
        rentalPeriod: selectedPeriod,
        startDate,
        endDate
      });
      
      // Show success message and navigate to cart
      alert("Accessory added to cart successfully!");
      navigate("/cart");
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to add accessory to cart");
    } finally {
      setAddingToCart(false);
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
        <div> Loading accessory details... </div>
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

  if (!accessory) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px' 
      }}>
        Accessory not found
      </div>
    );
  }

  const getPriceForPeriod = () => {
    switch (selectedPeriod) {
      case "day": return accessory.pricePerDay;
      case "week": return accessory.pricePerWeek;
      case "month": return accessory.pricePerMonth;
      default: return accessory.pricePerDay;
    }
  };

  const totalPrice = getPriceForPeriod() * quantity;

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

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '32px'
      }}>
        {/* Image Gallery */}
        <div>
          <div style={{
            height: '400px',
            borderRadius: '16px',
            overflow: 'hidden',
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {accessory.images && accessory.images.length > 0 ? (
              <img 
                src={accessory.images[0].url} 
                alt={accessory.name}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover' 
                }}
              />
            ) : (
              <div style={{ fontSize: '64px' }}>📦</div>
            )}
          </div>
          
          {accessory.images && accessory.images.length > 1 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px'
            }}>
              {accessory.images.slice(1, 5).map((image, index) => (
                <div 
                  key={index}
                  style={{
                    height: '80px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <img 
                    src={image.url} 
                    alt={`${accessory.name} ${index + 2}`}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover' 
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 800,
              color: '#13343B',
              marginBottom: '8px'
            }}>
              {accessory.name}
            </h1>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              marginBottom: '16px'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px'
              }}>
                <span>⭐</span>
                <span style={{ fontWeight: 600 }}>
                  {accessory.rating > 0 ? accessory.rating.toFixed(1) : 'N/A'}
                </span>
                <span style={{ color: '#626C71' }}>
                  ({accessory.reviewCount} reviews)
                </span>
              </div>
              
              <span style={{
                background: 'rgba(139, 92, 246, 0.1)',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 600
              }}>
                {accessory.category}
              </span>
              
              <span style={{
                background: 'rgba(6, 182, 212, 0.1)',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 600
              }}>
                {accessory.condition}
              </span>
            </div>
            
            <p style={{
              fontSize: '16px',
              color: '#626C71',
              lineHeight: '1.6',
              marginBottom: '24px'
            }}>
              {accessory.description}
            </p>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              padding: '20px',
              background: 'rgba(139, 92, 246, 0.05)',
              borderRadius: '12px',
              marginBottom: '24px'
            }}>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#13343B' }}>
                  ₹{accessory.pricePerDay}
                </div>
                <div style={{ fontSize: '14px', color: '#626C71' }}>
                  per day
                </div>
              </div>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 600, color: '#13343B' }}>
                  ₹{accessory.pricePerWeek}
                </div>
                <div style={{ fontSize: '14px', color: '#626C71' }}>
                  per week
                </div>
              </div>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 600, color: '#13343B' }}>
                  ₹{accessory.pricePerMonth}
                </div>
                <div style={{ fontSize: '14px', color: '#626C71' }}>
                  per month
                </div>
              </div>
            </div>
          </div>

          {/* Rental Options */}
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            marginBottom: '24px'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#13343B',
              marginBottom: '20px'
            }}>
              Rental Options
            </h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: 600 
              }}>
                Rental Period
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                {['day', 'week', 'month'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      border: selectedPeriod === period 
                        ? '2px solid #8B5CF6' 
                        : '2px solid rgba(139, 92, 246, 0.2)',
                      borderRadius: '10px',
                      background: selectedPeriod === period 
                        ? 'rgba(139, 92, 246, 0.1)' 
                        : 'white',
                      color: '#13343B',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: 600 
              }}>
                Quantity
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    width: '40px',
                    height: '40px',
                    border: '2px solid rgba(139, 92, 246, 0.2)',
                    borderRadius: '10px',
                    background: 'white',
                    color: '#13343B',
                    fontSize: '18px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  -
                </button>
                <span style={{
                  minWidth: '40px',
                  textAlign: 'center',
                  fontSize: '18px',
                  fontWeight: 700
                }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(accessory.quantity, quantity + 1))}
                  style={{
                    width: '40px',
                    height: '40px',
                    border: '2px solid rgba(139, 92, 246, 0.2)',
                    borderRadius: '10px',
                    background: 'white',
                    color: '#13343B',
                    fontSize: '18px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  +
                </button>
                <span style={{ color: '#626C71' }}>
                  (Available: {accessory.quantity})
                </span>
              </div>
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '16px',
              marginBottom: '20px'
            }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 600 
                }}>
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
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
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
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
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              background: 'rgba(139, 92, 246, 0.1)',
              borderRadius: '10px',
              marginBottom: '20px'
            }}>
              <div>
                <div style={{ fontSize: '16px', color: '#626C71' }}>Total</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#13343B' }}>
                  ₹{totalPrice}
                </div>
              </div>
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || accessory.quantity === 0}
              style={{
                width: '100%',
                padding: '16px',
                background: accessory.quantity === 0 
                  ? '#ccc' 
                  : addingToCart 
                    ? '#8B5CF6' 
                    : 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: 800,
                cursor: accessory.quantity === 0 || addingToCart ? 'not-allowed' : 'pointer',
                boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4)',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
            >
              {addingToCart ? '⏳ Adding...' : accessory.quantity === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}