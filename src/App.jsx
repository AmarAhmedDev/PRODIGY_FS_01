import React, { useState, useEffect } from 'react'
import SignUp_SignIn from './SignUp/SignUp_SignIn'
import { auth } from './firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth state changed:", currentUser);
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      alert('Error signing out: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        color: 'white',
        fontSize: '24px',
        fontWeight: 'bold',
        textShadow: '0 2px 4px rgba(0,0,0,0.2)'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      width: '100%'
    }}>
      {user ? (
        <div className="container" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          textAlign: 'center',
          minHeight: '400px',
          position: 'static' // Override absolute positioning if any
        }}>
          <div style={{ marginBottom: '20px' }}>
            <i className="fa-solid fa-circle-check" style={{ fontSize: '60px', color: '#10b981', marginBottom: '20px' }}></i>
            <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>Welcome Back!</h1>
            <h2 style={{ color: '#6366f1', fontSize: '24px', fontWeight: '600' }}>{user.displayName || user.email}</h2>
          </div>
          
          <p style={{ color: '#64748b', fontSize: '16px', maxWidth: '300px' }}>
            You have successfully logged into your secure account.
          </p>
          
          <div style={{ 
            marginTop: '30px', 
            padding: '20px', 
            background: '#f8fafc', 
            borderRadius: '12px',
            width: '100%',
            maxWidth: '350px',
            textAlign: 'left'
          }}>
            <p style={{ margin: '5px 0', fontSize: '14px' }}><strong><i className="fa-regular fa-envelope" style={{ marginRight: '10px' }}></i>Email:</strong> {user.email}</p>
            <p style={{ margin: '5px 0', fontSize: '14px' }}><strong><i className="fa-regular fa-calendar" style={{ marginRight: '10px' }}></i>Joined:</strong> {new Date(user.metadata.creationTime).toLocaleDateString()}</p>
          </div>
          
          <button 
            onClick={handleSignOut}
            style={{
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              marginTop: '30px',
              padding: '12px 60px'
            }}
          >
            Sign Out
          </button>
        </div>
      ) : (
        <SignUp_SignIn />
      )}
    </div>
  )
}

export default App
