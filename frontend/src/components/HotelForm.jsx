
import React, { useEffect, useState } from "react";

function HotelForm({
    initialData = {},
    onSubmit,
    submitText = "Save Hotel",
    loading = false
}) {
    const [formData, setFormData] = useState({
        title: initialData.title || "",
        description: initialData.description || "",
        latitude: initialData.latitude ?? "",
        longitude: initialData.longitude ?? "",
        price: initialData.price ?? ""
    });

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(
        initialData.image
            ? `http://localhost:5000${initialData.image}`
            : ""
    );

    const [error, setError] = useState("");

    useEffect(() => {
        if (image) {
            const imageUrl = URL.createObjectURL(image);
            setPreview(imageUrl);

            return () => URL.revokeObjectURL(imageUrl);
        }
    }, [image]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];

        if (!selectedImage) return;

        if (!selectedImage.type.startsWith("image/")) {
            setError("Please select a valid image.");
            return;
        }

        setError("");
        setImage(selectedImage);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        const latitude = Number(formData.latitude);
        const longitude = Number(formData.longitude);
        const price = Number(formData.price);

        if (!formData.title.trim() || !formData.description.trim()) {
            setError("Title and description are required.");
            return;
        }

        if (
            formData.latitude === "" ||
            !Number.isFinite(latitude) ||
            latitude < -90 ||
            latitude > 90
        ) {
            setError("Enter a valid latitude between -90 and 90.");
            return;
        }

        if (
            formData.longitude === "" ||
            !Number.isFinite(longitude) ||
            longitude < -180 ||
            longitude > 180
        ) {
            setError("Enter a valid longitude between -180 and 180.");
            return;
        }

        if (
            formData.price === "" ||
            !Number.isFinite(price) ||
            price <= 0
        ) {
            setError("Price must be greater than zero.");
            return;
        }

        if (!initialData.id && !image) {
            setError("Please upload a hotel image.");
            return;
        }

        const data = new FormData();

Object.entries(formData).forEach(([key, value]) => {
    data.append(key, value);
});

if (image) {
    data.append("image", image);
}

console.log("SELECTED IMAGE:", image);
console.log("FORM DATA ENTRIES:", [...data.entries()]);

onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit} className="hotel-form">

            {error && <p className="error">{error}</p>}

            <label>Hotel Name</label>
            <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter hotel name"
                required
            />

            <label>Description</label>
            <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter hotel description"
                required
            />

            <label>Latitude</label>
            <input
                type="number"
                step="any"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                placeholder="Enter latitude"
                required
            />

            <label>Longitude</label>
            <input
                type="number"
                step="any"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="Enter longitude"
                required
            />

            <label>Price per night (₹)</label>
            <input
                type="number"
                min="0.01"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
                required
            />

            <label>Hotel Image</label>
            <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                required={!initialData.id}
            />

            {preview && (
                <div className="image-preview">
                    <p>Image Preview</p>
                    <img
                        src={preview}
                        alt="Hotel preview"
                    />
                </div>
            )}

            <button type="submit" disabled={loading}>
                {loading ? "Saving..." : submitText}
            </button>

        </form>
    );
}

export default HotelForm;
