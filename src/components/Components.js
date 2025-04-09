// src/components/Components.js
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';

// EventDetails - Adapt to Masthead structure
export function EventDetails({ scrollToRegister }) {
  return (
    <header className="masthead" style={{ backgroundImage: 'url("/summit3.jpg")' }}>
      <div className="container">
        <div className="masthead-subheading" style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.5)', 
          padding: '10px 20px',
          borderRadius: '5px',
          display: 'inline-block'
        }}>Nonprofit Konnect Summit 2025 | Nairobi, Kenya</div>
        <div className="masthead-heading text-uppercase">Shape the Future of Impact</div>
        <p style={{color: 'white', fontSize: '1.25rem', marginBottom: '2rem'}}>November 10-11 | KICC | Connect with 500+ visionaries</p>
        <button className="btn btn-primary btn-xl text-uppercase" onClick={scrollToRegister}>
          Join the Movement
        </button>
      </div>
    </header>
  );
}

// RegistrationForm - Adapt using Contact section structure
export function RegistrationForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    organization: '',
    position: '',
    attendanceType: '',
    interestedSessions: [],
    certificateRequired: false,
    registrationType: '',
    paymentMethod: '',
    invoiceRequested: false,
    invoiceDetails: '',
    hotelRecommendations: null,
    airportTransfer: null,
  });
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSessionsChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const sessions = checked
        ? [...prev.interestedSessions, value]
        : prev.interestedSessions.filter((session) => session !== value);
      return { ...prev, interestedSessions: sessions };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.interestedSessions.length === 0) {
      setMessage('Please select at least one session.');
      return;
    }
    if (formData.hotelRecommendations === null || formData.airportTransfer === null) {
      setMessage('Please answer all Yes/No questions.');
      return;
    }
    try {
      // First check if email already exists
      const { data: existingUser } = await supabase
        .from('attendees')
        .select('email')
        .eq('email', formData.email)
        .single();

      if (existingUser) {
        setMessage('This email is already registered for the summit.');
        return;
      }

      const { data, error } = await supabase
        .from('attendees')
        .insert([{
          full_name: formData.fullName,
          email: formData.email,
          phone_number: formData.phoneNumber,
          organization: formData.organization || null,
          position: formData.position || null,
          attendance_type: formData.attendanceType,
          interested_sessions: formData.interestedSessions.join(', '),
          certificate_required: formData.certificateRequired,
          registration_type: formData.registrationType,
          payment_method: formData.paymentMethod,
          invoice_requested: formData.invoiceRequested,
          invoice_details: formData.invoiceRequested ? formData.invoiceDetails : null,
          hotel_recommendations: formData.hotelRecommendations,
          airport_transfer: formData.airportTransfer,
        }])
        .select();

      if (error) {
        console.error('Registration Error:', error);
        if (error.code === '23505') {
          setMessage('This email address is already registered. Please use a different email.');
        } else if (error.code === '23503') {
          setMessage('Invalid selection for one or more fields. Please check your inputs.');
        } else {
          setMessage(`Registration failed: ${error.message}`);
        }
        return;
      }

        console.log('Registration Success:', data);
        setShowPopup(true);
        setFormData({
          fullName: '',
          email: '',
          phoneNumber: '',
          organization: '',
          position: '',
          attendanceType: '',
          interestedSessions: [],
          certificateRequired: false,
          registrationType: '',
          paymentMethod: '',
          invoiceRequested: false,
          invoiceDetails: '',
          hotelRecommendations: null,
          airportTransfer: null,
        });
        setMessage('');
        setTimeout(() => setShowPopup(false), 3000);
    } catch (err) {
      console.error('Unexpected Error:', err);
      setMessage('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    // Use template's section structure for Contact form
    <section className="page-section" id="registration"> {/* Changed ID slightly */}
      <div className="container">
        <div className="text-center">
          <h2 className="section-heading text-uppercase">Secure Your Spot</h2>
          <h3 className="section-subheading text-muted">Register now to join the summit.</h3>
        </div>
        {/* Template form structure with our fields */}
        <form id="registrationForm" onSubmit={handleSubmit}>
          <div className="row align-items-stretch mb-5">
            {/* Use grid layout like template */}
            <div className="col-md-6">
              {/* Full Name */}
              <div className="form-group">
        <input
                  className="form-control" 
                  id="fullName" 
          type="text"
          name="fullName"
                  placeholder="Full Name *"
          value={formData.fullName}
          onChange={handleChange}
          required
                  data-sb-validations="required"
        />
                <div className="invalid-feedback" data-sb-feedback="fullName:required">Full name is required.</div>
              </div>
              {/* Email */}
              <div className="form-group">
        <input
                  className="form-control" 
                  id="email" 
          type="email"
          name="email"
                  placeholder="Email Address *"
          value={formData.email}
          onChange={handleChange}
          required
                  data-sb-validations="required,email"
        />
                <div className="invalid-feedback" data-sb-feedback="email:required">An email is required.</div>
                <div className="invalid-feedback" data-sb-feedback="email:email">Email is not valid.</div>
              </div>
              {/* Phone Number */}
              <div className="form-group mb-md-0">
        <input
                  className="form-control" 
                  id="phoneNumber" 
          type="tel"
          name="phoneNumber"
                  placeholder="Phone Number *"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
                  data-sb-validations="required"
        />
                <div className="invalid-feedback" data-sb-feedback="phoneNumber:required">A phone number is required.</div>
              </div>
              {/* Organization */}
              <div className="form-group">
        <input
                      className="form-control" 
                      id="organization"
          type="text"
          name="organization"
          placeholder="Organization/Company"
          value={formData.organization}
          onChange={handleChange}
        />
              </div>
               {/* Position */}
              <div className="form-group mb-md-0">
        <input
                      className="form-control" 
                      id="position"
          type="text"
          name="position"
          placeholder="Job Title/Position"
          value={formData.position}
          onChange={handleChange}
        />
              </div>
            </div>
            <div className="col-md-6">
                {/* Attendance Type */} 
                <div className="form-group form-group-radios mb-md-0">
                    <label className="form-label d-block">Attendance Type *</label>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="attendanceType" id="attendanceInPerson" value="In-Person" checked={formData.attendanceType === 'In-Person'} onChange={handleChange} required />
                        <label className="form-check-label" htmlFor="attendanceInPerson">In-Person</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="attendanceType" id="attendanceVirtual" value="Virtual" checked={formData.attendanceType === 'Virtual'} onChange={handleChange} />
                        <label className="form-check-label" htmlFor="attendanceVirtual">Virtual</label>
                    </div>
                    <div className="invalid-feedback">Please select attendance type.</div>
        </div>

                {/* Interested Sessions */} 
                <div className="form-group form-group-checkboxes mb-md-0">
                    <label className="form-label d-block">Interested Sessions * (select at least one)</label>
          {[
            'Keynote: The Next Decade of Impact',
            'Workshop: Fundraising Unleashed',
            'Panel: Tech for Change',
            'Session: Impact That Sticks',
          ].map((session) => (
                      <div className="form-check" key={session}>
              <input
                          className="form-check-input" 
                type="checkbox"
                name="interestedSessions"
                          id={`session-${session.replace(/\s+/g, '-')}`}
                value={session}
                checked={formData.interestedSessions.includes(session)}
                onChange={handleSessionsChange}
              />
                        <label className="form-check-label" htmlFor={`session-${session.replace(/\s+/g, '-')}`}>{session}</label>
                      </div>
          ))}
                    {/* Add validation message if needed */}
        </div>

                {/* Certificate Required */} 
                 <div className="form-group form-check mb-md-0">
          <input
                         className="form-check-input" 
            type="checkbox"
            name="certificateRequired"
                         id="certificateRequired" 
            checked={formData.certificateRequired}
            onChange={handleChange}
          />
                     <label className="form-check-label" htmlFor="certificateRequired">Require Certificate of Participation?</label>
                 </div>

                 {/* Registration Type */} 
                 <div className="form-group form-group-select mb-md-0">
                     <label htmlFor="registrationType" className="form-label">Registration Type *</label>
          <select
                         className="form-select" 
                         id="registrationType"
            name="registrationType"
            value={formData.registrationType}
            onChange={handleChange}
            required
                         data-sb-validations="required"
          >
                         <option value="">Select Type...</option>
            <option value="General">General</option>
            <option value="Student">Student</option>
            <option value="VIP">VIP</option>
            <option value="Speaker">Speaker</option>
          </select>
                     <div className="invalid-feedback" data-sb-feedback="registrationType:required">Registration type is required.</div>
        </div>

                {/* Payment Method */} 
                 <div className="form-group form-group-select mb-md-0">
                     <label htmlFor="paymentMethod" className="form-label">Payment Method *</label>
          <select
                         className="form-select" 
                         id="paymentMethod"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            required
                         data-sb-validations="required"
          >
                         <option value="">Select Method...</option>
            <option value="Mpesa">Mpesa</option>
            <option value="Credit/Debit Card">Credit/Debit Card</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
                      <div className="invalid-feedback" data-sb-feedback="paymentMethod:required">Payment method is required.</div>
        </div>

            </div>
             {/* Row for Yes/No questions, spanning columns */}
            <div className="col-12">
                {/* Invoice Request */} 
                <div className="form-group form-group-radios mb-3">
                    <label className="form-label d-block">Invoice Request?</label>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="invoiceRequested" id="invoiceYes" value="true" checked={formData.invoiceRequested === true} onChange={() => setFormData((prev) => ({ ...prev, invoiceRequested: true }))} />
                        <label className="form-check-label" htmlFor="invoiceYes">Yes</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="invoiceRequested" id="invoiceNo" value="false" checked={formData.invoiceRequested === false} onChange={() => setFormData((prev) => ({ ...prev, invoiceRequested: false, invoiceDetails: '' }))} />
                        <label className="form-check-label" htmlFor="invoiceNo">No</label>
                    </div>
          {formData.invoiceRequested && (
                        <div className="form-group mt-2">
            <input
                                className="form-control"
              type="text"
              name="invoiceDetails"
                                placeholder="Invoice Details (e.g., Company Name, Address) *"
              value={formData.invoiceDetails}
              onChange={handleChange}
              required={formData.invoiceRequested}
                                data-sb-validations="required"
            />
                            <div className="invalid-feedback" data-sb-feedback="invoiceDetails:required">Invoice details are required if requesting an invoice.</div>
                        </div>
          )}
        </div>

                 {/* Hotel Recommendations */} 
                <div className="form-group form-group-radios mb-3">
                    <label className="form-label d-block">Need hotel recommendations? *</label>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="hotelRecommendations" id="hotelYes" value="true" checked={formData.hotelRecommendations === true} onChange={() => setFormData((prev) => ({ ...prev, hotelRecommendations: true }))} required />
                        <label className="form-check-label" htmlFor="hotelYes">Yes</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="hotelRecommendations" id="hotelNo" value="false" checked={formData.hotelRecommendations === false} onChange={() => setFormData((prev) => ({ ...prev, hotelRecommendations: false }))} />
                        <label className="form-check-label" htmlFor="hotelNo">No</label>
                    </div>
                    <div className="invalid-feedback">Please answer this question.</div>
                </div>

                {/* Airport Transfer */} 
                <div className="form-group form-group-radios mb-5">
                    <label className="form-label d-block">Require airport transfer? *</label>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="airportTransfer" id="transferYes" value="true" checked={formData.airportTransfer === true} onChange={() => setFormData((prev) => ({ ...prev, airportTransfer: true }))} required />
                        <label className="form-check-label" htmlFor="transferYes">Yes</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="airportTransfer" id="transferNo" value="false" checked={formData.airportTransfer === false} onChange={() => setFormData((prev) => ({ ...prev, airportTransfer: false }))} />
                        <label className="form-check-label" htmlFor="transferNo">No</label>
                    </div>
                     <div className="invalid-feedback">Please answer this question.</div>
                </div>
        </div>

        </div>

          {/* Submit success/error messages (optional based on template) */}
          {message && <div className="text-center text-danger mb-3">{message}</div>} 
          
          {/* Submit Button */}
          <div className="text-center">
            <button 
              className="btn btn-primary btn-xl text-uppercase" 
              id="submitButton" 
              type="submit"
            >
              Register Now
            </button>
          </div>
      </form>
      </div>
      {/* Success Popup (keep existing logic) */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <p>You're registered! See you in Nairobi.</p>
          </div>
        </div>
      )}
    </section>
  );
}

