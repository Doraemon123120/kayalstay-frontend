import { useState, useEffect } from "react";
import { api } from "../services/api";
import { useNavigate, useParams } from "react-router-dom";
import MapPicker from "../components/MapPicker";

export default function PropertyForm() {
  const nav = useNavigate();
  const { id } = useParams(); // If id exists, we're editing
  const isEditing = !!id;
  
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [price, setPrice] = useState("");
  const [propertyType, setPropertyType] = useState("room");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [amenities, setAmenities] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [images, setImages] = useState<FileList | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditing);
  const [location, setLocation] = useState({ lat: 22.5726, lng: 88.3639 }); // Default to Kolkata

  // Load existing property data if editing
  useEffect(() => {
    if (isEditing) {
      const loadProperty = async () => {
        try {
          const res = await api.get(`/properties/${id}`);
          const prop = res.data;
          setTitle(prop.title || "");
          setCity(prop.city || "");
          setPrice(String(prop.price || ""));
          setPropertyType(prop.propertyType || "room");
          setDescription(prop.description || "");
          setAddress(prop.address || "");
          setAmenities(prop.amenities?.join(', ') || "");
          setContactPhone(prop.contactPhone || "");
          setContactEmail(prop.contactEmail || "");
          setLoadingData(false);
        } catch (err) {
          setError("Failed to load property data");
          setLoadingData(false);
        }
      };
      loadProperty();
    }
  }, [id, isEditing]);

  const handleLocationChange = (lat: number, lng: number) => {
    setLocation({ lat, lng });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    console.log('Images to upload:', images ? images.length : 0);
    
    const fd = new FormData();
    fd.append("title", title);
    fd.append("city", city);
    fd.append("price", price);
    fd.append("propertyType", propertyType);
    fd.append("description", description);
    fd.append("address", address);
    fd.append("contactPhone", contactPhone);
    fd.append("contactEmail", contactEmail);
    fd.append("location[lat]", location.lat.toString());
    fd.append("location[lng]", location.lng.toString());
    if (amenities) fd.append("amenities", amenities);
    if (images) {
      Array.from(images).forEach((f, index) => {
        console.log(`Appending image ${index + 1}:`, f.name, f.size, 'bytes');
        fd.append("images", f);
      });
    }
    
    console.log('FormData prepared, sending request...');
    
    try {
      if (isEditing) {
        // Update existing property
        await api.put(`/properties/${id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        // Create new property
        await api.post("/properties", fd, { headers: { "Content-Type": "multipart/form-data" } });
      }
      console.log('Property saved successfully!');
      nav("/dashboard");
    } catch (err: any) {
      console.error('Error saving property:', err);
      setError(err.response?.data?.error || `Failed to ${isEditing ? 'update' : 'post'} property`);
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    border: '2px solid rgba(6, 182, 212, 0.2)',
    borderRadius: '10px',
    fontSize: '15px',
    color: '#13343B',
    fontWeight: 500,
    background: 'white',
    outline: 'none',
    transition: 'all 0.3s'
  };

  const labelStyle = {
    display: 'block',
    color: '#13343B',
    fontWeight: 600,
    marginBottom: '8px',
    fontSize: '14px'
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {loadingData ? (
        <div style={{
          textAlign: 'center',
          padding: '100px 20px',
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <div style={{ fontSize: '18px', color: '#626C71', fontWeight: 500 }}>Loading property data...</div>
        </div>
      ) : (
        <>
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
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏠</div>
        <h1 style={{
          fontSize: '38px',
          fontWeight: 900,
          marginBottom: '12px',
          letterSpacing: '1px'
        }}>{isEditing ? 'Edit Your Property' : 'Post Your Property'}</h1>
        <p style={{
          fontSize: '16px',
          opacity: 0.95,
          fontWeight: 500
        }}>{isEditing ? 'Update your property details on Quickit' : 'List your property on Quickit and reach thousands of potential tenants'}</p>
      </div>

      {/* Form */}
      <form onSubmit={submit} style={{
        background: 'white',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
        border: '1px solid rgba(6, 182, 212, 0.1)'
      }}>
        {error && <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          color: '#DC2626',
          padding: '14px 18px',
          borderRadius: '10px',
          marginBottom: '24px',
          fontSize: '14px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          ⚠️ {error}
        </div>}

        {/* Basic Info Section */}
        <div style={{
          marginBottom: '32px',
          paddingBottom: '24px',
          borderBottom: '2px solid rgba(6, 182, 212, 0.1)'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 700,
            color: '#13343B',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            📝 Basic Information
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            <div>
              <label style={labelStyle}>🏢 Property Title *</label>
              <input
                type="text"
                placeholder="e.g., Spacious 2BHK in Downtown"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>🏙️ City *</label>
              <input
                type="text"
                placeholder="e.g., Mumbai, Delhi, Bangalore"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>💰 Monthly Rent (₹) *</label>
              <input
                type="number"
                placeholder="e.g., 15000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>🏠 Property Type *</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                required
                style={inputStyle}
              >
                <option value="room">🛏️ Room</option>
                <option value="flat">🏢 Flat</option>
                <option value="pg">🏠 PG</option>
                <option value="hostel">🏘️ Hostel</option>
                <option value="house">🏡 House</option>
              </select>
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div style={{
          marginBottom: '32px',
          paddingBottom: '24px',
          borderBottom: '2px solid rgba(6, 182, 212, 0.1)'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 700,
            color: '#13343B',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            📍 Location Details
          </h2>

          <div>
            <label style={labelStyle}>🗺️ Full Address</label>
            <input
              type="text"
              placeholder="e.g., 123 Main Street, Sector 5"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={inputStyle}
            />
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <label style={labelStyle}>📍 Select Location on Map</label>
            <MapPicker 
              lat={location.lat} 
              lng={location.lng} 
              onLocationChange={handleLocationChange} 
            />
            <div style={{ 
              marginTop: '10px', 
              padding: '10px', 
              background: 'rgba(6, 182, 212, 0.05)', 
              borderRadius: '8px',
              fontSize: '14px'
            }}>
              <strong>Selected Coordinates:</strong> {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
            </div>
          </div>
        </div>

        {/* Property Details Section */}
        <div style={{
          marginBottom: '32px',
          paddingBottom: '24px',
          borderBottom: '2px solid rgba(6, 182, 212, 0.1)'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 700,
            color: '#13343B',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            ✨ Property Details
          </h2>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>📄 Description</label>
            <textarea
              rows={5}
              placeholder="Describe your property... (features, nearby locations, etc.)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                ...inputStyle,
                resize: 'vertical',
                minHeight: '120px'
              }}
            />
          </div>

          <div>
            <label style={labelStyle}>⭐ Amenities</label>
            <input
              type="text"
              placeholder="e.g., WiFi, AC, Parking, Security, Gym"
              value={amenities}
              onChange={(e) => setAmenities(e.target.value)}
              style={inputStyle}
            />
            <p style={{
              fontSize: '12px',
              color: '#626C71',
              marginTop: '6px',
              fontStyle: 'italic'
            }}>Separate multiple amenities with commas</p>
          </div>
        </div>

        {/* Contact Section */}
        <div style={{
          marginBottom: '32px',
          paddingBottom: '24px',
          borderBottom: '2px solid rgba(6, 182, 212, 0.1)'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 700,
            color: '#13343B',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            📞 Contact Information
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            <div>
              <label style={labelStyle}>📱 Contact Phone *</label>
              <input
                type="tel"
                placeholder="e.g., +91 98765 43210"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>✉️ Contact Email</label>
              <input
                type="email"
                placeholder="e.g., owner@example.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* Images Section */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 700,
            color: '#13343B',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            📸 Property Images
          </h2>

          <div style={{
            border: '2px dashed rgba(6, 182, 212, 0.3)',
            borderRadius: '12px',
            padding: '32px',
            textAlign: 'center',
            background: 'rgba(6, 182, 212, 0.03)',
            transition: 'all 0.3s'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🖼️</div>
            <label style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
              color: 'white',
              padding: '12px 28px',
              borderRadius: '50px',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)',
              marginBottom: '12px'
            }}>
              Choose Images
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImages(e.target.files)}
                style={{ display: 'none' }}
              />
            </label>
            <p style={{
              fontSize: '13px',
              color: '#626C71',
              marginTop: '8px'
            }}>
              {images ? `${images.length} image(s) selected` : 'Upload multiple images of your property'}
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '16px',
            background: loading ? '#ccc' : 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: 800,
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: loading ? 'none' : '0 8px 25px rgba(139, 92, 246, 0.4)',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}
        >
          {loading ? '⏳ Posting...' : (isEditing ? '💾 Update Property' : '🚀 Post Property')}
        </button>

        <p style={{
          textAlign: 'center',
          marginTop: '20px',
          fontSize: '13px',
          color: '#626C71'
        }}>
          By {isEditing ? 'updating' : 'posting'}, you agree to Quickit's terms and conditions
        </p>
      </form>
        </>
      )}
    </div>
  );
}
