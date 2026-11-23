
const pool = require("../config/db");
const fs = require("fs");
const path = require("path");
// CREATE HOTEL
const createHotel = async (req, res) => {
    try {
        console.log("CREATE HOTEL API CALLED");
console.log("REQUEST BODY:", req.body);
console.log("UPLOADED FILE:", req.file);
        const {
            title,
            description,
            latitude,
            longitude,
            price
        } = req.body;

        // Validate required fields
        if (
            !title?.trim() ||
            !description?.trim() ||
            latitude === undefined ||
            longitude === undefined ||
            price === undefined
        ) {
            return res.status(400).json({
                message: "All fields are required."
            });
        }

        // Validate image
        if (!req.file) {
            return res.status(400).json({
                message: "Hotel image is required."
            });
        }

        const lat = Number(latitude);
        const lng = Number(longitude);
        const hotelPrice = Number(price);

        // Validate latitude
        if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
            return res.status(400).json({
                message: "Invalid latitude."
            });
        }

        // Validate longitude
        if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
            return res.status(400).json({
                message: "Invalid longitude."
            });
        }

        // Validate price
        if (!Number.isFinite(hotelPrice) || hotelPrice <= 0) {
            return res.status(400).json({
                message: "Price must be greater than zero."
            });
        }

        const imagePath = `/uploads/${req.file.filename}`;

        // PostgreSQL native SQL query
        const query = `
            INSERT INTO hotels
            (image, title, description, latitude, longitude, price)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;

        const values = [
            imagePath,
            title.trim(),
            description.trim(),
            lat,
            lng,
            hotelPrice
        ];

        const result = await pool.query(query, values);

        return res.status(201).json({
            message: "Hotel created successfully!",
            hotel: result.rows[0]
        });

    } catch (error) {
        console.error("Create hotel error:", error);

        return res.status(500).json({
            message: "Failed to create hotel.",
            error: error.message
        });
    }
};

const getHotels = async (req, res) => {
    try {
        const {
            search = "",
            minPrice,
            maxPrice,
            limit = 10,
            offset = 0
        } = req.query;

        const pageLimit = Math.min(
            Math.max(parseInt(limit, 10) || 10, 1),
            100
        );

        const pageOffset = Math.max(
            parseInt(offset, 10) || 0,
            0
        );

        let conditions = [];
        let values = [];

        if (search.trim()) {
            values.push(`%${search.trim()}%`);
            conditions.push(`title ILIKE $${values.length}`);
        }

        if (minPrice !== undefined && minPrice !== "") {
            const min = Number(minPrice);

            if (!Number.isFinite(min) || min < 0) {
                return res.status(400).json({
                    message: "Invalid minimum price"
                });
            }

            values.push(min);
            conditions.push(`price >= $${values.length}`);
        }

        if (maxPrice !== undefined && maxPrice !== "") {
            const max = Number(maxPrice);

            if (!Number.isFinite(max) || max < 0) {
                return res.status(400).json({
                    message: "Invalid maximum price"
                });
            }

            values.push(max);
            conditions.push(`price <= $${values.length}`);
        }

        if (
            minPrice !== undefined &&
            maxPrice !== undefined &&
            minPrice !== "" &&
            maxPrice !== "" &&
            Number(minPrice) > Number(maxPrice)
        ) {
            return res.status(400).json({
                message: "Minimum price cannot exceed maximum price"
            });
        }

        const whereClause = conditions.length
            ? `WHERE ${conditions.join(" AND ")}`
            : "";

        const countQuery = `
            SELECT COUNT(*) FROM hotels ${whereClause}
        `;

        const countResult = await pool.query(
            countQuery,
            values
        );

        const total = Number(countResult.rows[0].count);

        const dataQuery = `
            SELECT * FROM hotels
            ${whereClause}
            ORDER BY id ASC
            LIMIT $${values.length + 1}
            OFFSET $${values.length + 2}
        `;

        const result = await pool.query(dataQuery, [
            ...values,
            pageLimit,
            pageOffset
        ]);

        res.status(200).json({
            message: "Hotels fetched successfully!",
            total,
            limit: pageLimit,
            offset: pageOffset,
            hotels: result.rows
        });

    } catch (error) {
        console.error("Get hotels error:", error);

        res.status(500).json({
            message: "Failed to fetch hotels."
        });
    }
};

const updateHotel = async (req, res) => {
    let newImagePath = null;

    try {
        const { id } = req.params;

        const {
            title,
            description,
            latitude,
            longitude,
            price
        } = req.body;

        // Validate hotel ID
        if (!/^[1-9]\d*$/.test(id)) {
            return res.status(400).json({
                message: "Invalid hotel ID."
            });
        }

        // Check whether hotel exists
        const existingHotel = await pool.query(
            "SELECT * FROM hotels WHERE id = $1",
            [id]
        );

        if (existingHotel.rows.length === 0) {
            return res.status(404).json({
                message: "Hotel not found."
            });
        }

        const oldHotel = existingHotel.rows[0];

        // Build dynamic update query
        const fields = [];
        const values = [];

        const addField = (column, value) => {
            values.push(value);
            fields.push(`${column} = $${values.length}`);
        };

        if (title !== undefined) {
            if (!title.trim()) {
                return res.status(400).json({
                    message: "Title cannot be empty."
                });
            }
            addField("title", title.trim());
        }

        if (description !== undefined) {
            if (!description.trim()) {
                return res.status(400).json({
                    message: "Description cannot be empty."
                });
            }
            addField("description", description.trim());
        }

        if (latitude !== undefined) {
            const lat = Number(latitude);

            if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
                return res.status(400).json({
                    message: "Invalid latitude."
                });
            }
            addField("latitude", lat);
        }

        if (longitude !== undefined) {
            const lng = Number(longitude);

            if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
                return res.status(400).json({
                    message: "Invalid longitude."
                });
            }
            addField("longitude", lng);
        }

        if (price !== undefined) {
            const hotelPrice = Number(price);

            if (!Number.isFinite(hotelPrice) || hotelPrice <= 0) {
                return res.status(400).json({
                    message: "Price must be greater than zero."
                });
            }
            addField("price", hotelPrice);
        }

        // Optional image replacement
        if (req.file) {
            newImagePath = `/uploads/${req.file.filename}`;
            addField("image", newImagePath);
        }

        if (fields.length === 0) {
            return res.status(400).json({
                message: "No fields provided for update."
            });
        }

        values.push(id);

        const query = `
            UPDATE hotels
            SET ${fields.join(", ")}
            WHERE id = $${values.length}
            RETURNING *
        `;

        const result = await pool.query(query, values);

        // Delete old image after successful database update
        if (req.file && oldHotel.image) {
            const oldFilename = path.basename(oldHotel.image);
            const oldImagePath = path.join(
                __dirname,
                "..",
                "uploads",
                oldFilename
            );

            try {
                await fs.promises.unlink(oldImagePath);
            } catch (fileError) {
                if (fileError.code !== "ENOENT") {
                    console.error(
                        "Old image cleanup failed:",
                        fileError.message
                    );
                }
            }
        }

        res.status(200).json({
            message: "Hotel updated successfully!",
            hotel: result.rows[0]
        });

    } catch (error) {
        console.error("Update hotel error:", error);

        // Clean up newly uploaded image if update failed
        if (req.file) {
            const uploadedPath = path.join(
                __dirname,
                "..",
                "uploads",
                path.basename(req.file.filename)
            );

            try {
                await fs.promises.unlink(uploadedPath);
            } catch (cleanupError) {
                console.error("Image cleanup failed:", cleanupError.message);
            }
        }

        res.status(500).json({
            message: "Failed to update hotel.",
            error: error.message
        });
    }
};

const deleteHotel = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate hotel ID
        if (!/^[1-9]\d*$/.test(id)) {
            return res.status(400).json({
                message: "Invalid hotel ID."
            });
        }

        // Check whether hotel exists
        const existingHotel = await pool.query(
            "SELECT * FROM hotels WHERE id = $1",
            [id]
        );

        if (existingHotel.rows.length === 0) {
            return res.status(404).json({
                message: "Hotel not found."
            });
        }

        const hotel = existingHotel.rows[0];

        // Delete hotel from PostgreSQL
        await pool.query(
            "DELETE FROM hotels WHERE id = $1",
            [id]
        );

        // Delete associated image
        if (hotel.image) {
            const filename = path.basename(hotel.image);

            const imagePath = path.join(
                __dirname,
                "..",
                "uploads",
                filename
            );

            try {
                await fs.promises.unlink(imagePath);
            } catch (fileError) {
                if (fileError.code !== "ENOENT") {
                    console.error(
                        "Image deletion error:",
                        fileError.message
                    );
                }
            }
        }

        return res.status(200).json({
            message: "Hotel deleted successfully!",
            deletedHotel: hotel
        });

    } catch (error) {
        console.error("Delete hotel error:", error);

        return res.status(500).json({
            message: "Failed to delete hotel.",
            error: error.message
        });
    }
};

const getHotelById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^[1-9]\d*$/.test(id)) {
            return res.status(400).json({
                message: "Invalid hotel ID."
            });
        }

        const result = await pool.query(
            "SELECT * FROM hotels WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Hotel not found."
            });
        }

        res.status(200).json({
            message: "Hotel fetched successfully!",
            hotel: result.rows[0]
        });

    } catch (error) {
        console.error("Get hotel error:", error);

        res.status(500).json({
            message: "Failed to fetch hotel."
        });
    }
};


module.exports = {
    createHotel,
    getHotels,
    updateHotel,
    deleteHotel,
    getHotelById
};
