
import React from "react";

function DeletePopup({ onConfirm, onCancel, loading }) {
    return (
        <div className="delete-popup-overlay">

            <div className="delete-popup">

                <h2>Delete Hotel?</h2>

                <p>
                    Are you sure you want to delete this hotel?
                    This action cannot be undone.
                </p>

                <div className="delete-popup-buttons">

                    <button
                        className="cancel-delete"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                        className="confirm-delete"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? "Deleting..." : "Yes, Delete"}
                    </button>

                </div>

            </div>

        </div>
    );
}

export default DeletePopup;
