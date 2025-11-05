import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useParams, useNavigate, Link } from "react-router-dom";

export default function PropertyDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [prop, setProp] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const run = async () => {
      const res = await api.get(`/properties/${id}`);
      setProp(res.data);
    };
    run();
  }, [id]);

  if (!prop) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '100px 20px',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
        <div style={{ fontSize: '18px', color: '#626C71', fontWeight: 500 }}>Loading property details...</div>
      </div>
    );
  }

  const typeEmoji: any = {
    room: '🛏️',
    flat: '🏢',
    pg: '🏠',
    hostel: '🏘️',
    house: '🏡'
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Back Button */}
      <button
        onClick={() => nav('/listings')}
        style={{
          background: 'white',
          border: '2px solid rgba(6, 182, 212, 0.2)',
          borderRadius: '50px',
          padding: '10px 24px',
          marginBottom: '24px',
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: '14px',
          color: '#13343B',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.3s'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = 'rgba(6, 182, 212, 0.05)';
          e.currentTarget.style.borderColor = '#06B6D4';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'white';
          e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.2)';
        }}
      >
        ← Back to Listings
      </button>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 400px',
        gap: '32px'
      }}>
        {/* Left Column - Images & Details */}
        <div>
          {/* Image Gallery */}
          {prop.images?.length > 0 ? (
            <div style={{ marginBottom: '32px' }}>
              {/* Main Image */}
              <div style={{
                borderRadius: '20px',
                overflow: 'hidden',
                marginBottom: '16px',
                position: 'relative',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)'
              }}>
                <img
                  src={prop.images[selectedImage]?.url}
                  alt={prop.title}
                  style={{
                    width: '100%',
                    height: '500px',
                    objectFit: 'cover'
                  }}
                />
                {/* Property Type Badge */}
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  left: '20px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  padding: '8px 16px',
                  borderRadius: '50px',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#06B6D4',
                  border: '2px solid rgba(6, 182, 212, 0.3)'
                }}>
                  {typeEmoji[prop.propertyType]} {prop.propertyType.toUpperCase()}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: '12px'
              }}>
                {prop.images.map((img: any, i: number) => (
                  <div
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    style={{
                      borderRadius: '12px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: selectedImage === i ? '3px solid #06B6D4' : '3px solid transparent',
                      transition: 'all 0.3s',
                      opacity: selectedImage === i ? 1 : 0.6
                    }}
                  >
                    <img
                      src={img.url}
                      alt={`Image ${i + 1}`}
                      style={{
                        width: '100%',
                        height: '80px',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{
              height: '400px',
              background: 'linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '120px',
              marginBottom: '32px'
            }}>
              {typeEmoji[prop.propertyType] || '🏠'}
            </div>
          )}

          {/* Property Details Card */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(6, 182, 212, 0.1)'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 700,
              color: '#13343B',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              📝 Description
            </h2>
            <p style={{
              fontSize: '15px',
              lineHeight: '1.8',
              color: '#626C71',
              whiteSpace: 'pre-line'
            }}>
              {prop.description || 'No description available'}
            </p>
          </div>

          {/* Amenities */}
          {prop.amenities?.length > 0 && (
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '32px',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(6, 182, 212, 0.1)',
              marginTop: '24px'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 700,
                color: '#13343B',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                ✨ Amenities
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '12px'
              }}>
                {prop.amenities.map((amenity: string, i: number) => (
                  <div
                    key={i}
                    style={{
                      background: 'rgba(6, 182, 212, 0.05)',
                      border: '1px solid rgba(6, 182, 212, 0.1)',
                      borderRadius: '12px',
                      padding: '12px',
                      textAlign: 'center',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#06B6D4'
                    }}
                  >
                    {amenity}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Booking Card */}
        <div>
          <div style={{
            position: 'sticky',
            top: '24px',
            background: 'white',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(6, 182, 212, 0.1)'
          }}>
            <div style={{
              fontSize: '32px',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '8px'
            }}>
              ₹{prop.price.toLocaleString()}
            </div>
            <div style={{
              fontSize: '14px',
              color: '#626C71',
              fontWeight: 500,
              marginBottom: '24px'
            }}>
              per month
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div>
                <div style={{
                  fontSize: '12px',
                  color: '#626C71',
                  marginBottom: '4px'
                }}>
                  Property Type
                </div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#13343B'
                }}>
                  {prop.propertyType.charAt(0).toUpperCase() + prop.propertyType.slice(1)}
                </div>
              </div>
              <div>
                <div style={{
                  fontSize: '12px',
                  color: '#626C71',
                  marginBottom: '4px'
                }}>
                  Location
                </div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#13343B'
                }}>
                  {prop.city}
                </div>
              </div>
            </div>

            <Link
              to={`/book/${prop._id}`}
              style={{
                display: 'block',
                width: '100%',
                padding: '16px',
                background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
                color: 'white',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '16px',
                textAlign: 'center',
                boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)',
                marginBottom: '16px',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(6, 182, 212, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(6, 182, 212, 0.3)';
              }}
            >
              📅 Book Now
            </Link>

            <div style={{
              fontSize: '12px',
              color: '#626C71',
              textAlign: 'center',
              lineHeight: '1.6'
            }}>
              You won't be charged yet. By selecting "Book Now", you agree to KAYALSTAY's Terms of Service.
            </div>
          </div>

          {/* Owner Info */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(6, 182, 212, 0.1)',
            marginTop: '24px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#13343B',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              👤 Property Owner
            </h3>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '20px',
                fontWeight: 700
              }}>
                {prop.owner?.name?.charAt(0) || 'O'}
              </div>
              <div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#13343B'
                }}>
                  {prop.owner?.name || 'Property Owner'}
                </div>
                <div style={{
                  fontSize: '13px',
                  color: '#626C71'
                }}>
                  Property Owner
                </div>
              </div>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px'
            }}>
              <button
                style={{
                  padding: '12px',
                  background: 'rgba(6, 182, 212, 0.1)',
                  color: '#06B6D4',
                  borderRadius: '10px',
                  border: '1px solid rgba(6, 182, 212, 0.2)',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                📞 Call
              </button>
              <button
                style={{
                  padding: '12px',
                  background: 'rgba(6, 182, 212, 0.1)',
                  color: '#06B6D4',
                  borderRadius: '10px',
                  border: '1px solid rgba(6, 182, 212, 0.2)',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                💬 Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}