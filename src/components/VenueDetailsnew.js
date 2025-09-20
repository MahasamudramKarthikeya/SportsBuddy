import { useParams, useNavigate } from "react-router";
import { useEffect, useState, useRef } from "react";
import {
  FaStar,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaCheckCircle,
  FaShieldAlt,
  FaClock,
} from "react-icons/fa";
import "../styles/VenueDetailsnew.css";
import HelpFormWidget from "./HelpFormWidget";
import VenueDetailsShimmer from "./VenueDetailsShimmer";

const VENUE_URL = "https://serverforsportsbuddy.onrender.com/api/venues/";
const AUTO_SCROLL_INTERVAL = 5000;

const VenueDetails = () => {
  const { city, activeKey } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [allSports, setAllSports] = useState([]);
  const [imgIndex, setImgIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const res = await fetch(`${VENUE_URL}${city}/${activeKey}`);
        const data = await res.json();
        setVenue(data?.pageProps?.venueDetails?.venueInfo);
        setAllSports(data?.pageProps?.allSports?.list || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchVenue();
  }, [city, activeKey]);

  useEffect(() => {
    if (!venue?.images?.length) return;
    timerRef.current = setInterval(() => {
      setImgIndex((prev) => (prev + 1) % venue.images.length);
    }, AUTO_SCROLL_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [venue]);

  const goToImage = (index) => {
    clearInterval(timerRef.current);
    setImgIndex(index);
  };

  if (!venue)
    return (
      <div className="vdn-loading">
        <VenueDetailsShimmer />
      </div>
    );

  const {
    name,
    address,
    country,
    area,
    images = [],
    amenities = [],
    avgRating,
    ratingCount,
    timings,
    inquiryPhone,
    sports = [],
  } = venue;

  const fullAddress = [address, country].filter(Boolean).join(", ");
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    fullAddress
  )}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  const matchedSports = sports
    .map((sportId) => allSports.find((s) => s.sportId === sportId))
    .filter(Boolean);

  return (
    <div className="vdn-venue-page">
      <button
        onClick={() => navigate(`/${city}`)}
        className="vdn-back-city-btn"
        aria-label={`Back to ${city}`}
      >
        ← Back to {city.charAt(0).toUpperCase() + city.slice(1)}
      </button>

      <div className="vdn-venue-header">
        <h1 className="vdn-venue-title">{name}</h1>
        <div className="vdn-venue-underline" />
        <p className="vdn-venue-area">{area || "Unknown area"}</p>
      </div>

      <div className="vdn-venue-columns">
        {/* LEFT SIDE */}
        <div className="vdn-left-column">
          <div className="vdn-carousel-box">
            {images.length > 0 && (
              <>
                <img
                  src={images[imgIndex].url}
                  alt={`Venue image ${imgIndex + 1}`}
                  className="vdn-carousel-img"
                  draggable={false}
                />
                <div className="vdn-carousel-dots">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      className={`vdn-dot ${i === imgIndex ? "active" : ""}`}
                      onClick={() => goToImage(i)}
                      aria-label={`Go to image ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <section className="vdn-boxed-section">
            <h2>Sports Available</h2>
            <div className="vdn-sports-list">
              {matchedSports.map((sport, i) => (
                <div
                  key={i}
                  className="vdn-sport-icon-wrapper"
                  tabIndex={0}
                  aria-label={sport.name}
                  title={sport.name}
                >
                  <img
                    src={sport.v2GrayIcon}
                    alt={sport.name}
                    className="vdn-sport-icon"
                    onError={(e) =>
                      (e.target.src =
                        "https://playo.gumlet.io/V3SPORTICONS/SP2.png?w=96&q=75")
                    }
                  />
                  <span className="vdn-sport-tooltip">{sport.name}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="vdn-boxed-section vdn-amenities-section">
            <h2>Amenities</h2>
            <div className="vdn-amenities-list">
              {amenities.map((am, i) => (
                <div key={i} className="vdn-amenity-item">
                  <FaCheckCircle className="vdn-amenity-icon" />
                  <span>{am}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT SIDE */}
        <div className="vdn-right-column">
          <div className="vdn-booking-box">
            <button
              className="vdn-book-btn"
              onClick={() => navigate(`/booking-successful`)}
            >
              Book Now
            </button>

            <div className="vdn-rating-section">
              <div className="vdn-rating-row">
                <div className="vdn-rating-box">
                  <FaStar className="vdn-rating-star" />
                  <span className="vdn-rating-value">{avgRating || "N/A"}</span>
                  {ratingCount && (
                    <span className="vdn-rating-count">
                      ({ratingCount} ratings)
                    </span>
                  )}
                </div>

                {avgRating > 4.5 && (
                  <div className="vdn-safe-badge">
                    <FaShieldAlt /> Safe & Hygienic
                  </div>
                )}
              </div>
            </div>
          </div>

          {timings && (
            <div className="vdn-info-box">
              <h3 className="vdn-info-title">Timings</h3>
              <p className="vdn-info-text">
                <FaClock /> {timings}
              </p>
            </div>
          )}

          <div className="vdn-info-box">
            <h3 className="vdn-info-title">Location</h3>
            <p className="vdn-info-text">
              <FaMapMarkerAlt /> {fullAddress}
            </p>
            <div className="vdn-map-container">
              <iframe
                title="Venue Map"
                src={mapEmbedUrl}
                className="vdn-map-frame"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="vdn-info-box">
            <h3 className="vdn-info-title">Contact</h3>
            <p className="vdn-info-text">
              <FaPhoneAlt /> {inquiryPhone || "N/A"}
            </p>
          </div>
        </div>
      </div>

      <HelpFormWidget />
    </div>
  );
};

export default VenueDetails;
