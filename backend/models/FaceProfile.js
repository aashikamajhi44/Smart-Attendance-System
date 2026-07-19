const mongoose = require("mongoose");

const faceProfileSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      unique: true, // one face profile per student
    },
    imagePath: {
      type: String,
      default: "",
    },
    encryptedDescriptor: {
      type: String, // AES-256 encrypted JSON string of the 128-d descriptor array
      required: true,
    },
    capturedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FaceProfile", faceProfileSchema);