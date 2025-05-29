import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import swal from 'sweetalert2';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Badge } from '@mui/material';
import { config } from '../Config/Config';
import { userContext } from '../Context/Context';

const Header = () => {
  const { host } = config;
  const { cart, getCart } = useContext(userContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const token = localStorage.getItem('userToken');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    if (token) {
      getCart();
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [token, getCart]);

  const styles = {
    header: {
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 1000,
      transition: 'all 0.3s ease',
      background: isScrolled ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
      backdropFilter: isScrolled ? 'blur(20px)' : 'none',
      boxShadow: isScrolled ? '0 4px 20px rgba(0, 0, 0, 0.1)' : 'none'
    },
    navContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '64px'
    },
    logo: {
      fontSize: '1.5rem',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    nav: {
      display: 'flex',
      gap: '2rem'
    },
    navLink: {
      color: 'orange',
      textDecoration: 'none',
      fontWeight: '800',
      transition: 'color 0.3s ease',
      cursor: 'pointer',

    },
    signUpBtn: {
      background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
      color: 'white',
      padding: '0.5rem 1.5rem',
      borderRadius: '50px',
      border: 'none',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
    }
  };

  return (
    <header style={styles.header}>
      <div style={styles.navContainer}>
        <div style={styles.logo}>ShopVibe</div>
        {token ?
          <nav style={styles.nav}>
            <a href="/" style={styles.navLink}>Home</a>
            <a href="/products" style={styles.navLink}>Products</a>
            <a href="/about" style={styles.navLink}>About</a>
            <a href="/orders" style={styles.navLink}>Orders</a>
          </nav>
          : null}
        <div>
          {token ? (
            <a href="/cart" style={styles.signUpBtn}>
              <Badge badgeContent={cart.length} color="error">
                <ShoppingCartIcon />
              </Badge>
            </a>
          ) : null}
        </div>
        <div>
          {token ? (
            <button 
              style={styles.signUpBtn} 
              onClick={() => {
                swal.fire({
                  title: 'Are you sure?',
                  text: "You won't be able to revert this!",
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Yes, Logout!'
                }).then((result) => {
                  if (result.isConfirmed) {
                    localStorage.removeItem('userToken');
                    window.location.reload();
                  }
                })
              }}
            >
              Logout
            </button>
          ) : (
            <a href="/login" style={styles.signUpBtn}>Login</a>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;