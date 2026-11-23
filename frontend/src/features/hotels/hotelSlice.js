
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Fetch hotels from backend
export const fetchHotels = createAsyncThunk(
    "hotels/fetchHotels",
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await api.get("/hotels", {
                params
            });

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch hotels"
            );
        }
    }
);

// Initial state
const initialState = {
    hotels: [],
    loading: false,
    error: null,
    search: "",
    minPrice: "",
    maxPrice: "",
    currentPage: 1,
    limit: 6,
    total: 0
};

// Hotel slice
const hotelSlice = createSlice({
    name: "hotels",
    initialState,

    reducers: {
        setHotels: (state, action) => {
            state.hotels = action.payload.hotels;
            state.total = action.payload.total;
        },

        setLoading: (state, action) => {
            state.loading = action.payload;
        },

        setError: (state, action) => {
            state.error = action.payload;
        },

        setSearch: (state, action) => {
            state.search = action.payload;
            state.currentPage = 1;
        },

        setPriceRange: (state, action) => {
            state.minPrice = action.payload.minPrice;
            state.maxPrice = action.payload.maxPrice;
            state.currentPage = 1;
        },

        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        }
    },

    // Handle API requests
    extraReducers: (builder) => {
        builder
            .addCase(fetchHotels.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchHotels.fulfilled, (state, action) => {
                state.loading = false;
                state.hotels = action.payload.hotels || [];
                state.total = action.payload.total || 0;
            })

            .addCase(fetchHotels.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const {
    setHotels,
    setLoading,
    setError,
    setSearch,
    setPriceRange,
    setCurrentPage
} = hotelSlice.actions;

export default hotelSlice.reducer;
