import { useState } from "react";
import { api, setAuth } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      setAuth(res.data.token, res.data.user);
      nav("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
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
      }}>Welcome Back</h1>
      <p style={{
        color: '#626C71',
        marginBottom: '30px',
        fontSize: '14px'
      }}>Login to your KAYALSTAY account</p>
      
      {error && <div style={{
        background: 'rgba(239, 68, 68, 0.1)',
        color: '#DC2626',
        padding: '12px 16px',
        borderRadius: '8px',
        marginBottom: '20px',
        fontSize: '14px',
        fontWeight: 500
      }}>{error}</div>}
      
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
      
      <div style={{ marginBottom: '24px' }}>
        <label style={{
          display: 'block',
          color: '#13343B',
          fontWeight: 600,
          marginBottom: '8px',
          fontSize: '14px'
        }}>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
      
      <button type="submit" style={{
        width: '100%',
        padding: '14px',
        background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        fontSize: '16px',
        fontWeight: 600,
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)',
        transition: 'all 0.3s'
      }}>Login to Account</button>
      
      <p style={{
        textAlign: 'center',
        marginTop: '20px',
        color: '#626C71',
        fontSize: '14px'
      }}>
        Don't have an account?{' '}
        <a href="/signup" style={{
          color: '#06B6D4',
          fontWeight: 600,
          textDecoration: 'none'
        }}>Sign up</a>
      </p>
    </form>
  );
}