// Speakers - Adapt using Team section structure
export function Speakers() {
  return (
    // Use template's Team section structure
    <section className="page-section bg-light" id="speakers"> {/* Use bg-light like template team */}
      <div className="container">
        <div className="text-center">
          <h2 className="section-heading text-uppercase">Meet the Change Makers</h2>
          <h3 className="section-subheading text-muted">Our featured speakers for the summit.</h3>
        </div>
        <div className="row">
          {/* Map speaker data to template's team member structure */}
          {/* Example for 2 speakers, loop if data comes from props/state */}
          <div className="col-lg-6"> {/* Adjust grid column size as needed */} 
            <div className="team-member">
              <img className="mx-auto rounded-circle" src="/speaker1.jpg" alt="Dr. Amina Otieno" />
              <h4>Dr. Amina Otieno</h4>
              <p className="text-muted">Innovator | Keynote Speaker</p>
              {/* Add social links if available/needed */}
              {/* <a className="btn btn-dark btn-social mx-2" href="#!" aria-label="..."><i className="fab fa-twitter"></i></a> */}
            </div>
          </div>
          <div className="col-lg-6">
            <div className="team-member">
              <img className="mx-auto rounded-circle" src="/speaker2.jpg" alt="Shanice Singirankabo" />
              <h4>Shanice Singirankabo</h4>
              <p className="text-muted">Speaker</p>
            </div>
          </div>
        </div>
        {/* Optional: Add a concluding row/text like the template */}
        {/* <div className="row">
          <div className="col-lg-8 mx-auto text-center"><p className="large text-muted">...
        </div> */} 
      </div>
    </section>
  );
}

