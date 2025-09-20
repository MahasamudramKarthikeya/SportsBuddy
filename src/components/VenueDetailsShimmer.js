import React from "react";
import "../styles/VenueDetailsShimmer.css"; // Separate CSS file for shimmer styles

const VenueDetailsShimmer = () => {
  return (
    <div className="vdn-venue-page shimmer-wrapper">
      {/* Back button placeholder */}
      <div className="shimmer-btn shimmer-back-btn"></div>

      {/* Header */}
      <div className="vdn-venue-header">
        <div className="shimmer-title shimmer-venue-title"></div>
        <div className="shimmer-underline"></div>
        <div className="shimmer-text shimmer-venue-area"></div>
      </div>

      {/* Columns */}
      <div className="vdn-venue-columns">
        {/* LEFT COLUMN */}
        <div className="vdn-left-column">
          {/* Carousel */}
          <div className="vdn-carousel-box shimmer-carousel">
            <div className="shimmer-image"></div>
            <div className="shimmer-dots">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="shimmer-dot" />
              ))}
            </div>
          </div>

          {/* Sports Available */}
          <section className="vdn-boxed-section shimmer-section">
            <div className="shimmer-section-title"></div>
            <div className="vdn-sports-list shimmer-sports-list">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="shimmer-sport-icon-wrapper">
                  <div className="shimmer-sport-icon"></div>
                </div>
              ))}
            </div>
          </section>

          {/* Amenities */}
          <section className="vdn-boxed-section shimmer-section">
            <div className="shimmer-section-title"></div>
            <div className="vdn-amenities-list shimmer-amenities-list">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="shimmer-amenity-item">
                  <div className="shimmer-amenity-icon"></div>
                  <div className="shimmer-amenity-text"></div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="vdn-right-column">
          {/* Book Now Box */}
          <div className="vdn-booking-box shimmer-box">
            <div className="shimmer-btn shimmer-book-btn"></div>

            <div className="vdn-rating-section shimmer-rating-section">
              <div className="shimmer-rating-row">
                <div className="shimmer-rating-box">
                  <div className="shimmer-star"></div>
                  <div className="shimmer-rating-value"></div>
                  <div className="shimmer-rating-count"></div>
                </div>
                <div className="shimmer-safe-badge"></div>
              </div>
            </div>
          </div>

          {/* Timings */}
          <div className="vdn-info-box shimmer-box">
            <div className="shimmer-info-title"></div>
            <div className="shimmer-info-text"></div>
          </div>

          {/* Location */}
          <div className="vdn-info-box shimmer-box">
            <div className="shimmer-info-title"></div>
            <div className="shimmer-info-text"></div>
            <div className="shimmer-map-container">
              <div className="shimmer-map-frame"></div>
            </div>
          </div>

          {/* Contact */}
          <div className="vdn-info-box shimmer-box">
            <div className="shimmer-info-title"></div>
            <div className="shimmer-info-text"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueDetailsShimmer;
