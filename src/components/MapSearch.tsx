import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { api } from "../services/api";

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Location marker component that handles map clicks
function LocationMarker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You selected this location</Popup>
    </Marker>
  );
}

// Property marker component
function PropertyMarker({ property }: { property: any }) {
  const position: [number, number] = [property.location.lat, property.location.lng];
  
  return (
    <Marker position={position}>
      <Popup>
        <div style={{ minWidth: "200px" }}>
          <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: "bold" }}>{property.title}</h3>
          <p style={{ margin: "0 0 8px 0", fontSize: "14px" }}>₹{property.price}/night</p>
          <p style={{ margin: "0 0 12px 0", fontSize: "12px", color: "#666" }}>{property.address}</p>
          <button
            onClick={() => window.location.href = `/listings/${property._id}`}
            style={{
              background: "linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)",
              color: "white",
              border: "none",
              borderRadius: "6px",
              padding: "6px 12px",
              fontSize: "12px",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            View Details
          </button>
        </div>
      </Popup>
    </Marker>
  );
}

export default function MapSearch() {
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchRadius, setSearchRadius] = useState<number>(10); // in kilometers
  const [loading, setLoading] = useState<boolean>(true);

  // Load properties when component mounts
  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const response = await api.get("/properties");
      setProperties(response.data);
    } catch (error) {
      console.error("Error loading properties:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle location selection from map
  const handleLocationSelect = async (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    
    try {
      setLoading(true);
      // Search for properties near the selected location
      const response = await api.get(`/properties/search?lat=${lat}&lng=${lng}&radius=${searchRadius}`);
      setProperties(response.data);
    } catch (error) {
      console.error("Error searching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle radius change
  const handleRadiusChange = (radius: number) => {
    setSearchRadius(radius);
    if (selectedLocation) {
      handleLocationSelect(selectedLocation.lat, selectedLocation.lng);
    }
  };

  if (loading && properties.length === 0) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "400px" 
      }}>
        <div>Loading map...</div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: "30px" }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "15px" 
      }}>
        <h2 style={{ 
          fontSize: "24px", 
          fontWeight: "700", 
          color: "#13343B" 
        }}>
          Find Properties on Map
        </h2>
        
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label style={{ fontSize: "14px", color: "#13343B" }}>
            Search Radius: {searchRadius} km
          </label>
          <input
            type="range"
            min="1"
            max="50"
            value={searchRadius}
            onChange={(e) => handleRadiusChange(parseInt(e.target.value))}
            style={{ width: "100px" }}
          />
        </div>
      </div>
      
      <div style={{ 
        height: "500px", 
        borderRadius: "12px", 
        overflow: "hidden", 
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        border: "1px solid rgba(6, 182, 212, 0.2)"
      }}>
        <MapContainer 
          center={[20.5937, 78.9629]} // Center of India
          zoom={5} 
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <LocationMarker onLocationSelect={handleLocationSelect} />
          
          {properties.map((property) => (
            property.location && (
              <PropertyMarker key={property._id} property={property} />
            )
          ))}
        </MapContainer>
      </div>
      
      {selectedLocation && (
        <div style={{ 
          marginTop: "15px", 
          padding: "12px", 
          background: "rgba(6, 182, 212, 0.1)", 
          borderRadius: "8px",
          border: "1px solid rgba(6, 182, 212, 0.2)"
        }}>
          <p style={{ margin: 0, fontSize: "14px", color: "#13343B" }}>
            <strong>Selected Location:</strong> {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
            <span style={{ marginLeft: "15px" }}>
              <strong>Properties Found:</strong> {properties.length}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}