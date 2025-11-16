import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getTiffinCenters } from "../services/api";
import { TiffinCenter } from "../models/TiffinCenter";

export default function TiffinCenters() {
  const [tiffinCenters, setTiffinCenters] = useState<TiffinCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [useLocation, setUseLocation] = useState(false);

  useEffect(() => {
    loadTiffinCenters();
    
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log("Error getting location:", error);
        }
      );
    }
  }, []);

  const loadTiffinCenters = async () => {
    try {
      setLoading(true);
      const params: any = {};
      
      if (searchTerm) params.search = searchTerm;
      if (selectedCuisine) params.cuisine = selectedCuisine;
      if (useLocation) {
        params.lat = location.lat;
        params.lng = location.lng;
      }
      
      const response = await getTiffinCenters(params);
      setTiffinCenters(response.data);
    } catch (error) {
      console.error("Error loading tiffin centers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadTiffinCenters();
  };

  if (loading && tiffinCenters.length === 0) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "400px" 
      }}>
        <div>Loading tiffin centers...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "30px" 
      }}>
        <h1 style={{ 
          fontSize: "32px", 
          fontWeight: "800", 
          background: "linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          Tiffin Centers
        </h1>
        <Link 
          to="/new-tiffin-center" 
          style={{
            background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
            color: "white",
            padding: "12px 24px",
            borderRadius: "50px",
            textDecoration: "none",
            fontWeight: "600",
            boxShadow: "0 4px 15px rgba(139, 92, 246, 0.3)",
            transition: "all 0.3s"
          }}
        >
          + Add Tiffin Center
        </Link>
      </div>

      {/* Search and Filters */}
      <form onSubmit={handleSearch} style={{ 
        background: "white", 
        padding: "20px", 
        borderRadius: "16px", 
        marginBottom: "30px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
        border: "1px solid rgba(6, 182, 212, 0.1)"
      }}>
        <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
          <div style={{ flex: 1 }}>
            <input
              type="text"
              placeholder="Search tiffin centers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px",
                border: "2px solid rgba(6, 182, 212, 0.2)",
                borderRadius: "10px",
                fontSize: "15px",
                color: "#13343B"
              }}
            />
          </div>
          <button type="submit" style={{
            background: "linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)",
            color: "white",
            padding: "14px 24px",
            borderRadius: "10px",
            border: "none",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(6, 182, 212, 0.3)"
          }}>
            Search
          </button>
        </div>
        
        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <select
            value={selectedCuisine}
            onChange={(e) => setSelectedCuisine(e.target.value)}
            style={{
              padding: "12px 16px",
              border: "2px solid rgba(6, 182, 212, 0.2)",
              borderRadius: "10px",
              fontSize: "15px",
              color: "#13343B",
              background: "white"
            }}
          >
            <option value="">All Cuisines</option>
            <option value="North Indian">North Indian</option>
            <option value="South Indian">South Indian</option>
            <option value="Gujarati">Gujarati</option>
            <option value="Punjabi">Punjabi</option>
            <option value="Bengali">Bengali</option>
            <option value="Maharashtrian">Maharashtrian</option>
            <option value="Rajasthani">Rajasthani</option>
          </select>
          
          <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              checked={useLocation}
              onChange={(e) => setUseLocation(e.target.checked)}
            />
            <span>Search near me</span>
          </label>
        </div>
      </form>

      {/* Tiffin Centers List */}
      {tiffinCenters.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: "60px 20px",
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
          border: "1px solid rgba(6, 182, 212, 0.1)"
        }}>
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>🍱</div>
          <h2 style={{ 
            fontSize: "24px", 
            fontWeight: "700", 
            color: "#13343B", 
            marginBottom: "10px" 
          }}>
            No Tiffin Centers Found
          </h2>
          <p style={{ 
            fontSize: "16px", 
            color: "#626C71", 
            marginBottom: "20px" 
          }}>
            Try adjusting your search criteria or be the first to add a tiffin center in your area.
          </p>
          <Link 
            to="/new-tiffin-center" 
            style={{
              background: "linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)",
              color: "white",
              padding: "12px 24px",
              borderRadius: "50px",
              textDecoration: "none",
              fontWeight: "600",
              boxShadow: "0 4px 15px rgba(6, 182, 212, 0.3)"
            }}
          >
            Add Your Tiffin Center
          </Link>
        </div>
      ) : (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
          gap: "25px" 
        }}>
          {tiffinCenters.map((center) => (
            <div 
              key={center._id} 
              style={{
                background: "white",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
                border: "1px solid rgba(6, 182, 212, 0.1)",
                transition: "all 0.3s"
              }}
            >
              {center.images && center.images.length > 0 ? (
                <img 
                  src={center.images[0].url} 
                  alt={center.name}
                  style={{ 
                    width: "100%", 
                    height: "200px", 
                    objectFit: "cover" 
                  }}
                />
              ) : (
                <div style={{ 
                  width: "100%", 
                  height: "200px", 
                  background: "linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "48px"
                }}>
                  🍱
                </div>
              )}
              
              <div style={{ padding: "20px" }}>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "flex-start",
                  marginBottom: "12px"
                }}>
                  <h3 style={{ 
                    fontSize: "20px", 
                    fontWeight: "700", 
                    color: "#13343B",
                    margin: 0
                  }}>
                    {center.name}
                  </h3>
                  <div style={{ 
                    background: "rgba(6, 182, 212, 0.1)", 
                    color: "#06B6D4",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "600"
                  }}>
                    ⭐ {center.rating.toFixed(1)}
                  </div>
                </div>
                
                <p style={{ 
                  fontSize: "14px", 
                  color: "#626C71", 
                  marginBottom: "15px",
                  lineHeight: "1.5"
                }}>
                  {center.description}
                </p>
                
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  marginBottom: "15px"
                }}>
                  <div style={{ 
                    display: "flex", 
                    gap: "8px",
                    flexWrap: "wrap"
                  }}>
                    {center.cuisine.slice(0, 2).map((cuisine, index) => (
                      <span 
                        key={index}
                        style={{
                          background: "rgba(139, 92, 246, 0.1)",
                          color: "#8B5CF6",
                          padding: "4px 10px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "500"
                        }}
                      >
                        {cuisine}
                      </span>
                    ))}
                    {center.cuisine.length > 2 && (
                      <span 
                        style={{
                          background: "rgba(139, 92, 246, 0.1)",
                          color: "#8B5CF6",
                          padding: "4px 10px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "500"
                        }}
                      >
                        +{center.cuisine.length - 2}
                      </span>
                    )}
                  </div>
                </div>
                
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center"
                }}>
                  <div style={{ fontSize: "14px", color: "#626C71" }}>
                    📍 {center.address}
                  </div>
                  <Link 
                    to={`/tiffin-centers/${center._id}`}
                    style={{
                      background: "linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)",
                      color: "white",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      textDecoration: "none",
                      fontSize: "14px",
                      fontWeight: "600"
                    }}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}