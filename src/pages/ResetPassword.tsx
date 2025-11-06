import { useState } from "react";
import { api } from "../services/api";
import { useNavigate, useParams } from "react-router-dom";

export default function ResetPassword() {
  const nav = useNavigate();
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    setLoading(true);
    setMessage("");
    setError("");
    
    try {
      await api.post("/auth/reset-password", { token, password });
      setMessage("Password has been reset successfully. You can now login with your new password.");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to reset password");
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
      }}>Reset Password</h1>
      <p style={{
        color: '#626C71',
        marginBottom: '30px',
        fontSize: '14px'
      }}>Enter your new password below</p>
      
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
        }}>New Password</label>
        <input
          type="password"
          placeholder="Enter new password"
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
            outline: 'none',
            transition: 'all 0.3s'
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
        }}>Confirm New Password</label>
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
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
        {loading ? 'Resetting...' : 'Reset Password'}
      </button>
      
      {message && (
        <button
          type="button"
          onClick={() => nav("/login")}
          style={{
            width: '100%',
            padding: '14px',
            background: 'transparent',
            color: '#06B6D4',
            border: '2px solid rgba(6, 182, 212, 0.3)',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            marginTop: '16px',
            transition: 'all 0.3s'
          }}
        >
          Go to Login
        </button>
      )}
    </form>
  );
}