import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { FaQuestionCircle, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "../styles/HelpFormWidget.css";

const HelpFormWidget = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [statusType, setStatusType] = useState(""); // "success" | "error"
  const [sending, setSending] = useState(false);

  const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
  const EMAILJS_ADMIN_TEMPLATE_ID =
    process.env.REACT_APP_EMAILJS_ADMIN_TEMPLATE_ID;
  const EMAILJS_USER_TEMPLATE_ID =
    process.env.REACT_APP_EMAILJS_USER_TEMPLATE_ID;
  const EMAILJS_USER_ID = process.env.REACT_APP_EMAILJS_USER_ID;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!phoneRegex.test(formData.phone))
      newErrors.phone = "Enter a valid 10-digit phone number.";
    if (!emailRegex.test(formData.email))
      newErrors.email = "Enter a valid email address.";
    if (!formData.message.trim()) newErrors.message = "Message is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showStatus = (msg, type = "success") => {
    setStatusMsg(msg);
    setStatusType(type);
    setTimeout(() => {
      setStatusMsg("");
      setStatusType("");
    }, 5000);
  };

  const sendEmail = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setSending(true);

    const params = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      message: formData.message,
      download_url: "", // empty, not a download request
    };

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_ADMIN_TEMPLATE_ID,
        params,
        EMAILJS_USER_ID
      );

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_USER_TEMPLATE_ID,
        params,
        EMAILJS_USER_ID
      );

      setFormData({ name: "", phone: "", email: "", message: "" });
      showStatus("Message sent successfully", "success");
    } catch (err) {
      console.error("EmailJS error:", err);
      showStatus("Failed to send. Try again.", "error");
    } finally {
      setSending(false);
    }
  };

  const sendDownloadLink = async () => {
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrors({
        email: "Enter a valid email address to receive download link",
      });
      return;
    }

    setSending(true);

    const templateParams = {
      name: formData.name || "User",
      phone: formData.phone || "N/A",
      email: formData.email,
      message: "", // No message, just download
      download_url: window.location.href,
    };

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_USER_TEMPLATE_ID,
        templateParams,
        EMAILJS_USER_ID
      );

      showStatus("Download link sent to your email.", "success");
    } catch (error) {
      console.error("Download email error:", error);
      showStatus("Failed to send download link.", "error");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="help-widget">
      {!showForm ? (
        <button
          className="help-toggle-btn"
          onClick={() => setShowForm(true)}
          disabled={sending}
        >
          <FaQuestionCircle className="icon" />
          Need help?
        </button>
      ) : (
        <form
          className={`help-form-container ${shake ? "shake" : ""}`}
          onSubmit={sendEmail}
          noValidate
        >
          <div className="form-header">
            <h3 className="header-green">Need help?</h3>
            <button
              className="close-btn"
              type="button"
              onClick={() => {
                setShowForm(false);
                setStatusMsg("");
              }}
              disabled={sending}
            >
              &minus;
            </button>
          </div>

          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Enter your name *"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "input-error" : ""}
              disabled={sending}
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          <div className="form-group phone-input-wrapper">
            <div className="country-code-box">+91</div>
            <input
              type="tel"
              name="phone"
              placeholder="Mobile number *"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? "input-error" : ""}
              disabled={sending}
            />
          </div>
          {errors.phone && <p className="error-text">{errors.phone}</p>}

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Enter your Email *"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "input-error" : ""}
              disabled={sending}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div className="form-group">
            <textarea
              name="message"
              placeholder="Message *"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              className={errors.message ? "input-error" : ""}
              disabled={sending}
            ></textarea>
            {errors.message && <p className="error-text">{errors.message}</p>}
          </div>

          {statusMsg && (
            <div className={`status-msg ${statusType}`}>
              {statusType === "success" ? (
                <FaCheckCircle className="status-icon" />
              ) : (
                <FaTimesCircle className="status-icon" />
              )}
              {statusMsg}
            </div>
          )}

          <div className="help-form-actions">
            <button type="submit" className="submit-btn" disabled={sending}>
              Submit Ticket
            </button>
            <button
              type="button"
              className="download-btn"
              disabled={sending}
              onClick={sendDownloadLink}
            >
              Send Download Link
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default HelpFormWidget;
