const Attendance = require("../models/Attendance");
const { markAttendance, formatDate } = require("../services/attendanceService");

// @desc    Mark attendance for a student (called after successful face match)
// @route   POST /api/attendance
const recordAttendance = async (req, res) => {
  try {
    const { studentId, confidenceScore } = req.body;

    if (!studentId) {
      return res.status(400).json({ message: "studentId is required" });
    }

    const { alreadyMarked, record } = await markAttendance(studentId, confidenceScore);

    if (alreadyMarked) {
      return res.status(200).json({ message: "Attendance already marked for today" });
    }

    res.status(201).json({ message: "Attendance marked successfully", record });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get attendance records (optionally filter by date or student)
// @route   GET /api/attendance
const getAttendance = async (req, res) => {
  try {
    const { date, studentId } = req.query;
    const filter = {};
    if (date) filter.date = date;
    if (studentId) filter.student = studentId;

    const records = await Attendance.find(filter)
      .populate("student", "name studentId department")
      .sort({ createdAt: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { recordAttendance, getAttendance };