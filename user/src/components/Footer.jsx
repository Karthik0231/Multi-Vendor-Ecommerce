import React from 'react';

const Footer = () => {
  const styles = {
    footer: {
      background: '#111827',
      color: 'white',
      padding: '3rem 0'
    },
    sectionContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 2rem'
    },
    footerGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '2rem',
      marginBottom: '2rem'
    },
    footerSection: {
      space: '1rem'
    },
    footerTitle: {
      fontSize: '1.125rem',
      fontWeight: '600',
      marginBottom: '1rem'
    },
    footerLink: {
      color: '#9ca3af',
      textDecoration: 'none',
      transition: 'color 0.3s ease',
      display: 'block',
      marginBottom: '0.5rem',
      cursor: 'pointer'
    },
    socialButtons: {
      display: 'flex',
      gap: '1rem'
    },
    socialBtn: {
      width: '2.5rem',
      height: '2.5rem',
      borderRadius: '50%',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    footerBottom: {
      borderTop: '1px solid #374151',
      paddingTop: '2rem',
      textAlign: 'center',
      color: '#9ca3af'
    }
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.sectionContainer}>
        <div style={styles.footerGrid}>
          <div style={styles.footerSection}>
            <h3 style={{
              ...styles.footerTitle, 
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent'
            }}>
              ShopVibe
            </h3>
            <p style={{color: '#9ca3af'}}>
              Your premium shopping destination for everything you need and love.
            </p>
          </div>
          
          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>Quick Links</h4>
            <a href="/" style={styles.footerLink}>Home</a>
            <a href="/products" style={styles.footerLink}>Products</a>
            <a href="/about" style={styles.footerLink}>About</a>
          </div>
          
          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>Support</h4>
            <a href="#" style={styles.footerLink}>Help Center</a>
            <a href="#" style={styles.footerLink}>Contact Us</a>
            <a href="#" style={styles.footerLink}>Shipping Info</a>
            <a href="#" style={styles.footerLink}>Returns</a>
          </div>
          
          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>Connect</h4>
            <div style={styles.socialButtons}>
              <button style={{...styles.socialBtn, background: '#8b5cf6'}}>📘</button>
              <button style={{...styles.socialBtn, background: '#ec4899'}}>📷</button>
              <button style={{...styles.socialBtn, background: '#3b82f6'}}>🐦</button>
            </div>
          </div>
        </div>
        
        <div style={styles.footerBottom}>
          <p>© 2024 ShopVibe. All rights reserved. Made with ❤️ for amazing shoppers.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;