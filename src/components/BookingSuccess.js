import React from "react";
import { useLocation, useNavigate } from "react-router";
import { QRCodeSVG } from "qrcode.react";
import { FaMapMarkerAlt, FaClock } from "react-icons/fa";
import "../styles/BookingSuccess.css";

const BookingSuccess = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state) {
    return (
      <div className="bs-empty-container">
        <p className="bs-empty-text">No booking found.</p>
        <button className="bs-empty-btn" onClick={() => navigate("/")}>
          Go Home
        </button>
      </div>
    );
  }

  const { venue, sport, date, court, slots, total } = state;
  const qrValue = `
Venue: ${venue?.name}
Sport: ${sport?.name}
Date: ${date}
Court: ${court?.courtName}
Slots: ${slots.map((s) => s.timeRange).join(", ")}
Total: ₹${total}

This is a demo UI. No real payment is made. Enjoy your experience!
`;

  return (
    <div className="bs-container bs-moved-up">
      <div className="bs-ticket">
        {/* Header */}
        <div className="bs-ticket-header">
          <h1>Booking Confirmed</h1>
          <p className="bs-subtitle">Your digital ticket</p>
        </div>

        {/* Main Ticket */}
        <div className="bs-ticket-main">
          {/* Left Side */}
          <div className="bs-left">
            <div className="bs-venue-info">
              <div className="bs-sport-icon-wrapper">
                <img
                  src={sport?.v2GrayIcon || sport?.icon}
                  alt={sport?.name}
                  className="bs-sport-icon"
                />
              </div>
              <div className="bs-venue-details">
                <h2 className="bs-venue-name">{venue?.name}</h2>
                <p className="bs-venue-area">{venue?.area}</p>
              </div>
            </div>

            <div className="bs-booking-details">
              <div className="bs-row">
                <span className="bs-label">Sport:</span>
                <span>{sport?.name}</span>
              </div>
              <div className="bs-row">
                <span className="bs-label">Date:</span>
                <span>{date}</span>
              </div>
              <div className="bs-row">
                <span className="bs-label">Court:</span>
                <span>{court?.courtName}</span>
              </div>
              <div className="bs-row">
                <span className="bs-label">Slots:</span>
                <span>{slots.map((s) => s.timeRange).join(", ")}</span>
              </div>
              <div className="bs-row bs-total">
                <span className="bs-label">Total:</span>
                <span>₹{total}</span>
              </div>

              <div className="bs-row bs-location">
                <FaMapMarkerAlt /> <span>{venue?.area}</span>
              </div>
              <div className="bs-row bs-timings">
                <FaClock />{" "}
                <span>{slots.map((s) => s.timeRange).join(", ")}</span>
              </div>
            </div>
          </div>

          {/* Right Side QR */}
          <div className="bs-right">
            <QRCodeSVG value={qrValue} size={160} />
            <p className="bs-qr-text">
              This is a demo UI. No real payment is made. Enjoy your experience!
            </p>
          </div>
        </div>

        {/* Perforated line */}
        <div className="bs-perforation"></div>

        {/* Buttons */}
        <div className="bs-btn-wrapper">
          <button className="bs-home-btn" onClick={() => navigate("/")}>
            Back to Home
          </button>
          <button className="bs-venue-btn" onClick={() => navigate(-1)}>
            Back to Venue
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
