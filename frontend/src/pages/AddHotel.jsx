
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import HotelForm from "../components/HotelForm";

function AddHotel() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
const handleAddHotel = async (data) => {
    console.log("IS FORMDATA:", data instanceof FormData);
    console.log("FORMDATA CONTENTS:", [...data.entries()]);

    setLoading(true);
    setError("");

    try {
        await api.post("/hotels", data, {
    headers: {
        "Content-Type": "multipart/form-data"
    }
});
        alert("Hotel added successfully!");
        navigate("/");
    } catch (err) {
        setError(
            err.response?.data?.message || "Failed to add hotel"
        );
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="hotel-details">

            <h1>Add New Hotel</h1>

            {error && <p className="error">{error}</p>}

            <HotelForm
                initialData={{}}
                onSubmit={handleAddHotel}
                submitText="Add Hotel"
                loading={loading}
            />

            <button
                type="button"
                onClick={() => navigate("/")}
                disabled={loading}
            >
                Cancel
            </button>

        </div>
    );
}

export default AddHotel;
