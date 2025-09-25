import React from "react";
import {
  FaGithub,
  FaEnvelope,
  FaExternalLinkAlt,
  FaPhoneAlt,
  FaCodeBranch,
  FaHeart,
} from "react-icons/fa";
import "./styles/Contact.css";

const ContactUs = () => {
  return (
    <div className="contact-container">
      <h1>
        <FaEnvelope className="icon" /> Contact{" "}
        <span className="highlight">Us</span>
      </h1>

      <p className="intro">
        Got a question, feedback, or collaboration idea? We'd love to hear from
        you! Sports Buddy is an open educational project powered by real-time
        sports data and built with <FaHeart color="red" /> for learning and
        innovation.
      </p>

      <div className="section">
        <h2>
          <FaGithub className="icon" /> GitHub & Source Code
        </h2>
        <p>
          Check out the full source code, contribute, or report issues via our
          GitHub repository.
        </p>
        <a
          href="https://github.com/MahasamudramKarthikeya/SportsBuddy"
          target="_blank"
          rel="noopener noreferrer"
          className="github-link"
        >
          <FaCodeBranch className="icon-small" /> View Source Code on GitHub{" "}
          <FaExternalLinkAlt className="icon-external" />
        </a>
      </div>

      <div className="section">
        <h2>
          <FaCodeBranch className="icon" /> Developer Profile
        </h2>
        <p>
          Created by <strong>Karthikeya Mahasamudram</strong>. Explore more
          projects and contributions on GitHub:
        </p>
        <a
          href="https://github.com/MahasamudramKarthikeya"
          target="_blank"
          rel="noopener noreferrer"
          className="github-link"
        >
          <FaGithub className="icon-small" /> MahasamudramKarthikeya
        </a>
      </div>

      <footer className="footer">
        <p>
          © {new Date().getFullYear()} Sports Buddy. Built for educational use
          only.
        </p>
      </footer>
    </div>
  );
};

export default ContactUs;
