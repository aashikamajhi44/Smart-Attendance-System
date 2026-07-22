const FaceProfile = require("../models/FaceProfile");
const Student = require("../models/Student");
const { encryptDescriptor, decryptDescriptor } = require("../utils/encryptDescriptor");

// @desc    Save a student's face descriptor (enrollment)
// @route   POST /api/face-profiles/:studentId
const saveFaceProfile = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { descriptor } = req.body;

    if (!descriptor || !Array.isArray(descriptor)) {
      return res.status(400).json({ message: "A valid descriptor array is required" });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const encryptedDescriptor = encryptDescriptor(descriptor);

    let faceProfile = await FaceProfile.findOne({ student: studentId });
    if (faceProfile) {
      faceProfile.encryptedDescriptor = encryptedDescriptor;
      faceProfile.capturedAt = new Date();
      await faceProfile.save();
    } else {
      faceProfile = await FaceProfile.create({
        student: studentId,
        encryptedDescriptor,
      });
    }

    student.isFaceRegistered = true;
    await student.save();

    res.status(201).json({ message: "Face profile saved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all face profiles with decrypted descriptors (for client-side matching)
// @route   GET /api/face-profiles
const getAllFaceProfiles = async (req, res) => {
  try {
    const profiles = await FaceProfile.find().populate(
      "student",
      "name studentId department"
    );

    const decrypted = profiles.map((p) => ({
      studentId: p.student?._id,
      name: p.student?.name,
      studentCode: p.student?.studentId,
      department: p.student?.department,
      descriptor: decryptDescriptor(p.encryptedDescriptor),
    }));

    res.json(decrypted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { saveFaceProfile, getAllFaceProfiles };

