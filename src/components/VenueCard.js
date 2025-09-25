import React from "react";
import "../styles/VenueCard.css";
import { FaStar } from "react-icons/fa";
import { FaShieldAlt, FaPlus } from "react-icons/fa";
import { BiSolidShieldPlus } from "react-icons/bi";

export default function VenueCard({ resData1 }) {
  const {
    name,
    city,
    area,
    address,
    avgRating,
    ratingCount,
    coverImage,
    images,
    distance,
    isBookable,
    isSafeHygiene,
    sports,
  } = resData1;

  const imageUrl = images?.[0]?.url;
  const locationText = `${area || city || "Unknown"} (${
    distance?.toFixed(2) || "0"
  } Km)`;

  return (
    <div className="venue-card">
      <div className="venue-card-image-wrapper">
        <img src={imageUrl} alt={name} className="venue-card-image" />

        <div className="venue-rating-wrapper">
          <div className="rating-score-box">
            <FaStar className="rating-star-icon" />
            <span>{avgRating?.toFixed(1) || "N/A"}</span>
          </div>
          <div className="rating-votes-box">{ratingCount || 0} Votes</div>
        </div>
      </div>

      <div className="venue-card-content">
        <h3 className="venue-card-title">{name}</h3>

        <div className="venue-card-location">
          <span className="location-text">{locationText}</span>
        </div>

        <div className="venue-sports-icons">
          {sports?.slice(0, 3).map((sportCode, index) => (
            <div key={index} className="sport-icon-wrapper">
              <img
                src={`https://playo.gumlet.io/V3SPORTICONS/${sportCode}.png?q=100`}
                alt={sportCode}
                className="sport-icon-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://playo.gumlet.io/V3SPORTICONS/SP2.png?q=100";
                }}
              />
            </div>
          ))}
        </div>

        <div className="venue-card-tags">
          {isBookable && <span className="venue-tag bookable">BOOKABLE</span>}

          {avgRating > 4.5 && (
            <span className="venue-tag hygiene">
              <BiSolidShieldPlus className="tag-icon shield-icon" />
              Safe & Hygiene
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
