
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HotelList from "./pages/HotelList";
import HotelDetails from "./pages/HotelDetails";
import EditHotel from "./pages/EditHotel";
import AddHotel from "./pages/AddHotel";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HotelList />} />
                <Route path="/hotel/:id" element={<HotelDetails />} />
                <Route path="/edit-hotel/:id" element={<EditHotel />} />
                <Route path="/add-hotel" element={<AddHotel />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
