import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router";
import { LOGO } from "../../utils/constants";
import CitySelector from "./CitySelector";
import "../styles/Head.css";

import { FiMenu } from "react-icons/fi";

const slugifyCity = (name) =>
  name?.split(",")[0]?.trim()?.toLowerCase()?.replace(/\s+/g, "-");

const Head = () => {
  const selectedCity = useSelector((state) => state.city.selectedCity);
  const citySlug = slugifyCity(selectedCity?.name);

  const location = useLocation();
  const currentPath = location.pathname.toLowerCase();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const navLinks = [
    { path: `/${citySlug}`, label: "Home" },
    { path: "/about", label: "About Us" },
    { path: "/contact", label: "Contact Us" },
  ];

  const isHomeActive = () => {
    const pathParts = currentPath.split("/").filter(Boolean);

    if (
      currentPath === "/" ||
      (pathParts.length === 1 && pathParts[0] === citySlug)
    ) {
      return true;
    }

    return false;
  };

  return (
    <header id="header">
      <div className="left-section">
        <Link to="/" className="logo-link">
          <img id="logo" src={LOGO} alt="Logo" />
        </Link>
      </div>

      <button className="hamburger" onClick={toggleMobileMenu}>
        <FiMenu size={24} />
      </button>

      <div className={`right-section ${isMobileMenuOpen ? "open" : ""}`}>
        <nav className="nav-section">
          <ul className="nav-list">
            {navLinks.map((link) => {
              let isActive = false;

              if (link.label === "Home") {
                isActive = isHomeActive();
              } else {
                isActive = currentPath === link.path.toLowerCase();
              }

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
