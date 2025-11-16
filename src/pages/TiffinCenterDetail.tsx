import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTiffinCenter } from "../services/api";
import { TiffinCenter } from "../models/TiffinCenter";

export default function TiffinCenterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tiffinCenter, setTiffinCenter] = useState<TiffinCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTiffinCenter();
  }, [id]);

  const loadTiffinCenter = async () => {
    try {
      setLoading(true);
      const response = await getTiffinCenter(id!);
      setTiffinCenter(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load tiffin center");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "400px" 
      }}>
        <div>Loading tiffin center details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "400px" 
      }}>
        <div>Error: {error}</div>
      </div>
    );
  }

  if (!tiffinCenter) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "400px" 
      }}>
        <div>Tiffin center not found</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      {/* Header */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "30px" 
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "transparent",
            border: "none",
            color: "#06B6D4",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          ← Back
        </button>
        
        <div style={{ 
          display: "flex", 
          gap: "15px" 
        }}>
          <button
            onClick={() => navigate(`/edit-tiffin-center/${tiffinCenter._id}`)}
            style={{
              background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
              color: "white",
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(139, 92, 246, 0.3)"
            }}
          >
            Edit
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        background: "white", 
        borderRadius: "16px", 
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
        border: "1px solid rgba(6, 182, 212, 0.1)",
        marginBottom: "30px"
      }}>
        {/* Image Gallery */}
        {tiffinCenter.images && tiffinCenter.images.length > 0 ? (
          <div style={{ 
            height: "400px", 
            position: "relative"
          }}>
            <img 
              src={tiffinCenter.images[0].url} 
              alt={tiffinCenter.name}
              style={{ 
                width: "100%", 
                height: "100%", 
                objectFit: "cover" 
              }}
            />
            <div style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "rgba(0, 0, 0, 0.7)",
              color: "white",
              padding: "8px 16px",
              borderRadius: "20px",
              fontSize: "14px",
              fontWeight: "600"
            }}>
              ⭐ {tiffinCenter.rating.toFixed(1)} ({tiffinCenter.reviewCount} reviews)
            </div>
          </div>
        ) : (
          <div style={{ 
            height: "400px", 
            background: "linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "64px"
          }}>
            🍱
          </div>
        )}

        {/* Content */}
        <div style={{ padding: "30px" }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "flex-start",
            marginBottom: "20px"
          }}>
            <div>
              <h1 style={{ 
                fontSize: "32px", 
                fontWeight: "800", 
                color: "#13343B",
                margin: "0 0 10px 0"
              }}>
                {tiffinCenter.name}
              </h1>
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "15px",
                fontSize: "16px",
                color: "#626C71"
              }}>
                <span>📍 {tiffinCenter.address}</span>
                <span>📞 {tiffinCenter.phone}</span>
                {tiffinCenter.email && <span>✉️ {tiffinCenter.email}</span>}
              </div>
            </div>
            
            <div style={{ 
              textAlign: "right"
            }}>
              <div style={{ 
                background: "linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)",
                color: "white",
                padding: "12px 24px",
                borderRadius: "50px",
                fontSize: "18px",
                fontWeight: "700",
                display: "inline-block"
              }}>
                Owner: {tiffinCenter.owner.name}
              </div>
            </div>
          </div>

          <p style={{ 
            fontSize: "16px", 
            color: "#626C71", 
            lineHeight: "1.6",
            marginBottom: "30px"
          }}>
            {tiffinCenter.description}
          </p>

          {/* Cuisine Tags */}
          <div style={{ marginBottom: "30px" }}>
            <h2 style={{ 
              fontSize: "20px", 
              fontWeight: "700", 
              color: "#13343B", 
              marginBottom: "15px" 
            }}>
              Cuisine Types
            </h2>
            <div style={{ 
              display: "flex", 
              gap: "10px",
              flexWrap: "wrap"
            }}>
              {tiffinCenter.cuisine.map((cuisine, index) => (
                <span 
                  key={index}
                  style={{
                    background: "linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)",
                    color: "white",
                    padding: "8px 20px",
                    borderRadius: "20px",
                    fontSize: "14px",
                    fontWeight: "500"
                  }}
                >
                  {cuisine}
                </span>
              ))}
            </div>
          </div>

          {/* Service Options */}
          <div style={{ 
            display: "flex", 
            gap: "30px",
            marginBottom: "30px",
            padding: "20px",
            background: "rgba(6, 182, 212, 0.05)",
            borderRadius: "12px"
          }}>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "10px"
            }}>
              <div style={{ 
                width: "30px", 
                height: "30px", 
                background: tiffinCenter.deliveryAvailable ? "#10B981" : "#EF4444",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "16px"
              }}>
                {tiffinCenter.deliveryAvailable ? "✓" : "✗"}
              </div>
              <div>
                <div style={{ 
                  fontWeight: "600", 
                  color: "#13343B" 
                }}>
                  Delivery
                </div>
                {tiffinCenter.deliveryAvailable && (
                  <div style={{ 
                    fontSize: "14px", 
                    color: "#626C71" 
                  }}>
                    Within {tiffinCenter.deliveryRadius} km
                  </div>
                )}
              </div>
            </div>
            
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "10px"
            }}>
              <div style={{ 
                width: "30px", 
                height: "30px", 
                background: tiffinCenter.pickupAvailable ? "#10B981" : "#EF4444",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "16px"
              }}>
                {tiffinCenter.pickupAvailable ? "✓" : "✗"}
              </div>
              <div style={{ 
                fontWeight: "600", 
                color: "#13343B" 
              }}>
                Pickup Available
              </div>
            </div>
          </div>

          {/* Menu */}
          <div>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              marginBottom: "20px"
            }}>
              <h2 style={{ 
                fontSize: "24px", 
                fontWeight: "700", 
                color: "#13343B",
                margin: 0
              }}>
                Menu
              </h2>
              <div style={{ 
                fontSize: "14px", 
                color: "#626C71" 
              }}>
                {tiffinCenter.menu.length} items
              </div>
            </div>
            
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
              gap: "20px" 
            }}>
              {tiffinCenter.menu.map((item, index) => (
                <div 
                  key={index}
                  style={{
                    background: "white",
                    border: "1px solid rgba(6, 182, 212, 0.2)",
                    borderRadius: "12px",
                    padding: "20px",
                    position: "relative"
                  }}
                >
                  {!item.available && (
                    <div style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      background: "#EF4444",
                      color: "white",
                      padding: "4px 10px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "600"
                    }}>
                      Unavailable
                    </div>
                  )}
                  
                  <h3 style={{ 
                    fontSize: "18px", 
                    fontWeight: "700", 
                    color: "#13343B",
                    margin: "0 0 10px 0"
                  }}>
                    {item.name}
                  </h3>
                  
                  {item.description && (
                    <p style={{ 
                      fontSize: "14px", 
                      color: "#626C71", 
                      margin: "0 0 15px 0",
                      lineHeight: "1.4"
                    }}>
                      {item.description}
                    </p>
                  )}
                  
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center"
                  }}>
                    <div style={{ 
                      fontSize: "16px", 
                      fontWeight: "700", 
                      color: "#06B6D4" 
                    }}>
                      ₹{item.price.toFixed(2)}
                    </div>
                    <div style={{ 
                      fontSize: "12px", 
                      color: "#626C71",
                      background: "rgba(139, 92, 246, 0.1)",
                      color: "#8B5CF6",
                      padding: "4px 10px",
                      borderRadius: "20px"
                    }}>
                      {item.category}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Operating Hours */}
      <div style={{ 
        background: "white", 
        borderRadius: "16px", 
        padding: "30px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
        border: "1px solid rgba(6, 182, 212, 0.1)"
      }}>
        <h2 style={{ 
          fontSize: "24px", 
          fontWeight: "700", 
          color: "#13343B", 
          marginBottom: "20px" 
        }}>
          Operating Hours
        </h2>
        
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", 
          gap: "15px" 
        }}>
          {Object.entries(tiffinCenter.operatingHours).map(([day, hours]) => (
            <div 
              key={day}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 16px",
                background: "rgba(6, 182, 212, 0.05)",
                borderRadius: "8px"
              }}
            >
              <div style={{ 
                fontWeight: "600", 
                color: "#13343B" 
              }}>
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </div>
              <div style={{ 
                color: "#626C71" 
              }}>
                {hours.open} - {hours.close}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}