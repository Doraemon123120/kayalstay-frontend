import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAccessories } from "../services/api";
import { getToken } from "../services/api";

interface Accessory {
  _id: string;
  name: string;
  description: string;
  category: string;
  pricePerDay: number;
  pricePerWeek: number;
  pricePerMonth: number;
  images: Array<{ url: string }>;
  rating: number;
  reviewCount: number;
  owner: {
    name: string;
  };
}

export default function Accessories() {
  const navigate = useNavigate();
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const isAuthenticated = !!getToken();

  useEffect(() => {
    loadAccessories();
  }, []);

  const loadAccessories = async () => {
    try {
      setLoading(true);
      const response = await getAccessories();
      setAccessories(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load accessories");
    } finally {
      setLoading(false);
    }
  };

  const filteredAccessories = accessories.filter(accessory => {
    const matchesSearch = accessory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         accessory.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? accessory.category === selectedCategory : true;
    const matchesPrice = accessory.pricePerDay >= priceRange[0] && accessory.pricePerDay <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px' 
      }}>
        <div> Loading accessories... </div>
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
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛍️</div>
        <h1 style={{
          fontSize: '38px',
          fontWeight: 900,
          marginBottom: '12px',
          letterSpacing: '1px'
        }}>Rent Accessories</h1>
        <p style={{
          fontSize: '16px',
          opacity: 0.95,
          fontWeight: 500
        }}>Find the perfect accessories for your home or office</p>
        
        {isAuthenticated && (
          <button
            onClick={() => navigate('/new-accessory')}
            style={{
              marginTop: '20px',
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '12px 32px',
              borderRadius: '50px',
              border: '2px solid rgba(255, 255, 255, 0.4)',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            ➕ Add Accessory
          </button>
        )}
      </div>

      {/* Filters */}
      <div style={{
        background: 'white',
        padding: '24px',
        borderRadius: '16px',
        marginBottom: '32px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Search</label>
            <input
              type="text"
              placeholder="Search accessories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid rgba(139, 92, 246, 0.2)',
                borderRadius: '10px',
                fontSize: '15px'
              }}
            >
              <option value="">All Categories</option>
              <option value="furniture">Furniture</option>
              <option value="appliances">Appliances</option>
              <option value="utensils">Utensils</option>
              <option value="electronics">Electronics</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Price Range</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>₹{priceRange[0]}</span>
              <input
                type="range"
                min="0"
                max="10000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                style={{ flex: 1 }}
              />
              <span>₹{priceRange[1]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Accessories Grid */}
      {filteredAccessories.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px', 
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>No accessories found</h3>
          <p style={{ color: '#626C71' }}>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {filteredAccessories.map((accessory) => (
            <div 
              key={accessory._id}
              style={{
                background: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s',
                border: '1px solid rgba(139, 92, 246, 0.1)'
              }}
            >
              <div style={{ 
                height: '200px', 
                overflow: 'hidden',
                position: 'relative'
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
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px'
                  }}>
                    📦
                  </div>
                )}
              </div>
              
              <div style={{ padding: '20px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '12px'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    margin: 0,
                    color: '#13343B'
                  }}>
                    {accessory.name}
                  </h3>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '4px',
                    background: 'rgba(139, 92, 246, 0.1)',
                    padding: '4px 8px',
                    borderRadius: '20px'
                  }}>
                    <span>⭐</span>
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>
                      {accessory.rating > 0 ? accessory.rating.toFixed(1) : 'N/A'}
                    </span>
                  </div>
                </div>
                
                <p style={{
                  fontSize: '14px',
                  color: '#626C71',
                  marginBottom: '16px',
                  lineHeight: '1.5'
                }}>
                  {accessory.description.length > 100 
                    ? `${accessory.description.substring(0, 100)}...` 
                    : accessory.description}
                </p>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px'
                }}>
                  <span style={{
                    fontSize: '14px',
                    color: '#626C71',
                    background: 'rgba(139, 92, 246, 0.1)',
                    padding: '4px 10px',
                    borderRadius: '20px'
                  }}>
                    {accessory.category}
                  </span>
                  <span style={{ fontSize: '14px', color: '#626C71' }}>
                    by {accessory.owner.name}
                  </span>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px'
                }}>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#13343B' }}>
                      ₹{accessory.pricePerDay}
                    </div>
                    <div style={{ fontSize: '12px', color: '#626C71' }}>
                      per day
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#13343B' }}>
                      ₹{accessory.pricePerWeek}
                    </div>
                    <div style={{ fontSize: '12px', color: '#626C71' }}>
                      per week
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#13343B' }}>
                      ₹{accessory.pricePerMonth}
                    </div>
                    <div style={{ fontSize: '12px', color: '#626C71' }}>
                      per month
                    </div>
                  </div>
                </div>
                
                <Link
                  to={`/accessories/${accessory._id}`}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '12px',
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                    color: 'white',
                    textAlign: 'center',
                    textDecoration: 'none',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '14px',
                    boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)',
                    transition: 'all 0.3s'
                  }}
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}