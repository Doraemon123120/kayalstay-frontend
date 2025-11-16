import { Routes, Route, Link, Navigate } from "react-router-dom";
import Listings from "./pages/Listings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PropertyForm from "./pages/PropertyForm";
import PropertyDetail from "./pages/PropertyDetail";
import Dashboard from "./pages/Dashboard";
import Favorites from "./pages/Favorites";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import TiffinCenters from "./pages/TiffinCenters";
import TiffinCenterForm from "./pages/TiffinCenterForm";
import TiffinCenterDetail from "./pages/TiffinCenterDetail";
import Accessories from "./pages/Accessories";
import AccessoryDetail from "./pages/AccessoryDetail";
import AccessoryForm from "./pages/AccessoryForm";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import { getToken } from "./services/api";
import { useState, useEffect } from "react";

export default function App() {
  const [isAuthed, setIsAuthed] = useState(!!getToken());
  const [showWelcome, setShowWelcome] = useState(false);

  // Listen for authentication changes
  useEffect(() => {
    const handleStorageChange = () => {
      const token = getToken();
      console.log("Storage change detected, token:", token);
      console.log("Token length:", token ? token.length : 0);
      setIsAuthed(!!token);
    };

    // Check initial state
    handleStorageChange();

    // Listen for storage changes (login/logout)
    window.addEventListener('storage', handleStorageChange);
    
    // Also check on focus to catch changes from other tabs
    window.addEventListener('focus', handleStorageChange);

    // Check if this is the first visit
    const hasVisited = localStorage.getItem('hasVisitedKayalstay');
    if (!hasVisited) {
      setShowWelcome(true);
    }

    // Cleanup listeners
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleStorageChange);
    };
  }, []);

  // Custom event for authentication changes
  useEffect(() => {
    const handleAuthChange = () => {
      const token = getToken();
      console.log("Auth change detected, token:", token);
      console.log("Token length:", token ? token.length : 0);
      setIsAuthed(!!token);
    };

    // Listen for custom auth change events
    window.addEventListener('authChange', handleAuthChange);
    
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  const closeWelcome = () => {
    localStorage.setItem('hasVisitedKayalstay', 'true');
    setShowWelcome(false);
  };

  // Function to manually update authentication state
  const updateAuthState = () => {
    console.log("Manually updating auth state");
    const token = getToken();
    console.log("Current token:", token);
    console.log("Token length:", token ? token.length : 0);
    setIsAuthed(!!token);
  };

  // Expose the function globally for debugging
  useEffect(() => {
    (window as any).updateAuthState = updateAuthState;
  }, []);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)' }}>
      {/* Welcome Popup */}
      {showWelcome && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          animation: 'fadeIn 0.4s ease'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '60px 50px',
            maxWidth: '500px',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            position: 'relative',
            animation: 'slideUp 0.5s ease'
          }}>
            <img 
              src="/logo192.png" 
              alt="Quickit Logo" 
              style={{
                width: '120px',
                height: '120px',
                marginBottom: '20px',
                animation: 'pulse 2s ease-in-out infinite'
              }} 
            />
            <h1 style={{
              fontSize: '38px',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '10px',
              letterSpacing: '1px'
            }}>WELCOME TO</h1>
            <h2 style={{
              fontSize: '48px',
              fontWeight: 900,
              background: 'linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '20px',
              letterSpacing: '2px'
            }}>Quickit</h2>
            <p style={{
              fontSize: '16px',
              color: '#626C71',
              marginBottom: '30px',
              lineHeight: '1.6'
            }}>Your Perfect Stay, Just a Click Away</p>
            <button
              onClick={closeWelcome}
              style={{
                background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
                color: 'white',
                padding: '16px 48px',
                borderRadius: '50px',
                border: 'none',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(6, 182, 212, 0.4)',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(6, 182, 212, 0.5)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(6, 182, 212, 0.4)';
              }}
            >
              Get Started
            </button>
          </div>
        </div>
      )}

      <nav style={{ 
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(6, 182, 212, 0.1)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
      }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none'
          }}>
            <img 
              src="/logo192.png" 
              alt="Quickit Logo" 
              style={{
                width: '100px',
                height: '100px',
                transition: 'transform 0.3s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            />
          </Link>
          <div className="flex gap-6 items-center" style={{ fontSize: '14px', fontWeight: 500 }}>
            <Link to="/listings" style={{ color: '#13343B', textDecoration: 'none', transition: 'all 0.3s' }}>Browse</Link>
            <Link to="/tiffin-centers" style={{ color: '#13343B', textDecoration: 'none', transition: 'all 0.3s' }}>Tiffin Centers</Link>
            <Link to="/accessories" style={{ color: '#13343B', textDecoration: 'none', transition: 'all 0.3s' }}>Accessories</Link>
            {isAuthed ? (
              <>
                <Link to="/favorites" style={{ color: '#13343B', textDecoration: 'none', transition: 'all 0.3s' }}>Favorites</Link>
                <Link to="/my-bookings" style={{ color: '#13343B', textDecoration: 'none', transition: 'all 0.3s' }}>My Bookings</Link>
                <Link to="/cart" style={{ color: '#13343B', textDecoration: 'none', transition: 'all 0.3s' }}>🛒 Cart</Link>
                <Link
                  to="/new"
                  style={{
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                    color: 'white',
                    padding: '10px 24px',
                    borderRadius: '50px',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '14px',
                    boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)',
                    transition: 'all 0.3s',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  ➕ Post a Property
                </Link>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Link to="/profile" style={{ color: '#13343B', textDecoration: 'none', transition: 'all 0.3s' }}>
                    Profile
                  </Link>
                </div>
                <Link to="/dashboard" style={{ color: '#13343B', textDecoration: 'none' }}>Dashboard</Link>
                <button
                  onClick={() => { 
                    localStorage.clear(); 
                    setIsAuthed(false);
                    console.log("User logged out, auth state updated to false");
                    window.location.href = '/'; 
                  }}
                  style={{
                    background: 'transparent',
                    color: '#13343B',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(6, 182, 212, 0.2)',
                    cursor: 'pointer',
                    fontWeight: 500,
                    transition: 'all 0.3s'
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  style={{
                    background: 'transparent',
                    color: '#13343B',
                    padding: '10px 24px',
                    borderRadius: '8px',
                    border: '2px solid rgba(6, 182, 212, 0.3)',
                    textDecoration: 'none',
                    fontWeight: 600,
                    transition: 'all 0.3s',
                    display: 'inline-block'
                  }}
                >Login</Link>
                <Link to="/signup" style={{
                  background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
                  color: 'white',
                  padding: '10px 24px',
                  borderRadius: '50px',
                  textDecoration: 'none',
                  fontWeight: 600,
                  boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)',
                  transition: 'all 0.3s'
                }}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/listings" />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/listings/:id" element={<PropertyDetail />} />
          <Route path="/tiffin-centers" element={<TiffinCenters />} />
          <Route path="/tiffin-centers/:id" element={<TiffinCenterDetail />} />
          <Route path="/new-tiffin-center" element={isAuthed ? <TiffinCenterForm /> : <Navigate to="/login" />} />
          <Route path="/edit-tiffin-center/:id" element={isAuthed ? <TiffinCenterForm /> : <Navigate to="/login" />} />
          <Route path="/favorites" element={isAuthed ? <Favorites /> : <Navigate to="/login" />} />
          <Route path="/book/:id" element={isAuthed ? <Booking /> : <Navigate to="/login" />} />
          <Route path="/my-bookings" element={isAuthed ? <MyBookings /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuthed ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/new" element={isAuthed ? <PropertyForm /> : <Navigate to="/login" />} />
          <Route path="/edit/:id" element={isAuthed ? <PropertyForm /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={isAuthed ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/accessories" element={<Accessories />} />
          <Route path="/accessories/:id" element={<AccessoryDetail />} />
          <Route path="/new-accessory" element={isAuthed ? <AccessoryForm /> : <Navigate to="/login" />} />
          <Route path="/edit-accessory/:id" element={isAuthed ? <AccessoryForm /> : <Navigate to="/login" />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
        </Routes>
      </main>

      {/* WhatsApp Float Button */}
      <a
        href="https://wa.me/1234567890"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          background: 'linear-gradient(135deg, #25D366 0%, #1DA851 100%)',
          color: 'white',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          boxShadow: '0 8px 25px rgba(37, 211, 102, 0.4)',
          cursor: 'pointer',
          zIndex: 1000,
          transition: 'all 0.3s ease',
          textDecoration: 'none'
        }}
      >
        💬
      </a>
    </div>
  );
}