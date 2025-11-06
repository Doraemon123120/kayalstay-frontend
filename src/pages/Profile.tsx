import { useState, useEffect } from "react";
import { getProfile, updateProfile, updateAvatar } from "../services/api";

type Profile = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  profile: {
    bio: string;
    avatar: string;
    dateOfBirth: string;
    gender: string;
    address: string;
    city: string;
    country: string;
  };
};

export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    profile: {
      bio: "",
      dateOfBirth: "",
      gender: "",
      address: "",
      city: "",
      country: ""
    }
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setProfile(res.data);
        setFormData({
          name: res.data.name,
          phone: res.data.phone || "",
          profile: {
            bio: res.data.profile?.bio || "",
            dateOfBirth: res.data.profile?.dateOfBirth ? 
              new Date(res.data.profile.dateOfBirth).toISOString().split('T')[0] : "",
            gender: res.data.profile?.gender || "",
            address: res.data.profile?.address || "",
            city: res.data.profile?.city || "",
            country: res.data.profile?.country || ""
          }
        });
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith("profile.")) {
      const profileField = name.split(".")[1];
      setFormData({
        ...formData,
        profile: {
          ...formData.profile,
          [profileField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setError("");
    setSuccess("");

    try {
      const res = await updateProfile(formData);
      setProfile(res.data);
      setSuccess("Profile updated successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarUploading(true);
    setError("");
    setSuccess("");

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64 = reader.result as string;
          const res = await updateAvatar(base64);
          setProfile(res.data);
          setSuccess("Avatar updated successfully!");
          
          // Clear success message after 3 seconds
          setTimeout(() => setSuccess(""), 3000);
        } catch (err: any) {
          setError(err.response?.data?.error || "Failed to update avatar");
        } finally {
          setAvatarUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError("Failed to process avatar");
      setAvatarUploading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '80px 20px',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
        maxWidth: '1200px',
        margin: '20px auto'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
        <div style={{ fontSize: '18px', color: '#626C71', fontWeight: 500 }}>Loading profile...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '20px auto', padding: '20px' }}>
      <h1 style={{
        fontSize: '32px',
        fontWeight: 800,
        color: '#13343B',
        marginBottom: '24px'
      }}>
        My Profile
      </h1>

      {error && (
        <div style={{
          background: '#FEF2F2',
          border: '1px solid #FECACA',
          color: '#B91C1C',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          background: '#F0FDF4',
          border: '1px solid #BBF7D0',
          color: '#166534',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          {success}
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 3fr',
        gap: '30px'
      }}>
        {/* Profile Picture Section */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
          border: '1px solid rgba(6, 182, 212, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            margin: '0 auto 20px',
            overflow: 'hidden',
            position: 'relative'
          }}>
            {profile?.profile?.avatar ? (
              <img
                src={profile.profile.avatar}
                alt="Profile"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '48px',
                fontWeight: 700
              }}>
                {profile?.name?.charAt(0) || 'U'}
              </div>
            )}
            
            <label
              style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(6, 182, 212, 0.3)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              ✏️
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                style={{ display: 'none' }}
                disabled={avatarUploading}
              />
            </label>
          </div>
          
          {avatarUploading && (
            <div style={{ fontSize: '14px', color: '#06B6D4', fontWeight: 500 }}>
              Uploading...
            </div>
          )}
          
          <h2 style={{
            fontSize: '20px',
            fontWeight: 700,
            color: '#13343B',
            margin: '16px 0 8px'
          }}>
            {profile?.name}
          </h2>
          
          <div style={{
            fontSize: '14px',
            color: '#626C71',
            marginBottom: '16px'
          }}>
            {profile?.email}
          </div>
          
          <div style={{
            fontSize: '14px',
            color: '#626C71',
            fontStyle: 'italic'
          }}>
            {profile?.profile?.bio || "No bio added yet"}
          </div>
        </div>

        {/* Profile Form */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
          border: '1px solid rgba(6, 182, 212, 0.1)'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#13343B',
            marginBottom: '20px'
          }}>
            Edit Profile
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              marginBottom: '20px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  color: '#13343B',
                  fontWeight: 600,
                  marginBottom: '8px',
                  fontSize: '14px'
                }}>
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '2px solid rgba(6, 182, 212, 0.2)',
                    borderRadius: '10px',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  color: '#13343B',
                  fontWeight: 600,
                  marginBottom: '8px',
                  fontSize: '14px'
                }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '2px solid rgba(6, 182, 212, 0.2)',
                    borderRadius: '10px',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  color: '#13343B',
                  fontWeight: 600,
                  marginBottom: '8px',
                  fontSize: '14px'
                }}>
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="profile.dateOfBirth"
                  value={formData.profile.dateOfBirth}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '2px solid rgba(6, 182, 212, 0.2)',
                    borderRadius: '10px',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  color: '#13343B',
                  fontWeight: 600,
                  marginBottom: '8px',
                  fontSize: '14px'
                }}>
                  Gender
                </label>
                <select
                  name="profile.gender"
                  value={formData.profile.gender}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '2px solid rgba(6, 182, 212, 0.2)',
                    borderRadius: '10px',
                    fontSize: '14px',
                    background: 'white'
                  }}
                >
                  <option value="">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{
                  display: 'block',
                  color: '#13343B',
                  fontWeight: 600,
                  marginBottom: '8px',
                  fontSize: '14px'
                }}>
                  Bio
                </label>
                <textarea
                  name="profile.bio"
                  value={formData.profile.bio}
                  onChange={handleChange}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '2px solid rgba(6, 182, 212, 0.2)',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  color: '#13343B',
                  fontWeight: 600,
                  marginBottom: '8px',
                  fontSize: '14px'
                }}>
                  Address
                </label>
                <input
                  type="text"
                  name="profile.address"
                  value={formData.profile.address}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '2px solid rgba(6, 182, 212, 0.2)',
                    borderRadius: '10px',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  color: '#13343B',
                  fontWeight: 600,
                  marginBottom: '8px',
                  fontSize: '14px'
                }}>
                  City
                </label>
                <input
                  type="text"
                  name="profile.city"
                  value={formData.profile.city}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '2px solid rgba(6, 182, 212, 0.2)',
                    borderRadius: '10px',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  color: '#13343B',
                  fontWeight: 600,
                  marginBottom: '8px',
                  fontSize: '14px'
                }}>
                  Country
                </label>
                <input
                  type="text"
                  name="profile.country"
                  value={formData.profile.country}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '2px solid rgba(6, 182, 212, 0.2)',
                    borderRadius: '10px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={updating}
              style={{
                padding: '14px 32px',
                background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 700,
                cursor: updating ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)',
                opacity: updating ? 0.7 : 1
              }}
            >
              {updating ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}