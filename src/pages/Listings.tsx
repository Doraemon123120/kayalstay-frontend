import { useEffect, useState } from "react";
import { api, addFavorite, removeFavorite, getFavorites, getPropertyAverageRating } from "../services/api";
import { Link } from "react-router-dom";
import MapSearch from "../components/MapSearch";

type Property = {
  _id: string;
  title: string;
  city: string;
  price: number;
  propertyType: string;
  images?: { url: string }[];
  amenities?: string[];
  available?: boolean;
  averageRating?: number;
  totalReviews?: number;
};

export default function Listings() {
  const [items, setItems] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [amenities, setAmenities] = useState("");
  const [sort, setSort] = useState("newest");
  const [favorites, setFavorites] = useState<string[]>([]);

  const load = async () => {
    setLoading(true);
    const params: any = {};
    if (city) params.city = city;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (propertyType) params.propertyType = propertyType;
    if (amenities) params.amenities = amenities;
    params.sort = sort;
    const res = await api.get("/properties", { params });
    
    // Fetch average ratings for each property
    const propertiesWithRatings = await Promise.all(
      res.data.items.map(async (property: Property) => {
        try {
          const ratingRes = await getPropertyAverageRating(property._id);
          return {
            ...property,
            averageRating: ratingRes.data.averageRating,
            totalReviews: ratingRes.data.totalReviews
          };
        } catch (err) {
          return {
            ...property,
            averageRating: 0,
            totalReviews: 0
          };
        }
      })
    );
    
    setItems(propertiesWithRatings);
    setLoading(false);
  };

  // Load user favorites
  const loadFavorites = async () => {
    try {
      const res = await getFavorites();
      setFavorites(res.data.favorites.map((fav: any) => fav._id));
    } catch (err) {
      console.error("Failed to load favorites", err);
    }
  };

  useEffect(() => { 
    load(); 
    loadFavorites();
  }, []);

  const typeEmoji: any = {
    room: '🛏️',
    flat: '🏢',
    pg: '🏠',
    hostel: '🏘️',
    house: '🏡'
  };

  // Toggle favorite status
  const toggleFavorite = async (propertyId: string) => {
    try {
      if (favorites.includes(propertyId)) {
        await removeFavorite(propertyId);
        setFavorites(favorites.filter(id => id !== propertyId));
      } else {
        await addFavorite(propertyId);
        setFavorites([...favorites, propertyId]);
      }
    } catch (err) {
      console.error("Failed to update favorite", err);
    }
  };

  // Handle properties update from MapSearch
  const handleMapSearchUpdate = (properties: any[]) => {
    // Convert properties to the format expected by the Listings page
    const formattedProperties = properties.map(property => ({
      ...property,
      averageRating: property.averageRating || 0,
      totalReviews: property.reviewCount || 0
    }));
    
    setItems(formattedProperties);
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)',
        borderRadius: '24px',
        padding: '48px 40px',
        marginBottom: '32px',
        textAlign: 'center',
        color: 'white',
        boxShadow: '0 20px 60px rgba(6, 182, 212, 0.3)'
      }}>
        <h1 style={{
          fontSize: '42px',
          fontWeight: 900,
          marginBottom: '12px',
          letterSpacing: '1px'
        }}>Find Your Perfect Stay</h1>
        <p style={{
          fontSize: '18px',
          opacity: 0.95,
          fontWeight: 500
        }}>Browse thousands of verified properties across India</p>
      </div>

      {/* Map Search Component */}
      <MapSearch onPropertiesUpdate={handleMapSearchUpdate} />

      {/* Search Filters */}
      <div style={{
        background: 'white',
        padding: '32px',
        borderRadius: '20px',
        marginBottom: '32px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
        border: '1px solid rgba(6, 182, 212, 0.1)'
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: 700,
          color: '#13343B',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          🔍 Search & Filter Properties
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '20px'
        }}>
          <div>
            <label style={{
              display: 'block',
              color: '#13343B',
              fontWeight: 600,
              marginBottom: '8px',
              fontSize: '13px'
            }}>📍 City</label>
            <input
              placeholder="Enter city name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
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
              fontSize: '13px'
            }}>💰 Min Rent</label>
            <input
              type="number"
              placeholder="Min price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
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
              fontSize: '13px'
            }}>💰 Max Rent</label>
            <input
              type="number"
              placeholder="Max price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
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
              fontSize: '13px'
            }}>🏠 Property Type</label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '2px solid rgba(6, 182, 212, 0.2)',
                borderRadius: '10px',
                fontSize: '14px',
                background: 'white'
              }}
            >
              <option value="">All Types</option>
              <option value="room">🛏️ Room</option>
              <option value="flat">🏢 Flat</option>
              <option value="pg">🏠 PG</option>
              <option value="hostel">🏘️ Hostel</option>
              <option value="house">🏡 House</option>
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              color: '#13343B',
              fontWeight: 600,
              marginBottom: '8px',
              fontSize: '13px'
            }}>✨ Amenities</label>
            <input
              placeholder="WiFi, AC, Parking"
              value={amenities}
              onChange={(e) => setAmenities(e.target.value)}
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
              fontSize: '13px'
            }}>🔄 Sort By</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '2px solid rgba(6, 182, 212, 0.2)',
                borderRadius: '10px',
                fontSize: '14px',
                background: 'white'
              }}
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        <button
          onClick={load}
          style={{
            width: '100%',
            padding: '14px',
            background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          🔍 Search Properties
        </button>
      </div>

      {/* Results */}
      {loading ? (
        <div style={{
          textAlign: 'center',
          padding: '80px 20px',
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <div style={{ fontSize: '18px', color: '#626C71', fontWeight: 500 }}>Loading amazing properties...</div>
        </div>
      ) : items.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '80px 40px',
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🏠</div>
          <h2 style={{
            fontSize: '28px',
            fontWeight: 700,
            color: '#13343B',
            marginBottom: '12px'
          }}>No Properties Found</h2>
          <p style={{
            color: '#626C71',
            marginBottom: '24px',
            fontSize: '16px'
          }}>Be the first to post a rental property on Quickit!</p>
          <a
            href="/signup"
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
            Get Started
          </a>
        </div>
      ) : (
        <>
          <div style={{
            marginBottom: '20px',
            fontSize: '16px',
            fontWeight: 600,
            color: '#13343B'
          }}>
            Found {items.length} propert{items.length === 1 ? 'y' : 'ies'}
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px'
          }}>
            {items.map((p) => (
              <div key={p._id} style={{ position: 'relative' }}>
                <Link
                  to={`/listings/${p._id}`}
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                    transition: 'all 0.3s',
                    textDecoration: 'none',
                    border: '1px solid rgba(6, 182, 212, 0.1)',
                    display: 'block'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(6, 182, 212, 0.15)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.06)';
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    {p.images && p.images.length > 0 && p.images[0]?.url ? (
                      <img
                        src={p.images[0].url}
                        alt={p.title}
                        loading="lazy"
                        style={{
                          height: '200px',
                          width: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <div style={{
                        height: '200px',
                        background: 'linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '64px'
                      }}>
                        {typeEmoji[p.propertyType] || '🏠'}
                      </div>
                    )}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      padding: '6px 12px',
                      borderRadius: '50px',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#06B6D4',
                      border: '1px solid rgba(6, 182, 212, 0.2)'
                    }}>
                      {p.propertyType.toUpperCase()}
                    </div>
                  </div>
                  <div style={{ padding: '20px' }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#13343B',
                      marginBottom: '8px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {p.title}
                    </h3>
                    <div style={{
                      fontSize: '14px',
                      color: '#626C71',
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      📍 {p.city}
                    </div>
                    
                    {/* Rating Display */}
                    {p.averageRating && p.averageRating > 0 && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '12px'
                      }}>
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span 
                              key={star} 
                              style={{ 
                                fontSize: '14px',
                                color: star <= p.averageRating! ? '#FBBF24' : '#E5E7EB'
                              }}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span style={{ 
                          fontSize: '13px', 
                          fontWeight: 600, 
                          color: '#13343B' 
                        }}>
                          {p.averageRating.toFixed(1)}
                        </span>
                        <span style={{ 
                          fontSize: '12px', 
                          color: '#626C71' 
                        }}>
                          ({p.totalReviews})
                        </span>
                      </div>
                    )}
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '12px',
                      borderTop: '1px solid rgba(6, 182, 212, 0.1)'
                    }}>
                      <div style={{
                        fontSize: '24px',
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}>
                        ₹{p.price.toLocaleString()}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#626C71',
                        fontWeight: 600
                      }}>/month</div>
                    </div>
                  </div>
                </Link>
                {/* Favorite Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite(p._id);
                  }}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(6, 182, 212, 0.2)',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '18px',
                    color: favorites.includes(p._id) ? '#FF4757' : '#C4C4C4',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  {favorites.includes(p._id) ? '❤️' : '🤍'}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}