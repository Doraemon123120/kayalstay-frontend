import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, createAccessory, getAccessory, updateAccessory } from "../services/api";
import MapPicker from "../components/MapPicker";

export default function AccessoryForm() {
  const nav = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "furniture",
    pricePerDay: 0,
    pricePerWeek: 0,
    pricePerMonth: 0,
    quantity: 1,
    condition: "good",
    location: {
      lat: 22.5726,
      lng: 88.3639,
      address: ""
    }
  });

  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEditMode) {
      loadAccessory();
    }
  }, [id]);

  const loadAccessory = async () => {
    try {
      const res = await getAccessory(id!);
      const accessory = res.data;
      setFormData({
        name: accessory.name,
        description: accessory.description,
        category: accessory.category,
        pricePerDay: accessory.pricePerDay,
        pricePerWeek: accessory.pricePerWeek,
        pricePerMonth: accessory.pricePerMonth,
        quantity: accessory.quantity,
        condition: accessory.condition,
        location: {
          lat: accessory.location?.coordinates?.[1] || 22.5726,
          lng: accessory.location?.coordinates?.[0] || 88.3639,
          address: accessory.location?.address || ""
        }
      });
      setImages(accessory.images?.map((img: any) => img.url) || []);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load accessory");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleLocationChange = (lat: number, lng: number) => {
    setFormData({
      ...formData,
      location: { ...formData.location, lat, lng }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = new FormData();
      
      // Add text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'location') {
          payload.append('location[lat]', formData.location.lat.toString());
          payload.append('location[lng]', formData.location.lng.toString());
          if (formData.location.address) {
            payload.append('location[address]', formData.location.address);
          }
        } else {
          payload.append(key, value.toString());
        }
      });

      // Add images
      images.forEach((img, index) => {
        payload.append('images', img);
      });

      if (isEditMode) {
        await updateAccessory(id!, payload);
      } else {
        await createAccessory(payload);
      }

      nav("/accessories");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to save accessory");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px'
    }}>
      <h1 style={{
        fontSize: '32px',
        fontWeight: 700,
        marginBottom: '24px',
        color: '#13343B'
      }}>
        {isEditMode ? 'Edit Accessory' : 'Add New Accessory'}
      </h1>

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          color: '#DC2626',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      <div style={{
        background: 'white',
        padding: '32px',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
      }}>
        {/* Name */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
            Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '10px',
              fontSize: '15px'
            }}
          />
        </div>

        {/* Description */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows={4}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '10px',
              fontSize: '15px',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Category */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '10px',
              fontSize: '15px'
            }}
          >
            <option value="furniture">Furniture</option>
            <option value="appliances">Appliances</option>
            <option value="utensils">Utensils</option>
            <option value="electronics">Electronics</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Pricing */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '20px'
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Price Per Day (₹) *
            </label>
            <input
              type="number"
              value={formData.pricePerDay}
              onChange={(e) => setFormData({ ...formData, pricePerDay: parseFloat(e.target.value) })}
              required
              min="0"
              step="0.01"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid rgba(139, 92, 246, 0.2)',
                borderRadius: '10px',
                fontSize: '15px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Price Per Week (₹) *
            </label>
            <input
              type="number"
              value={formData.pricePerWeek}
              onChange={(e) => setFormData({ ...formData, pricePerWeek: parseFloat(e.target.value) })}
              required
              min="0"
              step="0.01"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid rgba(139, 92, 246, 0.2)',
                borderRadius: '10px',
                fontSize: '15px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Price Per Month (₹) *
            </label>
            <input
              type="number"
              value={formData.pricePerMonth}
              onChange={(e) => setFormData({ ...formData, pricePerMonth: parseFloat(e.target.value) })}
              required
              min="0"
              step="0.01"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid rgba(139, 92, 246, 0.2)',
                borderRadius: '10px',
                fontSize: '15px'
              }}
            />
          </div>
        </div>

        {/* Quantity and Condition */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '20px'
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Quantity *
            </label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
              required
              min="1"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid rgba(139, 92, 246, 0.2)',
                borderRadius: '10px',
                fontSize: '15px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Condition *
            </label>
            <select
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid rgba(139, 92, 246, 0.2)',
                borderRadius: '10px',
                fontSize: '15px'
              }}
            >
              <option value="new">New</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
          </div>
        </div>

        {/* Address */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
            Address
          </label>
          <input
            type="text"
            value={formData.location.address}
            onChange={(e) => setFormData({
              ...formData,
              location: { ...formData.location, address: e.target.value }
            })}
            placeholder="Enter address"
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '10px',
              fontSize: '15px'
            }}
          />
        </div>

        {/* Map Picker */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
            Location on Map
          </label>
          <MapPicker
            lat={formData.location.lat}
            lng={formData.location.lng}
            onLocationChange={handleLocationChange}
          />
        </div>

        {/* Image Upload */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
            Images
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '10px'
            }}
          />
          
          {images.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: '12px',
              marginTop: '16px'
            }}>
              {images.map((img, index) => (
                <div key={index} style={{ position: 'relative' }}>
                  <img
                    src={img}
                    alt={`Preview ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '150px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'rgba(239, 68, 68, 0.9)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              padding: '14px',
              background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Saving...' : isEditMode ? 'Update Accessory' : 'Add Accessory'}
          </button>

          <button
            type="button"
            onClick={() => nav('/accessories')}
            style={{
              flex: 1,
              padding: '14px',
              background: 'white',
              color: '#8B5CF6',
              border: '2px solid #8B5CF6',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
