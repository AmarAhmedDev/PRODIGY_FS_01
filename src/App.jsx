import React, { useState, useEffect } from 'react'
import SignUp_SignIn from './SignUp/SignUp_SignIn'
import { auth } from './firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      alert('Signed out successfully!');
    } catch (error) {
      console.error('Sign out error:', error);
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
        fontWeight: 'bold'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div>
      {user ? (
        <div className="container" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          textAlign: 'center',
          margin: '0 auto'
        }}>
          <h1>Welcome, {user.displayName || user.email}!</h1>
          <p>You have successfully authenticated with Firebase.</p>
          <div style={{ marginTop: '20px', color: '#64748b' }}>
            <p><strong>Email:</strong> {user.email}</p>
            {user.metadata.lastSignInTime && (
              <p><strong>Last Sign In:</strong> {new Date(user.metadata.lastSignInTime).toLocaleString()}</p>
            )}
          </div>
          <button 
            onClick={handleSignOut}
            style={{
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              marginTop: '30px'
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
