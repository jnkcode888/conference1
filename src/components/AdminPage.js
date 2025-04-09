// src/components/AdminPage.js
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { FaSearch, FaFileExport, FaUsers, FaEnvelope } from 'react-icons/fa';
import Header from './Header';

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [attendees, setAttendees] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState('dashboard');

  // Filter states
  const [attendanceFilter, setAttendanceFilter] = useState('');
  const [sessionFilter, setSessionFilter] = useState('');
  const [certificateFilter, setCertificateFilter] = useState('');
  const [registrationFilter, setRegistrationFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [invoiceFilter, setInvoiceFilter] = useState('');
  const [hotelFilter, setHotelFilter] = useState('');
  const [transferFilter, setTransferFilter] = useState('');

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin2025') {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
      setError('');
      fetchData();
    } else {
      setError('Incorrect password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    setAttendees([]);
    setSubscribers([]);
    setPassword('');
    setSearchTerm('');
    setActiveSection('dashboard');
    setAttendanceFilter('');
    setSessionFilter('');
    setCertificateFilter('');
    setRegistrationFilter('');
    setPaymentFilter('');
    setInvoiceFilter('');
    setHotelFilter('');
    setTransferFilter('');
  };

  const fetchData = async () => {
    const { data: attendeesData, error: attendeesError } = await supabase
      .from('attendees')
      .select('*');
    if (attendeesError) {
      console.error('Error fetching attendees:', attendeesError);
      setError('Failed to fetch attendees');
    } else {
      setAttendees(attendeesData);
    }

    const { data: subscribersData, error: subscribersError } = await supabase
      .from('newsletter_subscribers')
      .select('*');
    if (subscribersError) {
      console.error('Error fetching subscribers:', subscribersError);
      setError('Failed to fetch subscribers');
    } else {
      setSubscribers(subscribersData);
    }
  };

  const exportToCSV = (data, filename) => {
    const headers = Object.keys(data[0] || {}).join(',');
    const csv = [
      headers,
      ...data.map(item =>
        Object.values(item).map(value => {
          const stringValue = String(value === null || value === undefined ? '' : value);
          // Escape commas and quotes
          const escapedValue = stringValue.includes(',') || stringValue.includes('"') 
            ? `"${stringValue.replace(/"/g, '""')}"` 
            : stringValue;
          return escapedValue;
        }).join(',')
      ),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredAttendees = attendees.filter(attendee => {
    const matchesSearch = (
      (attendee.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (attendee.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (attendee.phone_number?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (attendee.organization?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (attendee.position?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const matchesAttendance = !attendanceFilter || attendee.attendance_type === attendanceFilter;
    const matchesSession = !sessionFilter || (attendee.interested_sessions || '').includes(sessionFilter);
    const matchesCertificate = !certificateFilter || (certificateFilter === 'Yes' ? attendee.certificate_required : !attendee.certificate_required);
    const matchesRegistration = !registrationFilter || attendee.registration_type === registrationFilter;
    const matchesPayment = !paymentFilter || attendee.payment_method === paymentFilter;
    const matchesInvoice = !invoiceFilter || (invoiceFilter === 'Yes' ? attendee.invoice_requested : !attendee.invoice_requested);
    const matchesHotel = !hotelFilter || (hotelFilter === 'Yes' ? attendee.hotel_recommendations : !attendee.hotel_recommendations);
    const matchesTransfer = !transferFilter || (transferFilter === 'Yes' ? attendee.airport_transfer : !attendee.airport_transfer);

    return (
      matchesSearch &&
      matchesAttendance &&
      matchesSession &&
      matchesCertificate &&
      matchesRegistration &&
      matchesPayment &&
      matchesInvoice &&
      matchesHotel &&
      matchesTransfer
    );
  });

  const filteredSubscribers = subscribers.filter(subscriber =>
    (subscriber.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const attendanceStats = {
    inPerson: attendees.filter(a => a.attendance_type === 'In-Person').length,
    virtual: attendees.filter(a => a.attendance_type === 'Virtual').length,
  };

  const sessionStats = {
    keynote: attendees.filter(a => a.interested_sessions?.includes('Keynote: The Next Decade of Impact')).length,
    workshop: attendees.filter(a => a.interested_sessions?.includes('Workshop: Fundraising Unleashed')).length,
    panel: attendees.filter(a => a.interested_sessions?.includes('Panel: Tech for Change')).length,
    impact: attendees.filter(a => a.interested_sessions?.includes('Session: Impact That Sticks')).length,
  };

  const certificateStats = {
    yes: attendees.filter(a => a.certificate_required).length,
    no: attendees.filter(a => !a.certificate_required).length,
  };

  const registrationStats = {
    general: attendees.filter(a => a.registration_type === 'General').length,
    student: attendees.filter(a => a.registration_type === 'Student').length,
    vip: attendees.filter(a => a.registration_type === 'VIP').length,
    speaker: attendees.filter(a => a.registration_type === 'Speaker').length,
  };

  const paymentStats = {
    mpesa: attendees.filter(a => a.payment_method === 'Mpesa').length,
    card: attendees.filter(a => a.payment_method === 'Credit/Debit Card').length,
    bank: attendees.filter(a => a.payment_method === 'Bank Transfer').length,
  };

  const invoiceStats = {
    yes: attendees.filter(a => a.invoice_requested).length,
    no: attendees.filter(a => !a.invoice_requested).length,
  };

  const hotelStats = {
    yes: attendees.filter(a => a.hotel_recommendations).length,
    no: attendees.filter(a => !a.hotel_recommendations).length,
  };

  const transferStats = {
    yes: attendees.filter(a => a.airport_transfer).length,
    no: attendees.filter(a => !a.airport_transfer).length,
  };

  if (!isAuthenticated) {
    return (
      <div style={{ paddingTop: '10rem' }}>
        <Header isAuthenticated={false} />
        <section className="page-section" id="admin-login">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6">
                <div className="text-center mb-4">
                  <h2 className="section-heading text-uppercase">Admin Login</h2>
                  <p className="text-muted">Enter password to access dashboard.</p>
                </div>
                <form onSubmit={handleLogin} className="needs-validation" noValidate>
                  <div className="form-floating mb-3">
              <input
                type="password"
                      className="form-control"
                      id="adminPassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                required
                    />
                    <label htmlFor="adminPassword">Password</label>
                  </div>
                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary btn-lg">Login</button>
                  </div>
            </form>
                {error && <p className="text-danger text-center mt-3">{error}</p>}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '5rem' }}>
      <Header 
        isAuthenticated={isAuthenticated} 
        onLogout={handleLogout} 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        attendeesCount={attendees.length}
        subscribersCount={subscribers.length}
      />
      <main className="container mt-4">
        {activeSection === 'dashboard' && (
          <div className="dashboard-overview mb-5">
            <h2 className="text-center mb-4">Admin Dashboard Overview</h2>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              <div className="col">
                <div className="card h-100 text-center shadow-sm">
                  <div className="card-body">
                    <FaUsers className="display-4 text-primary mb-2" />
                    <h5 className="card-title">Total Attendees</h5>
                    <p className="card-text fs-4 fw-bold">{attendees.length}</p>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="card h-100 text-center shadow-sm">
                  <div className="card-body">
                    <FaEnvelope className="display-4 text-primary mb-2" />
                    <h5 className="card-title">Total Subscribers</h5>
                    <p className="card-text fs-4 fw-bold">{subscribers.length}</p>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="card h-100 text-center shadow-sm">
                  <div className="card-body">
                    <FaUsers className="display-4 text-info mb-2" />
                    <h5 className="card-title">Attendance Type</h5>
                    <p className="card-text mb-0">In-Person: {attendanceStats.inPerson}</p>
                    <p className="card-text">Virtual: {attendanceStats.virtual}</p>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="card h-100 text-center shadow-sm">
                  <div className="card-body">
                    <i className="fas fa-calendar-check display-4 text-success mb-2"></i>
                    <h5 className="card-title">Interested Sessions</h5>
                    <p className="card-text mb-0">Keynote: {sessionStats.keynote}</p>
                    <p className="card-text mb-0">Workshop: {sessionStats.workshop}</p>
                    <p className="card-text mb-0">Panel: {sessionStats.panel}</p>
                    <p className="card-text">Impact: {sessionStats.impact}</p>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="card h-100 text-center shadow-sm">
                  <div className="card-body">
                    <i className="fas fa-certificate display-4 text-warning mb-2"></i>
                    <h5 className="card-title">Certificate Required</h5>
                    <p className="card-text mb-0">Yes: {certificateStats.yes}</p>
                    <p className="card-text">No: {certificateStats.no}</p>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="card h-100 text-center shadow-sm">
                  <div className="card-body">
                    <i className="fas fa-id-card display-4 text-secondary mb-2"></i>
                    <h5 className="card-title">Registration Type</h5>
                    <p className="card-text mb-0">General: {registrationStats.general}</p>
                    <p className="card-text mb-0">Student: {registrationStats.student}</p>
                    <p className="card-text mb-0">VIP: {registrationStats.vip}</p>
                    <p className="card-text">Speaker: {registrationStats.speaker}</p>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="card h-100 text-center shadow-sm">
                  <div className="card-body">
                    <i className="fas fa-credit-card display-4 text-danger mb-2"></i>
                    <h5 className="card-title">Payment Method</h5>
                    <p className="card-text mb-0">Mpesa: {paymentStats.mpesa}</p>
                    <p className="card-text mb-0">Card: {paymentStats.card}</p>
                    <p className="card-text">Bank: {paymentStats.bank}</p>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="card h-100 text-center shadow-sm">
                  <div className="card-body">
                    <i className="fas fa-file-invoice display-4 text-info mb-2"></i>
                    <h5 className="card-title">Invoice Request</h5>
                    <p className="card-text mb-0">Yes: {invoiceStats.yes}</p>
                    <p className="card-text">No: {invoiceStats.no}</p>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="card h-100 text-center shadow-sm">
                  <div className="card-body">
                    <i className="fas fa-hotel display-4 text-success mb-2"></i>
                    <h5 className="card-title">Hotel Recommendations</h5>
                    <p className="card-text mb-0">Yes: {hotelStats.yes}</p>
                    <p className="card-text">No: {hotelStats.no}</p>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="card h-100 text-center shadow-sm">
                  <div className="card-body">
                    <i className="fas fa-plane-departure display-4 text-warning mb-2"></i>
                    <h5 className="card-title">Airport Transfer</h5>
                    <p className="card-text mb-0">Yes: {transferStats.yes}</p>
                    <p className="card-text">No: {transferStats.no}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {(activeSection === 'attendees' || activeSection === 'subscribers') && (
          <div className="input-group mb-4 shadow-sm">
            <span className="input-group-text" id="search-addon"><FaSearch /></span>
            <input
              type="text"
              className="form-control form-control-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search ${activeSection}... (Name, Email, Phone, etc.)`}
              aria-label="Search"
              aria-describedby="search-addon"
            />
          </div>
        )}

        {activeSection === 'attendees' && (
          <div className="data-section card shadow mb-5">
            <div className="card-header py-3 d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Attendees ({filteredAttendees.length})</h4>
              {filteredAttendees.length > 0 && (
                <button
                  onClick={() => exportToCSV(filteredAttendees, 'attendees.csv')}
                  className="btn btn-sm btn-primary"
                >
                  <FaFileExport className="me-1"/> Export CSV
                </button>
              )}
            </div>
            <div className="card-body">
              <div className="filter-controls mb-4 p-3 border rounded bg-light">
                <h5 className="mb-3">Filters</h5>
                <div className="row g-3">
                  <div className="col-md-4 col-lg-3">
                    <label htmlFor="attendanceFilter" className="form-label">Attendance Type:</label>
                    <select id="attendanceFilter" className="form-select form-select-sm" value={attendanceFilter} onChange={(e) => setAttendanceFilter(e.target.value)}>
                  <option value="">All</option>
                  <option value="In-Person">In-Person</option>
                  <option value="Virtual">Virtual</option>
                </select>
              </div>
                  <div className="col-md-4 col-lg-3">
                    <label htmlFor="sessionFilter" className="form-label">Interested Session:</label>
                    <select id="sessionFilter" className="form-select form-select-sm" value={sessionFilter} onChange={(e) => setSessionFilter(e.target.value)}>
                  <option value="">All</option>
                  <option value="Keynote: The Next Decade of Impact">Keynote</option>
                  <option value="Workshop: Fundraising Unleashed">Workshop</option>
                  <option value="Panel: Tech for Change">Panel</option>
                  <option value="Session: Impact That Sticks">Impact</option>
                </select>
              </div>
                  <div className="col-md-4 col-lg-3">
                    <label htmlFor="certificateFilter" className="form-label">Certificate:</label>
                    <select id="certificateFilter" className="form-select form-select-sm" value={certificateFilter} onChange={(e) => setCertificateFilter(e.target.value)}>
                  <option value="">All</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
                  <div className="col-md-4 col-lg-3">
                    <label htmlFor="registrationFilter" className="form-label">Reg Type:</label>
                    <select id="registrationFilter" className="form-select form-select-sm" value={registrationFilter} onChange={(e) => setRegistrationFilter(e.target.value)}>
                  <option value="">All</option>
                  <option value="General">General</option>
                  <option value="Student">Student</option>
                  <option value="VIP">VIP</option>
                  <option value="Speaker">Speaker</option>
                </select>
              </div>
              </div>
            </div>
            {filteredAttendees.length > 0 ? (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                  {filteredAttendees.map((attendee) => (
                    <div key={attendee.id} className="col">
                      <div className="card h-100 shadow-sm attendee-card">
                        <div className="card-header bg-primary text-white">
                          <h5 className="card-title mb-0">{attendee.full_name}</h5>
                        </div>
                        <div className="card-body">
                          <div className="attendee-info">
                            <div className="info-group">
                              <span className="info-label">Email:</span>
                              <span className="info-value">{attendee.email}</span>
                            </div>
                            <div className="info-group">
                              <span className="info-label">Phone:</span>
                              <span className="info-value">{attendee.phone_number || '-'}</span>
                            </div>
                            <div className="info-group">
                              <span className="info-label">Organization:</span>
                              <span className="info-value">{attendee.organization || '-'}</span>
                            </div>
                            <div className="info-group">
                              <span className="info-label">Position:</span>
                              <span className="info-value">{attendee.position || '-'}</span>
                            </div>
                            <div className="info-group">
                              <span className="info-label">Attendance:</span>
                              <span className="info-value">{attendee.attendance_type || '-'}</span>
                            </div>
                            <div className="info-group">
                              <span className="info-label">Sessions:</span>
                              <span className="info-value">{attendee.interested_sessions || '-'}</span>
                            </div>
                            <div className="info-group">
                              <span className="info-label">Certificate:</span>
                              <span className="info-value">{attendee.certificate_required ? 'Yes' : 'No'}</span>
                            </div>
                            <div className="info-group">
                              <span className="info-label">Reg Type:</span>
                              <span className="info-value">{attendee.registration_type || '-'}</span>
                            </div>
                            <div className="info-group">
                              <span className="info-label">Payment:</span>
                              <span className="info-value">{attendee.payment_method || '-'}</span>
                            </div>
                            <div className="info-group">
                              <span className="info-label">Invoice:</span>
                              <span className="info-value">{attendee.invoice_requested ? 'Yes' : 'No'}</span>
                            </div>
                            {attendee.invoice_requested && (
                              <div className="info-group">
                                <span className="info-label">Invoice Details:</span>
                                <span className="info-value">{attendee.invoice_details || '-'}</span>
                              </div>
                            )}
                            <div className="info-group">
                              <span className="info-label">Hotel:</span>
                              <span className="info-value">{attendee.hotel_recommendations ? 'Yes' : 'No'}</span>
                            </div>
                            <div className="info-group">
                              <span className="info-label">Transfer:</span>
                              <span className="info-value">{attendee.airport_transfer ? 'Yes' : 'No'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="card-footer bg-light">
                          <small className="text-muted">ID: {attendee.id}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
            ) : (
                <p className="text-center text-muted mt-4">No attendees match your filters.</p>
            )}
            </div>
          </div>
        )}

        {/* Subscribers View */}
        {activeSection === 'subscribers' && (
          <div className="data-section card shadow mb-5"> 
             <div className="card-header py-3 d-flex justify-content-between align-items-center">
                <h4 className="mb-0">Newsletter Subscribers ({filteredSubscribers.length})</h4>
              {filteredSubscribers.length > 0 && (
                <button
                    onClick={() => exportToCSV(filteredSubscribers.map(s => ({id: s.id, email: s.email})), 'subscribers.csv')}
                    className="btn btn-sm btn-primary"
                >
                    <FaFileExport className="me-1"/> Export CSV
                </button>
              )}
            </div>
             <div className="card-body">
                 {/* Subscribers Table */} 
            {filteredSubscribers.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-striped table-hover table-bordered table-sm">
                      <thead className="table-dark">
                      <tr>
                        <th>ID</th>
                        <th>Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubscribers.map((subscriber) => (
                        <tr key={subscriber.id}>
                          <td>{subscriber.id}</td>
                          <td>{subscriber.email}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                ) : (
                  <p className="text-center text-muted mt-4">No subscribers match your search.</p>
                )}
             </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminPage;