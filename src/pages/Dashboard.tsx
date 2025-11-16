import { useEffect, useState } from "react";
import { api, getUser } from "../services/api";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const user = getUser();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await api.get("/properties");
      const mine = res.data.items.filter((p: any) => p.owner?._id === user?.id);
      setItems(mine);
      setLoading(false);
    };
    load();
  }, [user?.id]);

  const typeEmoji: any = {
    room: '🛏️',
    flat: '🏢',
    pg: '🏠',
    hostel: '🏘️',
    house: '🏡'
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
        borderRadius: '24px',
        padding: '48px 40px',
        marginBottom: '32px',
        color: 'white',
        boxShadow: '0 20px 60px rgba(6, 182, 212, 0.3)'
      }}>
        <h1 style={{
          fontSize: '38px',
          fontWeight: 900,
          marginBottom: '12px',
          letterSpacing: '1px'
        }}>Welcome back, {user?.name || 'User'}!</h1>
        <p style={{
          color: '#626C71',
          marginBottom: '30px',
          fontSize: '16px'
        }}>Manage your property listings on Quickit</p>

      </div>

      {/* Profile and Action Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        gap: '20px'
      }}>
        <div style={{ flex: 1 }}>
          <Link to="/profile" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'white',
            padding: '16px 24px',
            borderRadius: '16px',
            textDecoration: 'none',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(6, 182, 212, 0.1)',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(6, 182, 212, 0.15)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.08)';
          }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '20px',
              fontWeight: 700
            }}>
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <div style={{
                fontSize: '16px',
                fontWeight: 700,
                color: '#13343B',
                marginBottom: '2px'
              }}>
                {user?.name || 'User'}
              </div>
              <div style={{
                fontSize: '13px',
                color: '#626C71'
              }}>
                Manage your profile
              </div>
            </div>
          </Link>
        </div>
        
        <div style={{ display: 'flex', gap: '16px' }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: 700,
            color: '#13343B',
            margin: 0,
            alignSelf: 'center'
          }}>
            📋 My Listings ({items.length})
          </h2>
          <Link
            to="/new"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
              color: 'white',
              padding: '14px 32px',
              borderRadius: '50px',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '16px',
              boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)',
              transition: 'all 0.3s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            ➕ Add New Property
          </Link>
        </div>
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div style={{
          textAlign: 'center',
          padding: '80px 20px',
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <div style={{ fontSize: '18px', color: '#626C71', fontWeight: 500 }}>Loading your properties...</div>
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
          }}>No Properties Yet</h2>
          <p style={{
            color: '#626C71',
            marginBottom: '24px',
            fontSize: '16px'
          }}>Start by posting your first property!</p>
          <Link
            to="/new"
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
            ➕ Post Your First Property
          </Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {items.map((p) => (
            <div
              key={p._id}
              style={{
                background: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                transition: 'all 0.3s',
                border: '1px solid rgba(6, 182, 212, 0.1)',
                display: 'block',
                position: 'relative'
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
              {/* Property Image */}
              <Link to={`/listings/${p._id}`} style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{ position: 'relative' }}>
                {p.images?.[0]?.url ? (
                  <img
                    src={p.images[0].url}
                    alt={p.title}
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
                
                {/* Image Count Badge */}
                {p.images?.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '50px',
                    fontSize: '12px',
                    fontWeight: 700
                  }}>
                    {p.images.length} {p.images.length === 1 ? 'photo' : 'photos'}
                  </div>
                )}
                
                {/* Property Type Badge */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
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
              
              {/* Property Details */}
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
            
            {/* Edit Button */}
            <Link
              to={`/edit/${p._id}`}
              style={{
                position: 'absolute',
                bottom: '12px',
                right: '12px',
                background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '50px',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '12px',
                boxShadow: '0 4px 10px rgba(139, 92, 246, 0.3)',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 15px rgba(139, 92, 246, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(139, 92, 246, 0.3)';
              }}
            >
              ✏️ Edit
            </Link>
          </div>
        ))}
      </div>
    )}
  </div>
  );
}