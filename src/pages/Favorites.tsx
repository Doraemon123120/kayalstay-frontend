import { useEffect, useState } from "react";
import { getFavorites } from "../services/api";
import { Link } from "react-router-dom";

type Property = {
  _id: string;
  title: string;
  city: string;
  price: number;
  propertyType: string;
  images?: { url: string }[];
};

export default function Favorites() {
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const res = await getFavorites();
      setFavorites(res.data.favorites);
    } catch (err) {
      console.error("Failed to load favorites", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const typeEmoji: any = {
    room: '🛏️',
    flat: '🏢',
    pg: '🏠',
    hostel: '🏘️',
    house: '🏡'
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{
        fontSize: '32px',
        fontWeight: 800,
        color: '#13343B',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        ❤️ My Favorite Properties
      </h1>

      {loading ? (
        <div style={{
          textAlign: 'center',
          padding: '80px 20px',
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <div style={{ fontSize: '18px', color: '#626C71', fontWeight: 500 }}>Loading your favorites...</div>
        </div>
      ) : favorites.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '80px 40px',
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>❤️</div>
          <h2 style={{
            fontSize: '28px',
            fontWeight: 700,
            color: '#13343B',
            marginBottom: '12px'
          }}>No Favorites Yet</h2>
          <p style={{
            color: '#626C71',
            marginBottom: '24px',
            fontSize: '16px'
          }}>Start exploring properties and save your favorites!</p>
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
        <>
          <div style={{
            marginBottom: '20px',
            fontSize: '16px',
            fontWeight: 600,
            color: '#13343B'
          }}>
            You have {favorites.length} favorit{favorites.length === 1 ? 'e' : 'es'}
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px'
          }}>
            {favorites.map((p) => (
              <Link
                key={p._id}
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
                  <div style={{
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
                    fontSize: '18px',
                    color: '#FF4757'
                  }}>
                    ❤️
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
            ))}
          </div>
        </>
      )}
    </div>
  );
}