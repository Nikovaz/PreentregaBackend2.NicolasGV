import React from 'react';

const Footer = () => {
  return (
    <footer className="footer text-center py-3 bg-dark text-white mt-auto">
      <div className="container">
        <span>© {new Date().getFullYear()} E-Commerce. Todos los derechos reservados.</span>
      </div>
    </footer>
  );
};

export default Footer;