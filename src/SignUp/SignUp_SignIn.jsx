import React, { useState } from 'react'
import '@fortawesome/fontawesome-free/css/all.min.css';
import './style.css'
import { auth, googleProvider } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile, 
  sendPasswordResetEmail,
  signInWithPopup
} from 'firebase/auth';

const SignUp_SignIn = () => {
  const [registerActive, setRegisterActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    loginEmail: '',
    loginPassword: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    loginEmail: '',
    loginPassword: '',
    general: ''
  });

  const toggleLoginActive = () => {
    setRegisterActive(false);
    clearErrors();
  }

  const toggleRegisterActive = () => {
    setRegisterActive(true);
    clearErrors();
  }

  const clearErrors = () => {
    setErrors({
      name: '',
      email: '',
      password: '',
      phone: '',
      loginEmail: '',
      loginPassword: '',
      general: ''
    });
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name] || errors.general) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
        general: ''
      }));
    }
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const validatePassword = (password) => {
    return password.length >= 6;
  }

  const validatePhone = (phone) => {
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    return phoneRegex.test(phone);
  }

  const validateName = (name) => {
    const nameTrimmed = name.trim();
    
    if (nameTrimmed.length === 0) {
      return 'Name is required';
    }
    
    if (nameTrimmed.length < 2) {
      return 'Name must be at least 2 characters long';
    }
    
    const hasNumbers = /\d/.test(nameTrimmed);
    if (hasNumbers) {
      return 'Name cannot contain numbers';
    }
    
    const isValidFormat = /^[a-zA-Z\s\-']+$/.test(nameTrimmed);
    if (!isValidFormat) {
      return 'Name can only contain letters, spaces, hyphens, and apostrophes';
    }
    
    const hasLetters = /[a-zA-Z]/.test(nameTrimmed);
    if (!hasLetters) {
      return 'Name must contain at least one letter';
    }
    
    return '';
  }

  const validateSignUp = () => {
    const newErrors = {};
    
    const nameError = validateName(formData.name);
    if (nameError) {
      newErrors.name = nameError;
    }
    
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters long';
    }
    
    if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  }

  const validateSignIn = () => {
    const newErrors = {};
    
    if (!validateEmail(formData.loginEmail)) {
      newErrors.loginEmail = 'Please enter a valid email address';
    }
    
    if (!formData.loginPassword) {
      newErrors.loginPassword = 'Password is required';
    }
    
    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  }

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (validateSignUp()) {
      setLoading(true);
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await updateProfile(userCredential.user, {
          displayName: formData.name
        });
        
        alert(`Account created successfully for ${formData.name}!`);
        setFormData({
          name: '',
          email: '',
          password: '',
          phone: '',
          loginEmail: '',
          loginPassword: ''
        });
        // App.jsx will automatically redirect because of onAuthStateChanged
      } catch (error) {
        console.error("SignUp Error:", error.code, error.message);
        let errorMessage = 'Failed to create account.';
        if (error.code === 'auth/email-already-in-use') {
          errorMessage = 'This email is already in use.';
        } else if (error.code === 'auth/invalid-email') {
          errorMessage = 'Invalid email address.';
        } else if (error.code === 'auth/weak-password') {
          errorMessage = 'Password is too weak.';
        } else if (error.code === 'auth/network-request-failed') {
          errorMessage = 'Network error: Please check your internet connection or disable ad-blockers/firewalls and try again.';
        } else {
          errorMessage = 'Error: ' + error.message;
        }
        setErrors(prev => ({ ...prev, general: errorMessage }));
      } finally {
        setLoading(false);
      }
    }
  }

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (validateSignIn()) {
      setLoading(true);
      try {
        await signInWithEmailAndPassword(auth, formData.loginEmail, formData.loginPassword);
      } catch (error) {
        console.error("SignIn Error:", error.code, error.message);
        let errorMessage = 'Failed to sign in.';
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
          errorMessage = 'Invalid email or password.';
        } else if (error.code === 'auth/too-many-requests') {
          errorMessage = 'Too many failed attempts. Please try again later.';
        } else if (error.code === 'auth/network-request-failed') {
          errorMessage = 'Network error: Please check your internet connection and try again.';
        } else {
          errorMessage = 'Error: ' + error.message;
        }
        setErrors(prev => ({ ...prev, general: errorMessage }));
      } finally {
        setLoading(false);
      }
    }
  }

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google Sign In Error:", error.code, error.message);
      let errorMessage = 'Google Sign In failed: ' + error.message;
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign in popup was closed.';
      }
      setErrors(prev => ({ ...prev, general: errorMessage }));
    } finally {
      setLoading(false);
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!formData.loginEmail) {
      setErrors(prev => ({
        ...prev,
        loginEmail: 'Please enter your email to reset password'
      }));
      return;
    }
    
    if (!validateEmail(formData.loginEmail)) {
      setErrors(prev => ({
        ...prev,
        loginEmail: 'Please enter a valid email address'
      }));
      return;
    }

    try {
      await sendPasswordResetEmail(auth, formData.loginEmail);
      setErrors(prev => ({ ...prev, general: `Password reset link sent to ${formData.loginEmail}` }));
    } catch (error) {
      console.error("Reset Error:", error.code);
      let errorMessage = 'Failed to send reset email.';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No user found with this email.';
      }
      setErrors(prev => ({ ...prev, general: errorMessage }));
    }
  }

  return (
    <div className={`container ${registerActive ? 'active' : ''}`}> 
      <div className="form-container sign-up">
        <form onSubmit={handleSignUp} autoComplete="off">
          <h1>Create Account</h1>
          <div className="social-icons">
            <a href="#" className='icon' onClick={handleGoogleSignIn}> <i className="fa-brands fa-google-plus-g"></i></a>
            <a href="#" className='icon'> <i className="fa-brands fa-facebook-f"></i></a>
            <a href="#" className='icon'> <i className="fa-brands fa-github"></i></a>
            <a href="#" className='icon'> <i className="fa-brands fa-linkedin-in"></i></a>
          </div>
          <span>or use your Email for Registration</span>
          
          {errors.general && (
            <div className="error-message" style={{ 
              textAlign: 'center', 
              padding: '10px', 
              background: '#fef2f2', 
              borderRadius: '8px', 
              marginBottom: '10px',
              border: '1px solid #fee2e2'
            }}>
              {errors.general}
            </div>
          )}

          <input 
            type="text" 
            name="name"
            placeholder='Full Name'
            value={formData.name}
            onChange={handleInputChange}
            className={errors.name ? 'error' : ''}
            maxLength={50}
            disabled={loading}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
          
          <input 
            type="email" 
            name="email"
            placeholder='Email'
            value={formData.email}
            onChange={handleInputChange}
            className={errors.email ? 'error' : ''}
            disabled={loading}
            autoComplete="off"
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
          
          <input 
            type="password" 
            name="password"
            placeholder='Password'
            value={formData.password}
            onChange={handleInputChange}
            className={errors.password ? 'error' : ''}
            disabled={loading}
            autoComplete="new-password"
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
          
          <input 
            type="tel" 
            name="phone"
            placeholder='Phone Number'
            value={formData.phone}
            onChange={handleInputChange}
            className={errors.phone ? 'error' : ''}
            disabled={loading}
          />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
          
          <button type='submit' disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
      </div>
      
      <div className="form-container sign-in">
        <form onSubmit={handleSignIn} autoComplete="off">
          <h1>Sign In</h1>
          <div className="social-icons">
            <a href="#" className='icon' onClick={handleGoogleSignIn}> <i className="fa-brands fa-google-plus-g"></i></a>
            <a href="#" className='icon'> <i className="fa-brands fa-facebook-f"></i></a>
            <a href="#" className='icon'> <i className="fa-brands fa-github"></i></a>
            <a href="#" className='icon'> <i className="fa-brands fa-linkedin-in"></i></a>
          </div>
          <span>or Use Your Email Password</span>
          
          {errors.general && (
            <div className="error-message" style={{ 
              textAlign: 'center', 
              padding: '10px', 
              background: '#fef2f2', 
              borderRadius: '8px', 
              marginBottom: '10px',
              border: '1px solid #fee2e2'
            }}>
              {errors.general}
            </div>
          )}

          <input 
            type="email" 
            name="loginEmail"
            placeholder='Email'
            value={formData.loginEmail}
            onChange={handleInputChange}
            className={errors.loginEmail ? 'error' : ''}
            disabled={loading}
            autoComplete="off"
          />
          {errors.loginEmail && <span className="error-message">{errors.loginEmail}</span>}
          
          <input 
            type="password" 
            name="loginPassword"
            placeholder='Password'
            value={formData.loginPassword}
            onChange={handleInputChange}
            className={errors.loginPassword ? 'error' : ''}
            disabled={loading}
            autoComplete="new-password"
          />
          {errors.loginPassword && <span className="error-message">{errors.loginPassword}</span>}
          
          <a href="#" onClick={handleForgotPassword}>Forgot Your Password?</a>
          <button type="submit" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
      
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Welcome Back!</h1>
            <p>Submit your personal details to gain complete Access</p>
            <button className='hidden' id='login' onClick={toggleLoginActive}>Sign In</button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Hello, Friend!</h1>
            <p>Join now to enjoy all the functionalities we offer.</p>
            <button className='hidden' id='register' onClick={toggleRegisterActive}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp_SignIn;