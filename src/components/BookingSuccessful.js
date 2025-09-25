import { useNavigate } from "react-router";
import { FaCheckCircle, FaArrowLeft } from "react-icons/fa";
import "../styles/BookingSuccessful.css";

const BookingSuccessful = () => {
  const navigate = useNavigate();

  return (
    <div className="booking-success-wrapper">
      <FaCheckCircle className="success-icon" />
      <h1>Booking Successful!</h1>
      <p>
        Thank you for booking with us. We look forward to seeing you at the
        venue.
      </p>
      <button onClick={() => navigate("/")} className="back-home-button">
        <FaArrowLeft className="arrow-icon" /> Back to Home
      </button>
    </div>
  );
};

export default BookingSuccessful;
