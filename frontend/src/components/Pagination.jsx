
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { setCurrentPage } from "../features/hotels/hotelSlice";

function Pagination() {

    const dispatch = useDispatch();

    const {
        currentPage,
        limit,
        total
    } = useSelector((state) => state.hotels);

    const totalPages = Math.ceil(total / limit);

    if (totalPages <= 1) {
        return null;
    }

    const handlePrevious = () => {
        if (currentPage > 1) {
            dispatch(setCurrentPage(currentPage - 1));
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            dispatch(setCurrentPage(currentPage + 1));
        }
    };

    return (
        <div className="pagination">

            <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
            >
                Previous
            </button>

            <span>
                Page {currentPage} of {totalPages}
            </span>

            <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
            >
                Next
            </button>

        </div>
    );
}

export default Pagination;
