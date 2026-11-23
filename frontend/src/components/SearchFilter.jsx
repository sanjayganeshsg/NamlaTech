
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    setSearch,
    setPriceRange
} from "../features/hotels/hotelSlice";

function SearchFilter() {

    const dispatch = useDispatch();

    const {
        search,
        minPrice,
        maxPrice
    } = useSelector((state) => state.hotels);

    return (
    <div className="search-filter">

        

        <input
            type="text"
            placeholder="Search hotels by title..."
            value={search}
            onChange={(e) =>
                dispatch(setSearch(e.target.value))
            }
        />

        <input
            type="number"
            placeholder="Minimum price"
            value={minPrice}
            onChange={(e) =>
                dispatch(setPriceRange({
                    minPrice: e.target.value,
                    maxPrice
                }))
            }
        />

        <input
            type="number"
            placeholder="Maximum price"
            value={maxPrice}
            onChange={(e) =>
                dispatch(setPriceRange({
                    minPrice,
                    maxPrice: e.target.value
                }))
            }
        />

    </div>
);
}

export default SearchFilter;
