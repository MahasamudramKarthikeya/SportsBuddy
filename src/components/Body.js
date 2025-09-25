import React, { useRef, useState, useEffect, useCallback } from "react";
import Shimmer from "./Shimmer";
import useFetchVenues from "../hooks/useFetchVenues";
import { Link } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import VenueCard from "./VenueCard";
import "../styles/Body.css";
import { FaSearch, FaStar } from "react-icons/fa";
import { setPageNo } from "../features/citySlice";

const AUTO_SCROLL_LIMIT = 40;
const CHUNK_SIZE = 32;

const Body = () => {
  const dispatch = useDispatch();
  const selectedCity = useSelector((state) => state.city.selectedCity);
  const pageNo = useSelector((state) => state.city.pageNo);
  const { venueList, loading, hasMore } = useFetchVenues(
    selectedCity?.lat,
    selectedCity?.lng,
    pageNo
  );

  const [filteredData, setFilteredData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(CHUNK_SIZE);
  const [manualLoadTrigger, setManualLoadTrigger] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [isTopRated, setIsTopRated] = useState(false);

  const loadedCardCount = useRef(0);

  useEffect(() => {
    dispatch(setPageNo(0));
    setVisibleCount(CHUNK_SIZE);
    setSearchQuery("");
    setIsTopRated(false);
  }, [selectedCity, dispatch]);

  useEffect(() => {
    let data = venueList;

    if (isTopRated) {
      data = data.filter((res) => res.avgRating > 4);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter((res) => res.name.toLowerCase().includes(q));
    }

    setFilteredData(data);
    loadedCardCount.current = data.length;
    setVisibleCount(CHUNK_SIZE);
  }, [venueList, searchQuery, isTopRated]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const toggleFilter = () => {
    setIsTopRated((prev) => !prev);
  };

  const observer = useRef();
  const lastCardRef = useCallback(
    (node) => {
      if (loading || manualLoadTrigger) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          if (visibleCount < filteredData.length) {
            setVisibleCount((prev) => prev + CHUNK_SIZE);
          } else if (loadedCardCount.current < AUTO_SCROLL_LIMIT) {
            dispatch(setPageNo(pageNo + 1));
          }
        }
      });

      if (node) observer.current.observe(node);
    },
    [
      loading,
      hasMore,
      manualLoadTrigger,
      dispatch,
      pageNo,
      visibleCount,
      filteredData.length,
    ]
  );

  const visibleCards = filteredData.slice(0, visibleCount);

  if (!selectedCity) {
    return <p className="no-city">Please select a city first.</p>;
  }

  return (
    <>
      <div className="navtools">
        <button
          onClick={toggleFilter}
          className={`filter-button ${isTopRated ? "active" : ""}`}
          aria-pressed={isTopRated}
        >
          <span className="btn-icon-wrapper">
            <FaStar
              className={`btn-icon ${
                isTopRated ? "filled-star" : "outlined-star"
              }`}
            />
          </span>
          <span className="btn-text">
            {isTopRated ? "Top Rated Active" : "Show Top Rated"}
          </span>
        </button>

        <span className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            id="search-box"
            type="text"
            placeholder="Search your fav venue here!"
            value={searchQuery}
            onChange={handleSearch}
          />
        </span>
      </div>

      <div className="rescontainer">
        {visibleCards.map((rest, index) => {
          const isLastCard = index === visibleCards.length - 1;

          return (
            <Link
              key={index}
              to={`/venuedetails/${rest.city}/${rest.activeKey}`}
              className="venue-link-wrapper"
              ref={isLastCard ? lastCardRef : null}
            >
              <div className="fade-in">
                <VenueCard resData1={rest} />
              </div>
            </Link>
          );
        })}
      </div>

      {loadedCardCount.current >= AUTO_SCROLL_LIMIT && hasMore && !loading && (
        <div className="load-more-container">
          <button
            className="load-more-btn"
            onClick={() => {
              setManualLoadTrigger(true);
              dispatch(setPageNo(pageNo + 1));
              setTimeout(() => setManualLoadTrigger(false), 1000);
            }}
          >
            Load More
          </button>
        </div>
      )}

      {loading && <Shimmer />}
    </>
  );
};

export default Body;
