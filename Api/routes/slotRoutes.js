const express = require("express");
const router = express.Router();
const slotController = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware"); 

router.get("/availability", protect, slotController.getSlotsAvailability);

router.post("/book", protect, slotController.bookSlot);

module.exports = router;
