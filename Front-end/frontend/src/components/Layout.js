import React from 'react';
import Logo from './92Logo.png'; 

const Layout = () => {
  return (
    <div className="container">
      <header className="flex">
 
        <img src={Logo} alt="SkillShare Hub Logo" className="site-logo" />
        <nav>
          <a href="/login" className="btn">Login</a>
          <a href="/signup" className="btn">Sign Up</a>
        </nav>
      </header>

      <section>
        <h2>Welcome to SkillShare Hub</h2>
        <p>Share your skills and learn from others in our community.</p>
        <a href="/signup" className="btn">Get Started</a>
      </section>

      <section className="card">
        <h3>Why Join?</h3>
        <p>Expand your knowledge, connect with like-minded individuals, and grow your skillset.</p>
      </section>

      <footer>
        <p>&copy; 2025 SkillShare Hub. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
