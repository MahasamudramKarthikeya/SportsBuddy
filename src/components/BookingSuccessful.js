// BookingSuccessful.js
import { useNavigate } from "react-router";
import "../styles/BookingSuccessful.css";

const BookingSuccessful = () => {
  const navigate = useNavigate();

  return (
    <div className="booking-success-wrapper">
      <h1>✅ Booking Successful!</h1>
      <p>
        Thank you for booking with us. We look forward to seeing you at the
        venue.
      </p>
      <button onClick={() => navigate("/")} className="back-home-button">
        ← Back to Home
      </button>
    </div>
  );
};

export default BookingSuccessful;
