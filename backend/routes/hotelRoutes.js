
const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
    createHotel,
    getHotels,
    getHotelById,
    updateHotel,
    deleteHotel
} = require("../controllers/hotelController");

router.post("/", upload.single("image"), createHotel);

router.get("/", getHotels);

router.get("/:id", getHotelById);

router.put("/:id", upload.single("image"), updateHotel);

router.delete("/:id", deleteHotel);
module.exports = router;
