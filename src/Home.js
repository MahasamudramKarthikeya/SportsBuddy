import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setSelectedCity } from "./features/citySlice";
import { HOME_BG } from "../utils/constants";
import { FiSearch } from "react-icons/fi";
import { MdMyLocation } from "react-icons/md";
import "./Home.css";

const GEO_DB_API_HOST = process.env.REACT_APP_GEO_DB_API_HOST;
const GEO_DB_API_KEY = process.env.REACT_APP_GEO_DB_API_KEY;

const slugifyCity = (name) =>
  name.split(",")[0].trim().replace(/\s+/g, "-").toLowerCase();

export default function Home() {
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!searchInput) {
      setSuggestions([]);
      return;
    }

    const fetchCities = async () => {
      try {
        const response = await fetch(
          `https://${GEO_DB_API_HOST}/v1/geo/cities?namePrefix=${searchInput}&limit=5&sort=-population`,
          {
            method: "GET",
            headers: {
              "X-RapidAPI-Key": GEO_DB_API_KEY,
              "X-RapidAPI-Host": GEO_DB_API_HOST,
            },
          }
        );
        const data = await response.json();

        if (data.data) {
          const cityData = data.data.map((city) => ({
            name: `${city.city}, ${city.countryCode}`,
            lat: city.latitude,
            lng: city.longitude,
          }));
          setSuggestions(cityData);
        }
      } catch (error) {
        console.error("Failed to fetch cities:", error);
      }
    };

    fetchCities();
  }, [searchInput]);

  const handleInputChange = (e) => setSearchInput(e.target.value);

  const handleCitySelect = (city) => {
    setSearchInput(city.name);
    setSuggestions([]);

    dispatch(setSelectedCity(city));

    const citySlug = slugifyCity(city.name);
    navigate(`/${citySlug}`);
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const currentLoc = {
            name: "Your Location",
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          dispatch(setSelectedCity(currentLoc));
          navigate("/your-location");
        },
        () => alert("Location access denied or unavailable.")
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div
      className="home-container-bg"
      style={{
        backgroundImage: `url(${HOME_BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: "20px",
        position: "relative",
      }}
    >
      <div className="home-overlay"></div>

      <h1 className="home-main-heading">
        Ready to find <span className="home-highlight">Sports venues</span>{" "}
        around you?
      </h1>

      <div className="search-area-wrapper">
        <div className="search-bar-custom">
          <FiSearch className="icon-search" />
          <input
            type="text"
            placeholder="Search cities, places..."
            value={searchInput}
            onChange={handleInputChange}
            className="input-search-custom"
            autoComplete="off"
          />
          <button className="btn-locate" onClick={handleLocateMe}>
            <MdMyLocation />
          </button>
        </div>

        {suggestions.length > 0 && (
          <ul className="list-suggestions">
            {suggestions.map((city, index) => (
              <li
                key={index}
                className="suggestion-item"
                onClick={() => handleCitySelect(city)}
              >
                {city.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
