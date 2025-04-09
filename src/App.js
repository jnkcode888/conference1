// src/App.js
import React, { useState, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {
  EventDetails, 
  RegistrationForm, 
  Speakers, 
  Schedule, 
  Testimonials, 
  SocialMedia, 
  ContactAndSignup,
  FAQ 
} from './components/Components';
import AdminPage from './components/AdminPage';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const eventDetailsRef = useRef(null);
  const scheduleRef = useRef(null);
  const speakersRef = useRef(null);
  const registerRef = useRef(null);
  const testimonialsRef = useRef(null);
  const contactRef = useRef(null);
  const faqRef = useRef(null);
  const [showForm, setShowForm] = useState(false);

  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleForm = () => {
    setShowForm((prev) => !prev);
    if (!showForm) {
      setTimeout(() => scrollToSection(registerRef), 100);
    }
  };

  return (
    <Router>
      <Header
        scheduleRef={scheduleRef}
        speakersRef={speakersRef}
        registerRef={registerRef}
        testimonialsRef={testimonialsRef}
        contactRef={contactRef}
        faqRef={faqRef}
        eventDetailsRef={eventDetailsRef}
        isAuthenticated={false}
      />
      <Routes>
        <Route
          path="/"
          element={(
            <>
              <div ref={eventDetailsRef}>
                <EventDetails scrollToRegister={() => scrollToSection(registerRef)} />
              </div>
              <div ref={scheduleRef}><Schedule /></div>
              <div ref={speakersRef}><Speakers /></div>
              <div ref={registerRef}>
                <section className="page-section" id="register-area">
                  <div className="container text-center">
                    <button className="btn btn-primary btn-xl text-uppercase" onClick={toggleForm}>
                      {showForm ? "Hide Registration Form" : "Register Now"}
                    </button>
                  </div>
                </section>
                {showForm && <RegistrationForm />}
              </div>
              <div ref={testimonialsRef}><Testimonials /></div>
              <SocialMedia />
              <div ref={contactRef}><ContactAndSignup /></div>
              <div ref={faqRef}><FAQ /></div>
            </>
          )}
        />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;