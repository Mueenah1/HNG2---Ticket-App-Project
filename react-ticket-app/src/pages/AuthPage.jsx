import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { authService } from '../services/authService';

const AuthPage = ({ onLogin, onSignup }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoginMode, setIsLoginMode] = useState(searchParams.get('mode') !== 'signup');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsLoginMode(searchParams.get('mode') !== 'signup');
  }, [searchParams]);

  const toggleMode = () => {
    const newMode = isLoginMode ? 'signup' : 'login';
    setSearchParams({ mode: newMode });
    setError(null);
    setValidationErrors({});
  };

  const validate = () => {
    const errors = {};
    if (!email) errors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Email is invalid.";
    
    if (!password) errors.password = "Password is required.";
    else if (password.length < 6) errors.password = "Password must be at least 6 characters.";
    
    if (!isLoginMode) {
      if (!confirmPassword) errors.confirmPassword = "Please confirm your password.";
      else if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match.";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      if (isLoginMode) {
        await authService.login(email, password);
        onLogin(); 
      } else {
        await authService.signup(email, password);
        onSignup(); 
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>{isLoginMode ? 'Log In' : 'Sign Up'}</h2>
      <p>
        {isLoginMode ? "Don't have an account? " : "Already have an account? "}
        <a href="#" onClick={toggleMode}>
          {isLoginMode ? 'Sign up' : 'Log in'}
        </a>
      </p>

      { }
      {error && <div className="toast toast-error" style={{position: 'relative', bottom: 'auto', right: 'auto', margin: '1rem 0'}}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
          />
          {validationErrors.email && <p className="form-error">{validationErrors.email}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          {validationErrors.password && <p className="form-error">{validationErrors.password}</p>}
        </div>
        {!isLoginMode && (
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
            />
            {validationErrors.confirmPassword && <p className="form-error">{validationErrors.confirmPassword}</p>}
          </div>
        )}
        <button type="submit" className="btn btn-primary" style={{width: '100%'}} disabled={loading}>
          {loading ? 'Submitting...' : (isLoginMode ? 'Login' : 'Create Account')}
        </button>
      </form>
    </div>
  );
};

export default AuthPage;