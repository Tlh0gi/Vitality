'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { NUTRITION_DATA, getSectionKeys } from '../../utils/nutritionData';
import './health.css';

export default function Health() {
  const [activeSection, setActiveSection] = useState('general');
  const sectionKeys = getSectionKeys();

  // Smooth scroll to section
  const showSection = (sectionKey) => {
    setActiveSection(sectionKey);
    
    // Small delay to ensure section is rendered
    setTimeout(() => {
      const element = document.getElementById(sectionKey + '-section');
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  // Add interactivity effects
  useEffect(() => {
    // Add hover effects to tip cards
    const tipCards = document.querySelectorAll('.tip-card');
    tipCards.forEach(card => {
      const handleMouseEnter = () => {
        card.style.transform = 'translateY(-3px) scale(1.02)';
      };
      
      const handleMouseLeave = () => {
        card.style.transform = 'translateY(0) scale(1)';
      };

      card.addEventListener('mouseenter', handleMouseEnter);
      card.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        card.removeEventListener('mouseenter', handleMouseEnter);
        card.removeEventListener('mouseleave', handleMouseLeave);
      };
    });

    // Add click animation to food items
    const foodItems = document.querySelectorAll('.food-item');
    foodItems.forEach(item => {
      const handleClick = () => {
        item.style.background = '#dcfce7';
        setTimeout(() => {
          item.style.background = '';
        }, 200);
      };

      item.addEventListener('click', handleClick);

      return () => {
        item.removeEventListener('click', handleClick);
      };
    });
  }, [activeSection]);

  return (
    <>
      <Navbar />
      
      <main className="main-content">
        {/* Hero Section */}
        <section className="health-hero">
          <div className="container">
            <h1>🥗 Health & Nutrition</h1>
            <p>Fuel your body with the right nutrition for optimal performance and results</p>
          </div>
        </section>

        <div className="container">
          {/* Quick Facts Section */}
          <section className="quick-facts">
            <h3>💡 Quick Nutrition Facts</h3>
            <div className="facts-grid">
              <div className="fact-item">
                <span className="fact-number">60%</span>
                <span className="fact-label">of your body is water</span>
              </div>
              <div className="fact-item">
                <span className="fact-number">2-3</span>
                <span className="fact-label">liters of water daily</span>
              </div>
              <div className="fact-item">
                <span className="fact-number">30min</span>
                <span className="fact-label">post-workout protein window</span>
              </div>
              <div className="fact-item">
                <span className="fact-number">5-6</span>
                <span className="fact-label">small meals per day</span>
              </div>
            </div>
          </section>

          {/* Navigation */}
          <section className="nutrition-nav">
            <div className="nav-buttons">
              <button
                className={`nav-btn ${activeSection === 'general' ? 'active' : ''}`}
                onClick={() => showSection('general')}
              >
                🏋️ General Fitness
              </button>
              <button
                className={`nav-btn ${activeSection === 'upper_body' ? 'active' : ''}`}
                onClick={() => showSection('upper_body')}
              >
                💪 Upper Body
              </button>
              <button
                className={`nav-btn ${activeSection === 'lower_body' ? 'active' : ''}`}
                onClick={() => showSection('lower_body')}
              >
                🦵 Lower Body
              </button>
              <button
                className={`nav-btn ${activeSection === 'core' ? 'active' : ''}`}
                onClick={() => showSection('core')}
              >
                🔥 Core
              </button>
              <button
                className={`nav-btn ${activeSection === 'cardio' ? 'active' : ''}`}
                onClick={() => showSection('cardio')}
              >
                ❤️ Cardio
              </button>
            </div>
          </section>

          {/* Nutrition Sections */}
          {sectionKeys.map(sectionKey => {
            const section = NUTRITION_DATA[sectionKey];
            
            return (
              <section
                key={sectionKey}
                className={`nutrition-section ${activeSection === sectionKey ? 'active' : ''}`}
                id={`${sectionKey}-section`}
              >
                <div className="section-header">
                  <div className="icon">{section.icon}</div>
                  <h2>{section.title}</h2>
                  <p>{section.description}</p>
                </div>

                <div className="content-grid">
                  {/* Tips Section */}
                  <div className="tips-section">
                    <h3>💡 Nutrition Tips</h3>
                    {section.tips.map((tip, index) => (
                      <div key={index} className="tip-card">
                        <div className="tip-header">
                          <div className="tip-icon">{tip.icon}</div>
                          <div className="tip-title">{tip.title}</div>
                        </div>
                        <div className="tip-content">{tip.content}</div>
                      </div>
                    ))}
                  </div>

                  {/* Foods Section */}
                  <div className="foods-section">
                    <h3>🍽️ Recommended Foods</h3>
                    <ul className="food-list">
                      {section.foods.map((food, index) => (
                        <li key={index} className="food-item">{food}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </main>
    </>
  );
}