// Schedule - Adapt using About (Timeline) section structure
export function Schedule() {
  const scheduleData = [
    {
      time: 'Day 1 - Nov 10',
      heading: '9:00 AM',
      subheading: 'Keynote: The Next Decade of Impact',
      body: 'Opening remarks and vision setting by Dr. Amina Otieno.',
      // Optional: Add an image if relevant
      // img: 'assets/img/about/1.jpg' 
      img: '/summit1.jpg' // Using existing summit image
    },
    {
      time: 'Day 1 - Nov 10',
      heading: '11:00 AM',
      subheading: 'Workshop: Fundraising Unleashed',
      body: 'Interactive session on innovative fundraising strategies.',
      img: '/summit2.jpg',
      inverted: true // To alternate sides like the template
    },
    {
      time: 'Day 1 - Nov 10',
      heading: '2:00 PM',
      subheading: 'Panel: Tech for Change',
      body: 'Discussion on leveraging technology for greater nonprofit impact.',
      img: '/summit3.jpg'
    },
    {
      time: 'Day 2 - Nov 11',
      heading: '10:00 AM',
      subheading: 'Session: Impact That Sticks',
      body: 'Strategies for sustainable and measurable program outcomes.',
      img: '/summit-hero.jpg', // Reusing another image
      inverted: true
    },
    {
      time: 'Day 2 - Nov 11',
      heading: '1:00 PM',
      subheading: 'Networking Lunch',
      body: 'Connect with fellow attendees and speakers.',
      img: '/nonprofit-konnect-logo.png' // Using logo
    },
    {
      time: 'Day 2 - Nov 11',
      heading: '3:00 PM',
      subheading: 'Closing: Vision Forward',
      body: 'Summary of key takeaways and future outlook.',
      img: '/logo.png', // Using logo
      inverted: true
    }
  ];

  return (
    // Use template's About section structure (timeline)
    <section className="page-section" id="schedule"> {/* Changed ID */}
      <div className="container">
        <div className="text-center">
          <h2 className="section-heading text-uppercase">Your Summit Journey</h2>
          <h3 className="section-subheading text-muted">Follow the schedule for an impactful experience.</h3>
        </div>
        <ul className="timeline">
          {scheduleData.map((item, index) => (
            <li key={index} className={item.inverted ? 'timeline-inverted' : ''}>
              <div className="timeline-image">
                {item.img ? (
                   <img className="rounded-circle img-fluid" src={item.img} alt="..." />
                 ) : (
                   /* Placeholder if no image */
                   <h4>{item.time.split(' ')[0]}<br/>{item.time.split(' ')[2]}</h4> 
                 ) 
                }
              </div>
              <div className="timeline-panel">
                <div className="timeline-heading">
                  <h4>{item.time}</h4>
                  <h4 className="subheading">{item.heading} - {item.subheading}</h4>
                </div>
                <div className="timeline-body"><p className="text-muted">{item.body}</p></div>
              </div>
            </li>
          ))}
          {/* Optional: Add the final 'Be Part' circle from template */}
           <li className="timeline-inverted">
             <div className="timeline-image">
               <h4>
                 Join
                 <br />
                 The
                 <br />
                 Event!
               </h4>
        </div>
           </li>
        </ul>
      </div>
    </section>
  );
}

