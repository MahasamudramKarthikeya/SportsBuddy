import React from "react";
import {
  FaHandshake,
  FaRunning,
  FaInfoCircle,
  FaCode,
  FaBook,
  FaRegCopyright,
} from "react-icons/fa";
import "./styles/AboutUs.css";

const AboutUs = () => {
  return (
    <div className="about-container">
      <h1>
        <FaInfoCircle className="icon" /> About{" "}
        <span className="highlight">Sports Buddy</span>
      </h1>

      <p className="intro">
        <strong>Sports Buddy</strong> is your friendly companion for discovering
        and engaging with sports and fitness activities around you. Whether
        you're into football, badminton, cricket, or running — we've got
        something for every sport enthusiast!
      </p>

      <div className="section">
        <h2>
          <FaRunning className="icon" /> Powered by Playo API
        </h2>
        <p>
          This project utilizes publicly accessible data from the{" "}
          <strong>Playo API</strong>. All data regarding venues, sports,
          timings, and availability is sourced directly from Playo. We do not
          store or modify any data — our application simply fetches and displays
          the information via API calls.
        </p>
      </div>

      <div className="section">
        <h2>
          <FaHandshake className="icon" /> Rights & Credits
        </h2>
        <p>
          All rights, trademarks, and copyrights related to the data, platform,
          and content belong exclusively to <strong>Playo</strong>. We do not
          claim ownership of any of the data retrieved from their service.
        </p>
      </div>

      <div className="section">
        <h2>
          <FaBook className="icon" /> Educational & Fair Use Notice
        </h2>
        <p>
          <strong>Sports Buddy</strong> is built solely for{" "}
          <em>educational and demonstrative purposes</em>. This project is a
          showcase of how third-party sports APIs can be integrated into modern
          applications using React, and is not intended for commercial use.
        </p>
      </div>

      <div className="section">
        <h2>
          <FaCode className="icon" /> Built with Passion
        </h2>
        <p>
          Developed by a passionate team of developers and sports lovers, this
          app blends clean UI, responsive design, and real-world data
          integration to create a user-centric experience.
        </p>
      </div>

      {/* <footer className="footer">
        <p>
          <FaRegCopyright className="icon-small" />
          {new Date().getFullYear()} Sports Buddy. For learning and educational
          use only.
        </p>
      </footer> */}
    </div>
  );
};

export default AboutUs;
