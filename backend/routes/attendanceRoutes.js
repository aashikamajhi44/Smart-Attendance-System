const express = require("express");
const router = express.Router();
const { recordAttendance, getAttendance } = require("../controllers/attendanceController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(protect, getAttendance).post(protect, recordAttendance);

module.exports = router;