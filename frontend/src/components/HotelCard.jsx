
import React from "react";
import { useNavigate } from "react-router-dom";

function HotelCard({ hotel }) {
  const navigate = useNavigate();

  return (
    <div className="hotel-card">
      <img
        src={`http://localhost:5000${hotel.image}`}
        alt={hotel.title}
        className="hotel-card-image"
      />

      <div className="hotel-card-content">
        <h2>{hotel.title}</h2>

        <p>{hotel.description}</p>

        <h3>₹{hotel.price} / night</h3>

        <button onClick={() => navigate(`/hotel/${hotel.id}`)}>
          View Details
        </button>
      </div>
    </div>
  );
}

export default HotelCard;
