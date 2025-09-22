import React, { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import "../styles/Footer.css";

const SPORTS_API_ENDPOINT =
  "https://serverforsportsbuddy.onrender.com/api/venues/Hyderabad/smash-pro-arena-pickleball-begumpet-hyderabad";

const quotes = [
  "Winners never quit and quitters never win.",
  "Champions keep playing until they get it right.",
  "Push yourself because no one else is going to do it for you.",
  "It's not about perfect. It's about effort.",
  "Great things never came from comfort zones.",
  "Train insane or remain the same.",
  "Don't stop when you're tired. Stop when you're done.",
  "You miss 100% of the shots you don't take.",
  "Hard work beats talent when talent doesn't work hard.",
  "Pain is temporary. Pride is forever.",
];

const Footer = () => {
  const [sportIcons, setSportIcons] = useState([]);

  // Pick one random quote on first render
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

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
          setSportIcons(filtered);
        }
      } catch (err) {
        console.error("Error fetching sports icons:", err);
      }
    };
    fetchSports();
  }, []);

  // Duplicate icons to create infinite scroll effect
  const scrollingIcons = [...sportIcons, ...sportIcons];

  return (
    <footer className="footer-container" aria-label="Sports icons footer">
      <div className="footer-quote-text">{randomQuote}</div>

      {scrollingIcons.length > 0 && (
        <div
          className="footer-sports-carousel"
          role="list"
          aria-label="Scrolling sports icons"
        >
          <div className="footer-sports-track">
            {scrollingIcons.map((sport, index) => (
              <div
                key={`${sport.sportId}-${index}`}
                className="footer-sport-icon-wrapper"
                role="listitem"
                title={sport.name}
              >
                <img
                  src={sport.v2GrayIcon}
                  alt={sport.name}
                  className="footer-sport-icon"
                  draggable={false}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://playo.gumlet.io/V3SPORTICONS/SP2.png?w=96&q=75";
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="footer-bottom-text">
        Powered by passion, sweat &{" "}
        <FaHeart className="footer-heart-icon pulse" /> by SportsBuddy
      </div>
    </footer>
  );
};

export default Footer;
