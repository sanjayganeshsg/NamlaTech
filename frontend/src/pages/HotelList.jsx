
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import { useDispatch, useSelector } from "react-redux";

import { fetchHotels } from "../features/hotels/hotelSlice";
import SearchFilter from "../components/SearchFilter";
import HotelCard from "../components/HotelCard";

function HotelList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        hotels,
        loading,
        error,
        search,
        minPrice,
        maxPrice,
        currentPage,
        limit
    } = useSelector((state) => state.hotels);

    useEffect(() => {
        const params = {
            limit: limit,
            offset: (currentPage - 1) * limit
        };

        if (search.trim()) {
            params.search = search.trim();
        }

        if (minPrice !== "") {
            params.minPrice = minPrice;
        }

        if (maxPrice !== "") {
            params.maxPrice = maxPrice;
        }

        dispatch(fetchHotels(params));

    }, [
        dispatch,
        search,
        minPrice,
        maxPrice,
        currentPage,
        limit
    ]);

    return (
        <div className="hotel-container">

            <div className="hotel-header">
                <div>
                    <h1>NamlaTech Hotels</h1>
                    <p>Discover hotels around you</p>
                </div>

                <button
                    className="add-hotel-button"
                    onClick={() => navigate("/add-hotel")}
                >
                    + Add New Hotel
                </button>
            </div>

            <SearchFilter />

            {loading && <h2>Loading hotels...</h2>}

            {error && <p className="error">{error}</p>}

            {!loading && !error && hotels.length === 0 && (
                <p>No hotels found.</p>
            )}

            {!loading && !error && hotels.length > 0 && (
                <div className="hotel-list">
                    {hotels.map((hotel) => (
                        <HotelCard
                            key={hotel.id}
                            hotel={hotel}
                        />
                    ))}
                </div>
            )}

            <Pagination />

        </div>
    );
}

export default HotelList;
