import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from "react-router-dom";
import { userContext } from '../Context/Context';

const Home = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const navigate = useNavigate();

  const features = [
    {
      icon: "🏪",
      title: "Endless Variety",
      description: "Explore millions of products from multiple categories all in one place.",
      gradient: "linear-gradient(135deg, #8b5cf6, #ec4899)",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      icon: "🔒",
      title: "Safe Shopping",
      description: "Shop with confidence with our secure payment system and buyer protection.",
      gradient: "linear-gradient(135deg, #3b82f6, #06b6d4)",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      icon: "🚚",
      title: "Fast Delivery",
      description: "Get your orders delivered quickly with real-time tracking.",
      gradient: "linear-gradient(135deg, #10b981, #059669)",
      image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    }
  ];

  const statistics = [
    { icon: "🛍️", value: "10K+", label: "Products Available", color: "#8b5cf6" },
    { icon: "🏷️", value: "50+", label: "Categories", color: "#3b82f6" },
    { icon: "⭐", value: "50K+", label: "Happy Customers", color: "#10b981" },
    { icon: "📈", value: "99%", label: "Satisfaction Rate", color: "#f59e0b" }
  ];

  const popularCategories = [
    {
      icon: "👗",
      title: "Fashion & Accessories",
      description: "Trendy clothing, shoes, and accessories for all styles.",
      gradient: "linear-gradient(135deg, #ec4899, #ef4444, #fbbf24)",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      icon: "📱",
      title: "Electronics",
      description: "Latest gadgets and electronic devices at great prices.",
      gradient: "linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      icon: "💄",
      title: "Beauty & Health",
      description: "Quality beauty products and health essentials.",
      gradient: "linear-gradient(135deg, #8b5cf6, #ec4899, #ef4444)",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    }
  ];

  // Hero carousel images
  const heroImages = [
    "https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-rotate hero images
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    },
    heroSection: {
      position: 'relative',
      paddingTop: '5rem',
      paddingBottom: '5rem',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #1e1b4b, #1e3a8a, #312e81)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center'
    },
    heroContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 2rem',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '3rem',
      alignItems: 'center'
    },
    heroText: {
      color: 'white',
      space: '2rem'
    },
    heroTitle: {
      fontSize: '4rem',
      fontWeight: '800',
      lineHeight: '1.1',
      marginBottom: '1rem'
    },
    heroSubtitle: {
      fontSize: '1.25rem',
      color: '#d1d5db',
      marginBottom: '2rem',
      lineHeight: '1.6'
    },
    heroButtons: {
      display: 'flex',
      gap: '1rem',
      flexWrap: 'wrap'
    },
    primaryBtn: {
      background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
      color: 'white',
      padding: '1rem 2rem',
      borderRadius: '50px',
      border: 'none',
      fontWeight: '600',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 8px 30px rgba(236, 72, 153, 0.3)'
    },
    secondaryBtn: {
      border: '2px solid rgba(255, 255, 255, 0.3)',
      color: 'white',
      padding: '1rem 2rem',
      borderRadius: '50px',
      background: 'transparent',
      fontWeight: '600',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)'
    },
    heroVisual: {
      position: 'relative',
      height: '500px',
      borderRadius: '1.5rem',
      overflow: 'hidden',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)'
    },
    heroImageContainer: {
      position: 'relative',
      width: '100%',
      height: '100%',
      borderRadius: '1.5rem',
      overflow: 'hidden'
    },
    heroImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'opacity 1s ease-in-out'
    },
    heroOverlay: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(45deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '3rem',
      fontWeight: 'bold',
      textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
    },
    heroIndicators: {
      position: 'absolute',
      bottom: '1rem',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '0.5rem'
    },
    indicator: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    activeIndicator: {
      backgroundColor: 'white',
      transform: 'scale(1.2)'
    },
    statsSection: {
      position: 'relative',
      marginTop: '-2.5rem',
      zIndex: 10
    },
    statsContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 2rem',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem'
    },
    statCard: {
      background: 'white',
      borderRadius: '1rem',
      padding: '2rem',
      textAlign: 'center',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      border: '1px solid #f3f4f6'
    },
    statIcon: {
      fontSize: '2rem',
      marginBottom: '0.5rem'
    },
    statValue: {
      fontSize: '2rem',
      fontWeight: '800',
      marginBottom: '0.5rem'
    },
    statLabel: {
      color: '#6b7280',
      fontSize: '0.875rem',
      fontWeight: '500'
    },
    featuresSection: {
      padding: '5rem 0',
      background: 'white'
    },
    sectionContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 2rem'
    },
    sectionHeader: {
      textAlign: 'center',
      marginBottom: '4rem'
    },
    sectionTitle: {
      fontSize: '3rem',
      fontWeight: '800',
      color: '#1f2937',
      marginBottom: '1rem'
    },
    sectionSubtitle: {
      fontSize: '1.25rem',
      color: '#6b7280',
      maxWidth: '600px',
      margin: '0 auto'
    },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '2rem'
    },
    featureCard: {
      background: 'white',
      borderRadius: '1.5rem',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f3f4f6',
      transition: 'all 0.5s ease',
      position: 'relative'
    },
    featureImageContainer: {
      position: 'relative',
      height: '200px',
      overflow: 'hidden'
    },
    featureImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.3s ease'
    },
    featureImageOverlay: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    featureIcon: {
      width: '4rem',
      height: '4rem',
      borderRadius: '1rem',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.5rem',
      color: 'white',
      transition: 'transform 0.3s ease'
    },
    featureContent: {
      padding: '2rem',
      textAlign: 'center'
    },
    featureTitle: {
      fontSize: '1.25rem',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '1rem'
    },
    featureDescription: {
      color: '#6b7280',
      lineHeight: '1.6'
    },
    categoriesSection: {
      padding: '5rem 0',
      background: 'linear-gradient(135deg, #f9fafb, #e0f2fe)'
    },
    categoriesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem'
    },
    categoryCard: {
      background: 'white',
      borderRadius: '1.5rem',
      overflow: 'hidden',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.5s ease'
    },
    categoryImageContainer: {
      position: 'relative',
      height: '200px',
      overflow: 'hidden'
    },
    categoryImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.3s ease'
    },
    categoryImageOverlay: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    categoryIcon: {
      fontSize: '4rem',
      color: 'white',
      textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
    },
    categoryContent: {
      padding: '1.5rem'
    },
    categoryTitleRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      marginBottom: '0.75rem'
    },
    categoryTitle: {
      fontSize: '1.125rem',
      fontWeight: '700',
      color: '#1f2937'
    },
    categoryDescription: {
      color: '#6b7280',
      fontSize: '0.875rem',
      lineHeight: '1.6',
      marginBottom: '0.75rem'
    },
    ctaSection: {
      padding: '5rem 0',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #1e1b4b, #1e3a8a, #8b5cf6)',
      textAlign: 'center'
    },
    ctaContent: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '0 2rem',
      position: 'relative'
    },
    ctaTitle: {
      fontSize: '3rem',
      fontWeight: '800',
      color: 'white',
      marginBottom: '1rem'
    },
    ctaSubtitle: {
      fontSize: '1.25rem',
      color: '#d1d5db',
      marginBottom: '2rem',
      maxWidth: '600px',
      margin: '0 auto 2rem'
    },
    ctaButtons: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      flexWrap: 'wrap'
    }
  };

  return (
    <div style={styles.container}>
      {/* Import Header Component */}
      <Header />

      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroContainer}>
          <div style={styles.heroText}>
            <h1 style={styles.heroTitle}>
              Your <span style={{background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Premium</span><br />
              Shopping<br />
              <span style={{background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Destination</span>
            </h1>
            <p style={styles.heroSubtitle}>
              Discover amazing products at incredible prices. Experience shopping like never before with our curated collection.
            </p>
            <div style={styles.heroButtons}>
              <button 
                style={styles.primaryBtn}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 15px 40px rgba(236, 72, 153, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 8px 30px rgba(236, 72, 153, 0.3)';
                }}
                onClick={() => navigate('/products')}
              >
                Start Shopping →
              </button>
            </div>
          </div>
          
          <div style={styles.heroVisual}>
            <div style={styles.heroImageContainer}>
              <img 
                src={heroImages[currentImageIndex]} 
                alt="Shopping Experience"
                style={styles.heroImage}
              />
              <div style={styles.heroOverlay}>
                ShopVibe
              </div>
              <div style={styles.heroIndicators}>
                {heroImages.map((_, index) => (
                  <div
                    key={index}
                    style={{
                      ...styles.indicator,
                      ...(index === currentImageIndex ? styles.activeIndicator : {})
                    }}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section style={styles.statsSection}>
        <div style={styles.statsContainer}>
          {statistics.map((stat, index) => (
            <div 
              key={index} 
              style={styles.statCard}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-8px)';
                e.target.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div style={styles.statIcon}>{stat.icon}</div>
              <div style={{...styles.statValue, color: stat.color}}>{stat.value}</div>
              <div style={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.featuresSection}>
        <div style={styles.sectionContainer}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>
              Why Choose <span style={{background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>ShopVibe</span>
            </h2>
            <p style={styles.sectionSubtitle}>
              We've reimagined online shopping to be more secure, faster, and enjoyable than ever before.
            </p>
          </div>
          
          <div style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div 
                key={index}
                style={styles.featureCard}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-16px)';
                  e.target.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.15)';
                  const img = e.target.querySelector('img');
                  if (img) img.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                  const img = e.target.querySelector('img');
                  if (img) img.style.transform = 'scale(1)';
                }}
              >
                <div style={styles.featureImageContainer}>
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    style={styles.featureImage}
                  />
                  <div style={styles.featureImageOverlay}>
                    <div style={{...styles.featureIcon, background: feature.gradient}}>
                      {feature.icon}
                    </div>
                  </div>
                </div>
                <div style={styles.featureContent}>
                  <h3 style={styles.featureTitle}>{feature.title}</h3>
                  <p style={styles.featureDescription}>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section style={styles.categoriesSection}>
        <div style={styles.sectionContainer}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Popular Categories</h2>
            <p style={styles.sectionSubtitle}>
              Explore our carefully curated categories designed for every lifestyle
            </p>
          </div>
          
          <div style={styles.categoriesGrid}>
            {popularCategories.map((category, index) => (
              <div 
                key={index} 
                style={styles.categoryCard}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-8px)';
                  e.target.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.15)';
                  const img = e.target.querySelector('img');
                  if (img) img.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.1)';
                  const img = e.target.querySelector('img');
                  if (img) img.style.transform = 'scale(1)';
                }}
              >
                <div style={styles.categoryImageContainer}>
                  <img 
                    src={category.image} 
                    alt={category.title}
                    style={styles.categoryImage}
                  />
                  <div style={styles.categoryImageOverlay}>
                    <div style={styles.categoryIcon}>{category.icon}</div>
                  </div>
                </div>
                
                <div style={styles.categoryContent}>
                  <div style={styles.categoryTitleRow}>
                    <div style={{fontSize: '1.5rem'}}>{category.icon}</div>
                    <h3 style={styles.categoryTitle}>{category.title}</h3>
                  </div>
                  <p style={styles.categoryDescription}>
                    {category.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>
            Ready to Start Your<br />
            <span style={{background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Shopping Journey?</span>
          </h2>
          <p style={styles.ctaSubtitle}>
            Join thousands of happy customers and discover why ShopVibe is the future of online shopping.
          </p>
          <div style={styles.ctaButtons}>
            <button 
              style={styles.primaryBtn}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 15px 40px rgba(236, 72, 153, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 8px 30px rgba(236, 72, 153, 0.3)';
              }}
              onClick={() => navigate('/products')}
            >
              Explore Products 🚀
            </button>
            <button 
              style={styles.secondaryBtn}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
              onClick={() => navigate('/about')}
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Import Footer Component */}
      <Footer />
    </div>
  );
};

export default Home;