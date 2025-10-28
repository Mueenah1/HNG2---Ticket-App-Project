import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => (
  <div className="hero">
    <div className="hero-wave">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path fill="#F9FAFB" fillOpacity="1" d="M0,192L48,176C96,160,192,128,288,133.3C384,139,480,181,576,186.7C672,192,768,160,864,144C960,128,1056,128,1152,149.3C1248,171,1344,213,1392,234.7L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      </svg>
    </div>
    <div className="deco-circle deco-circle-1"></div>
    <div className="app-container" style={{ position: 'relative', zIndex: 2 }}>
      <h1>Manage Your Tickets.</h1>
      <p>The best solution for your team's support workflow. Simple, fast, and efficient.</p>
      <div className="hero-cta">
        <Link to="/auth?mode=login" className="btn btn-secondary">Login</Link>
        <Link to="/auth?mode=signup" className="btn btn-primary">Get Started</Link>
      </div>
    </div>
  </div>
);

export default LandingPage;