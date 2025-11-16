import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createTiffinCenter, getTiffinCenter, updateTiffinCenter } from "../services/api";
import { TiffinCenter, MenuItem } from "../models/TiffinCenter";

export default function TiffinCenterForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    location: { lat: 0, lng: 0 },
    phone: "",
    email: "",
    cuisine: [] as string[],
    deliveryAvailable: true,
    pickupAvailable: true,
    deliveryRadius: 5
  });
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { name: "", description: "", price: 0, category: "Lunch", available: true }
  ]);
  
  const [cuisineInput, setCuisineInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isEdit) {
      loadTiffinCenter();
    }
  }, [id]);

  const loadTiffinCenter = async () => {
    try {
      setLoading(true);
      const response = await getTiffinCenter(id!);
      const center: TiffinCenter = response.data;
      
      setFormData({
        name: center.name,
        description: center.description,
        address: center.address,
        location: center.location,
        phone: center.phone,
        email: center.email || "",
        cuisine: center.cuisine,
        deliveryAvailable: center.deliveryAvailable,
        pickupAvailable: center.pickupAvailable,
        deliveryRadius: center.deliveryRadius
      });
      
      setMenuItems(center.menu.length > 0 ? center.menu : [
        { name: "", description: "", price: 0, category: "Lunch", available: true }
      ]);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load tiffin center");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (name.startsWith("location.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          [field]: type === "number" ? parseFloat(value) : value
        }
      });
    } else if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleCuisineAdd = () => {
    if (cuisineInput.trim() && !formData.cuisine.includes(cuisineInput.trim())) {
      setFormData({
        ...formData,
        cuisine: [...formData.cuisine, cuisineInput.trim()]
      });
      setCuisineInput("");
    }
  };

  const handleCuisineRemove = (cuisine: string) => {
    setFormData({
      ...formData,
      cuisine: formData.cuisine.filter(c => c !== cuisine)
    });
  };

  const handleMenuItemChange = (index: number, field: string, value: any) => {
    const newMenuItems = [...menuItems];
    (newMenuItems[index] as any)[field] = value;
    setMenuItems(newMenuItems);
  };

  const addMenuItem = () => {
    setMenuItems([
      ...menuItems,
      { name: "", description: "", price: 0, category: "Lunch", available: true }
    ]);
  };

  const removeMenuItem = (index: number) => {
    if (menuItems.length > 1) {
      const newMenuItems = [...menuItems];
      newMenuItems.splice(index, 1);
      setMenuItems(newMenuItems);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    // Validation
    if (!formData.name.trim()) {
      setError("Tiffin center name is required");
      return;
    }
    
    if (!formData.address.trim()) {
      setError("Address is required");
      return;
    }
    
    if (!formData.phone.trim()) {
      setError("Phone number is required");
      return;
    }
    
    if (formData.cuisine.length === 0) {
      setError("At least one cuisine type is required");
      return;
    }
    
    const validMenuItems = menuItems.filter(item => item.name.trim() && item.price > 0);
    if (validMenuItems.length === 0) {
      setError("At least one valid menu item is required");
      return;
    }
    
    try {
      setLoading(true);
      
      const tiffinCenterData = {
        ...formData,
        menu: validMenuItems
      };
      
      if (isEdit) {
        await updateTiffinCenter(id!, tiffinCenterData);
        setSuccess("Tiffin center updated successfully!");
      } else {
        await createTiffinCenter(tiffinCenterData);
        setSuccess("Tiffin center created successfully!");
      }
      
      setTimeout(() => {
        navigate("/tiffin-centers");
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to save tiffin center");
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "400px" 
      }}>
        <div>Loading tiffin center...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ 
        fontSize: "32px", 
        fontWeight: "800", 
        marginBottom: "30px",
        background: "linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
      }}>
        {isEdit ? "Edit Tiffin Center" : "Add New Tiffin Center"}
      </h1>
      
      {error && (
        <div style={{
          background: "rgba(239, 68, 68, 0.1)",
          color: "#DC2626",
          padding: "12px 16px",
          borderRadius: "8px",
          marginBottom: "20px",
          fontSize: "14px",
          fontWeight: "500"
        }}>
          {error}
        </div>
      )}
      
      {success && (
        <div style={{
          background: "rgba(16, 185, 129, 0.1)",
          color: "#059669",
          padding: "12px 16px",
          borderRadius: "8px",
          marginBottom: "20px",
          fontSize: "14px",
          fontWeight: "500"
        }}>
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={{
        background: "white",
        padding: "30px",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
        border: "1px solid rgba(6, 182, 212, 0.1)"
      }}>
        {/* Basic Information */}
        <div style={{ marginBottom: "30px" }}>
          <h2 style={{ 
            fontSize: "20px", 
            fontWeight: "700", 
            color: "#13343B", 
            marginBottom: "20px" 
          }}>
            Basic Information
          </h2>
          
          <div style={{ marginBottom: "20px" }}>
            <label style={{
              display: "block",
              color: "#13343B",
              fontWeight: "600",
              marginBottom: "8px",
              fontSize: "14px"
            }}>
              Tiffin Center Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter tiffin center name"
              required
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
          
          <div style={{ marginBottom: "20px" }}>
            <label style={{
              display: "block",
              color: "#13343B",
              fontWeight: "600",
              marginBottom: "8px",
              fontSize: "14px"
            }}>
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange as any}
              placeholder="Describe your tiffin center"
              required
              rows={4}
              style={{
                width: "100%",
                padding: "14px 16px",
                border: "2px solid rgba(6, 182, 212, 0.2)",
                borderRadius: "10px",
                fontSize: "15px",
                color: "#13343B",
                resize: "vertical"
              }}
            />
          </div>
          
          <div style={{ marginBottom: "20px" }}>
            <label style={{
              display: "block",
              color: "#13343B",
              fontWeight: "600",
              marginBottom: "8px",
              fontSize: "14px"
            }}>
              Address *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter full address"
              required
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
        </div>
        
        {/* Location */}
        <div style={{ marginBottom: "30px" }}>
          <h2 style={{ 
            fontSize: "20px", 
            fontWeight: "700", 
            color: "#13343B", 
            marginBottom: "20px" 
          }}>
            Location
          </h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <div>
              <label style={{
                display: "block",
                color: "#13343B",
                fontWeight: "600",
                marginBottom: "8px",
                fontSize: "14px"
              }}>
                Latitude
              </label>
              <input
                type="number"
                name="location.lat"
                value={formData.location.lat}
                onChange={handleInputChange}
                step="any"
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
            
            <div>
              <label style={{
                display: "block",
                color: "#13343B",
                fontWeight: "600",
                marginBottom: "8px",
                fontSize: "14px"
              }}>
                Longitude
              </label>
              <input
                type="number"
                name="location.lng"
                value={formData.location.lng}
                onChange={handleInputChange}
                step="any"
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
          </div>
          
          <div style={{ 
            background: "rgba(6, 182, 212, 0.05)",
            border: "1px dashed rgba(6, 182, 212, 0.3)",
            borderRadius: "10px",
            padding: "20px",
            textAlign: "center"
          }}>
            <p style={{ 
              color: "#06B6D4", 
              margin: "0 0 10px 0",
              fontSize: "14px"
            }}>
              Tip: You can use Google Maps to find the exact coordinates of your location
            </p>
            <p style={{ 
              color: "#626C71", 
              margin: 0,
              fontSize: "12px"
            }}>
              Right-click on the map and select "What's here?" to get coordinates
            </p>
          </div>
        </div>
        
        {/* Contact Information */}
        <div style={{ marginBottom: "30px" }}>
          <h2 style={{ 
            fontSize: "20px", 
            fontWeight: "700", 
            color: "#13343B", 
            marginBottom: "20px" 
          }}>
            Contact Information
          </h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <div>
              <label style={{
                display: "block",
                color: "#13343B",
                fontWeight: "600",
                marginBottom: "8px",
                fontSize: "14px"
              }}>
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                required
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
            
            <div>
              <label style={{
                display: "block",
                color: "#13343B",
                fontWeight: "600",
                marginBottom: "8px",
                fontSize: "14px"
              }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
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
          </div>
        </div>
        
        {/* Cuisine Types */}
        <div style={{ marginBottom: "30px" }}>
          <h2 style={{ 
            fontSize: "20px", 
            fontWeight: "700", 
            color: "#13343B", 
            marginBottom: "20px" 
          }}>
            Cuisine Types *
          </h2>
          
          <div style={{ marginBottom: "15px" }}>
            <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
              <input
                type="text"
                value={cuisineInput}
                onChange={(e) => setCuisineInput(e.target.value)}
                placeholder="Enter cuisine type (e.g., North Indian)"
                style={{
                  flex: 1,
                  padding: "14px 16px",
                  border: "2px solid rgba(6, 182, 212, 0.2)",
                  borderRadius: "10px",
                  fontSize: "15px",
                  color: "#13343B"
                }}
              />
              <button
                type="button"
                onClick={handleCuisineAdd}
                style={{
                  background: "linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)",
                  color: "white",
                  padding: "14px 20px",
                  borderRadius: "10px",
                  border: "none",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(6, 182, 212, 0.3)"
                }}
              >
                Add
              </button>
            </div>
            
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {formData.cuisine.map((cuisine, index) => (
                <div 
                  key={index}
                  style={{
                    background: "linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)",
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: "20px",
                    fontSize: "14px",
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  {cuisine}
                  <button
                    type="button"
                    onClick={() => handleCuisineRemove(cuisine)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "white",
                      cursor: "pointer",
                      padding: "0",
                      fontSize: "16px",
                      lineHeight: "1"
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Service Options */}
        <div style={{ marginBottom: "30px" }}>
          <h2 style={{ 
            fontSize: "20px", 
            fontWeight: "700", 
            color: "#13343B", 
            marginBottom: "20px" 
          }}>
            Service Options
          </h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <div>
              <label style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: "#13343B",
                fontWeight: "500",
                fontSize: "14px"
              }}>
                <input
                  type="checkbox"
                  name="deliveryAvailable"
                  checked={formData.deliveryAvailable}
                  onChange={handleInputChange as any}
                />
                Delivery Available
              </label>
            </div>
            
            <div>
              <label style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: "#13343B",
                fontWeight: "500",
                fontSize: "14px"
              }}>
                <input
                  type="checkbox"
                  name="pickupAvailable"
                  checked={formData.pickupAvailable}
                  onChange={handleInputChange as any}
                />
                Pickup Available
              </label>
            </div>
          </div>
          
          {formData.deliveryAvailable && (
            <div>
              <label style={{
                display: "block",
                color: "#13343B",
                fontWeight: "600",
                marginBottom: "8px",
                fontSize: "14px"
              }}>
                Delivery Radius (km)
              </label>
              <input
                type="number"
                name="deliveryRadius"
                value={formData.deliveryRadius}
                onChange={handleInputChange}
                min="1"
                max="50"
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
          )}
        </div>
        
        {/* Menu Items */}
        <div style={{ marginBottom: "30px" }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            marginBottom: "20px"
          }}>
            <h2 style={{ 
              fontSize: "20px", 
              fontWeight: "700", 
              color: "#13343B", 
              margin: 0
            }}>
              Menu Items *
            </h2>
            <button
              type="button"
              onClick={addMenuItem}
              style={{
                background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
                color: "white",
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(139, 92, 246, 0.3)"
              }}
            >
              + Add Menu Item
            </button>
          </div>
          
          {menuItems.map((item, index) => (
            <div 
              key={index} 
              style={{
                background: "rgba(6, 182, 212, 0.05)",
                border: "1px solid rgba(6, 182, 212, 0.2)",
                borderRadius: "10px",
                padding: "20px",
                marginBottom: "15px"
              }}
            >
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                marginBottom: "15px"
              }}>
                <h3 style={{ 
                  fontSize: "16px", 
                  fontWeight: "600", 
                  color: "#13343B",
                  margin: 0
                }}>
                  Menu Item #{index + 1}
                </h3>
                {menuItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMenuItem(index)}
                    style={{
                      background: "rgba(239, 68, 68, 0.1)",
                      color: "#DC2626",
                      border: "none",
                      borderRadius: "6px",
                      padding: "6px 12px",
                      fontSize: "12px",
                      fontWeight: "600",
                      cursor: "pointer"
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                <div>
                  <label style={{
                    display: "block",
                    color: "#13343B",
                    fontWeight: "500",
                    marginBottom: "6px",
                    fontSize: "13px"
                  }}>
                    Item Name *
                  </label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleMenuItemChange(index, "name", e.target.value)}
                    placeholder="Enter item name"
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      border: "2px solid rgba(6, 182, 212, 0.2)",
                      borderRadius: "8px",
                      fontSize: "14px",
                      color: "#13343B"
                    }}
                  />
                </div>
                
                <div>
                  <label style={{
                    display: "block",
                    color: "#13343B",
                    fontWeight: "500",
                    marginBottom: "6px",
                    fontSize: "13px"
                  }}>
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => handleMenuItemChange(index, "price", parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      border: "2px solid rgba(6, 182, 212, 0.2)",
                      borderRadius: "8px",
                      fontSize: "14px",
                      color: "#13343B"
                    }}
                  />
                </div>
              </div>
              
              <div style={{ marginBottom: "15px" }}>
                <label style={{
                  display: "block",
                  color: "#13343B",
                  fontWeight: "500",
                  marginBottom: "6px",
                  fontSize: "13px"
                }}>
                  Description
                </label>
                <textarea
                  value={item.description || ""}
                  onChange={(e) => handleMenuItemChange(index, "description", e.target.value)}
                  placeholder="Enter item description"
                  rows={2}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    border: "2px solid rgba(6, 182, 212, 0.2)",
                    borderRadius: "8px",
                    fontSize: "14px",
                    color: "#13343B",
                    resize: "vertical"
                  }}
                />
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <div>
                  <label style={{
                    display: "block",
                    color: "#13343B",
                    fontWeight: "500",
                    marginBottom: "6px",
                    fontSize: "13px"
                  }}>
                    Category
                  </label>
                  <select
                    value={item.category}
                    onChange={(e) => handleMenuItemChange(index, "category", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      border: "2px solid rgba(6, 182, 212, 0.2)",
                      borderRadius: "8px",
                      fontSize: "14px",
                      color: "#13343B",
                      background: "white"
                    }}
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Dessert">Dessert</option>
                  </select>
                </div>
                
                <div>
                  <label style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "#13343B",
                    fontWeight: "500",
                    fontSize: "13px",
                    marginTop: "24px"
                  }}>
                    <input
                      type="checkbox"
                      checked={item.available}
                      onChange={(e) => handleMenuItemChange(index, "available", e.target.checked)}
                    />
                    Available
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Submit Button */}
        <div style={{ display: "flex", gap: "15px" }}>
          <button
            type="button"
            onClick={() => navigate("/tiffin-centers")}
            style={{
              flex: 1,
              padding: "16px",
              background: "transparent",
              color: "#13343B",
              borderRadius: "12px",
              border: "2px solid rgba(6, 182, 212, 0.2)",
              fontSize: "16px",
              fontWeight: "700",
              cursor: "pointer"
            }}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              padding: "16px",
              background: "linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)",
              color: "white",
              borderRadius: "12px",
              border: "none",
              fontSize: "16px",
              fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 15px rgba(6, 182, 212, 0.3)",
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? "Saving..." : (isEdit ? "Update Tiffin Center" : "Create Tiffin Center")}
          </button>
        </div>
      </form>
    </div>
  );
}