
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import HotelForm from "../components/HotelForm";

function EditHotel() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // Fetch existing hotel details
    useEffect(() => {
        const fetchHotel = async () => {
            try {
                const response = await api.get(`/hotels/${id}`);
                setHotel(response.data.hotel);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Unable to fetch hotel details"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchHotel();
    }, [id]);

    // Update hotel
    const handleUpdate = async (data) => {
        setSaving(true);
        setError("");

        try {
            await api.put(`/hotels/${id}`, data);

            alert("Hotel updated successfully!");

            navigate(`/hotel/${id}`);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to update hotel"
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <h2>Loading hotel details...</h2>;
    }

    if (error && !hotel) {
        return <p className="error">{error}</p>;
    }

    if (!hotel) {
        return <h2>Hotel not found</h2>;
    }

    return (
        <div className="hotel-details">

            <h1>Edit Hotel</h1>

            {error && <p className="error">{error}</p>}

            <HotelForm
                initialData={hotel}
                onSubmit={handleUpdate}
                submitText="Update Hotel"
                loading={saving}
            />

            <button
                type="button"
                onClick={() => navigate(`/hotel/${id}`)}
                disabled={saving}
            >
                Cancel
            </button>

        </div>
    );
}

export default EditHotel;
