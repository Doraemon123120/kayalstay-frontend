import { useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    
    try {
      const response = await api.post("/auth/forgot-password", { email });
      console.log("Forgot password response:", response);
      setMessage("Password reset instructions have been sent to your email.");
    } catch (err: any) {
      console.error("Forgot password error:", err);
      if (err.response) {
        // Server responded with error status
        setError(err.response.data?.error || "Failed to send reset instructions");
      } else if (err.request) {
        // Request was made but no response received
        setError("Network error. Please check your connection and try again.");
      } else {
        // Something else happened
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} style={{
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
      }}>Forgot Password</h1>
      <p style={{
        color: '#626C71',
        marginBottom: '30px',
        fontSize: '14px'
      }}>Enter your email to receive password reset instructions</p>
      
      {error && <div style={{
        background: 'rgba(239, 68, 68, 0.1)',
        color: '#DC2626',
        padding: '12px 16px',
        borderRadius: '8px',
        marginBottom: '20px',
        fontSize: '14px',
        fontWeight: 500
      }}>{error}</div>}
      
      {message && <div style={{
        background: 'rgba(16, 185, 129, 0.1)',
        color: '#047857',
        padding: '12px 16px',
        borderRadius: '8px',
        marginBottom: '20px',
        fontSize: '14px',
        fontWeight: 500
      }}>{message}</div>}
      
      <div style={{ marginBottom: '20px' }}>
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
            outline: 'none',
            transition: 'all 0.3s'
          }}
        />
      </div>
      
      <button 
        type="submit" 
        disabled={loading}
        style={{
          width: '100%',
          padding: '14px',
          background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          fontSize: '16px',
          fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)',
          transition: 'all 0.3s',
          opacity: loading ? 0.7 : 1
        }}
      >
        {loading ? 'Sending...' : 'Send Reset Instructions'}
      </button>
      
      <p style={{
        textAlign: 'center',
        marginTop: '20px',
        color: '#626C71',
        fontSize: '14px'
      }}>
        Remember your password?{' '}
        <a 
          onClick={() => nav("/login")} 
          style={{
            color: '#06B6D4',
            fontWeight: 600,
            textDecoration: 'none',
            cursor: 'pointer'
          }}
        >
          Back to Login
        </a>
      </p>
    </form>
  );
}