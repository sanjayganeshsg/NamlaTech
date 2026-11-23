
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

function HotelMap({ latitude, longitude, hotelName }) {
    const lat = Number(latitude);
    const lng = Number(longitude);

    if (!Number.isFinite(lat) || !Number.isFinite(lng) ||
        lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        return <p>Invalid hotel location coordinates.</p>;
    }

    return (
        <div className="hotel-map">
            <h2>Hotel Location</h2>

            <MapContainer
                center={[lat, lng]}
                zoom={15}
                style={{ height: "350px", width: "100%" }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker position={[lat, lng]}>
                    <Popup>{hotelName}</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}

export default HotelMap;
