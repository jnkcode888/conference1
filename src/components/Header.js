// src/components/Header.js
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaUsers, FaEnvelope, FaSignOutAlt } from 'react-icons/fa';

function Header({ 
  scheduleRef, 
  speakersRef, 
  registerRef, 
  testimonialsRef, 
  contactRef, 
  faqRef, 
  eventDetailsRef, 
  isAuthenticated, 
  onLogout, 
  activeSection, 
  setActiveSection,
  attendeesCount,
  subscribersCount
}) {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false); 
  };

  const handleHomeClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      if (eventDetailsRef && eventDetailsRef.current) {
      scrollToSection(eventDetailsRef);
      } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  const handleAdminMenuSelect = (section) => {
    setActiveSection(section);
    setIsMenuOpen(false);
  };

  const navClass = "navbar navbar-expand-lg navbar-dark fixed-top";

  if (location.pathname === '/admin' && isAuthenticated) {
    return (
      <nav className={navClass} id="mainNav" ref={menuRef}>
        <div className="container">
          <Link className="navbar-brand" to="/">
              <img src="/nonprofit-konnect-logo.png" alt="Nonprofit Konnect" style={{ height: '40px' }} />
          </Link>
          <button 
            className="navbar-toggler" 
            type="button" 
            onClick={toggleMenu}
            aria-controls="navbarResponsive" 
            aria-expanded={isMenuOpen} 
            aria-label="Toggle navigation"
          >
            Menu <i className="fas fa-bars ms-1"></i>
          </button>
          <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarResponsive">
            <ul className="navbar-nav text-uppercase ms-auto py-4 py-lg-0">
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeSection === 'dashboard' ? 'active' : ''}`} 
                  onClick={() => handleAdminMenuSelect('dashboard')}
                  style={{ color: 'white', backgroundColor: 'transparent', border: 'none' }}
                >
                  <FaUsers /> Dashboard
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeSection === 'attendees' ? 'active' : ''}`} 
                  onClick={() => handleAdminMenuSelect('attendees')}
                  style={{ color: 'white', backgroundColor: 'transparent', border: 'none' }}
                >
                  <FaUsers /> Attendees ({attendeesCount})
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeSection === 'subscribers' ? 'active' : ''}`} 
                  onClick={() => handleAdminMenuSelect('subscribers')}
                  style={{ color: 'white', backgroundColor: 'transparent', border: 'none' }}
                >
                  <FaEnvelope /> Subscribers ({subscribersCount})
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className="nav-link" 
                  onClick={onLogout}
                  style={{ color: 'white', backgroundColor: 'transparent', border: 'none' }}
                >
                  <FaSignOutAlt /> Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }

  if (location.pathname === '/admin' && !isAuthenticated) {
    return (
       <nav className={navClass} id="mainNav">
        <div className="container">
           <Link className="navbar-brand" to="/">
              <img src="/assets/img/navbar-logo.svg" alt="Nonprofit Konnect" />
          </Link>
           <div className="collapse navbar-collapse show" id="navbarResponsive">
             <ul className="navbar-nav text-uppercase ms-auto py-4 py-lg-0">
            </ul>
           </div>
         </div>
          </nav>
    );
  }

  return (
    <nav className={navClass} id="mainNav">
      <div className="container">
        <Link className="navbar-brand" onClick={handleHomeClick} to="/"> 
            <img src="/nonprofit-konnect-logo.png" alt="Nonprofit Konnect" style={{ height: '40px' }} />
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={toggleMenu}
          aria-controls="navbarResponsive" 
          aria-expanded={isMenuOpen} 
          aria-label="Toggle navigation"
        >
          Menu <i className="fas fa-bars ms-1"></i>
        </button>
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarResponsive">
          <ul className="navbar-nav text-uppercase ms-auto py-4 py-lg-0">
            <li className="nav-item"><Link className="nav-link" to="/" onClick={handleHomeClick} style={{ color: 'white' }}>Home</Link></li>
            <li className="nav-item"><button className="nav-link" onClick={() => scrollToSection(scheduleRef)} style={{ color: 'white', backgroundColor: 'black', border: 'none', padding: '8px 15px', borderRadius: '4px', transition: 'background-color 0.3s' }} onMouseOver={(e) => e.target.style.backgroundColor = 'yellow'} onMouseOut={(e) => e.target.style.backgroundColor = 'black'}>Schedule</button></li>
            <li className="nav-item"><button className="nav-link" onClick={() => scrollToSection(speakersRef)} style={{ color: 'white', backgroundColor: 'black', border: 'none', padding: '8px 15px', borderRadius: '4px', transition: 'background-color 0.3s' }} onMouseOver={(e) => e.target.style.backgroundColor = 'yellow'} onMouseOut={(e) => e.target.style.backgroundColor = 'black'}>Speakers</button></li>
            <li className="nav-item"><button className="nav-link" onClick={() => scrollToSection(registerRef)} style={{ color: 'white', backgroundColor: 'black', border: 'none', padding: '8px 15px', borderRadius: '4px', transition: 'background-color 0.3s' }} onMouseOver={(e) => e.target.style.backgroundColor = 'yellow'} onMouseOut={(e) => e.target.style.backgroundColor = 'black'}>Register</button></li>
            <li className="nav-item"><button className="nav-link" onClick={() => scrollToSection(testimonialsRef)} style={{ color: 'white', backgroundColor: 'black', border: 'none', padding: '8px 15px', borderRadius: '4px', transition: 'background-color 0.3s' }} onMouseOver={(e) => e.target.style.backgroundColor = 'yellow'} onMouseOut={(e) => e.target.style.backgroundColor = 'black'}>Testimonials</button></li>
            <li className="nav-item"><button className="nav-link" onClick={() => scrollToSection(contactRef)} style={{ color: 'white', backgroundColor: 'black', border: 'none', padding: '8px 15px', borderRadius: '4px', transition: 'background-color 0.3s' }} onMouseOver={(e) => e.target.style.backgroundColor = 'yellow'} onMouseOut={(e) => e.target.style.backgroundColor = 'black'}>Contact</button></li>
            <li className="nav-item"><button className="nav-link" onClick={() => scrollToSection(faqRef)} style={{ color: 'white', backgroundColor: 'black', border: 'none', padding: '8px 15px', borderRadius: '4px', transition: 'background-color 0.3s' }} onMouseOver={(e) => e.target.style.backgroundColor = 'yellow'} onMouseOut={(e) => e.target.style.backgroundColor = 'black'}>FAQ</button></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;