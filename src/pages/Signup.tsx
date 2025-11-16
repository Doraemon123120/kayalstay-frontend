import { useState } from "react";
import { api, setAuth } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const nav = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Complete signup
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await api.post("/auth/send-otp", { email });
      setSuccess(res.data.message || "OTP sent to your email!");
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await api.post("/auth/verify-otp", { email, otp });
      setSuccess(res.data.message || "Email verified!");
      setStep(3);
    } catch (err: any) {
      setError(err.response?.data?.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/signup", { name, email, password, phone });
      setAuth(res.data.token, res.data.user);
      
      window.dispatchEvent(new Event('authChange'));
      
      const updateAuthState = (window as any).updateAuthState;
      if (updateAuthState) {
        updateAuthState();
      }
      
      nav("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '450px',
      margin: '60px auto',
      background: 'white',
      padding: '40px',
      borderRadius: '16px',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
      border: '1px solid rgba(6, 182, 212, 0.1)'
    }}>
      <h1 style={{
        fontSize: '28px',
        fontWeight: 700,
        color: '#13343B',
        marginBottom: '10px'
      }}>Create Account</h1>
      <p style={{
        color: '#626C71',
        marginBottom: '30px',
        fontSize: '14px'
      }}>Join Quickit and find your perfect stay</p>
      
      {/* Step Indicator */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        marginBottom: '30px'
      }}>
        {[1, 2, 3].map((s) => (
          <div key={s} style={{
            width: '40px',
            height: '4px',
            borderRadius: '2px',
            background: step >= s ? 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)' : '#E5E7EB'
          }} />
        ))}
      </div>
      
      {error && <div style={{
        background: 'rgba(239, 68, 68, 0.1)',
        color: '#DC2626',
        padding: '12px 16px',
        borderRadius: '8px',
        marginBottom: '20px',
        fontSize: '14px',
        fontWeight: 500
      }}>{error}</div>}
      
      {success && <div style={{
        background: 'rgba(16, 185, 129, 0.1)',
        color: '#059669',
        padding: '12px 16px',
        borderRadius: '8px',
        marginBottom: '20px',
        fontSize: '14px',
        fontWeight: 500
      }}>{success}</div>}
      
      {/* Step 1: Enter Email */}
      {step === 1 && (
        <form onSubmit={sendOTP}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              color: '#13343B',
              fontWeight: 600,
              marginBottom: '8px',
              fontSize: '14px'
            }}>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '2px solid rgba(6, 182, 212, 0.2)',
                borderRadius: '10px',
                fontSize: '15px',
                color: '#13343B',
                fontWeight: 500,
                background: 'white',
                outline: 'none'
              }}
            />
          </div>
          
          <button type="submit" disabled={loading} style={{
            width: '100%',
            padding: '14px',
            background: loading ? '#9CA3AF' : 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)'
          }}>{loading ? 'Sending...' : 'Send OTP'}</button>
        </form>
      )}
      
      {/* Step 2: Verify OTP */}
      {step === 2 && (
        <form onSubmit={verifyOTP}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              color: '#13343B',
              fontWeight: 600,
              marginBottom: '8px',
              fontSize: '14px'
            }}>Enter OTP</label>
            <p style={{
              fontSize: '13px',
              color: '#626C71',
              marginBottom: '12px'
            }}>We sent a 6-digit code to {email}</p>
            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              maxLength={6}
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '2px solid rgba(6, 182, 212, 0.2)',
                borderRadius: '10px',
                fontSize: '24px',
                color: '#13343B',
                fontWeight: 700,
                background: 'white',
                textAlign: 'center',
                letterSpacing: '8px',
                outline: 'none'
              }}
            />
          </div>
          
          <button type="submit" disabled={loading || otp.length !== 6} style={{
            width: '100%',
            padding: '14px',
            background: (loading || otp.length !== 6) ? '#9CA3AF' : 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: (loading || otp.length !== 6) ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)'
          }}>{loading ? 'Verifying...' : 'Verify OTP'}</button>
          
          <button
            type="button"
            onClick={() => setStep(1)}
            style={{
              width: '100%',
              marginTop: '12px',
              padding: '12px',
              background: 'transparent',
              color: '#06B6D4',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >Change Email</button>
        </form>
      )}
      
      {/* Step 3: Complete Signup */}
      {step === 3 && (
        <form onSubmit={submit}>
          <div style={{ marginBottom: '18px' }}>
            <label style={{
              display: 'block',
              color: '#13343B',
              fontWeight: 600,
              marginBottom: '8px',
              fontSize: '14px'
            }}>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '2px solid rgba(6, 182, 212, 0.2)',
                borderRadius: '10px',
                fontSize: '15px',
                color: '#13343B',
                fontWeight: 500,
                background: 'white',
                outline: 'none'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '18px' }}>
            <label style={{
              display: 'block',
              color: '#13343B',
              fontWeight: 600,
              marginBottom: '8px',
              fontSize: '14px'
            }}>Email Address</label>
            <input
              type="email"
              value={email}
              disabled
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '2px solid rgba(6, 182, 212, 0.2)',
                borderRadius: '10px',
                fontSize: '15px',
                color: '#13343B',
                fontWeight: 500,
                background: '#F3F4F6',
                outline: 'none'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '18px' }}>
            <label style={{
              display: 'block',
              color: '#13343B',
              fontWeight: 600,
              marginBottom: '8px',
              fontSize: '14px'
            }}>Password</label>
            <input
              type="password"
              placeholder="Create a password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '2px solid rgba(6, 182, 212, 0.2)',
                borderRadius: '10px',
                fontSize: '15px',
                color: '#13343B',
                fontWeight: 500,
                background: 'white',
                outline: 'none'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              color: '#13343B',
              fontWeight: 600,
              marginBottom: '8px',
              fontSize: '14px'
            }}>Phone Number</label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '2px solid rgba(6, 182, 212, 0.2)',
                borderRadius: '10px',
                fontSize: '15px',
                color: '#13343B',
                fontWeight: 500,
                background: 'white',
                outline: 'none'
              }}
            />
          </div>
          
          <button type="submit" disabled={loading} style={{
            width: '100%',
            padding: '14px',
            background: loading ? '#9CA3AF' : 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)'
          }}>{loading ? 'Creating Account...' : 'Create Account'}</button>
        </form>
      )}
      
      <p style={{
        textAlign: 'center',
        marginTop: '20px',
        color: '#626C71',
        fontSize: '14px'
      }}>
        Already have an account?{' '}
        <a href="/login" style={{
          color: '#06B6D4',
          fontWeight: 600,
          textDecoration: 'none'
        }}>Login</a>
      </p>
    </div>
  );
}