// Testimonials - Adapt using a generic page-section structure
export function Testimonials() {
  return (
    // Use a generic section structure, similar to Services but simpler content
    <section className="page-section" id="testimonials">
      <div className="container">
        <div className="text-center">
          <h2 className="section-heading text-uppercase">Why They Love It</h2>
          <h3 className="section-subheading text-muted">Hear from past attendees.</h3>
        </div>
        <div className="row text-center"> {/* Center the testimonials */} 
          {/* Use columns for layout */}
          <div className="col-md-6"> 
            <blockquote className="blockquote">
              <p className="mb-0">"This summit rewrote our playbook!"</p>
              <footer className="blockquote-footer">Jane Doe</footer>
            </blockquote>
          </div>
          <div className="col-md-6">
            <blockquote className="blockquote">
              <p className="mb-0">"Pure inspiration in action."</p>
              <footer className="blockquote-footer">John Smith</footer>
            </blockquote>
          </div>
        </div>
         <div className="row">
            <div className="col-lg-8 mx-auto text-center">
                <p className="large text-muted impact-stat" style={{marginTop: '3rem'}}>{/* Added margin */}
                   300+ partnerships born last year.
                </p>
            </div>
        </div>
      </div>
    </section>
  );
}

// SocialMedia - Adapt using a generic page-section structure
export function SocialMedia() {
  const shareUrl = 'https://nonprofitkonnectsummit.org'; // Replace with actual URL if different
  const title = 'Join me at Nonprofit Konnect Summit 2025!';

  return (
    <section className="page-section bg-light" id="social-share"> {/* Added bg-light for visual separation */}
      <div className="container">
          <div className="text-center">
              <h2 className="section-heading text-uppercase">Share the Buzz</h2>
              <h3 className="section-subheading text-muted">Let your network know about the summit.</h3>
              <div className="social-links mt-4">
                {/* Using template's social button style */}
                <a className="btn btn-dark btn-social mx-2" href={`https://facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">
                    <i className="fab fa-facebook-f"></i>
                </a>
                <a className="btn btn-dark btn-social mx-2" href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${title}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter">
                    <i className="fab fa-twitter"></i>
                </a>
                <a className="btn btn-dark btn-social mx-2" href={`https://linkedin.com/sharing/share-offsite/?url=${shareUrl}`} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">
                    <i className="fab fa-linkedin-in"></i>
                </a>
            </div>
        </div>
      </div>
    </section>
  );
}

// New Combined Contact & Signup Section
export function ContactAndSignup() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous message
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }])
        .select();

      if (error) {
        if (error.code === '23505') {
          setMessage('This email is already subscribed!');
        } else {
          console.error('Supabase Subscription Error:', error.message, error.details, error.hint);
          setMessage(`Subscription failed: ${error.message}`);
        }
      } else {
        console.log('Subscription Success:', data);
        setShowPopup(true);
        setEmail('');
        setTimeout(() => setShowPopup(false), 3000);
      }
    } catch (err) {
      console.error('Unexpected Error:', err);
      setMessage('Oops! Something went wrong. Please try again.');
    }
  };

  return (
    <section className="page-section" id="contact"> 
      <div className="container">
        <div className="text-center">
          <h2 className="section-heading text-uppercase">Contact Us & Stay Updated</h2>
          <h3 className="section-subheading text-muted">Get in touch or sign up for news.</h3>
        </div>
        
        <div className="row align-items-start">
          <div className="col-md-6">
            <h4 className="text-uppercase mb-4">Contact Details</h4>
            <p className="text-muted"><strong>Email:</strong> info@nonprofitkonnect.org</p>
            <p className="text-muted"><strong>Phone:</strong> +254 115265874</p>
            <p className="text-muted"><strong>Venue:</strong> KICC, Nairobi, Kenya</p>
          </div>

          <div className="col-md-6">
            <h4 className="text-uppercase mb-4">Newsletter Signup</h4>
            <form id="signupForm" onSubmit={handleSignupSubmit}>
              <div className="form-group">
                <input 
                  className="form-control" 
                  id="emailSignup" 
                  type="email" 
                  placeholder="Your Email *" 
                  required 
                  data-sb-validations="required,email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="invalid-feedback" data-sb-feedback="emailSignup:required">An email is required.</div>
                <div className="invalid-feedback" data-sb-feedback="emailSignup:email">Email is not valid.</div>
              </div>
              {message && <div className="text-center text-danger my-3">{message}</div>}
              
              <div className="text-center">
                <button 
                  className="btn btn-primary btn-xl text-uppercase mt-3" 
                  id="submitSignupButton" 
                  type="submit"
                >
                  Subscribe
                </button>
              </div>
      </form>
          </div>
        </div>
      </div>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <p>You're in the loop!</p>
          </div>
        </div>
      )}
    </section>
  );
}

