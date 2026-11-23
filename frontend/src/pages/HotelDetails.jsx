
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import DeletePopup from "../components/DeletePopup";
import HotelMap from "../components/HotelMap";
import { Helmet } from "react-helmet-async";

function HotelDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const getHotelDetails = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/hotels/${id}`);
                setHotel(response.data.hotel);
                setError("");
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Unable to fetch hotel details"
                );
            } finally {
                setLoading(false);
            }
        };

        getHotelDetails();
    }, [id]);

    const handleDelete = async () => {
        setDeleting(true);
        setError("");

        try {
            await api.delete(`/hotels/${id}`);
            alert("Hotel deleted successfully!");
            navigate("/");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to delete hotel"
            );
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="professional-details">
                <div className="details-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading hotel details...</p>
                </div>
            </div>
        );
    }

    if (error && !hotel) {
        return (
            <div className="professional-details">
                <div className="details-message">
                    <h2>Unable to load hotel</h2>
                    <p>{error}</p>
                    <button onClick={() => navigate("/")}>
                        Back to Hotels
                    </button>
                </div>
            </div>
        );
    }

    if (!hotel) {
        return (
            <div className="professional-details">
                <div className="details-message">
                    <h2>Hotel not found</h2>
                    <button onClick={() => navigate("/")}>
                        Back to Hotels
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="professional-details">

            {/* SEO */}
            <Helmet>
                <title>{hotel.title} | NamlaTech Hotels</title>

                <meta
                    name="description"
                    content={`${hotel.title} - ${hotel.description}. Discover this property with NamlaTech Hotels.`}
                />

                <meta
                    name="keywords"
                    content={`${hotel.title}, hotels, accommodation, NamlaTech Hotels`}
                />

                <meta
                    property="og:title"
                    content={`${hotel.title} | NamlaTech Hotels`}
                />

                <meta
                    property="og:description"
                    content={hotel.description}
                />
            </Helmet>

            {/* Breadcrumb */}
            <div className="details-breadcrumb">
                <button onClick={() => navigate("/")}>
                    Hotels
                </button>
                <span>/</span>
                <span>Hotel Details</span>
            </div>

            {/* Action Buttons */}
            <div className="details-action-bar">

                <button
                    className="details-back-button"
                    onClick={() => navigate("/")}
                >
                    ← Back to Hotels
                </button>

                <div className="details-primary-actions">

                    <button
                        className="edit-hotel-button"
                        onClick={() => navigate(`/edit-hotel/${id}`)}
                    >
                        ✎ Edit Hotel
                    </button>

                    <button
                        className="delete-hotel-button"
                        onClick={() => setShowDeletePopup(true)}
                    >
                        Delete Hotel
                    </button>

                </div>
            </div>

            {error && <p className="error">{error}</p>}

            {/* Hotel Heading */}
            <div className="details-heading">
                <div>
                    <span className="details-label">
                        PROPERTY INFORMATION
                    </span>

                    <h1>{hotel.title}</h1>

                    <p>Explore property information and location</p>
                </div>
            </div>

            {/* Hotel Image */}
            <div className="details-image-container">
                <img
                    src={`http://localhost:5000${hotel.image}`}
                    alt={hotel.title}
                    className="professional-hotel-image"
                />

                <div className="image-overlay">
                    HOTEL PROPERTY
                </div>
            </div>

            {/* Main Content */}
            <div className="details-content-grid">

                {/* Property Information */}
                <div className="details-main-card">

                    <div className="details-section-heading">
                        <div>
                            <span>OVERVIEW</span>
                            <h2>About this property</h2>
                        </div>

                        <span className="property-status">
                            Property Details
                        </span>
                    </div>

                    <p className="hotel-description">
                        {hotel.description}
                    </p>

                    <div className="details-divider"></div>

                    <h3>Location Coordinates</h3>

                    <div className="coordinates-grid">

                        <div className="coordinate-box">
                            <span>LATITUDE</span>
                            <strong>{hotel.latitude}</strong>
                        </div>

                        <div className="coordinate-box">
                            <span>LONGITUDE</span>
                            <strong>{hotel.longitude}</strong>
                        </div>

                    </div>
                </div>

                {/* Price Card */}
                <div className="details-price-card">

                    <span className="price-card-label">
                        PRICE PER NIGHT
                    </span>

                    <h2>
                        ₹{Number(hotel.price).toLocaleString("en-IN")}
                    </h2>

                    <span className="price-subtitle">
                        Per night
                    </span>

                    <div className="price-divider"></div>

                    <p className="price-note">
                        Listed hotel property
                    </p>

                </div>

            </div>

            {/* Map */}
            <div className="details-map-card">

                <div className="details-section-heading">
                    <div>
                        <span>PROPERTY LOCATION</span>
                        <h2>Find on Map</h2>
                    </div>

                    <span className="map-location-icon">⌖</span>
                </div>

                <p className="map-description">
                    Explore the geographical location of {hotel.title}.
                </p>

                <HotelMap
                    latitude={hotel.latitude}
                    longitude={hotel.longitude}
                    hotelName={hotel.title}
                />

            </div>

            {/* Delete Popup */}
            {showDeletePopup && (
                <DeletePopup
                    onConfirm={handleDelete}
                    onCancel={() => setShowDeletePopup(false)}
                    loading={deleting}
                />
            )}

        </div>
    );
}

export default HotelDetails;
