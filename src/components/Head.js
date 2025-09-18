import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router";
import { LOGO } from "../../utils/constants";
import CitySelector from "./CitySelector";
import "../styles/Head.css";

const Head = () => {
  const selectedCity = useSelector((state) => state.city.selectedCity);
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: "/venues", label: "Home" },
    { path: "/about", label: "About Us" },
    { path: "/contact", label: "Contact Us" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header id="header">
      <div className="left-section">
        <Link to="/" className="logo-link">
          <img id="logo" src={LOGO} alt="Logo" />
        </Link>
      </div>

      <button className="hamburger" onClick={toggleMobileMenu}>
        ☰
      </button>

      <div className={`right-section ${isMobileMenuOpen ? "open" : ""}`}>
        <nav className="nav-section">
          <ul className="nav-list">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={isActive ? "active" : ""}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="city-selector-section" title={selectedCity?.name}>
          <CitySelector />
        </div>
      </div>
    </header>
  );
};

export default Head;
