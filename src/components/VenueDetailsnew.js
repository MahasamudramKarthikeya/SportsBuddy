import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import {
  FaStar,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaRegClock,
  FaShieldAlt,
} from "react-icons/fa";
import "../styles/VenueDetailsnew.css";
import HelpFormWidget from "./HelpFormWidget";

const VENUE_URL = "https://serverforsportsbuddy.onrender.com/api/venues/";

const VenueDetailsNew = () => {
  const { city, activeKey } = useParams();
  const navigate = useNavigate();
  const [venDet, setVenDet] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${VENUE_URL}${city}/${activeKey}`;
        const response = await fetch(url);
        const jsonData = await response.json();
        setVenDet(jsonData?.pageProps?.venueDetails?.venueInfo);
        setCurrentImageIndex(0);
      } catch (error) {
        console.error("Error fetching venue details:", error);
      }
    };
    fetchData();
  }, [city, activeKey]);

  if (!venDet) return <div>Loading...</div>;

  const {
    name,
    description,
    address,
    country,
    images = [],
    amenities = [],
    avgRating,
    timings,
    inquiryPhone,
    sports = [],
    isSafeHygiene,
  } = venDet;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const generateMapEmbedUrl = (addressStr) => {
    if (!addressStr) return null;
    const query = encodeURIComponent(addressStr);
    return `https://maps.google.com/maps?q=${query}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  };

  const fullAddress = [address, country].filter(Boolean).join(", ");
  const mapEmbedUrl = generateMapEmbedUrl(fullAddress);

  const handleBookNow = () => {
    navigate("/booking-successful");
  };

  return (
    <div className="page-wrapper">
      <button onClick={() => navigate(`/${city}`)} className="back-button">
        ← Back to {city.charAt(0).toUpperCase() + city.slice(1)}
      </button>

      <h1 className="venue-title">{name}</h1>

      <div className="container">
        <div className="left-panel">
          {images.length > 0 ? (
            <div className="carousel-wrapper">
              <button
                onClick={prevImage}
                className="carousel-btn prev-btn"
                aria-label="Previous image"
              >
                &#10094;
              </button>
              <img
                src={images[currentImageIndex].url}
                alt={`Venue Image ${currentImageIndex + 1}`}
                className="carousel-image"
              />
              <button
                onClick={nextImage}
                className="carousel-btn next-btn"
                aria-label="Next image"
              >
                &#10095;
              </button>
            </div>
          ) : (
            <div className="no-images">No images available.</div>
          )}

          <section className="section">
            <h3>About Venue</h3>
            <p>{description || "No description available."}</p>
          </section>

          <section className="section">
            <h3>Sports Available</h3>
            <div className="sports-grid">
              {sports.length > 0 ? (
                sports.map((sportCode, idx) => (
                  <div key={idx} className="sport-card" title={sportCode}>
                    <img
                      className="sport-icon"
                      src={`https://playo.gumlet.io/V3SPORTICONS/${sportCode}.png?w=96&q=75`}
                      alt={sportCode}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://playo.gumlet.io/V3SPORTICONS/SP2.png?w=96&q=75";
                      }}
                    />
                  </div>
                ))
              ) : (
                <p>No sports available.</p>
              )}
            </div>
          </section>

          <section className="section">
            <h3>Amenities</h3>
            <div className="amenities-wrapper">
              {amenities.length > 0 ? (
                amenities.map((amenity, idx) => (
                  <span key={idx} className="amenity-tag">
                    {amenity}
                  </span>
                ))
              ) : (
                <p>No amenities listed.</p>
              )}
            </div>
          </section>
        </div>

        <div className="right-panel">
          <div className="booking-btn-wrapper">
            <button onClick={handleBookNow} className="book-now-btn">
              Book Now
            </button>
          </div>

          <div className="rating-wrapper">
            <FaStar className="star-icon" />
            <span className="rating-value">{avgRating || "N/A"}</span>
            <span>(Rate this venue)</span>
          </div>

          {isSafeHygiene && (
            <div className="safe-tag">
              <FaShieldAlt className="shield-icon" />
              Safe & Hygiene
            </div>
          )}

          <section className="info-section">
            <h4>
              <FaMapMarkerAlt className="icon" />
              Location
            </h4>
            <p>{fullAddress}</p>
          </section>

          <section className="info-section">
            <h4>
              <FaRegClock className="icon" />
              Timings
            </h4>
            <p>{timings || "Not available"}</p>
          </section>

          <section className="info-section">
            <h4>
              <FaPhoneAlt className="icon" />
              Contact
            </h4>
            <p>{inquiryPhone || "Not available"}</p>
          </section>

          {mapEmbedUrl ? (
            <iframe
              title="Venue Location Map"
              src={mapEmbedUrl}
              width="100%"
              height="250"
              className="venue-map"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <p>No map available.</p>
          )}
        </div>
      </div>

      <HelpFormWidget />
    </div>
  );
};

export default VenueDetailsNew;
