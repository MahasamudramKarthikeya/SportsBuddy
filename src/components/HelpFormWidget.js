import React, { useState } from "react";
import "../styles/HelpFormWidget.css"; // Ensure you have the CSS file for styling

const HelpFormWidget = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    try {
      const resp = await fetch(`${API_BASE_URL}/api/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template_params: formData }),
      });
      if (resp.ok) {
        alert("✅ Message sent! Confirmation email has been sent.");
        setShowForm(false);
        setFormData({ name: "", phone: "", email: "", message: "" });
      } else {
        const err = await resp.json().catch(() => ({}));
        console.error("Email send failed:", err);
        alert("❌ Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Email send error:", error);
      alert("❌ Failed to send message. Please try again.");
    }
  };

  return (
    <div className="help-widget">
      {!showForm ? (
        <button className="help-toggle-btn" onClick={() => setShowForm(true)}>
          Need Help?
        </button>
      ) : (
        <form className="help-form-container" onSubmit={sendEmail}>
          <h3>Raise a Ticket</h3>
          <input
            type="text"
            name="name"
            placeholder="Enter your name *"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="+91 Mobile number *"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Enter your Email *"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Message *"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
          <div className="help-form-actions">
            <button type="submit" className="submit-btn">
              Submit Ticket
            </button>
            <button type="button" className="download-btn">
              Send Download Link
            </button>
          </div>
          <button className="close-btn" onClick={() => setShowForm(false)}>
            ✕
          </button>
        </form>
      )}
    </div>
  );
};

export default HelpFormWidget;
