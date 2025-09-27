import { useParams, useNavigate } from "react-router";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import {
  FaStar,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaCheckCircle,
  FaShieldAlt,
  FaClock,
  FaChevronLeft,
  FaChevronRight,
  FaArrowLeft,
} from "react-icons/fa";
import "../styles/VenueDetailsnew.css";
import HelpFormWidget from "./HelpFormWidget";
import VenueDetailsShimmer from "./VenueDetailsShimmer";

import { BiSolidShieldPlus } from "react-icons/bi";
import { VENUE_URL } from "../../utils/constants";

const AUTO_SCROLL_INTERVAL = 5000;

const slugifyCity = (name) =>
  name?.split(",")[0]?.trim()?.toLowerCase()?.replace(/\s+/g, "-");

const VenueDetails = () => {
  const { city: cityFromParams, activeKey } = useParams();
  const navigate = useNavigate();

  const selectedCity = useSelector((state) => state.city.selectedCity);
  const selectedCitySlug = slugifyCity(selectedCity?.name);

  const [venue, setVenue] = useState(null);
  const [allSports, setAllSports] = useState([]);
  const [imgIndex, setImgIndex] = useState(0);
  const timerRef = useRef(null);
  const interactionTimeoutRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchVenue = async () => {
      try {
        const res = await fetch(`${VENUE_URL}${cityFromParams}/${activeKey}`);
        const data = await res.json();
        setVenue(data?.pageProps?.venueDetails?.venueInfo);
        setAllSports(data?.pageProps?.allSports?.list || []);
      } catch (err) {
        console.error("Error fetching venue:", err);
      }
    };

    fetchVenue();
  }, [cityFromParams, activeKey]);

  const startAutoScroll = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setImgIndex((prev) =>
        venue && venue.images.length > 0 ? (prev + 1) % venue.images.length : 0
      );
    }, AUTO_SCROLL_INTERVAL);
  };

  useEffect(() => {
    if (!venue?.images?.length) return;

    startAutoScroll();

    return () => clearInterval(timerRef.current);
  }, [venue]);

  const handleUserInteraction = (newIndex) => {
    clearInterval(timerRef.current);
    setImgIndex(newIndex);

    if (interactionTimeoutRef.current)
      clearTimeout(interactionTimeoutRef.current);

    interactionTimeoutRef.current = setTimeout(() => {
      startAutoScroll();
    }, AUTO_SCROLL_INTERVAL);
  };

  const prevImage = () => {
    if (!venue?.images?.length) return;
    const newIndex = (imgIndex - 1 + venue.images.length) % venue.images.length;
    handleUserInteraction(newIndex);
  };

  const nextImage = () => {
    if (!venue?.images?.length) return;
    const newIndex = (imgIndex + 1) % venue.images.length;
    handleUserInteraction(newIndex);
  };

  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const onTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const onTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    handleSwipeGesture();
  };

  const handleSwipeGesture = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const deltaX = touchStartX.current - touchEndX.current;

    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        nextImage();
      } else {
        prevImage();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
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
  const mapEmbedUrl =
    venue?.lat && venue?.lng
      ? `https://www.google.com/maps?q=${venue.lat},${venue.lng}&hl=es;z=14&output=embed`
      : `https://maps.google.com/maps?q=${encodeURIComponent(
          fullAddress
        )}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  const matchedSports = sports
    .map((sportId) => allSports.find((s) => s.sportId === sportId))
    .filter(Boolean);

  return (
    <div className="detcontainer">
      <div className="vdn-venue-page">
        <button
          onClick={() => navigate(`/${selectedCitySlug || ""}`)}
          className="vdn-back-city-btn"
          aria-label={`Back to ${selectedCity?.name}`}
        >
          <FaArrowLeft style={{ marginRight: "6px" }} />
          Back to {selectedCity?.name || "City"}
        </button>

        <div className="vdn-venue-header">
          <h1 className="vdn-venue-title">{name}</h1>
          <div className="vdn-venue-underline" />
          <p className="vdn-venue-area">{area || "Unknown area"}</p>
        </div>

        <div className="vdn-venue-columns">
          <div className="vdn-left-column">
            <div
              className="vdn-carousel-box"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              {images.length > 0 && (
                <>
                  <img
                    src={images[imgIndex].url}
                    alt={`Venue image ${imgIndex + 1}`}
                    className="vdn-carousel-img"
                    draggable={false}
                  />

                  <button
                    className="vdn-arrow vdn-arrow-left"
                    aria-label="Previous image"
                    onClick={prevImage}
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    className="vdn-arrow vdn-arrow-right"
                    aria-label="Next image"
                    onClick={nextImage}
                  >
                    <FaChevronRight />
                  </button>

                  <div className="vdn-carousel-dots">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        className={`vdn-dot ${i === imgIndex ? "active" : ""}`}
                        onClick={() => handleUserInteraction(i)}
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
                    <span className="vdn-rating-value">
                      {avgRating || "N/A"}
                    </span>
                    {ratingCount && (
                      <span className="vdn-rating-count">
                        ({ratingCount} ratings)
                      </span>
                    )}
                  </div>

                  {avgRating > 4.5 && (
                    <div className="vdn-safe-badge">
                      <BiSolidShieldPlus className="vdn-safe-icon" /> Safe &
                      Hygienic
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
                <FaMapMarkerAlt className="vdn-info-icon" />
                {fullAddress}
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
    </div>
  );
};

export default VenueDetails;
