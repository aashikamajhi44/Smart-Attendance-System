const express = require("express");
const router = express.Router();
const { saveFaceProfile, getAllFaceProfiles } = require("../controllers/faceController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getAllFaceProfiles);
router.post("/:studentId", protect, saveFaceProfile);

module.exports = router;