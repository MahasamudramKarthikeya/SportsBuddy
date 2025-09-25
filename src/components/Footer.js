import React, { useEffect, useState, useRef } from "react";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router";
import "../styles/Footer.css";

const SPORTS_API_ENDPOINT =
  "https://serverforsportsbuddy.onrender.com/api/venues/Hyderabad/smash-pro-arena-pickleball-begumpet-hyderabad";

const Footer = () => {
  const [originalIcons, setOriginalIcons] = useState([]);
  const [duplicatedIcons, setDuplicatedIcons] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const res = await fetch(SPORTS_API_ENDPOINT);
        const data = await res.json();
        const list = data?.pageProps?.allSports?.list;
        if (Array.isArray(list)) {
          const filtered = list
            .filter((s) => s.v2GrayIcon && s.v2GrayIcon.trim() !== "")
            .map((s) => ({
              sportId: s.sportId,
              v2GrayIcon: s.v2GrayIcon,
              name: s.name,
            }));
          setOriginalIcons(filtered);
          setDuplicatedIcons([...filtered, ...filtered]);
        }
      } catch (err) {
        console.error("Error fetching sports icons:", err);
      }
    };
    fetchSports();
  }, []);

  // Infinite scroll effect
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || duplicatedIcons.length === 0) return;

    let rafId;
    const speed = 0.5;

    const scrollStep = () => {
      if (!scrollContainer) return;

      scrollContainer.scrollLeft += speed;

      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
        scrollContainer.scrollLeft = 0;
      }

      rafId = requestAnimationFrame(scrollStep);
    };

    rafId = requestAnimationFrame(scrollStep);

    return () => cancelAnimationFrame(rafId);
  }, [duplicatedIcons]);

  return (
    <footer className="footer-premium">
      <div className="footer-headline-section">
        <h2 className="footer-headline">
          Fuel Your Passion <br />
          <span className="footer-subtitle">Every sport. Every moment.</span>
        </h2>
      </div>

      <div
        className="footer-icons-wrapper"
        aria-label="Popular sports icons scrollable section"
      >
        <div className="fade-left"></div>
        <div className="fade-right"></div>

        <div className="footer-icons-scroll" ref={scrollRef}>
          {duplicatedIcons.map((sport, index) => (
            <div
              key={`${sport.sportId}-${index}`}
              className="footer-icon-item"
              title={sport.name}
              tabIndex={0}
              aria-label={sport.name}
            >
              <img
                src={sport.v2GrayIcon}
                alt=""
                loading="lazy"
                draggable={false}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://playo.gumlet.io/V3SPORTICONS/SP2.png?w=96&q=";
                }}
              />
              <span className="icon-label">{sport.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="footer-bottom-bar">
        <nav className="footer-nav" aria-label="Footer navigation">
          <Link to="/">Venues</Link>
          <Link to="/sports">Sports</Link>
          <Link to="/about">Community</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        <div className="footer-branding" aria-label="Powered by SportsBuddy">
          Powered by passion <FaHeart className="heart-icon" /> SportsBuddy
        </div>
      </div>
    </footer>
  );
};

export default Footer;
