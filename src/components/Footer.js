// src/components/Footer.js
import React from 'react';

function Footer() {
  return (
    <footer className="footer py-4">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-4 text-lg-start">Copyright &copy; Nonprofit Konnect 2025</div>
          <div className="col-lg-4 my-3 my-lg-0">
            {/* Example social buttons if needed, requires Font Awesome */}
            {/* <a className="btn btn-dark btn-social mx-2" href="#!" aria-label="Twitter"><i className="fab fa-twitter"></i></a> */}
            {/* <a className="btn btn-dark btn-social mx-2" href="#!" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a> */}
            {/* <a className="btn btn-dark btn-social mx-2" href="#!" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a> */}
          </div>
          <div className="col-lg-4 text-lg-end">
            {/* Template has privacy/terms links, can be added if needed */}
            {/* <a className="link-dark text-decoration-none me-3" href="#!">Privacy Policy</a> */}
            {/* <a className="link-dark text-decoration-none" href="#!">Terms of Use</a> */}
            {/* Keeping original simple text for now */}
             All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;