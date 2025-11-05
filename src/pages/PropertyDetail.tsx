import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useParams, useNavigate } from "react-router-dom";

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
              marginTop: '24px',
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
                ⭐ Amenities
              </h2>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                {prop.amenities.map((amenity: string, i: number) => (
                  <div
                    key={i}
                    style={{
                      background: 'rgba(6, 182, 212, 0.08)',
                      padding: '10px 18px',
                      borderRadius: '50px',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#06B6D4',
                      border: '2px solid rgba(6, 182, 212, 0.2)'
                    }}
                  >
                    ✓ {amenity}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Location */}
          {prop.address && (
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '32px',
              marginTop: '24px',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(6, 182, 212, 0.1)'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 700,
                color: '#13343B',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                📍 Location
              </h2>
              <p style={{
                fontSize: '15px',
                color: '#626C71',
                lineHeight: '1.6'
              }}>
                {prop.address}
              </p>
            </div>
          )}
        </div>

        {/* Right Column - Price & Contact Card */}
        <div style={{ position: 'sticky', top: '20px', height: 'fit-content' }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
            border: '2px solid rgba(6, 182, 212, 0.15)'
          }}>
            {/* Title */}
            <h1 style={{
              fontSize: '28px',
              fontWeight: 800,
              color: '#13343B',
              marginBottom: '12px',
              lineHeight: '1.3'
            }}>
              {prop.title}
            </h1>

            {/* City */}
            <div style={{
              fontSize: '16px',
              color: '#626C71',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 500
            }}>
              📍 {prop.city}
            </div>

            {/* Price */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
              padding: '24px',
              borderRadius: '16px',
              marginBottom: '24px',
              textAlign: 'center',
              border: '2px solid rgba(6, 182, 212, 0.2)'
            }}>
              <div style={{
                fontSize: '14px',
                color: '#626C71',
                marginBottom: '8px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Monthly Rent
              </div>
              <div style={{
                fontSize: '48px',
                fontWeight: 900,
                background: 'linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: '1'
              }}>
                ₹{prop.price.toLocaleString()}
              </div>
            </div>

            {/* Contact Section */}
            <div style={{
              paddingTop: '24px',
              borderTop: '2px solid rgba(6, 182, 212, 0.1)',
              marginBottom: '20px'
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
                📞 Contact Owner
              </h3>

              {prop.contactPhone && (
                <a
                  href={`tel:${prop.contactPhone}`}
                  style={{
                    display: 'block',
                    background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
                    color: 'white',
                    padding: '14px 24px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '16px',
                    textAlign: 'center',
                    marginBottom: '12px',
                    boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)',
                    transition: 'all 0.3s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(6, 182, 212, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(6, 182, 212, 0.3)';
                  }}
                >
                  📱 {prop.contactPhone}
                </a>
              )}

              {prop.contactEmail && (
                <a
                  href={`mailto:${prop.contactEmail}`}
                  style={{
                    display: 'block',
                    background: 'white',
                    color: '#06B6D4',
                    padding: '14px 24px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '16px',
                    textAlign: 'center',
                    border: '2px solid #06B6D4',
                    transition: 'all 0.3s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#06B6D4';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.color = '#06B6D4';
                  }}
                >
                  ✉️ Send Email
                </a>
              )}
            </div>

            {/* WhatsApp Button */}
            {prop.contactPhone && (
              <a
                href={`https://wa.me/${prop.contactPhone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  background: 'linear-gradient(135deg, #25D366 0%, #1DA851 100%)',
                  color: 'white',
                  padding: '14px 24px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '16px',
                  textAlign: 'center',
                  boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)',
                  transition: 'all 0.3s',
                  marginTop: '12px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 211, 102, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(37, 211, 102, 0.3)';
                }}
              >
                💬 WhatsApp Owner
              </a>
            )}

            <p style={{
              fontSize: '12px',
              color: '#626C71',
              textAlign: 'center',
              marginTop: '20px',
              lineHeight: '1.5'
            }}>
              Please verify property details before making any payment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
