import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import bannerImg from '../assets/store-banner.jpg'; // Make sure to add an image in assets

const Home = () => {
  return (
    <div className="home-container">
      <section className="hero">
        <div className="hero-text">
          <h1>Discover & Rate Your Favorite Stores</h1>
          <p>Explore local businesses, leave reviews, and see what others think. Your opinion helps build better experiences.</p>
          <div className="hero-buttons">
            <Link to="/signup"><button>Get Started</button></Link>
            <Link to="/stores"><button className="btn-outline">Browse Stores</button></Link>
          </div>
        </div>
        <div className="hero-image">
          <img src={bannerImg} alt="Storefront Banner" />
        </div>
      </section>

      <section className="features">
        <h2>Why Use StoreRatings?</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Rate Stores</h3>
            <p>Share your honest opinions and help others find the best experiences.</p>
          </div>
          <div className="feature-card">
            <h3>View Ratings</h3>
            <p>See what the community thinks before you visit a new store.</p>
          </div>
          <div className="feature-card">
            <h3>Manage Your Feedback</h3>
            <p>Easily update or manage the ratings you've given in your dashboard.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} StoreRatings. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
