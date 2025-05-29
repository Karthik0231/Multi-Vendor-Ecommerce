import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: "💡",
      title: "Innovation",
      description: "We constantly evolve our platform to bring you the latest shopping technologies and features that make your experience seamless and enjoyable.",
      gradient: "linear-gradient(135deg, #8b5cf6, #ec4899)"
    },
    {
      icon: "🤝",
      title: "Trust",
      description: "Building lasting relationships through transparency, secure transactions, and reliable service that you can count on every time.",
      gradient: "linear-gradient(135deg, #3b82f6, #06b6d4)"
    },
    {
      icon: "🌟",
      title: "Quality",
      description: "We curate only the finest products and partner with trusted sellers to ensure every purchase meets our high standards.",
      gradient: "linear-gradient(135deg, #10b981, #059669)"
    },
    // {
    //   icon: "❤️",
    //   title: "Customer First",
    //   description: "Your satisfaction is our priority. We listen, adapt, and continuously improve based on your feedback and needs.",
    //   gradient: "linear-gradient(135deg, #f59e0b, #ef4444)"
    // }
  ];

  const milestones = [
    {
      year: "2020",
      title: "The Beginning",
      description: "Started with a vision to revolutionize online shopping by connecting customers with quality products from trusted sources.",
      icon: "🚀"
    },
    {
      year: "2021",
      title: "Rapid Growth",
      description: "Expanded our platform to include over 1,000 sellers and 10,000 products across multiple categories.",
      icon: "📈"
    },
    {
      year: "2022",
      title: "Going Mobile",
      description: "Launched our mobile app and introduced features like real-time tracking and instant notifications.",
      icon: "📱"
    },
    {
      year: "2023",
      title: "Global Reach",
      description: "Extended our services internationally and achieved 50,000+ happy customers milestone.",
      icon: "🌍"
    },
    {
      year: "2024",
      title: "Innovation Hub",
      description: "Introduced AI-powered recommendations, virtual try-on features, and enhanced security protocols.",
      icon: "🔮"
    }
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "Chief Executive Officer",
      description: "Leading ShopVibe's vision with 15+ years of e-commerce experience.",
      image: "👩‍💼",
      gradient: "linear-gradient(135deg, #8b5cf6, #ec4899)"
    },
    {
      name: "Michael Chen",
      role: "Chief Technology Officer",
      description: "Driving our technical innovation and platform architecture.",
      image: "👨‍💻",
      gradient: "linear-gradient(135deg, #3b82f6, #06b6d4)"
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Customer Experience",
      description: "Ensuring every customer interaction exceeds expectations.",
      image: "👩‍🎨",
      gradient: "linear-gradient(135deg, #10b981, #059669)"
    },
    {
      name: "David Kim",
      role: "Head of Operations",
      description: "Optimizing our logistics and seller partnership programs.",
      image: "👨‍🔧",
      gradient: "linear-gradient(135deg, #f59e0b, #ef4444)"
    }
  ];

  const achievements = [
    { icon: "🏆", value: "50K+", label: "Happy Customers", color: "#8b5cf6" },
    { icon: "🛍️", value: "10K+", label: "Products Available", color: "#3b82f6" },
    { icon: "🏪", value: "1K+", label: "Trusted Partners", color: "#10b981" },
    { icon: "⭐", value: "4.9/5", label: "Customer Rating", color: "#f59e0b" }
  ];

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    },
    heroSection: {
      position: 'relative',
      paddingTop: '6rem',
      paddingBottom: '4rem',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #1e1b4b, #1e3a8a, #312e81)',
      textAlign: 'center'
    },
    heroContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 2rem',
      color: 'white'
    },
    heroTitle: {
      fontSize: '4rem',
      fontWeight: '800',
      lineHeight: '1.1',
      marginBottom: '1rem'
    },
    heroSubtitle: {
      fontSize: '1.5rem',
      color: '#d1d5db',
      marginBottom: '2rem',
      maxWidth: '800px',
      margin: '0 auto 2rem',
      lineHeight: '1.6'
    },
    storySection: {
      padding: '5rem 0',
      background: 'white'
    },
    sectionContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 2rem'
    },
    storyGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '4rem',
      alignItems: 'center'
    },
    storyContent: {
      space: '1.5rem'
    },
    storyTitle: {
      fontSize: '2.5rem',
      fontWeight: '800',
      color: '#1f2937',
      marginBottom: '1.5rem'
    },
    storyText: {
      fontSize: '1.125rem',
      color: '#6b7280',
      lineHeight: '1.8',
      marginBottom: '1.5rem'
    },
    storyVisual: {
      position: 'relative',
      height: '400px',
      borderRadius: '1.5rem',
      background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '6rem',
      color: 'rgba(255, 255, 255, 0.3)'
    },
    valuesSection: {
      padding: '5rem 0',
      background: 'linear-gradient(135deg, #f9fafb, #e0f2fe)'
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
    valuesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '2rem'
    },
    valueCard: {
      background: 'white',
      borderRadius: '1.5rem',
      padding: '2rem',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f3f4f6',
      textAlign: 'center',
      transition: 'all 0.5s ease'
    },
    valueIcon: {
      width: '4rem',
      height: '4rem',
      borderRadius: '1rem',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.5rem',
      color: 'white',
      marginBottom: '1rem'
    },
    valueTitle: {
      fontSize: '1.25rem',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '1rem'
    },
    valueDescription: {
      color: '#6b7280',
      lineHeight: '1.6'
    },
    timelineSection: {
      padding: '5rem 0',
      background: 'white'
    },
    timeline: {
      position: 'relative',
      maxWidth: '800px',
      margin: '0 auto'
    },
    timelineItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '2rem',
      marginBottom: '3rem',
      position: 'relative'
    },
    timelineIcon: {
      width: '4rem',
      height: '4rem',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.5rem',
      color: 'white',
      flexShrink: 0,
      boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)'
    },
    timelineContent: {
      flex: 1,
      paddingTop: '0.5rem'
    },
    timelineYear: {
      fontSize: '1.5rem',
      fontWeight: '800',
      color: '#8b5cf6',
      marginBottom: '0.5rem'
    },
    timelineTitle: {
      fontSize: '1.25rem',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '0.5rem'
    },
    timelineDescription: {
      color: '#6b7280',
      lineHeight: '1.6'
    },
    teamSection: {
      padding: '5rem 0',
      background: 'linear-gradient(135deg, #f9fafb, #e0f2fe)'
    },
    teamGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '2rem'
    },
    teamCard: {
      background: 'white',
      borderRadius: '1.5rem',
      padding: '2rem',
      textAlign: 'center',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f3f4f6',
      transition: 'all 0.5s ease'
    },
    teamImage: {
      width: '5rem',
      height: '5rem',
      borderRadius: '50%',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2rem',
      color: 'white',
      marginBottom: '1rem'
    },
    teamName: {
      fontSize: '1.25rem',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '0.5rem'
    },
    teamRole: {
      fontSize: '1rem',
      fontWeight: '600',
      color: '#8b5cf6',
      marginBottom: '1rem'
    },
    teamDescription: {
      color: '#6b7280',
      fontSize: '0.875rem',
      lineHeight: '1.6'
    },
    achievementsSection: {
      padding: '5rem 0',
      background: 'white'
    },
    achievementsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '2rem'
    },
    achievementCard: {
      background: 'white',
      borderRadius: '1rem',
      padding: '2rem',
      textAlign: 'center',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f3f4f6',
      transition: 'all 0.3s ease'
    },
    achievementIcon: {
      fontSize: '2.5rem',
      marginBottom: '1rem'
    },
    achievementValue: {
      fontSize: '2.5rem',
      fontWeight: '800',
      marginBottom: '0.5rem'
    },
    achievementLabel: {
      color: '#6b7280',
      fontSize: '0.875rem',
      fontWeight: '500'
    },
    ctaSection: {
      padding: '5rem 0',
      background: 'linear-gradient(135deg, #1e1b4b, #1e3a8a, #8b5cf6)',
      textAlign: 'center'
    },
    ctaContent: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '0 2rem',
      color: 'white'
    },
    ctaTitle: {
      fontSize: '3rem',
      fontWeight: '800',
      marginBottom: '1rem'
    },
    ctaSubtitle: {
      fontSize: '1.25rem',
      color: '#d1d5db',
      marginBottom: '2rem',
      lineHeight: '1.6'
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
    }
  };

  return (
    <div style={styles.container}>
      <Header />

      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroContainer}>
          <h1 style={styles.heroTitle}>
            About <span style={{background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>ShopVibe</span>
          </h1>
          <p style={styles.heroSubtitle}>
            We're revolutionizing online shopping by creating a platform where quality meets convenience, 
            connecting millions of customers with exceptional products and trusted sellers worldwide.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section style={styles.storySection}>
        <div style={styles.sectionContainer}>
          <div style={styles.storyGrid}>
            <div style={styles.storyContent}>
              <h2 style={styles.storyTitle}>
                Our <span style={{background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Story</span>
              </h2>
              <p style={styles.storyText}>
                ShopVibe was born from a simple yet powerful idea: shopping should be effortless, enjoyable, and trustworthy. 
                We noticed that customers were struggling to find quality products from reliable sources in one convenient location.
              </p>
              <p style={styles.storyText}>
                Today, we've built a thriving ecosystem where customers discover amazing products while sellers reach new audiences. 
                Our platform combines cutting-edge technology with human-centered design to create shopping experiences that delight and inspire.
              </p>
              <p style={styles.storyText}>
                Every day, we work tirelessly to make shopping more accessible, secure, and enjoyable for everyone in our community.
              </p>
            </div>
            <div style={styles.storyVisual}>
              🛍️
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section style={styles.valuesSection}>
        <div style={styles.sectionContainer}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Our Values</h2>
            <p style={styles.sectionSubtitle}>
              The principles that guide everything we do and shape our culture
            </p>
          </div>
          
          <div style={styles.valuesGrid}>
            {values.map((value, index) => (
              <div 
                key={index}
                style={styles.valueCard}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-16px)';
                  e.target.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div style={{...styles.valueIcon, background: value.gradient}}>
                  {value.icon}
                </div>
                <h3 style={styles.valueTitle}>{value.title}</h3>
                <p style={styles.valueDescription}>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey Timeline */}
      <section style={styles.timelineSection}>
        <div style={styles.sectionContainer}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Our Journey</h2>
            <p style={styles.sectionSubtitle}>
              Key milestones that have shaped ShopVibe into what it is today
            </p>
          </div>
          
          <div style={styles.timeline}>
            {milestones.map((milestone, index) => (
              <div key={index} style={styles.timelineItem}>
                <div style={styles.timelineIcon}>
                  {milestone.icon}
                </div>
                <div style={styles.timelineContent}>
                  <div style={styles.timelineYear}>{milestone.year}</div>
                  <h3 style={styles.timelineTitle}>{milestone.title}</h3>
                  <p style={styles.timelineDescription}>{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section style={styles.teamSection}>
        <div style={styles.sectionContainer}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Meet Our Team</h2>
            <p style={styles.sectionSubtitle}>
              The passionate individuals driving ShopVibe's mission forward
            </p>
          </div>
          
          <div style={styles.teamGrid}>
            {team.map((member, index) => (
              <div 
                key={index}
                style={styles.teamCard}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-8px)';
                  e.target.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div style={{...styles.teamImage, background: member.gradient}}>
                  {member.image}
                </div>
                <h3 style={styles.teamName}>{member.name}</h3>
                <div style={styles.teamRole}>{member.role}</div>
                <p style={styles.teamDescription}>{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section style={styles.achievementsSection}>
        <div style={styles.sectionContainer}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Our Achievements</h2>
            <p style={styles.sectionSubtitle}>
              Numbers that reflect our commitment to excellence and growth
            </p>
          </div>
          
          <div style={styles.achievementsGrid}>
            {achievements.map((achievement, index) => (
              <div 
                key={index}
                style={styles.achievementCard}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-8px)';
                  e.target.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div style={styles.achievementIcon}>{achievement.icon}</div>
                <div style={{...styles.achievementValue, color: achievement.color}}>
                  {achievement.value}
                </div>
                <div style={styles.achievementLabel}>{achievement.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>
            Join Our <span style={{background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Community</span>
          </h2>
          <p style={styles.ctaSubtitle}>
            Become part of the ShopVibe family and experience the future of online shopping today.
          </p>
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
            Start Shopping Today 🚀
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;