// FAQ - Adapt using a generic page-section structure 
export function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    { q: "What's Nonprofit Konnect?", a: "Nonprofit Konnect is a platform dedicated to connecting and empowering nonprofit organizations. Click the button below to learn more." },
    { q: "How do I register?", a: "Scroll up to the 'Secure Your Spot' section and fill out the form—it takes less than a minute!" }, // Updated answer
    { q: "When's the deadline?", a: "October 31, 2025, or when we're full—secure your spot soon!" },
    { q: "Is there student pricing?", a: "Yes! Select the 'Student' option in the registration form." },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    // Use a generic section structure, maybe with bg-light
    <section className="page-section bg-light" id="faq">
      <div className="container">
        <div className="text-center">
          <h2 className="section-heading text-uppercase">Got Questions?</h2>
          <h3 className="section-subheading text-muted">Frequently Asked Questions</h3>
        </div>
        {/* Using Bootstrap Accordion for FAQ styling */}
        <div className="accordion" id="faqAccordion">
        {faqs.map((faq, index) => (
            <div className="accordion-item" key={index}>
              <h2 className="accordion-header" id={`heading${index}`}>
                <button 
                  className={`accordion-button ${openIndex !== index ? 'collapsed' : ''}`}
                  type="button" 
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={openIndex === index}
                  aria-controls={`collapse${index}`}
                >
              {faq.q}
            </button>
              </h2>
              <div 
                id={`collapse${index}`}
                className={`accordion-collapse collapse ${openIndex === index ? 'show' : ''}`}
                aria-labelledby={`heading${index}`}
                data-bs-parent="#faqAccordion"
              >
                <div className="accordion-body">
                  {faq.a}
                  {/* Special case for the first FAQ with button */}
              {index === 0 && (
                    <div className="mt-3">
                      <a href="https://nonprofitkonnect.org" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                        Learn More
                </a>
                    </div>
              )}
                </div>
            </div>
          </div>
        ))}
        </div>
      </div>
    </section>
  );
}